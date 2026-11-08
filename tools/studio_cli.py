#!/usr/bin/env python3
"""
Diffraction Studio Internal Operations CLI
The unified operational command-line tool for Diffraction simulation engineers.
Powers internal delivery of client sprints behind the scenes.

Commands:
    studio-cli sprint:new        Initialize a client sprint workspace
    studio-cli convert:urdf      Convert URDF/CAD to PhysX 5 OpenUSD & Isaac Lab config
    studio-cli stage:generate    Generate procedural OpenUSD environment & Replicator recipe
    studio-cli cosmos:augment    Orchestrate NVIDIA Cosmos Transfer 2.5 diffusion augmentation
    studio-cli dataset:package   Assemble demonstration corpus into Hugging Face LeRobot v2
    studio-cli sprint:list       List active client sprints and delivery status
"""

import argparse
import json
import os
import sys
import time

# Ensure repository root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tools.urdf_to_physx_usd import UrdfToPhysxUsdConverter
from tools.procedural_stage_generator import ProceduralStageGenerator
from tools.cosmos_transfer_pipeline import CosmosTransferPipeline
from tools.dataset_packager_lerobot import LeRobotDatasetPackager

SPRINT_REGISTRY_FILE = "storage/active_sprints.json"

def load_sprints():
    if os.path.exists(SPRINT_REGISTRY_FILE):
        try:
            with open(SPRINT_REGISTRY_FILE, "r") as f:
                return json.load(f)
        except:
            return []
    return []

def save_sprints(sprints):
    os.makedirs(os.path.dirname(SPRINT_REGISTRY_FILE), exist_ok=True)
    with open(SPRINT_REGISTRY_FILE, "w") as f:
        json.dump(sprints, f, indent=2)

def cmd_sprint_new(args):
    sprint_id = f"SPRINT-{int(time.time())}"
    days = 3 if args.package == "robot_usd_rig" else (7 if args.package == "procedural_stage" else 14)
    price = 7500 if args.package == "robot_usd_rig" else (18500 if args.package == "procedural_stage" else 35000)

    record = {
        "sprint_id": sprint_id,
        "client_name": args.client,
        "package": args.package,
        "embodiment": args.embodiment or "Custom Embodiment",
        "fixed_fee_usd": price,
        "turnaround_days": days,
        "start_time": time.time(),
        "deadline_time": time.time() + (days * 86400),
        "status": "IN_PROGRESS",
        "deliverables": [],
    }

    sprints = load_sprints()
    sprints.append(record)
    save_sprints(sprints)

    print(f"\n=======================================================")
    print(f" [Diffraction Internal Studio] NEW SPRINT INITIALIZED")
    print(f"=======================================================")
    print(f"  • Sprint ID:         {sprint_id}")
    print(f"  • Client:            {args.client}")
    print(f"  • Package:           {args.package} (${price:,})")
    print(f"  • SLA Deadline:      {days} Business Days")
    print(f"  • Workspace:         storage/sprints/{sprint_id}")
    print(f"=======================================================\n")

def cmd_convert_urdf(args):
    print(f"[Studio Engine] Parsing URDF: {args.urdf}...")
    converter = UrdfToPhysxUsdConverter(args.urdf)
    results = converter.convert(args.output_dir)
    print(f"✓ PhysX 5 OpenUSD asset written: {results['usd_path']}")
    print(f"✓ Isaac Lab RobotCfg written:    {results['cfg_path']}")

def cmd_stage_generate(args):
    print(f"[Studio Engine] Generating procedural stage '{args.env}' (seed={args.seed})...")
    gen = ProceduralStageGenerator(env_type=args.env, seed=args.seed)
    results = gen.generate(args.output_dir)
    print(f"✓ OpenUSD stage written:         {results['usda_path']}")
    print(f"✓ Omniverse Replicator recipe:   {results['replicator_script']}")

