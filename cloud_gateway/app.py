"""
Diffraction Multi-Tenant Cloud Gateway API & Verification Control Plane.
Enterprise backend supporting tenant isolation, API key authentication,
ACID database persistence, asynchronous verification job queues, and ROS 2 telemetry ingestion.
"""

from contextlib import asynccontextmanager
from dataclasses import asdict
import os
import shutil
import time
from typing import Any, Dict, List, Optional
from fastapi import Depends, FastAPI, File, Header, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from cloud_gateway.db import (
    authenticate_api_key,
    create_audit_job,
    create_tenant,
    generate_tenant_api_key,
    get_audit_job,
    get_default_tenant,
    get_incidents_by_tenant,
    get_tenant_fleet_metrics,
    init_db,
    list_audit_jobs,
    save_incident,
    update_audit_job,
)
from cloud_gateway.job_runner import dispatch_async_audit, run_audit_pipeline
from cloud_gateway.mcap_parser import DecoupledIncident, McapParser
from cloud_gateway.storage_backend import storage
from edge.safety_governor import DynamicSafetyGovernor
from scripts.run_mock_robot import simulate_warehouse_amr_run
from scripts.simulate_edge_case import SCENARIO_SIMULATORS

UPLOAD_DIR = "./storage/telemetry_drops"
REPORTS_DIR = "./storage/reports"
STAGES_DIR = "./storage/usd_stages"
PATCHES_DIR = "./storage/remediation_patches"
STATIC_DIR = "./cloud_gateway/static"

for d in [UPLOAD_DIR, REPORTS_DIR, STAGES_DIR, PATCHES_DIR, STATIC_DIR]:
    os.makedirs(d, exist_ok=True)

# In-memory fast cache (mirrored in SQLite)
INCIDENT_REGISTRY: Dict[str, Dict[str, Any]] = {}
MAX_UPLOAD_BYTES = 250 * 1024 * 1024  # 250 MB ceiling


def rehydrate_incident_registry():
    """Auto-rehydrates incident registry and seeds database on server boot."""
    default_tenant = get_default_tenant()
    t_id = default_tenant["tenant_id"]

    if os.path.exists(UPLOAD_DIR):
        for fname in os.listdir(UPLOAD_DIR):
            if fname.endswith(".mcap"):
                fpath = os.path.join(UPLOAD_DIR, fname)
                try:
                    parsed = McapParser.parse_file(fpath)
                    iid = os.path.splitext(fname)[0]
                    inc_record = {
                        "incident_id": iid,
                        "file_path": fpath,
                        "robot_id": parsed.robot_id,
                        "facility_id": parsed.facility_id,
                        "trigger_type": parsed.trigger_type,
                        "trigger_severity": parsed.trigger_severity,
                        "total_messages": parsed.total_messages,
                        "duration_seconds": parsed.duration_seconds,
                        "channels": parsed.channels,
                        "ingested_at": os.path.getmtime(fpath),
                        "pipeline_status": "READY_FOR_SIMULATION",
                    }
                    INCIDENT_REGISTRY[iid] = inc_record
                    save_incident(t_id, inc_record)
                except Exception:
                    pass


@asynccontextmanager
async def lifespan(app_instance: FastAPI):
    init_db()
    rehydrate_incident_registry()
    yield


app = FastAPI(
    title="Diffraction Multi-Tenant Physical AI Ingestion Gateway & Control Plane",
    version="2.4.0",
    description="Enterprise Multi-Tenant Verification & Safety Certification Platform for Autonomous Fleets.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static downloads for reports, USD stages, and remediation patches
app.mount("/reports", StaticFiles(directory=REPORTS_DIR), name="reports")
app.mount("/stages", StaticFiles(directory=STAGES_DIR), name="stages")
app.mount("/patches", StaticFiles(directory=PATCHES_DIR), name="patches")


# ---------------------------------------------------------------------------
# Multi-Tenant Authentication & Scoping Dependency
# ---------------------------------------------------------------------------

def get_current_tenant(
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
    authorization: Optional[str] = Header(None),
) -> Dict[str, Any]:
    """
    Resolves the requesting tenant using API Key or Bearer Token.
    Defaults to the seeded demo tenant for zero-friction web console evaluation.
    """
    raw_key = x_api_key
    if not raw_key and authorization:
        parts = authorization.split(" ")
        if len(parts) == 2 and parts[0].lower() in ["bearer", "token"]:
            raw_key = parts[1]

    if raw_key:
        tenant_ctx = authenticate_api_key(raw_key)
        if tenant_ctx:
            return tenant_ctx

    return get_default_tenant()


# ---------------------------------------------------------------------------
# Health, Readiness & Enterprise Probes
# ---------------------------------------------------------------------------

@app.get("/")
def serve_dashboard():
    """Serves the interactive web control console."""
    index_file = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "Diffraction API operational. Static console not found."}


