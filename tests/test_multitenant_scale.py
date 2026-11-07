"""
Enterprise Multi-Tenant & Scaled Fleet Verification Test Suite.
Verifies tenant isolation, API key auth, asynchronous background verification jobs,
health/readiness probes, and fleet metrics aggregation.
"""

import time
import pytest
from fastapi.testclient import TestClient

from cloud_gateway.app import app
from cloud_gateway.db import (
    authenticate_api_key,
    create_tenant,
    generate_tenant_api_key,
    get_audit_job,
    get_default_tenant,
    get_tenant_fleet_metrics,
    init_db,
)

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    init_db()


def test_healthz_and_readyz_probes():
    """Verifies Kubernetes-style liveness and readiness probes."""
    res_live = client.get("/healthz")
    assert res_live.status_code == 200
    assert res_live.json()["status"] == "ok"

    res_ready = client.get("/readyz")
    assert res_ready.status_code == 200
    data = res_ready.json()
    assert data["status"] == "ready"
    assert data["database"] == "connected"
    assert data["storage"] == "writable"


def test_system_status_enterprise():
    """Verifies system status endpoint returns fleet analytics and quotas."""
    res = client.get("/api/v1/system/status")
    assert res.status_code == 200
    data = res.json()
    assert "fleet_safety_rating" in data
    assert "tenant_tier" in data
    assert data["tenant_tier"] == "enterprise"


def test_tenant_creation_and_api_key_auth():
    """Verifies provisioning a new enterprise tenant and authenticating via API key."""
    # 1. Provision new tenant using default admin
    slug = f"acme-robotics-{int(time.time())}"
    res = client.post(
        "/api/v1/tenants/create",
        json={
            "name": "Acme Robotics Global",
            "slug": slug,
            "tier": "enterprise",
            "max_scenarios": 1000,
            "monthly_quota": 25000,
        },
    )
    assert res.status_code == 200
    payload = res.json()
    assert payload["status"] == "success"
    tenant_id = payload["tenant"]["id"]
    admin_api_key = payload["initial_admin_key"]
    assert admin_api_key.startswith("diff_live_")

    # 2. Authenticate as the new tenant using X-API-Key
    headers = {"X-API-Key": admin_api_key}
    res_me = client.get("/api/v1/tenants/me", headers=headers)
    assert res_me.status_code == 200
    me_data = res_me.json()
    assert me_data["tenant_id"] == tenant_id
    assert me_data["tenant_slug"] == slug
    assert me_data["role"] == "admin"

    # 3. Create a secondary operator key for the tenant
    res_key = client.post(
        "/api/v1/tenants/api-keys",
        json={"name": "Operator Edge Key 1", "role": "operator"},
        headers=headers,
    )
    assert res_key.status_code == 200
    op_key_data = res_key.json()
    assert op_key_data["role"] == "operator"
    assert op_key_data["api_key"].startswith("diff_live_")


def test_fleet_stats_and_incident_listing():
    """Verifies multi-facility fleet telematics aggregation."""
    res = client.get("/api/v1/fleet/stats")
    assert res.status_code == 200
    data = res.json()
    assert "total_incidents_recorded" in data
    assert "active_facilities" in data
    assert len(data["active_facilities"]) >= 4

    res_inc = client.get("/api/v1/fleet/incidents?limit=10")
    assert res_inc.status_code == 200
    assert "incidents" in res_inc.json()


def test_asynchronous_verification_job_lifecycle():
    """Verifies queuing an asynchronous verification audit and polling for completion."""
    # 1. Simulate an incident to get an incident_id
    sim_res = client.post("/api/v1/simulation/simulate-incident?scenario=optical_glare")
    assert sim_res.status_code == 200
    incident_id = sim_res.json()["incident_id"]

    # 2. Dispatch async audit job
    async_res = client.post(
        "/api/v1/simulation/jobs/run-audit-async",
        json={"incident_id": incident_id, "scenario_count": 25},
    )
    assert async_res.status_code == 202
    job_payload = async_res.json()
    assert job_payload["status"] == "accepted"
    job_id = job_payload["job_id"]

    # 3. Poll job status until completed (with timeout)
    max_wait_seconds = 10
    start_time = time.time()
    completed = False
    final_job_data = None

    while time.time() - start_time < max_wait_seconds:
        status_res = client.get(f"/api/v1/simulation/jobs/{job_id}")
        assert status_res.status_code == 200
        final_job_data = status_res.json()
        if final_job_data["status"] == "COMPLETED":
            completed = True
            break
        time.sleep(0.4)

    assert completed, f"Job did not complete in time. Last status: {final_job_data}"
    assert final_job_data["progress_pct"] == 100
    assert "compliance_score" in final_job_data
    assert "result" in final_job_data
    assert final_job_data["result"]["incident_id"].startswith("rover_scout_08") or final_job_data["result"]["incident_id"].startswith("amr_reach_019")


def test_compiled_nextjs_frontend_serving():
    """Verifies that the root endpoint serves the compiled Next.js enterprise SPA."""
    res = client.get("/")
    assert res.status_code == 200
    assert "text/html" in res.headers.get("content-type", "")
    content = res.text
    assert "Diffraction" in content
    assert "<!DOCTYPE html>" in content
    assert "/_next/static/" in content

