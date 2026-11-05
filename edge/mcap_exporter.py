"""
High-performance MCAP telemetry exporter.
Serializes captured pre- and post-incident sensor streams into an indexed,
compressed MCAP robotics container with full hardware & trigger metadata.
"""

import json
import os
import struct
import time
from typing import Any, Dict, List, Optional
from edge.ring_buffer import BufferedMessage
from edge.trigger_detector import TriggerEvent

try:
    from mcap.writer import Writer as OfficialMcapWriter
    HAS_OFFICIAL_MCAP = True
except ImportError:
    HAS_OFFICIAL_MCAP = False


class PurePythonMcapWriter:
    """Fallback pure-Python MCAP container writer adhering to the MCAP v1 specification."""
    MAGIC = b"\x89MCAP0\r\n"
    OP_HEADER = 0x01
    OP_FOOTER = 0x02
    OP_SCHEMA = 0x03
    OP_CHANNEL = 0x04
    OP_MESSAGE = 0x05
    OP_METADATA = 0x0c

    def __init__(self, output_stream):
        self.stream = output_stream
        self.channels: Dict[str, int] = {}
        self.schemas: Dict[str, int] = {}
        self._next_channel_id = 1
        self._next_schema_id = 1

    def _write_record(self, opcode: int, payload: bytes) -> None:
        header = struct.pack("<BQ", opcode, len(payload))
        self.stream.write(header)
        self.stream.write(payload)

    def start(self, profile: str = "ros2", library: str = "diffraction-v1") -> None:
        self.stream.write(self.MAGIC)
        p_bytes = profile.encode("utf-8")
        l_bytes = library.encode("utf-8")
        payload = struct.pack(f"<I{len(p_bytes)}sI{len(l_bytes)}s", len(p_bytes), p_bytes, len(l_bytes), l_bytes)
        self._write_record(self.OP_HEADER, payload)

    def register_channel(self, topic: str, message_encoding: str = "application/json") -> int:
        if topic in self.channels:
            return self.channels[topic]

        channel_id = self._next_channel_id
        self._next_channel_id += 1
        self.channels[topic] = channel_id

        t_bytes = topic.encode("utf-8")
        e_bytes = message_encoding.encode("utf-8")
        # id (H), schema_id (H), topic (I+bytes), encoding (I+bytes), metadata (I)
        payload = struct.pack(f"<HHI{len(t_bytes)}sI{len(e_bytes)}sI", channel_id, 0, len(t_bytes), t_bytes, len(e_bytes), e_bytes, 0)
        self._write_record(self.OP_CHANNEL, payload)
        return channel_id

    def add_message(self, channel_id: int, log_time_ns: int, data: bytes) -> None:
        # channel_id (H), sequence (I), log_time (Q), publish_time (Q)
        payload = struct.pack("<HIQQ", channel_id, 0, log_time_ns, log_time_ns) + data
        self._write_record(self.OP_MESSAGE, payload)

    def add_metadata(self, name: str, metadata_dict: Dict[str, Any]) -> None:
        n_bytes = name.encode("utf-8")
        data_str = json.dumps(metadata_dict).encode("utf-8")
        payload = struct.pack(f"<I{len(n_bytes)}sI{len(data_str)}s", len(n_bytes), n_bytes, len(data_str), data_str)
        self._write_record(self.OP_METADATA, payload)

    def finish(self) -> None:
        footer_payload = struct.pack("<QQI", 0, 0, 0)
        self._write_record(self.OP_FOOTER, footer_payload)
        self.stream.write(self.MAGIC)


class McapExporter:
    def __init__(self, robot_id: str, urdf_hash: str, output_directory: str = "./storage/telemetry_drops"):
        self.robot_id = robot_id
        self.urdf_hash = urdf_hash
        self.output_directory = output_directory
        os.makedirs(output_directory, exist_ok=True)

    def export_incident(
        self,
        messages: List[BufferedMessage],
        trigger: TriggerEvent,
        facility_id: str = "warehouse_zone_b",
    ) -> str:
        """Serializes messages to an .mcap container and returns the written file path."""
        timestamp_str = time.strftime("%Y%m%d_%H%M%S", time.gmtime(trigger.timestamp_ns / 1e9))
        filename = f"incident_{self.robot_id}_{trigger.trigger_type.value}_{timestamp_str}.mcap"
        file_path = os.path.join(self.output_directory, filename)

        metadata = {
            "robot_id": self.robot_id,
            "urdf_hash": self.urdf_hash,
            "facility_id": facility_id,
            "trigger_type": trigger.trigger_type.value,
            "trigger_severity": trigger.severity,
            "trigger_timestamp_ns": trigger.timestamp_ns,
            "trigger_details": trigger.details,
            "message_count": len(messages),
            "export_time": time.time(),
        }

        with open(file_path, "wb") as f:
            if HAS_OFFICIAL_MCAP:
                writer = OfficialMcapWriter(f)
                writer.start(profile="ros2", library="diffraction-mcap-exporter")
                channel_map = {}
                for msg in messages:
                    if msg.topic not in channel_map:
                        ch_id = writer.register_channel(
                            topic=msg.topic,
                            message_encoding="application/json",
                            schema_id=0,
                        )
                        channel_map[msg.topic] = ch_id

                    encoded_data = msg.data if isinstance(msg.data, bytes) else json.dumps(msg.data).encode("utf-8")
                    writer.add_message(
                        channel_id=channel_map[msg.topic],
                        log_time=msg.timestamp_ns,
                        data=encoded_data,
                        publish_time=msg.timestamp_ns,
                    )
                meta_data_dict = {k: json.dumps(v) if isinstance(v, (dict, list)) else str(v) for k, v in metadata.items()}
                writer.add_metadata(name="diffraction_incident_metadata", data=meta_data_dict)
                writer.finish()
            else:
                writer = PurePythonMcapWriter(f)
                writer.start()
                channel_map = {}
                for msg in messages:
                    if msg.topic not in channel_map:
                        channel_map[msg.topic] = writer.register_channel(msg.topic)
                    encoded_data = msg.data if isinstance(msg.data, bytes) else json.dumps(msg.data).encode("utf-8")
                    writer.add_message(channel_map[msg.topic], msg.timestamp_ns, encoded_data)
                writer.add_metadata("diffraction_incident_metadata", metadata)
                writer.finish()

        return file_path
