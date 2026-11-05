"""
Cloud Gateway API & Web Control Plane.
Handles edge telemetry ingestion, incident tracking, pipeline job execution,
and serves the interactive Physical AI Verification Console.
"""

from contextlib import asynccontextmanager
from dataclasses import asdict
import os
import shutil
import time
from typing import Any, Dict, List, Optional
from fastapi import FastAPI, File, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from cloud_gateway.mcap_parser import DecoupledIncident, McapParser
from cloud_gateway.sysid_calibrator import SysIDCalibrator, SysIDProfile
from cosmos_engine.cosmos_client import CosmosModelClient
from cosmos_engine.domain_randomizer import DomainRandomizer
from reporting.report_generator import SafetyReportGenerator
from scripts.run_mock_robot import simulate_warehouse_amr_run
from simulation_harness.certification_oracle import SafetyCertificationOracle
from simulation_harness.isaac_runner import IsaacSimulationHarness
from twin_synthesis.nurec_reconstruction import NuRecReconstructor

def rehydrate_incident_registry():
    """Auto-rehydrates incident registry from disk on server boot."""
    if os.path.exists(UPLOAD_DIR):
        for fname in os.listdir(UPLOAD_DIR):
            if fname.endswith(".mcap"):
                fpath = os.path.join(UPLOAD_DIR, fname)
                try:
                    parsed = McapParser.parse_file(fpath)
                    iid = os.path.splitext(fname)[0]
                    INCIDENT_REGISTRY[iid] = {
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
                except Exception:
                    pass


@asynccontextmanager
async def lifespan(app_instance: FastAPI):
    rehydrate_incident_registry()
    yield


app = FastAPI(
    title="Diffraction Physical AI Ingestion Gateway & Control Plane",
    version="1.0.0",
    description="Unified API & Verification Control Plane for Autonomous Robotics Safety Certification.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "./storage/telemetry_drops"
REPORTS_DIR = "./storage/reports"
STAGES_DIR = "./storage/usd_stages"
STATIC_DIR = "./cloud_gateway/static"

for d in [UPLOAD_DIR, REPORTS_DIR, STAGES_DIR, STATIC_DIR]:
    os.makedirs(d, exist_ok=True)

# Mount static downloads for reports and USD stages
app.mount("/reports", StaticFiles(directory=REPORTS_DIR), name="reports")
app.mount("/stages", StaticFiles(directory=STAGES_DIR), name="stages")

# In-memory incident registry
INCIDENT_REGISTRY: Dict[str, Dict[str, Any]] = {}
MAX_UPLOAD_BYTES = 250 * 1024 * 1024  # 250 MB ceiling


@app.get("/")
def serve_dashboard():
    """Serves the interactive web control console."""
    index_file = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "Diffraction API operational. Static console not found."}


@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "service": "diffraction-cloud-gateway",
        "timestamp": time.time(),
        "total_incidents_indexed": len(INCIDENT_REGISTRY),
    }