@app.get("/healthz")
def liveness_probe():
    """Kubernetes / Load-balancer liveness probe."""
    return {"status": "ok", "service": "diffraction-control-plane", "timestamp": time.time()}


@app.get("/readyz")
def readiness_probe():
    """Readiness probe verifying database connectivity and storage directory writeability."""
    try:
        tenant = get_default_tenant()
        test_file = os.path.join(UPLOAD_DIR, ".ready_probe")
        with open(test_file, "w") as f:
            f.write("ok")
        os.remove(test_file)
        return {
            "status": "ready",
            "database": "connected",
            "storage": "writable",
            "default_tenant": tenant.get("tenant_slug"),
            "timestamp": time.time(),
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Readiness check failed: {str(e)}")


@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "service": "diffraction-cloud-gateway",
        "version": "2.4.0",
        "timestamp": time.time(),
        "total_incidents_indexed": len(INCIDENT_REGISTRY),
    }


@app.get("/api/v1/system/status")
def system_status(tenant: Dict[str, Any] = Depends(get_current_tenant)):
    """Enterprise telemetry on database health, active tenant context, and workers."""
    metrics = get_tenant_fleet_metrics(tenant["tenant_id"])
    return {
        "engine": "Diffraction Enterprise Physical AI Sentinel",
        "version": "2.4.0",
        "tenant_id": tenant["tenant_id"],
        "tenant_name": tenant["tenant_name"],
        "tenant_tier": tenant["tenant_tier"],
        "quota_remaining": tenant.get("monthly_quota", 50000) - metrics["total_audits_executed"],
        "fleet_safety_rating": metrics["fleet_safety_rating"],
        "total_incidents_recorded": metrics["total_incidents_recorded"],
        "total_audits_executed": metrics["total_audits_executed"],
        "timestamp": time.time(),
    }


# ---------------------------------------------------------------------------
# Tenant & API Key Management Endpoints
# ---------------------------------------------------------------------------

class CreateTenantRequest(BaseModel):
    name: str
    slug: str
    tier: str = "starter"  # starter, growth, enterprise
    max_scenarios: int = 500
    monthly_quota: int = 10000


class CreateApiKeyRequest(BaseModel):
    name: str
    role: str = "operator"  # admin, operator, read_only


@app.get("/api/v1/tenants/me")
def get_current_tenant_profile(tenant: Dict[str, Any] = Depends(get_current_tenant)):
    """Returns current tenant profile, tier limits, and role."""
    return {
        "tenant_id": tenant["tenant_id"],
        "tenant_slug": tenant["tenant_slug"],
        "tenant_name": tenant["tenant_name"],
        "tenant_tier": tenant["tenant_tier"],
        "role": tenant.get("role", "operator"),
        "max_scenarios_per_run": tenant.get("max_scenarios", 300),
        "monthly_quota": tenant.get("monthly_quota", 5000),
    }


@app.post("/api/v1/tenants/api-keys")
def api_create_tenant_key(req: CreateApiKeyRequest, tenant: Dict[str, Any] = Depends(get_current_tenant)):
    """Generates a secure API key for the authenticated enterprise tenant."""
    if tenant.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin role required to generate API keys.")
    key_info = generate_tenant_api_key(tenant["tenant_id"], name=req.name, role=req.role)
    return {
        "status": "success",
        "message": "API key generated successfully. Save this secret securely; it cannot be shown again.",
        "key_id": key_info["key_id"],
        "api_key": key_info["api_key"],
        "name": key_info["name"],
        "role": key_info["role"],
        "tenant_id": key_info["tenant_id"],
    }


