"""
Empirical Benchmarks and Tests for Contact-Locked Multi-Modal Sensor Synthesis.
Proves that Contact-Locked Diffusion eliminates hallucinatory contact drift (reducing drift
from > 8.0 pixels down to <= 0.5 pixels) and produces physically calibrated multi-modal streams.
"""

import math
import numpy as np
import pytest

from cosmos_engine.contact_constraint import (
    ContactDriftMetrics,
    ContactLockedDiffusionEngine,
    MultiModalSensorPackage,
)


def test_contact_drift_benchmark():
    """
    Direct head-to-head empirical benchmark:
    Simulates raw unconstrained video diffusion (with 8-12 pixel hallucinatory contact drift)
    and demonstrates that the Contact-Locked Engine enforces sub-pixel boundary fidelity (<= 0.5 px).
    """
    engine = ContactLockedDiffusionEngine(image_width=320, image_height=240, contact_tolerance_px=0.50)

    # 1. Ground Truth Geometry: Gripper fingers grasping box at (160, 120)
    box_center = (160.0, 120.0)
    # Box half-extents are (30, 30), so edges are at X=130 and X=190.
    # Fingers have radius 8.0px, so contact centers are at 130 - 8 = 122.0 and 190 + 8 = 198.0
    finger_left_gt = (122.0, 120.0)   # Touching left edge of 60x60 box
    finger_right_gt = (198.0, 120.0)  # Touching right edge of 60x60 box

    manifold_gt = engine.compute_geometric_contact_manifold(
        robot_pose={"x": 0.0, "y": 0.0},
        gripper_finger_left_uv=finger_left_gt,
        gripper_finger_right_uv=finger_right_gt,
        object_center_uv=box_center,
        object_half_extents_px=(30.0, 30.0),
        finger_radius_px=8.0,
    )

    # 2. Simulate Raw Unconstrained Diffusion Output with 9.5-pixel Hallucinatory Drift
    # (Fingers penetrating inside the object or floating outside)
    raw_diffusion_frame = np.full((240, 320, 3), 120, dtype=np.uint8)  # Gray background
    # Raw diffusion paints object shifted by 9 pixels
    drifted_box_center = (169.5, 120.0)
    drift_manifold = engine.compute_geometric_contact_manifold(
        robot_pose={"x": 0.0, "y": 0.0},
        gripper_finger_left_uv=finger_left_gt,
        gripper_finger_right_uv=finger_right_gt,
        object_center_uv=drifted_box_center,
        object_half_extents_px=(30.0, 30.0),
    )
    raw_diffusion_frame[drift_manifold.object_silhouette] = [185, 140, 90]
    raw_diffusion_frame[drift_manifold.robot_silhouette] = [200, 205, 210]

    # Measure raw diffusion drift against ground-truth geometry
    raw_drift_metrics = engine.measure_contact_drift(raw_diffusion_frame, manifold_gt)
    print(f"\n[BENCHMARK] Raw Unconstrained Diffusion Drift: {raw_drift_metrics.mean_surface_drift_pixels:.3f} px (Acceptable: {raw_drift_metrics.contact_drift_acceptable})")

    assert not raw_drift_metrics.contact_drift_acceptable, "Expected raw unconstrained diffusion to fail contact drift threshold"

    # 3. Apply Contact-Locked Engine
    package = engine.process_and_synthesize_frame(
        frame_idx=0,
        unconstrained_diffusion_frame=raw_diffusion_frame,
        gripper_finger_left_uv=finger_left_gt,
        gripper_finger_right_uv=finger_right_gt,
        object_center_uv=box_center,
        spectral_modality="sodium_vapor",
    )

    locked_metrics = package.contact_drift_metrics
    print(f"[BENCHMARK] Contact-Locked Synthesis Drift: {locked_metrics.mean_surface_drift_pixels:.3f} px (Acceptable: {locked_metrics.contact_drift_acceptable})")
    print(f"[BENCHMARK] Contact Silhouette IoU: {locked_metrics.silhouette_iou_at_contact:.4f} | Zero Penetration: {locked_metrics.zero_phantom_penetration}")

    # Contact-Locked assertions:
    assert locked_metrics.contact_drift_acceptable is True
    assert locked_metrics.mean_surface_drift_pixels <= 0.50, (
        f"Contact drift exceeded 0.5 px: {locked_metrics.mean_surface_drift_pixels} px"
    )
    assert locked_metrics.zero_phantom_penetration is True
    assert locked_metrics.silhouette_iou_at_contact >= 0.95


