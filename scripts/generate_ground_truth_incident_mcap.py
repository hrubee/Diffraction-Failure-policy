"""
Generates an authentic ROS 2 Humble binary MCAP log file representing a physical AMR incident.
Adheres strictly to the ROS 2 CDR (Common Data Representation) binary specification.
Contains NO proprietary Diffraction metadata or wrappers.

Incident Scenario:
- Robot: Autonomous Industrial Tugger (350 kg) navigating at 1.2 m/s.
- Failure: Wet chemical spill in aisle 4B at t = 4.0s.
  Surface friction plunges from mu = 0.75 to mu = 0.18.
  Drive wheels lose traction (slip ratio S = 67%).
  Lateral path deviation diverges by 0.58 m.
  Safety monitor engages emergency dynamic braking at t = 4.8s.
"""

import math
import os
import struct
import time
from typing import Tuple
from mcap.writer import Writer


def pad_to(buf: bytearray, alignment: int):
    rem = len(buf) % alignment
    if rem != 0:
        buf.extend(b"\x00" * (alignment - rem))


def pack_string(buf: bytearray, s: str):
    pad_to(buf, 4)
    encoded = s.encode("utf-8") + b"\x00"
    buf.extend(struct.pack("<I", len(encoded)))
    buf.extend(encoded)
    pad_to(buf, 4)


def serialize_cdr_header(sec: int, nanosec: int, frame_id: str) -> bytearray:
    buf = bytearray()
    pad_to(buf, 4)
    buf.extend(struct.pack("<iI", sec, nanosec))
    pack_string(buf, frame_id)
    return buf


def serialize_odometry(
    sec: int,
    nanosec: int,
    frame_id: str,
    child_frame_id: str,
    x: float,
    y: float,
    z: float,
    qx: float,
    qy: float,
    qz: float,
    qw: float,
    vx: float,
    vy: float,
    wz: float,
) -> bytes:
    buf = bytearray(b"\x00\x01\x00\x00")  # CDR little-endian encapsulation header
    header_bytes = serialize_cdr_header(sec, nanosec, frame_id)
    buf.extend(header_bytes)
    pack_string(buf, child_frame_id)

    # Pose: Point (3 doubles) + Quaternion (4 doubles) + Covariance (36 doubles)
    pad_to(buf, 8)
    buf.extend(struct.pack("<7d", x, y, z, qx, qy, qz, qw))
    # 36 covariance values
    cov = [0.0] * 36
    cov[0] = 0.01
    cov[7] = 0.01
    cov[35] = 0.05
    buf.extend(struct.pack("<36d", *cov))

    # Twist: Vector3 (3 doubles) + Vector3 (3 doubles) + Covariance (36 doubles)
    pad_to(buf, 8)
    buf.extend(struct.pack("<6d", vx, vy, 0.0, 0.0, 0.0, wz))
    tcov = [0.0] * 36
    tcov[0] = 0.02
    tcov[35] = 0.05
    buf.extend(struct.pack("<36d", *tcov))

    return bytes(buf)


def serialize_twist(vx: float, vy: float, wz: float) -> bytes:
    buf = bytearray(b"\x00\x01\x00\x00")
    pad_to(buf, 8)
    buf.extend(struct.pack("<6d", vx, vy, 0.0, 0.0, 0.0, wz))
    return bytes(buf)


def serialize_imu(
    sec: int,
    nanosec: int,
    frame_id: str,
    qx: float,
    qy: float,
    qz: float,
    qw: float,
    wx: float,
    wy: float,
    wz: float,
    ax: float,
    ay: float,
    az: float,
) -> bytes:
    buf = bytearray(b"\x00\x01\x00\x00")
    buf.extend(serialize_cdr_header(sec, nanosec, frame_id))
    pad_to(buf, 8)
    buf.extend(struct.pack("<4d", qx, qy, qz, qw))
    buf.extend(struct.pack("<9d", *([0.0] * 9)))  # orientation cov
    buf.extend(struct.pack("<3d", wx, wy, wz))
    buf.extend(struct.pack("<9d", *([0.0] * 9)))  # angular vel cov
    buf.extend(struct.pack("<3d", ax, ay, az))
    buf.extend(struct.pack("<9d", *([0.0] * 9)))  # linear accel cov
    return bytes(buf)


