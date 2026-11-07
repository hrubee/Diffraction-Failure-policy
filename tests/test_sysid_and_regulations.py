"""
Tests for Diffraction Telemetry SysID Calibrator and Regulatory Compliance Standards.
"""

from cloud_gateway.mcap_parser import DecoupledIncident
from cloud_gateway.sysid_calibrator import SysIDCalibrator, SysIDProfile
from simulation_harness.certification_oracle import SafetyCertificationOracle
from simulation_harness.isaac_runner import SimulationRunOutcome


def test_sysid_calibrator_slip_and_friction():
    # Construct synthetic incident telemetry with braking deceleration and wheel slip
    now_ns = 1700000000 * 1000000000
    odom_messages = []
    
    # Nominal running
    for i in range(20):
        t = i * 0.05
        odom_messages.append({
            "timestamp_ns": int(now_ns + t * 1e9),
            "data": {
                "linear_velocity": 0.8,
                "current_pose": {"x": t * 0.8, "y": 0.0},
                "target_pose": {"x": t * 0.8, "y": 0.0},
            }
        })

    # Sudden slip and deceleration
    odom_messages.append({
        "timestamp_ns": int(now_ns + 1.05 * 1e9),
        "data": {
            "linear_velocity": 0.25,  # Dropped from 0.8 -> 0.25 in 0.05s: decel = 11 m/s^2
            "current_pose": {"x": 0.84, "y": 0.55},  # Lateral deviation = 0.55m
            "target_pose": {"x": 0.84, "y": 0.0},
        }
    })

    incident = DecoupledIncident(
        robot_id="test_tugger",
        urdf_hash="hash_123",
        facility_id="chicago_hub",
        trigger_type="tracking_error_spike",
        trigger_severity="HIGH",
        trigger_timestamp_ns=now_ns,
        trigger_details={},
        channels=["/odom"],
        messages_by_topic={"/odom": odom_messages},
        total_messages=len(odom_messages),
        duration_seconds=1.05,
    )

    profile = SysIDCalibrator.analyze_incident(incident)

    assert isinstance(profile, SysIDProfile)
    assert profile.telemetry_sample_count == 21
    assert profile.observed_max_slip_ratio > 0.30
    assert profile.traction_anomaly_detected is True
    assert profile.peak_deceleration_ms2 > 5.0
    assert 0.12 <= profile.estimated_surface_friction_mu <= 0.50
    assert len(profile.empirical_observations) >= 4


def test_regulatory_compliance_mapping():
    oracle = SafetyCertificationOracle(min_passing_score=95.0)

    # 10 outcomes: 10 passed, 0 collisions
    outcomes = [
        SimulationRunOutcome(
            scenario_id=f"scen_{i}",
            passed=True,
            collision_occurred=False,
            minimum_obstacle_clearance_m=0.85,
            max_tracking_error_m=0.12,
            wheel_slip_ratio=0.04,
            stopping_distance_m=0.75,
            failure_cause=None,
            perturbation_summary={"friction_coefficient": 0.65, "glare_severity": 0.2},
        )
        for i in range(10)
    ]

    verdict = oracle.evaluate_audit(outcomes)
    assert len(verdict.regulatory_compliance) == 4

    standards = [r.standard for r in verdict.regulatory_compliance]
    assert "ISO 3691-4:2023" in standards
    assert "ANSI/RIA R15.08-1-2020" in standards
    assert "ISO 13849-1:2023" in standards

    # Check Clause 5.2.3 and 5.3.2 statuses
    for r in verdict.regulatory_compliance:
        if r.clause == "Clause 5.2.3":
            assert r.status == "COMPLIANT"
        if r.clause == "Clause 5.3.2":
            assert r.status == "COMPLIANT"


def test_multimodal_regulatory_clauses():
    """Verifies that the certification oracle outputs modality-specific standards across robot types."""
    oracle = SafetyCertificationOracle(min_passing_score=95.0)
    outcomes = [
        SimulationRunOutcome(
            scenario_id=f"scen_{i}",
            passed=True,
            collision_occurred=False,
            minimum_obstacle_clearance_m=0.85,
            max_tracking_error_m=0.08,
            wheel_slip_ratio=0.02,
            stopping_distance_m=0.70,
            failure_cause=None,
            perturbation_summary={"friction_coefficient": 0.60, "glare_severity": 0.1},
        )
        for i in range(5)
    ]

    # 1. Humanoid -> ISO 13482:2014
    humanoid_profile = {"robot_kinematics": {"chassis_type": "bipedal_humanoid"}}
    verdict_h = oracle.evaluate_audit(outcomes, sysid_profile=humanoid_profile)
    h_standards = [r.standard for r in verdict_h.regulatory_compliance]
    assert "ISO 13482:2014" in h_standards

    # 2. Heavy Hauler -> ISO 17757:2019
    hauler_profile = {"robot_kinematics": {"chassis_type": "heavy_ackermann_hauler"}}
    verdict_hh = oracle.evaluate_audit(outcomes, sysid_profile=hauler_profile)
    hh_standards = [r.standard for r in verdict_hh.regulatory_compliance]
    assert "ISO 17757:2019" in hh_standards

    # 3. Manipulator Arm -> ISO/TS 15066:2016
    arm_profile = {"robot_kinematics": {"chassis_type": "articulated_manipulator_arm"}}
    verdict_arm = oracle.evaluate_audit(outcomes, sysid_profile=arm_profile)
    arm_standards = [r.standard for r in verdict_arm.regulatory_compliance]
    assert "ISO/TS 15066:2016" in arm_standards

    # 4. Urban Rover -> ISO 22737:2021 & UL 4600:2022
    rover_profile = {"robot_kinematics": {"chassis_type": "urban_delivery_rover"}}
    verdict_rov = oracle.evaluate_audit(outcomes, sysid_profile=rover_profile)
    rov_standards = [r.standard for r in verdict_rov.regulatory_compliance]
    assert "ISO 22737:2021" in rov_standards
    assert "UL 4600:2022" in rov_standards
