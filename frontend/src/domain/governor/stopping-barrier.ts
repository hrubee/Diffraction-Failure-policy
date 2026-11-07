/**
 * Pure Mathematical Domain Model: Dynamic Stopping Barrier Function
 * Clamps commanded velocity to satisfy physical zero-overshoot stopping margin.
 */

export interface BarrierInputs {
  readonly linearVelocityCmd: number;
  readonly usableDistanceToObstacle: number;
  readonly surfaceFrictionMu: number;
  readonly reactionLatencySec?: number;
}

export interface BarrierVerdict {
  readonly safeLinearVelocity: number;
  readonly stoppingDistanceRequired: number;
  readonly barrierMargin: number;
  readonly clamped: boolean;
  readonly effectiveDecelerationMs2: number;
}

const GRAVITY = 9.80665;
const DEFAULT_LATENCY_SEC = 0.05;

export const evaluateStoppingBarrier = (inputs: BarrierInputs): BarrierVerdict => {
  const vCmd = Math.max(0.01, inputs.linearVelocityCmd);
  const dUsable = Math.max(0.05, inputs.usableDistanceToObstacle);
  const mu = Math.max(0.05, Math.min(1.2, inputs.surfaceFrictionMu));
  const tLatency = inputs.reactionLatencySec ?? DEFAULT_LATENCY_SEC;

  // Maximum physical braking deceleration bounded by Coulomb friction
  const aMax = mu * GRAVITY;

  // Quadratic barrier function for safe entry speed
  // v_max = -a*t + sqrt((a*t)^2 + 2*a*d_usable)
  const term1 = aMax * tLatency;
  const discriminant = term1 * term1 + 2.0 * aMax * dUsable;
  const safeV = Math.max(0.0, -term1 + Math.sqrt(Math.max(0.0, discriminant)));

  // Distance required if commanded velocity were executed
  const stoppingDistCmd = vCmd * tLatency + (vCmd * vCmd) / (2.0 * aMax);

  const clamped = vCmd > safeV;
  const barrierMargin = dUsable - stoppingDistCmd;

  return {
    safeLinearVelocity: Number(safeV.toFixed(2)),
    stoppingDistanceRequired: Number(stoppingDistCmd.toFixed(2)),
    barrierMargin: Number(barrierMargin.toFixed(2)),
    clamped,
    effectiveDecelerationMs2: Number(aMax.toFixed(2)),
  };
};
