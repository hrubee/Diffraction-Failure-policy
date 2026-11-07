/**
 * Reactive Domain Hook: Dynamic Safety Governor Simulation
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarrierVerdict, evaluateStoppingBarrier } from '../domain/governor/stopping-barrier';
import { evaluateEdgeGovernor } from '../infrastructure/governor-evaluator';

export interface UseGovernorSimulationReturn {
  speed: number;
  distance: number;
  frictionMu: number;
  setSpeed: (v: number) => void;
  setDistance: (d: number) => void;
  setFrictionMu: (mu: number) => void;
  verdict: BarrierVerdict;
  isEvaluating: boolean;
}

export const useGovernorSimulation = (): UseGovernorSimulationReturn => {
  const [speed, setSpeed] = useState<number>(1.40);
  const [distance, setDistance] = useState<number>(1.10);
  const [frictionMu, setFrictionMu] = useState<number>(0.35);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [verdict, setVerdict] = useState<BarrierVerdict>(() =>
    evaluateStoppingBarrier({
      linearVelocityCmd: 1.40,
      usableDistanceToObstacle: 1.10,
      surfaceFrictionMu: 0.35,
    })
  );

  const evaluate = useCallback(async () => {
    setIsEvaluating(true);
    try {
      const res = await evaluateEdgeGovernor({
        linearVelocityCmd: speed,
        usableDistanceToObstacle: distance,
        surfaceFrictionMu: frictionMu,
      });
      setVerdict(res);
    } finally {
      setIsEvaluating(false);
    }
  }, [speed, distance, frictionMu]);

  useEffect(() => {
    evaluate();
  }, [evaluate]);

  return {
    speed,
    distance,
    frictionMu,
    setSpeed,
    setDistance,
    setFrictionMu,
    verdict,
    isEvaluating,
  };
};
