"""
Adversarial Domain Randomization Matrix Generator.
Generates parameterized environmental, sensor, and dynamic perturbations
to stress-test robot navigation and manipulation models.
"""

from dataclasses import asdict, dataclass
import random
from typing import Any, Dict, List


@dataclass
class ScenarioPerturbation:
    scenario_id: str
    friction_coefficient: float
    surface_condition: str
    lighting_lux: float
    glare_severity: float
    sensor_latency_ms: float
    mass_offset_kg: float
    fog_smoke_density: float


class DomainRandomizer:
    SURFACE_CONDITIONS = [
        (0.12, 0.25, "wet_polished_epoxy"),
        (0.25, 0.45, "damp_smooth_concrete"),
        (0.45, 0.70, "dry_warehouse_concrete"),
        (0.70, 0.95, "rough_asphalt"),
        (0.95, 1.15, "high_traction_rubber_mat"),
    ]

    def __init__(self, seed: int = 42):
        self.rng = random.Random(seed)

    def generate_scenarios(self, count: int = 100) -> List[ScenarioPerturbation]:
        scenarios: List[ScenarioPerturbation] = []

        for i in range(count):
            # Select surface & friction
            friction_min, friction_max, condition_name = self.rng.choice(self.SURFACE_CONDITIONS)
            friction = round(self.rng.uniform(friction_min, friction_max), 3)

            # Lighting: Bimodal distribution (dim aisle vs blinding dock glare)
            if self.rng.random() < 0.35:
                # Direct dock sun / intense headlight glare
                lux = round(self.rng.uniform(45000, 95000), 1)
                glare = round(self.rng.uniform(0.6, 1.0), 2)
            else:
                # Standard indoor to dim lighting
                lux = round(self.rng.uniform(25, 1200), 1)
                glare = round(self.rng.uniform(0.0, 0.25), 2)

            # Latency and mass jitter
            latency_ms = round(self.rng.uniform(10.0, 120.0), 1)
            mass_offset = round(self.rng.uniform(-5.0, 15.0), 2)
            fog_density = round(self.rng.uniform(0.0, 0.5) if self.rng.random() < 0.2 else 0.0, 2)

            scenarios.append(
                ScenarioPerturbation(
                    scenario_id=f"adversarial_scen_{i:04d}",
                    friction_coefficient=friction,
                    surface_condition=condition_name,
                    lighting_lux=lux,
                    glare_severity=glare,
                    sensor_latency_ms=latency_ms,
                    mass_offset_kg=mass_offset,
                    fog_smoke_density=fog_density,
                )
            )

        return scenarios
