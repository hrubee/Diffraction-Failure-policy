/**
 * Presentation Component: Physical AI Runtime Safety & Continuous SysID Landing Hero
 * Powered by Continuous Differentiable Physics (Warp-SysID) and Real-Time CBF-QP Safety Governor.
 * Features interactive module switcher (CBF-QP, Warp-SysID, 4D MAP-Elites, ISO 3691-4 Audit)
 * and direct ROI metrics comparing manual FAE site tuning with Diffraction's automated 14-day pilot.
 *
 * Strict Color Hunt 4-Color Palette: #2FA4D7, #F5E9D8, #3E2C23, #E76F2E (Zero Gradients).
 */

'use client';

import React, { useState } from 'react';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  Activity,
  Cpu,
  Layers,
  Sparkles,
  Camera,
  Radio,
  Eye,
  Database,
  CheckCircle2,
  Server,
  TrendingDown,
  Gauge,
  Lock,
  Compass,
} from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<'business' | 'engineering'>('business');
  const [activeChannel, setActiveChannel] = useState<'cbf_qp' | 'warp_sysid' | 'map_elites' | 'iso_audit'>('cbf_qp');

  return (
    <section className="relative pt-8 pb-16 overflow-hidden" aria-label="Diffraction Physical AI Hero">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Badges & Live Status */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-white border border-[#3E2C23]/20 text-xs text-[#3E2C23] shadow-xs">
            <span className="h-2 w-2 rounded-full bg-[#2FA4D7] animate-pulse" />
            <span className="font-semibold tracking-wide uppercase text-[10px] font-mono">
              AUTOMATED SITE COMMISSIONING • ZERO-COLLISION GUARANTEE
            </span>
          </div>

          <span className="text-[#3E2C23]/40 hidden sm:inline">•</span>

          <span className="inline-flex items-center px-3 py-1 rounded bg-white border border-[#3E2C23]/20 text-[#3E2C23] text-xs font-mono shadow-xs">
            14-Day Deployment SLA • Zero Engineer Travel Cost
          </span>

          <span className="text-[#3E2C23]/40 hidden md:inline">•</span>

          <span className="hidden md:inline-flex px-3 py-1 rounded bg-[#E76F2E] text-white text-xs font-mono font-bold shadow-xs">
            ISO 3691-4 &amp; Insurance Audit Ready
          </span>
        </div>

        {/* Grand Headline & Narrative Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Headline & Value Prop */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#2FA4D7] block">
                For Robotics Founders, Operations Leaders &amp; Warehouse Integrators
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#3E2C23] font-headline tracking-tight leading-[1.12]">
                Stop Robot Crashes &amp; Slipping —{' '}
                <span className="text-[#2FA4D7] underline decoration-[#2FA4D7]/40 decoration-4 underline-offset-4">
                  Deploy in 14 Days.
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-[#3E2C23]/85 leading-relaxed font-body max-w-2xl">
              Every time robots enter a new warehouse, slippery floors cause spin-outs, delays, and{' '}
              <strong className="text-[#E76F2E] font-bold underline decoration-[#E76F2E]/80 decoration-2 underline-offset-4">
                $250,000 in engineer travel costs
              </strong>. 
              Diffraction automatically diagnoses floor traction from a 5-second data drop and installs an intelligent safety guard on your robots—guaranteeing <strong>zero collisions</strong> and instant insurance signoff.
            </p>

            <p className="text-sm text-[#3E2C23]/80 leading-relaxed font-body max-w-2xl">
              <strong>Zero code rewrites. Zero hardware modifications.</strong> Plug our software into your existing fleet to compress 8-week site deployments into 14 days with full money-back safety assurance.
            </p>

            {/* Micro ROI Stat Callout */}
            <div className="grid grid-cols-2 gap-3 max-w-lg p-3 rounded-xl bg-white border border-[#3E2C23]/20 font-mono text-xs">
              <div>
                <span className="text-[#3E2C23]/50 block text-[10px]">THE STATUS QUO</span>
                <span className="text-rose-700 font-bold">$150k-$300k / site • 8-12 weeks • 70% stall</span>
              </div>
              <div>
                <span className="text-[#3E2C23]/50 block text-[10px]">WITH DIFFRACTION</span>
                <span className="text-emerald-700 font-bold">$25,000 Fixed Fee • 14 Days • 0 Collisions</span>
              </div>
            </div>

            {/* CTA Group */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                type="button"
                onClick={() => onLaunchConsole()}
                className="min-h-[48px] px-6 py-3 rounded-lg bg-[#2FA4D7] hover:bg-[#248ab8] text-white text-sm font-bold shadow-md transition-all flex items-center justify-center space-x-2.5 cursor-pointer group"
              >
                <Zap className="w-4 h-4 fill-current text-white group-hover:scale-110 transition-transform" />
                <span>Request 14-Day Pilot ($25k)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const target = document.getElementById('capabilities');
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }}
                className="min-h-[48px] px-5 py-3 rounded-lg bg-white hover:bg-[#FAF4EB] text-[#3E2C23] text-sm font-semibold border border-[#3E2C23]/25 transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
              >
                <Cpu className="w-4 h-4 text-[#2FA4D7]" />
                <span>See Robotics Engineering Specs →</span>
              </button>
            </div>
          </div>

          {/* Right Column: Dual-Mode Interactive Preview Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-[#3E2C23] text-[#F5E9D8] border-2 border-[#3E2C23] p-5 sm:p-6 shadow-2xl space-y-4">
              {/* Card Header with View Mode Toggle */}
              <div className="flex items-center justify-between border-b border-[#F5E9D8]/15 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-md bg-[#2FA4D7] text-white">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#F5E9D8] tracking-wide uppercase font-headline">
                      {viewMode === 'business' ? 'Executive Safety Overview' : 'Robotics Control Telemetry'}
                    </h3>
                    <p className="text-[10px] text-[#F5E9D8]/70 font-mono">
                      {viewMode === 'business' ? 'Plain English Decision Summary' : 'Sub-millisecond Active-Set QP'}
                    </p>
                  </div>
                </div>

                {/* Perspective Switcher */}
                <div className="inline-flex p-0.5 rounded-lg bg-[#2A1D17] border border-[#F5E9D8]/15 text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => setViewMode('business')}
                    className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                      viewMode === 'business' ? 'bg-[#2FA4D7] text-white font-bold' : 'text-[#F5E9D8]/60 hover:text-white'
                    }`}
                  >
                    Business
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('engineering')}
                    className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                      viewMode === 'engineering' ? 'bg-[#E76F2E] text-white font-bold' : 'text-[#F5E9D8]/60 hover:text-white'
                    }`}
                  >
                    Engineering
                  </button>
                </div>
              </div>

              {/* View Mode 1: Business Decision Maker View */}
              {viewMode === 'business' ? (
                <div className="space-y-4 font-body">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#2FA4D7] font-bold">INCIDENT TEST CASE #042</span>
                      <span className="text-emerald-400 font-bold">100% COLLISION PREVENTED</span>
                    </div>
                    <div className="text-[#F5E9D8]/90 leading-relaxed text-xs">
                      <strong>Scenario:</strong> 500kg autonomous robot entered warehouse loading dock with unexpected surface moisture and forklift tire marks.
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between items-center bg-[#2A1D17] p-2 rounded border border-white/5">
                      <span className="text-[#F5E9D8]/60">Without Diffraction:</span>
                      <span className="text-rose-400 font-bold">Skids past safety zone • Crushes wall</span>
                    </div>
                    <div className="flex justify-between items-center bg-emerald-950/40 p-2 rounded border border-emerald-500/30">
                      <span className="text-emerald-200">With Diffraction:</span>
                      <span className="text-emerald-300 font-bold">Brakes smoothly • 38.9 cm safe stop</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono bg-white/5 p-2.5 rounded-lg border border-white/10">
                    <div>
                      <span className="text-[#F5E9D8]/50 text-[10px] block">COMMISSIONING</span>
                      <span className="font-bold text-white">14 Days</span>
                    </div>
                    <div>
                      <span className="text-[#F5E9D8]/50 text-[10px] block">CRASHES</span>
                      <span className="font-bold text-[#2FA4D7]">ZERO</span>
                    </div>
                    <div>
                      <span className="text-[#F5E9D8]/50 text-[10px] block">INSURANCE</span>
                      <span className="font-bold text-emerald-400">PASSED</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* View Mode 2: Robotics Engineer Deep-Dive View */
                <div className="space-y-3">
                  {/* Channel Selector Pills for Engineers */}
                  <div className="grid grid-cols-4 gap-1 bg-[#2A1D17] p-1 rounded-lg border border-[#F5E9D8]/10 text-[11px] font-mono">
                    <button
                      type="button"
                      onClick={() => setActiveChannel('cbf_qp')}
                      className={`py-1 rounded font-bold transition-colors cursor-pointer text-center ${
                        activeChannel === 'cbf_qp' ? 'bg-[#E76F2E] text-white' : 'text-[#F5E9D8]/60 hover:text-white'
                      }`}
                    >
                      CBF-QP
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveChannel('warp_sysid')}
                      className={`py-1 rounded font-bold transition-colors cursor-pointer text-center ${
                        activeChannel === 'warp_sysid' ? 'bg-[#E76F2E] text-white' : 'text-[#F5E9D8]/60 hover:text-white'
                      }`}
                    >
                      Warp-SysID
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveChannel('map_elites')}
                      className={`py-1 rounded font-bold transition-colors cursor-pointer text-center ${
                        activeChannel === 'map_elites' ? 'bg-[#E76F2E] text-white' : 'text-[#F5E9D8]/60 hover:text-white'
                      }`}
                    >
                      4D MAP
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveChannel('iso_audit')}
                      className={`py-1 rounded font-bold transition-colors cursor-pointer text-center ${
                        activeChannel === 'iso_audit' ? 'bg-[#E76F2E] text-white' : 'text-[#F5E9D8]/60 hover:text-white'
                      }`}
                    >
                      ISO PL-d
                    </button>
                  </div>

                  {/* Engineering Viewport Frame */}
                  <div className="relative aspect-4/3 bg-[#1A120E] rounded-xl overflow-hidden border border-white/10 flex items-center justify-center p-3 font-mono text-xs">
                    {activeChannel === 'cbf_qp' && (
                      <div className="w-full h-full flex flex-col justify-between">
                        <div className="flex justify-between items-center text-[10px] text-[#2FA4D7] border-b border-white/10 pb-1">
                          <span>ACTIVE-SET QUADRATIC PROGRAM</span>
                          <span className="text-emerald-400">LATENCY: 0.062 ms (500 Hz)</span>
                        </div>
                        <div className="space-y-1 my-auto text-[11px]">
                          <div className="flex justify-between text-[#F5E9D8]/70">
                            <span>Commanded u_des:</span>
                            <span className="text-rose-400 font-bold">[1.60 m/s, 0.0 rad/s]</span>
                          </div>
                          <div className="flex justify-between text-[#F5E9D8]/70">
                            <span>Traction Barrier (h1):</span>
                            <span className="text-amber-300">μ = 0.22 (Braking limit: μg)</span>
                          </div>
                          <div className="flex justify-between text-[#F5E9D8]/70">
                            <span>Forward Invariance:</span>
                            <span className="text-emerald-300">h(x) ≥ 0 strictly satisfied</span>
                          </div>
                          <div className="p-1.5 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-center font-bold">
                            OUTPUT u_safe: [0.01 m/s, 0.0 rad/s] (0 Collisions)
                          </div>
                        </div>
                        <div className="text-[10px] text-[#F5E9D8]/50 flex justify-between pt-1 border-t border-white/10">
                          <span>Safety Margin: 0.35m</span>
                          <span>Final Clearance: 0.389m</span>
                        </div>
                      </div>
                    )}

                    {activeChannel === 'warp_sysid' && (
                      <div className="w-full h-full flex flex-col justify-between">
                        <div className="flex justify-between items-center text-[10px] text-[#2FA4D7] border-b border-white/10 pb-1">
                          <span>UNROLLED RK4 INVERSE DYNAMICS</span>
                          <span className="text-emerald-400">R² = 0.9967 (CONVERGED)</span>
                        </div>
                        <div className="space-y-1 my-auto text-[11px]">
                          <div className="flex justify-between text-[#F5E9D8]/70">
                            <span>Loss Function:</span>
                            <span className="text-white">L = ||x_sim - x_obs||² + ||v||²</span>
                          </div>
                          <div className="flex justify-between text-[#F5E9D8]/70">
                            <span>Recovered Kinetic μ:</span>
                            <span className="text-emerald-400 font-bold">0.3204 (True: 0.3200)</span>
                          </div>
                          <div className="flex justify-between text-[#F5E9D8]/70">
                            <span>Actuator Lag (τ):</span>
                            <span className="text-amber-300 font-bold">45.2 ms (True: 45.0 ms)</span>
                          </div>
                          <div className="p-1.5 rounded bg-blue-950/40 border border-blue-500/40 text-blue-300 text-center font-bold">
                            GRADIENT SOLVE: 25 Adam + 5 L-BFGS (2.8s total)
                          </div>
                        </div>
                        <div className="text-[10px] text-[#F5E9D8]/50 flex justify-between pt-1 border-t border-white/10">
                          <span>Autodiff: PyTorch BPTT</span>
                          <span>Noise Tolerance: σ = 0.005</span>
                        </div>
                      </div>
                    )}

                    {activeChannel === 'map_elites' && (
                      <div className="w-full h-full flex flex-col justify-between">
                        <div className="flex justify-between items-center text-[10px] text-[#2FA4D7] border-b border-white/10 pb-1">
                          <span>4D BEHAVIORAL ARCHIVE SEARCH</span>
                          <span className="text-amber-400">7,200 DISCRETIZED CELLS</span>
                        </div>
                        <div className="space-y-1 my-auto text-[11px]">
                          <div className="flex justify-between text-[#F5E9D8]/70">
                            <span>Search Space:</span>
                            <span className="text-white">Friction × Glare × Lag × Mass</span>
                          </div>
                          <div className="flex justify-between text-[#F5E9D8]/70">
                            <span>Pareto Boundary:</span>
                            <span className="text-rose-400 font-bold">μ &lt; 0.23 @ ω &gt; 1.2 rad/s</span>
                          </div>
                          <div className="p-1.5 rounded bg-amber-950/40 border border-amber-500/40 text-amber-300 text-center font-bold">
                            FAILURE MINED: Rollover risk with &gt; 180kg payload
                          </div>
                        </div>
                        <div className="text-[10px] text-[#F5E9D8]/50 flex justify-between pt-1 border-t border-white/10">
                          <span>Evaluations: 60 rollouts</span>
                          <span>Cliff Score: 0.94</span>
                        </div>
                      </div>
                    )}

                    {activeChannel === 'iso_audit' && (
                      <div className="w-full h-full flex flex-col justify-between">
                        <div className="flex justify-between items-center text-[10px] text-[#2FA4D7] border-b border-white/10 pb-1">
                          <span>REGULATORY ORACLE EVALUATION</span>
                          <span className="text-emerald-400">PASSED: ISO 13849 PL-d</span>
                        </div>
                        <div className="space-y-1 my-auto text-[11px]">
                          <div className="flex justify-between text-[#F5E9D8]/70">
                            <span>ISO 3691-4:2023 Cl. 5.2:</span>
                            <span className="text-emerald-400 font-bold">COMPLIANT (Stopping Distance)</span>
                          </div>
                          <div className="flex justify-between text-[#F5E9D8]/70">
                            <span>ANSI/RIA R15.08 Part 2:</span>
                            <span className="text-emerald-400 font-bold">VERIFIED (Traction Bounds)</span>
                          </div>
                          <div className="p-1.5 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-center font-bold">
                            FORMAL DOSSIER: Ready for Safety &amp; Insurance Audit
                          </div>
                        </div>
                        <div className="text-[10px] text-[#F5E9D8]/50 flex justify-between pt-1 border-t border-white/10">
                          <span>Audit File: 01_AUDIT.html</span>
                          <span>Format: Machine-Readable JSON</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