@app.post("/api/v1/telemetry/upload", status_code=status.HTTP_201_CREATED)
async def upload_telemetry_mcap(file: UploadFile = File(...)):
    """Receives compressed MCAP containers from edge robot agents with strict size & path validation."""
    raw_filename = os.path.basename(file.filename or "")
    if not raw_filename.endswith(".mcap"):
        raise HTTPException(status_code=400, detail="Only .mcap container files are accepted.")

    # Sanitize filename to prevent directory traversal
    clean_filename = "".join(c for c in raw_filename if c.isalnum() or c in "._-")
    dest_path = os.path.join(UPLOAD_DIR, clean_filename)

    # Stream chunks with strict byte limit to prevent DoS
    bytes_written = 0
    with open(dest_path, "wb") as buffer:
        while True:
            chunk = await file.read(1024 * 1024)  # 1MB chunk
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
        # Clean up corrupted file
        if os.path.exists(dest_path):
            os.remove(dest_path)
        raise HTTPException(status_code=422, detail=f"Failed to parse MCAP telemetry: {str(e)}")

    incident_id = os.path.splitext(clean_filename)[0]
    
    # Extract trajectory if odometry exists
    trajectory_points = []
    odom_msgs = parsed.messages_by_topic.get("/odom", [])
    for msg in odom_msgs:
        data = msg.get("data", {})
        c_pose = data.get("current_pose")
        if isinstance(c_pose, dict) and "x" in c_pose and "y" in c_pose:
            trajectory_points.append({"x": round(float(c_pose["x"]), 3), "y": round(float(c_pose["y"]), 3)})

    INCIDENT_REGISTRY[incident_id] = {
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

    return {
        "message": "Telemetry packet successfully ingested and verified.",
        "incident_id": incident_id,
        "details": INCIDENT_REGISTRY[incident_id],
        "trajectory": trajectory_points,
    }


@app.post("/api/v1/simulation/simulate-incident")
def api_simulate_incident():
    """Triggers mock robot simulation generating an authentic AMR dock failure MCAP."""
    mcap_path = simulate_warehouse_amr_run(output_dir=UPLOAD_DIR)
    if not mcap_path:
        # Fallback to latest
        drops = [os.path.join(UPLOAD_DIR, f) for f in os.listdir(UPLOAD_DIR) if f.endswith(".mcap")]
        mcap_path = sorted(drops, key=os.path.getmtime)[-1]

    parsed = McapParser.parse_file(mcap_path)
    incident_id = os.path.splitext(os.path.basename(mcap_path))[0]
    INCIDENT_REGISTRY[incident_id] = {
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
    }
    return {
        "status": "success",
        "incident_id": incident_id,
        "incident_file": os.path.basename(mcap_path),
        "messages": parsed.total_messages,
    }


@app.post("/api/v1/simulation/run-audit")
def api_run_audit(scenario_count: int = 150, incident_id: Optional[str] = None):
    """Executes the complete Closed-Loop Physical AI Verification and Safety Certification Pipeline."""
    mcap_path = None
    if incident_id and incident_id in INCIDENT_REGISTRY:
        candidate = INCIDENT_REGISTRY[incident_id].get("file_path")
        if candidate and os.path.exists(candidate):
            mcap_path = candidate

    if not mcap_path:
        drops = [os.path.join(UPLOAD_DIR, f) for f in os.listdir(UPLOAD_DIR) if f.endswith(".mcap")]
        if not drops:
            # Generate one on the fly
            mcap_path = simulate_warehouse_amr_run(output_dir=UPLOAD_DIR)
        else:
            mcap_path = sorted(drops, key=os.path.getmtime)[-1]

    # 1. Parse MCAP Telemetry
    incident = McapParser.parse_file(mcap_path)

    # 2. System Identification (SysID) Telemetry Auto-Calibration
    sysid_profile = SysIDCalibrator.analyze_incident(incident)

    # 3. Spatial Twin Synthesis (anchored by real calibrated physics)
    reconstructor = NuRecReconstructor(output_dir=STAGES_DIR)
    twin_data = reconstructor.reconstruct_from_incident(
        incident=incident,
        static_friction=sysid_profile.estimated_surface_friction_mu,
        dynamic_friction=round(sysid_profile.estimated_surface_friction_mu * 0.85, 2),
        ambient_lux=sysid_profile.estimated_ambient_lux,
    )

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

    return {
        "status": verdict.certification_status,
        "compliance_score": verdict.safety_compliance_score,
        "total_scenarios": verdict.total_scenarios_evaluated,
        "passed_scenarios": verdict.scenarios_passed,
        "failed_scenarios": verdict.scenarios_failed,
        "safe_friction": verdict.safe_operational_boundaries["minimum_safe_surface_friction_mu"],
        "incident_id": f"{incident.robot_id}_{incident.trigger_type}",
        "html_report_filename": os.path.basename(html_path),
        "json_report_filename": os.path.basename(json_path),
        "usd_stage_filename": os.path.basename(twin_data["usd_stage_path"]),
        "recommendations": verdict.critical_recommendations,
        "failure_breakdown": verdict.failure_breakdown,
        "sysid_profile": asdict(sysid_profile),
        "regulatory_compliance": [asdict(r) for r in verdict.regulatory_compliance],
    }
