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
  const [activeChannel, setActiveChannel] = useState<'cbf_qp' | 'warp_sysid' | 'map_elites' | 'iso_audit'>('cbf_qp');

  return (
    <section className="relative pt-8 pb-16 overflow-hidden" aria-label="Diffraction Physical AI Hero">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Badges & Live Status */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-white border border-[#3E2C23]/20 text-xs text-[#3E2C23] shadow-xs">
            <span className="h-2 w-2 rounded-full bg-[#2FA4D7] animate-pulse" />
            <span className="font-semibold tracking-wide uppercase text-[10px] font-mono">
              RUNTIME SAFETY GOVERNOR • CONTINUOUS DIFFERENTIABLE SYSID
            </span>
          </div>

          <span className="text-[#3E2C23]/40 hidden sm:inline">•</span>

          <span className="inline-flex items-center px-3 py-1 rounded bg-white border border-[#3E2C23]/20 text-[#3E2C23] text-xs font-mono shadow-xs">
            ISO 3691-4:2023 • ANSI/RIA R15.08 • Sub-Millisecond Active-Set QP • Warp-SysID RK4
          </span>

          <span className="text-[#3E2C23]/40 hidden md:inline">•</span>

          <span className="hidden md:inline-flex px-3 py-1 rounded bg-[#E76F2E] text-white text-xs font-mono font-bold shadow-xs">
            14-Day Pilot SLA • Zero Travel Cost
          </span>
        </div>

        {/* Grand Headline & Narrative Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Headline & Value Prop */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#2FA4D7] block">
                The Runtime Safety &amp; Commissioning Platform for AMRs
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#3E2C23] font-headline tracking-tight leading-[1.12]">
                Eliminate AMR Wheel Slip &amp; Pilot Purgatory —{' '}
                <span className="text-[#2FA4D7] underline decoration-[#2FA4D7]/40 decoration-4 underline-offset-4">
                  Certified in 14 Days.
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-[#3E2C23]/85 leading-relaxed font-body max-w-2xl">
              Robotics OEMs spend{' '}
              <strong className="text-[#E76F2E] font-bold underline decoration-[#E76F2E]/80 decoration-2 underline-offset-4">
                8 to 12 weeks
              </strong>{' '}
              and $300,000 flying field application engineers (FAEs) to manually tune robots on low-friction warehouse floors. Diffraction recovers ground-truth friction (μ) and motor delay from a 5-second telemetry drop and flashes a real-time active-set CBF-QP safety governor (&lt; 0.1ms solve) to guarantee zero collisions.
            </p>

            <p className="text-sm text-[#3E2C23]/80 leading-relaxed font-body max-w-2xl">
              From unrolled continuous-time inverse physics (Warp-SysID RK4), to 4D MAP-Elites failure boundary discovery, to automated ISO 3691-4 and ANSI/RIA R15.08 compliance dossiers for insurance underwriters—packaged into a turnkey 25-asset delivery in under 10 seconds.
            </p>

            {/* Micro ROI Stat Callout */}
            <div className="grid grid-cols-2 gap-3 max-w-lg p-3 rounded-xl bg-white border border-[#3E2C23]/20 font-mono text-xs">
              <div>
                <span className="text-[#3E2C23]/50 block text-[10px]">MANUAL FAE COMMISSIONING</span>
                <span className="text-rose-700 font-bold">$150k-$300k / site • 8-12 weeks • 70% stall</span>
              </div>
              <div>
                <span className="text-[#3E2C23]/50 block text-[10px]">DIFFRACTION 14-DAY PILOT</span>
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
                <span>Scope 14-Day Pilot ($25k)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.hash = '#catalog';
                }}
                className="min-h-[48px] px-5 py-3 rounded-lg bg-white hover:bg-[#FAF4EB] text-[#3E2C23] text-sm font-semibold border border-[#3E2C23]/25 transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
              >
                <Database className="w-4 h-4 text-[#2FA4D7]" />
                <span>Inspect Turnkey Package</span>
              </button>

              <button
                type="button"
                onClick={onOpenPricing}
                className="min-h-[44px] px-3 py-2 text-[#E76F2E] hover:text-[#d35b1d] text-xs sm:text-sm font-bold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#E76F2E]" />
                <span>Pilot Details →</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Multimodal Stream Preview Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-[#3E2C23] text-[#F5E9D8] border-2 border-[#3E2C23] p-5 sm:p-6 shadow-2xl space-y-4">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-[#F5E9D8]/15 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-md bg-[#2FA4D7] text-white">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#F5E9D8] tracking-wide uppercase font-headline">
                      Runtime Verification Engine
                    </h3>
                    <p className="text-[10px] text-[#F5E9D8]/70 font-mono">Warp-SysID &amp; CBF-QP Governor</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#E76F2E] text-white">
                  &lt; 0.1ms Edge Solve
                </span>
              </div>

              {/* Channel Selector Pills */}
              <div className="grid grid-cols-4 gap-1 bg-[#2A1D17] p-1 rounded-lg border border-[#F5E9D8]/10 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setActiveChannel('cbf_qp')}
                  className={`py-1.5 rounded font-bold transition-colors cursor-pointer text-center ${
                    activeChannel === 'cbf_qp' ? 'bg-[#2FA4D7] text-white' : 'text-[#F5E9D8]/60 hover:text-white'
                  }`}
                >
                  CBF-QP
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChannel('warp_sysid')}
                  className={`py-1.5 rounded font-bold transition-colors cursor-pointer text-center ${
                    activeChannel === 'warp_sysid' ? 'bg-[#2FA4D7] text-white' : 'text-[#F5E9D8]/60 hover:text-white'
                  }`}
                >
                  Warp-SysID
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChannel('map_elites')}
                  className={`py-1.5 rounded font-bold transition-colors cursor-pointer text-center ${
                    activeChannel === 'map_elites' ? 'bg-[#2FA4D7] text-white' : 'text-[#F5E9D8]/60 hover:text-white'
                  }`}
                >
                  4D Search
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChannel('iso_audit')}
                  className={`py-1.5 rounded font-bold transition-colors cursor-pointer text-center ${
                    activeChannel === 'iso_audit' ? 'bg-[#2FA4D7] text-white' : 'text-[#F5E9D8]/60 hover:text-white'
                  }`}
                >
                  ISO Audit
                </button>
              </div>

              {/* Viewport Frame */}
              <div className="relative aspect-4/3 bg-[#1A120E] rounded-xl overflow-hidden border border-white/10 flex items-center justify-center p-4">
                {activeChannel === 'cbf_qp' && (
                  <div className="w-full h-full flex flex-col justify-between font-mono text-xs">
                    <div className="flex justify-between items-center text-[10px] text-[#2FA4D7] border-b border-white/10 pb-1">
                      <span>ACTIVE-SET QUADRATIC PROGRAM</span>
                      <span className="text-emerald-400">STATUS: SOLVED (0.062 ms)</span>
                    </div>
                    <div className="space-y-1.5 my-auto text-[11px]">
                      <div className="flex justify-between text-[#F5E9D8]/70">
                        <span>Commanded Velocity:</span>
                        <span className="text-rose-400 font-bold">1.60 m/s (OVER LIMIT)</span>
                      </div>
                      <div className="flex justify-between text-[#F5E9D8]/70">
                        <span>Physical Floor μ (Epoxy):</span>
                        <span className="text-amber-300 font-bold">μ = 0.22 (SLICK)</span>
                      </div>
                      <div className="flex justify-between text-[#F5E9D8]/70">
                        <span>Distance to Obstacle:</span>
                        <span className="text-white">2.50 m → 0.389 m buffer</span>
                      </div>
                      <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-bold text-center">
                        GOVERNOR INTERVENTION: 1.60 m/s → 0.01 m/s (0 COLLISIONS)
                      </div>
                    </div>
                    <div className="text-[10px] text-[#F5E9D8]/50 flex justify-between pt-1 border-t border-white/10">
                      <span>Control Frequency: 500 Hz</span>
                      <span>Margin: 0.35m</span>
                    </div>
                  </div>
                )}

                {activeChannel === 'warp_sysid' && (
                  <div className="w-full h-full flex flex-col justify-between font-mono text-xs">
                    <div className="flex justify-between items-center text-[10px] text-[#2FA4D7] border-b border-white/10 pb-1">
                      <span>UNROLLED RK4 INVERSE PHYSICS</span>
                      <span className="text-emerald-400">R² = 0.9967 (CONVERGED)</span>
                    </div>
                    <div className="space-y-1.5 my-auto text-[11px]">
                      <div className="flex justify-between text-[#F5E9D8]/70">
                        <span>Observed Slip Trajectory:</span>
                        <span className="text-white">5.0s Blackbox Window</span>
                      </div>
                      <div className="flex justify-between text-[#F5E9D8]/70">
                        <span>Recovered Kinetic μ:</span>
                        <span className="text-emerald-400 font-bold">0.3204 ± 0.008 (True: 0.320)</span>
                      </div>
                      <div className="flex justify-between text-[#F5E9D8]/70">
                        <span>Actuator Latency (τ):</span>
                        <span className="text-amber-300 font-bold">45.2 ms (True: 45.0 ms)</span>
                      </div>
                      <div className="p-2 rounded bg-blue-950/40 border border-blue-500/40 text-blue-300 font-bold text-center">
                        AUTODIFF OPTIMIZER: 25 ADAM + 5 L-BFGS STEPS (2.8s)
                      </div>
                    </div>
                    <div className="text-[10px] text-[#F5E9D8]/50 flex justify-between pt-1 border-t border-white/10">
                      <span>Loss Gradient: ∂L/∂μ</span>
                      <span>Sensor Noise: σ=0.005</span>
                    </div>
                  </div>
                )}

                {activeChannel === 'map_elites' && (
                  <div className="w-full h-full flex flex-col justify-between font-mono text-xs">
                    <div className="flex justify-between items-center text-[10px] text-[#2FA4D7] border-b border-white/10 pb-1">
                      <span>4D BEHAVIORAL ARCHIVE ILLUMINATION</span>
                      <span className="text-amber-400">60 ROLLOUTS MINED</span>
                    </div>
                    <div className="space-y-1.5 my-auto text-[11px]">
                      <div className="flex justify-between text-[#F5E9D8]/70">
                        <span>Pareto Failure Frontier:</span>
                        <span className="text-rose-400 font-bold">μ &lt; 0.23 @ ω &gt; 1.2 rad/s</span>
                      </div>
                      <div className="flex justify-between text-[#F5E9D8]/70">
                        <span>Evaluated Niches:</span>
                        <span className="text-white">Friction × Glare × Lag × Mass</span>
                      </div>
                      <div className="flex justify-between text-[#F5E9D8]/70">
                        <span>Archive Capacity:</span>
                        <span className="text-white">7,200 Discretized Cells</span>
                      </div>
                      <div className="p-2 rounded bg-amber-950/40 border border-amber-500/40 text-amber-300 font-bold text-center">
                        FRONTIER BOUND: Centripetal Clamping Required &gt; 180kg
                      </div>
                    </div>
                    <div className="text-[10px] text-[#F5E9D8]/50 flex justify-between pt-1 border-t border-white/10">
                      <span>Quality-Diversity Search</span>
                      <span>Pareto Cliff Score: 0.94</span>
                    </div>
                  </div>
                )}

                {activeChannel === 'iso_audit' && (
                  <div className="w-full h-full flex flex-col justify-between font-mono text-xs">
                    <div className="flex justify-between items-center text-[10px] text-[#2FA4D7] border-b border-white/10 pb-1">
                      <span>REGULATORY COMPLIANCE ORACLE</span>
                      <span className="text-emerald-400">PASSED: ISO 13849 PL-d</span>
                    </div>
                    <div className="space-y-1.5 my-auto text-[11px]">
                      <div className="flex justify-between text-[#F5E9D8]/70">
                        <span>ISO 3691-4:2023 Cl. 5.2:</span>
                        <span className="text-emerald-400 font-bold">COMPLIANT (Stopping Distance)</span>
                      </div>
                      <div className="flex justify-between text-[#F5E9D8]/70">
                        <span>ANSI/RIA R15.08 Part 2:</span>
                        <span className="text-emerald-400 font-bold">VERIFIED (Traction Limits)</span>
                      </div>
                      <div className="flex justify-between text-[#F5E9D8]/70">
                        <span>Forward Invariance:</span>
                        <span className="text-emerald-400 font-bold">h(x) ≥ 0 ∀ t ∈ [0, T]</span>
                      </div>
                      <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-bold text-center">
                        INSURANCE DOSSIER: Ready for Zurich / Munich Re
                      </div>
                    </div>
                    <div className="text-[10px] text-[#F5E9D8]/50 flex justify-between pt-1 border-t border-white/10">
                      <span>Audit Hash: SHA-256</span>
                      <span>Deliverable: 01_AUDIT.html</span>
                    </div>
                  </div>
                )}

                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#F5E9D8]">
                  Mathematical Watchdog Active
                </div>
              </div>

              {/* Live Sensor Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono bg-white/5 p-2.5 rounded-lg border border-white/10">
                <div>
                  <span className="text-[#F5E9D8]/50 text-[10px] block">QP LATENCY</span>
                  <span className="font-bold text-white">0.062 ms</span>
                </div>
                <div>
                  <span className="text-[#F5E9D8]/50 text-[10px] block">COLLISIONS</span>
                  <span className="font-bold text-[#2FA4D7]">0 / 1,000</span>
                </div>
                <div>
                  <span className="text-[#F5E9D8]/50 text-[10px] block">PACKAGE TIME</span>
                  <span className="font-bold text-[#E76F2E]">7.16s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
