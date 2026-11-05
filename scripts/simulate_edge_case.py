"""
Diffraction Multi-Scenario Edge Case Simulator.
Simulates alternative real-world failure modes:
1. 'optical_glare_estop': Direct sunlight whiteout blinding camera & triggering false LiDAR phantom emergency stop.
2. 'pedestrian_crosswalk_breach': Worker abruptly crossing into AMR safety field, triggering emergency deceleration.
3. 'high_speed_skid': Heavy payload pallet tugger losing traction on a fast blind turn.
"""

import math
import os
import sys
import time
from typing import Optional

# Ensure workspace root in path
sys.path.insert(0, ".")

from edge.edge_agent import EdgeTelemetryAgent
from edge.trigger_detector import TriggerEvent, TriggerType


def simulate_optical_glare_estop(output_dir: str = "./storage/telemetry_drops") -> str:
    """
    Edge Case: Optical Glare Blinding & Emergency E-Stop.
    An automated forklift (amr_reach_019) approaching an open exterior bay door at 1.2 m/s.
    Intense direct sunlight (88,000 lux) washes out the front stereo vision sensor,
    and specular reflection off the wet dock leveler triggers an emergency E-stop.
    """
    print("\n" + "=" * 76)
    print("  DIFFRACTION // EDGE CASE SIMULATION: OPTICAL GLARE & SENSOR BLINDING")
    print("  Scenario: Automated Forklift at Dallas Fulfillment Center - Bay 4")
    print("=" * 76)

    exported_file_path = None

    def on_incident_exported(file_path: str, trigger):
        nonlocal exported_file_path
        exported_file_path = file_path
        print(f"\n[SENTINEL CAPTURE] Exported Incident MCAP: {file_path}")

    agent = EdgeTelemetryAgent(
        robot_id="amr_reach_019",
        urdf_hash="sha256_reach_truck_v2",
        facility_id="dallas_fulfillment_bay4",
        buffer_duration_seconds=10.0,
        post_incident_seconds=1.5,
        output_directory=output_dir,
        on_incident_callback=on_incident_exported,
    )

    start_time = time.time()
    hz = 20
    dt = 1.0 / hz

    print("[FORKLIFT STATE] Traveling at 1.15 m/s toward Exterior Dock Door 4...")
    # 1. 2.5 seconds of high-speed transit
    for i in range(50):
        t = i * dt
        now_ns = int((start_time + t) * 1e9)

        # Forward movement along X
        target_pose = {"x": round(t * 1.15, 3), "y": 0.0, "z": 0.0, "yaw": 0.0}
        current_pose = {"x": round(t * 1.15, 3), "y": 0.01 * math.sin(i * 0.2), "z": 0.0, "yaw": 0.0}

        agent.ingest_sensor_message("/camera/rgb/image_raw", {"lux_estimate": 950.0, "contrast_ratio": 0.85, "frame": i}, timestamp_ns=now_ns)
        agent.ingest_sensor_message("/lidar/points", {"point_count": 2048, "valid_return_ratio": 0.98}, timestamp_ns=now_ns)
        agent.ingest_sensor_message("/joint_states", {"left_wheel": 1.15 / 0.15, "right_wheel": 1.15 / 0.15}, timestamp_ns=now_ns)
        agent.process_odometry(current_pose, target_pose, linear_velocity=1.15, timestamp_ns=now_ns)
        time.sleep(0.01)

    print("[CRITICAL EVENT] Entering Direct Outdoor Sunlight: Specular Glare spikes to 88,500 Lux!")
    print("[CRITICAL EVENT] Camera exposure saturates (whiteout). Specular glare off metal plate triggers E-Stop!")

    # 2. Inject Glare & Emergency E-stop at i=51
    t = 51 * dt
    now_ns = int((start_time + t) * 1e9)

    # Ingest blinded camera frame & phantom point cloud
    agent.ingest_sensor_message("/camera/rgb/image_raw", {"lux_estimate": 88500.0, "glare_saturation_pct": 98.5, "frame": 51}, timestamp_ns=now_ns)
    agent.ingest_sensor_message("/lidar/points", {"point_count": 64, "phantom_obstacle_detected": True}, timestamp_ns=now_ns)

    # Sudden emergency deceleration from 1.15 m/s to 0.0 in 0.2s (Decel = 5.75 m/s2 > 3.5 m/s2 threshold!)
    current_pose = {"x": 2.90, "y": 0.05, "z": 0.0, "yaw": 0.02}
    target_pose = {"x": 2.95, "y": 0.0, "z": 0.0, "yaw": 0.0}

    # Trigger abrupt emergency E-stop due to optical glare saturation
    agent.process_safety_estop({"estop_engaged": True, "source": "optical_glare_phantom_stop", "code": 4}, timestamp_ns=now_ns)
    agent.process_odometry(current_pose, target_pose, linear_velocity=0.0, timestamp_ns=now_ns)

    # 3. Stream post-incident recovery
    print("[FORKLIFT STATE] Capturing post-incident recovery buffer...")
    for j in range(25):
        t_post = (52 + j) * dt
        now_ns = int((start_time + t_post) * 1e9)
        agent.ingest_sensor_message("/camera/rgb/image_raw", {"lux_estimate": 82000.0, "whiteout": True}, timestamp_ns=now_ns)
        time.sleep(0.06)

    time.sleep(1.8)
    return exported_file_path


if __name__ == "__main__":
    path = simulate_optical_glare_estop()
    print(f"\n[DONE] Generated Edge Case MCAP: {path}")
