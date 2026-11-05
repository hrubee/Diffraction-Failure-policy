"""
Omniverse NuRec Spatial Reconstruction Pipeline Bridge.
Transforms raw telemetry points, sensor logs, and kinematics into
a calibrated digital twin environment stage.
"""

import logging
import math
import os
from typing import Any, Dict, List, Optional
from cloud_gateway.mcap_parser import DecoupledIncident
from twin_synthesis.usd_builder import PhysicsMaterialParams, RobotPose, UsdStageBuilder

logger = logging.getLogger("diffraction.twin.nurec")


class NuRecReconstructor:
    def __init__(self, output_dir: str = "./storage/usd_stages"):
        self.usd_builder = UsdStageBuilder(output_dir=output_dir)

    def reconstruct_from_incident(
        self,
        incident: DecoupledIncident,
        static_friction: float = 0.65,
        dynamic_friction: float = 0.55,
        ambient_lux: float = 650.0,
    ) -> Dict[str, Any]:
        """
        Synthesizes the physical digital twin stage from decoupled incident telemetry.
        """
        logger.info(f"Initiating NuRec reconstruction for robot {incident.robot_id}...")

        # 1. Extract robot pose at moment of failure
        odom_msgs = incident.messages_by_topic.get("/odom", [])
        robot_pose = RobotPose()

        if odom_msgs:
            last_odom = odom_msgs[-1]["data"]
            current_pose = last_odom.get("current_pose", {})
            robot_pose.x = current_pose.get("x", 0.0)
            robot_pose.y = current_pose.get("y", 0.0)
            robot_pose.z = current_pose.get("z", 0.0)
            robot_pose.yaw_rad = current_pose.get("yaw", 0.0)
        elif incident.trigger_details.get("current_pose"):
            cp = incident.trigger_details["current_pose"]
            robot_pose.x = cp.get("x", 0.0)
            robot_pose.y = cp.get("y", 0.0)
            robot_pose.z = cp.get("z", 0.0)

        # 2. Configure physics material
        material_params = PhysicsMaterialParams(
            static_friction=static_friction,
            dynamic_friction=dynamic_friction,
            restitution=0.05,
        )

        # 3. Assemble USD Stage
        incident_id = f"{incident.robot_id}_{incident.trigger_type}_{incident.trigger_timestamp_ns}"
        usd_stage_path = self.usd_builder.build_incident_stage(
            incident_id=incident_id,
            robot_pose=robot_pose,
            physics_material=material_params,
            lighting_lux=ambient_lux,
        )

        logger.info(f"USD Digital Twin stage synthesized at: {usd_stage_path}")

        return {
            "incident_id": incident_id,
            "usd_stage_path": usd_stage_path,
            "robot_pose": {
                "x": robot_pose.x,
                "y": robot_pose.y,
                "z": robot_pose.z,
                "yaw_rad": robot_pose.yaw_rad,
            },
            "physics_material": {
                "static_friction": static_friction,
                "dynamic_friction": dynamic_friction,
            },
            "lighting_lux": ambient_lux,
        }
