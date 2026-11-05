"""
End-to-End Physical AI Verification Pipeline Runner.
Connects Edge MCAP Telemetry -> Omniverse NuRec Twin -> NVIDIA Cosmos -> Isaac Sim -> Safety Report.
"""

import os
import sys
import time

# Ensure workspace root is in python path
sys.path.insert(0, ".")

from cloud_gateway.mcap_parser import McapParser
from cloud_gateway.sysid_calibrator import SysIDCalibrator
from cosmos_engine.cosmos_client import CosmosModelClient
from cosmos_engine.domain_randomizer import DomainRandomizer
from reporting.report_generator import SafetyReportGenerator
from scripts.run_mock_robot import simulate_warehouse_amr_run
from simulation_harness.certification_oracle import SafetyCertificationOracle
from simulation_harness.isaac_runner import IsaacSimulationHarness
from twin_synthesis.nurec_reconstruction import NuRecReconstructor


def run_pipeline():
    print("\n" + "=" * 70)
    print("      DIFFRACTION // COMPLETE PHYSICAL AI SIMULATION PIPELINE")
    print("=" * 70)

    # -------------------------------------------------------------
    # STEP 1: EDGE CAPTURE (Run Mock Robot to generate real incident MCAP)
    # -------------------------------------------------------------
    print("\n[STEP 1/6] Launching Edge Robot & Telemetry Sentinel...")
    mcap_file_path = simulate_warehouse_amr_run()

    if not mcap_file_path or not os.path.exists(mcap_file_path):
        # Fallback to finding latest in storage
        drops = [os.path.join("./storage/telemetry_drops", f) for f in os.listdir("./storage/telemetry_drops") if f.endswith(".mcap")]
        if not drops:
            print("[ERROR] No MCAP packet generated.")
            return
        mcap_file_path = sorted(drops, key=os.path.getmtime)[-1]

    print(f"--> Ingested MCAP File: {mcap_file_path}")

    # -------------------------------------------------------------
    # STEP 2: CLOUD INGESTION & MCAP DECOUPLING
    # -------------------------------------------------------------
    print("\n[STEP 2/6] Parsing MCAP Container & Extracting Kinematics...")
    incident = McapParser.parse_file(mcap_file_path)
    print(f"--> Robot ID: {incident.robot_id} (URDF Hash: {incident.urdf_hash})")
    print(f"--> Trigger: {incident.trigger_type} (Severity: {incident.trigger_severity})")
    print(f"--> Total Messages Decoupled: {incident.total_messages} over {incident.duration_seconds}s")
    print(f"--> Channels Identified: {incident.channels}")

    # -------------------------------------------------------------
    # STEP 3: SYSTEM IDENTIFICATION (SysID) CALIBRATION & SPATIAL TWIN
    # -------------------------------------------------------------
    print("\n[STEP 3/6] Running Telemetry SysID Calibrator & Synthesizing USD Stage...")
    sysid_profile = SysIDCalibrator.analyze_incident(incident)
    print(f"--> SysID Ground-Truth Friction: μ = {sysid_profile.estimated_surface_friction_mu} (Confidence: {sysid_profile.calibration_confidence_score}%)")
    print(f"--> Measured Kinematic Slip: {round(sysid_profile.observed_max_slip_ratio * 100, 1)}% | Peak Decel: {sysid_profile.peak_deceleration_ms2} m/s²")

    reconstructor = NuRecReconstructor(output_dir="./storage/usd_stages")
    twin_data = reconstructor.reconstruct_from_incident(
        incident=incident,
        static_friction=sysid_profile.estimated_surface_friction_mu,
        dynamic_friction=round(sysid_profile.estimated_surface_friction_mu * 0.85, 2),
        ambient_lux=sysid_profile.estimated_ambient_lux,
    )
    print(f"--> Synthesized USD Stage: {twin_data['usd_stage_path']}")
    print(f"--> Instantiated Robot Pose: {twin_data['robot_pose']}")

    # -------------------------------------------------------------
    # STEP 4: NVIDIA COSMOS GENERATIVE AUGMENTATION
    # -------------------------------------------------------------
    print("\n[STEP 4/6] Generating Adversarial Parameter Matrix & Cosmos World Perturbations...")
    randomizer = DomainRandomizer(seed=1337)
    perturbations = randomizer.generate_scenarios(count=150)
    print(f"--> Generated {len(perturbations)} domain perturbations (Friction, Glare, Latency, Fog).")

    # Build nominal baseline trajectory for comparison
    nominal_trajectory = [
        {"t": step * 0.1, "x": step * 0.1 * 0.8, "y": 0.0, "yaw": 0.0}
        for step in range(30)
    ]

    cosmos_client = CosmosModelClient(output_dir="./storage/cosmos_augmented")
    cosmos_results = cosmos_client.batch_generate(
        base_usd_path=twin_data["usd_stage_path"],
        perturbations=perturbations,
        nominal_trajectory=nominal_trajectory,
    )
    print(f"--> Cosmos Transfer & Predict generated {len(cosmos_results)} counterfactual rollouts.")

    # -------------------------------------------------------------
    # STEP 5: HEADLESS ISAAC SIM / ISAAC LAB PARALLEL VERIFICATION
    # -------------------------------------------------------------
    print("\n[STEP 5/6] Executing Headless Isaac Sim / Isaac Lab Verification Harness...")
    sim_harness = IsaacSimulationHarness(collision_threshold_m=0.25, max_acceptable_error_m=0.40)
    # Obstacle placed at loading dock corner (x=2.5, y=0.55)
    # Nominal paths (y~0.0) clear easily; low-friction slipping paths (y~0.6) collide!
    outcomes = sim_harness.execute_batch(cosmos_results, obstacle_position={"x": 2.5, "y": 0.55})
    print(f"--> Evaluated {len(outcomes)} parallel rollouts.")

    # Certification Oracle
    oracle = SafetyCertificationOracle(min_passing_score=95.0, conditional_threshold=85.0)
    verdict = oracle.evaluate_audit(outcomes, sysid_profile=sysid_profile)
    print("\n" + "-" * 50)
    print(f"  SAFETY COMPLIANCE SCORE: {verdict.safety_compliance_score}%")
    print(f"  CERTIFICATION STATUS:    {verdict.certification_status}")
    print(f"  SCENARIOS PASSED:        {verdict.scenarios_passed} / {verdict.total_scenarios_evaluated}")
    print(f"  MIN SAFE FRICTION:       μ >= {verdict.safe_operational_boundaries['minimum_safe_surface_friction_mu']}")
    print("-" * 50)

    # -------------------------------------------------------------
    # STEP 6: EXECUTIVE SAFETY AUDIT REPORT GENERATION
    # -------------------------------------------------------------
    print("\n[STEP 6/6] Generating Executive Safety Audit Reports...")
    reporter = SafetyReportGenerator(output_dir="./storage/reports")

    incident_meta = {
        "robot_id": incident.robot_id,
        "facility_id": incident.facility_id,
        "trigger_type": incident.trigger_type,
        "trigger_severity": incident.trigger_severity,
        "usd_stage_path": twin_data["usd_stage_path"],
    }

    json_report_path = reporter.generate_json_report(incident_meta, verdict)
    html_report_path = reporter.generate_html_report(incident_meta, verdict)

    print(f"--> JSON Audit Artifact: {json_report_path}")
    print(f"--> HTML Audit Report:   {html_report_path}")
    print("\n" + "=" * 70)
    print("      DIFFRACTION // PIPELINE COMPLETED SUCCESSFULLY")
    print("=" * 70 + "\n")

    return {
        "json_report": json_report_path,
        "html_report": html_report_path,
        "usd_stage": twin_data["usd_stage_path"],
        "compliance_score": verdict.safety_compliance_score,
        "status": verdict.certification_status,
    }


if __name__ == "__main__":
    run_pipeline()
