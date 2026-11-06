# Diffraction // Physical AI Autonomous Safety & Verification Platform
### Closed-Loop Sim-to-Real Verification & ISO 3691-4 Safety Certification for Autonomous Fleets

[![Live Production](https://img.shields.io/badge/Live-app.diffraction.in-2563eb?style=for-the-badge&logo=caddy&logoColor=white)](https://app.diffraction.in)
[![Tests Passing](https://img.shields.io/badge/Tests-20%2F20%20Passing-10b981?style=for-the-badge&logo=pytest&logoColor=white)](https://github.com/hrubee/Diffraction-Failure-policy/actions)
[![Standards Compliant](https://img.shields.io/badge/Safety-ISO%203691--4%20%7C%20ANSI%20R15.08-f59e0b?style=for-the-badge)](https://app.diffraction.in)

**Diffraction** is an autonomous safety verification engine for Autonomous Mobile Robots (AMRs) and industrial AGVs operating on **ROS 2**. 

When an edge robot experiences an unhandled physical corner case (such as surface traction loss, dock door optical glare, CAN/DDS latency spikes, blind-corner worker near-misses, or high-CoG payload shifts), Diffraction automatically ingests the incident telemetry, reconstructs a physics-accurate 3D digital twin, runs 150+ Monte Carlo adversarial permutations, certifies the safety boundary against **ISO 3691-4:2023** and **ANSI/RIA R15.08**, and auto-generates deployable Nav2 speed costmap masks and controller firmware patches.

🌐 **Live Web Application:** [https://app.diffraction.in](https://app.diffraction.in)

---

## ⚡ The 5 Universal Physical AI Hazard Classes

Diffraction addresses the 5 core physical failure regimes causing autonomous fleet disengagements:

| Hazard Class | Physical Dynamics | Operational Consequence | Automated Remediation |
| :--- | :--- | :--- | :--- |
| **Class 1: Surface Traction Loss** | Friction $\mu < 0.35$, slip ratio $S > 20\%$ | Stopping distance doubles, safety corridor penetrated | Nav2 speed costmap filter mask (`yaml`) + dynamic lookahead scaling |
| **Class 2: Optical Glare Saturation** | Ambient lux $> 85,000$, direct specular reflection | False LiDAR point clouds trigger phantom E-stops | Bayesian sensor confidence gating + dynamic exposure filter |
| **Class 3: Middleware & CAN Latency** | DDS bus jitter $\tau > 150\text{ ms}$, packet drops | Control phase lag causes high-speed steering oscillation | CycloneDDS QoS XML + phase-lead compensator tuning |
| **Class 4: Kinematic Pinch & Worker Incursion** | Blind-corner pedestrian approach, TTC $< 1.2\text{ s}$ | Breaches ISO 3691-4 $0.50\text{ m}$ safety perimeter | Control Barrier Function (CBF) geofenced velocity de-rating |
| **Class 5: Dynamic Payload Mass Shift** | Heavy asymmetric pallet, CoG $> 1.4\text{ m}$, roll $\phi > 8.5^\circ$ | Centrifugal torque induces cornering rollover risk | Curvature-dependent velocity governor ($v_{\max} = \sqrt{\mu g R \frac{W}{2h}}$) |

---

## 🚀 Quickstart & Local Verification

### 1. Install Dependencies
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Run Automated Test Suite
```bash
python3 -m pytest tests -v
# 20 passed unit and integration tests
```

### 3. Run the Command Center CLI
```bash
# Check system status and storage footprint
python3 cli.py status

# Simulate an incident across any hazard class
python3 cli.py simulate --scenario optical_glare

# Execute a 150-scenario certification audit
python3 cli.py audit storage/telemetry_drops/<incident>.mcap --scenarios 150

# Launch the interactive Web Control Console
python3 cli.py serve --port 8080
# Visit http://localhost:8080 or https://app.diffraction.in
```

---

## 🏛️ Closed-Loop Architecture

```
[Edge AMR Fleet (ROS 2 / MCAP)]
            │  (Ring-buffer telemetry drop upon E-Stop / Disengagement)
            ▼
[Cloud Gateway & System Identification (SysID)]
            │  (Inverse dynamics: derive friction μ, lux blowout, delay τ)
            ▼
[Spatial Digital Twin Engine (OpenUSD)]
            │  (Assembles calibrated 3D world with physical collision layers)
            ▼
[Generative Verification Harness (Monte Carlo Domain Randomization)]
            │  (150+ parallel rollouts sweeping adversarial boundary conditions)
            ▼
[Safety Certification Oracle (ISO 3691-4 / ANSI R15.08)]
            │  (Clause-by-clause deterministic compliance scoring)
            ▼
[Closed-Loop Policy Remediation]
     ├── Nav2 Dynamic Speed Filter Mask YAML
     ├── Pure Pursuit / MPPI Controller Server Parameters YAML
     ├── CycloneDDS QoS XML Config
     └── Insurance Underwriting Telematics Dossier (FSR-AAA)
```

---

## 💼 Commercial & Pilot Kit (`sales_kit/`)

* **[pilot_agreement_sow.md](sales_kit/pilot_agreement_sow.md):** 30-day Statement of Work (SOW) template for enterprise pilot partnerships.
* **[cold_outreach_templates.md](sales_kit/cold_outreach_templates.md):** Cold outreach scripts for VPs of Autonomy, Safety Directors, and Chief Robotics Officers.
* **[executive_one_pager.html](sales_kit/executive_one_pager.html):** Printable executive summary highlighting fleet downtime ROI.

---

## 🔒 Security & Deployment

* **Production URL:** [https://app.diffraction.in](https://app.diffraction.in)
* **Reverse Proxy:** Caddy with automated Let's Encrypt TLS/SSL.
* **Process Supervisor:** Linux `systemd` daemon with automatic crash recovery (`diffraction.service`).
* **Telemetry Compatibility:** MCAP (ROS 2 Humble / Iron / Jazzy), Foxglove, standard ROS 1 bag migration.
