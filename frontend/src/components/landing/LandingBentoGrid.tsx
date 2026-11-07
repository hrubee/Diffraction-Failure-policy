/**
 * Presentation Component: Platform Capabilities Bento Grid
 * High-density modern showcase of the 6 unfair advantages of the Diffraction engine.
 */

'use client';

import React from 'react';
import {
  Inbox,
  Cpu,
  FileCode,
  ShieldCheck,
  Zap,
  TrendingDown,
  ArrowRight,
  Terminal,
  Activity,
  Layers,
} from 'lucide-react';

interface LandingBentoGridProps {
  readonly onLaunchConsole: () => void;
  readonly onOpenGovernor: () => void;
  readonly onOpenTelematics: () => void;
}

export const LandingBentoGrid: React.FC<LandingBentoGridProps> = ({
  onLaunchConsole,
  onOpenGovernor,
  onOpenTelematics,
}) => {
  return (
    <section id="capabilities" className="py-20 relative" aria-label="Diffraction Platform Capabilities">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-xs text-cyan-400 mono">
            <Layers className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Full-Stack Autonomous Safety Infrastructure
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Engineered for physical reality.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
              Not idealized lab simulations.
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Every layer of Diffraction is designed to close the simulation-to-reality gap in minutes, 
            turning unexpected robot crashes into hardened ROS 2 safety policies.
          </p>
        </div>

        {/* The Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: 5-Second Ingestion */}
          <div className="rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.08] hover:border-blue-500/40 p-6 flex flex-col justify-between space-y-6 transition-all hover:shadow-xl">
            <div className="space-y-4">
              <div className="p-3 w-fit rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Inbox className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mono">Pillar 01</span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Instant Black Box Ingestion
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Onboard circular ring buffer captures the exact 5 seconds of wheel velocities, joint torques, and camera frames prior to an E-stop. System Identification (SysID) automatically computes true ground friction (μ).
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] font-mono text-[11px] space-y-1 text-slate-300">
              <div className="text-cyan-400 font-bold"># incident_telemetry.mcap</div>
              <div>Duration: <span className="text-white">5.00s</span> • msgs: <span className="text-white">128</span></div>
              <div className="text-emerald-400">✓ SysID Calculated μ: 0.18 (Spilled Coolant)</div>
            </div>
          </div>

          {/* Card 2: 150+ Generative Physics Sweeps */}
          <div className="rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.08] hover:border-cyan-500/40 p-6 flex flex-col justify-between space-y-6 transition-all hover:shadow-xl">
            <div className="space-y-4">
              <div className="p-3 w-fit rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mono">Pillar 02</span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  150+ Generative Physics Sweeps
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Diffraction spins up 150 parallel cloud simulations sweeping friction (μ = 0.12 - 1.15), incline slope (0 - 15%), solar glare (up to 95k Lux), and latency jitter to pinpoint the exact failure envelope.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] font-mono text-[11px] space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Friction Sweep:</span>
                <span className="text-white font-bold">μ = 0.12 to 1.15</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 h-1.5 w-full" />
              </div>
              <div className="text-emerald-400 text-[10px]">Safe Boundary: μ ≥ 0.33</div>
            </div>
          </div>

          {/* Card 3: Turnkey ROS 2 Remediation */}
          <div className="rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.08] hover:border-emerald-500/40 p-6 flex flex-col justify-between space-y-6 transition-all hover:shadow-xl">
            <div className="space-y-4">
              <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FileCode className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mono">Pillar 03</span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Turnkey ROS 2 &amp; PX4 Code Patches
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Zero proprietary lock-in. Diffraction generates drop-in Nav2 velocity filter YAMLs, impedance damping profiles, and safety zone masks that drop directly into your git repository.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] font-mono text-[10px] space-y-1 text-slate-300">
              <div className="text-emerald-400 font-bold"># speed_filter_mask.yaml</div>
              <div className="text-slate-400">max_forward_vel: <span className="text-white">0.65 # m/s</span></div>
              <div className="text-slate-400">min_decel_rate: <span className="text-white">1.85 # m/s²</span></div>
            </div>
          </div>

          {/* Card 4: Cryptographic ISO Dossier */}
          <div className="rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.08] hover:border-purple-500/40 p-6 flex flex-col justify-between space-y-6 transition-all hover:shadow-xl">
            <div className="space-y-4">
              <div className="p-3 w-fit rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 mono">Pillar 04</span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Cryptographic ISO Due-Diligence
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Automated signed PDF audit reports matching ISO 3691-4, ISO 13482, ISO 17757, and ISO 10218 standards. Satisfies customer safety audits and OSHA compliance in minutes.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/30 text-purple-300 text-xs flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-purple-400" />
              <span className="mono text-[11px]">ISO_3691-4_clause_4.1.2_certified.pdf</span>
            </div>
          </div>

          {/* Card 5: Dynamic Edge Governor */}
          <div className="rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.08] hover:border-amber-500/40 p-6 flex flex-col justify-between space-y-6 transition-all hover:shadow-xl">
            <div className="space-y-4">
              <div className="p-3 w-fit rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Zap className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mono">Pillar 05</span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Dynamic Edge Safety Governor
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time onboard Control Barrier Function (CBF) node running at 200 Hz. Automatically clamps forward velocity and prevents spinouts the millisecond wheel slip or torso tilt exceeds threshold.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenGovernor}
              className="py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/25 text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors"
            >
              <span>Test Governor Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 6: Insurance Underwriting */}
          <div className="rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.08] hover:border-blue-500/40 p-6 flex flex-col justify-between space-y-6 transition-all hover:shadow-xl">
            <div className="space-y-4">
              <div className="p-3 w-fit rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mono">Pillar 06</span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Telematics Risk Underwriting
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Continuous fleet safety scores (Tier 1: FSR-AAA) shared with commercial industrial insurers (Munich Re, Travelers) to slash operational liability premiums by up to $60,000/year.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenTelematics}
              className="py-2 px-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/25 text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors"
            >
              <span>View Underwriting Telematics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
