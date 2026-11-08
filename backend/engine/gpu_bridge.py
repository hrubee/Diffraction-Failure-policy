"""
NVIDIA GPU Worker Bridge & Cluster Orchestration Engine.
Manages registration, heartbeat, job leasing, and result ingestion
for distributed NVIDIA RTX / Isaac Sim compute nodes (RunPod, Lambda, AWS, On-Prem).
"""

import os
import time
import json
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger("diffraction.gpu_bridge")

# In-memory registry of active GPU worker nodes
ACTIVE_GPU_WORKERS: Dict[str, Dict[str, Any]] = {}
GPU_JOB_QUEUE: List[Dict[str, Any]] = []


class GpuWorkerBridge:
    """
    Coordinates distributed NVIDIA GPU workers with the central Diffraction Control Plane.
    """

    @staticmethod
    def register_worker(
        worker_id: str,
        hostname: str,
        gpu_name: str,
        vram_gb: float,
        driver_version: str,
        cuda_version: str,
        isaac_sim_available: bool = False,
    ) -> Dict[str, Any]:
        """Registers or refreshes an active GPU worker node."""
        worker_info = {
            "worker_id": worker_id,
            "hostname": hostname,
            "gpu_name": gpu_name,
            "vram_gb": vram_gb,
            "driver_version": driver_version,
            "cuda_version": cuda_version,
            "isaac_sim_available": isaac_sim_available,
            "status": "IDLE",
            "current_job_id": None,
            "last_heartbeat": time.time(),
            "completed_jobs_count": 0,
        }
        ACTIVE_GPU_WORKERS[worker_id] = worker_info
        logger.info(f"GPU Worker registered: {worker_id} ({gpu_name}, {vram_gb:.1f}GB VRAM)")
        return worker_info

    @staticmethod
    def heartbeat(worker_id: str, current_job_id: Optional[str] = None) -> bool:
        """Updates worker heartbeat timestamp."""
        if worker_id in ACTIVE_GPU_WORKERS:
            ACTIVE_GPU_WORKERS[worker_id]["last_heartbeat"] = time.time()
            if current_job_id:
                ACTIVE_GPU_WORKERS[worker_id]["current_job_id"] = current_job_id
                ACTIVE_GPU_WORKERS[worker_id]["status"] = "BUSY"
            else:
                ACTIVE_GPU_WORKERS[worker_id]["status"] = "IDLE"
            return True
        return False

    @staticmethod
    def list_workers() -> List[Dict[str, Any]]:
        """Returns list of online GPU workers (pruning dead workers > 60s silent)."""
        now = time.time()
        active = []
        for wid, w in list(ACTIVE_GPU_WORKERS.items()):
            if now - w["last_heartbeat"] < 60.0:
                active.append(w)
            else:
                w["status"] = "OFFLINE"
                active.append(w)
        return active

    @staticmethod
    def lease_job_for_gpu_worker(worker_id: str) -> Optional[Dict[str, Any]]:
        """Leases the next pending simulation job to an idle GPU worker."""
        if worker_id not in ACTIVE_GPU_WORKERS:
            return None

        from backend.engine.fulfillment_runner import list_job_records, get_job_record, update_job_record

        jobs = list_job_records()[:20]
        # Find queued jobs
        for j in jobs:
            if j["status"] in ["QUEUED", "RUNNING"] and j.get("active_gpu_workers", 0) == 0:
                # Assign to this worker
                ACTIVE_GPU_WORKERS[worker_id]["status"] = "BUSY"
                ACTIVE_GPU_WORKERS[worker_id]["current_job_id"] = j["id"]
                update_job_record(
                    j["id"],
                    stage_name=f"Leased to GPU Worker {worker_id} ({ACTIVE_GPU_WORKERS[worker_id]['gpu_name']})",
                )
                return j
        return None
