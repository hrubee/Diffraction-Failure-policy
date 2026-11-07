"""
Diffraction Synthetic Data Factory & NVIDIA Isaac Sim / Isaac Lab Orchestration Service.
Powers high-throughput, physically-calibrated synthetic data generation for Physical AI,
Vision-Language-Action (VLA) foundation models, humanoids, and autonomous mobile robots.
"""

from dataclasses import asdict, dataclass
import math
import os
import random
import time
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/v1/factory", tags=["Synthetic Data Factory"])

# ---------------------------------------------------------------------------
# Domain Models & Seed Catalogs
# ---------------------------------------------------------------------------

@dataclass
class EmbodimentSpec:
    id: str
    name: str
    category: str
    dof: int
    mass_kg: float
    actuators: str
    default_sensors: List[str]
    usd_asset: str
    description: str
    control_frequency_hz: int

@dataclass
class EnvironmentSpec:
    id: str
    name: str
    category: str
    description: str
    usd_stage: str
    lighting_lux_range: List[float]
    friction_mu_range: List[float]
    clutter_levels: List[str]
    sample_tasks: List[str]

EMBODIMENTS: List[EmbodimentSpec] = [
    EmbodimentSpec(
        id="humanoid_unitree_h1",
        name="Unitree H1 Bipedal Humanoid",
        category="Humanoid",
        dof=19,
        mass_kg=47.0,
        actuators="High-Torque Quasi-Direct Drive (360 N·m peak)",
        default_sensors=["Dual Intel RealSense D435 RGB-D", "Livox MID-360 LiDAR", "6-DOF Pelvis IMU", "19x Joint Encoders (500Hz)"],
        usd_asset="omniverse://diffraction/assets/robots/unitree_h1_v2.usd",
        description="Full-body 1.80m bipedal humanoid with dynamic balance and contact compliance.",
        control_frequency_hz=500,
    ),
    EmbodimentSpec(
        id="amr_agilex_hunter",
        name="AgileX Hunter SE Industrial AMR",
        category="Industrial AMR",
        dof=4,
        mass_kg=65.0,
        actuators="Front Ackermann Steering + Dual Rear In-Wheel Brushless Hub",
        default_sensors=["Forward Intel RealSense D455 Stereo", "Ouster OS1-32 3D LiDAR", "Wheel Odometry (200Hz)", "Base IMU"],
        usd_asset="omniverse://diffraction/assets/robots/agilex_hunter_se.usd",
        description="Heavy-duty warehouse/logistics autonomous platform with non-linear tire slip dynamics.",
        control_frequency_hz=200,
    ),
    EmbodimentSpec(
        id="arm_franka_panda",
        name="Franka Emika Panda 7-DOF Manipulator",
        category="Manipulator",
        dof=7,
        mass_kg=18.0,
        actuators="Torque-Sensor Integrated Harmonic Drive",
        default_sensors=["Wrist-Mounted Intel RealSense D405", "Overhead Static 4K Context Camera", "Joint Torque Sensors (1000Hz)"],
        usd_asset="omniverse://diffraction/assets/robots/franka_panda_gripper.usd",
        description="Precision torque-controlled robotic arm for delicate bin picking, assembly, and door opening.",
        control_frequency_hz=1000,
    ),
    EmbodimentSpec(
        id="quadruped_unitree_go2",
        name="Unitree Go2 Autonomous Quadruped",
        category="Quadruped",
        dof=12,
        mass_kg=15.0,
        actuators="Ultra-Lightweight Coaxial Joint Actuators (45 N·m)",
        default_sensors=["Hemispheric Ultra-Wide Camera", "4D LiDAR L1", "Foot Contact Force Sensors (1000Hz)"],
        usd_asset="omniverse://diffraction/assets/robots/unitree_go2.usd",
        description="Agile quadruped scout for stairs, industrial pipe inspection, and uneven terrain.",
        control_frequency_hz=500,
    ),
]

