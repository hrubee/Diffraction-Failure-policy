import os
from twin_synthesis.usd_builder import PhysicsMaterialParams, RobotPose, UsdStageBuilder


def test_usd_builder_generation(tmp_path):
    builder = UsdStageBuilder(output_dir=str(tmp_path))
    pose = RobotPose(x=1.5, y=-0.5, z=0.0, yaw_rad=0.785)
    material = PhysicsMaterialParams(static_friction=0.7, dynamic_friction=0.6, restitution=0.1)

    stage_path = builder.build_incident_stage(
        incident_id="inc_001",
        robot_pose=pose,
        physics_material=material,
        lighting_lux=1200.0,
    )

    assert os.path.exists(stage_path)
    with open(stage_path, "r") as f:
        content = f.read()
        assert "#usda 1.0" in content
        assert "GroundSurfaceMaterial" in content
        assert "FrontCamera" in content
        assert "LidarSensor" in content
        assert "1.5" in content  # robot x coordinate
