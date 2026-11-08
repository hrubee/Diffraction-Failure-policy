#!/usr/bin/env python3
"""
Diffraction Explicit NVIDIA Cosmos 7B Persistent Volume Downloader.
Downloads only the ~14GB diffusers pipeline (filtering out 30GB of NeMo shards & Guardrail Llama weights)
directly onto the attached Runpod persistent volume at /workspace/cosmos_7b_weights.
"""

import os
import sys

def main():
    token = os.environ.get("HF_TOKEN") or (sys.argv[1] if len(sys.argv) > 1 else None)
    if not token:
        print("[ERROR] No Hugging Face token provided.")
        sys.exit(1)

    print("================================================================================")
    print("  DIFFRACTION - EXPLICIT NVIDIA COSMOS 7B PERSISTENT VOLUME DOWNLOADER")
    print("  Target Volume: /workspace/cosmos_7b_weights")
    print("  Repository: nvidia/Cosmos-1.0-Diffusion-7B-Video2World")
    print("================================================================================")

    try:
        from huggingface_hub import snapshot_download
    except ImportError:
        import subprocess
        print("[*] Installing huggingface_hub on GPU node...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", "huggingface_hub"])
        from huggingface_hub import snapshot_download

    dest = "/workspace/cosmos_7b_weights"
    os.makedirs(dest, exist_ok=True)

    if os.path.exists(os.path.join(dest, "model_index.json")):
        print(f"[SUCCESS] Model already downloaded on persistent volume at {dest}! Ready.")
        return

    print(f"[*] Initiating multi-threaded download of Cosmos 7B (~14 GB) to {dest}...")
    snapshot_download(
        repo_id="nvidia/Cosmos-1.0-Diffusion-7B-Video2World",
        token=token,
        local_dir=dest,
        ignore_patterns=["nemo/*", "Cosmos-1.0-Guardrail/*", "*.pt", "*.zarray"],
        max_workers=8
    )
    print(f"🎉 [SUCCESS] NVIDIA Cosmos 7B is permanently saved to persistent volume at {dest}!")

if __name__ == "__main__":
    main()