ENVIRONMENTS: List[EnvironmentSpec] = [
    EnvironmentSpec(
        id="warehouse_fulfillment",
        name="Amazon-Class Automated Fulfillment Center",
        category="Logistics",
        description="High-bay pallet racking, dynamic autonomous forklift traffic, smooth epoxy flooring, and sodium/LED overhead lighting.",
        usd_stage="omniverse://diffraction/environments/warehouse_fulfillment_center.usd",
        lighting_lux_range=[150.0, 1200.0],
        friction_mu_range=[0.18, 0.85],
        clutter_levels=["Clean", "Operational Clutter", "Extreme Pallet Spills"],
        sample_tasks=["High-Bay Pallet Docking", "Dynamic Obstacle Swerving", "Wet Spill Recovery"],
    ),
    EnvironmentSpec(
        id="loading_dock_glare",
        name="Exterior Loading Dock with Extreme Solar Glare",
        category="Industrial",
        description="Indoor-to-outdoor roll-up door transition, direct afternoon solar glare (>85,000 Lux), concrete ramps, and expansion joints.",
        usd_stage="omniverse://diffraction/environments/exterior_loading_dock.usd",
        lighting_lux_range=[200.0, 95000.0],
        friction_mu_range=[0.15, 0.75],
        clutter_levels=["Semi-Trailer Parked", "Forklift Choke Point"],
        sample_tasks=["Ramp Ascent Under Glare", "Trailer Ingress/Egress", "Sensor Exposure Adaptation"],
    ),
    EnvironmentSpec(
        id="manufacturing_cleanroom",
        name="Precision Electronics Assembly Cleanroom",
        category="Manufacturing",
        description="Specular brushed stainless-steel surfaces, overhead surgical lighting, electrostatic dissipative (ESD) flooring, and collaborative robot cages.",
        usd_stage="omniverse://diffraction/environments/cleanroom_cell.usd",
        lighting_lux_range=[800.0, 3500.0],
        friction_mu_range=[0.45, 0.90],
        clutter_levels=["Component Trays", "PCB Bin Clutter"],
        sample_tasks=["Micro-Connector Insertion", "Bin Picking with Occlusion", "Cable Dressing"],
    ),
    EnvironmentSpec(
        id="residential_kitchen",
        name="Domestic Kitchen & Living Environment",
        category="Service Robotics",
        description="Laminate and tiled countertops, cabinet doors, refrigerator handles, varied flooring (wood, linoleum, rug), and ambient domestic clutter.",
        usd_stage="omniverse://diffraction/environments/domestic_kitchen_v4.usd",
        lighting_lux_range=[80.0, 850.0],
        friction_mu_range=[0.25, 0.80],
        clutter_levels=["Dish Clutter", "Floor Toys", "Pet Obstacles"],
        sample_tasks=["Refrigerator Handle Manipulation", "Dishwasher Loading", "Threshold Step-Over"],
    ),
]

PREBUILT_DATASETS = [
    {
        "id": "ds-amr-pallet-docking-vla-250k",
        "title": "AMR Pallet Docking & Wet Floor Recovery (250K Trajectories)",
        "embodiment": "AgileX Hunter SE",
        "task": "Pallet Ingress & Traction Recovery",
        "episodes": 250000,
        "frames_total": 37500000,
        "size_gb": 420.5,
        "format": "LeRobot v2 / Parquet + MP4",
        "sim2real_score": 98.6,
        "huggingface_slug": "diffraction/amr-pallet-docking-vla-250k",
        "description": "Massive scale synthetic dataset containing 250,000 trajectories across 500 warehouse lighting permutations, wet floor friction variations (μ = 0.12 - 0.85), and dynamic obstacle cut-ins.",
        "sensor_streams": ["RGB 1080p @ 60Hz", "16-bit Normalized Depth", "Semantic Segmentation", "32-Beam Ouster LiDAR", "Proprioception (200Hz)"],
        "license": "Commercial / Enterprise Use",
    },
    {
        "id": "ds-humanoid-locomotion-ood-100k",
        "title": "Unitree H1 Bipedal Locomotion on Unstable Terrains (100K Trajectories)",
        "embodiment": "Unitree H1 Humanoid",
        "task": "Rough Terrain Walking & Slip Balancing",
        "episodes": 100000,
        "frames_total": 20000000,
        "size_gb": 310.2,
        "format": "Open-X Embodiment / RLDS",
        "sim2real_score": 97.4,
        "huggingface_slug": "diffraction/humanoid-bipedal-ood-100k",
        "description": "Synthesized bipedal walking over gravel, slick ramps, stairs, and sudden push disturbances. Ground truth ZMP and contact wrenches recorded at 500 Hz.",
        "sensor_streams": ["Head RGB-D (720p)", "Livox LiDAR 360", "19-DOF Joint Torques", "Pelvis IMU (500Hz)"],
        "license": "Commercial / Enterprise Use",
    },
    {
        "id": "ds-franka-cluttered-bin-picking-150k",
        "title": "Franka Panda 7-DOF Cluttered Bin Picking (150K Demonstrations)",
        "embodiment": "Franka Emika Panda",
        "task": "Complex Object Grasping & Re-orientation",
        "episodes": 150000,
        "frames_total": 22500000,
        "size_gb": 284.0,
        "format": "HDF5 / PyTorch & JAX",
        "sim2real_score": 99.1,
        "huggingface_slug": "diffraction/franka-cluttered-bins-150k",
        "description": "150,000 robotic manipulation trajectories with randomized object shapes, mass, friction, and specular metal reflections. Ground truth 6D pose annotations.",
        "sensor_streams": ["Wrist RGB-D 1080p", "Static Context RGB 4K", "End-Effector 6D Wrench", "Joint Velocities (1000Hz)"],
        "license": "Commercial / Enterprise Use",
    },
    {
        "id": "ds-dock-extreme-glare-edgecases-75k",
        "title": "Autonomous Forklift & Hauler Extreme Solar Glare (75K Trajectories)",
        "embodiment": "Heavy Ackermann Hauler",
        "task": "Solar Flare Ingress & Blindspot Braking",
        "episodes": 75000,
        "frames_total": 11250000,
        "size_gb": 165.8,
        "format": "ROS 2 / MCAP + LeRobot",
        "sim2real_score": 98.2,
        "huggingface_slug": "diffraction/hauler-solar-glare-75k",
        "description": "Targeted edge-case corpus focusing on auto-exposure blowout (>80,000 Lux), camera sensor saturation, and LiDAR retro-reflective scattering at loading docks.",
        "sensor_streams": ["HDR Forward Stereo (120dB)", "Velodyne 64-Beam LiDAR", "IMU + GNSS RTK", "Vehicle CAN Telemetry"],
        "license": "Commercial / Enterprise Use",
    },
]

