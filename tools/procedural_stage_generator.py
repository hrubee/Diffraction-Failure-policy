#!/usr/bin/env python3
"""
Diffraction Studio Internal Automation Tool: Procedural OpenUSD Stage Generator
Builds domain-randomized OpenUSD stages and Omniverse Replicator recipes for robotics training.
Powers Package 2 ($18,500 Procedural Training Stage Sprint).

Usage:
    python tools/procedural_stage_generator.py --env warehouse --seed 42 --output-dir storage/studio_deliverables/warehouse_stage
"""

import argparse
import json
import math
import os
import random
from typing import Dict, List, Tuple

class ProceduralStageGenerator:
    def __init__(self, env_type: str = "warehouse", seed: int = 42):
        self.env_type = env_type
        self.seed = seed
        random.seed(seed)

    def generate_warehouse_usda(self, num_racks: int = 12, floor_size: Tuple[float, float] = (40.0, 30.0)) -> str:
        """Generates OpenUSD stage for an automated logistics fulfillment warehouse."""
        lines = [
            '#usda 1.0',
            '(',
            '    defaultPrim = "World"',
            '    metersPerUnit = 1.0',
            '    upAxis = "Z"',
            ')',
            '',
            'def Xform "World"',
            '{',
            '    # 1. Procedural Epoxy Floor with PhysX Friction Material',
            '    def Mesh "Floor" (',
            '        prepend apiSchemas = ["PhysicsCollisionAPI", "PhysxCollisionAPI"]',
            '    )',
            '    {',
            '        point3f[] points = [(-20, -15, 0), (20, -15, 0), (20, 15, 0), (-20, 15, 0)]',
            '        int[] faceVertexCounts = [4]',
            '        int[] faceVertexIndices = [0, 1, 2, 3]',
            '        normal3f[] normals = [(0, 0, 1), (0, 0, 1), (0, 0, 1), (0, 0, 1)]',
            '        rel material:binding = </World/Materials/EpoxyFloorMaterial>',
            '    }',
            '',
            '    def Scope "Materials"',
            '    {',
            '        def Material "EpoxyFloorMaterial"',
            '        {',
            '            token physics:materialType = "rigid"',
            '            float physics:dynamicFriction = 0.42',
            '            float physics:staticFriction = 0.55',
            '            float physics:restitution = 0.05',
            '        }',
            '    }',
            '',
            '    # 2. High-Bay Overhead Luminaires (RTX Ray-Traced)',
            '    def Scope "Lighting"',
            '    {',
        ]

        # Overhead lights
        for i in range(4):
            x = -12.0 + i * 8.0
            lux = random.uniform(400.0, 1200.0)
            cct = random.choice([3200.0, 4500.0, 6000.0])
            lines.extend([
                f'        def RectLight "HighBay_{i}"',
                '        {',
                f'            float intensity = {round(lux, 1)}',
                f'            float colorTemperature = {cct}',
                f'            double3 xformOp:translate = ({x}, 0, 8.5)',
                '            uniform token[] xformOpOrder = ["xformOp:translate"]',
                '        }',
            ])

        lines.extend([
            '    }',
            '',
            '    # 3. High-Bay Pallet Racks & Obstacle Clutter',
            '    def Scope "Racks"',
            '    {',
        ])

        # Racks
        for r in range(num_racks):
            rx = -15.0 + (r % 4) * 10.0
            ry = -10.0 + (r // 4) * 10.0
            height = random.uniform(4.5, 7.0)
            lines.extend([
                f'        def Xform "PalletRack_{r}" (',
                '            prepend apiSchemas = ["PhysicsCollisionAPI"]',
                '        )',
                '        {',
                f'            double3 xformOp:translate = ({rx}, {ry}, 0.0)',
                '            uniform token[] xformOpOrder = ["xformOp:translate"]',
                '            def Cube "Mesh"',
                '            {',
                f'                double size = 1.0',
                f'                double3 xformOp:scale = (3.5, 1.2, {round(height, 2)})',
                '                uniform token[] xformOpOrder = ["xformOp:scale"]',
                '            }',
                '        }',
            ])

        lines.extend([
            '    }',
            '',
            '    # 4. Multi-Camera Sensor Rig Definitions',
            '    def Scope "Sensors"',
            '    {',
            '        def Camera "PrimaryCamera"',
            '        {',
            '            float focalLength = 24.0',
            '            float horizontalAperture = 20.955',
            '            float verticalAperture = 15.29',
            '            double3 xformOp:translate = (0.0, -8.0, 2.5)',
            '            uniform token[] xformOpOrder = ["xformOp:translate"]',
            '        }',
            '    }',
            '}',
        ])
        return '\n'.join(lines)

    def generate_replicator_script(self) -> str:
        """Generates the Omniverse Replicator Python script for headless domain randomization."""
        return f'''# Diffraction Studio Internal Replicator Automation Recipe
# Environment: {self.env_type} | Seed: {self.seed}
import omni.replicator.core as rep

def build_replicator_pipeline():
    with rep.new_layer():
        # 1. Randomize overhead luminaire intensities & color temperature
        lights = rep.get.prims(path_pattern="/World/Lighting/HighBay_.*")
        with lights:
            rep.modify.attribute("intensity", rep.distribution.uniform(150.0, 2500.0))
            rep.modify.attribute("colorTemperature", rep.distribution.choice([3200.0, 4500.0, 6000.0]))

        # 2. Randomize floor friction parameters
        floor_mat = rep.get.prims(path_pattern="/World/Materials/EpoxyFloorMaterial")
        with floor_mat:
            rep.physics.physics_material(
                dynamic_friction=rep.distribution.uniform(0.12, 0.88),
                static_friction=rep.distribution.uniform(0.18, 0.95),
                restitution=0.05
            )

        # 3. Randomize pallet clutter poses
        racks = rep.get.prims(path_pattern="/World/Racks/PalletRack_.*")
        with racks:
            rep.modify.pose(
                position=rep.distribution.uniform((-18.0, -12.0, 0.0), (18.0, 12.0, 0.0)),
                rotation=rep.distribution.uniform((0, 0, -45), (0, 0, 45))
            )

    # 4. Attach synchronized multi-modal render products
    cam = rep.create.camera(position=(0, -8, 2.5), look_at=(0, 0, 0.5))
    rp_rgb = rep.create.render_product(cam, (1920, 1080))
    writer = rep.WriterRegistry.get("BasicWriter")
    writer.initialize(
        output_dir="storage/sim_output",
        rgb=True,
        distance_to_image_plane=True,
        semantic_segmentation=True
    )
    writer.attach([rp_rgb])

rep.orchestrator.run()
'''

    def generate(self, output_dir: str) -> Dict[str, str]:
        os.makedirs(output_dir, exist_ok=True)
        usda_content = self.generate_warehouse_usda()
        usda_path = os.path.join(output_dir, f"{self.env_type}_stage.usda")
        with open(usda_path, "w") as f:
            f.write(usda_content)

        rep_content = self.generate_replicator_script()
        rep_path = os.path.join(output_dir, f"randomize_{self.env_type}.py")
        with open(rep_path, "w") as f:
            f.write(rep_content)

        manifest = {
            "env_type": self.env_type,
            "seed": self.seed,
            "stage_usda": os.path.basename(usda_path),
            "replicator_script": os.path.basename(rep_path),
            "lighting_lux_range": [150.0, 2500.0],
            "friction_mu_range": [0.12, 0.88],
            "status": "PROCEDURAL_STAGE_READY",
        }
        manifest_path = os.path.join(output_dir, "stage_manifest.json")
        with open(manifest_path, "w") as f:
            json.dump(manifest, f, indent=2)

        return {
            "usda_path": usda_path,
            "replicator_script": rep_path,
            "manifest_path": manifest_path,
        }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate procedural OpenUSD stage and Replicator script.")
    parser.add_argument("--env", default="warehouse", choices=["warehouse", "dock", "cleanroom", "domestic"])
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--output-dir", required=True)
    args = parser.parse_args()

    gen = ProceduralStageGenerator(env_type=args.env, seed=args.seed)
    results = gen.generate(args.output_dir)
    print(f"[Diffraction Studio] Procedural stage generated:")
    for k, v in results.items():
        print(f"  • {k}: {v}")