@app.post("/api/v1/tenants/create")
def api_provision_tenant(req: CreateTenantRequest, tenant: Dict[str, Any] = Depends(get_current_tenant)):
    """Provisions a new enterprise tenant (Admin access required)."""
    if tenant.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Super-admin privileges required to provision new tenants.")
    try:
        new_tenant = create_tenant(
            name=req.name,
            slug=req.slug,
            tier=req.tier,
            max_scenarios=req.max_scenarios,
            monthly_quota=req.monthly_quota,
        )
        # Create initial admin key for new tenant
        initial_key = generate_tenant_api_key(new_tenant["id"], name=f"{req.name} Primary Admin", role="admin")
        return {
            "status": "success",
            "tenant": new_tenant,
            "initial_admin_key": initial_key["api_key"],
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to create tenant: {str(e)}")


# ---------------------------------------------------------------------------
# Multi-Tenant Fleet Telematics Endpoints
# ---------------------------------------------------------------------------

@app.get("/api/v1/fleet/stats")
def api_get_fleet_stats(tenant: Dict[str, Any] = Depends(get_current_tenant)):
    """Returns multi-facility aggregate metrics and hazard breakdown for the tenant."""
    return get_tenant_fleet_metrics(tenant["tenant_id"])


@app.get("/api/v1/fleet/incidents")
def api_list_incidents(
    limit: int = 50,
    offset: int = 0,
    tenant: Dict[str, Any] = Depends(get_current_tenant),
):
    """Returns paginated incidents recorded for the tenant."""
    incidents = get_incidents_by_tenant(tenant["tenant_id"], limit=limit, offset=offset)
    return {
        "tenant_id": tenant["tenant_id"],
        "count": len(incidents),
        "limit": limit,
        "offset": offset,
        "incidents": incidents,
    }


# ---------------------------------------------------------------------------
# Edge Safety Governor Evaluation
# ---------------------------------------------------------------------------

class GovernorEvalRequest(BaseModel):
    cmd_linear_vel: float = 1.0
    cmd_angular_vel: float = 0.5
    estimated_surface_mu: float = 0.25
    distance_to_obstacle_m: float = 1.5
    observed_wheel_slip_ratio: float = 0.40


@app.post("/api/v1/edge/safety-governor/evaluate")
def api_evaluate_governor(req: GovernorEvalRequest):
    """Real-time Control Barrier Function evaluation endpoint for robot edge nodes."""
    gov = DynamicSafetyGovernor()
    intervention = gov.govern_velocity_command(
        cmd_linear_vel=req.cmd_linear_vel,
        cmd_angular_vel=req.cmd_angular_vel,
        estimated_surface_mu=req.estimated_surface_mu,
        distance_to_obstacle_m=req.distance_to_obstacle_m,
        observed_wheel_slip_ratio=req.observed_wheel_slip_ratio,
    )
    return asdict(intervention)


# ---------------------------------------------------------------------------
# License & Monetization Verification
# ---------------------------------------------------------------------------

class LicenseVerifyRequest(BaseModel):
    license_key: str


class CheckoutSessionRequest(BaseModel):
    plan_tier: str  # "pilot_30d" or "cicd_monthly"
    customer_email: str
    company_name: Optional[str] = "Autonomous Systems Client"


VALID_LICENSE_KEYS = {
    "diff_live_9f82a17bc341098de72": {"tier": "ENTERPRISE_PILOT", "company": "Acme Logistics Corp", "seats": 10},
    "diff_pilot_enterprise_2026": {"tier": "ENTERPRISE_PILOT", "company": "Vanguard Robotics", "seats": 5},
    "diff_demo_access": {"tier": "ENTERPRISE_PILOT", "company": "Evaluator Demo", "seats": 1},
    "diff_live_demo_key_778899": {"tier": "ENTERPRISE_PILOT", "company": "Global Enterprise AMR Fleet", "seats": 25},
}


@app.post("/api/v1/auth/verify-license")
def verify_license(req: LicenseVerifyRequest):
    """Validates an Enterprise API Token or Pilot License Key."""
    key = req.license_key.strip()
    if key in VALID_LICENSE_KEYS:
        info = VALID_LICENSE_KEYS[key]
        return {
            "valid": True,
            "tier": info["tier"],
            "company": info["company"],
            "features": [
                "unlimited_nav2_remediation",
                "openusd_stage_download",
                "ansi_r1508_carrier_dossier",
                "ci_cd_github_actions",
                "dynamic_safety_governor_c_lib",
            ],
            "message": "Enterprise license active.",
        }
    return {
        "valid": False,
        "tier": "FREE_DIAGNOSTIC",
        "company": "Unregistered",
        "features": ["telemetry_ingestion", "kinematic_sysid_preview"],
        "message": "Invalid or expired license key.",
    }


@app.post("/api/v1/billing/create-checkout-session")
def create_checkout_session(req: CheckoutSessionRequest):
    """Creates an enterprise checkout or pilot SOW booking session."""
    if req.plan_tier == "pilot_30d":
        amount_usd = 20000
        plan_name = "Diffraction 30-Day Diagnostic Pilot Statement of Work"
    else:
        amount_usd = 4500
        plan_name = "Diffraction Continuous Safety CI/CD Subscription"

    session_id = f"diff_sess_{int(time.time())}_{req.plan_tier}"
    return {
        "session_id": session_id,
        "plan_name": plan_name,
        "amount_usd": amount_usd,
        "customer_email": req.customer_email,
        "company_name": req.company_name,
        "status": "READY_FOR_PAYMENT",
        "checkout_url": f"mailto:founder@diffraction.ai?subject=Purchase%20Order:%20{plan_name.replace(' ', '%20')}&body=Company:%20{req.company_name}%0AEmail:%20{req.customer_email}%0APlan:%20{plan_name}%0AAmount:%20${amount_usd:,}",
        "instant_unlock_demo_key": "diff_demo_access",
    }


# ---------------------------------------------------------------------------
# Telemetry Ingestion & Simulation Endpoints
# ---------------------------------------------------------------------------

@app.post("/api/v1/telemetry/upload", status_code=status.HTTP_201_CREATED)
async def upload_telemetry_mcap(
    file: UploadFile = File(...),
    tenant: Dict[str, Any] = Depends(get_current_tenant),
):
    """Receives compressed MCAP containers from edge robot agents with strict size & path validation."""
    raw_filename = os.path.basename(file.filename or "")
    if not raw_filename.endswith(".mcap"):
        raise HTTPException(status_code=400, detail="Only .mcap container files are accepted.")

    clean_filename = "".join(c for c in raw_filename if c.isalnum() or c in "._-")
    dest_path = os.path.join(UPLOAD_DIR, clean_filename)

    bytes_written = 0
    with open(dest_path, "wb") as buffer:
        while True:
            chunk = await file.read(1024 * 1024)
            if not chunk:
                break
            bytes_written += len(chunk)
            if bytes_written > MAX_UPLOAD_BYTES:
                buffer.close()
                if os.path.exists(dest_path):
                    os.remove(dest_path)
                raise HTTPException(status_code=413, detail="Payload exceeds maximum allowed limit of 250MB.")
            buffer.write(chunk)

    try:
        parsed = McapParser.parse_file(dest_path)
    except Exception as e:
        if os.path.exists(dest_path):
            os.remove(dest_path)
        raise HTTPException(status_code=422, detail=f"Failed to parse MCAP telemetry: {str(e)}")

    incident_id = os.path.splitext(clean_filename)[0]

    trajectory_points = []
    odom_msgs = parsed.messages_by_topic.get("/odom", [])
    for msg in odom_msgs:
        data = msg.get("data", {})
        c_pose = data.get("current_pose")
        if isinstance(c_pose, dict) and "x" in c_pose and "y" in c_pose:
            trajectory_points.append({"x": round(float(c_pose["x"]), 3), "y": round(float(c_pose["y"]), 3)})

    inc_record = {
        "incident_id": incident_id,
        "file_path": dest_path,
        "robot_id": parsed.robot_id,
        "facility_id": parsed.facility_id,
        "trigger_type": parsed.trigger_type,
        "trigger_severity": parsed.trigger_severity,
        "trigger_timestamp_ns": parsed.trigger_timestamp_ns,
        "duration_seconds": parsed.duration_seconds,
        "total_messages": parsed.total_messages,
        "channels": parsed.channels,
        "ingested_at": time.time(),
        "pipeline_status": "READY_FOR_SIMULATION",
    }
    INCIDENT_REGISTRY[incident_id] = inc_record
    save_incident(tenant["tenant_id"], inc_record)

    return {
        "message": "Telemetry packet successfully ingested and verified.",
        "incident_id": incident_id,
        "details": inc_record,
        "trajectory": trajectory_points,
    }


@app.post("/api/v1/simulation/simulate-incident")
def api_simulate_incident(
    scenario: str = "traction_slip",
    tenant: Dict[str, Any] = Depends(get_current_tenant),
):
    """Triggers mock robot simulation generating an authentic AMR failure MCAP."""
    sim_func = SCENARIO_SIMULATORS.get(scenario, simulate_warehouse_amr_run)
    mcap_path = sim_func(output_dir=UPLOAD_DIR)
    if not mcap_path:
        drops = [os.path.join(UPLOAD_DIR, f) for f in os.listdir(UPLOAD_DIR) if f.endswith(".mcap")]
        mcap_path = sorted(drops, key=os.path.getmtime)[-1]

    parsed = McapParser.parse_file(mcap_path)
    incident_id = os.path.splitext(os.path.basename(mcap_path))[0]
    inc_record = {
        "incident_id": incident_id,
        "file_path": mcap_path,
        "robot_id": parsed.robot_id,
        "facility_id": parsed.facility_id,
        "trigger_type": parsed.trigger_type,
        "trigger_severity": parsed.trigger_severity,
        "total_messages": parsed.total_messages,
        "duration_seconds": parsed.duration_seconds,
        "channels": parsed.channels,
        "ingested_at": time.time(),
        "scenario_class": scenario,
    }
    INCIDENT_REGISTRY[incident_id] = inc_record
    save_incident(tenant["tenant_id"], inc_record)

    return {
        "status": "success",
        "incident_id": incident_id,
        "incident_file": os.path.basename(mcap_path),
        "robot_id": parsed.robot_id,
        "facility_id": parsed.facility_id,
        "trigger_type": parsed.trigger_type,
        "scenario_class": scenario,
        "messages": parsed.total_messages,
    }


# ---------------------------------------------------------------------------
# Synchronous & Asynchronous Verification Audit Endpoints
# ---------------------------------------------------------------------------

class AsyncAuditRequest(BaseModel):
    incident_id: Optional[str] = None
    scenario_count: int = 150


@app.post("/api/v1/simulation/run-audit")
def api_run_audit(
    scenario_count: int = 150,
    incident_id: Optional[str] = None,
    tenant: Dict[str, Any] = Depends(get_current_tenant),
):
    """Executes the complete Closed-Loop Verification Pipeline synchronously."""
    mcap_path = None
    if incident_id and incident_id in INCIDENT_REGISTRY:
        candidate = INCIDENT_REGISTRY[incident_id].get("file_path")
        if candidate and os.path.exists(candidate):
            mcap_path = candidate

    if not mcap_path:
        drops = [os.path.join(UPLOAD_DIR, f) for f in os.listdir(UPLOAD_DIR) if f.endswith(".mcap")]
        if not drops:
            mcap_path = simulate_warehouse_amr_run(output_dir=UPLOAD_DIR)
        else:
            mcap_path = sorted(drops, key=os.path.getmtime)[-1]

    # Create tracked job record in database
    job_id = create_audit_job(tenant["tenant_id"], incident_id or os.path.basename(mcap_path), scenario_count)

    # Execute full pipeline
    result = run_audit_pipeline(mcap_path=mcap_path, scenario_count=scenario_count, job_id=job_id)
    return result


@app.post("/api/v1/simulation/jobs/run-audit-async", status_code=status.HTTP_202_ACCEPTED)
def api_dispatch_async_audit(
    req: AsyncAuditRequest,
    tenant: Dict[str, Any] = Depends(get_current_tenant),
):
    """
    Submits an asynchronous Monte Carlo physical verification job to background workers.
    Returns immediately with job_id for non-blocking enterprise fleet scale.
    """
    mcap_path = None
    if req.incident_id and req.incident_id in INCIDENT_REGISTRY:
        candidate = INCIDENT_REGISTRY[req.incident_id].get("file_path")
        if candidate and os.path.exists(candidate):
            mcap_path = candidate

    if not mcap_path:
        drops = [os.path.join(UPLOAD_DIR, f) for f in os.listdir(UPLOAD_DIR) if f.endswith(".mcap")]
        if not drops:
            mcap_path = simulate_warehouse_amr_run(output_dir=UPLOAD_DIR)
        else:
            mcap_path = sorted(drops, key=os.path.getmtime)[-1]

    job_id = create_audit_job(tenant["tenant_id"], req.incident_id or os.path.basename(mcap_path), req.scenario_count)
    dispatch_async_audit(job_id=job_id, mcap_path=mcap_path, scenario_count=req.scenario_count)

    return {
        "status": "accepted",
        "job_id": job_id,
        "tenant_id": tenant["tenant_id"],
        "scenario_count": req.scenario_count,
        "message": "Verification job queued for execution.",
        "poll_status_url": f"/api/v1/simulation/jobs/{job_id}",
    }


@app.get("/api/v1/simulation/jobs/{job_id}")
def api_get_job_status(job_id: str, tenant: Dict[str, Any] = Depends(get_current_tenant)):
    """Polls the state and progress of an asynchronous verification audit job."""
    job = get_audit_job(job_id, tenant_id=tenant["tenant_id"])
    if not job:
        raise HTTPException(status_code=404, detail="Audit job not found or unauthorized.")
    return job


@app.get("/api/v1/simulation/jobs")
def api_list_tenant_jobs(
    limit: int = 20,
    tenant: Dict[str, Any] = Depends(get_current_tenant),
):
    """Lists recent audit jobs for the authenticated tenant."""
    jobs = list_audit_jobs(tenant["tenant_id"], limit=limit)
    return {
        "tenant_id": tenant["tenant_id"],
        "count": len(jobs),
        "jobs": jobs,
    }
