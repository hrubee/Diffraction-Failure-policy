"""
Unit tests for Diffraction Monetization, Licensing & Billing API.
"""
from fastapi.testclient import TestClient
from cloud_gateway.app import app

client = TestClient(app)

def test_verify_valid_license_keys():
    # Test demo access key
    resp = client.post("/api/v1/auth/verify-license", json={"license_key": "diff_demo_access"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["valid"] is True
    assert data["tier"] == "ENTERPRISE_PILOT"
    assert "unlimited_nav2_remediation" in data["features"]
    assert "ansi_r1508_carrier_dossier" in data["features"]

    # Test enterprise key
    resp2 = client.post("/api/v1/auth/verify-license", json={"license_key": "diff_pilot_enterprise_2026"})
    assert resp2.status_code == 200
    data2 = resp2.json()
    assert data2["valid"] is True
    assert data2["company"] == "Vanguard Robotics"
    assert "ci_cd_github_actions" in data2["features"]

def test_verify_invalid_license_key():
    resp = client.post("/api/v1/auth/verify-license", json={"license_key": "invalid_fake_key_123"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["valid"] is False
    assert data["tier"] == "FREE_DIAGNOSTIC"

def test_create_checkout_session_pilot():
    resp = client.post("/api/v1/billing/create-checkout-session", json={
        "plan_tier": "pilot_30d",
        "company_name": "Test Robotics Inc.",
        "customer_email": "ops@testrobotics.com"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["amount_usd"] == 20000
    assert "diff_sess_" in data["session_id"]
    assert "checkout_url" in data
    assert data["instant_unlock_demo_key"] == "diff_demo_access"

def test_create_checkout_session_monthly():
    resp = client.post("/api/v1/billing/create-checkout-session", json={
        "plan_tier": "cicd_monthly",
        "company_name": "Vanguard Logistics",
        "customer_email": "vp_eng@vanguard.io"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["amount_usd"] == 4500
    assert "Continuous Safety" in data["plan_name"]
