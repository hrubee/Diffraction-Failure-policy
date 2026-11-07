/**
 * Presentation Component: 4-Act Storyline Walkthrough for Landing Page
 * Takes prospective buyers through the journey of why lab simulations lie
 * and how Diffraction automates physical AI safety certification.
 */

'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Inbox,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  Sliders,
  FileCode,
  Terminal,
} from 'lucide-react';

interface LandingStoryWalkthroughProps {
  readonly onLaunchConsole: () => void;
}

interface StoryAct {
  readonly stepNumber: number;
  readonly actName: string;
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly summary: string;
  readonly bulletPoints: readonly string[];
  readonly tag: string;
}

export const LandingStoryWalkthrough: React.FC<LandingStoryWalkthroughProps> = ({
  onLaunchConsole,
}) => {
  const [activeActIndex, setActiveActIndex] = useState<number>(0);

  const storyActs: readonly StoryAct[] = [
    {
      stepNumber: 1,
      actName: 'The Divergence',
      icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
      title: 'The Hidden Gap Between Idealized Sim & Real Physics',
      summary:
        'Robotics engineers test autonomous navigation in simulators where friction is constant, floors are pristine, and lighting is uniform. But the actual physical world is ruthless and non-linear.',
      bulletPoints: [
        'Industrial floors accumulate coolant, spilled oils, and moisture (surface friction drops from μ=0.80 to μ=0.15).',
        'Direct sunlight through warehouse loading bays saturates RGB stereo cameras up to 95,000 Lux.',
        'A 12% grade or shifting payload triggers unmodeled momentum transfer and tipping limits.',
        'Result: Catastrophic skids, phantom obstacle E-stops, and failed ISO compliance audits costing $50k/hour.',
      ],
      tag: 'ACT 1 • REAL-WORLD DIVERGENCE',
    },
    {
      stepNumber: 2,
      actName: 'Black Box Ingestion',
      icon: <Inbox className="w-4 h-4 text-blue-400" />,
      title: 'Drop the Black Box: 5 Seconds from Incident to Ground-Truth SysID',
      summary:
        'Instead of spending 3 weeks manually slicing gigabytes of messy ROS bags, drop the robot’s black box incident log directly into Diffraction.',
      bulletPoints: [
        'Diffraction’s onboard ring buffer preserves the exact 5-second window prior to any E-stop or skid.',
        'Automated System Identification (SysID) reverse-engineers the ground truth physical parameters.',
        'Calculates exact surface friction (μ), wheel slip ratios, and joint wrench in milliseconds.',
        'Zero manual annotation required: native support for ROS 2 Humble/Jazzy, MCAP, and PX4 logs.',
      ],
      tag: 'ACT 2 • BLACK BOX INGESTION',
    },
    {
      stepNumber: 3,
      actName: 'Adversarial Sweep',
      icon: <Cpu className="w-4 h-4 text-cyan-400" />,
      title: '150+ Generative Physics Replays in Cloud Simulation',
      summary:
        'Diffraction does not just replay the log once. It spins up 150 parallel physics simulations to find the exact mathematical boundary where autonomy fails.',
      bulletPoints: [
        'Sweeps surface friction across μ = 0.12 to 1.15 to identify the critical traction threshold.',
        'Injects adversarial glare, slope grades (up to 15%), and actuator latency jitter (±45 ms).',
        'Calculates the non-linear stopping barrier function: v_safe = -at + sqrt((at)^2 + 2ad).',
        'Visualizes dynamic ZMP stability polygons and 3D digital twins in real time.',
      ],
      tag: 'ACT 3 • ADVERSARIAL VERIFICATION',
    },
    {
      stepNumber: 4,
      actName: 'Automated Remediate',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      title: 'Not Just an Error Log: Drop-in Code Patches & ISO Certification',
      summary:
        'Diffraction delivers the complete solution directly into your engineering pipeline: the exact ROS 2 controller patch and a signed audit dossier for safety inspectors.',
      bulletPoints: [
        'Turnkey Nav2 Speed Filter YAML masks and impedance damping controller patches.',
        'Signed ISO compliance verification dossier (ISO 3691-4, ISO 13482, ISO 17757, ISO 10218).',
        'CI/CD GitHub Action integration to block regressions before software ships to customer sites.',
        'Insurance risk underwriting rating to lower fleet operational liability premiums.',
      ],
      tag: 'ACT 4 • CERTIFICATION & REMEDIATION',
    },
  ];

  const currentAct = storyActs[activeActIndex];

  return (
    <section id="how-it-works" className="py-20 relative" aria-label="How Diffraction Works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-xs text-blue-400 mono">
            <Terminal className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              The 4-Act Verification Engine
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            How Autonomous Fleets Go From
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-400">
              Field Hazard to Certified Safe.
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Follow the automated lifecycle of an industrial incident: from black box telemetry ingestion 
            to cloud stress-sweeps and turnkey ROS 2 policy deployment.
          </p>
        </div>

        {/* 4-Act Tab Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-3">
          {storyActs.map((act, index) => {
            const isActive = index === activeActIndex;
            return (
              <button
                key={act.stepNumber}
                type="button"
                onClick={() => setActiveActIndex(index)}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center space-x-2.5 cursor-pointer ${
                  isActive
                    ? 'bg-white/[0.1] text-white border border-white/[0.2] shadow-md'
                    : 'bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 border border-white/[0.06]'
                }`}
              >
                <span>{act.icon}</span>
                <span>
                  Act {act.stepNumber}: {act.actName}
                </span>
              </button>
            );
          })}
        </div>

        {/* Story Card Container */}
        <div className="rounded-3xl bg-gradient-to-b from-[#111726] to-[#0c101a] border border-white/[0.12] p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-white/[0.05] border border-white/[0.1] text-[11px] font-mono text-cyan-400">
                <span>{currentAct.tag}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                {currentAct.title}
              </h3>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentAct.summary}
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300 pt-1">
                {currentAct.bulletPoints.map((pt, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed text-slate-300">{pt}</span>
                  </div>
                ))}
              </div>

              {/* Navigation Controls */}
              <div className="pt-6 flex items-center justify-between border-t border-white/[0.08]">
                <button
                  type="button"
                  disabled={activeActIndex === 0}
                  onClick={() => setActiveActIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
                >
                  ← Previous Act
                </button>

                {activeActIndex < storyActs.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setActiveActIndex((prev) => prev + 1)}
                    className="px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-semibold text-xs transition-colors flex items-center space-x-2 cursor-pointer border border-white/[0.1]"
                  >
                    <span>Next: {storyActs[activeActIndex + 1].actName}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onLaunchConsole}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Launch 3D Verification Sandbox</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Visual Inspection Terminal */}
            <div className="lg:col-span-5 bg-[#080b11] rounded-2xl p-6 text-white border border-white/[0.1] shadow-2xl space-y-4">
              {activeActIndex === 0 && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center text-[11px] text-slate-400 border-b border-white/[0.08] pb-2">
                    <span className="flex items-center space-x-1.5">
                      <Sliders className="w-3.5 h-3.5 text-blue-400" />
                      <span>PHYSICAL DIVERGENCE MATRIX</span>
                    </span>
                    <span className="text-amber-400 font-bold">SIMULATION GAP</span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/30">
                      <div className="text-[10px] uppercase text-emerald-400 font-semibold">
                        Lab Simulator (Idealized)
                      </div>
                      <div className="text-white font-bold mt-1">μ = 0.80 (Nominal Traction)</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        Constant friction, zero wheel slip, uniform lighting.
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/40">
                      <div className="text-[10px] uppercase text-rose-400 font-semibold">
                        Real Industrial Floor (Reality)
                      </div>
                      <div className="text-white font-bold mt-1">μ = 0.18 (Spilled Coolant)</div>
                      <div className="text-rose-300 text-[11px] mt-0.5">
                        Momentum skids 1.8m into human crossing aisle!
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeActIndex === 1 && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center text-[11px] text-slate-400 border-b border-white/[0.08] pb-2">
                    <span className="flex items-center space-x-1.5">
                      <Inbox className="w-3.5 h-3.5 text-blue-400" />
                      <span>ONBOARD RING BUFFER (.MCAP)</span>
                    </span>
                    <span className="text-emerald-400 font-bold">INGESTED</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                    <div className="text-cyan-300 font-bold">incident_wheeled_amr_digit.mcap</div>
                    <div className="text-slate-300">Duration: 5.00s pre-incident • 128 msgs</div>
                    <div className="text-amber-300 font-bold">Ground Truth SysID: μ = 0.18</div>
                    <div className="text-emerald-400 text-[10px]">
                      ✓ IMU, wheel odometry, and motor torques synchronized.
                    </div>
                  </div>
                </div>
              )}

              {activeActIndex === 2 && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center text-[11px] text-slate-400 border-b border-white/[0.08] pb-2">
                    <span className="flex items-center space-x-1.5">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      <span>ADVERSARIAL STRESS SWEEP</span>
                    </span>
                    <span className="text-cyan-400 font-bold">150 ROLLOUTS</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Friction Range:</span>
                      <span className="text-white font-bold">μ = 0.12 - 1.15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Adverse Glare:</span>
                      <span className="text-white font-bold">Up to 95,000 Lux</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Safe Traction Bound:</span>
                      <span className="text-emerald-400 font-bold">μ ≥ 0.33</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 h-1.5 w-full" />
                    </div>
                  </div>
                </div>
              )}

              {activeActIndex === 3 && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center text-[11px] text-slate-400 border-b border-white/[0.08] pb-2">
                    <span className="flex items-center space-x-1.5">
                      <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                      <span>TURNKEY REMEDIATION YAML</span>
                    </span>
                    <span className="text-emerald-400 font-bold">ISO COMPLIANT</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1.5 text-[11px]">
                    <div className="text-cyan-400 font-bold"># speed_filter_patch.yaml</div>
                    <div className="text-slate-400">speed_filter_mask:</div>
                    <div className="text-slate-300 pl-3">max_forward_vel: 0.65 # m/s</div>
                    <div className="text-slate-300 pl-3">min_decel_rate: 1.85 # m/s²</div>
                    <div className="text-emerald-400 pt-2 text-[10px]">
                      ✓ Cryptographic Dossier: ISO_3691-4_certified.pdf
                    </div>
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
