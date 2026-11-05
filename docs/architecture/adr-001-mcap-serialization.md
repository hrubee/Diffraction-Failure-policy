# ADR-001: Telemetry Data Serialization Using Foxglove MCAP

## Status
Accepted

## Context
Physical robots run ROS 2 and generate high-bandwidth heterogeneous streams: compressed RGB/Depth video, LiDAR PointCloud2, IMU, wheel odometry, and high-frequency TF coordinate transforms.
We need a serialization format that:
1. Supports heterogeneous schemas without requiring compilation on the consumer.
2. Allows streaming append without rewriting indices on crash.
3. Provides high-compression ratios (zstd) to minimize cellular/LTE uplink costs.
4. Has official support in Python, C++, and web visualizers (Foxglove Studio).

## Options Considered

| Option | Pros | Cons | Complexity | When Valid |
| :--- | :--- | :--- | :--- | :--- |
| **Option A: Standard ROS 2 Bag (sqlite3)** | Native ROS 2 tooling. | High write lock overhead, index corruption on power cut, bulky file size. | Medium | Pure ROS 2 internal dev only. |
| **Option B: Foxglove MCAP** | Zero-dependency, streamable, built-in chunk indexing, native zstd/lz4 compression, open standard. | Requires `mcap` library parser. | Low | Production robotics telemetry. |
| **Option C: Custom HDF5 / Parquet** | Great for tabular data. | Poor support for variable-rate ROS 2 messages, no native point cloud/image interleaving. | High | Deep learning offline datasets. |

## Decision
**Chosen: Option B (Foxglove MCAP)**.

## Rationale
MCAP is designed specifically for robotics. It decouples the channel schemas (ROS 2 CDR, Protobuf, JSON) from the container, allowing fast random-access seeking and zero-copy streaming without risking file corruption during unexpected E-stops.

## Consequences
- **Positive**: Direct compatibility with modern robotics tooling, 60–80% bandwidth savings with zstd, self-contained schema metadata.
- **Negative**: Extra step to convert to raw tensors in ML training pipelines.
- **Mitigation**: Build high-throughput Python MCAP batch decouplers into the cloud ingestion worker.