def cmd_cosmos_augment(args):
    print(f"[Studio Engine] Dispatching Cosmos Transfer 2.5 augmentation for {args.episodes} episodes...")
    pipeline = CosmosTransferPipeline()
    results = pipeline.process_episode_batch(args.episodes, args.prompt, args.output_dir)
    print(f"✓ ControlNet spec locked:        {results['spec_file']}")
    print(f"✓ Batch manifest certified:      {results['batch_manifest']}")
    print(f"✓ Total augmented frames:        {results['total_frames']}")

def cmd_dataset_package(args):
    print(f"[Studio Engine] Packaging LeRobot v2 demonstration corpus ({args.episodes} episodes)...")
    packager = LeRobotDatasetPackager(args.dataset_id, args.embodiment, args.task)
    results = packager.package(args.episodes, args.output_dir)
    print(f"✓ LeRobot info.json:             {results['info_json']}")
    print(f"✓ PyTorch streaming DataLoader:  {results['loader_script']}")
    print(f"✓ Sim2Real Wasserstein dossier:  {results['sim2real_cert']}")

def cmd_sprint_list(args):
    sprints = load_sprints()
    print(f"\n=======================================================")
    print(f" [Diffraction Internal Studio] ACTIVE SPRINT QUEUE ({len(sprints)})")
    print(f"=======================================================")
    if not sprints:
        print("  No active sprints in local queue.")
    for s in sprints:
        elapsed_days = round((time.time() - s["start_time"]) / 86400, 1)
        print(f"  [{s['sprint_id']}] {s['client_name']} | {s['package']} (${s['fixed_fee_usd']:,})")
        print(f"    Progress: Day {elapsed_days} / {s['turnaround_days']} | Status: {s['status']}")
    print(f"=======================================================\n")

def main():
    parser = argparse.ArgumentParser(description="Diffraction Internal Studio CLI")
    subparsers = parser.add_subparsers(dest="command", help="Studio operation")

    # sprint:new
    p_new = subparsers.add_parser("sprint:new", help="Initialize new client sprint")
    p_new.add_argument("--client", required=True, help="Client company name")
    p_new.add_argument("--package", required=True, choices=["robot_usd_rig", "procedural_stage", "cosmos_dataset"])
    p_new.add_argument("--embodiment", default=None, help="Robot embodiment name")

    # convert:urdf
    p_urdf = subparsers.add_parser("convert:urdf", help="Convert URDF to PhysX 5 OpenUSD")
    p_urdf.add_argument("--urdf", required=True)
    p_urdf.add_argument("--output-dir", required=True)

    # stage:generate
    p_stage = subparsers.add_parser("stage:generate", help="Generate procedural OpenUSD stage")
    p_stage.add_argument("--env", default="warehouse", choices=["warehouse", "dock", "cleanroom", "domestic"])
    p_stage.add_argument("--seed", type=int, default=42)
    p_stage.add_argument("--output-dir", required=True)

    # cosmos:augment
    p_cosmos = subparsers.add_parser("cosmos:augment", help="Run Cosmos Transfer augmentation")
    p_cosmos.add_argument("--episodes", type=int, default=1000)
    p_cosmos.add_argument("--prompt", default="photorealistic warehouse with sodium lighting")
    p_cosmos.add_argument("--output-dir", required=True)

    # dataset:package
    p_pkg = subparsers.add_parser("dataset:package", help="Package into LeRobot v2 dataset")
    p_pkg.add_argument("--dataset-id", default="client_vla_dataset")
    p_pkg.add_argument("--embodiment", default="Client Robot")
    p_pkg.add_argument("--task", default="Demonstration Task")
    p_pkg.add_argument("--episodes", type=int, default=100000)
    p_pkg.add_argument("--output-dir", required=True)

    # sprint:list
    subparsers.add_parser("sprint:list", help="List active sprints")

    args = parser.parse_args()
    if not args.command:
        parser.print_help()
        sys.exit(1)

    dispatch = {
        "sprint:new": cmd_sprint_new,
        "convert:urdf": cmd_convert_urdf,
        "stage:generate": cmd_stage_generate,
        "cosmos:augment": cmd_cosmos_augment,
        "dataset:package": cmd_dataset_package,
        "sprint:list": cmd_sprint_list,
    }
    dispatch[args.command](args)

if __name__ == "__main__":
    main()
