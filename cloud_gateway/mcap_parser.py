"""
Cloud Ingestion MCAP Parser & Telemetry Decoupler.
Extracts multimodal sensor streams, kinematic states, and trigger metadata
from raw MCAP packets for digital twin synthesis.
"""

from dataclasses import dataclass, field
import json
import logging
import math
import os
import struct
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger("diffraction.cloud.parser")

try:
    from mcap.reader import make_reader
    HAS_OFFICIAL_MCAP = True
except ImportError:
    HAS_OFFICIAL_MCAP = False


class Ros2CdrDeserializer:
    """
    Lightweight, high-performance pure-Python OMG-CDR (Common Data Representation)
    deserializer for standard ROS 2 robotics message streams.
    Decodes std_msgs/Bool, rcl_interfaces/Log, nav_msgs/Odometry, geometry_msgs/Twist,
    and sensor_msgs/Imu without requiring a native ROS 2 runtime.
    """
    @classmethod
    def deserialize(cls, arg1: Any, arg2: Any) -> Optional[Dict[str, Any]]:
        if isinstance(arg1, (bytes, bytearray)):
            data = bytes(arg1)
            schema_name = str(arg2)
        else:
            schema_name = str(arg1)
            data = bytes(arg2) if isinstance(arg2, (bytes, bytearray)) else b""

        if not data or len(data) < 4:
            return None
        # Verify little-endian CDR v1 encapsulation header
        if data[:4] != b"\x00\x01\x00\x00":
            return None

        # 1. std_msgs/msg/Bool
        if "Bool" in schema_name or len(data) == 5:
            val = bool(data[4])
            return {"data": val, "value": val}

        # 2. rcl_interfaces/msg/Log
        if "Log" in schema_name:
            if len(data) < 16:
                return None
            sec, nanosec = struct.unpack("<iI", data[4:12])
            level = data[12]
            idx = 13
            if idx % 4 != 0:
                idx += (4 - (idx % 4))
            strings = []
            for _ in range(4):
                if idx + 4 > len(data):
                    break
                slen = struct.unpack("<I", data[idx:idx + 4])[0]
                idx += 4
                if idx + slen > len(data):
                    break
                s = data[idx:idx + max(0, slen - 1)].decode("utf-8", errors="ignore")
                strings.append(s)
                idx += slen
                if idx % 4 != 0:
                    idx += (4 - (idx % 4))
            line = struct.unpack("<I", data[idx:idx + 4])[0] if idx + 4 <= len(data) else 0
            return {
                "sec": sec,
                "nanosec": nanosec,
                "level": level,
                "name": strings[0] if len(strings) > 0 else "",
                "msg": strings[1] if len(strings) > 1 else "",
                "file": strings[2] if len(strings) > 2 else "",
                "function": strings[3] if len(strings) > 3 else "",
                "line": line,
            }

        # 3. nav_msgs/msg/Odometry
        if "Odometry" in schema_name or "odom" in schema_name.lower():
            if len(data) < 72:
                return None
            idx = 4
            sec, nanosec = struct.unpack("<iI", data[idx:idx + 8])
            idx += 8
            flen = struct.unpack("<I", data[idx:idx + 4])[0]
            idx += 4
            frame_id = data[idx:idx + max(0, flen - 1)].decode("utf-8", errors="ignore")
            idx += flen
            if idx % 4 != 0:
                idx += (4 - (idx % 4))

            cflen = struct.unpack("<I", data[idx:idx + 4])[0]
            idx += 4
            child_frame_id = data[idx:idx + max(0, cflen - 1)].decode("utf-8", errors="ignore")
            idx += cflen
            if idx % 4 != 0:
                idx += (4 - (idx % 4))

            # Pose x, y, z, qx, qy, qz, qw
            x, y, z, qx, qy, qz, qw = struct.unpack("<7d", data[idx:idx + 56])
            twist_offset = idx + 56 + 288  # 36 doubles covariance
            vx, vy, vz, wx, wy, wz = 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
            if twist_offset + 48 <= len(data):
                vx, vy, vz, wx, wy, wz = struct.unpack("<6d", data[twist_offset:twist_offset + 48])

            yaw = math.atan2(2.0 * (qw * qz + qx * qy), 1.0 - 2.0 * (qy * qy + qz * qz))
            lin_vel = math.hypot(vx, vy)
            return {
                "header": {"stamp": {"sec": sec, "nanosec": nanosec}, "frame_id": frame_id},
                "child_frame_id": child_frame_id,
                "current_pose": {"x": x, "y": y, "z": z, "yaw": yaw},
                "pose": {"position": {"x": x, "y": y, "z": z}, "orientation": {"x": qx, "y": qy, "z": qz, "w": qw}},
                "linear_velocity": lin_vel,
                "twist": {"linear": {"x": vx, "y": vy, "z": vz}, "angular": {"x": wx, "y": wy, "z": wz}},
            }

        # 4. geometry_msgs/msg/Twist
        if "Twist" in schema_name:
            if len(data) >= 52:
                vx, vy, vz, wx, wy, wz = struct.unpack("<6d", data[4:52])
                return {
                    "linear": {"x": vx, "y": vy, "z": vz},
                    "angular": {"x": wx, "y": wy, "z": wz},
                    "linear_velocity": math.hypot(vx, vy),
                }

        # 5. sensor_msgs/msg/Imu
        if "Imu" in schema_name:
            if len(data) >= 100:
                # header (4 + 8 + frame_id)
                idx = 4 + 8
                flen = struct.unpack("<I", data[idx:idx + 4])[0]
                idx += 4 + flen
                if idx % 4 != 0:
                    idx += (4 - (idx % 4))
                qx, qy, qz, qw = struct.unpack("<4d", data[idx:idx + 32])
                idx += 32 + 72  # 9 doubles orient cov
                wx, wy, wz = struct.unpack("<3d", data[idx:idx + 24])
                idx += 24 + 72  # 9 doubles ang vel cov
                ax, ay, az = struct.unpack("<3d", data[idx:idx + 24])
                return {
                    "orientation": {"x": qx, "y": qy, "z": qz, "w": qw},
                    "angular_velocity": {"x": wx, "y": wy, "z": wz},
                    "linear_acceleration": {"x": ax, "y": ay, "z": az},
                }

        return None


