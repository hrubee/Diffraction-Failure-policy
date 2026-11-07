/**
 * Infrastructure Layer: Edge Dynamic Safety Governor Evaluator
 */

import { requestJson } from './api-client';
import { BarrierInputs, BarrierVerdict, evaluateStoppingBarrier } from '../domain/governor/stopping-barrier';

interface BackendGovernorResponse {
  safe_linear_velocity: number;
  stopping_distance_required: number;
  clamped: boolean;
  effective_deceleration_limit_ms2: number;
}

export const evaluateEdgeGovernor = async (inputs: BarrierInputs): Promise<BarrierVerdict> => {
  try {
    const raw = await requestJson<BackendGovernorResponse>('/api/v1/edge/safety-governor/evaluate', {
      method: 'POST',
      body: JSON.stringify({
        linear_velocity_cmd: inputs.linearVelocityCmd,
        angular_velocity_cmd: 0.0,
        usable_distance_to_obstacle: inputs.usableDistanceToObstacle,
        surface_friction_mu: inputs.surfaceFrictionMu,
        reaction_latency_sec: inputs.reactionLatencySec ?? 0.05,
      }),
    });

    const margin = Number((inputs.usableDistanceToObstacle - raw.stopping_distance_required).toFixed(2));
    return {
      safeLinearVelocity: raw.safe_linear_velocity,
      stoppingDistanceRequired: raw.stopping_distance_required,
      barrierMargin: margin,
      clamped: raw.clamped,
      effectiveDecelerationMs2: raw.effective_deceleration_limit_ms2,
    };
  } catch {
    // Deterministic client-side fallback if backend unavailable
    return evaluateStoppingBarrier(inputs);
  }
};
