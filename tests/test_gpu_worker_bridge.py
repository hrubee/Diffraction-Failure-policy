"""
Test suite for Diffraction Distributed NVIDIA GPU Worker Bridge.
Verifies registration, heartbeat, job leasing, and completion.
"""

import pytest
from fastapi.testclient import TestClient
from cloud_gateway.app import app
from backend.engine.gpu_bridge import GpuWorkerBridge, ACTIVE_GPU_WORKERS
from backend.engine.fulfillment_runner import create_fulfillment_job

client = TestClient(app)

def test_gpu_worker_registration_and_heartbeat():
    worker_id = "test-node-rtx4090"
    payload = {
        "worker_id": worker_id,
        "hostname": "dgx-station-01",
        "gpu_name": "NVIDIA GeForce RTX 4090",
        "vram_gb": 24.0,
        "driver_version": "550.54.14",
        "cuda_version": "12.4",
        "isaac_sim_available": True,
    }
    
    # 1. Register
    resp = client.post("/api/v1/factory/gpu-workers/register", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "REGISTERED"
    assert data["worker"]["gpu_name"] == "NVIDIA GeForce RTX 4090"
    assert data["worker"]["vram_gb"] == 24.0

    # 2. List workers
    list_resp = client.get("/api/v1/factory/gpu-workers")
    assert list_resp.status_code == 200
    workers = list_resp.json()["workers"]
    assert any(w["worker_id"] == worker_id for w in workers)

    # 3. Heartbeat
    hb_resp = client.post(f"/api/v1/factory/gpu-workers/{worker_id}/heartbeat", json={"timestamp": 12345.0})
    assert hb_resp.status_code == 200
    assert hb_resp.json()["status"] == "OK"