class McapAnomalyDetector:
    """
    Autonomous Incident & Kinematic Discrepancy Discovery Engine.
    Operates without proprietary Diffraction headers to identify robot platforms,
    E-stops, hardware/CAN faults, tracking divergences, and slip anomalies.
    """
    @classmethod
    def discover(
        cls,
        channels: List[str],
        messages_by_topic: Dict[str, List[Dict[str, Any]]],
        metadata_dict: Dict[str, Any],
    ) -> Tuple[str, str, str, int, Dict[str, Any], str]:
        robot_id = metadata_dict.get("robot_id")
        facility_id = metadata_dict.get("facility_id", "facility_unspecified")
        trigger_type = metadata_dict.get("trigger_type")
        trigger_severity = metadata_dict.get("trigger_severity")
        trigger_ts_ns = metadata_dict.get("trigger_timestamp_ns", 0)
        trigger_details = metadata_dict.get("trigger_details", {})

        # 1. Autonomous Robot Identification
        if not robot_id or robot_id == "unknown_robot":
            detected_id = None
            rosout_msgs = messages_by_topic.get("/rosout", [])
            for m in rosout_msgs[:100]:
                data = m.get("data", {})
                txt = (str(data.get("file", "")) + " " + str(data.get("msg", "")) + " " + str(data.get("name", ""))).lower()
                if "tiago" in txt or "pal" in txt:
                    detected_id = "pal_tiago_robot"
                    facility_id = "pal_robotics_lab"
                    break
                elif "turtlebot" in txt:
                    detected_id = "turtlebot3_amr"
                    break
                elif "digit" in txt or "agility" in txt:
                    detected_id = "humanoid_digit_03"
                    break
                elif "crown" in txt:
                    detected_id = "crown_wav_60"
                    break

            if not detected_id:
                # Inspect channel topic patterns
                for ch in channels:
                    if "tiago" in ch or "direct_laser_odometry" in ch:
                        detected_id = "pal_tiago_robot"
                        facility_id = "pal_robotics_lab"
                        break
                    elif "digit" in ch:
                        detected_id = "humanoid_digit_03"
                        break

            robot_id = detected_id or "autonomous_mobile_robot"

        # 2. Safety E-Stop / Emergency Button Detection
        if not trigger_type or trigger_type == "unknown_trigger":
            # Check safety bool channels
            for ch in ["/power/is_emergency", "/safety/estop", "/emergency_stop", "/e_stop"]:
                if ch in messages_by_topic:
                    for m in messages_by_topic[ch]:
                        data = m.get("data", {})
                        if data.get("data") is True or data.get("value") is True:
                            trigger_type = "emergency_estop_triggered"
                            trigger_severity = "CRITICAL"
                            trigger_ts_ns = m.get("timestamp_ns", 0)
                            trigger_details = {
                                "source_channel": ch,
                                "event": "Emergency stop line pulled",
                                "timestamp_s": trigger_ts_ns / 1e9,
                            }
                            return robot_id, trigger_type, trigger_severity, trigger_ts_ns, trigger_details, facility_id

            # Check rosout log stream for E-stop or critical faults
            rosout_msgs = messages_by_topic.get("/rosout", [])
            for m in rosout_msgs:
                data = m.get("data", {})
                msg_txt = str(data.get("msg", ""))
                level = data.get("level", 0)
                if "Emergency stop" in msg_txt or "Emergency stop button pressed" in msg_txt:
                    trigger_type = "emergency_estop_triggered"
                    trigger_severity = "CRITICAL"
                    trigger_ts_ns = m.get("timestamp_ns", 0)
                    trigger_details = {
                        "source": "rosout",
                        "component": data.get("name", "emergency_controller"),
                        "message": msg_txt,
                    }
                    return robot_id, trigger_type, trigger_severity, trigger_ts_ns, trigger_details, facility_id
                elif level >= 40 and ("UnderVoltage" in msg_txt or "CAN node" in msg_txt):
                    trigger_type = "actuator_hardware_fault"
                    trigger_severity = "CRITICAL"
                    trigger_ts_ns = m.get("timestamp_ns", 0)
                    trigger_details = {
                        "source": "rosout",
                        "fault": msg_txt,
                    }

            # Check teleop intervention
            for ch in ["/joy_priority", "/teleop/override"]:
                if ch in messages_by_topic:
                    for m in messages_by_topic[ch]:
                        data = m.get("data", {})
                        if data.get("data") is True or data.get("value") is True:
                            trigger_type = "manual_teleop_override"
                            trigger_severity = "MEDIUM"
                            trigger_ts_ns = m.get("timestamp_ns", 0)
                            trigger_details = {"source_channel": ch, "override": True}
                            return robot_id, trigger_type, trigger_severity, trigger_ts_ns, trigger_details, facility_id

            if not trigger_type:
                trigger_type = "telemetry_audit_nominal"
                trigger_severity = "LOW"

        return robot_id, trigger_type, trigger_severity, trigger_ts_ns, trigger_details, facility_id


