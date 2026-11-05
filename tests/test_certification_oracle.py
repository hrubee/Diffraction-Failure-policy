from simulation_harness.certification_oracle import SafetyCertificationOracle
from simulation_harness.isaac_runner import SimulationRunOutcome


def test_safety_certification_oracle():
    oracle = SafetyCertificationOracle(min_passing_score=90.0)

    # 9 passed, 1 failed
    outcomes = [
        SimulationRunOutcome(
            scenario_id=f"scen_{i}",
            passed=(i != 5),
            collision_occurred=(i == 5),
            minimum_obstacle_clearance_m=1.2 if i != 5 else 0.1,
            max_tracking_error_m=0.1,
            wheel_slip_ratio=0.05,
            stopping_distance_m=0.8,
            failure_cause="PHYSICAL_COLLISION_WITH_OBSTACLE" if i == 5 else None,
            perturbation_summary={"friction_coefficient": 0.22 if i == 5 else 0.70, "glare_severity": 0.3},
        )
        for i in range(10)
    ]

    verdict = oracle.evaluate_audit(outcomes)
    assert verdict.total_scenarios_evaluated == 10
    assert verdict.scenarios_passed == 9
    assert verdict.scenarios_failed == 1
    assert verdict.safety_compliance_score == 90.0
    assert verdict.certification_status == "CERTIFIED_SAFE"
    assert "PHYSICAL_COLLISION_WITH_OBSTACLE" in verdict.failure_breakdown
