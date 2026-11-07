/**
 * Presentation Component: Super Banger Physical AI Landing Hero
 * Combines jaw-dropping dark-mode aesthetics, kinetic typography,
 * and an interactive live physics stress-test playground directly in the hero.
 */

'use client';

import React, { useState } from 'react';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  Activity,
  Cpu,
  Clock,
  Layers,
  FileCode,
  Sliders,
  Sparkles,
  Bot,
  Truck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  KineticRotatingHeadline,
  ShimmerBadge,
} from '@/components/ui/KineticTypography';

interface LandingHeroProps {
  readonly onLaunchConsole: (scenarioKey?: string) => void;
  readonly onExploreStory: () => void;
  readonly onOpenPricing: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onLaunchConsole,
  onExploreStory,
  onOpenPricing,
}) => {
  // Interactive Simulator State
  const [selectedRobot, setSelectedRobot] = useState<'amr' | 'humanoid' | 'hauler'>('amr');
  const [friction, setFriction] = useState<number>(0.22);
  const [slope, setSlope] = useState<number>(4);

  // Real-time Physics Calculation
  // v = 1.8 m/s (AMR), 1.2 m/s (Humanoid), 6.5 m/s (Hauler)
  const nominalSpeed = selectedRobot === 'amr' ? 1.8 : selectedRobot === 'humanoid' ? 1.2 : 6.5;
  const gravity = 9.81;
  const stoppingDist = (Math.pow(nominalSpeed, 2) / (2 * Math.max(0.08, friction) * gravity * Math.cos((slope * Math.PI) / 180))).toFixed(2);
  const skidRiskPercent = Math.min(99, Math.round((1 - friction / 0.8) * 100 + slope * 2));
  const isViolatingIso = Number(stoppingDist) > (selectedRobot === 'hauler' ? 12.0 : 1.5);

  const scenarioKeyMap: Record<string, string> = {
    amr: 'wheeled_amr_stopping_breach',
    humanoid: 'humanoid_zmp_slip',
    hauler: 'heavy_hauler_skid',
  };

  return (
    <section className="relative pt-12 pb-20 overflow-hidden" aria-label="Diffraction Physical AI Hero">
      {/* Background Ambient Spotlights & Tech Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none">
        <div className="absolute top-12 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[128px]" />
        <div className="absolute top-24 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[128px]" />
        <div className="absolute top-48 left-1/2 -translate-x-1/2 w-[700px] h-72 bg-indigo-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Badges & Live Status */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-xs text-blue-300 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-radar-dot" />
            <span className="font-semibold tracking-wide uppercase text-[10px] mono">
              PHYSICAL AI AUTONOMY SHIELD
            </span>
          </div>

          <span className="text-slate-600 hidden sm:inline">•</span>

          <ShimmerBadge className="bg-white/[0.04] text-slate-300 border-white/[0.1] text-xs">
            🛡️ ISO 3691-4 • ISO 13482 • ISO 17757 • ISO 10218
          </ShimmerBadge>

          <span className="text-slate-600 hidden md:inline">•</span>

          <span className="hidden md:inline-flex px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs mono font-medium">
            ⚡ 30s Turnkey Dossier SLA
          </span>
        </div>

        {/* Grand Headline & Narrative Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Kinetic Typography Headline & Value Prop */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <KineticRotatingHeadline />
            </div>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
              Autonomous robots pass simulation in idealized conditions, but fail catastrophically in dirty factories, slick mines, and blinding glare—costing industrial operators{' '}
              <strong className="text-white font-semibold underline decoration-rose-500/80 decoration-2 underline-offset-4">
                $50,000/hour in unplanned line stoppages
              </strong>.
            </p>

            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
              Diffraction ingests raw black-box telemetry (<code className="text-cyan-300 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40 mono text-xs">.mcap</code> / ROS 2 bags), runs{' '}
              <strong className="text-slate-200">150+ parallel generative physics stress-sweeps</strong> in the cloud, and synthesizes{' '}
              <strong className="text-slate-200">turnkey ROS 2 & PX4 safety controller patches</strong> with cryptographically signed ISO compliance dossiers in 30 seconds.
            </p>

            {/* CTA Group */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onLaunchConsole()}
                className="min-h-[48px] px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 active:scale-[0.98] text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center space-x-2.5 cursor-pointer group"
              >
                <Zap className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                <span>Launch Interactive Verification App</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onExploreStory}
                className="min-h-[48px] px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 text-sm font-semibold border border-white/[0.12] transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <span>Read 4-Act Storyline</span>
                <span className="text-slate-500">↓</span>
              </button>

              <button
                type="button"
                onClick={onOpenPricing}
                className="min-h-[48px] px-4 py-3 text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>$15k Production Pilot SOW →</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Interactive Physics Hazard Simulator Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-[#111625] to-[#0d121e] border border-white/[0.12] p-6 shadow-2xl card-glow-blue space-y-5">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-wide uppercase mono">
                      Live Physics Stress Simulator
                    </h3>
                    <p className="text-[10px] text-slate-400">Real-time stopping barrier function</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-bold mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  LIVE INTERACTIVE
                </span>
              </div>

              {/* Robot Architecture Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-300">Select Architecture:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRobot('amr')}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold mono flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                      selectedRobot === 'amr'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-400'
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>AMR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRobot('humanoid')}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold mono flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                      selectedRobot === 'humanoid'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-400'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Humanoid</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRobot('hauler')}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold mono flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                      selectedRobot === 'hauler'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-400'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Hauler</span>
                  </button>
                </div>
              </div>

              {/* Slider 1: Surface Friction */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Surface Friction (μ):</span>
                  <span className="mono font-bold text-cyan-400">
                    μ = {friction.toFixed(2)}{' '}
                    <span className="text-[10px] text-slate-500 font-normal">
                      {friction < 0.25 ? '(Spilled Coolant)' : friction < 0.5 ? '(Wet Epoxy)' : '(Dry Concrete)'}
                    </span>
                  </span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.85"
                  step="0.01"
                  value={friction}
                  onChange={(e) => setFriction(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mono">
                  <span>0.10 (Ice/Oil)</span>
                  <span>0.40 (Wet)</span>
                  <span>0.85 (Dry)</span>
                </div>
              </div>

              {/* Slider 2: Incline Grade */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Incline Slope Grade:</span>
                  <span className="mono font-bold text-amber-400">{slope}% Incline</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={slope}
                  onChange={(e) => setSlope(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Reactive Computed Telemetry Box */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.08] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Calculated Stopping Distance:</span>
                  <span className={`font-mono font-bold ${isViolatingIso ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {stoppingDist} m
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Skid / Tipping Risk:</span>
                  <span className="font-mono font-bold text-amber-400">{skidRiskPercent}%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">ISO Regulatory Status:</span>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      isViolatingIso
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {isViolatingIso ? 'NON-COMPLIANT (BREACH)' : 'COMPLIANT'}
                  </span>
                </div>
              </div>

              {/* Instant Action CTA */}
              <button
                type="button"
                onClick={() => onLaunchConsole(scenarioKeyMap[selectedRobot])}
                className="w-full py-2.5 px-4 rounded-xl bg-white/[0.08] hover:bg-blue-600 text-white font-semibold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-xs border border-white/[0.1] hover:border-transparent group"
              >
                <span>Audit This Scenario in 3D Twin Viewport</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Key Pillar Metric Badges */}
        <div className="pt-8 border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-blue-500/30 transition-all">
            <div className="flex items-center space-x-2 text-blue-400 mb-1.5">
              <Clock className="w-4 h-4" />
              <span className="text-[11px] font-bold mono uppercase tracking-wider text-slate-400">Turnkey SLA</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              30 Sec
            </div>
            <div className="text-slate-400 text-xs mt-1">
              Incident log to signed ISO dossier
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-cyan-500/30 transition-all">
            <div className="flex items-center space-x-2 text-cyan-400 mb-1.5">
              <Activity className="w-4 h-4" />
              <span className="text-[11px] font-bold mono uppercase tracking-wider text-slate-400">Adversarial Sweep</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono tracking-tight">
              150+ Runs
            </div>
            <div className="text-slate-400 text-xs mt-1">
              Parallel cloud physics edge cases
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-emerald-500/30 transition-all">
            <div className="flex items-center space-x-2 text-emerald-400 mb-1.5">
              <Layers className="w-4 h-4" />
              <span className="text-[11px] font-bold mono uppercase tracking-wider text-slate-400">Architectures</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono tracking-tight">
              5 Modalities
            </div>
            <div className="text-slate-400 text-xs mt-1">
              Humanoid, AMR, Arm, Hauler, Rover
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-amber-500/30 transition-all">
            <div className="flex items-center space-x-2 text-amber-400 mb-1.5">
              <FileCode className="w-4 h-4" />
              <span className="text-[11px] font-bold mono uppercase tracking-wider text-slate-400">Zero Lock-In</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight whitespace-nowrap">
              ROS 2 &amp; PX4
            </div>
            <div className="text-slate-400 text-xs mt-1">
              Drop-in YAML safety patches
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