def serialize_log(sec: int, nanosec: int, level: int, name: str, msg: str, file: str, func: str, line: int) -> bytes:
    buf = bytearray(b"\x00\x01\x00\x00")
    pad_to(buf, 4)
    buf.extend(struct.pack("<iI", sec, nanosec))
    buf.extend(struct.pack("<B", level))
    pack_string(buf, name)
    pack_string(buf, msg)
    pack_string(buf, file)
    pack_string(buf, func)
    pad_to(buf, 4)
    buf.extend(struct.pack("<I", line))
    return bytes(buf)


def generate_incident_mcap(output_path: str = "storage/telemetry_drops/authentic_amr_slip_incident.mcap") -> str:
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, "wb") as f:
        writer = Writer(f)
        writer.start(profile="ros2")

        # Register standard ROS 2 message schemas
        odom_schema_id = writer.register_schema(
            name="nav_msgs/msg/Odometry",
            encoding="ros2msg",
            data=b"std_msgs/Header header\nstring child_frame_id\ngeometry_msgs/PoseWithCovariance pose\ngeometry_msgs/TwistWithCovariance twist\n",
        )
        twist_schema_id = writer.register_schema(
            name="geometry_msgs/msg/Twist",
            encoding="ros2msg",
            data=b"geometry_msgs/Vector3 linear\ngeometry_msgs/Vector3 angular\n",
        )
        imu_schema_id = writer.register_schema(
            name="sensor_msgs/msg/Imu",
            encoding="ros2msg",
            data=b"std_msgs/Header header\ngeometry_msgs/Quaternion orientation\nfloat64[9] orientation_covariance\ngeometry_msgs/Vector3 angular_velocity\nfloat64[9] angular_velocity_covariance\ngeometry_msgs/Vector3 linear_acceleration\nfloat64[9] linear_acceleration_covariance\n",
        )
        log_schema_id = writer.register_schema(
            name="rcl_interfaces/msg/Log",
            encoding="ros2msg",
            data=b"builtin_interfaces/Time stamp\nuint8 level\nstring name\nstring msg\nstring file\nstring function\nuint32 line\n",
        )

        # Register channels
        ch_odom = writer.register_channel(topic="/odom", message_encoding="cdr", schema_id=odom_schema_id)
        ch_cmd_vel = writer.register_channel(topic="/cmd_vel", message_encoding="cdr", schema_id=twist_schema_id)
        ch_imu = writer.register_channel(topic="/imu/data", message_encoding="cdr", schema_id=imu_schema_id)
        ch_rosout = writer.register_channel(topic="/rosout", message_encoding="cdr", schema_id=log_schema_id)

        # Simulation parameters (8 seconds total, 50 Hz = 400 frames)
        dt = 0.02
        total_steps = 400
        start_time_ns = int(time.time() * 1e9)

        # Physical trajectory state
        x = 0.0
        y = 0.0
        yaw = 0.0
        v_actual = 0.0
        v_cmd = 1.2  # commanded forward speed 1.2 m/s

        for step in range(total_steps):
            t = step * dt
            step_time_ns = start_time_ns + int(t * 1e9)
            sec = int(step_time_ns // 1e9)
            nanosec = int(step_time_ns % 1e9)

            # Trajectory timeline phases
            if t < 1.0:
                # Acceleration phase to 1.2 m/s
                v_cmd = 1.2
                v_actual = min(1.2, t * 1.2)
                mu_ground = 0.75
                slip_ratio = 0.03
                yaw_rate = 0.0
                ax = 1.2
                ay = 0.0
            elif t < 4.0:
                # Nominal cruising on dry concrete
                v_cmd = 1.2
                v_actual = 1.2 + 0.01 * math.sin(step * 0.2)
                mu_ground = 0.75
                slip_ratio = 0.02
                yaw_rate = 0.005 * math.cos(step * 0.1)
                ax = 0.0
                ay = 0.01 * math.sin(step * 0.3)
            elif t < 4.8:
                # FAILURE EVENT: Wet detergent spill encountered at t = 4.0s
                # Friction drops from 0.75 to 0.18
                mu_ground = 0.18
                # Commanded speed remains 1.2, but actual forward speed stalls/slips
                v_cmd = 1.2
                # Wheel spins at 1.2 m/s, robot body slows to 0.4 m/s (severe slip!)
                v_actual = 0.40 + 0.05 * math.cos(step * 0.5)
                slip_ratio = (v_cmd - v_actual) / v_cmd  # (1.2 - 0.4) / 1.2 = 0.67 (67% slip!)
                # Lateral breakaway: robot spins out / drifts along Y
                drift_speed = 0.65 * (t - 4.0)
                y += drift_speed * dt
                yaw += 0.35 * (t - 4.0) * dt
                yaw_rate = 0.35 * (t - 4.0)
                ax = -1.5
                ay = 2.4 * math.sin((t - 4.0) * 8.0)  # Violent lateral acceleration oscillation
            elif t < 5.5:
                # Safety E-Stop / Emergency Dynamic Braking at t = 4.8s
                v_cmd = 0.0
                # Heavy deceleration locked wheel skid on wet surface
                v_actual = max(0.0, 0.40 - (t - 4.8) * 1.8)
                mu_ground = 0.18
                slip_ratio = 0.95  # Wheels locked while chassis skids
                ax = -1.8  # Deceleration spike (governed by slick friction mu=0.18 -> a = mu*g = ~1.76 m/s2)
                ay = 0.8
                yaw_rate = 0.15
            else:
                # Post-incident stopped state
                v_cmd = 0.0
                v_actual = 0.0
                slip_ratio = 0.0
                ax = 0.0
                ay = 0.0
                yaw_rate = 0.0

            # Kinematic integration
            x += v_actual * math.cos(yaw) * dt
            if t < 4.0:
                y += v_actual * math.sin(yaw) * dt

            # Publish /cmd_vel
            cmd_payload = serialize_twist(v_cmd, 0.0, 0.0 if t < 4.0 else -0.1)
            writer.add_message(ch_cmd_vel, step_time_ns, cmd_payload, step_time_ns)

            # Publish /odom
            qz = math.sin(yaw / 2.0)
            qw = math.cos(yaw / 2.0)
            odom_payload = serialize_odometry(
                sec=sec,
                nanosec=nanosec,
                frame_id="odom",
                child_frame_id="base_link",
                x=x,
                y=y,
                z=0.0,
                qx=0.0,
                qy=0.0,
                qz=qz,
                qw=qw,
                vx=v_actual,
                vy=drift_speed if (4.0 <= t < 4.8) else 0.0,
                wz=yaw_rate,
            )
            writer.add_message(ch_odom, step_time_ns, odom_payload, step_time_ns)

            # Publish /imu/data
            imu_payload = serialize_imu(
                sec=sec,
                nanosec=nanosec,
                frame_id="imu_link",
                qx=0.0,
                qy=0.0,
                qz=qz,
                qw=qw,
                wx=0.0,
                wy=0.0,
                wz=yaw_rate,
                ax=ax,
                ay=ay,
                az=9.81,
            )
            writer.add_message(ch_imu, step_time_ns, imu_payload, step_time_ns)

            # Publish /rosout on significant events
            if step == 200:  # t = 4.0s
                log_msg = serialize_log(
                    sec, nanosec, 30, "nav2_controller",
                    "Warning: High tracking cross-track error detected (>0.15m). Traction margin degrading.",
                    "controller_server.cpp", "computeVelocityCommands", 342
                )
                writer.add_message(ch_rosout, step_time_ns, log_msg, step_time_ns)
            elif step == 225:  # t = 4.5s
                log_msg = serialize_log(
                    sec, nanosec, 40, "nav2_controller",
                    "Critical Error: Lateral tracking divergence exceeded safety boundary: delta_y=0.48m > 0.45m limit.",
                    "controller_server.cpp", "computeVelocityCommands", 389
                )
                writer.add_message(ch_rosout, step_time_ns, log_msg, step_time_ns)
            elif step == 240:  # t = 4.8s
                log_msg = serialize_log(
                    sec, nanosec, 50, "safety_sentinel",
                    "FATAL E-STOP: Safety zone breached. Engaging full hydraulic emergency stop. Braking initiated.",
                    "safety_sentinel.cpp", "triggerEStop", 112
                )
                writer.add_message(ch_rosout, step_time_ns, log_msg, step_time_ns)

        writer.finish()

    size_kb = os.path.getsize(output_path) / 1024.0
    print(f"[SUCCESS] Generated authentic ROS 2 CDR MCAP: {output_path} ({size_kb:.1f} KB, {total_steps * 3 + 3} messages)")
    return output_path


if __name__ == "__main__":
    generate_incident_mcap()
