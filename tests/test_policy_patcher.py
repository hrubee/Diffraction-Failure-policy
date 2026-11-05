"""
Unit tests for the Automated Policy Remediation Patcher & Site Risk Assessor.
"""

import os
import pytest
from remediation.policy_patcher import PolicyRemediationPatcher
from reporting.site_risk_assessor import SiteRiskAssessor
from simulation_harness.certification_oracle import SafetyAuditVerdict, RegulatoryClauseEvaluation


class DummyVerdict:
    def __init__(self):
        self.safety_compliance_score = 78.0
        self.safe_operational_boundaries = {
            "recommended_max_speed_ms": 0.70,
            "minimum_safe_surface_friction_mu": 0.35,
            "maximum_tolerable_glare_severity": 0.55,
        }
        self.critical_recommendations = ["Increase dynamic braking lookahead by 45%."]
        self.regulatory_compliance = []


def test_policy_remediation_generation(tmp_path):
    patcher = PolicyRemediationPatcher(output_dir=str(tmp_path))
    verdict = DummyVerdict()
    meta = {"robot_id": "amr_tugger_042", "facility_id": "chicago_hub_bay7"}

    pkg = patcher.generate_remediation_package(
        incident_id="incident_042",
        incident_meta=meta,
        audit_verdict=verdict,
    )

    assert os.path.exists(pkg.speed_filter_mask_path)
    assert os.path.exists(pkg.controller_patch_path)
    assert os.path.exists(pkg.rl_training_path)

    # Check content of speed mask
    assert "costmap_filter_info_server" in pkg.speed_filter_mask_yaml
    assert "absolute_max_speed_mps: 0.7" in pkg.speed_filter_mask_yaml

    # Check content of controller patch
    assert "lookahead_dist: 0.87" in pkg.controller_patch_yaml
    assert "max_linear_vel: 0.7" in pkg.controller_patch_yaml

    # Check content of RL script
    assert "AMRSlipRecoveryEnv" in pkg.rl_training_script


def test_site_risk_assessor(tmp_path):
    assessor = SiteRiskAssessor(output_dir=str(tmp_path))
    verdict = DummyVerdict()

    profile = assessor.assess_facility(
        facility_id="chicago_hub_bay7",
        audit_verdict=verdict,
        fleet_size=20,
    )

    assert profile.fleet_safety_rating == "FSR-A"  # 78.0 score falls in FSR-A
    assert "Tier 3 Conditional" in profile.insurance_tier
    assert os.path.exists(profile.html_report_path)

    with open(profile.html_report_path, "r", encoding="utf-8") as f:
        html_content = f.read()
    assert "ANSI/RIA R15.08 Part 2 Site Risk Assessment" in html_content
    assert "FSR-A" in html_content
