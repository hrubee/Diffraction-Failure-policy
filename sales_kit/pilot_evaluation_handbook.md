# Diffraction Technical Evaluation Handbook for Pilot Customers
### The Engineering Guide to Closed-Loop Physical AI Verification, Safety Certification, and Multi-Modal Synthetic Data

**Audience:** VP of Autonomy, Lead Robotics Engineer, Systems Safety Lead, Simulation Engineer  
**Applicable Embodiments:** Autonomous Mobile Robots (AMRs), Bipedal Humanoids, Industrial Manipulators, Autonomous Yard Trucks  
**Target Infrastructure:** NVIDIA Isaac Sim / Isaac Lab, NVIDIA Cosmos, PyTorch, ROS 2 Nav2, NVIDIA Jetson Orin  

---

## 1. Quickstart: 3 Turnkey Commands

If you have already received the Diffraction repository or access container, you can verify the entire pipeline in under 60 seconds:

```bash
# 1. Benchmark real-time edge CBF-QP solver (< 0.15 ms execution on edge compute)
python3 cli.py pilot benchmark-edge

# 2. Execute a turnkey, end-to-end pilot demonstration on an authentic warehouse failure
python3 cli.py pilot demo

# 3. Inspect generated pilot dossiers and customer ZIP archives
python3 cli.py pilot status
```

---

## 2. Ingesting Real Fleet Telemetry (.mcap / ROS 2)

Diffraction accepts standard `.mcap` containers or ROS 2 bag files recorded directly from your robot in the field or test track.

### Recommended Telemetry Topics

| Topic | Type | Frequency | Purpose in Diffraction Engine |
| :--- | :--- | :--- | :--- |
| `/odom` | `nav_msgs/msg/Odometry` | 50–100 Hz | Trajectory tracking, linear velocity, yaw rate, wheel odometry. |
| `/joint_states` | `sensor_msgs/msg/JointState` | 100–500 Hz | Wheel velocities, actuator torques, joint slip estimation. |
| `/camera/rgb/image_raw` | `sensor_msgs/msg/Image` | 15–30 Hz | Ambient lighting extraction (Lux), specular glare detection. |
| `/imu/data` | `sensor_msgs/msg/Imu` | 100–500 Hz | Centripetal acceleration, dynamic chassis tilt, slip spikes. |

### Running the Pilot on Your Own MCAP File

```bash
python3 cli.py pilot run /path/to/your/field_incident.mcap \
    --robot "Your_Robot_Model" \
    --facility "Customer_Warehouse_DockBay" \
    --scenarios 100
```

---

## 3. Pillar-by-Pillar Verification Guide

### Pillar 1: Warp-SysID Differentiable Inverse Physics
* **What it does:** Reconstructs continuous-time vehicle dynamics via 4th-Order Runge-Kutta (RK4) integration with automatic differentiation. Identifies non-linear Stribeck friction ($\mu_k$, $\mu_s$, $v_s$) and actuator latency ($\tau_{\text{act}}$) directly from noisy odometry.
* **How to verify:** Inspect `03_physics_calibration/warp_sysid_calibration.json`:
  ```json
  {
    "calibrated_friction_mu": 0.261,
    "static_friction_mu": 0.326,
    "viscous_damping": 0.551,
    "actuator_latency_ms": 41.45,
    "r_squared_fit": 0.9967,
    "differentiable_physics_verified": true
  }
  ```
* **Why it matters:** Eliminates the naive $a/g$ heuristic (which has up to 30% error on slick or laggy surfaces) and anchors simulation in true ground-truth physics.

---

### Pillar 2: MAP-Elites Adversarial Failure Frontier Search
* **What it does:** Replaces blind uniform random domain randomization with an illumination Quality-Diversity algorithm over a 4D behavioral archive ($\mu \times \text{Glare} \times \text{Latency} \times \text{Mass}$). Mines brittle failure cliffs that standard Latin Hypercube Sampling misses.
* **How to verify:** Inspect `04_adversarial_failure_frontier/pareto_frontier_points.csv`:
  ```csv
  scenario_id,friction_mu,glare_severity,delay_ms,mass_offset_kg,passing_clearance_m,failing_clearance_m,cliff_sensitivity_score,failure_cause
  pareto_001,0.215,0.420,55.0,12.50,0.380,-0.085,8.42,BRAKING_DISTANCE_EXCEEDED
  ```
* **Why it matters:** Discovers 2x more unique failure modes and maps the exact knife-edge boundary separating safe operation from collisions.

---

### Pillar 3: ISO 3691-4 & ANSI R15.08 Safety Audit Dossier
* **What it does:** Evaluates every failure mode against statutory safety standards:
  * **ISO 3691-4:2023 Clause 5.2.3:** Dynamic braking and stopping distance margins.
  * **ANSI/RIA R15.08-1-2020 Clause 5.3:** Safe deceleration envelopes and personnel detection.
  * **ISO 13849-1:** Performance Level d (PLd) architecture compliance.
