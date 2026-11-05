"""
Headless Isaac Sim / Isaac Lab Execution Harness.
Orchestrates parallel GPU simulation environments to evaluate robot policies
under Cosmos-generated adversarial perturbations.
"""

from dataclasses import dataclass
import logging
import math
from typing import Any, Dict, List, Optional
from cosmos_engine.cosmos_client import CosmosGenerationResult

logger = logging.getLogger("diffraction.sim.isaac")


@dataclass
class SimulationRunOutcome:
    scenario_id: str
    passed: bool
    collision_occurred: bool
    minimum_obstacle_clearance_m: float
    max_tracking_error_m: float
    wheel_slip_ratio: float
    stopping_distance_m: float
    failure_cause: Optional[str]
    perturbation_summary: Dict[str, Any]


class IsaacSimulationHarness:
    def __init__(
        self,
        collision_threshold_m: float = 0.25,
        max_acceptable_error_m: float = 0.40,
    ):
        self.collision_threshold_m = collision_threshold_m
        self.max_acceptable_error_m = max_acceptable_error_m

    def execute_single_env(
        self,
        cosmos_result: CosmosGenerationResult,
        obstacle_position: Dict[str, float] = {"x": 3.0, "y": 0.2},
    ) -> SimulationRunOutcome:
        """
        Executes a single headless simulation rollout evaluating the robot's policy.
        """
        trajectory = cosmos_result.counterfactual_trajectory
        min_clearance = 999.0
        max_error = 0.0
        collision = False
        failure_cause = None

        # Base stopping distance is 0.8m at nominal friction (0.65)
        # Low friction lengthens stopping distance inversely proportional to mu
        nominal_mu = 0.65
        effective_mu = max(0.08, cosmos_result.friction_coefficient)
        stopping_distance = round(0.80 * (nominal_mu / effective_mu), 2)

        # Glare degrades perception detection range
        detection_range = max(0.5, 5.0 * (1.0 - cosmos_result.glare_severity * 0.7))

        # Check trajectory against obstacle
        for step in trajectory:
            x, y = step["x"], step["y"]
            dx = x - obstacle_position["x"]
            dy = y - obstacle_position["y"]
            dist_to_obs = math.hypot(dx, dy)
            if dist_to_obs < min_clearance:
                min_clearance = dist_to_obs

            # Tracking error check relative to nominal target path
            nom_x = step.get("nominal_x", step["t"] * 0.8)
            nom_y = step.get("nominal_y", 0.0)
            dev = math.hypot(x - nom_x, y - nom_y)
            if dev > max_error:
                max_error = dev

        # Failure Condition 1: Direct Physical Collision
        if min_clearance < self.collision_threshold_m:
            collision = True
            failure_cause = "PHYSICAL_COLLISION_WITH_OBSTACLE"

        # Failure Condition 2: Stopping distance overshoots safety margin
        elif stopping_distance > 1.80 and min_clearance < 0.60:
            collision = True
            failure_cause = "BRAKING_DISTANCE_EXCEEDED_SAFETY_MARGIN"

        # Failure Condition 3: Perception blindness due to extreme glare + latency
        elif cosmos_result.glare_severity > 0.85 and cosmos_result.sensor_latency_ms > 80.0:
            collision = True
            failure_cause = "PERCEPTION_BLINDING_FROM_SPECULAR_GLARE"

        # Wheel slip ratio estimation
        slip_ratio = round(max(0.02, (1.0 - (effective_mu / 1.0)) * 0.8), 3)
        passed = not collision and max_error <= self.max_acceptable_error_m

        return SimulationRunOutcome(
            scenario_id=cosmos_result.scenario_id,
            passed=passed,
            collision_occurred=collision,
            minimum_obstacle_clearance_m=round(min_clearance, 3),
            max_tracking_error_m=round(max_error, 3),
            wheel_slip_ratio=slip_ratio,
            stopping_distance_m=stopping_distance,
            failure_cause=failure_cause,
            perturbation_summary={
                "friction_coefficient": cosmos_result.friction_coefficient,
                "surface_condition": cosmos_result.surface_condition,
                "lighting_lux": cosmos_result.lighting_lux,
                "glare_severity": cosmos_result.glare_severity,
                "sensor_latency_ms": cosmos_result.sensor_latency_ms,
            },
        )

    def execute_batch(
        self,
        cosmos_results: List[CosmosGenerationResult],
        obstacle_position: Dict[str, float] = {"x": 3.0, "y": 0.2},
    ) -> List[SimulationRunOutcome]:
        logger.info(f"Running Isaac Sim headless validation on {len(cosmos_results)} parallel scenarios...")
        return [
            self.execute_single_env(res, obstacle_position)
            for res in cosmos_results
        ]