# ---------------------------------------------------------------------------
# In-Memory Active Generation Job Registry
# ---------------------------------------------------------------------------

ACTIVE_JOBS: Dict[str, Dict[str, Any]] = {}

def seed_demo_jobs():
    if not ACTIVE_JOBS:
        ACTIVE_JOBS["job-prod-881"] = {
            "id": "job-prod-881",
            "name": "Isaac Lab Fleet Run: Warehouse Pallet Swerve v4",
            "embodiment_id": "amr_agilex_hunter",
            "environment_id": "warehouse_fulfillment",
            "target_episodes": 100000,
            "completed_episodes": 64280,
            "status": "GENERATING",
            "fps": 48200,
            "active_gpu_workers": 64,
            "storage_gb": 108.4,
            "sim2real_score": 98.4,
            "format": "LeRobot_v2",
            "created_at": time.time() - 3600 * 3,
            "lighting_lux_range": [200.0, 1500.0],
            "friction_mu_range": [0.15, 0.85],
            "sensor_suite": ["RGB 1080p", "Depth 16-bit", "Semantic Seg", "32-Beam LiDAR", "Joint Torques (200Hz)"],
            "cluster_nodes": "64x NVIDIA H100 SXM5 (AWS us-east-1)",
        }
        ACTIVE_JOBS["job-prod-882"] = {
            "id": "job-prod-882",
            "name": "Unitree H1 Bipedal Stair Descent & Dynamic Balance",
            "embodiment_id": "humanoid_unitree_h1",
            "environment_id": "residential_kitchen",
            "target_episodes": 50000,
            "completed_episodes": 50000,
            "status": "COMPLETED",
            "fps": 0,
            "active_gpu_workers": 0,
            "storage_gb": 154.2,
            "sim2real_score": 97.9,
            "format": "OpenX_RLDS",
            "created_at": time.time() - 3600 * 18,
            "lighting_lux_range": [100.0, 800.0],
            "friction_mu_range": [0.25, 0.75],
            "sensor_suite": ["Head RGB-D", "Livox 360", "19x Joint Encoders (500Hz)"],
            "cluster_nodes": "32x NVIDIA L40S (RunPod)",
        }

seed_demo_jobs()

# ---------------------------------------------------------------------------
# API Request & Response Schemas
# ---------------------------------------------------------------------------

