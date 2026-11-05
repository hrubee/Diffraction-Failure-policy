"""
Cloud Ingestion MCAP Parser & Telemetry Decoupler.
Extracts multimodal sensor streams, kinematic states, and trigger metadata
from raw MCAP packets for digital twin synthesis.
"""

from dataclasses import dataclass, field
import json
import logging
import os
import struct
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger("diffraction.cloud.parser")

try:
    from mcap.reader import make_reader
    HAS_OFFICIAL_MCAP = True
except ImportError:
    HAS_OFFICIAL_MCAP = False


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

        return DecoupledIncident(
            robot_id=metadata_dict.get("robot_id", "unknown_robot"),
            urdf_hash=metadata_dict.get("urdf_hash", "default_hash"),
            facility_id=metadata_dict.get("facility_id", "facility_unspecified"),
            trigger_type=metadata_dict.get("trigger_type", "unknown_trigger"),
            trigger_severity=metadata_dict.get("trigger_severity", "HIGH"),
            trigger_timestamp_ns=metadata_dict.get("trigger_timestamp_ns", 0),
            trigger_details=metadata_dict.get("trigger_details", {}),
            channels=list(messages_by_topic.keys()),
            messages_by_topic=messages_by_topic,
            total_messages=total_msgs,
            duration_seconds=round(duration_sec, 3),
        )
