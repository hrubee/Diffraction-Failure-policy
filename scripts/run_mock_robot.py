"""
Mock Autonomous Mobile Robot (AMR) Telemetry Simulator.
Simulates a warehouse tugger/forklift running ROS 2 navigation,
injecting a real-world edge-case incident (outdoor dock glare + wet epoxy slip)
to verify that the Edge Telemetry Daemon catches and exports the MCAP package.
"""

import math
import sys
import time

# Ensure workspace root is in python path
sys.path.insert(0, ".")

from edge.edge_agent import EdgeTelemetryAgent


def simulate_warehouse_amr_run(output_dir: str = "./storage/telemetry_drops") -> str:
    print("\n=======================================================")
    print("  DIFFRACTION // ROS 2 EDGE TELEMETRY SENTINEL RUNNER  ")
    print("=======================================================")

    exported_file_path = None

    def on_incident_exported(file_path: str, trigger):
        nonlocal exported_file_path
        exported_file_path = file_path
        print(f"\n[CALLBACK SUCCESS] Exported MCAP packet: {file_path}")

    # Initialize Edge Agent
    agent = EdgeTelemetryAgent(
        robot_id="amr_tugger_042",
        urdf_hash="sha256_b4e98f12a",
        facility_id="chicago_logistics_hub_bay7",
        buffer_duration_seconds=10.0,
        post_incident_seconds=1.5,
        output_directory=output_dir,
        on_incident_callback=on_incident_exported,
    )

    print("[AMR STATE] Robot initialized. Commencing nominal warehouse navigation...")
    start_time = time.time()
    hz = 20
    dt = 1.0 / hz

    # 1. Run 3 seconds of nominal operation
    for i in range(60):
        t = i * dt
        now_ns = int((start_time + t) * 1e9)

        # Target and actual are aligned
        target_pose = {"x": round(t * 0.8, 3), "y": 0.0, "z": 0.0, "yaw": 0.0}
        current_pose = {"x": round(t * 0.8 + 0.01 * math.sin(i), 3), "y": 0.02 * math.cos(i), "z": 0.0, "yaw": 0.0}

        # Ingest sensors
        agent.ingest_sensor_message("/camera/rgb/image_raw", f"<raw_frame_{i}_bytes>", timestamp_ns=now_ns)
        agent.ingest_sensor_message("/lidar/points", {"point_count": 1024, "frame": i}, timestamp_ns=now_ns)
        agent.ingest_sensor_message("/joint_states", {"left_wheel": t * 2.0, "right_wheel": t * 2.0}, timestamp_ns=now_ns)
        agent.process_odometry(current_pose, target_pose, linear_velocity=0.8, timestamp_ns=now_ns)
        time.sleep(0.01)

    print("[AMR STATE] Entering Loading Dock Bay 7: High specular sunlight glare & wet floor detected.")
    print("[AMR STATE] Injecting sudden wheel slip and trajectory deviation...")

    # 2. Inject failure incident at i=61 (lateral drift exceeds 0.45m threshold)
    t = 61 * dt
    now_ns = int((start_time + t) * 1e9)
    target_pose = {"x": 2.5, "y": 0.0, "z": 0.0, "yaw": 0.0}
    deviated_pose = {"x": 2.45, "y": 0.62, "z": 0.0, "yaw": 0.35}  # Deviation = 0.62m > 0.45m!

    agent.process_odometry(deviated_pose, target_pose, linear_velocity=0.3, timestamp_ns=now_ns)

    # 3. Stream post-incident data to allow the post_incident_seconds window to capture
    print("[AMR STATE] Streaming post-incident recovery buffer...")
    for j in range(25):
        t_post = (62 + j) * dt
        now_ns = int((start_time + t_post) * 1e9)
        agent.ingest_sensor_message("/camera/rgb/image_raw", f"<post_frame_{j}_bytes>", timestamp_ns=now_ns)
        time.sleep(0.08)

    # Wait for the post incident timer to finish
    time.sleep(2.0)

    print(f"\n[DONE] Buffer Ring Stats: {agent.ring_buffer.stats()}")
    return exported_file_path


if __name__ == "__main__":
    simulate_warehouse_amr_run()
