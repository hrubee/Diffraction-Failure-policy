from edge.trigger_detector import TriggerDetector, TriggerType


def test_teleop_override_trigger():
    detector = TriggerDetector()
    trigger = detector.evaluate_teleop_override({"override_active": True, "operator_id": "op_9"})
    assert trigger is not None
    assert trigger.trigger_type == TriggerType.TELEOP_OVERRIDE
    assert trigger.severity == "CRITICAL"


def test_estop_trigger():
    detector = TriggerDetector()
    trigger = detector.evaluate_estop({"estop_engaged": True, "source": "hardware_bumper"})
    assert trigger is not None
    assert trigger.trigger_type == TriggerType.ESTOP_TRIGGERED


def test_tracking_error_trigger():
    detector = TriggerDetector(tracking_error_threshold_meters=0.45)
    # Deviation = sqrt(0.5^2 + 0.0^2) = 0.50m > 0.45m
    trigger = detector.evaluate_odometry_and_tracking(
        current_pose={"x": 2.5, "y": 0.0},
        target_pose={"x": 2.0, "y": 0.0},
        linear_velocity=0.5,
    )
    assert trigger is not None
    assert trigger.trigger_type == TriggerType.TRACKING_ERROR_SPIKE
