"""
Diffraction MAP-Elites Adversarial Failure Frontier Search Engine.
Replaces naive uniform domain randomization with a Quality-Diversity (QD)
evolutionary search over a multi-dimensional behavioral archive:
    [Surface Friction μ × Specular Glare G × Actuator Latency τ × Payload Mass Δm]

Hunts for the razor-thin Pareto Failure Frontier (the "failure cliff") where
robot autonomy policies plunge from safe nominal operation into catastrophic failure.
"""

from dataclasses import dataclass, field
import math
import random
import time
from typing import Any, Callable, Dict, List, Optional, Set, Tuple

import numpy as np

from cosmos_engine.domain_randomizer import ScenarioPerturbation
from cosmos_engine.cosmos_client import CosmosGenerationResult
from simulation_harness.isaac_runner import IsaacSimulationHarness, SimulationRunOutcome


@dataclass
class EliteIndividual:
    """Represents a scenario occupant in the MAP-Elites archive."""
    perturbation: ScenarioPerturbation
    behavior_coords: Tuple[int, int, int, int]  # (bin_mu, bin_glare, bin_latency, bin_mass)
    behavior_values: Tuple[float, float, float, float]
    outcome: SimulationRunOutcome
    fitness: float
    is_boundary_cliff: bool
    iteration_discovered: int


@dataclass
class FrontierBoundaryPoint:
    """A point along the Pareto Failure Frontier separating safe from unsafe operation."""
    friction_mu: float
    glare_severity: float
    sensor_latency_ms: float
    mass_offset_kg: float
    failure_cause: Optional[str]
    passing_clearance_m: float
    failing_clearance_m: float
    cliff_sensitivity_score: float


@dataclass
class MapElitesSearchResult:
    """Complete diagnostic output of the MAP-Elites search."""
    total_evaluations: int
    archive_coverage_cells: int
    total_archive_capacity: int
    coverage_ratio: float
    total_failures_discovered: int
    unique_failure_niches: int
    failure_frontier_points: List[FrontierBoundaryPoint]
    safe_operational_envelope: Dict[str, Tuple[float, float]]
    failure_cause_breakdown: Dict[str, int]
    search_duration_seconds: float
    parameter_sensitivity_ranking: List[Tuple[str, float]]
    archive_occupants: List[EliteIndividual] = field(default_factory=list)


class BehavioralArchive:
    """
    N-Dimensional Discretized Grid Archive of Phenotypic Elites.
    Bins continuous physical parameters into distinct environmental niches.
    """

    def __init__(
        self,
        mu_bins: int = 12,        # [0.08, 1.00]
        glare_bins: int = 10,     # [0.0, 1.0]
        latency_bins: int = 10,   # [10.0, 200.0] ms
        mass_bins: int = 6,       # [-15.0, 45.0] kg
    ):
        self.mu_bins = mu_bins
        self.glare_bins = glare_bins
        self.latency_bins = latency_bins
        self.mass_bins = mass_bins

        # Physical parameter ranges
        self.mu_range = (0.08, 1.00)
        self.glare_range = (0.0, 1.0)
        self.latency_range = (10.0, 200.0)
        self.mass_range = (-15.0, 45.0)

        self.total_cells = mu_bins * glare_bins * latency_bins * mass_bins
        self.grid: Dict[Tuple[int, int, int, int], EliteIndividual] = {}

    def get_cell_coordinates(
        self,
        mu: float,
        glare: float,
        latency_ms: float,
        mass_offset: float,
    ) -> Tuple[int, int, int, int]:
        """Discretizes continuous parameters into multi-dimensional bin indices."""
        def discretize(val: float, bounds: Tuple[float, float], n_bins: int) -> int:
            norm = (val - bounds[0]) / (bounds[1] - bounds[0] + 1e-9)
            idx = int(norm * n_bins)
            return max(0, min(n_bins - 1, idx))

        return (
            discretize(mu, self.mu_range, self.mu_bins),
            discretize(glare, self.glare_range, self.glare_bins),
            discretize(latency_ms, self.latency_range, self.latency_bins),
            discretize(mass_offset, self.mass_range, self.mass_bins),
        )

    def add_or_update(self, elite: EliteIndividual) -> bool:
        """
        Attempts to insert the candidate into the archive cell.
        Returns True if newly occupied or candidate had strictly higher fitness.
        """
        coords = elite.behavior_coords
        if coords not in self.grid:
            self.grid[coords] = elite
            return True
        elif elite.fitness > self.grid[coords].fitness:
            self.grid[coords] = elite
            return True
        return False

    def sample_elite(self, rng: random.Random) -> EliteIndividual:
        """Samples a random elite individual from the populated archive."""
        return rng.choice(list(self.grid.values()))

    def get_occupants(self) -> List[EliteIndividual]:
        return list(self.grid.values())