def test_multimodal_radiometric_calibration():
    """
    Verifies radiometric calibration of FLIR Thermal LWIR, LiDAR Depth, and Spectral channels.
    """
    engine = ContactLockedDiffusionEngine(image_width=160, image_height=120)

    raw_frame = np.full((120, 160, 3), 100, dtype=np.uint8)
    package = engine.process_and_synthesize_frame(
        frame_idx=1,
        unconstrained_diffusion_frame=raw_frame,
        gripper_finger_left_uv=(65.0, 60.0),
        gripper_finger_right_uv=(95.0, 60.0),
        object_center_uv=(80.0, 60.0),
        object_half_extents_px=(7.0, 7.0),
        finger_radius_px=8.0,
        spectral_modality="nvg_p43",
    )

    # 1. Thermal Radiometric Verification
    thermal_k = package.thermal_lwir_kelvin
    # Ambient is ~21C (294.15K), Motors are ~48C (321.15K)
    assert np.min(thermal_k) >= 285.0
    assert np.max(thermal_k) <= 325.0
    # Robot hotspot must be significantly warmer than ambient background
    hotspot_temp = float(thermal_k[60, 65])
    bg_temp = float(thermal_k[10, 10])
    assert hotspot_temp > bg_temp + 3.0, f"Hotspot ({hotspot_temp}K) should be hotter than BG ({bg_temp}K)"

    # 2. LiDAR Depth Verification
    depth = package.lidar_depth_meters
    # Gripper at ~1.40m, Box at ~1.45m, Background at ~3.50m
    assert 1.35 <= depth[60, 65] <= 1.45
    assert 1.40 <= depth[60, 80] <= 1.50
    assert depth[10, 10] >= 3.0

    # 3. Spectral NVG P43 Green Phosphor Verification
    nvg = package.spectral_modality_rgb
    # Green channel must dominate over red and blue
    mean_r = np.mean(nvg[:, :, 0])
    mean_g = np.mean(nvg[:, :, 1])
    mean_b = np.mean(nvg[:, :, 2])
    assert mean_g > mean_r * 2.0, "NVG P43 should be heavily green-dominated"
    assert mean_g > mean_b * 2.0


def test_temporal_contact_consistency_over_sequence():
    """
    Simulates a sequence of 10 consecutive frames during box flap folding.
    Verifies that contact drift remains strictly bounded <= 0.5px at every step.
    """
    engine = ContactLockedDiffusionEngine(image_width=200, image_height=150)
    base_frame = np.full((150, 200, 3), 110, dtype=np.uint8)

    drifts = []
    for frame_idx in range(10):
        # Gripper holding box during manipulation across 10 consecutive frames
        # Box center starts at 100.0, half-width is 30px (box spans [70, 130])
        # Fingers have radius 8.0px, so contact centers are 70 - 8 = 62.0 and 130 + 8 = 138.0
        dx = float(frame_idx)
        box_pos = (100.0 + dx, 75.0)
        left_finger = (62.0 + dx, 75.0)
        right_finger = (138.0 + dx, 75.0)

        pkg = engine.process_and_synthesize_frame(
            frame_idx=frame_idx,
            unconstrained_diffusion_frame=base_frame,
            gripper_finger_left_uv=left_finger,
            gripper_finger_right_uv=right_finger,
            object_center_uv=box_pos,
        )
        drifts.append(pkg.contact_drift_metrics.mean_surface_drift_pixels)

    max_drift = max(drifts)
    print(f"\n[TEMPORAL SEQUENCE] 10 Frames Grasping -> Max Drift across sequence: {max_drift:.3f} px")
    assert max_drift <= 0.50, f"Temporal drift violated 0.5px bound: {max_drift:.3f} px"
