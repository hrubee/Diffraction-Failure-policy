# ADR-004: In-Memory Circular Ring Buffer with Event-Driven Dump

## Status
Accepted

## Context
Industrial robots operate for hours without failure. Streaming continuous 4K video, LiDAR point clouds, and odometry to disk or cloud 24/7 exhausts onboard SSD write endurance, burns vehicle battery, and consumes gigabytes of expensive cellular LTE/5G bandwidth. 99.9% of normal nominal operation data is redundant.

## Options Considered

| Option | Pros | Cons | Complexity | When Valid |
| :--- | :--- | :--- | :--- | :--- |
| **Option A: Continuous 24/7 Cloud Streaming** | Complete history preserved. | High LTE/5G costs (\$1,000s/mo), battery drain, high cloud storage waste. | Low | Fixed-power tethered installations. |
| **Option B: Continuous Local SSD Logging with FIFO cleanup** | No cloud bandwidth waste during normal ops. | Wears out NVMe/eMMC drive within months due to write amplification. | Low | Development prototypes. |
| **Option C: In-RAM Circular Ring Buffer + Event Trigger Sentinel** | Zero SSD write wear, zero cellular upload during nominal runs, captures pre-incident context ($[-20\text{s}, +5\text{s}]$). | Requires careful memory bounds ($<512\text{MB}$) to avoid OOM on robot compute. | Medium | Production autonomous robots. |

## Decision
**Chosen: Option C (In-RAM Circular Ring Buffer + Event Trigger Sentinel)**.

## Rationale
Autonomous mobile robots only need their failure context recorded. Retaining the last 20 seconds in a pre-allocated RAM circular buffer ensures that when an intervention, emergency stop, or safety boundary deviation occurs, the exact causal conditions leading up to the failure are captured without wearing out hardware or wasting bandwidth.

## Consequences
- **Positive**: Zero disk I/O during normal runs, $<500\text{MB}$ RAM footprint, 99% cellular data savings.
- **Negative**: If trigger condition fails to detect an anomaly, incident is not captured.
- **Mitigation**: Multi-tier triggers (E-stop, teleop heartbeat, trajectory deviation, and manual operator trigger).
