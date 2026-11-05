"""
Unit tests for the Real-Time Dynamic Safety Governor & Control Barrier Function.
Verifies hard real-time velocity clamping on low friction, stopping distance, and centripetal yaw stability.
"""

import pytest
from edge.safety_governor import DynamicSafetyGovernor


def test_safety_governor_nominal_no_intervention():
    governor = DynamicSafetyGovernor()
    # High friction floor (μ=0.8), far obstacle (5.0m), modest command (0.6 m/s)
    intervention = governor.govern_velocity_command(
        cmd_linear_vel=0.6,
        cmd_angular_vel=0.2,
        estimated_surface_mu=0.8,
        distance_to_obstacle_m=5.0,
    )
    assert not intervention.was_intervened
    assert intervention.safe_linear_vel == 0.6
    assert intervention.safe_angular_vel == 0.2


def test_safety_governor_clamps_on_slick_floor():
    governor = DynamicSafetyGovernor()
    # High speed (1.4 m/s), low friction (μ=0.15), obstacle close (0.8m)
    intervention = governor.govern_velocity_command(
        cmd_linear_vel=1.4,
        cmd_angular_vel=0.1,
        estimated_surface_mu=0.15,
        distance_to_obstacle_m=0.8,
    )
    assert intervention.was_intervened
    assert intervention.safe_linear_vel < 1.4
    assert "Dynamic braking barrier violated" in intervention.intervention_reason


def test_safety_governor_clamps_high_speed_turn_spinout():
    governor = DynamicSafetyGovernor()
    # Fast speed (1.0 m/s), aggressive yaw rate (2.0 rad/s), wet floor (μ=0.25)
    # Centripetal a_lat = 1.0 * 2.0 = 2.0 m/s2 > 0.25 * 9.81 * 0.85 = 2.08 m/s2 (close or exceeding)
    intervention = governor.govern_velocity_command(
        cmd_linear_vel=1.2,
        cmd_angular_vel=2.5,
        estimated_surface_mu=0.20,
        distance_to_obstacle_m=5.0,
    )
    assert intervention.was_intervened
    assert intervention.safe_angular_vel < 2.5
    assert "Lateral yaw stability barrier violated" in intervention.intervention_reason


def test_safety_governor_derates_on_wheel_slip():
    governor = DynamicSafetyGovernor()
    # Wheel slip ratio is high (60%), so effective friction should be derated
    intervention_clean = governor.govern_velocity_command(
        cmd_linear_vel=0.8,
        cmd_angular_vel=0.0,
        estimated_surface_mu=0.35,
        distance_to_obstacle_m=1.2,
        observed_wheel_slip_ratio=0.0,
    )
    intervention_slipping = governor.govern_velocity_command(
        cmd_linear_vel=0.8,
        cmd_angular_vel=0.0,
        estimated_surface_mu=0.35,
        distance_to_obstacle_m=1.2,
        observed_wheel_slip_ratio=0.65,
    )
    assert intervention_slipping.safe_linear_vel <= intervention_clean.safe_linear_vel
