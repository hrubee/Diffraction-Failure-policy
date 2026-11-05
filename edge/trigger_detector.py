"""
Real-time incident and disengagement trigger detector.
Monitors telemetry streams to immediately catch human takeovers,
safety stops, tracking deviations, and collisions.
"""

from dataclasses import dataclass
from enum import Enum
import math
import time
from typing import Any, Dict, Optional


class TriggerType(str, Enum):
    TELEOP_OVERRIDE = "teleop_override"
    ESTOP_TRIGGERED = "estop_triggered"
    TRACKING_ERROR_SPIKE = "tracking_error_spike"
    ABRUPT_DECELERATION = "abrupt_deceleration"
    MANUAL_OPERATOR = "manual_operator"


@dataclass
class TriggerEvent:
    trigger_type: TriggerType
    timestamp_ns: int
    severity: str
    details: Dict[str, Any]


class TriggerDetector:
    def __init__(
        self,
        tracking_error_threshold_meters: float = 0.45,
        deceleration_threshold_ms2: float = 3.5,
    ):
        self.tracking_error_threshold = tracking_error_threshold_meters
        self.deceleration_threshold = deceleration_threshold_ms2

        self._last_linear_velocity = 0.0
        self._last_vel_timestamp_ns = 0

    def evaluate_teleop_override(self, message_data: Dict[str, Any], timestamp_ns: Optional[int] = None) -> Optional[TriggerEvent]:
        """Catch operator joystick takeover."""
        if timestamp_ns is None:
            timestamp_ns = time.time_ns()

        is_active = message_data.get("override_active", False) or message_data.get("manual_mode", False)
        if is_active:
            return TriggerEvent(
                trigger_type=TriggerType.TELEOP_OVERRIDE,
                timestamp_ns=timestamp_ns,
                severity="CRITICAL",
                details={
                    "operator_id": message_data.get("operator_id", "unknown"),
                    "reason": message_data.get("reason", "manual_intervention"),
                },
            )
        return None

    def evaluate_estop(self, message_data: Dict[str, Any], timestamp_ns: Optional[int] = None) -> Optional[TriggerEvent]:
        """Catch hardware or software emergency stops."""
        if timestamp_ns is None:
            timestamp_ns = time.time_ns()

        estop_engaged = message_data.get("estop_engaged", False) or message_data.get("safety_stop", False)
        if estop_engaged:
            return TriggerEvent(
                trigger_type=TriggerType.ESTOP_TRIGGERED,
                timestamp_ns=timestamp_ns,
                severity="EMERGENCY",
                details={
                    "source": message_data.get("source", "safety_lidar_field_breach"),
                    "stop_code": message_data.get("code", 1),
                },
            )
        return None

    def evaluate_odometry_and_tracking(
        self,
        current_pose: Dict[str, float],
        target_pose: Dict[str, float],
        linear_velocity: float,
        timestamp_ns: Optional[int] = None,
    ) -> Optional[TriggerEvent]:
        """Catch path divergence and dangerous deceleration."""
        if timestamp_ns is None:
            timestamp_ns = time.time_ns()

        # 1. Check path deviation
        dx = current_pose.get("x", 0.0) - target_pose.get("x", 0.0)
        dy = current_pose.get("y", 0.0) - target_pose.get("y", 0.0)
        deviation = math.hypot(dx, dy)

        if deviation > self.tracking_error_threshold:
            return TriggerEvent(
                trigger_type=TriggerType.TRACKING_ERROR_SPIKE,
                timestamp_ns=timestamp_ns,
                severity="HIGH",
                details={
                    "deviation_meters": round(deviation, 3),
                    "threshold_meters": self.tracking_error_threshold,
                    "current_pose": current_pose,
                    "target_pose": target_pose,
                },
            )

        # 2. Check abrupt deceleration (potential impact or emergency braking)
        if self._last_vel_timestamp_ns > 0:
            dt = (timestamp_ns - self._last_vel_timestamp_ns) / 1e9
            if dt > 0.001:
                dv = self._last_linear_velocity - linear_velocity
                decel = dv / dt
                if decel > self.deceleration_threshold:
                    return TriggerEvent(
                        trigger_type=TriggerType.ABRUPT_DECELERATION,
                        timestamp_ns=timestamp_ns,
                        severity="CRITICAL",
                        details={
                            "deceleration_ms2": round(decel, 2),
                            "previous_vel": self._last_linear_velocity,
                            "current_vel": linear_velocity,
                        },
                    )

        self._last_linear_velocity = linear_velocity
        self._last_vel_timestamp_ns = timestamp_ns
        return None
