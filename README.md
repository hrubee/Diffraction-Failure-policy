# Diffraction // Physical AI Verification Engine
### Closed-Loop Sim-to-Real Verification & Safety CI/CD for Autonomous Fleets

Diffraction bridges physical robots operating on **ROS 2** with NVIDIA’s enterprise simulation stack (**NVIDIA Cosmos**, **NVIDIA Isaac Sim / Isaac Lab**, and **Omniverse NuRec**).

When an edge robot experiences an unhandled corner-case failure (slipping on wet epoxy, direct dock sunlight glare, tracking error spikes), Diffraction automatically captures the incident, reconstructs the 3D digital twin, runs 10,000+ adversarial simulation permutations, and certifies the firmware patch before OTA release.

---

## 🚀 Quickstart & Verification (30 Seconds)

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Automated Test Suite
```bash
python3 -m pytest tests
# 100% passing (8 unit tests across ring buffer, triggers, MCAP, USD, and oracle)
```

### 3. Run the End-to-End Pipeline
```bash
python3 scripts/run_end_to_end_pipeline.py
```
This executes the full sequence:
1. **Edge Simulator:** AMR Tugger 042 slips on a wet dock floor and captures 266 messages in `<0.05MB` RAM.
2. **MCAP Containerization:** Serializes telemetry to `storage/telemetry_drops/*.mcap`.
3. **NuRec USD Twin:** Assembles physics-accurate OpenUSD stage in `storage/usd_stages/*.usda`.
4. **Cosmos Perturbations:** Generates 150 adversarial variations (friction $\mu$, glare lux, sensor latency).
5. **Isaac Lab Parallel Sim:** Vectorized rollouts compute clearance, wheel slip, and stopping distances.
6. **Executive Audit Report:** Outputs certified HTML and JSON reports in `storage/reports/`.

---

## 💻 The Unified Command Center (`cli.py`)

Diffraction comes with a built-in CLI for robotics engineers:

```bash
# Check system status and storage footprint
python3 cli.py status

# Simulate an AMR edge failure and capture an MCAP
python3 cli.py simulate

# Run a 100-scenario audit on any MCAP container
python3 cli.py audit storage/telemetry_drops/<incident>.mcap --scenarios 100

# Launch the interactive Web Control Console
python3 cli.py serve --port 8080
# Open http://localhost:8080 in your browser
```

---

## 🌐 Web Control Console

Launch `python3 cli.py serve` and visit `http://localhost:8080`:
* **Drag-and-Drop Ingestion:** Ingest `.mcap` containers directly from your browser.
* **Live Trajectory Plotting:** Compare nominal trajectories vs. adversarial wet-slip rollouts and obstacle margins.
* **One-Click Stress Audit:** Run Cosmos perturbations and Isaac Sim validation.
* **Artifact Downloads:** Direct access to executive HTML reports and OpenUSD `.usda` 3D stages.

---

## 💼 Sales & Commercial Pilot Kit (`sales_kit/`)

* **[pilot_agreement_sow.md](sales_kit/pilot_agreement_sow.md):** Ready-to-sign \$20,000 Statement of Work (SOW) for a 30-day pilot project.
* **[cold_outreach_templates.md](sales_kit/cold_outreach_templates.md):** 3 battle-tested cold email templates targeted at VPs of Autonomy, Operations, and Product Safety.
* **[executive_one_pager.html](sales_kit/executive_one_pager.html):** Print-ready 1-page visual collateral explaining the \$50,000/hr downtime ROI.
* **[.github/workflows/diffraction_verify.yml](.github/workflows/diffraction_verify.yml):** Turnkey GitHub Action for automated pull request simulation testing.

---

## 🏗️ Architecture & Decision Records (`docs/architecture/`)

* `system-architecture.md`: Full C4 Container Diagram and telemetry sequence flows.
* `adr-001-mcap-serialization.md`: Foxglove MCAP over standard ROS 2 bags.
* `adr-002-openusd-scene-representation.md`: Pixar OpenUSD scene layers over raw URDF.
* `adr-003-serverless-spot-gpu-execution.md`: Zero-idle compute topology (\$0.34–\$2.49/hr spot GPUs vs \$3,000/mo dedicated clusters).
* `adr-004-ram-ring-buffer-trigger-sentinel.md`: In-RAM rolling buffer preventing onboard SSD wear.
