#!/usr/bin/env python3
"""
Diffraction CLI // The Unified Physical AI Command Center.
Run edge telemetry recording, automated twin synthesis, Cosmos perturbations,
and Isaac Sim safety audits directly from your terminal.
"""

import argparse
import os
import sys
import time

# Ensure workspace root is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from cloud_gateway.mcap_parser import McapParser
from cosmos_engine.cosmos_client import CosmosModelClient
from cosmos_engine.domain_randomizer import DomainRandomizer
from reporting.report_generator import SafetyReportGenerator
from scripts.run_mock_robot import simulate_warehouse_amr_run
from simulation_harness.certification_oracle import SafetyCertificationOracle
from simulation_harness.isaac_runner import IsaacSimulationHarness
from twin_synthesis.nurec_reconstruction import NuRecReconstructor


def cmd_status(args):
    print("\n=======================================================")
    print("      DIFFRACTION // SYSTEM & STORAGE STATUS           ")
    print("=======================================================")
    storage_dirs = {
        "Telemetry Drops (.mcap)": "./storage/telemetry_drops",
        "USD Stages (.usda)": "./storage/usd_stages",
        "Cosmos Data": "./storage/cosmos_augmented",
        "Audit Reports (HTML/JSON)": "./storage/reports",
    }
    for name, path in storage_dirs.items():
        if os.path.exists(path):
            files = [f for f in os.listdir(path) if not f.startswith(".")]
            size_kb = sum(os.path.getsize(os.path.join(path, f)) for f in files) / 1024
            print(f" • {name:<26}: {len(files):>4} files ({size_kb:>7.1f} KB) -> {path}")
        else:
            print(f" • {name:<26}: Directory not created yet")
    print("=======================================================\n")


def cmd_simulate(args):
    print("\n[CLI] Starting simulated Autonomous Mobile Robot run in Dock Bay 7...")
    mcap_path = simulate_warehouse_amr_run(output_dir="./storage/telemetry_drops")
    print(f"\n[SUCCESS] Generated authentic incident packet: {mcap_path}\n")


def cmd_audit(args):
    mcap_path = args.mcap_file
    if not mcap_path:
        # Pick latest MCAP from storage
        drops_dir = "./storage/telemetry_drops"
        drops = [os.path.join(drops_dir, f) for f in os.listdir(drops_dir) if f.endswith(".mcap")]
        if not drops:
            print("[INFO] No MCAP found. Simulating an incident first...")
            mcap_path = simulate_warehouse_amr_run(output_dir=drops_dir)
        else:
            mcap_path = sorted(drops, key=os.path.getmtime)[-1]

    print(f"\n[CLI] Running Physical AI Safety Audit on: {mcap_path}")
    incident = McapParser.parse_file(mcap_path)
    print(f" • Robot: {incident.robot_id} | Trigger: {incident.trigger_type} ({incident.trigger_severity})")

    # 1. Twin Synthesis
    reconstructor = NuRecReconstructor(output_dir="./storage/usd_stages")
    twin_data = reconstructor.reconstruct_from_incident(incident=incident)
    print(f" • OpenUSD Stage: {twin_data['usd_stage_path']}")

    # 2. Cosmos Perturbations
    randomizer = DomainRandomizer(seed=int(time.time()))
    perturbations = randomizer.generate_scenarios(count=args.scenarios)
    nominal_traj = [{"t": s * 0.1, "x": s * 0.1 * 0.8, "y": 0.0, "yaw": 0.0} for s in range(30)]
    cosmos_client = CosmosModelClient(output_dir="./storage/cosmos_augmented")
    cosmos_results = cosmos_client.batch_generate(twin_data["usd_stage_path"], perturbations, nominal_traj)
    print(f" • Cosmos Adversarial Scenarios: {len(cosmos_results)} rollouts generated")

    # 3. Isaac Sim Parallel Verification
    sim_harness = IsaacSimulationHarness(collision_threshold_m=0.25, max_acceptable_error_m=0.40)
    outcomes = sim_harness.execute_batch(cosmos_results, obstacle_position={"x": 2.5, "y": 0.55})

    # 4. Certification Oracle
    oracle = SafetyCertificationOracle(min_passing_score=95.0, conditional_threshold=85.0)
    verdict = oracle.evaluate_audit(outcomes)

    # 5. Reports
    reporter = SafetyReportGenerator(output_dir="./storage/reports")
    incident_meta = {
        "robot_id": incident.robot_id,
        "facility_id": incident.facility_id,
        "trigger_type": incident.trigger_type,
        "trigger_severity": incident.trigger_severity,
        "usd_stage_path": twin_data["usd_stage_path"],
    }
    json_path = reporter.generate_json_report(incident_meta, verdict)
    html_path = reporter.generate_html_report(incident_meta, verdict)

    print("\n-------------------------------------------------------")
    print(f"  VERDICT:             {verdict.certification_status}")
    print(f"  SAFETY SCORE:        {verdict.safety_compliance_score}%")
    print(f"  PASSED / TOTAL:      {verdict.scenarios_passed} / {verdict.total_scenarios_evaluated}")
    print(f"  SAFE MIN FRICTION:   μ >= {verdict.safe_operational_boundaries['minimum_safe_surface_friction_mu']}")
    print(f"  HTML AUDIT REPORT:   {html_path}")
    print(f"  JSON AUDIT REPORT:   {json_path}")
    print("-------------------------------------------------------\n")


def cmd_serve(args):
    import uvicorn
    print(f"\n[CLI] Launching Diffraction Web Console on http://{args.host}:{args.port}")
    uvicorn.run("cloud_gateway.app:app", host=args.host, port=args.port, reload=False)


def main():
    parser = argparse.ArgumentParser(description="Diffraction CLI // Physical AI Verification Engine")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Status
    subparsers.add_parser("status", help="Show system, pipeline, and storage metrics")

    # Simulate
    subparsers.add_parser("simulate", help="Simulate a real AMR edge failure and generate an MCAP packet")

    # Audit
    audit_parser = subparsers.add_parser("audit", help="Run full NuRec -> Cosmos -> Isaac Sim audit on an MCAP file")
    audit_parser.add_argument("mcap_file", nargs="?", default=None, help="Path to input .mcap container (optional, defaults to latest)")
    audit_parser.add_argument("--scenarios", type=int, default=150, help="Number of Cosmos adversarial scenarios (default: 150)")

    # Serve
    serve_parser = subparsers.add_parser("serve", help="Launch the Web Control Console & API Gateway")
    serve_parser.add_argument("--host", default="0.0.0.0", help="Host address (default: 0.0.0.0)")
    serve_parser.add_argument("--port", type=int, default=8080, help="Port (default: 8080)")

    args = parser.parse_args()
    if not args.command:
        parser.print_help()
        sys.exit(0)

    if args.command == "status":
        cmd_status(args)
    elif args.command == "simulate":
        cmd_simulate(args)
    elif args.command == "audit":
        cmd_audit(args)
    elif args.command == "serve":
        cmd_serve(args)


if __name__ == "__main__":
    main()
