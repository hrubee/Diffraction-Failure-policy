"""
Diffraction Asynchronous Verification Job Runner.
Executes heavy Monte Carlo physical verification sweeps in background thread pools,
updating job state and progress in the multi-tenant database.
"""

from concurrent.futures import ThreadPoolExecutor
from dataclasses import asdict
import os
import time
from typing import Any, Dict, Optional

from cloud_gateway.db import get_audit_job, update_audit_job
from cloud_gateway.mcap_parser import McapParser
from cloud_gateway.sysid_calibrator import SysIDCalibrator
from cosmos_engine.cosmos_client import CosmosModelClient
from cosmos_engine.domain_randomizer import DomainRandomizer
from remediation.policy_patcher import PolicyRemediationPatcher
from reporting.report_generator import SafetyReportGenerator
from reporting.site_risk_assessor import SiteRiskAssessor
from simulation_harness.certification_oracle import SafetyCertificationOracle
from simulation_harness.isaac_runner import IsaacSimulationHarness
from twin_synthesis.nurec_reconstruction import NuRecReconstructor

UPLOAD_DIR = "./storage/telemetry_drops"
REPORTS_DIR = "./storage/reports"
STAGES_DIR = "./storage/usd_stages"
PATCHES_DIR = "./storage/remediation_patches"

_executor = ThreadPoolExecutor(max_workers=4, thread_name_prefix="diffraction_sim_worker")


def run_audit_pipeline(
    mcap_path: str,
    scenario_count: int = 150,
    job_id: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Executes the complete Closed-Loop Physical AI Verification and Safety Certification Pipeline.
    Optionally reports progress to the database job record.
    """
    if job_id:
        update_audit_job(job_id, status="RUNNING", progress_pct=10)

    # 1. Parse MCAP Telemetry
    incident = McapParser.parse_file(mcap_path)
    if job_id:
        update_audit_job(job_id, progress_pct=25)

    # 2. System Identification (SysID) Telemetry Auto-Calibration
    sysid_profile = SysIDCalibrator.analyze_incident(incident)
    if job_id:
        update_audit_job(job_id, progress_pct=40)

    # 3. Spatial Twin Synthesis (anchored by real calibrated physics)
    reconstructor = NuRecReconstructor(output_dir=STAGES_DIR)
    twin_data = reconstructor.reconstruct_from_incident(
        incident=incident,
        static_friction=sysid_profile.estimated_surface_friction_mu,
        dynamic_friction=round(sysid_profile.estimated_surface_friction_mu * 0.85, 2),
        ambient_lux=sysid_profile.estimated_ambient_lux,
    )
    if job_id:
        update_audit_job(job_id, progress_pct=60)

    # 4. Adversarial Stress Perturbations
    randomizer = DomainRandomizer(seed=int(time.time()))
    perturbations = randomizer.generate_scenarios(count=scenario_count)
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

    # 5. Parallel Verification Harness
    sim_harness = IsaacSimulationHarness(collision_threshold_m=0.25, max_acceptable_error_m=0.40)
    outcomes = sim_harness.execute_batch(cosmos_results, obstacle_position={"x": 2.5, "y": 0.55})
    if job_id:
        update_audit_job(job_id, progress_pct=75)

    # 6. Certification Oracle & Standards Mapping (ISO 3691-4 & ANSI R15.08)
    oracle = SafetyCertificationOracle(min_passing_score=95.0, conditional_threshold=85.0)
    verdict = oracle.evaluate_audit(outcomes, sysid_profile=sysid_profile)

    # 7. Regulatory & Due-Diligence Reports
    reporter = SafetyReportGenerator(output_dir=REPORTS_DIR)
    incident_meta = {
        "robot_id": incident.robot_id,
        "facility_id": incident.facility_id,
        "trigger_type": incident.trigger_type,
        "trigger_severity": incident.trigger_severity,
        "usd_stage_path": twin_data["usd_stage_path"],
        "calibrated_friction_mu": sysid_profile.estimated_surface_friction_mu,
    }
    json_path = reporter.generate_json_report(incident_meta, verdict)
    html_path = reporter.generate_html_report(incident_meta, verdict)

    # 8. Automated Policy Remediation Synthesis
    inc_label = f"{incident.robot_id}_{incident.trigger_type}"
    patcher = PolicyRemediationPatcher(output_dir=PATCHES_DIR)
    remediation_pkg = patcher.generate_remediation_package(
        incident_id=inc_label,
        incident_meta=incident_meta,
        audit_verdict=verdict,
    )
    if job_id:
        update_audit_job(job_id, progress_pct=90)

    # 9. ANSI/RIA R15.08 Part 2 Site Risk Assessment & Insurance Telematics
    assessor = SiteRiskAssessor(output_dir=REPORTS_DIR)
    site_risk = assessor.assess_facility(
        facility_id=incident.facility_id,
        audit_verdict=verdict,
        sysid_profile=sysid_profile,
    )

    result_payload = {
        "status": verdict.certification_status,
        "compliance_score": verdict.safety_compliance_score,
        "total_scenarios": verdict.total_scenarios_evaluated,
        "passed_scenarios": verdict.scenarios_passed,
        "failed_scenarios": verdict.scenarios_failed,
        "safe_friction": verdict.safe_operational_boundaries["minimum_safe_surface_friction_mu"],
        "incident_id": inc_label,
        "html_report_filename": os.path.basename(html_path),
        "json_report_filename": os.path.basename(json_path),
        "usd_stage_filename": os.path.basename(twin_data["usd_stage_path"]),
        "recommendations": verdict.critical_recommendations,
        "failure_breakdown": verdict.failure_breakdown,
        "sysid_profile": asdict(sysid_profile),
        "regulatory_compliance": [asdict(r) for r in verdict.regulatory_compliance],
        "remediation": {
            "speed_filter_mask_filename": os.path.basename(remediation_pkg.speed_filter_mask_path),
            "speed_filter_mask_yaml": remediation_pkg.speed_filter_mask_yaml,
            "controller_patch_filename": os.path.basename(remediation_pkg.controller_patch_path),
            "controller_patch_yaml": remediation_pkg.controller_patch_yaml,
            "rl_training_filename": os.path.basename(remediation_pkg.rl_training_path),
            "summary_instructions": remediation_pkg.summary_instructions,
        },
        "insurance_telematics": {
            "fleet_safety_rating": site_risk.fleet_safety_rating,
            "underwriting_score": site_risk.underwriting_score,
            "insurance_tier": site_risk.insurance_tier,
            "annual_premium_saving_est": site_risk.annual_premium_saving_est,
            "site_risk_html_filename": os.path.basename(site_risk.html_report_path),
        },
    }

    if job_id:
        update_audit_job(
            job_id,
            status="COMPLETED",
            progress_pct=100,
            compliance_score=verdict.safety_compliance_score,
            verdict_status=verdict.certification_status,
            result_dict=result_payload,
        )

    return result_payload


def _async_worker_entrypoint(job_id: str, mcap_path: str, scenario_count: int):
    """Entrypoint executed in background thread."""
    try:
        run_audit_pipeline(mcap_path=mcap_path, scenario_count=scenario_count, job_id=job_id)
    except Exception as e:
        update_audit_job(job_id, status="FAILED", error_message=str(e), progress_pct=100)


def dispatch_async_audit(job_id: str, mcap_path: str, scenario_count: int):
    """Submits the audit task to the background executor."""
    _executor.submit(_async_worker_entrypoint, job_id, mcap_path, scenario_count)
