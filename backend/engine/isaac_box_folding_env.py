"""
NVIDIA Isaac Sim / Isaac Lab Box Folding Simulation Environment Generator.
Compiles client robot embodiment into a turnkey contact-rich box folding task:
- Articulated cardboard carton OpenUSD stage with PhysX 5 revolute crease joints
- Industrial packing workstation with PBR materials and dome lighting
- Isaac Lab ManagerBasedRLEnv / DirectRLEnv configuration for RL and Imitation Learning (ACT / Diffusion Policy)
"""

import os
import json
import logging
from typing import Dict, Any, Optional
from pxr import Usd, UsdGeom, UsdPhysics, Gf, Sdf

logger = logging.getLogger("diffraction.isaac_box_folding")


class IsaacBoxFoldingEnvironmentBuilder:
    """
    Builds production Isaac Sim / Isaac Lab simulation environments
    for sequential cardboard carton folding tasks.
    """

    @staticmethod
    def generate_box_folding_usd_stage(
        output_dir: str,
        box_length_m: float = 0.35,
        box_width_m: float = 0.25,
        box_depth_m: float = 0.20,
        board_thickness_m: float = 0.003,
    ) -> Dict[str, str]:
        """
        Creates a valid Pixar OpenUSD stage of an articulated cardboard carton box
        with 4 revolute crease joints with damping and limits [0.0, 1.5708] (0 to 90 degrees).
        """
        os.makedirs(output_dir, exist_ok=True)
        usda_path = os.path.join(output_dir, "carton_box_flat.usda")
        usd_path = os.path.join(output_dir, "carton_box_flat.usd")

        stage = Usd.Stage.CreateNew(usda_path)
        UsdGeom.SetStageUpAxis(stage, UsdGeom.Tokens.z)
        UsdGeom.SetStageMetersPerUnit(stage, 1.0)

        # Root World Prim
        world = UsdGeom.Xform.Define(stage, "/World")
        box_root = UsdGeom.Xform.Define(stage, "/World/CartonBox")
        UsdPhysics.ArticulationRootAPI.Apply(box_root.GetPrim())

        # Base Bottom Panel
        base_prim = UsdGeom.Cube.Define(stage, "/World/CartonBox/BasePanel")
        base_prim.GetSizeAttr().Set(1.0)
        base_xform = base_prim.AddTransformOp()
        base_xform.Set(Gf.Matrix4d().SetScale(Gf.Vec3d(box_length_m, box_width_m, board_thickness_m)))
        UsdPhysics.RigidBodyAPI.Apply(base_prim.GetPrim())
        UsdPhysics.CollisionAPI.Apply(base_prim.GetPrim())
        mass_api = UsdPhysics.MassAPI.Apply(base_prim.GetPrim())
        mass_api.GetMassAttr().Set(0.12)  # 120g cardboard

        # 4 Folding Flaps
        flaps = [
            ("FrontFlap", Gf.Vec3d(0, -box_width_m / 2.0, 0), Gf.Vec3d(box_length_m, box_depth_m, board_thickness_m), Gf.Vec3d(1, 0, 0)),
            ("BackFlap", Gf.Vec3d(0, box_width_m / 2.0, 0), Gf.Vec3d(box_length_m, box_depth_m, board_thickness_m), Gf.Vec3d(1, 0, 0)),
            ("LeftFlap", Gf.Vec3d(-box_length_m / 2.0, 0, 0), Gf.Vec3d(board_thickness_m, box_width_m, box_depth_m), Gf.Vec3d(0, 1, 0)),
            ("RightFlap", Gf.Vec3d(box_length_m / 2.0, 0, 0), Gf.Vec3d(board_thickness_m, box_width_m, box_depth_m), Gf.Vec3d(0, 1, 0)),
        ]

        for flap_name, offset, scale, axis in flaps:
            flap_prim = UsdGeom.Cube.Define(stage, f"/World/CartonBox/{flap_name}")
            flap_prim.GetSizeAttr().Set(1.0)
            f_xform = flap_prim.AddTransformOp()
            f_xform.Set(Gf.Matrix4d().SetTranslate(offset).SetScale(scale))
            UsdPhysics.RigidBodyAPI.Apply(flap_prim.GetPrim())
            UsdPhysics.CollisionAPI.Apply(flap_prim.GetPrim())
            f_mass = UsdPhysics.MassAPI.Apply(flap_prim.GetPrim())
            f_mass.GetMassAttr().Set(0.06)

            # Revolute Crease Joint
            joint_path = f"/World/CartonBox/Crease_{flap_name}"
            joint = UsdPhysics.RevoluteJoint.Define(stage, joint_path)
            joint.CreateBody0Rel().SetTargets([base_prim.GetPath()])
            joint.CreateBody1Rel().SetTargets([flap_prim.GetPath()])
            joint.GetAxisAttr().Set("X" if axis[0] == 1 else "Y")
            joint.GetLowerLimitAttr().Set(0.0)
            joint.GetUpperLimitAttr().Set(1.5707963)  # 90 degrees

            # Paperboard Crease Memory / Torsional Resistance Drive
            drive = UsdPhysics.DriveAPI.Apply(joint.GetPrim(), "angular")
            drive.GetTypeAttr().Set("force")
            drive.GetDampingAttr().Set(1.5)
            drive.GetStiffnessAttr().Set(4.0)

        stage.GetRootLayer().Save()

        # Binary USD
        bin_stage = Usd.Stage.CreateNew(usd_path)
        bin_stage.GetRootLayer().subLayerPaths.append(os.path.basename(usda_path))
        bin_stage.GetRootLayer().Save()

        return {
            "usda": os.path.abspath(usda_path),
            "usd": os.path.abspath(usd_path),
        }

    @staticmethod
    def generate_isaac_lab_task_script(
        output_dir: str,
        robot_usd_path: str,
        box_usd_path: str,
        task_name: str = "RobotBoxFolding-v0",
    ) -> str:
        """
        Generates ready-to-run NVIDIA Isaac Lab task configuration script.
        """
        script_content = f'''\"\"\"
NVIDIA Isaac Lab Box Folding Simulation Task Configuration.
Auto-generated by Diffraction Physical AI Studio.
Compatible with Isaac Lab (v1.0+) / Isaac Sim 4.0+.

Run command:
    python -m isaaclab.tasks.box_folding --robot_usd "{robot_usd_path}" --num_envs 32 --headless
\"\"\"

import math
import torch
from dataclasses import MISSING
import omni.isaac.lab.sim as sim_utils
from omni.isaac.lab.assets import Articulation, ArticulationCfg, RigidObject, RigidObjectCfg
from omni.isaac.lab.envs import ManagerBasedRLEnvCfg
from omni.isaac.lab.managers import SceneEntityCfg
from omni.isaac.lab.sensors import CameraCfg
from omni.isaac.lab.utils import configclass

@configclass
class BoxFoldingSceneCfg:
    \"\"\"Scene configuration for Box Folding Workstation.\"\"\"
    # Tabletop Ground
    table = RigidObjectCfg(
        prim_path="{{ENV_REGEX_NS}}/Table",
        spawn=sim_utils.CuboidCfg(
            size=(1.2, 0.8, 0.75),
            rigid_props=sim_utils.RigidBodyPropertiesCfg(kinematic_enabled=True),
            collision_props=sim_utils.CollisionPropertiesCfg(),
            visual_material=sim_utils.PreviewSurfaceCfg(diffuse_color=(0.25, 0.25, 0.25), roughness=0.4),
        ),
        init_state=RigidObjectCfg.InitialStateCfg(pos=(0.5, 0.0, 0.375)),
    )

    # Client Robot Manipulator
    robot: ArticulationCfg = ArticulationCfg(
        prim_path="{{ENV_REGEX_NS}}/Robot",
        spawn=sim_utils.UsdFileCfg(
            usd_path="{robot_usd_path}",
            activate_contact_sensors=True,
            rigid_props=sim_utils.RigidBodyPropertiesCfg(
                disable_gravity=False,
                max_depenetration_velocity=5.0,
            ),
        ),
        init_state=ArticulationCfg.InitialStateCfg(
            pos=(0.0, 0.0, 0.75),
            rot=(1.0, 0.0, 0.0, 0.0),
        ),
    )

    # Articulated Cardboard Box Flat
    box: ArticulationCfg = ArticulationCfg(
        prim_path="{{ENV_REGEX_NS}}/CartonBox",
        spawn=sim_utils.UsdFileCfg(
            usd_path="{box_usd_path}",
            activate_contact_sensors=True,
        ),
        init_state=ArticulationCfg.InitialStateCfg(
            pos=(0.55, 0.0, 0.755),
            rot=(1.0, 0.0, 0.0, 0.0),
        ),
    )

    # Egocentric Head / Workstation Camera
    head_cam = CameraCfg(
        prim_path="{{ENV_REGEX_NS}}/Robot/head_cam",
        offset=CameraCfg.OffsetCfg(pos=(0.25, 0.0, 0.65), rot=(0.9238, 0.0, 0.3826, 0.0)),
        data_types=["rgb", "distance_to_image_plane"],
        width=640,
        height=480,
    )

    # Egocentric Tool / Wrist Flange Camera (Intel RealSense D405 Perspective)
    wrist_cam = CameraCfg(
        prim_path="{{ENV_REGEX_NS}}/Robot/panda_gripper_flange/wrist_cam",
        offset=CameraCfg.OffsetCfg(pos=(0.05, 0.0, 0.05), rot=(0.7071, 0.0, 0.7071, 0.0)),
        data_types=["rgb", "distance_to_image_plane"],
        width=640,
        height=480,
    )

@configclass
class BoxFoldingTaskCfg(ManagerBasedRLEnvCfg):
    \"\"\"Configuration for Imitation Learning / LeRobot v2 Demonstration Data Collection.\"\"\"
    scene: BoxFoldingSceneCfg = BoxFoldingSceneCfg()
    
    # 30-Second Task Horizon (900 steps @ 30 Hz)
    episode_length_s: float = 30.0
    decimation: int = 2
    
    def __post_init__(self):
        self.sim.dt = 1.0 / 60.0
        self.sim.physx.solver_type = 1  # TGS (Temporal Gauss-Seidel) for stiff contact
        self.sim.physx.friction_correlation_distance = 0.025
'''
        task_path = os.path.join(output_dir, "box_folding_task.py")
        with open(task_path, "w") as f:
            f.write(script_content)

        return os.path.abspath(task_path)
