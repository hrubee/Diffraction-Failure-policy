/**
 * Presentation Component: Multi-Modal Adversarial Stress Matrix
 */

import React from 'react';

interface AdversarialMatrixCardProps {
  readonly scenarioCount: number;
  readonly onChangeScenarioCount: (n: number) => void;
  readonly onExecuteAudit: () => void;
  readonly isLoading: boolean;
}

export const AdversarialMatrixCard: React.FC<AdversarialMatrixCardProps> = ({
  scenarioCount,
  onChangeScenarioCount,
  onExecuteAudit,
  isLoading,
}) => {
  return (
    <div className="p-6 rounded-2xl bg-white border border-subtle card-shadow space-y-5">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mono">
          2. Multi-Modal Adversarial Matrix
        </h3>
        <span className="text-[10px] text-blue-600 font-semibold mono">Parametric Space</span>
      </div>

      <div>
        <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
          <span>Parallel Scenario Rollouts</span>
          <span className="mono text-blue-600 font-bold num-tabular">{scenarioCount} rollouts</span>
        </div>
        <input
          type="range"
          id="scenCount"
          min="20"
          max="300"
          step="10"
          value={scenarioCount}
          onChange={(e) => onChangeScenarioCount(Number(e.target.value))}
          className="w-full cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 mono num-tabular">
          <span>Fast (20)</span>
          <span>Balanced (150)</span>
          <span>Exhaustive (300)</span>
        </div>
      </div>

      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
        <div className="flex justify-between text-slate-700 font-medium">
          <span>Kinematic Envelope:</span>
          <span className="mono font-bold text-blue-700">ZMP, Grade (12%), Wrench</span>
        </div>
        <div className="flex justify-between text-slate-700 font-medium">
          <span>Surface Friction Swept:</span>
          <span className="mono font-bold text-slate-800 num-tabular">μ = 0.12 to 1.15</span>
        </div>
        <div className="flex justify-between text-slate-700 font-medium">
          <span>Adverse Illumination:</span>
          <span className="mono font-bold text-amber-700 num-tabular">Up to 95,000 Lux</span>
        </div>
        <div className="flex justify-between text-slate-700 font-medium">
          <span>Actuator Latency Jitter:</span>
          <span className="mono font-bold text-slate-700 num-tabular">± 45 ms</span>
        </div>
      </div>

      <button
        type="button"
        id="runPipelineBtn"
        disabled={isLoading}
        onClick={onExecuteAudit}
        className="w-full min-h-[48px] py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-70 text-white font-bold rounded-xl shadow-md text-xs tracking-wider uppercase transition-transform duration-100 cursor-pointer flex items-center justify-center space-x-2"
      >
        {isLoading && (
          <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
        )}
        <span>{isLoading ? 'Verifying Trajectories…' : 'Execute Complete Verification Audit'}</span>
      </button>
    </div>
  );
};
