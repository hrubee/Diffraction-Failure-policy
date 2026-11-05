# ADR-003: Hybrid Compute Topology (Zero-Idle On-Demand Spot GPU vs Dedicated Clusters)

## Status
Accepted

## Context
Running 24/7 dedicated enterprise GPU clusters (such as 8x NVIDIA H100s) costs \$2,000–\$3,500/month. For a bootstrapped startup processing intermittent robot failure batches (e.g., 5–10 incidents per week during initial pilot contracts), dedicated clusters waste 95%+ of their compute hours idling.

## Options Considered

| Option | Pros | Cons | Complexity | When Valid |
| :--- | :--- | :--- | :--- | :--- |
| **Option A: Dedicated 24/7 Multi-GPU Server** | Zero startup latency, predictable monthly cost. | Massive burn rate when idle (\$2,000–\$3,500/mo), financially suicidal for bootstrapping. | Low | Continuous high-scale production ($>100$ active enterprise fleets). |
| **Option B: Hybrid Serverless / On-Demand Spot Instances (RunPod / Lambda Labs / Vast.ai)** | Cost scales to zero when idle, 80% discount on spot instances, pay per second. | Cold-start latency (1–3 minutes to spin up container). | Medium | Bootstrapped MVP, Pilot phase, Batch processing. |
| **Option C: Buy On-Premises RTX 4090 Workstation** | One-time CapEx, no recurring cloud costs for light tasks. | Upfront capital (\$4,000+), limited VRAM (24GB vs 80GB H100 needed for Cosmos 14B), single point of failure. | High | In-office hardware-in-the-loop testing. |

## Decision
**Chosen: Option B (Hybrid Serverless / On-Demand Spot GPU Compute)**.

## Rationale
During the bootstrapped phase, turnaround time of 15–30 minutes for an incident analysis is completely acceptable to enterprise customers. Paying \$0.34–\$0.79/hr for RTX 4090 / L40S and \$1.99–\$2.49/hr for H100 only when actively simulating guarantees $>90\%$ gross margins from day one.

## Consequences
- **Positive**: Near-zero fixed monthly burn ($<\$100/\text{month}$ total infrastructure cost during MVP validation).
- **Negative**: Need automated worker provisioning and cold-start handling.
- **Mitigation**: Pre-built Docker container images hosted on registry; event-driven worker trigger script.