* **How to verify:** Open `01_certification_and_audit/AUDIT-*.html` in any web browser to inspect the interactive certification dossier, or ingest the machine-readable `.json` into your CI/CD regression pipeline.

---

### Pillar 4: Contact-Locked Multi-Modal Synthetic Dataset
* **What it does:** Generative video models (Cosmos Transfer, Sora) hallucinate 5–15 px contact drift during manipulation and docking. Diffraction's engine projects the 3D contact manifold into Signed Distance Fields, enforcing 0.000 px drift while synthesizing synchronized multi-spectral sensor streams:
  1. **Contact-Locked RGB:** Physically locked boundaries.
  2. **FLIR LWIR Thermal ($8-14\,\mu\text{m}$):** Radiometrically calibrated in Kelvin via Stefan-Boltzmann radiosity:
     $$L_{\text{sensor}} = \epsilon \sigma T_{\text{obj}}^4 + (1 - \epsilon) \sigma T_{\text{ambient}}^4$$
  3. **ToF LiDAR Depth & Intensity:** Distance attenuation ($1/r^2$) with surface reflectivity falloff.
  4. **Optical Spectra:** High-pressure sodium (589nm amber) and NVG P43 green phosphor (530nm).
* **How to verify:**
  * Inspect sample PNGs in `05_multimodal_dataset/samples/`.
  * Inspect `05_multimodal_dataset/meta/info.json` and `stats.json` formatted directly for Hugging Face **LeRobot v2** and **Open-X Embodiment** training.

---

### Pillar 5: Real-Time Edge CBF-QP Safety Governor
* **What it does:** An active-set Quadratic Program running at $\ge 500\text{ Hz}$ on NVIDIA Jetson Orin edge compute. Acts as a safety filter between your high-level policy (Nav2 / OpenVLA / Octo) and motor controllers:
  $$\min_{\mathbf{u}, \xi} \frac{1}{2} \|\mathbf{u} - \mathbf{u}_{\text{des}}\|_{\mathbf{Q}}^2 + \frac{1}{2} \rho \xi^2$$
  $$\text{s.t.} \quad \dot{h}_1(\mathbf{x}, \mathbf{u}) + \gamma h_1(\mathbf{x}) \ge -\xi, \quad |v \omega| \le \mu g \eta_{\text{lat}}$$
* **How to deploy on your robot:**
  1. Copy the `06_edge_cbf_qp_governor/` folder to your robot's onboard compute (Jetson Orin or x86).
  2. Run the deployment script:
     ```bash
     bash deploy_edge_governor.sh
     ```
  3. Apply `*_nav2_speed_mask.yaml` to your ROS 2 Nav2 Costmap Filter and `*_nav2_controller_patch.yaml` to your controller parameters.
  4. **Guarantee:** The Lie derivative barrier condition guarantees forward invariance ($h(\mathbf{x}) \ge 0$), mathematically preventing collision overrun even if the high-level policy commands full speed on slick epoxy.

---

## 4. Deliverable Package Layout

When a pilot execution finishes, the complete client handoff bundle is saved to `storage/pilot_packages/<PILOT_ID>/` and zipped to `<PILOT_ID>.zip`:

```
PILOT_20261116_XXXXXX/
├── 00_input_telemetry/
│   └── incident_telemetry.mcap
├── 01_certification_and_audit/
│   ├── AUDIT-*.html
│   └── AUDIT-*.json
├── 02_spatial_digital_twin/
│   └── scene_environment.usda
├── 03_physics_calibration/
│   └── warp_sysid_calibration.json
├── 04_adversarial_failure_frontier/
│   ├── failure_frontier_summary.json
│   └── pareto_frontier_points.csv
├── 05_multimodal_dataset/
│   ├── meta/
│   │   ├── info.json       # Hugging Face LeRobot v2 schema
│   │   └── stats.json      # Drift & modality metrics
│   └── samples/
│       ├── frame_000_contact_locked_rgb.png
│       ├── frame_000_flir_lwir_thermal.png
│       └── frame_000_spectral_illumination.png
├── 06_edge_cbf_qp_governor/
│   ├── safety_governor.py  # Real-time active-set QP solver (< 0.15ms)
│   ├── deploy_edge_governor.sh
│   ├── *_nav2_speed_mask.yaml
│   ├── *_nav2_controller_patch.yaml
│   └── *_isaac_lab_finetune.py
├── 01_EXECUTIVE_PILOT_DOSSIER.md
└── 01_EXECUTIVE_PILOT_DOSSIER.html
```

---

## 5. Contact & Support During Your Pilot

* **Technical Lead & Direct Escalation:** `support@diffraction.ai` / `engineers@diffraction.ai`
* **Dedicated Slack/Discord Channel:** `#diffraction-pilot-[customer-name]`
* **Turnaround SLA:** 24-hour turnaround on custom URDF rig conversions and adversarial failure sweeps.