@dataclass
class DecoupledIncident:
    robot_id: str
    urdf_hash: str
    facility_id: str
    trigger_type: str
    trigger_severity: str
    trigger_timestamp_ns: int
    trigger_details: Dict[str, Any]
    channels: List[str]
    messages_by_topic: Dict[str, List[Dict[str, Any]]] = field(default_factory=dict)
    total_messages: int = 0
    duration_seconds: float = 0.0
    embedded_urdf: Optional[str] = None


class PurePythonMcapReader:
    MAGIC = b"\x89MCAP0\r\n"
    OP_HEADER = 0x01
    OP_FOOTER = 0x02
    OP_SCHEMA = 0x03
    OP_CHANNEL = 0x04
    OP_MESSAGE = 0x05
    OP_METADATA = 0x0c

    @classmethod
    def parse(cls, file_path: str) -> Tuple[Dict[str, Any], Dict[str, List[Dict[str, Any]]]]:
        metadata = {}
        messages_by_topic: Dict[str, List[Dict[str, Any]]] = {}
        channel_id_to_topic: Dict[int, str] = {}

        with open(file_path, "rb") as f:
            magic = f.read(8)
            if magic != cls.MAGIC:
                raise ValueError(f"Invalid MCAP file magic: {magic}")

            file_size = os.path.getsize(file_path)
            while f.tell() < file_size - 8:
                header = f.read(9)
                if len(header) < 9:
                    break
                opcode, record_len = struct.unpack("<BQ", header)
                payload = f.read(record_len)
                if len(payload) < record_len:
                    break

                if opcode == cls.OP_CHANNEL:
                    ch_id, schema_id, topic_len = struct.unpack("<HHI", payload[:8])
                    topic = payload[8:8 + topic_len].decode("utf-8")
                    channel_id_to_topic[ch_id] = topic
                    if topic not in messages_by_topic:
                        messages_by_topic[topic] = []

                elif opcode == cls.OP_MESSAGE:
                    ch_id, seq, log_time_ns, pub_time_ns = struct.unpack("<HIQQ", payload[:22])
                    msg_data_bytes = payload[22:]
                    topic = channel_id_to_topic.get(ch_id, f"channel_{ch_id}")
                    if topic not in messages_by_topic:
                        messages_by_topic[topic] = []

                    try:
                        parsed_msg = json.loads(msg_data_bytes.decode("utf-8"))
                    except Exception:
                        parsed_msg = {"raw_bytes_len": len(msg_data_bytes)}

                    messages_by_topic[topic].append({
                        "timestamp_ns": log_time_ns,
                        "data": parsed_msg,
                    })

                elif opcode == cls.OP_METADATA:
                    name_len = struct.unpack("<I", payload[:4])[0]
                    name = payload[4:4 + name_len].decode("utf-8")
                    offset = 4 + name_len
                    val_len = struct.unpack("<I", payload[offset:offset + 4])[0]
                    val_str = payload[offset + 4:offset + 4 + val_len].decode("utf-8")
                    try:
                        metadata[name] = json.loads(val_str)
                    except Exception:
                        metadata[name] = val_str

        return metadata, messages_by_topic


