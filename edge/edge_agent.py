"""
Unified Edge Telemetry Daemon.
Coordinates the in-RAM circular ring buffer, real-time trigger sentinels,
and automated MCAP packaging during robot disengagements.
"""

import logging
import threading
import time
from typing import Any, Callable, Dict, List, Optional
from edge.mcap_exporter import McapExporter
from edge.ring_buffer import CircularRingBuffer
from edge.trigger_detector import TriggerDetector, TriggerEvent, TriggerType

logger = logging.getLogger("diffraction.edge")


class EdgeTelemetryAgent:
    def __init__(
        self,
        robot_id: str,
        urdf_hash: str,
        facility_id: str = "site_alpha",
        buffer_duration_seconds: float = 20.0,
        post_incident_seconds: float = 5.0,
        output_directory: str = "./storage/telemetry_drops",
        on_incident_callback: Optional[Callable[[str, TriggerEvent], None]] = None,
    ):
        self.robot_id = robot_id
        self.urdf_hash = urdf_hash
        self.facility_id = facility_id
        self.post_incident_seconds = post_incident_seconds
        self.on_incident_callback = on_incident_callback

        self.ring_buffer = CircularRingBuffer(duration_seconds=buffer_duration_seconds)
        self.trigger_detector = TriggerDetector()
        self.mcap_exporter = McapExporter(robot_id=robot_id, urdf_hash=urdf_hash, output_directory=output_directory)

        self._active_incident: Optional[TriggerEvent] = None
        self._incident_lock = threading.Lock()
        self._post_incident_timer: Optional[threading.Timer] = None

    def ingest_sensor_message(self, topic: str, data: Any, timestamp_ns: Optional[int] = None) -> None:
        """Ingests high-rate sensor packets into the in-memory circular buffer."""
        if timestamp_ns is None:
            timestamp_ns = time.time_ns()

        size_approx = len(data) if isinstance(data, (bytes, str)) else 256
        self.ring_buffer.push(topic=topic, data=data, timestamp_ns=timestamp_ns, approx_size=size_approx)

    def process_teleop_heartbeat(self, data: Dict[str, Any], timestamp_ns: Optional[int] = None) -> None:
        """Evaluates manual joystick or supervisor interventions."""
        self.ingest_sensor_message("/teleop/override", data, timestamp_ns)
        trigger = self.trigger_detector.evaluate_teleop_override(data, timestamp_ns)
        if trigger:
            self._handle_trigger(trigger)

    def process_safety_estop(self, data: Dict[str, Any], timestamp_ns: Optional[int] = None) -> None:
        """Evaluates hardware safety stops."""
        self.ingest_sensor_message("/safety/estop", data, timestamp_ns)
        trigger = self.trigger_detector.evaluate_estop(data, timestamp_ns)
        if trigger:
            self._handle_trigger(trigger)

    def process_odometry(
        self,
        current_pose: Dict[str, float],
        target_pose: Dict[str, float],
        linear_velocity: float,
        timestamp_ns: Optional[int] = None,
    ) -> None:
        """Evaluates tracking error divergence and excessive deceleration."""
        data = {
            "current_pose": current_pose,
            "target_pose": target_pose,
            "linear_velocity": linear_velocity,
        }
        self.ingest_sensor_message("/odom", data, timestamp_ns)
        trigger = self.trigger_detector.evaluate_odometry_and_tracking(
            current_pose, target_pose, linear_velocity, timestamp_ns
        )
        if trigger:
            self._handle_trigger(trigger)

    def _handle_trigger(self, trigger: TriggerEvent) -> None:
        with self._incident_lock:
            if self._active_incident is not None:
                # Already capturing post-incident window
                return

            self._active_incident = trigger
            logger.warning(
                f"[TRIGGER ENGAGED] {trigger.trigger_type.value} at {trigger.timestamp_ns}. "
                f"Buffering {self.post_incident_seconds}s post-incident window..."
            )

            # Schedule delayed export to capture post-incident behavior
            self._post_incident_timer = threading.Timer(
                self.post_incident_seconds, self._finalize_incident_export
            )
            self._post_incident_timer.start()

    def _finalize_incident_export(self) -> Optional[str]:
        with self._incident_lock:
            if not self._active_incident:
                return None

            trigger = self._active_incident
            # Extract precise deterministic window: [trigger - buffer_duration, trigger + post_incident]
            post_ns = int(self.post_incident_seconds * 1e9)
            pre_ns = self.ring_buffer.duration_ns
            start_ns = trigger.timestamp_ns - pre_ns
            end_ns = trigger.timestamp_ns + post_ns

            messages = self.ring_buffer.get_window(start_ns=start_ns, end_ns=end_ns)
            if not messages:
                # Fallback to all messages if clock skew shifted timestamps
                messages = self.ring_buffer.get_all()

            file_path = self.mcap_exporter.export_incident(
                messages=messages,
                trigger=trigger,
                facility_id=self.facility_id,
            )

            logger.info(f"[INCIDENT CAPTURED] MCAP packet saved to {file_path} ({len(messages)} messages).")

            if self.on_incident_callback:
                try:
                    self.on_incident_callback(file_path, trigger)
                except Exception as e:
                    logger.error(f"Callback error: {e}")

            self._active_incident = None
            return file_path

    def stop(self) -> None:
        """Gracefully cancels any pending post-incident timers and clears memory."""
        with self._incident_lock:
            if self._post_incident_timer and self._post_incident_timer.is_alive():
                self._post_incident_timer.cancel()
            self._active_incident = None
            self.ring_buffer.clear()