class MapElitesAdversarialSearch:
    """
    Quality-Diversity MAP-Elites Evolutionary Algorithm.
    Searches the space of environmental perturbations to uncover the failure boundary
    of a target robot policy under evaluation.
    """

    def __init__(
        self,
        sim_harness: Optional[IsaacSimulationHarness] = None,
        mu_bins: int = 10,
        glare_bins: int = 10,
        latency_bins: int = 10,
        mass_bins: int = 5,
        nominal_friction: float = 0.65,
        nominal_glare: float = 0.10,
        nominal_latency_ms: float = 40.0,
        seed: int = 42,
    ):
        self.sim_harness = sim_harness or IsaacSimulationHarness()
        self.archive = BehavioralArchive(
            mu_bins=mu_bins,
            glare_bins=glare_bins,
            latency_bins=latency_bins,
            mass_bins=mass_bins,
        )
        self.nominal_p = (nominal_friction, nominal_glare, nominal_latency_ms, 0.0)
        self.rng = random.Random(seed)
        np.random.seed(seed)

    def compute_boundary_fitness(
        self,
        perturbation: ScenarioPerturbation,
        outcome: SimulationRunOutcome,
    ) -> Tuple[float, bool]:
        """
        Adversarial Failure Fitness:
        Rewards minimal perturbations that trigger catastrophic safety failures (brittleness).
        Also rewards high-precision near-miss boundary states where clearance is critically tight.
        """
        # Distance from nominal benign operating baseline [0..1 normalized]
        p_vec = np.array([
            (perturbation.friction_coefficient - 0.08) / 0.92,
            perturbation.glare_severity,
            (perturbation.sensor_latency_ms - 10.0) / 190.0,
            (perturbation.mass_offset_kg + 15.0) / 60.0,
        ])
        nom_vec = np.array([
            (self.nominal_p[0] - 0.08) / 0.92,
            self.nominal_p[1],
            (self.nominal_p[2] - 10.0) / 190.0,
            (self.nominal_p[3] + 15.0) / 60.0,
        ])
        dist_from_nominal = float(np.linalg.norm(p_vec - nom_vec))

        is_cliff = False

        if not outcome.passed:
            # FAILURE STATE:
            # High reward for failing CLOSE to nominal conditions (reveals dangerous brittleness!)
            # Plus reward for severity (collision over mere boundary tracking error)
            severity_bonus = 50.0 if outcome.collision_occurred else 20.0
            brittleness_score = max(0.0, 100.0 * (1.0 - (dist_from_nominal / 2.0)))
            fitness = 100.0 + severity_bonus + brittleness_score
            is_cliff = dist_from_nominal < 0.75  # Near nominal failure = high-priority cliff
        else:
            # PASSING STATE:
            # Near-misses (clearance close to 0.25m threshold) get high fitness because
            # they are on the knife-edge of failure!
            clearance = outcome.minimum_obstacle_clearance_m
            margin = clearance - 0.25
            if margin <= 0.20:
                # Near-miss boundary state
                fitness = 50.0 + (1.0 / (margin + 0.05))
                is_cliff = True
            else:
                # Comfortable pass: lower fitness, but still useful for archive diversity
                fitness = max(1.0, 20.0 - clearance)

        return float(fitness), is_cliff

    def evaluate_scenario(
        self,
        perturbation: ScenarioPerturbation,
        iteration: int,
    ) -> EliteIndividual:
        """Executes simulation on the perturbation and constructs an Elite record."""
        # Convert perturbation into counterfactual trajectory for simulation harness
        cosmos_res = CosmosGenerationResult(
            scenario_id=perturbation.scenario_id,
            friction_coefficient=perturbation.friction_coefficient,
            surface_condition=perturbation.surface_condition,
            lighting_lux=perturbation.lighting_lux,
            glare_severity=perturbation.glare_severity,
            sensor_latency_ms=perturbation.sensor_latency_ms,
            synthetic_frame_count=60,
            latent_world_tokens=[
                perturbation.friction_coefficient,
                perturbation.lighting_lux / 100000.0,
                perturbation.glare_severity,
                perturbation.sensor_latency_ms / 150.0,
            ],
            counterfactual_trajectory=self._generate_trajectory_rollout(perturbation),
            visual_conditioning_path=f"storage/cosmos_{perturbation.scenario_id}.jpg",
        )

        outcome = self.sim_harness.execute_single_env(cosmos_res)
        fitness, is_cliff = self.compute_boundary_fitness(perturbation, outcome)

        coords = self.archive.get_cell_coordinates(
            perturbation.friction_coefficient,
            perturbation.glare_severity,
            perturbation.sensor_latency_ms,
            perturbation.mass_offset_kg,
        )

        return EliteIndividual(
            perturbation=perturbation,
            behavior_coords=coords,
            behavior_values=(
                perturbation.friction_coefficient,
                perturbation.glare_severity,
                perturbation.sensor_latency_ms,
                perturbation.mass_offset_kg,
            ),
            outcome=outcome,
            fitness=fitness,
            is_boundary_cliff=is_cliff,
            iteration_discovered=iteration,
        )

    def _generate_trajectory_rollout(
        self,
        p: ScenarioPerturbation,
    ) -> List[Dict[str, float]]:
        """Simulates vehicle kinematic trajectory with slip dynamics and actuator lag."""
        trajectory = []
        nom_speed = 0.8
        timesteps = 40
        dt = 0.05

        curr_x, curr_y = 0.0, 0.0
        v = nom_speed
        tau_s = p.sensor_latency_ms / 1000.0

        # Effective friction slip displacement
        slip_factor = max(0.0, (0.60 - p.friction_coefficient) * 1.8)

        for step in range(timesteps):
            t = step * dt
            # At t=1.0s (step 20), brake command issued to stop before obstacle at x=3.0m
            if t >= 1.0:
                # Deceleration capped by mu * g, delayed by actuator latency
                delayed_t = max(0.0, t - 1.0 - tau_s)
                decel_rate = min(3.5, p.friction_coefficient * 9.80665)
                v = max(0.0, nom_speed - decel_rate * delayed_t)

            curr_x += v * dt
            # Glare and low friction produce lateral tracking yaw drift
            glare_drift = (p.glare_severity ** 2) * 0.15 * math.sin(t * 2.0)
            slip_drift = slip_factor * 0.12 * math.cos(t * 1.5)
            curr_y += (glare_drift + slip_drift) * dt

            trajectory.append({
                "t": round(t, 3),
                "x": round(curr_x, 3),
                "y": round(curr_y, 3),
                "nominal_x": round(t * nom_speed if t < 1.0 else 0.8 + 0.5 * (t - 1.0), 3),
                "nominal_y": 0.0,
            })

        return trajectory

    def mutate_perturbation(
        self,
        parent: ScenarioPerturbation,
        partner: Optional[ScenarioPerturbation] = None,
        scenario_idx: int = 0,
    ) -> ScenarioPerturbation:
        """
        Iso+LineDD Mutation Operator:
        Combines isotropic Gaussian exploration with directional line extrapolation
        between two archive elites to traverse non-linear failure manifolds.
        """
        # 1. Base parameters
        mu = parent.friction_coefficient
        glare = parent.glare_severity
        lat = parent.sensor_latency_ms
        mass = parent.mass_offset_kg

        # 2. Line mutation component if partner is provided
        if partner is not None and self.rng.random() < 0.60:
            line_factor = self.rng.gauss(0.0, 0.45)
            mu += line_factor * (partner.friction_coefficient - parent.friction_coefficient)
            glare += line_factor * (partner.glare_severity - parent.glare_severity)
            lat += line_factor * (partner.sensor_latency_ms - parent.sensor_latency_ms)
            mass += line_factor * (partner.mass_offset_kg - parent.mass_offset_kg)

        # 3. Isotropic Gaussian noise jitter
        mu += self.rng.gauss(0.0, 0.06)
        glare += self.rng.gauss(0.0, 0.08)
        lat += self.rng.gauss(0.0, 12.0)
        mass += self.rng.gauss(0.0, 4.0)

        # Clamp to physical validity
        mu = max(0.08, min(1.00, mu))
        glare = max(0.0, min(1.0, glare))
        lat = max(10.0, min(200.0, lat))
        mass = max(-15.0, min(45.0, mass))

        lux = 75000.0 if glare > 0.5 else 650.0
        cond = "wet_epoxy" if mu < 0.25 else ("damp_concrete" if mu < 0.50 else "dry_concrete")

        return ScenarioPerturbation(
            scenario_id=f"map_elites_{scenario_idx:05d}",
            friction_coefficient=round(mu, 3),
            surface_condition=cond,
            lighting_lux=lux,
            glare_severity=round(glare, 3),
            sensor_latency_ms=round(lat, 1),
            mass_offset_kg=round(mass, 2),
            fog_smoke_density=0.0,
        )

    def run_search(
        self,
        total_evaluations: int = 300,
        initial_random_samples: int = 40,
    ) -> MapElitesSearchResult:
        """
        Executes the MAP-Elites Evolutionary Failure Mining Loop.
        """
        start_time = time.perf_counter()
        eval_count = 0

        # Phase 1: Seed archive with diverse initial random population
        for i in range(initial_random_samples):
            p = ScenarioPerturbation(
                scenario_id=f"map_init_{i:04d}",
                friction_coefficient=round(self.rng.uniform(0.08, 1.00), 3),
                surface_condition="init_random",
                lighting_lux=round(self.rng.uniform(100.0, 80000.0), 1),
                glare_severity=round(self.rng.uniform(0.0, 1.0), 3),
                sensor_latency_ms=round(self.rng.uniform(10.0, 200.0), 1),
                mass_offset_kg=round(self.rng.uniform(-15.0, 45.0), 2),
                fog_smoke_density=0.0,
            )
            elite = self.evaluate_scenario(p, iteration=eval_count)
            self.archive.add_or_update(elite)
            eval_count += 1

        # Phase 2: Quality-Diversity Evolutionary Search Loop
        while eval_count < total_evaluations:
            parent_elite = self.archive.sample_elite(self.rng)
            partner_elite = self.archive.sample_elite(self.rng) if self.rng.random() < 0.7 else None

            candidate_p = self.mutate_perturbation(
                parent=parent_elite.perturbation,
                partner=partner_elite.perturbation if partner_elite else None,
                scenario_idx=eval_count,
            )

            elite = self.evaluate_scenario(candidate_p, iteration=eval_count)
            self.archive.add_or_update(elite)
            eval_count += 1

        # Phase 3: Failure Frontier Extraction & Diagnostic Synthesis
        duration_s = time.perf_counter() - start_time
        occupants = self.archive.get_occupants()
        failing_occupants = [e for e in occupants if not e.outcome.passed]
        passing_occupants = [e for e in occupants if e.outcome.passed]

        # Extract Pareto Frontier: detect adjacent cells with alternating pass/fail
        frontier_points: List[FrontierBoundaryPoint] = []
        failure_causes: Dict[str, int] = {}

        for fail_e in failing_occupants:
            cause = fail_e.outcome.failure_cause or "UNKNOWN"
            failure_causes[cause] = failure_causes.get(cause, 0) + 1

            # Find closest passing neighbor in parameter space
            c_fail = fail_e.behavior_values
            min_dist = float("inf")
            closest_pass = None

            for pass_e in passing_occupants:
                c_pass = pass_e.behavior_values
                d = math.sqrt(
                    ((c_fail[0] - c_pass[0]) / 0.92) ** 2 +
                    (c_fail[1] - c_pass[1]) ** 2 +
                    ((c_fail[2] - c_pass[2]) / 190.0) ** 2
                )
                if d < min_dist:
                    min_dist = d
                    closest_pass = pass_e

            if closest_pass is not None and min_dist < 0.35:
                # Knife-edge boundary point
                frontier_points.append(
                    FrontierBoundaryPoint(
                        friction_mu=fail_e.perturbation.friction_coefficient,
                        glare_severity=fail_e.perturbation.glare_severity,
                        sensor_latency_ms=fail_e.perturbation.sensor_latency_ms,
                        mass_offset_kg=fail_e.perturbation.mass_offset_kg,
                        failure_cause=fail_e.outcome.failure_cause,
                        passing_clearance_m=closest_pass.outcome.minimum_obstacle_clearance_m,
                        failing_clearance_m=fail_e.outcome.minimum_obstacle_clearance_m,
                        cliff_sensitivity_score=round(1.0 / (min_dist + 0.05), 2),
                    )
                )

        # Sort frontier points by sensitivity
        frontier_points.sort(key=lambda x: x.cliff_sensitivity_score, reverse=True)

        # Parameter Sensitivity Ranking via variance in failing vs passing sets
        sensitivities = []
        if failing_occupants and passing_occupants:
            f_mus = [e.behavior_values[0] for e in failing_occupants]
            p_mus = [e.behavior_values[0] for e in passing_occupants]
            sensitivities.append(("surface_friction", abs(float(np.mean(p_mus) - np.mean(f_mus)))))

            f_glares = [e.behavior_values[1] for e in failing_occupants]
            p_glares = [e.behavior_values[1] for e in passing_occupants]
            sensitivities.append(("specular_glare", abs(float(np.mean(f_glares) - np.mean(p_glares)))))

            f_lats = [e.behavior_values[2] for e in failing_occupants]
            p_lats = [e.behavior_values[2] for e in passing_occupants]
            sensitivities.append(("sensor_latency", abs(float(np.mean(f_lats) - np.mean(p_lats))) / 190.0))

        sensitivities.sort(key=lambda x: x[1], reverse=True)

        # Safe Operational Envelope: root-cause categorized boundaries
        friction_causes = {"BRAKING_DISTANCE_EXCEEDED_SAFETY_MARGIN", "PHYSICAL_COLLISION_WITH_OBSTACLE"}
        glare_causes = {"PERCEPTION_BLINDING_FROM_SPECULAR_GLARE"}

        friction_fails = [e.behavior_values[0] for e in failing_occupants if e.outcome.failure_cause in friction_causes]
        glare_fails = [e.behavior_values[1] for e in failing_occupants if e.outcome.failure_cause in glare_causes]

        if friction_fails:
            min_safe_mu = min(0.80, max(0.18, max(friction_fails) + 0.03))
        else:
            min_safe_mu = 0.25

        if glare_fails:
            max_safe_glare = max(0.15, min(0.85, min(glare_fails) - 0.05))
        else:
            max_safe_glare = 0.80

        coverage_ratio = len(occupants) / float(self.archive.total_cells)

        return MapElitesSearchResult(
            total_evaluations=eval_count,
            archive_coverage_cells=len(occupants),
            total_archive_capacity=self.archive.total_cells,
            coverage_ratio=round(coverage_ratio, 4),
            total_failures_discovered=len(failing_occupants),
            unique_failure_niches=len(set([e.behavior_coords for e in failing_occupants])),
            failure_frontier_points=frontier_points[:25],
            safe_operational_envelope={
                "minimum_safe_friction_mu": (round(min_safe_mu, 2), 1.00),
                "maximum_safe_glare": (0.0, round(max_safe_glare, 2)),
                "maximum_safe_latency_ms": (10.0, 90.0),
            },
            failure_cause_breakdown=failure_causes,
            search_duration_seconds=round(duration_s, 2),
            parameter_sensitivity_ranking=sensitivities,
            archive_occupants=occupants,
        )
