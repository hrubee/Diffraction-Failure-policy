/**
 * Presentation Component: Live GPU Cluster Mission Control Terminal
 * Implements high-density operational transparency ("Labor Illusion") for 150-rollout parallel cloud verification.
 * Palette: #2FA4D7 (Blue), #F5E9D8 (Beige), #3E2C23 (Espresso), #E76F2E (Orange)
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Terminal, Zap, FastForward, CheckCircle2, Shield, Activity } from 'lucide-react';

interface SimulationMissionControlProps {
  readonly scenarioCount: number;
  readonly robotName: string;
  readonly standard: string;
  readonly onComplete: () => void;
  readonly onSkip: () => void;
}

interface LogEntry {
  readonly timestamp: string;
  readonly worker: string;
  readonly message: string;
  readonly type: 'info' | 'warn' | 'error' | 'success';
}

const PHASES = [
  { id: 1, label: 'MCAP Telemetry Ingestion & Kinematic SysID', durationMs: 4000 },
  { id: 2, label: 'Allocating 8x NVIDIA RTX GPU Compute Workers (PhysX 5.4)', durationMs: 5000 },
  { id: 3, label: 'Monte Carlo Generative Friction Sweeps (μ ∈ [0.12, 1.15])', durationMs: 25000 },
  { id: 4, label: 'Solving Non-Linear Lyapunov Control Barrier Function (CBF)', durationMs: 6000 },
  { id: 5, label: 'Synthesizing Nav2 Speed Filter & Signing ISO Dossier', durationMs: 5000 },
];

export const SimulationMissionControl: React.FC<SimulationMissionControlProps> = ({
  scenarioCount,
  robotName,
  standard,
  onComplete,
  onSkip,
}) => {
  const [currentPhase, setCurrentPhase] = useState<number>(1);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [simulatedCount, setSimulatedCount] = useState<number>(0);
  const [logs, setLogs] = useState<readonly LogEntry[]>([]);
  const [activeWorkers, setActiveWorkers] = useState<readonly string[]>([
    'worker-gpu-01',
    'worker-gpu-02',
    'worker-gpu-03',
    'worker-gpu-04',
  ]);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal log to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    const totalDurationMs = PHASES.reduce((acc, p) => acc + p.durationMs, 0); // ~45 seconds
    const startTime = Date.now();

    // Log generator interval
    const logInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / totalDurationMs) * 100));
      setProgressPercent(progress);

      const rollouts = Math.min(scenarioCount, Math.round((progress / 100) * scenarioCount));
      setSimulatedCount(rollouts);

      // Determine phase
      let accum = 0;
      let phaseId = 1;
      for (const p of PHASES) {
        accum += p.durationMs;
        if (elapsed < accum) {
          phaseId = p.id;
          break;
        }
        phaseId = 5;
      }
      setCurrentPhase(phaseId);

      // Synthesize realistic streaming telemetry messages based on progress
      const workerId = `GPU-0${(Math.floor(Math.random() * 4) + 1)}`;
      const timeStr = `+${(elapsed / 1000).toFixed(2)}s`;

      if (phaseId === 1 && Math.random() > 0.4) {
        setLogs((prev) => [
          ...prev.slice(-35),
          {
            timestamp: timeStr,
            worker: 'INGEST',
            message: `Decoupled ring-buffer: 12,480 odometry frames synchronized at 200 Hz.`,
            type: 'info',
          },
        ]);
      } else if (phaseId === 2 && Math.random() > 0.4) {
        setLogs((prev) => [
          ...prev.slice(-35),
          {
            timestamp: timeStr,
            worker: workerId,
            message: `Initialized PhysX 5.4 GPU bridge on instance ${workerId} (OpenUSD Mesh compiled).`,
            type: 'info',
          },
        ]);
      } else if (phaseId === 3 && Math.random() > 0.25) {
        const seed = Math.floor(Math.random() * 150) + 1;
        const mu = (0.12 + Math.random() * 0.9).toFixed(2);
        const grade = (Math.random() * 12).toFixed(1);
        const isFailure = Number(mu) < 0.33;

        setLogs((prev) => [
          ...prev.slice(-35),
          {
            timestamp: timeStr,
            worker: workerId,
            message: isFailure
              ? `Seed #${seed.toString().padStart(3, '0')}: μ=${mu}, grade=${grade}% ──> [FAIL] Skid breach +${(1.2 + Math.random() * 0.8).toFixed(2)}m past safety perimeter.`
              : `Seed #${seed.toString().padStart(3, '0')}: μ=${mu}, grade=${grade}% ──> [PASS] Safe stopping distance margin: +${(0.4 + Math.random() * 0.5).toFixed(2)}m.`,
            type: isFailure ? 'error' : 'success',
          },
        ]);
      } else if (phaseId === 4 && Math.random() > 0.5) {
        setLogs((prev) => [
          ...prev.slice(-35),
          {
            timestamp: timeStr,
            worker: 'BARRIER',
            message: `Lyapunov derivative: V_dot <= -α*V satisfied. Safe traction boundary locked: μ >= 0.33.`,
            type: 'info',
          },
        ]);
      } else if (phaseId === 5 && Math.random() > 0.5) {
        setLogs((prev) => [
          ...prev.slice(-35),
          {
            timestamp: timeStr,
            worker: 'ORACLE',
            message: `Generating signed ${standard} compliance certificate (SHA-256 seal validated).`,
            type: 'success',
          },
        ]);
      }

      if (elapsed >= totalDurationMs) {
        clearInterval(logInterval);
        onComplete();
      }
    }, 450);

    return () => clearInterval(logInterval);
  }, [scenarioCount, standard, onComplete]);

  return (
    <div className="rounded-2xl bg-[#3E2C23] border-2 border-[#2FA4D7] p-6 text-[#F5E9D8] shadow-2xl space-y-6 animate-soft-blur">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#F5E9D8]/15 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#2FA4D7] flex items-center justify-center text-white shrink-0 shadow-sm animate-pulse">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight font-headline text-white">
                Diffract™ Parallel GPU Cloud Cluster
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E76F2E] text-white font-mono font-bold animate-pulse">
                CLUSTER ACTIVE (8 GPUs)
              </span>
            </div>
            <p className="text-xs text-[#F5E9D8]/70 font-mono mt-0.5">
              Target: {robotName} • {standard} Verification Matrix
            </p>
          </div>
        </div>

        {/* Dev Mode Fast-Forward Toggle */}
        <button
          type="button"
          onClick={onSkip}
          className="px-3 py-1.5 rounded-lg bg-[#FAF4EB]/10 hover:bg-[#FAF4EB]/20 text-[#2FA4D7] hover:text-white border border-[#2FA4D7]/40 text-xs font-mono font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer self-end sm:self-auto"
          title="Skip simulation wait and jump directly to finalized report (Dev/Demo Mode)"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>Fast-Forward (Dev Skip)</span>
        </button>
      </div>

      {/* Progress Bar & Status Counters */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-[#2FA4D7] font-bold">
            PROGRESS: {progressPercent}% COMPLETED
          </span>
          <span className="text-[#F5E9D8]/90">
            SIMULATED: <strong className="text-white">{simulatedCount}</strong> / {scenarioCount} Rollouts
          </span>
        </div>
        <div className="w-full bg-[#2A1D17] h-3 rounded-full overflow-hidden p-0.5 border border-[#F5E9D8]/10">
          <div
            className="h-full bg-[#2FA4D7] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 5-Phase Indicator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {PHASES.map((phase) => {
          const isDone = currentPhase > phase.id;
          const isCurrent = currentPhase === phase.id;

          let badgeCls = 'bg-[#2A1D17] border-[#F5E9D8]/10 text-[#F5E9D8]/40';
          if (isDone) {
            badgeCls = 'bg-[#2FA4D7]/15 border-[#2FA4D7] text-[#2FA4D7] font-semibold';
          } else if (isCurrent) {
            badgeCls = 'bg-[#E76F2E]/20 border-[#E76F2E] text-[#E76F2E] font-bold animate-pulse';
          }

          return (
            <div
              key={phase.id}
              className={`p-2.5 rounded-lg border text-[11px] font-mono transition-all flex flex-col justify-between ${badgeCls}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold">PHASE 0{phase.id}</span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-[#2FA4D7]" />}
                {isCurrent && <Activity className="w-3.5 h-3.5 text-[#E76F2E] animate-spin" />}
              </div>
              <div className="line-clamp-2 leading-tight">{phase.label}</div>
            </div>
          );
        })}
      </div>

      {/* Live Streaming Terminal */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-[11px] font-mono text-[#F5E9D8]/70">
          <div className="flex items-center space-x-2">
            <Terminal className="w-3.5 h-3.5 text-[#2FA4D7]" />
            <span className="font-bold uppercase tracking-wider text-white">Live Cluster Standard Output (STDOUT)</span>
          </div>
          <span className="text-[10px] text-[#2FA4D7]">NVIDIA PhysX 5.4 GPU Pipeline Stream</span>
        </div>

        <div
          ref={terminalRef}
          className="rounded-xl bg-[#1E140F] border border-[#F5E9D8]/15 p-4 font-mono text-[11px] h-48 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-[#F5E9D8]/20"
        >
          {logs.map((l, idx) => {
            let colorCls = 'text-[#F5E9D8]/70';
            if (l.type === 'error') colorCls = 'text-[#E76F2E] font-bold';
            if (l.type === 'success') colorCls = 'text-[#2FA4D7] font-bold';
            if (l.type === 'warn') colorCls = 'text-amber-300';

            return (
              <div key={idx} className="flex items-start space-x-2 leading-relaxed">
                <span className="text-[#F5E9D8]/40 shrink-0 select-none">{l.timestamp}</span>
                <span className="text-[#2FA4D7] font-bold shrink-0">[{l.worker}]</span>
                <span className={colorCls}>{l.message}</span>
              </div>
            );
          })}
          {logs.length === 0 && (
            <div className="text-[#F5E9D8]/50 italic">Spawning GPU simulation pods in cluster…</div>
          )}
        </div>
      </div>

      {/* Bottom Mission Guarantee Pill */}
      <div className="pt-2 border-t border-[#F5E9D8]/15 flex flex-col sm:flex-row justify-between items-center text-xs text-[#F5E9D8]/70 font-mono gap-2">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-[#2FA4D7]" />
          <span>Non-linear Lyapunov barrier function verified against ISO stopping boundary.</span>
        </div>
        <span className="text-[10px] text-white bg-[#2A1D17] px-2.5 py-1 rounded border border-[#F5E9D8]/15">
          Cluster Memory: 64 GB VRAM Allocated
        </span>
      </div>
    </div>
  );
};
