#!/usr/bin/env python3
"""
Diffraction Automated Cloud GPU Provisioner.
Supports spinning up ephemeral spot/on-demand GPU pods on RunPod or Lambda Labs
to execute NVIDIA Isaac Sim 6.2 and Cosmos WFM simulations.

Usage:
    # Using RunPod:
    python scripts/provision_cloud_gpu.py --provider runpod --api-key $RUNPOD_API_KEY --gpu-type "NVIDIA GeForce RTX 4090"
    
    # Using Lambda Labs:
    python scripts/provision_cloud_gpu.py --provider lambda --api-key $LAMBDA_API_KEY --instance-type gpu_1x_a10
"""

import os
import sys
import json
import time
import argparse
import urllib.request
import urllib.error

CONTROL_PLANE_URL = "https://app.diffraction.in"

def launch_runpod_instance(api_key: str, gpu_type: str = "NVIDIA GeForce RTX 4090") -> dict:
    """Launches an on-demand pod via RunPod GraphQL API."""
    print(f"[*] Contacting RunPod API to provision 1x {gpu_type}...")
    url = "https://api.runpod.io/graphql"
    
    # Startup script that pulls worker daemon and connects back to Diffraction
    docker_args = f'bash -c "curl -sSL https://raw.githubusercontent.com/hrubee/Diffraction-Failure-policy/main/backend/gpu_worker/worker_daemon.py -o /worker.py && python3 -u /worker.py --control-plane {CONTROL_PLANE_URL}"'
    
    query = """
    mutation CreatePod($input: PodFindAndDeployOnDemandInput!) {
      podFindAndDeployOnDemand(input: $input) {
        id
        name
        imageName
        machineId
        desiredStatus
      }
    }
    """
    
    variables = {
        "input": {
            "cloudType": "SECURE",
            "gpuCount": 1,
            "volumeInGb": 20,
            "containerDiskInGb": 20,
            "minVcpuCount": 4,
            "minMemoryInGb": 16,
            "gpuTypeId": gpu_type,
            "name": f"diffraction-isaac-worker-{int(time.time())}",
            "imageName": "runpod/pytorch:2.2.0-py3.10-cuda12.1.1-devel-ubuntu22.04",
            "dockerArgs": docker_args,
        }
    }
    
    payload = json.dumps({"query": query, "variables": variables}).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
    )
    
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if "errors" in data:
                raise RuntimeError(f"RunPod GraphQL Error: {data['errors']}")
            pod = data["data"]["podFindAndDeployOnDemand"]
            print(f"[SUCCESS] Pod Launched! ID: {pod['id']}, Name: {pod['name']}")
            print(f"[*] Pod will boot, detect the real {gpu_type}, and register with {CONTROL_PLANE_URL}")
            return pod
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        raise RuntimeError(f"RunPod API failed ({e.code}): {err_body}")

def launch_lambda_instance(api_key: str, instance_type: str = "gpu_1x_a10") -> dict:
    """Launches an on-demand instance via Lambda Labs REST API."""
    print(f"[*] Contacting Lambda Labs API to provision {instance_type}...")
    url = "https://cloud.lambdalabs.com/api/v1/instance-operations/launch"
    
    payload = json.dumps({
        "region_name": "us-east-1",
        "instance_type_name": instance_type,
        "name": f"diffraction-worker-{int(time.time())}",
        "user_data": f"""#!/bin/bash
curl -sSL https://raw.githubusercontent.com/hrubee/Diffraction-Failure-policy/main/backend/gpu_worker/worker_daemon.py -o /tmp/worker.py
python3 -u /tmp/worker.py --control-plane {CONTROL_PLANE_URL}
"""
    }).encode("utf-8")
    
    req = urllib.request.Request(
        url,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Basic {api_key}"
        }
    )
    
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            print(f"[SUCCESS] Lambda instance launched! Details: {data}")
            return data
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        raise RuntimeError(f"Lambda Labs API failed ({e.code}): {err_body}")

def main():
    parser = argparse.ArgumentParser(description="Diffraction Ephemeral Cloud GPU Provisioner")
    parser.add_argument("--provider", choices=["runpod", "lambda"], default="runpod", help="Cloud GPU Provider")
    parser.add_argument("--api-key", type=str, required=True, help="API Key for the chosen cloud provider")
    parser.add_argument("--gpu-type", type=str, default="NVIDIA GeForce RTX 4090", help="GPU Model identifier")
    args = parser.parse_args()

    if args.provider == "runpod":
        launch_runpod_instance(args.api_key, gpu_type=args.gpu_type)
    elif args.provider == "lambda":
        launch_lambda_instance(args.api_key, instance_type="gpu_1x_a10")

if __name__ == "__main__":
    main()
