"""
Programmatic OpenUSD Stage Synthesizer.
Assembles physics-compliant, universally visible OpenUSD (.usda) digital twin scenes.
Uses standard UsdGeomMesh polygonal geometry with displayColor and doubleSided attributes
to ensure 100% visual compatibility across online WebGL USD viewers, macOS Quick Look,
Xcode, Blender, NVIDIA Omniverse, and Isaac Sim.
"""

from dataclasses import dataclass
import math
import os
from typing import Any, Dict, List, Optional, Tuple


@dataclass
class RobotPose:
    x: float = 0.0
    y: float = 0.0
    z: float = 0.0
    yaw_rad: float = 0.0


@dataclass
class PhysicsMaterialParams:
    static_friction: float = 0.65
    dynamic_friction: float = 0.55
    restitution: float = 0.05


def _generate_box_mesh(
    name: str,
    cx: float,
    cy: float,
    cz: float,
    sx: float,
    sy: float,
    sz: float,
    color: Tuple[float, float, float],
    has_physics_collision: bool = True,
) -> str:
    """Generates an explicit polygonal UsdGeomMesh box universally supported by all online/desktop viewers."""
    hx, hy, hz = sx / 2.0, sy / 2.0, sz / 2.0
    p = [
        (round(cx - hx, 4), round(cy - hy, 4), round(cz - hz, 4)),
        (round(cx + hx, 4), round(cy - hy, 4), round(cz - hz, 4)),
        (round(cx + hx, 4), round(cy + hy, 4), round(cz - hz, 4)),
        (round(cx - hx, 4), round(cy + hy, 4), round(cz - hz, 4)),
        (round(cx - hx, 4), round(cy - hy, 4), round(cz + hz, 4)),
        (round(cx + hx, 4), round(cy - hy, 4), round(cz + hz, 4)),
        (round(cx + hx, 4), round(cy + hy, 4), round(cz + hz, 4)),
        (round(cx - hx, 4), round(cy + hy, 4), round(cz + hz, 4)),
    ]
    pts_str = ", ".join(f"({pt[0]}, {pt[1]}, {pt[2]})" for pt in p)
    indices = "0, 3, 2, 1, 4, 5, 6, 7, 0, 1, 5, 4, 1, 2, 6, 5, 2, 3, 7, 6, 3, 0, 4, 7"
    counts = "4, 4, 4, 4, 4, 4"
    r, g, b = color
    api_schema = ' (apiSchemas = ["PhysicsCollisionAPI"])' if has_physics_collision else ""

    return f"""
        def Mesh "{name}"{api_schema}
        {{
            bool doubleSided = true
            point3f[] points = [{pts_str}]
            int[] faceVertexCounts = [{counts}]
            int[] faceVertexIndices = [{indices}]
            color3f[] primvars:displayColor = [({r}, {g}, {b})]
        }}"""


