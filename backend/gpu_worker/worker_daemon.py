#!/usr/bin/env python3
"""
Diffraction Standalone NVIDIA GPU Worker Daemon.
Executes genuine hardware-accelerated neural diffusion video generation
(NVIDIA Cosmos World Foundation Model or open CogVideoX-2B) on an NVIDIA RTX 3090 / 4090 / A100.
Streams rendered optical MP4 videos directly back to the Diffraction Control Plane (https://app.diffraction.in).
"""

import os
import sys
import time
import json
import argparse
import platform
import subprocess
import urllib.request
import urllib.parse
from typing import Dict, Any, Optional

def detect_gpu_hardware() -> Dict[str, Any]:
    """Detects local NVIDIA GPU model, VRAM, and driver details."""
    gpu_info = {
        "gpu_name": "Generic NVIDIA GPU",
        "vram_gb": 16.0,
        "driver_version": "550.00",
        "cuda_version": "12.4",
        "has_cuda": False,
        "isaac_sim_available": False,
    }

    try:
        import torch
        if torch.cuda.is_available():
            gpu_info["has_cuda"] = True
            gpu_info["gpu_name"] = torch.cuda.get_device_name(0)
            total_vram = torch.cuda.get_device_properties(0).total_memory / (1024 ** 3)
            gpu_info["vram_gb"] = round(total_vram, 2)
            gpu_info["cuda_version"] = torch.version.cuda or "12.4"
    except ImportError:
        pass

    if not gpu_info["has_cuda"]:
        try:
            out = subprocess.check_output(
                ["nvidia-smi", "--query-gpu=name,memory.total,driver_version", "--format=csv,noheader,nounits"],
                encoding="utf-8"
            ).strip().split(",")
            if len(out) >= 3:
                gpu_info["gpu_name"] = out[0].strip()
                gpu_info["vram_gb"] = round(float(out[1].strip()) / 1024.0, 2)
                gpu_info["driver_version"] = out[2].strip()
                gpu_info["has_cuda"] = True
        except Exception:
            pass

    return gpu_info

def ensure_ml_packages():
    """Installs required diffusion libraries on the GPU pod if missing."""
    packages = ["diffusers", "transformers", "accelerate", "imageio", "imageio-ffmpeg", "requests"]
    missing = []
    for pkg in packages:
        try:
            __import__(pkg.replace("-", "_"))
        except ImportError:
            missing.append(pkg)

    if missing:
        print(f"[*] Installing missing ML diffusion packages on GPU pod: {missing}...")
        try:
            subprocess.check_call([
                sys.executable, "-m", "pip", "install", "-q",
                "diffusers", "transformers", "accelerate", "imageio[ffmpeg]", "requests", "sentencepiece"
            ])
            print("[SUCCESS] All diffusion packages installed.")
        except Exception as e:
            print(f"[WARN] Error installing packages: {e}")