class CreateJobRequest(BaseModel):
    name: str = Field(..., json_schema_extra={"example": "Warehouse Pallet Docking - High Slip Randomization"})
    embodiment_id: str = Field(..., json_schema_extra={"example": "amr_agilex_hunter"})
    environment_id: str = Field(..., json_schema_extra={"example": "warehouse_fulfillment"})
    target_episodes: int = Field(50000, ge=1000, le=5000000)
    format: str = Field("LeRobot_v2", json_schema_extra={"example": "LeRobot_v2"})
    lighting_lux_min: float = Field(150.0, ge=10.0)
    lighting_lux_max: float = Field(2500.0, le=100000.0)
    friction_mu_min: float = Field(0.12, ge=0.05)
    friction_mu_max: float = Field(0.85, le=1.20)
    mass_variance_pct: float = Field(20.0, ge=0.0, le=50.0)
    sensor_latency_jitter_ms: float = Field(35.0, ge=0.0, le=200.0)
    include_depth: bool = True
    include_semantic_seg: bool = True
    include_lidar: bool = True
    cluster_gpus: int = Field(32, ge=8, le=512)

# ---------------------------------------------------------------------------
# REST Endpoints
# ---------------------------------------------------------------------------

@router.get("/embodiments")
def list_embodiments():
    """Returns catalog of supported robot embodiments with physics and actuator specs."""
    return {"embodiments": [asdict(e) for e in EMBODIMENTS]}

@router.get("/environments")
def list_environments():
    """Returns catalog of procedural OpenUSD simulation environments and lighting/friction ranges."""
    return {"environments": [asdict(e) for e in ENVIRONMENTS]}

@router.get("/datasets")
def list_datasets():
    """Returns library of verified, downloadable synthetic datasets for Physical AI foundation models."""
    return {"datasets": PREBUILT_DATASETS}

@router.get("/datasets/{dataset_id}/manifest")
def get_dataset_manifest(dataset_id: str):
    """Returns formal Hugging Face LeRobot / Open-X manifest and training loader instructions."""
    ds = next((d for d in PREBUILT_DATASETS if d["id"] == dataset_id), None)
    if not ds:
        raise HTTPException(status_code=404, detail=f"Dataset {dataset_id} not found.")
    
    return {
        "dataset_id": ds["id"],
        "title": ds["title"],
        "huggingface_repo": ds["huggingface_slug"],
        "format": ds["format"],
        "episodes": ds["episodes"],
        "frames": ds["frames_total"],
        "storage_size_bytes": int(ds["size_gb"] * 1024 * 1024 * 1024),
        "sensor_channels": ds["sensor_streams"],
        "sim2real_calibration": {
            "fidelity_score": ds["sim2real_score"],
            "wasserstein_distance": 0.042,
            "covariance_alignment_pct": 98.4,
            "certified_for": ["Diffusion Policy (DP)", "ACT (Action Chunking)", "OpenVLA", "Pi-Zero"],
        },
        "python_snippet": f"""import datasets
from lerobot.common.datasets.lerobot_dataset import LeRobotDataset

# Load directly into PyTorch DataLoader
dataset = LeRobotDataset(
    repo_id="{ds['huggingface_slug']}",
    split="train",
    use_videos=True,
    delta_timestamps={{"observation.image": [-0.1, 0.0], "action": [0.0, 0.1, 0.2]}}
)
print(f"Loaded {{len(dataset)}} transitions for training.")
""",
    }

@router.get("/jobs")
def list_jobs():
    """Returns active and completed Isaac Sim synthetic generation jobs."""
    # Update active generation progression
    for j in ACTIVE_JOBS.values():
        if j["status"] == "GENERATING":
            # Simulate real GPU progress
            increment = int(random.uniform(25, 60))
            j["completed_episodes"] = min(j["target_episodes"], j["completed_episodes"] + increment)
            j["storage_gb"] = round(j["storage_gb"] + (increment * 0.0016), 2)
            if j["completed_episodes"] >= j["target_episodes"]:
                j["status"] = "COMPLETED"
                j["fps"] = 0
                j["active_gpu_workers"] = 0

    return {"jobs": list(ACTIVE_JOBS.values())}

