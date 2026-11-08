#!/usr/bin/env python3
"""
Diffraction Runpod Cloud GPU Worker Launcher & Lifecycle Manager.
Launches an on-demand NVIDIA RTX 4090 GPU pod on Runpod, injects the worker daemon,
and connects it directly to the live Diffraction Control Plane (https://app.diffraction.in).

Usage:
    # 1. Launch & Wire Up Real GPU:
    python scripts/deploy_runpod_worker.py --api-key <RUNPOD_API_KEY> --gpu "NVIDIA GeForce RTX 4090"
    
    # 2. Terminate Pod when finished:
    python scripts/deploy_runpod_worker.py --api-key <RUNPOD_API_KEY> --stop <POD_ID>
"""

import sys
import time
import argparse
import runpod

CONTROL_PLANE_URL = "https://app.diffraction.in"
DEFAULT_IMAGE = "runpod/pytorch:2.2.0-py3.10-cuda12.1.1-devel-ubuntu22.04"

def launch_worker_pod(api_key: str, gpu_type: str = "NVIDIA GeForce RTX 4090"):
    runpod.api_key = api_key
    print("================================================================================")
    print("  DIFFRACTION PHYSICAL AI - RUNPOD CLOUD GPU PROVISIONER")
    print(f"  Target Hardware: {gpu_type}")
    print(f"  Target Control Plane: {CONTROL_PLANE_URL}")
    print("================================================================================")

    # Startup bash command inside the GPU pod
    docker_args = (
        f"bash -c 'curl -sSL https://raw.githubusercontent.com/hrubee/Diffraction-Failure-policy/main/backend/gpu_worker/worker_daemon.py -o /worker.py && "
        f"python3 -u /worker.py --control-plane {CONTROL_PLANE_URL}'"
    )

    print(f"[*] Dispatching pod creation request to Runpod API...")
    try:
        pod = runpod.create_pod(
            name=f"diffraction-gpu-{int(time.time())}",
            image_name=DEFAULT_IMAGE,
            gpu_type_id=gpu_type,
            cloud_type="ALL",  # Uses Community or Secure cloud for fastest availability
            gpu_count=1,
            container_disk_in_gb=25,
            volume_in_gb=0,
            docker_args=docker_args,
        )
    except Exception as e:
        print(f"[ERROR] Failed to create pod with {gpu_type}: {e}")
        print("[*] Trying fallback GPU: NVIDIA RTX A4000 (16GB VRAM)...")
        pod = runpod.create_pod(
            name=f"diffraction-gpu-{int(time.time())}",
            image_name=DEFAULT_IMAGE,
            gpu_type_id="NVIDIA RTX A4000",
            cloud_type="ALL",
            gpu_count=1,
            container_disk_in_gb=25,
            docker_args=docker_args,
        )

    pod_id = pod.get("id")
    print(f"[SUCCESS] Runpod Pod Created! Pod ID: {pod_id}")
    print(f"[*] Pod is booting... (Status: {pod.get('desiredStatus', 'INITIALIZING')})")
    print(f"[*] Monitoring startup until registered with {CONTROL_PLANE_URL}...")

    # Wait for pod to enter RUNNING state
    for i in range(24):
        time.sleep(5)
        pod_status = runpod.get_pod(pod_id)
        status = pod_status.get("desiredStatus")
        print(f"    --> Status check ({i*5}s): {status}")
        if status == "RUNNING":
            print(f"\n[SUCCESS] Pod {pod_id} is now RUNNING in the cloud!")
            print(f"[*] The daemon is querying local CUDA and registering with Diffraction.")
            print(f"[*] Check live workers: curl -s https://app.diffraction.in/api/v1/factory/gpu-workers")
            print(f"[*] To stop this pod later and halt billing, run:")
            print(f"    python scripts/deploy_runpod_worker.py --api-key {api_key} --stop {pod_id}")
            return pod_id

    print(f"[WARN] Pod taking longer than 2 minutes to boot. Check Runpod console: https://console.runpod.io/pods")
    return pod_id

def stop_worker_pod(api_key: str, pod_id: str):
    runpod.api_key = api_key
    print(f"[*] Terminating Runpod Pod: {pod_id}...")
    try:
        runpod.terminate_pod(pod_id)
        print(f"[SUCCESS] Pod {pod_id} terminated. Billing halted.")
    except Exception as e:
        print(f"[ERROR] Failed to terminate pod: {e}")

def main():
    parser = argparse.ArgumentParser(description="Diffraction Runpod Worker Launcher")
    parser.add_argument("--api-key", type=str, required=True, help="Runpod API Key")
    parser.add_argument("--gpu", type=str, default="NVIDIA GeForce RTX 4090", help="GPU Type ID")
    parser.add_argument("--stop", type=str, help="Pod ID to terminate")
    args = parser.parse_args()

    if args.stop:
        stop_worker_pod(args.api_key, args.stop)
    else:
        launch_worker_pod(args.api_key, gpu_type=args.gpu)

if __name__ == "__main__":
    main()
