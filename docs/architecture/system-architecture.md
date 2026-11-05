# System Architecture: ROS 2-to-Cosmos Physical AI Verification Platform

## 1. Executive Summary & Goals

This platform bridges real-world physical robot deployments (running ROS 2) with NVIDIA's synthetic generative and simulation stack (Cosmos, Isaac Sim, Omniverse). It automates the transition from **real-world failure detection $\rightarrow$ 3D spatial twin reconstruction $\rightarrow$ adversarial generative perturbation $\rightarrow$ headless Isaac Lab policy validation $\rightarrow$ certified policy export**.

### Quality Attributes & Constraints
* **Zero-Interruption Onboard Compute:** Edge telemetry extraction must use $<5\%$ CPU and $<512\text{ MB}$ RAM on edge platforms (NVIDIA Jetson AGX Orin, industrial x86 IPCs).
* **Zero-Idle Cloud OpEx:** Compute must scale to zero when no incidents are being processed.
* **Deterministic Traceability:** Every simulated test run must trace back to an exact real-world timestamp, robot URDF version hash, and sensor calibration matrix.

---

## 2. C4 Container Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                 EDGE TIER (On-Robot)                                    │
│                                                                                         │
│   ┌─────────────────────┐      ┌─────────────────────────┐     ┌────────────────────┐   │
│   │ Robot Sensors       │ ───► │ `edge_telemetry_agent`  │ ──► │ Compressed MCAP    │   │
│   │ (RGB-D, LiDAR, IMU) │      │ (RAM Circular Buffer &  │     │ Packet Exporter    │   │
│   └─────────────────────┘      │  Disengagement Sentinel)│     └────────────────────┘   │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ TLS 1.3 / S3 Multipart Stream
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           INGESTION & CONTROL PLANE TIER                                │
│                                                                                         │
│   ┌─────────────────────┐      ┌─────────────────────────┐     ┌────────────────────┐   │
│   │ Cloud Ingestion API │ ───► │ MCAP Decoupler &        │ ──► │ Unified Sensor &   │   │
│   │ (FastAPI / MinIO)   │      │ TF Transform Extractor  │     │ Pose Timeseries    │   │
│   └─────────────────────┘      └─────────────────────────┘     └────────────────────┘   │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           SPATIAL TWIN & SIMULATION CORE                                │
│                                                                                         │
│   ┌────────────────────────────────┐            ┌───────────────────────────────────┐   │
│   │ Omniverse NuRec Synthesizer    │            │ NVIDIA Cosmos World Model Engine  │   │
│   │ (Point Cloud / Mesh -> OpenUSD)│ ─────────► │ (Cosmos Predict & Cosmos Transfer)│   │
│   └────────────────────────────────┘            └─────────────────┬─────────────────┘   │
│                                                                   │                     │
│                                                                   ▼                     │
│                                                 ┌───────────────────────────────────┐   │
│                                                 │ Headless Isaac Lab Vectorized RL  │   │
│                                                 │ (10,000+ Parallel Stress Tests)   │   │
│                                                 └─────────────────┬─────────────────┘   │
└───────────────────────────────────────────────────────────────────┼─────────────────────┘
                                                                    │
                                                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           CERTIFICATION & REPORTING TIER                                │
│                                                                                         │
│   ┌────────────────────────────────┐            ┌───────────────────────────────────┐   │
│   │ Safety Certification Oracle    │ ─────────► │ Enterprise Safety Audit Report    │   │
│   │ (Pass/Fail, Friction Bounds)   │            │ (HTML, JSON & Optimized Policy)   │   │
│   └────────────────────────────────┘            └───────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Flow & Component Sequence

1. **Continuous Buffering:** Sensor messages stream into the `RingBuffer` in RAM. Old frames are dropped silently without disk I/O.
2. **Event Trigger:** Anomaly detector identifies human intervention, E-stop, or trajectory tracking error exceeding threshold ($\delta > 0.45\text{m}$).
3. **Capture Window:** Buffer dumps $[-20\text{s}, +5\text{s}]$ window to an `.mcap` container.
4. **Cloud Decoupling:** Ingestion API receives the file, unpacks camera frames, point clouds, joint states, and builds the monotonic TF transform tree.
5. **USD Twin Assembly:** Static environment is converted into an OpenUSD stage; dynamic actors are segmented; robot URDF is rigged at the failure pose.
6. **Cosmos Perturbations:** Cosmos Transfer injects photorealistic visual chaos (glare, rain, surface puddles); Cosmos Predict generates alternative trajectories; domain randomizer sweeps dynamic friction $\mu \in [0.12, 1.15]$ and latency.
7. **Isaac Lab Parallel Validation:** Thousands of vectorized environments evaluate whether the onboard planner survives the perturbations.
8. **Audit & Certification:** Certification oracle generates compliance scores and failure boundary curves.
