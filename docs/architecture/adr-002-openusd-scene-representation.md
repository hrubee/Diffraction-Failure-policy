# ADR-002: Simulation Intermediate Representation Using Pixar OpenUSD

## Status
Accepted

## Context
Our pipeline must interface with NVIDIA Omniverse NuRec, NVIDIA Cosmos world models, and NVIDIA Isaac Sim / Isaac Lab. We need a unified spatial scene description standard that supports:
1. Composition, layer overrides, and variant switching (e.g., swapping dry concrete for wet epoxy).
2. Articulated robotics kinematic schemas (URDF $\leftrightarrow$ USD physics).
3. Physically based rendering (PBR) materials, lighting, and camera optical characteristics.

## Options Considered

| Option | Pros | Cons | Complexity | When Valid |
| :--- | :--- | :--- | :--- | :--- |
| **Option A: Pure URDF + OBJ/GLTF files** | Ubiquitous in academic robotics. | No native support for complex lighting, camera optics, physics materials, or scene hierarchy composition. | Low | Simple physics engines (PyBullet). |
| **Option B: Pixar OpenUSD (`.usd`, `.usda`)** | Native to NVIDIA Omniverse/Isaac Sim, non-destructive layer composition, rich physics schema (UsdPhysics). | Steeper learning curve, larger file footprint if uncompressed. | Medium | Omniverse & Isaac Sim enterprise pipelines. |
| **Option C: SDF (Simulation Description Format)** | Standard in Gazebo. | Isolated to Gazebo ecosystem, zero interoperability with Cosmos or Omniverse. | Medium | Gazebo legacy stacks. |

## Decision
**Chosen: Option B (Pixar OpenUSD)**.

## Rationale
NVIDIA's entire Physical AI suite (Isaac Sim, Isaac Lab, Cosmos, Omniverse) is built natively around OpenUSD. Using USD allows non-destructive layering: the base reconstructed world is immutable, while Cosmos and our domain randomizer apply parametric variants as lightweight USD override layers without modifying original geometry.

## Consequences
- **Positive**: Direct zero-conversion loading into Isaac Sim and Cosmos; enterprise-standard layering.
- **Negative**: Requires `usd-core` Python bindings.
- **Mitigation**: Standardize on programmatic ASCII `.usda` generation for lightweight metadata and binary `.usd` for heavy meshes.