class UsdStageBuilder:
    def __init__(self, output_dir: str = "./storage/usd_stages"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)

    def build_incident_stage(
        self,
        incident_id: str,
        robot_pose: RobotPose,
        physics_material: PhysicsMaterialParams,
        lighting_lux: float = 750.0,
        urdf_reference: str = "assets/robots/amr_diff_drive.urdf",
        obstacle_pose: Optional[Dict[str, float]] = None,
    ) -> str:
        """
        Assembles a comprehensive, universally visible ASCII OpenUSD (.usda) digital twin:
        - PhysicsScene (gravity & solvers)
        - Ambient DomeLight + Directional Sunlight
        - Concrete floor slab (Mesh) with safety yellow corridor lines (Meshes)
        - Dark glossy slick spill hazard zone (Mesh)
        - 3D Obstacle Euro-pallet & cargo crate (Meshes)
        - 3D Autonomous Mobile Robot (Chassis, Deck, E-Stop, Wheels, LiDAR, Cameras)
        - Trajectory breadcrumb waypoints (Green planned path vs Red slip deviation)
        """
        file_path = os.path.join(self.output_dir, f"{incident_id}_scene.usda")

        if obstacle_pose is None:
            obstacle_pose = {"x": 2.50, "y": 0.55, "z": 0.0}

        yaw_deg = round(robot_pose.yaw_rad * (180.0 / math.pi), 2)

        # 1. Environment Meshes
        floor_mesh = _generate_box_mesh("FloorSlab", 2.0, 0.0, -0.05, 24.0, 16.0, 0.10, (0.72, 0.74, 0.77))
        stripe_left = _generate_box_mesh("CorridorLeftStripe", 2.0, 1.20, 0.005, 20.0, 0.10, 0.005, (0.96, 0.82, 0.12), False)
        stripe_right = _generate_box_mesh("CorridorRightStripe", 2.0, -1.20, 0.005, 20.0, 0.10, 0.005, (0.96, 0.82, 0.12), False)
        hazard_patch = _generate_box_mesh("SlickSurfaceHazardPatch", 2.40, 0.35, 0.008, 3.20, 1.80, 0.012, (0.28, 0.38, 0.48))
        dock_wall = _generate_box_mesh("DockPerimeterWall", 4.50, 0.0, 0.60, 0.25, 6.0, 1.20, (0.45, 0.48, 0.52))

        # 2. Obstacle Meshes
        pallet_mesh = _generate_box_mesh("PalletBase", 0.0, 0.0, 0.07, 1.20, 0.80, 0.14, (0.68, 0.48, 0.28))
        crate_mesh = _generate_box_mesh("CargoCrate", 0.0, 0.0, 0.515, 1.00, 0.70, 0.75, (0.92, 0.42, 0.10))
        label_mesh = _generate_box_mesh("HazardLabelPlate", 0.0, -0.36, 0.55, 0.40, 0.02, 0.25, (0.98, 0.88, 0.15), False)

        # 3. Robot Meshes
        chassis_mesh = _generate_box_mesh("ChassisBody", 0.0, 0.0, 0.18, 0.92, 0.64, 0.26, (0.12, 0.42, 0.90))
        deck_mesh = _generate_box_mesh("UpperDeckPlate", 0.0, 0.0, 0.32, 0.86, 0.58, 0.04, (0.18, 0.20, 0.23), False)
        estop_mesh = _generate_box_mesh("EmergencyStop", -0.28, 0.20, 0.37, 0.09, 0.09, 0.06, (0.95, 0.10, 0.10), False)
        wheel_l_mesh = _generate_box_mesh("LeftDriveWheel", 0.0, 0.34, 0.10, 0.20, 0.07, 0.20, (0.08, 0.08, 0.08))
        wheel_r_mesh = _generate_box_mesh("RightDriveWheel", 0.0, -0.34, 0.10, 0.20, 0.07, 0.20, (0.08, 0.08, 0.08))
        caster_f_mesh = _generate_box_mesh("FrontCaster", 0.35, 0.0, 0.05, 0.09, 0.09, 0.09, (0.25, 0.25, 0.25))
        caster_r_mesh = _generate_box_mesh("RearCaster", -0.35, 0.0, 0.05, 0.09, 0.09, 0.09, (0.25, 0.25, 0.25))
        camera_bar_mesh = _generate_box_mesh("StereoCameraBar", 0.47, 0.0, 0.24, 0.05, 0.28, 0.045, (0.15, 0.15, 0.15), False)
        beacon_mesh = _generate_box_mesh("SafetyStrobeBeacon", -0.28, -0.20, 0.37, 0.08, 0.08, 0.08, (1.0, 0.65, 0.0), False)
        lidar_puck_mesh = _generate_box_mesh("LidarPuck", 0.0, 0.0, 0.045, 0.13, 0.13, 0.09, (0.12, 0.12, 0.12), False)
        lidar_optic_mesh = _generate_box_mesh("LidarOpticBand", 0.0, 0.0, 0.05, 0.134, 0.134, 0.03, (0.0, 0.75, 0.95), False)

        # 4. Trajectory Waypoint Meshes
        nominal_crumbs = "".join(
            _generate_box_mesh(f"NominalWaypoint_{i}", round(i * 0.35, 3), 0.0, 0.015, 0.08, 0.08, 0.02, (0.10, 0.85, 0.25), False)
            for i in range(8)
        )

        deviation_crumbs = "".join(
            _generate_box_mesh(
                f"DeviationWaypoint_{j}",
                round(2.0 + ((j + 1) / 5.0) * (robot_pose.x - 2.0), 3),
                round(((j + 1) / 5.0) * robot_pose.y, 3),
                0.02,
                0.09,
                0.09,
                0.025,
                (0.95, 0.15, 0.15),
                False,
            )
            for j in range(5)
        )

        usd_content = f"""#usda 1.0
(
    defaultPrim = "World"
    metersPerUnit = 1.0
    upAxis = "Z"
    doc = "Diffraction Autogenerated Digital Twin for Incident {incident_id}"
)

def Xform "World"
{{
    # -------------------------------------------------------------
    # 1. PHYSICS SCENE & CONTACT SOLVER
    # -------------------------------------------------------------
    def Scope "PhysicsScene" (
        apiSchemas = ["PhysicsSceneAPI"]
    )
    {{
        uniform vector3f physics:gravityDirection = (0, 0, -1)
        uniform float physics:gravityMagnitude = 9.80665
    }}

    def Scope "Materials"
    {{
        def Material "GroundSurfaceMaterial" (
            apiSchemas = ["PhysicsMaterialAPI"]
        )
        {{
            float physics:staticFriction = {physics_material.static_friction}
            float physics:dynamicFriction = {physics_material.dynamic_friction}
            float physics:restitution = {physics_material.restitution}
        }}

        def Material "SlickSpillMaterial" (
            apiSchemas = ["PhysicsMaterialAPI"]
        )
        {{
            float physics:staticFriction = 0.22
            float physics:dynamicFriction = 0.18
            float physics:restitution = 0.02
        }}
    }}

    # -------------------------------------------------------------
    # 2. UNIVERSAL LIGHTING RIG (Visible across all WebGL & Desktop engines)
    # -------------------------------------------------------------
    def DomeLight "WarehouseAmbientLight"
    {{
        float inputs:intensity = 1500.0
        color3f inputs:color = (0.95, 0.98, 1.0)
    }}

    def DistantLight "OverheadSunLight"
    {{
        float inputs:intensity = {max(1800.0, lighting_lux * 2.5)}
        color3f inputs:color = (1.0, 0.98, 0.92)
        double3 xformOp:rotateXYZ = (-50, 35, 0)
        uniform token[] xformOpOrder = ["xformOp:rotateXYZ"]
    }}

    # -------------------------------------------------------------
    # 3. WAREHOUSE ENVIRONMENT & FLOOR SLAB
    # -------------------------------------------------------------
    def Xform "Environment"
    {{
{floor_mesh}
{stripe_left}
{stripe_right}
{hazard_patch}
{dock_wall}
    }}

    # -------------------------------------------------------------
    # 4. COLLISION HAZARD OBSTACLE (Wooden Pallet + Staging Crate)
    # -------------------------------------------------------------
    def Xform "Obstacle" (
        apiSchemas = ["PhysicsRigidBodyAPI", "PhysicsCollisionAPI"]
    )
    {{
        double3 xformOp:translate = ({obstacle_pose['x']}, {obstacle_pose['y']}, {obstacle_pose.get('z', 0.0)})
        uniform token[] xformOpOrder = ["xformOp:translate"]
{pallet_mesh}
{crate_mesh}
{label_mesh}
    }}

    # -------------------------------------------------------------
    # 5. AUTONOMOUS MOBILE ROBOT (AMR) 3D VEHICLE ASSEMBLY
    # -------------------------------------------------------------
    def Xform "Robot" (
        apiSchemas = ["PhysicsRigidBodyAPI", "PhysicsMassAPI"]
    )
    {{
        double3 xformOp:translate = ({robot_pose.x}, {robot_pose.y}, {robot_pose.z})
        double3 xformOp:rotateXYZ = (0, 0, {yaw_deg})
        uniform token[] xformOpOrder = ["xformOp:translate", "xformOp:rotateXYZ"]

        custom string diffraction:urdf_source = "{urdf_reference}"
        float physics:mass = 85.0
{chassis_mesh}
{deck_mesh}
{estop_mesh}
{wheel_l_mesh}
{wheel_r_mesh}
{caster_f_mesh}
{caster_r_mesh}
{camera_bar_mesh}
{beacon_mesh}

        # Optical Camera Sensor Prim
        def Camera "FrontCamera"
        {{
            float focalLength = 24.0
            float horizontalAperture = 20.955
            float verticalAperture = 15.291
            double3 xformOp:translate = (0.47, 0.0, 0.24)
            double3 xformOp:rotateXYZ = (0, 0, 0)
            uniform token[] xformOpOrder = ["xformOp:translate", "xformOp:rotateXYZ"]
        }}

        # 3D LiDAR Sensor System
        def Xform "LidarSensor"
        {{
            double3 xformOp:translate = (0.28, 0.0, 0.38)
            uniform token[] xformOpOrder = ["xformOp:translate"]
            custom string sensor:type = "lidar_3d"
            custom int sensor:channels = 16
{lidar_puck_mesh}
{lidar_optic_mesh}
        }}
    }}

    # -------------------------------------------------------------
    # 6. TRAJECTORY BREADCRUMB WAYPOINTS (Green Nominal vs Red Drift)
    # -------------------------------------------------------------
    def Xform "TrajectoryAnalysis"
    {{
{nominal_crumbs}
{deviation_crumbs}
    }}
}}
"""
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(usd_content)

        return file_path