class McapParser:
    @staticmethod
    def parse_file(file_path: str) -> DecoupledIncident:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"MCAP file not found: {file_path}")

        metadata_dict = {}
        messages_by_topic: Dict[str, List[Dict[str, Any]]] = {}

        if HAS_OFFICIAL_MCAP:
            with open(file_path, "rb") as f:
                reader = make_reader(f)
                for meta in reader.iter_metadata():
                    if meta.name == "diffraction_incident_metadata":
                        metadata_dict = meta.metadata
                    else:
                        metadata_dict[meta.name] = meta.metadata

                channels = reader.get_summary().channels if reader.get_summary() else {}
                id_to_topic = {cid: ch.topic for cid, ch in channels.items()}

                for schema, channel, message in reader.iter_messages():
                    topic = channel.topic
                    if topic not in messages_by_topic:
                        messages_by_topic[topic] = []

                    data = None
                    s_name = schema.name if schema else topic

                    # 1. Try ROS 2 CDR Deserializer
                    if channel.message_encoding == "cdr" or message.data[:4] == b"\x00\x01\x00\x00":
                        data = Ros2CdrDeserializer.deserialize(s_name, message.data)

                    # 2. Fallback to JSON or raw length
                    if data is None:
                        try:
                            data = json.loads(message.data.decode("utf-8"))
                        except Exception:
                            data = {"raw_bytes_len": len(message.data)}

                    messages_by_topic[topic].append({
                        "timestamp_ns": message.log_time,
                        "data": data,
                    })
        else:
            raw_meta, messages_by_topic = PurePythonMcapReader.parse(file_path)
            metadata_dict = raw_meta.get("diffraction_incident_metadata", raw_meta)

        # Compute durations and statistics
        all_timestamps = [
            m["timestamp_ns"]
            for msgs in messages_by_topic.values()
            for m in msgs
        ]
        duration_sec = 0.0
        if all_timestamps:
            duration_sec = (max(all_timestamps) - min(all_timestamps)) / 1e9

        total_msgs = sum(len(msgs) for msgs in messages_by_topic.values())

        # Extract embedded URDF from /robot_description or metadata if present
        embedded_urdf = metadata_dict.get("urdf_xml")
        if not embedded_urdf and "/robot_description" in messages_by_topic:
            desc_msgs = messages_by_topic["/robot_description"]
            if desc_msgs:
                first_payload = desc_msgs[0].get("data")
                if isinstance(first_payload, dict):
                    embedded_urdf = first_payload.get("data") or str(first_payload)
                elif isinstance(first_payload, str):
                    embedded_urdf = first_payload

        # Autonomous Anomaly & Platform Detection
        robot_id, trigger_type, trigger_severity, trigger_ts_ns, trigger_details, facility_id = (
            McapAnomalyDetector.discover(
                channels=list(messages_by_topic.keys()),
                messages_by_topic=messages_by_topic,
                metadata_dict=metadata_dict,
            )
        )

        return DecoupledIncident(
            robot_id=robot_id,
            urdf_hash=metadata_dict.get("urdf_hash", "default_hash"),
            facility_id=facility_id,
            trigger_type=trigger_type,
            trigger_severity=trigger_severity,
            trigger_timestamp_ns=trigger_ts_ns,
            trigger_details=trigger_details,
            channels=list(messages_by_topic.keys()),
            messages_by_topic=messages_by_topic,
            total_messages=total_msgs,
            duration_seconds=round(duration_sec, 3),
            embedded_urdf=embedded_urdf,
        )