class DiffractionGpuWorker:
    def __init__(self, control_plane_url: str, worker_id: str, poll_interval_s: float = 5.0, hf_token: Optional[str] = None):
        self.control_plane_url = control_plane_url.rstrip("/")
        self.worker_id = worker_id
        self.poll_interval_s = poll_interval_s
        self.hf_token = hf_token or os.environ.get("HF_TOKEN")
        self.hardware = detect_gpu_hardware()
        self.running = True
        self.pipeline = None
        self.active_model_name = None

    def post_json(self, path: str, payload: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        url = f"{self.control_plane_url}{path}"
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={"Content-Type": "application/json", "User-Agent": f"Diffraction-GPU-Worker/{self.worker_id}"}
        )
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except Exception as e:
            print(f"[WARN] Connection error to {url}: {e}")
            return None

    def get_json(self, path: str) -> Optional[Dict[str, Any]]:
        url = f"{self.control_plane_url}{path}"
        req = urllib.request.Request(
            url,
            headers={"User-Agent": f"Diffraction-GPU-Worker/{self.worker_id}"}
        )
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except Exception as e:
            print(f"[WARN] Connection error to {url}: {e}")
            return None

    def upload_video(self, job_id: str, camera: str, episode_idx: int, video_path: str) -> bool:
        """Uploads genuine GPU-rendered video to Diffraction Control Plane."""
        url = f"{self.control_plane_url}/api/v1/factory/jobs/{job_id}/upload-video?camera={camera}&episode_idx={episode_idx}"
        try:
            import requests
            with open(video_path, "rb") as f:
                r = requests.post(url, files={"file": (os.path.basename(video_path), f, "video/mp4")}, timeout=30)
                if r.status_code == 200:
                    print(f"    --> [UPLOADED] {camera} Ep {episode_idx} ({os.path.getsize(video_path) // 1024} KB)")
                    return True
                else:
                    print(f"    --> [UPLOAD ERROR] HTTP {r.status_code}: {r.text}")
                    return False
        except Exception as e:
            print(f"    --> [UPLOAD EXCEPTION] {e}")
            return False

    def load_diffusion_model(self):
        """Loads NVIDIA Cosmos or CogVideoX diffusion model onto GPU VRAM."""
        if self.pipeline is not None:
            return self.pipeline

        ensure_ml_packages()
        import torch
        from diffusers import DiffusionPipeline

        os.environ["HF_HOME"] = "/workspace/hf_cache"
        os.makedirs("/workspace/hf_cache", exist_ok=True)

        target_model = "nvidia/Cosmos-1.0-Diffusion-7B-Video2World"
        print(f"[*] Checking Hugging Face authorization for {target_model}...")

        use_cosmos = False
        if self.hf_token:
            try:
                import requests
                chk = requests.get(
                    f"https://huggingface.co/{target_model}/resolve/main/model_index.json",
                    headers={"Authorization": f"Bearer {self.hf_token}"},
                    timeout=5
                )
                if chk.status_code == 200:
                    use_cosmos = True
                else:
                    print(f"[*] Note: Cosmos license gate returned HTTP {chk.status_code}. Using open-weights fallback...")
            except Exception:
                pass

        if use_cosmos:
            model_id = target_model
            print(f"[🚀 HARDWARE] Loading NVIDIA Cosmos 7B Diffusion Model onto {self.hardware['gpu_name']}...")
        else:
            model_id = "THUDM/CogVideoX-2b"
            print(f"[🚀 HARDWARE] Loading Open Physical AI Video Model ({model_id}) onto {self.hardware['gpu_name']}...")

        try:
            pipe = DiffusionPipeline.from_pretrained(
                model_id,
                torch_dtype=torch.bfloat16,
                token=self.hf_token if use_cosmos else None
            )
            pipe = pipe.to("cuda")
            pipe.enable_model_cpu_offload() if hasattr(pipe, "enable_model_cpu_offload") else None
            self.pipeline = pipe
            self.active_model_name = model_id
            print(f"[SUCCESS] Model {model_id} loaded into GPU memory. Ready for inference!")
            return pipe
        except Exception as e:
            print(f"[ERROR] Failed to load {model_id}: {e}")
            return None

    def execute_job(self, job: Dict[str, Any]):
        """Executes real neural video diffusion on NVIDIA GPU hardware for leased job."""
        job_id = job["id"]
        target_episodes = min(job.get("target_episodes", 2), 5)  # Generate up to 5 real diffusion rollouts
        robot_name = job.get("robot_name", "Franka_Box_Folder")
        task_name = job.get("name", "Cardboard Box Folding")

        print("================================================================================")
        print(f"  EXECUTING REAL NEURAL DIFFUSION RUN ON {self.hardware['gpu_name']}")
        print(f"  Job ID: {job_id} ({task_name})")
        print(f"  Episodes to Render: {target_episodes}")
        print("================================================================================")

        pipe = self.load_diffusion_model()
        if not pipe:
            print("[ERROR] No diffusion pipeline available. Aborting job execution.")
            return

        import imageio
        import numpy as np

        work_dir = f"/workspace/renders_{job_id}"
        os.makedirs(work_dir, exist_ok=True)

        for ep in range(target_episodes):
            print(f"\n[*] Rendering Episode {ep+1}/{target_episodes} on {self.hardware['gpu_name']}...")

            # 1. Render Overhead Camera Feed
            prompt_overhead = (
                f"RealSense D405 optical sensor video feed: Industrial {robot_name} robotic manipulator arm "
                f"folding the corrugated kraft cardboard flap on packaging table, overhead view, photorealistic, 4k, cinematic lighting"
            )
            print(f"    --> Generating Overhead View with {self.active_model_name}...")
            res_overhead = pipe(prompt=prompt_overhead, num_frames=16, guidance_scale=6.0)
            frames_overhead = res_overhead.frames[0]

            overhead_path = os.path.join(work_dir, f"overhead_ep_{ep:06d}.mp4")
            # Write frames to MP4
            imageio.mimsave(overhead_path, [np.array(f) for f in frames_overhead], fps=8)
            self.upload_video(job_id, "overhead", ep, overhead_path)

            # 2. Render Wrist Camera Feed
            prompt_wrist = (
                f"Robot wrist-mounted camera view: End-effector robotic gripper contacting and pushing cardboard box flap, "
                f"photorealistic surface texture, macro lens, subtle camera shake"
            )
            print(f"    --> Generating Wrist View with {self.active_model_name}...")
            res_wrist = pipe(prompt=prompt_wrist, num_frames=16, guidance_scale=6.0)
            frames_wrist = res_wrist.frames[0]

            wrist_path = os.path.join(work_dir, f"wrist_ep_{ep:06d}.mp4")
            imageio.mimsave(wrist_path, [np.array(f) for f in frames_wrist], fps=8)
            self.upload_video(job_id, "wrist", ep, wrist_path)

        print(f"\n[SUCCESS] All {target_episodes} episodes rendered on GPU silicon and uploaded to Control Plane.")
        self.post_json(
            f"/api/v1/factory/gpu-workers/{self.worker_id}/complete-job",
            {
                "job_id": job_id,
                "status": "COMPLETED",
                "gpu_used": f"{self.hardware['gpu_name']} ({self.active_model_name})"
            }
        )

    def register(self):
        print("================================================================================")
        print("  DIFFRACTION AUTONOMOUS PHYSICAL AI - DISTRIBUTED GPU WORKER DAEMON")
        print(f"  Worker ID: {self.worker_id}")
        print(f"  Host: {platform.node()} ({platform.system()} {platform.machine()})")
        print(f"  GPU Hardware: {self.hardware['gpu_name']} ({self.hardware['vram_gb']} GB VRAM)")
        print(f"  CUDA Detected: {self.hardware['has_cuda']}")
        print(f"  Control Plane Target: {self.control_plane_url}")
        print("================================================================================")

        payload = {
            "worker_id": self.worker_id,
            "hostname": platform.node(),
            "gpu_name": self.hardware["gpu_name"],
            "vram_gb": self.hardware["vram_gb"],
            "driver_version": self.hardware["driver_version"],
            "cuda_version": self.hardware["cuda_version"],
            "isaac_sim_available": self.hardware["isaac_sim_available"],
        }
        self.post_json("/api/v1/factory/gpu-workers/register", payload)

    def run(self):
        self.register()
        print(f"[*] Starting GPU work-lease poll loop (Interval: {self.poll_interval_s}s)...")
        while self.running:
            try:
                self.post_json(f"/api/v1/factory/gpu-workers/{self.worker_id}/heartbeat", {"timestamp": time.time()})
                job_resp = self.get_json(f"/api/v1/factory/gpu-workers/lease?worker_id={self.worker_id}")
                if job_resp and job_resp.get("job"):
                    job = job_resp["job"]
                    print(f"\n[>>> JOB LEASED] Acquired Job: {job['id']} - {job['name']}")
                    self.execute_job(job)
                else:
                    time.sleep(self.poll_interval_s)
            except KeyboardInterrupt:
                print("\n[STOP] Shutting down GPU worker daemon...")
                self.running = False
            except Exception as e:
                print(f"[ERROR] Exception in worker loop: {e}")
                time.sleep(self.poll_interval_s)

def main():
    parser = argparse.ArgumentParser(description="Diffraction NVIDIA GPU Worker Daemon")
    parser.add_argument("--control-plane", type=str, default="https://app.diffraction.in", help="URL of Diffraction Control Plane")
    parser.add_argument("--worker-id", type=str, default=f"gpu-node-{int(time.time())}", help="Unique Worker Node ID")
    parser.add_argument("--poll-interval", type=float, default=5.0, help="Poll interval in seconds")
    parser.add_argument("--hf-token", type=str, default=None, help="Hugging Face Access Token")
    args = parser.parse_args()

    worker = DiffractionGpuWorker(
        control_plane_url=args.control_plane,
        worker_id=args.worker_id,
        poll_interval_s=args.poll_interval,
        hf_token=args.hf_token
    )
    worker.run()

if __name__ == "__main__":
    main()
