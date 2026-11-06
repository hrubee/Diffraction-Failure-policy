"""
Diffraction Multi-Scenario Enterprise Edge Case Simulator.
Simulates the 5 Core Physical AI Failure Classes in Autonomous Robotics Fleets:
1. 'traction_slip': Dynamic wheel traction loss on low-μ surface (wet ramp, condensation, epoxy dust).
2. 'optical_glare': Outdoor dock sunlight whiteout blinding camera & false LiDAR specular E-stop.
3. 'actuator_latency': ROS 2 DDS middleware queue saturation / CAN-bus latency causing steering oscillation.
4. 'pedestrian_pinch': Human worker stepping into blind crosswalk, violating ISO 3691-4 clearance envelope.
5. 'payload_shift': Centrifugal pallet mass shift and roll torque during high-speed turn.
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


def simulate_traction_slip(output_dir: str = "./storage/telemetry_drops") -> str:
    """Class 1: Traction Loss on low-friction surface transition."""
    exported_file_path = None

    def on_incident_exported(file_path: str, trigger):
        nonlocal exported_file_path
        exported_file_path = file_path

    agent = EdgeTelemetryAgent(
        robot_id="amr_tugger_042",
        urdf_hash="sha256_tugger_v4",
        facility_id="chicago_hub_bay7",
        buffer_duration_seconds=10.0,
        post_incident_seconds=1.5,
        output_directory=output_dir,
        on_incident_callback=on_incident_exported,
    )

    start_time = time.time()
    hz = 20
    dt = 1.0 / hz

    for i in range(50):
        t = i * dt
        now_ns = int((start_time + t) * 1e9)
        target_pose = {"x": round(t * 0.8, 3), "y": 0.0, "z": 0.0, "yaw": 0.0}
        current_pose = {"x": round(t * 0.8 + 0.01 * math.sin(i), 3), "y": 0.02 * math.cos(i), "z": 0.0, "yaw": 0.0}
        agent.ingest_sensor_message("/camera/rgb/image_raw", f"<frame_{i}>", timestamp_ns=now_ns)
        agent.ingest_sensor_message("/joint_states", {"left_wheel": t * 2.0, "right_wheel": t * 2.0}, timestamp_ns=now_ns)
        agent.process_odometry(current_pose, target_pose, linear_velocity=0.8, timestamp_ns=now_ns)
        time.sleep(0.005)

    # Inject traction slip
    t = 51 * dt
    now_ns = int((start_time + t) * 1e9)
    target_pose = {"x": 2.5, "y": 0.0, "z": 0.0, "yaw": 0.0}
    deviated_pose = {"x": 2.45, "y": 0.62, "z": 0.0, "yaw": 0.35}
    agent.process_odometry(deviated_pose, target_pose, linear_velocity=0.3, timestamp_ns=now_ns)

    for j in range(20):
        t_post = (52 + j) * dt
        now_ns = int((start_time + t_post) * 1e9)
        agent.ingest_sensor_message("/camera/rgb/image_raw", f"<post_frame_{j}>", timestamp_ns=now_ns)
        time.sleep(0.04)

    time.sleep(1.8)
    return exported_file_path


def simulate_optical_glare_estop(output_dir: str = "./storage/telemetry_drops") -> str:
    """Class 2: Optical Glare Blinding & Emergency E-Stop."""
    exported_file_path = None

    def on_incident_exported(file_path: str, trigger):
        nonlocal exported_file_path
        exported_file_path = file_path

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

    for i in range(45):
        t = i * dt
        now_ns = int((start_time + t) * 1e9)
        target_pose = {"x": round(t * 1.15, 3), "y": 0.0, "z": 0.0, "yaw": 0.0}
        current_pose = {"x": round(t * 1.15, 3), "y": 0.01 * math.sin(i * 0.2), "z": 0.0, "yaw": 0.0}
        agent.ingest_sensor_message("/camera/rgb/image_raw", {"lux_estimate": 950.0, "contrast_ratio": 0.85, "frame": i}, timestamp_ns=now_ns)
        agent.ingest_sensor_message("/joint_states", {"left_wheel": 7.6, "right_wheel": 7.6}, timestamp_ns=now_ns)
        agent.process_odometry(current_pose, target_pose, linear_velocity=1.15, timestamp_ns=now_ns)
        time.sleep(0.005)

    # Inject Glare & Phantom E-stop
    t = 46 * dt
    now_ns = int((start_time + t) * 1e9)
    agent.ingest_sensor_message("/camera/rgb/image_raw", {"lux_estimate": 88500.0, "glare_saturation_pct": 98.5, "frame": 46}, timestamp_ns=now_ns)
    agent.ingest_sensor_message("/lidar/points", {"point_count": 64, "phantom_obstacle_detected": True}, timestamp_ns=now_ns)
    current_pose = {"x": 2.70, "y": 0.02, "z": 0.0, "yaw": 0.0}
    target_pose = {"x": 2.75, "y": 0.0, "z": 0.0, "yaw": 0.0}
    agent.process_safety_estop({"estop_engaged": True, "source": "optical_glare_phantom_stop", "code": 4}, timestamp_ns=now_ns)
    agent.process_odometry(current_pose, target_pose, linear_velocity=0.0, timestamp_ns=now_ns)

    for j in range(20):
        t_post = (47 + j) * dt
        now_ns = int((start_time + t_post) * 1e9)
        agent.ingest_sensor_message("/camera/rgb/image_raw", {"lux_estimate": 82000.0, "whiteout": True}, timestamp_ns=now_ns)
        time.sleep(0.04)

    time.sleep(1.8)
    return exported_file_path


def simulate_actuator_latency_hunting(output_dir: str = "./storage/telemetry_drops") -> str:
    """Class 3: DDS / CAN Bus Actuator Latency Jitter causing Sinusoidal Steering Oscillation."""
    exported_file_path = None

    def on_incident_exported(file_path: str, trigger):
        nonlocal exported_file_path
        exported_file_path = file_path

    agent = EdgeTelemetryAgent(
        robot_id="amr_carrier_008",
        urdf_hash="sha256_heavy_carrier_v1",
        facility_id="rotterdam_port_dockA",
        buffer_duration_seconds=10.0,
        post_incident_seconds=1.5,
        output_directory=output_dir,
        on_incident_callback=on_incident_exported,
    )

    start_time = time.time()
    hz = 20
    dt = 1.0 / hz

    for i in range(40):
        t = i * dt
        now_ns = int((start_time + t) * 1e9)
        target_pose = {"x": round(t * 1.5, 3), "y": 0.0, "z": 0.0, "yaw": 0.0}
        current_pose = {"x": round(t * 1.5, 3), "y": 0.01 * math.sin(i * 0.3), "z": 0.0, "yaw": 0.0}
        agent.ingest_sensor_message("/diagnostics", {"dds_latency_ms": 14.5, "can_queue_depth": 2}, timestamp_ns=now_ns)
        agent.process_odometry(current_pose, target_pose, linear_velocity=1.5, timestamp_ns=now_ns)
        time.sleep(0.005)

    # Inject 185ms DDS latency jitter: robot oscillates severely across aisle
    for k in range(12):
        t = (41 + k) * dt
        now_ns = int((start_time + t) * 1e9)
        oscillation_y = 0.52 * math.sin(k * 0.8)
        target_pose = {"x": round(t * 1.5, 3), "y": 0.0, "z": 0.0, "yaw": 0.0}
        current_pose = {"x": round(t * 1.5, 3), "y": round(oscillation_y, 3), "z": 0.0, "yaw": round(oscillation_y * 0.6, 2)}
        agent.ingest_sensor_message("/diagnostics", {"dds_latency_ms": 185.0, "can_dropped_frames": 18}, timestamp_ns=now_ns)
        agent.process_odometry(current_pose, target_pose, linear_velocity=1.4, timestamp_ns=now_ns)
        time.sleep(0.01)

    time.sleep(1.8)
    return exported_file_path


def simulate_dynamic_pedestrian_pinch(output_dir: str = "./storage/telemetry_drops") -> str:
    """Class 4: ISO 3691-4 Blind-Corner Worker Clearance Breach."""
    exported_file_path = None

    def on_incident_exported(file_path: str, trigger):
        nonlocal exported_file_path
        exported_file_path = file_path

    agent = EdgeTelemetryAgent(
        robot_id="amr_lifter_104",
        urdf_hash="sha256_pallet_lifter_v3",
        facility_id="chicago_hub_zoneC",
        buffer_duration_seconds=10.0,
        post_incident_seconds=1.5,
        output_directory=output_dir,
        on_incident_callback=on_incident_exported,
    )

    start_time = time.time()
    hz = 20
    dt = 1.0 / hz

    for i in range(45):
        t = i * dt
        now_ns = int((start_time + t) * 1e9)
        target_pose = {"x": round(t * 1.2, 3), "y": 0.0, "z": 0.0, "yaw": 0.0}
        current_pose = {"x": round(t * 1.2, 3), "y": 0.0, "z": 0.0, "yaw": 0.0}
        agent.ingest_sensor_message("/lidar/points", {"nearest_obstacle_dist_m": 4.5, "in_envelope": False}, timestamp_ns=now_ns)
        agent.process_odometry(current_pose, target_pose, linear_velocity=1.2, timestamp_ns=now_ns)
        time.sleep(0.005)

    # Worker steps out from blind corner at distance 0.42m < 0.50m ISO 3691-4 safety limit
    t = 46 * dt
    now_ns = int((start_time + t) * 1e9)
    agent.ingest_sensor_message("/lidar/points", {"nearest_obstacle_dist_m": 0.42, "iso_breach": True, "object_type": "pedestrian"}, timestamp_ns=now_ns)
    current_pose = {"x": 2.40, "y": 0.0, "z": 0.0, "yaw": 0.0}
    target_pose = {"x": 2.45, "y": 0.0, "z": 0.0, "yaw": 0.0}
    agent.process_safety_estop({"estop_engaged": True, "source": "iso_3691_4_clearance_violation", "code": 12}, timestamp_ns=now_ns)
    agent.process_odometry(current_pose, target_pose, linear_velocity=0.0, timestamp_ns=now_ns)

    time.sleep(1.8)
    return exported_file_path


def simulate_payload_mass_shift(output_dir: str = "./storage/telemetry_drops") -> str:
    """Class 5: Asymmetric High-Payload Centrifugal Mass Shift and Tip-Over Risk."""
    exported_file_path = None

    def on_incident_exported(file_path: str, trigger):
        nonlocal exported_file_path
        exported_file_path = file_path

    agent = EdgeTelemetryAgent(
        robot_id="amr_heavy_012",
        urdf_hash="sha256_heavy_stacker_v2",
        facility_id="atlanta_hub_rack9",
        buffer_duration_seconds=10.0,
        post_incident_seconds=1.5,
        output_directory=output_dir,
        on_incident_callback=on_incident_exported,
    )

    start_time = time.time()
    hz = 20
    dt = 1.0 / hz

    for i in range(40):
        t = i * dt
        now_ns = int((start_time + t) * 1e9)
        target_pose = {"x": round(t * 1.0, 3), "y": 0.0, "z": 0.0, "yaw": 0.0}
        current_pose = {"x": round(t * 1.0, 3), "y": 0.0, "z": 0.0, "yaw": 0.0}
        agent.ingest_sensor_message("/payload/weight", {"weight_kg": 850.0, "cog_offset_m": 0.05}, timestamp_ns=now_ns)
        agent.process_odometry(current_pose, target_pose, linear_velocity=1.0, timestamp_ns=now_ns)
        time.sleep(0.005)

    # Sharp 90 degree turn with high payload causes centrifugal shift and lateral skid
    t = 41 * dt
    now_ns = int((start_time + t) * 1e9)
    agent.ingest_sensor_message("/payload/weight", {"weight_kg": 850.0, "cog_offset_m": 0.28, "roll_torque_nm": 640.0}, timestamp_ns=now_ns)
    current_pose = {"x": 2.10, "y": 0.48, "z": 0.0, "yaw": 0.85}
    target_pose = {"x": 2.20, "y": 0.10, "z": 0.0, "yaw": 1.57}
    agent.process_odometry(current_pose, target_pose, linear_velocity=0.4, timestamp_ns=now_ns)

    time.sleep(1.8)
    return exported_file_path


SCENARIO_SIMULATORS = {
    "traction_slip": simulate_traction_slip,
    "optical_glare": simulate_optical_glare_estop,
    "actuator_latency": simulate_actuator_latency_hunting,
    "pedestrian_pinch": simulate_dynamic_pedestrian_pinch,
    "payload_shift": simulate_payload_mass_shift,
}
