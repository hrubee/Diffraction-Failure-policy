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
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-blue-950 border border-blue-500/40 text-xs text-blue-300 font-mono">
            <Layers className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Full-Stack Autonomous Safety Infrastructure
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight font-headline">
            Engineered for physical reality.
            <br />
            <span className="text-blue-400">
              Not idealized lab simulations.
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-body">
            Every layer of Diffraction is designed to close the simulation-to-reality gap in minutes, 
            turning unexpected robot crashes into hardened ROS 2 safety policies.
          </p>
        </div>

        {/* The Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: 5-Second Ingestion */}
          <div className="rounded-2xl bg-[#0e1320] border border-slate-800 hover:border-blue-500/40 p-6 flex flex-col justify-between space-y-6 transition-colors shadow-sm">
            <div className="space-y-4">
              <div className="p-3 w-fit rounded-lg bg-blue-950 text-blue-400 border border-blue-500/40">
                <Inbox className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 font-mono">Pillar 01</span>
                <h3 className="text-lg font-bold text-white tracking-tight font-headline">
                  Instant Black Box Ingestion
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-body">
                  Onboard circular ring buffer captures the exact 5 seconds of wheel velocities, joint torques, and camera frames prior to an E-stop. System Identification (SysID) automatically computes true ground friction (μ).
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#07090e] border border-slate-800 font-mono text-[11px] space-y-1 text-slate-300">
              <div className="text-blue-400 font-bold"># incident_telemetry.mcap</div>
              <div>Duration: <span className="text-white">5.00s</span> • msgs: <span className="text-white">128</span></div>
              <div className="text-emerald-400">✓ SysID Calculated μ: 0.18 (Spilled Coolant)</div>
            </div>
          </div>

          {/* Card 2: 150+ Generative Physics Sweeps */}
          <div className="rounded-2xl bg-[#0e1320] border border-slate-800 hover:border-orange-500/40 p-6 flex flex-col justify-between space-y-6 transition-colors shadow-sm">
            <div className="space-y-4">
              <div className="p-3 w-fit rounded-lg bg-[#1c0f0a] text-orange-400 border border-orange-500/40">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 font-mono">Pillar 02</span>
                <h3 className="text-lg font-bold text-white tracking-tight font-headline">
                  150+ Generative Physics Sweeps
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-body">
                  Diffraction spins up 150 parallel cloud simulations sweeping friction (μ = 0.12 - 1.15), incline slope (0 - 15%), solar glare (up to 95k Lux), and latency jitter to pinpoint the exact failure envelope.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#07090e] border border-slate-800 font-mono text-[11px] space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Friction Sweep:</span>
                <span className="text-white font-bold">μ = 0.12 to 1.15</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden flex">
                <div className="bg-orange-500 h-1.5 w-1/3" />
                <div className="bg-blue-500 h-1.5 w-2/3" />
              </div>
              <div className="text-blue-400 text-[10px]">Safe Boundary: μ ≥ 0.33</div>
            </div>
          </div>

          {/* Card 3: Turnkey ROS 2 Remediation */}
          <div className="rounded-2xl bg-[#0e1320] border border-slate-800 hover:border-yellow-400/40 p-6 flex flex-col justify-between space-y-6 transition-colors shadow-sm">
            <div className="space-y-4">
              <div className="p-3 w-fit rounded-lg bg-[#1c1808] text-yellow-400 border border-yellow-400/40">
                <FileCode className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400 font-mono">Pillar 03</span>
                <h3 className="text-lg font-bold text-white tracking-tight font-headline">
                  Turnkey ROS 2 &amp; PX4 Code Patches
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-body">
                  Zero proprietary lock-in. Diffraction generates drop-in Nav2 velocity filter YAMLs, impedance damping profiles, and safety zone masks that drop directly into your git repository.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#07090e] border border-slate-800 font-mono text-[10px] space-y-1 text-slate-300">
              <div className="text-yellow-400 font-bold"># speed_filter_mask.yaml</div>
              <div className="text-slate-400">max_forward_vel: <span className="text-white">0.65 # m/s</span></div>
              <div className="text-slate-400">min_decel_rate: <span className="text-white">1.85 # m/s²</span></div>
            </div>
          </div>

          {/* Card 4: Cryptographic ISO Dossier */}
          <div className="rounded-2xl bg-[#0e1320] border border-slate-800 hover:border-blue-500/40 p-6 flex flex-col justify-between space-y-6 transition-colors shadow-sm">
            <div className="space-y-4">
              <div className="p-3 w-fit rounded-lg bg-blue-950 text-blue-300 border border-blue-500/40">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 font-mono">Pillar 04</span>
                <h3 className="text-lg font-bold text-white tracking-tight font-headline">
                  Cryptographic ISO Due-Diligence
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-body">
                  Automated signed PDF audit reports matching ISO 3691-4, ISO 13482, ISO 17757, and ISO 10218 standards. Satisfies customer safety audits and OSHA compliance in minutes.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/40 text-blue-300 text-xs flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-blue-400" />
              <span className="font-mono text-[11px]">ISO_3691-4_clause_4.1.2_certified.pdf</span>
            </div>
          </div>

          {/* Card 5: Dynamic Edge Governor */}
          <div className="rounded-2xl bg-[#0e1320] border border-slate-800 hover:border-orange-500/40 p-6 flex flex-col justify-between space-y-6 transition-colors shadow-sm">
            <div className="space-y-4">
              <div className="p-3 w-fit rounded-lg bg-[#1c0f0a] text-orange-400 border border-orange-500/40">
                <Zap className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 font-mono">Pillar 05</span>
                <h3 className="text-lg font-bold text-white tracking-tight font-headline">
                  Dynamic Edge Safety Governor
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-body">
                  Real-time onboard Control Barrier Function (CBF) node running at 200 Hz. Automatically clamps forward velocity and prevents spinouts the millisecond wheel slip or torso tilt exceeds threshold.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenGovernor}
              className="py-2 px-3 rounded-lg bg-[#1c0f0a] hover:bg-[#2e1810] text-orange-300 border border-orange-500/40 text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors"
            >
              <span>Test Governor Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 6: Insurance Underwriting */}
          <div className="rounded-2xl bg-[#0e1320] border border-slate-800 hover:border-yellow-400/40 p-6 flex flex-col justify-between space-y-6 transition-colors shadow-sm">
            <div className="space-y-4">
              <div className="p-3 w-fit rounded-lg bg-[#1c1808] text-yellow-400 border border-yellow-400/40">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400 font-mono">Pillar 06</span>
                <h3 className="text-lg font-bold text-white tracking-tight font-headline">
                  Telematics Risk Underwriting
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-body">
                  Continuous fleet safety scores (Tier 1: FSR-AAA) shared with commercial industrial insurers (Munich Re, Travelers) to slash operational liability premiums by up to $60,000/year.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenTelematics}
              className="py-2 px-3 rounded-lg bg-[#1c1808] hover:bg-[#2b240c] text-yellow-300 border border-yellow-400/40 text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors"
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
