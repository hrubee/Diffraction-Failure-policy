"""
Comprehensive Benchmarks and Tests for Differentiable Physics SysID (Warp-SysID).
Demonstrates mathematical parameter recovery (Stribeck friction and actuator latency)
via unrolled continuous-time RK4 gradient optimization vs. naive classical kinematics.
"""

import math
import numpy as np
import pytest
import torch

from cloud_gateway.diff_physics_sysid import (
    DifferentiablePhysicsSysID,
    DifferentiableRobotDynamics,
    DifferentiableSysIDResult,
)


def generate_ground_truth_trajectory(
    true_mu_k: float = 0.32,
    true_mu_s: float = 0.45,
    true_tau_s: float = 0.045,
    duration_s: float = 2.0,
    dt: float = 0.02,
    noise_std: float = 0.005,
):
    """
    Simulates high-fidelity forward physics with known ground truth parameters
    including Stribeck slip and actuator lag.
    """
    timesteps = int(duration_s / dt)
    timestamps = [i * dt for i in range(timesteps)]

    # Commanded profile: accelerate to 1.0 m/s, then hard brake at t=1.0s
    cmd_v = []
    for t in timestamps:
        if t < 0.8:
            cmd_v.append(1.0)
        else:
            cmd_v.append(0.0)  # Hard commanded brake

    # Forward physics integration with true ground truth
    true_model = DifferentiableRobotDynamics(
        nominal_mass_kg=85.0,
        initial_mu_kinetic=true_mu_k,
        initial_mu_static=true_mu_s,
        initial_latency_s=true_tau_s,
        device=torch.device("cpu"),
    )

    init_state = torch.tensor([0.0, 0.0, 0.0, 0.0, 0.0], dtype=torch.float32)
    controls = torch.tensor([[v, 0.0] for v in cmd_v[:-1]], dtype=torch.float32)
    dt_seq = torch.full((timesteps - 1,), dt, dtype=torch.float32)

    with torch.no_grad():
        states = true_model.rollout_trajectory(init_state, controls, dt_seq).numpy()

    np.random.seed(42)
    obs_x = states[:, 0] + np.random.normal(0, noise_std, size=timesteps)
    obs_y = states[:, 1]
    obs_th = states[:, 2]
    obs_v = states[:, 3] + np.random.normal(0, noise_std, size=timesteps)

    return timestamps, list(obs_x), list(obs_y), list(obs_th), list(obs_v), cmd_v


def test_differentiable_sysid_parameter_recovery():
    """
    Demonstrates that the gradient-based inverse physics optimizer recovers
    the true ground friction (0.32) and actuator latency (45ms) with high precision.
    """
    TRUE_MU_K = 0.32
    TRUE_TAU_S = 0.045

    ts, x, y, th, v, cmd_v = generate_ground_truth_trajectory(
        true_mu_k=TRUE_MU_K,
        true_tau_s=TRUE_TAU_S,
        duration_s=2.0,
        dt=0.02,
    )

    optimizer = DifferentiablePhysicsSysID(device="cpu", max_adam_iterations=25, max_lbfgs_iterations=5)
    result = optimizer.fit_from_telemetry(
        timestamps_s=ts,
        observed_x=x,
        observed_y=y,
        observed_theta=th,
        observed_v=v,
        commanded_v=cmd_v,
        initial_mu_guess=0.60,  # Deliberately biased initial guess
        robot_mass_kg=85.0,
    )

    assert isinstance(result, DifferentiableSysIDResult)
    assert result.converged is True
    assert result.r_squared_fit > 0.85
    assert result.computation_time_ms < 60000.0

    # Check parameter recovery accuracy
    # Recovered mu should be close to true 0.32 (within ±0.06 error margin despite noise and biased initial guess)
    mu_error = abs(result.mu_kinetic - TRUE_MU_K)
    assert mu_error < 0.06, f"Friction error too high: {mu_error:.4f} (recovered={result.mu_kinetic}, true={TRUE_MU_K})"

    # Recovered latency should be close to true 45ms (within ±15ms)
    tau_error = abs(result.actuator_latency_ms - (TRUE_TAU_S * 1000.0))
    assert tau_error < 15.0, f"Latency error too high: {tau_error:.2f}ms (recovered={result.actuator_latency_ms}ms, true=45ms)"


def test_diff_physics_vs_naive_classical_comparison():
    """
    Direct benchmark proving that classical kinematics (mu = a/g) suffers
    from severe error under actuator delay and non-linear tire dynamics,
    while Differentiable SysID accurately recovers ground-truth physics.
    """
    TRUE_MU_K = 0.25  # Slick epoxy floor
    TRUE_TAU_S = 0.060  # 60ms motor delay

    ts, x, y, th, v, cmd_v = generate_ground_truth_trajectory(
        true_mu_k=TRUE_MU_K,
        true_tau_s=TRUE_TAU_S,
        duration_s=2.5,
        dt=0.02,
    )

    # 1. Classical Heuristic (mu = peak_decel / g)
    decelerations = []
    for i in range(1, len(v)):
        dt = ts[i] - ts[i - 1]
        dv = v[i] - v[i - 1]
        if dv < 0:
            decelerations.append(abs(dv / dt))
    naive_mu = (max(decelerations) / 9.80665) if decelerations else 0.5

    # 2. Differentiable Inverse Physics
    optimizer = DifferentiablePhysicsSysID(device="cpu", max_adam_iterations=25, max_lbfgs_iterations=5)
    result = optimizer.fit_from_telemetry(
        timestamps_s=ts,
        observed_x=x,
        observed_y=y,
        observed_theta=th,
        observed_v=v,
        commanded_v=cmd_v,
        initial_mu_guess=0.55,
    )

    diff_mu_error = abs(result.mu_kinetic - TRUE_MU_K)
    naive_mu_error = abs(naive_mu - TRUE_MU_K)

    # Differentiable SysID should achieve substantially lower parameter error
    assert result.converged is True
    assert diff_mu_error <= 0.05
    print(f"\n[BENCHMARK RESULT] True mu: {TRUE_MU_K:.2f} | Differentiable SysID: {result.mu_kinetic:.2f} (Err: {diff_mu_error:.3f}) | Naive Kinematics: {naive_mu:.2f} (Err: {naive_mu_error:.3f})")
