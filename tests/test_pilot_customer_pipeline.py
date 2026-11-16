"""
Comprehensive Integration Tests for Diffraction Pilot Customer Packaging & Delivery Engine.
Verifies that the pilot workflow connects all 4 deep-tech pillars, generates all 7 deliverable
directories, produces compliant LeRobot v2 metadata, compiles the CBF-QP edge patch, and outputs
a valid client-ready ZIP archive.
"""

import json
import os
import shutil
import zipfile
import pytest

from cloud_gateway.pilot_packager import PilotCustomerPackager, PilotPackageResult


def test_pilot_customer_pipeline_end_to_end(tmp_path):
    """
    Executes an end-to-end pilot customer run in an isolated temporary directory.
    Validates the end-to-end generation of all 7 deliverable packages and the ZIP bundle.
    """
    packager = PilotCustomerPackager(base_output_dir=str(tmp_path))

    result: PilotPackageResult = packager.execute_pilot_run(
        mcap_path=None,  # Auto-simulates warehouse AMR incident
        robot_id="Test_Unitree_H1",
        facility_id="BMW_Spartanburg_Plant",
        adversarial_episodes=40,
        multimodal_frames_count=6,
    )

    # 1. High-level result validation
    assert isinstance(result, PilotPackageResult)
    assert result.robot_id == "Test_Unitree_H1"
    assert result.facility_id == "BMW_Spartanburg_Plant"
    assert os.path.exists(result.package_dir)
    assert os.path.exists(result.zip_path)
    assert os.path.getsize(result.zip_path) > 1000  # Non-trivial ZIP archive

    # 2. Executive Dossier Verification
    md_dossier = os.path.join(result.package_dir, "01_EXECUTIVE_PILOT_DOSSIER.md")
    html_dossier = os.path.join(result.package_dir, "01_EXECUTIVE_PILOT_DOSSIER.html")
    assert os.path.exists(md_dossier), "Markdown executive dossier must exist"
    assert os.path.exists(html_dossier), "HTML executive dossier must exist"
    with open(md_dossier, "r", encoding="utf-8") as f:
        md_text = f.read()
        assert "Test_Unitree_H1" in md_text
        assert "BMW_Spartanburg_Plant" in md_text
        assert "Pillar 1: Warp-SysID" in md_text
        assert "Pillar 2: MAP-Elites" in md_text
        assert "Pillar 3: Contact-Locked" in md_text
        assert "Pillar 4: Real-Time CBF-QP" in md_text

    # 3. Pillar 1: Warp-SysID Physics Calibration
    sysid_file = os.path.join(result.package_dir, "03_physics_calibration", "warp_sysid_calibration.json")
    assert os.path.exists(sysid_file)
    with open(sysid_file, "r") as f:
        sysid_data = json.load(f)
        assert 0.10 <= sysid_data["calibrated_friction_mu"] <= 0.85
        assert sysid_data["confidence_score"] >= 80.0
        assert sysid_data["r_squared_fit"] > 0.60

    # 4. Pillar 2: OpenUSD Spatial Digital Twin
    usd_dir = os.path.join(result.package_dir, "02_spatial_digital_twin")
    usd_files = [f for f in os.listdir(usd_dir) if f.endswith(".usda")]
    assert len(usd_files) >= 1, "At least one OpenUSD stage must be generated"

    # 5. Pillar 3: MAP-Elites Adversarial Failure Frontier
    frontier_dir = os.path.join(result.package_dir, "04_adversarial_failure_frontier")
    summary_json = os.path.join(frontier_dir, "failure_frontier_summary.json")
    pareto_csv = os.path.join(frontier_dir, "pareto_frontier_points.csv")
    assert os.path.exists(summary_json)
    assert os.path.exists(pareto_csv)
    with open(summary_json, "r") as f:
        front_data = json.load(f)
        assert front_data["total_evaluations"] == 40
        assert front_data["archive_coverage_cells"] >= 1

    # 6. Safety Certification Dossier (ISO 3691-4 / ANSI R15.08)
    cert_dir = os.path.join(result.package_dir, "01_certification_and_audit")
    cert_jsons = [f for f in os.listdir(cert_dir) if f.endswith(".json")]
    cert_htmls = [f for f in os.listdir(cert_dir) if f.endswith(".html")]
    assert len(cert_jsons) >= 1
    assert len(cert_htmls) >= 1

    # 7. Pillar 4: Contact-Locked Multi-Modal Dataset (LeRobot v2)
    multimodal_dir = os.path.join(result.package_dir, "05_multimodal_dataset")
    info_json = os.path.join(multimodal_dir, "meta", "info.json")
    stats_json = os.path.join(multimodal_dir, "meta", "stats.json")
    assert os.path.exists(info_json)
    assert os.path.exists(stats_json)

    with open(info_json, "r") as f:
        info_data = json.load(f)
        assert info_data["codebase_version"] == "v2.0"
        assert info_data["robot_type"] == "Test_Unitree_H1"
        assert "observation.images.primary_rgb" in info_data["features"]

    with open(stats_json, "r") as f:
        stats_data = json.load(f)
        assert stats_data["mean_contact_drift_pixels"] <= 0.50
        assert stats_data["zero_phantom_penetration"] is True

    # Check sample image frames
    samples_dir = os.path.join(multimodal_dir, "samples")
    sample_pngs = [f for f in os.listdir(samples_dir) if f.endswith(".png")]
    assert len(sample_pngs) >= 3, "Sample RGB, Thermal, and Spectral frames must be exported"

    # 8. Edge CBF-QP Safety Governor Firmware Package
    cbf_dir = os.path.join(result.package_dir, "06_edge_cbf_qp_governor")
    assert os.path.exists(os.path.join(cbf_dir, "safety_governor.py"))
    assert os.path.exists(os.path.join(cbf_dir, "deploy_edge_governor.sh"))
    yaml_files = [f for f in os.listdir(cbf_dir) if f.endswith(".yaml")]
    assert len(yaml_files) >= 2, "Nav2 speed filter mask and controller patch YAMLs must be present"

    # 9. ZIP Archive Integrity
    with zipfile.ZipFile(result.zip_path, "r") as zipf:
        namelist = zipf.namelist()
        assert len(namelist) >= 20, f"Expected >= 20 files in ZIP archive, got {len(namelist)}"
        # Verify key root files exist inside the ZIP
        prefix = f"{result.pilot_id}/"
        assert f"{prefix}01_EXECUTIVE_PILOT_DOSSIER.md" in namelist
        assert f"{prefix}06_edge_cbf_qp_governor/safety_governor.py" in namelist
        assert f"{prefix}05_multimodal_dataset/meta/info.json" in namelist


def test_pilot_edge_benchmark_execution():
    """
    Verifies that the CBF-QP edge benchmark produces deterministic solve times < 0.35ms.
    """
    import numpy as np
    from edge.safety_governor import DynamicSafetyGovernor

    governor = DynamicSafetyGovernor()
    latencies = []
    np.random.seed(123)

    for _ in range(100):
        res = governor.govern_velocity_command(
            cmd_linear_vel=1.2,
            cmd_angular_vel=0.5,
            estimated_surface_mu=0.25,
            distance_to_obstacle_m=1.8,
            observed_wheel_slip_ratio=0.1,
        )
        latencies.append(res.qp_solve_time_ms)

    mean_lat = float(np.mean(latencies))
    assert mean_lat < 0.35, f"Mean solve latency exceeded budget: {mean_lat} ms"
    assert res.cbf_barrier_value_h is not None
