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


def simulate_humanoid_zmp_slip(output_dir: str = "./storage/telemetry_drops") -> str:
    """Modality 1: Bipedal Humanoid - Dynamic Zero-Moment Point (ZMP) Foot Slip & Balance Fault."""
    exported_file_path = None

    def on_incident_exported(file_path: str, trigger):
        nonlocal exported_file_path
        exported_file_path = file_path

    agent = EdgeTelemetryAgent(
        robot_id="humanoid_digit_03",
        urdf_hash="sha256_biped_digit_v3",
        facility_id="munich_robotics_proving_ground",
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
        target_pose = {"x": round(t * 0.6, 3), "y": 0.0, "z": 0.95, "yaw": 0.0}
        current_pose = {"x": round(t * 0.6, 3), "y": 0.01 * math.sin(i * 0.5), "z": 0.95, "yaw": 0.0}
        agent.ingest_sensor_message("/humanoid/zmp", {"zmp_x": 0.02, "zmp_y": 0.01, "support_foot": "left"}, timestamp_ns=now_ns)
        agent.ingest_sensor_message("/joint_states", {"hip_pitch": 0.12, "knee": 0.35, "ankle": -0.22}, timestamp_ns=now_ns)
        agent.process_odometry(current_pose, target_pose, linear_velocity=0.6, timestamp_ns=now_ns)
        time.sleep(0.005)

    # Foot slips on slick grating: ZMP exits support polygon, triggering balance recovery E-stop
    t = 41 * dt
    now_ns = int((start_time + t) * 1e9)
    agent.ingest_sensor_message("/humanoid/zmp", {"zmp_x": 0.18, "zmp_y": -0.24, "margin_violated": True}, timestamp_ns=now_ns)
    current_pose = {"x": 1.25, "y": -0.32, "z": 0.82, "yaw": -0.28}
    target_pose = {"x": 1.30, "y": 0.0, "z": 0.95, "yaw": 0.0}
    agent.process_safety_estop({"estop_engaged": True, "source": "iso_13482_zmp_instability", "roll_deg": 14.2}, timestamp_ns=now_ns)
    agent.process_odometry(current_pose, target_pose, linear_velocity=0.1, timestamp_ns=now_ns)

    time.sleep(1.8)
    return exported_file_path


def simulate_heavy_hauler_grade_skid(output_dir: str = "./storage/telemetry_drops") -> str:
    """Modality 2: Heavy Off-Highway Autonomous Hauler - 12-Ton Incline Grade Braking Slide."""
    exported_file_path = None

    def on_incident_exported(file_path: str, trigger):
        nonlocal exported_file_path
        exported_file_path = file_path

    agent = EdgeTelemetryAgent(
        robot_id="hauler_titan_09",
        urdf_hash="sha256_titan_hauler_12t",
        facility_id="nevada_heavy_proving_ground",
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
        target_pose = {"x": round(t * 1.8, 3), "y": 0.0, "z": 0.0, "yaw": 0.0}
        current_pose = {"x": round(t * 1.8, 3), "y": 0.0, "z": 0.0, "yaw": 0.0}
        agent.ingest_sensor_message("/hauler/payload", {"gross_weight_kg": 12500.0, "grade_incline_pct": 12.0}, timestamp_ns=now_ns)
        agent.process_odometry(current_pose, target_pose, linear_velocity=1.8, timestamp_ns=now_ns)
        time.sleep(0.005)

    # Emergency braking on loose unpaved aggregate causes brake slide beyond ISO 17757 margin
    t = 41 * dt
    now_ns = int((start_time + t) * 1e9)
    current_pose = {"x": 3.85, "y": 0.45, "z": 0.0, "yaw": 0.12}
    target_pose = {"x": 3.20, "y": 0.0, "z": 0.0, "yaw": 0.0}
    agent.process_safety_estop({"estop_engaged": True, "source": "iso_17757_braking_exceeded", "slide_dist_m": 1.85}, timestamp_ns=now_ns)
    agent.process_odometry(current_pose, target_pose, linear_velocity=0.0, timestamp_ns=now_ns)

    time.sleep(1.8)
    return exported_file_path


def simulate_manipulator_wrench_fault(output_dir: str = "./storage/telemetry_drops") -> str:
    """Modality 3: 6-DOF Industrial Robotic Manipulator - Contact Force & Joint Torque Spike."""
    exported_file_path = None

    def on_incident_exported(file_path: str, trigger):
        nonlocal exported_file_path
        exported_file_path = file_path

    agent = EdgeTelemetryAgent(
        robot_id="arm_ur16e_cell2",
        urdf_hash="sha256_ur16e_manipulator",
        facility_id="stuttgart_automation_lab",
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
        target_pose = {"x": round(0.4 + t * 0.01, 3), "y": 0.2, "z": 0.5, "yaw": 0.0}
        current_pose = {"x": round(0.4 + t * 0.01, 3), "y": 0.2, "z": 0.5, "yaw": 0.0}
        agent.ingest_sensor_message("/arm/tcp_wrench", {"force_n": 35.0, "torque_nm": 12.0}, timestamp_ns=now_ns)
        agent.process_odometry(current_pose, target_pose, linear_velocity=0.4, timestamp_ns=now_ns)
        time.sleep(0.005)

    # Tool center point wrench spikes beyond ISO/TS 15066 140N collaborative limit
    t = 41 * dt
    now_ns = int((start_time + t) * 1e9)
    agent.ingest_sensor_message("/arm/tcp_wrench", {"force_n": 195.0, "torque_nm": 88.0, "iso_15066_breach": True}, timestamp_ns=now_ns)
    current_pose = {"x": 0.42, "y": 0.28, "z": 0.48, "yaw": 0.15}
    target_pose = {"x": 0.42, "y": 0.20, "z": 0.50, "yaw": 0.0}
    agent.process_safety_estop({"estop_engaged": True, "source": "iso_10218_force_threshold_exceeded"}, timestamp_ns=now_ns)
    agent.process_odometry(current_pose, target_pose, linear_velocity=0.0, timestamp_ns=now_ns)

    time.sleep(1.8)
    return exported_file_path


def simulate_wheeled_amr_stopping_breach(output_dir: str = "./storage/telemetry_drops") -> str:
    """Modality 4: Wheeled Industrial Mobile Platform - Degraded Surface Dynamic Stopping Breach."""
    return simulate_traction_slip(output_dir=output_dir)


def simulate_urban_rover_pedestrian_glare(output_dir: str = "./storage/telemetry_drops") -> str:
    """Modality 5: Last-Mile Sidewalk Delivery Rover - Crosswalk Sunlight Washout & False E-Stop."""
    exported_file_path = None

    def on_incident_exported(file_path: str, trigger):
        nonlocal exported_file_path
        exported_file_path = file_path

    agent = EdgeTelemetryAgent(
        robot_id="rover_scout_08",
        urdf_hash="sha256_scout_delivery_rover",
        facility_id="tokyo_urban_mobility_hub",
        buffer_duration_seconds=10.0,
        post_incident_seconds=1.5,
        output_directory=output_dir,
        on_incident_callback=on_incident_exported,
    )

    start_time = time.time()
    hz = 20
    dt = 1.0 / hz

    for i in range(35):
        t = i * dt
        now_ns = int((start_time + t) * 1e9)
        target_pose = {"x": round(t * 1.2, 3), "y": 0.0, "z": 0.0, "yaw": 0.0}
        current_pose = {"x": round(t * 1.2, 3), "y": 0.0, "z": 0.0, "yaw": 0.0}
        agent.ingest_sensor_message("/camera/ambient_lux", {"lux": 12000.0}, timestamp_ns=now_ns)
        agent.process_odometry(current_pose, target_pose, linear_velocity=1.2, timestamp_ns=now_ns)
        time.sleep(0.005)

    # Rover enters open intersection: sunset glare at 92,000 Lux washes out camera, triggering phantom stop
    t = 36 * dt
    now_ns = int((start_time + t) * 1e9)
    agent.ingest_sensor_message("/camera/ambient_lux", {"lux": 92000.0, "camera_saturated": True}, timestamp_ns=now_ns)
    current_pose = {"x": 2.20, "y": 0.0, "z": 0.0, "yaw": 0.0}
    target_pose = {"x": 3.0, "y": 0.0, "z": 0.0, "yaw": 0.0}
    agent.process_safety_estop({"estop_engaged": True, "source": "optical_saturation_phantom_obstacle"}, timestamp_ns=now_ns)
    agent.process_odometry(current_pose, target_pose, linear_velocity=0.0, timestamp_ns=now_ns)

    time.sleep(1.8)
    return exported_file_path


SCENARIO_SIMULATORS = {
    # Universal Multi-Modal Robotics Classes
    "humanoid_zmp_slip": simulate_humanoid_zmp_slip,
    "heavy_hauler_skid": simulate_heavy_hauler_grade_skid,
    "manipulator_wrench_fault": simulate_manipulator_wrench_fault,
    "wheeled_amr_stopping_breach": simulate_wheeled_amr_stopping_breach,
    "urban_rover_glare": simulate_urban_rover_pedestrian_glare,
    # Backward compatibility aliases
    "traction_slip": simulate_wheeled_amr_stopping_breach,
    "optical_glare": simulate_urban_rover_pedestrian_glare,
    "actuator_latency": simulate_manipulator_wrench_fault,
    "pedestrian_pinch": simulate_humanoid_zmp_slip,
    "payload_shift": simulate_heavy_hauler_grade_skid,
}
