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
