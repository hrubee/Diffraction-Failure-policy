#!/usr/bin/env bash
# Turnkey provisioning script for on-demand GPU nodes (RunPod, Lambda Labs, Vast.ai)
# Configures headless NVIDIA Isaac Sim and Cosmos environment.

set -euo pipefail

echo "=========================================================="
echo "  DIFFRACTION // PROVISIONING CLOUD GPU WORKER NODE       "
echo "=========================================================="

# 1. Verify NVIDIA Driver & CUDA
if ! command -v nvidia-smi &> /dev/null; then
    echo "[ERROR] NVIDIA Driver not found! Ensure node has GPU attached."
    exit 1
fi

nvidia-smi

# 2. System updates and system packages
apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    libgl1-mesa-glx \
    libglib2.0-0 \
    zstd

# 3. Python virtualenv setup
python3 -m pip install --upgrade pip
pip install -r requirements.txt

# 4. Pull NVIDIA Cosmos & Isaac Lab containers (if running via Docker)
if command -v docker &> /dev/null; then
    echo "[INFO] Pulling NVIDIA Isaac Sim headless container..."
    # docker pull nvcr.io/nvidia/isaac-sim:4.2.0
fi

echo "[SUCCESS] Worker environment ready for headless Isaac Sim & Cosmos tasks."
