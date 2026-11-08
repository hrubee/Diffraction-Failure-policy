"""
Unit and Integration Tests for Diffraction Synthetic Data Factory
Tests Isaac Sim & OpenUSD API endpoints, embodiment specs, job queues, and dataset manifests.
"""

from fastapi.testclient import TestClient
from cloud_gateway.app import app

client = TestClient(app)

def test_list_embodiments():
    response = client.get("/api/v1/factory/embodiments")
    assert response.status_code == 200
    data = response.json()
    assert "embodiments" in data
    assert len(data["embodiments"]) >= 4
    ids = [e["id"] for e in data["embodiments"]]
    assert "humanoid_unitree_h1" in ids
    assert "amr_agilex_hunter" in ids
    assert "arm_franka_panda" in ids
    assert "quadruped_unitree_go2" in ids

def test_list_environments():
    response = client.get("/api/v1/factory/environments")
    assert response.status_code == 200
    data = response.json()
    assert "environments" in data
    assert len(data["environments"]) >= 4
    ids = [e["id"] for e in data["environments"]]
    assert "warehouse_fulfillment" in ids
    assert "loading_dock_glare" in ids

def test_list_datasets_and_manifest():
    response = client.get("/api/v1/factory/datasets")
    assert response.status_code == 200
    data = response.json()
    assert "datasets" in data
    assert len(data["datasets"]) >= 4
    first_id = data["datasets"][0]["id"]

    # Test manifest
    manifest_res = client.get(f"/api/v1/factory/datasets/{first_id}/manifest")
    assert manifest_res.status_code == 200
    manifest = manifest_res.json()
    assert manifest["dataset_id"] == first_id
    assert "python_snippet" in manifest
    assert "sim2real_calibration" in manifest

def test_job_dispatch_lifecycle():
    # 1. Create Job
    payload = {
        "name": "PyTest Humanoid Generation Run",
        "embodiment_id": "humanoid_unitree_h1",
        "environment_id": "warehouse_fulfillment",
        "target_episodes": 25000,
        "format": "LeRobot_v2",
        "lighting_lux_min": 150.0,
        "lighting_lux_max": 1200.0,
        "friction_mu_min": 0.15,
        "friction_mu_max": 0.85,
        "mass_variance_pct": 15.0,
        "sensor_latency_jitter_ms": 25.0,
        "include_depth": True,
        "include_semantic_seg": True,
        "include_lidar": True,
        "cluster_gpus": 32
    }
    create_res = client.post("/api/v1/factory/jobs", json=payload)
    assert create_res.status_code == 201
    job = create_res.json()["job"]
    job_id = job["id"]

    # 2. Get Job Telemetry
    job_res = client.get(f"/api/v1/factory/jobs/{job_id}")
    assert job_res.status_code == 200
    job_detail = job_res.json()
    assert job_detail["job"]["id"] == job_id
    assert "telemetry" in job_detail

    # 3. Pause Job
    pause_res = client.post(f"/api/v1/factory/jobs/{job_id}/pause")
    assert pause_res.status_code == 200
    assert pause_res.json()["job"]["status"] == "PAUSED"

    # 4. Resume Job
    resume_res = client.post(f"/api/v1/factory/jobs/{job_id}/resume")
    assert resume_res.status_code == 200
    assert resume_res.json()["job"]["status"] == "GENERATING"

def test_sim2real_benchmark_endpoint():
    response = client.get("/api/v1/factory/sim2real/benchmark")
    assert response.status_code == 200
    data = response.json()
    assert data["overall_sim2real_fidelity_pct"] >= 95.0
    assert "friction_slip_wasserstein_distance" in data["distributions"]
    assert len(data["benchmarked_platforms"]) >= 3

def test_list_studio_packages():
    response = client.get("/api/v1/studio/packages")
    assert response.status_code == 200
    data = response.json()
    assert "packages" in data
    assert len(data["packages"]) == 3
    ids = [p["id"] for p in data["packages"]]
    assert "robot_usd_rig" in ids
    assert "procedural_stage" in ids
    assert "cosmos_dataset" in ids

def test_list_sample_assets():
    response = client.get("/api/v1/studio/sample-assets")
    assert response.status_code == 200
    data = response.json()
    assert "sample_assets" in data
    assert len(data["sample_assets"]) >= 4

def test_calculate_studio_quote():
    payload = {
        "package_id": "robot_usd_rig",
        "robot_category": "Humanoid",
        "robot_dof": 19,
        "target_environment": "Warehouse",
        "trajectory_count": 50000,
        "cosmos_augmentation": True,
        "urgency": "standard",
        "company_name": "Test Robotics Inc",
        "contact_email": "cto@testrobotics.com",
        "urdf_repo_url": "https://github.com/test/robot",
    }
    response = client.post("/api/v1/studio/quote", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["calculated_price_usd"] >= 7500
    assert data["estimated_turnaround_days"] >= 3
    assert "quote_id" in data
    assert "sim2real_guarantee" in data

def test_submit_studio_inquiry():
    payload = {
        "name": "Sarah Connor",
        "email": "sarah@cyberdyne-ai.com",
        "company": "Cyberdyne Systems",
        "robot_type": "Bipedal Humanoid",
        "package_interest": "cosmos_dataset",
        "notes": "Testing Isaac Lab + Cosmos dataset generation pipeline.",
        "urdf_link": "https://github.com/cyberdyne/t800-urdf",
    }
    response = client.post("/api/v1/studio/inquiry", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["inquiry"]["company"] == "Cyberdyne Systems"
    assert "id" in data["inquiry"]

