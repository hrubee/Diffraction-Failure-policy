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
    <section className="relative pt-8 pb-16 overflow-hidden" aria-label="Diffraction Physical AI Hero">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Badges & Live Status */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#0a1426] border border-blue-500/40 text-xs text-blue-300">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="font-semibold tracking-wide uppercase text-[10px] font-mono">
              PHYSICAL AI AUTONOMY SHIELD
            </span>
          </div>

          <span className="text-slate-700 hidden sm:inline">•</span>

          <span className="inline-flex items-center px-3 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono">
            ISO 3691-4 • ISO 13482 • ISO 17757 • ISO 10218
          </span>

          <span className="text-slate-700 hidden md:inline">•</span>

          <span className="hidden md:inline-flex px-3 py-1 rounded bg-[#201704] border border-yellow-400 text-yellow-300 text-xs font-mono font-bold">
            30s Turnkey Dossier SLA
          </span>
        </div>

        {/* Grand Headline & Narrative Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Kinetic Typography Headline & Value Prop */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-4">
              <KineticRotatingHeadline />
            </div>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-body max-w-2xl">
              Autonomous robots pass simulation in idealized conditions, but fail catastrophically in dirty factories, slick mines, and blinding glare—costing industrial operators{' '}
              <strong className="text-orange-400 font-semibold underline decoration-orange-500/80 decoration-2 underline-offset-4">
                $50,000/hour in unplanned line stoppages
              </strong>.
            </p>

            <p className="text-sm text-slate-400 leading-relaxed font-body max-w-2xl">
              Diffraction ingests raw black-box telemetry (<code className="text-blue-300 bg-[#0f172a] px-1.5 py-0.5 rounded border border-blue-500/30 font-mono text-xs">.mcap</code> / ROS 2 bags), runs{' '}
              <strong className="text-slate-100">150+ parallel generative physics stress-sweeps</strong> in the cloud, and synthesizes{' '}
              <strong className="text-slate-100">turnkey ROS 2 & PX4 safety controller patches</strong> with cryptographically signed ISO compliance dossiers in 30 seconds.
            </p>

            {/* CTA Group */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                type="button"
                onClick={() => onLaunchConsole()}
                className="min-h-[48px] px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-bold shadow-md transition-all flex items-center justify-center space-x-2.5 cursor-pointer group"
              >
                <Zap className="w-4 h-4 fill-current text-yellow-300 group-hover:scale-110 transition-transform" />
                <span>Launch Interactive Verification App</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onExploreStory}
                className="min-h-[48px] px-5 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Read 4-Act Storyline</span>
                <span className="text-slate-400">↓</span>
              </button>

              <button
                type="button"
                onClick={onOpenPricing}
                className="min-h-[44px] px-3 py-2 text-yellow-400 hover:text-yellow-300 text-xs sm:text-sm font-bold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>$15k Production Pilot SOW →</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Interactive Physics Hazard Simulator Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-[#0e1320] border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-md bg-blue-950 text-blue-400 border border-blue-500/40">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-wide uppercase font-headline">
                      Live Physics Stress Simulator
                    </h3>
                    <p className="text-[10px] text-slate-400 font-body">Real-time stopping barrier function</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-950 text-blue-300 border border-blue-500/40">
                  LIVE SIMULATOR
                </span>
              </div>

              {/* Robot Architecture Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">Select Architecture:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRobot('amr')}
                    className={`py-2 px-2 rounded-lg text-xs font-bold font-mono flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                      selectedRobot === 'amr'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400'
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>AMR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRobot('humanoid')}
                    className={`py-2 px-2 rounded-lg text-xs font-bold font-mono flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                      selectedRobot === 'humanoid'
                        ? 'bg-orange-600 text-white shadow-sm'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Humanoid</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRobot('hauler')}
                    className={`py-2 px-2 rounded-lg text-xs font-bold font-mono flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                      selectedRobot === 'hauler'
                        ? 'bg-yellow-400 text-slate-950 shadow-sm'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400'
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
                  <span className="text-slate-300 font-medium font-body">Surface Friction (μ):</span>
                  <span className="font-mono font-bold text-blue-400">
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
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0.10 (Ice/Oil)</span>
                  <span>0.40 (Wet)</span>
                  <span>0.85 (Dry)</span>
                </div>
              </div>

              {/* Slider 2: Incline Grade */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium font-body">Incline Slope Grade:</span>
                  <span className="font-mono font-bold text-orange-400">{slope}% Incline</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={slope}
                  onChange={(e) => setSlope(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              {/* Reactive Computed Telemetry Box */}
              <div className="p-3.5 rounded-lg bg-[#07090e] border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Calculated Stopping Distance:</span>
                  <span className={`font-mono font-bold ${isViolatingIso ? 'text-orange-400' : 'text-blue-400'}`}>
                    {stoppingDist} m
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Skid / Tipping Risk:</span>
                  <span className="font-mono font-bold text-yellow-400">{skidRiskPercent}%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">ISO Regulatory Status:</span>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      isViolatingIso
                        ? 'bg-[#2a0e0a] text-orange-300 border border-orange-500/50'
                        : 'bg-[#091a10] text-emerald-300 border border-emerald-500/50'
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
                className="w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-blue-600 text-white font-semibold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm border border-slate-700 hover:border-transparent group"
              >
                <span>Audit This Scenario in 3D Twin Viewport</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Key Pillar Metric Badges */}
        <div className="pt-6 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-xl bg-[#0e1320] border border-slate-800 hover:border-blue-500 transition-colors">
            <div className="flex items-center space-x-2 text-blue-400 mb-1.5">
              <Clock className="w-4 h-4" />
              <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-400">Turnkey SLA</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-headline tracking-tight">
              30 Sec
            </div>
            <div className="text-slate-400 text-xs mt-1 font-body">
              Incident log to signed ISO dossier
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-[#0e1320] border border-slate-800 hover:border-orange-500 transition-colors">
            <div className="flex items-center space-x-2 text-orange-400 mb-1.5">
              <Activity className="w-4 h-4" />
              <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-400">Adversarial Sweep</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-orange-400 font-headline tracking-tight">
              150+ Runs
            </div>
            <div className="text-slate-400 text-xs mt-1 font-body">
              Parallel cloud physics edge cases
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-[#0e1320] border border-slate-800 hover:border-yellow-400 transition-colors">
            <div className="flex items-center space-x-2 text-yellow-400 mb-1.5">
              <Layers className="w-4 h-4" />
              <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-400">Architectures</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-yellow-400 font-headline tracking-tight">
              5 Modalities
            </div>
            <div className="text-slate-400 text-xs mt-1 font-body">
              Humanoid, AMR, Arm, Hauler, Rover
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-[#0e1320] border border-slate-800 hover:border-blue-500 transition-colors">
            <div className="flex items-center space-x-2 text-blue-400 mb-1.5">
              <FileCode className="w-4 h-4" />
              <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-400">Zero Lock-In</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-300 font-headline tracking-tight whitespace-nowrap">
              ROS 2 &amp; PX4
            </div>
            <div className="text-slate-400 text-xs mt-1 font-body">
              Drop-in YAML safety patches
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