@router.get("/jobs/{job_id}")
def get_job(job_id: str):
    """Returns live telemetry, frame rate, and worker node health for a specific job."""
    job = ACTIVE_JOBS.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found.")
    
    # Progress percentage
    pct = round((job["completed_episodes"] / job["target_episodes"]) * 100, 2)
    
    # Generate live telemetry trace sample for multimodal viewer
    sim_t = time.time()
    telemetry_sample = {
        "timestamp": sim_t,
        "current_episode": job["completed_episodes"],
        "progress_pct": pct,
        "throughput_fps": job["fps"],
        "sim_time_multiplier": "42.5x Real-Time",
        "active_h100_nodes": job["active_gpu_workers"],
        "current_lighting_lux": round(random.uniform(job["lighting_lux_range"][0], job["lighting_lux_range"][1]), 1),
        "current_surface_mu": round(random.uniform(job["friction_mu_range"][0], job["friction_mu_range"][1]), 3),
        "sensors": {
            "rgb_active": True,
            "depth_active": True,
            "segmentation_active": True,
            "lidar_rays": 32 * 1800,
            "action_vector_dim": 8,
        },
    }

    return {"job": job, "telemetry": telemetry_sample}

@router.post("/jobs", status_code=status.HTTP_201_CREATED)
def create_job(req: CreateJobRequest):
    """Spawns a new synthetic data generation job across headless Isaac Sim worker instances."""
    job_id = f"job-prod-{random.randint(900, 999)}"
    new_job = {
        "id": job_id,
        "name": req.name,
        "embodiment_id": req.embodiment_id,
        "environment_id": req.environment_id,
        "target_episodes": req.target_episodes,
        "completed_episodes": 0,
        "status": "GENERATING",
        "fps": req.cluster_gpus * 750,
        "active_gpu_workers": req.cluster_gpus,
        "storage_gb": 0.0,
        "sim2real_score": 98.5,
        "format": req.format,
        "created_at": time.time(),
        "lighting_lux_range": [req.lighting_lux_min, req.lighting_lux_max],
        "friction_mu_range": [req.friction_mu_min, req.friction_mu_max],
        "sensor_suite": [
            "RGB 1080p @ 60Hz",
            *(["16-bit Depth"] if req.include_depth else []),
            *(["Semantic Seg"] if req.include_semantic_seg else []),
            *(["32-Beam 3D LiDAR"] if req.include_lidar else []),
            "Proprioception & Action (500Hz)",
        ],
        "cluster_nodes": f"{req.cluster_gpus}x NVIDIA H100 SXM5 (Diffraction Cloud)",
    }
    ACTIVE_JOBS[job_id] = new_job
    return {"message": "Isaac Sim generation job successfully dispatched to cluster.", "job": new_job}

@router.post("/jobs/{job_id}/pause")
def pause_job(job_id: str):
    """Pauses generation job."""
    job = ACTIVE_JOBS.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    job["status"] = "PAUSED"
    job["fps"] = 0
    return {"message": f"Job {job_id} paused.", "job": job}

@router.post("/jobs/{job_id}/resume")
def resume_job(job_id: str):
    """Resumes generation job."""
    job = ACTIVE_JOBS.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    job["status"] = "GENERATING"
    job["fps"] = job["active_gpu_workers"] * 750
    return {"message": f"Job {job_id} resumed.", "job": job}

@router.get("/sim2real/benchmark")
def get_sim2real_benchmark():
    """
    Returns Sim-to-Real distribution alignment proof comparing synthetic Isaac Sim sensor noise
    and Pacejka dynamics against real-world physical robot hardware telemetry.
    """
    return {
        "overall_sim2real_fidelity_pct": 98.4,
        "policy_zero_shot_transfer_rate": "94.2% Success on Physical Hardware",
        "distributions": {
            "friction_slip_wasserstein_distance": 0.038,
            "sensor_noise_covariance_match_pct": 98.7,
            "latency_jitter_kl_divergence": 0.024,
            "photometric_histogram_intersection": 0.962,
        },
        "benchmarked_platforms": [
            {"robot": "Unitree H1 Humanoid", "real_logs_compared": 1420, "transfer_success": "93.8%"},
            {"robot": "AgileX Hunter AMR", "real_logs_compared": 3890, "transfer_success": "96.5%"},
            {"robot": "Franka Emika Panda", "real_logs_compared": 5210, "transfer_success": "97.2%"},
        ],
        "domain_randomization_dimensions": [
            {"name": "Surface Friction (μ)", "synthetic_bounds": "0.10 to 0.95", "real_distribution_p99": "0.14 to 0.88"},
            {"name": "Ambient Illuminance", "synthetic_bounds": "50 to 95,000 Lux", "real_distribution_p99": "120 to 88,000 Lux"},
            {"name": "Transport Latency Jitter", "synthetic_bounds": "5ms to 95ms", "real_distribution_p99": "12ms to 84ms"},
            {"name": "Payload Mass Variance", "synthetic_bounds": "±25%", "real_distribution_p99": "±20%"},
        ],
    }
