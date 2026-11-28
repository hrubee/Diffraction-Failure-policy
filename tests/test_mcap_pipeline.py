import os
import time
from edge.mcap_exporter import McapExporter
from edge.ring_buffer import BufferedMessage
from edge.trigger_detector import TriggerEvent, TriggerType
from cloud_gateway.mcap_parser import McapParser


def test_mcap_export_and_parse(tmp_path):
    exporter = McapExporter(robot_id="test_bot_1", urdf_hash="hash123", output_directory=str(tmp_path))

    trigger = TriggerEvent(
        trigger_type=TriggerType.ESTOP_TRIGGERED,
        timestamp_ns=time.time_ns(),
        severity="EMERGENCY",
        details={"source": "bumper"},
    )

    msgs = [
        BufferedMessage(topic="/odom", timestamp_ns=1000, data={"x": 1.0}, schema_name="json", size_bytes=64),
        BufferedMessage(topic="/camera", timestamp_ns=2000, data={"img": "raw"}, schema_name="json", size_bytes=128),
    ]

    mcap_path = exporter.export_incident(messages=msgs, trigger=trigger, facility_id="test_facility")
    assert os.path.exists(mcap_path)

    # Now parse it back
    parsed = McapParser.parse_file(mcap_path)
    assert parsed.robot_id == "test_bot_1"
    assert parsed.urdf_hash == "hash123"
    assert parsed.trigger_type == TriggerType.ESTOP_TRIGGERED.value
    assert "/odom" in parsed.channels
    assert "/camera" in parsed.channels


def test_ros2_cdr_deserializer():
    from cloud_gateway.mcap_parser import Ros2CdrDeserializer
    import struct

    # 1. Test std_msgs/msg/Bool (CDR encapsulation header [0, 1, 0, 0] + 1 byte bool)
    raw_bool_true = bytes([0, 1, 0, 0, 1])
    res_bool = Ros2CdrDeserializer.deserialize(raw_bool_true, "std_msgs/msg/Bool")
    assert res_bool["data"] is True

    raw_bool_false = bytes([0, 1, 0, 0, 0])
    res_bool_f = Ros2CdrDeserializer.deserialize(raw_bool_false, "std_msgs/msg/Bool")
    assert res_bool_f["data"] is False

    # 2. Test geometry_msgs/msg/Twist
    # 6 doubles (vx, vy, vz, wx, wy, wz)
    raw_twist = bytes([0, 1, 0, 0]) + struct.pack("<6d", 0.5, 0.0, 0.0, 0.0, 0.0, 0.25)
    res_twist = Ros2CdrDeserializer.deserialize(raw_twist, "geometry_msgs/msg/Twist")
    assert res_twist["linear"]["x"] == 0.5
    assert res_twist["angular"]["z"] == 0.25


def test_real_world_robot_failure_mcap_ground_truth():
    import time
    from cloud_gateway.sysid_calibrator import SysIDCalibrator

    real_mcap = "storage/telemetry_drops/internet_robot_emergency_failure.mcap"
    if not os.path.exists(real_mcap):
        return  # Skip if file was cleaned up

    t0 = time.perf_counter()
    parsed = McapParser.parse_file(real_mcap)
    t_parse = time.perf_counter() - t0

    assert parsed.robot_id == "pal_tiago_robot"
    assert parsed.trigger_type == "emergency_estop_triggered"
    assert parsed.trigger_severity == "CRITICAL"
    assert "/power/is_emergency" in parsed.channels
    assert "/direct_laser_odometry/odom" in parsed.channels

    # Check SysID calibration execution time and anomaly output
    t1 = time.perf_counter()
    profile = SysIDCalibrator.analyze_incident(parsed)
    total_time = time.perf_counter() - t0

    assert total_time < 30.0, f"Analysis took {total_time:.2f}s, exceeding 30s threshold"
    assert profile.traction_anomaly_detected is True
    assert profile.robot_kinematics["chassis_type"] == "tiago_mobile_manipulator"
    assert profile.observed_max_slip_ratio > 0.5
    assert any("EMERGENCY_ESTOP_TRIGGERED" in obs for obs in profile.empirical_observations)

