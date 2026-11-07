/**
 * Presentation Component: Interactive Storyline Walkthrough (4 Acts)
 * Combines Notion structure with high-craft engineering visuals and kinetic highlights.
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

interface StoryWalkthroughProps {
  readonly onLaunchSandbox: () => void;
}

interface StoryAct {
  readonly stepNumber: number;
  readonly actName: string;
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly summary: string;
  readonly bulletPoints: readonly string[];
  readonly tag: string;
  readonly tagBg: string;
  readonly tagText: string;
}

export const StoryWalkthrough: React.FC<StoryWalkthroughProps> = ({ onLaunchSandbox }) => {
  const [activeActIndex, setActiveActIndex] = useState<number>(0);

  const storyActs: readonly StoryAct[] = [
    {
      stepNumber: 1,
      actName: 'The Divergence',
      icon: <AlertTriangle className="w-4 h-4 text-rose-600" />,
      title: 'The Hidden Gap Between Idealized Sim & Real Physics',
      summary:
        'Robotics engineers test autonomous navigation in simulators where friction is constant, floors are pristine, and lighting is uniform. But the actual physical world is ruthless and non-linear.',
      bulletPoints: [
        'Industrial floors accumulate coolant, spilled oils, and moisture (surface friction drops from μ=0.80 to μ=0.15).',
        'Direct sunlight through warehouse loading bays saturates RGB stereo cameras up to 95,000 Lux.',
        'A 12% grade or shifting payload triggers unmodeled momentum transfer and tipping limits.',
        'Result: Catastrophic skids, phantom obstacle E-stops, and failed ISO compliance audits.',
      ],
      tag: 'ACT 1 • REAL-WORLD DIVERGENCE',
      tagBg: '#faecec',
      tagText: '#933434',
    },
    {
      stepNumber: 2,
      actName: 'Black Box Ingestion',
      icon: <Inbox className="w-4 h-4 text-blue-600" />,
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
      tagBg: '#e9f3f7',
      tagText: '#2e5d7d',
    },
    {
      stepNumber: 3,
      actName: 'Adversarial Sweep',
      icon: <Cpu className="w-4 h-4 text-amber-600" />,
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
      tagBg: '#fbf3db',
      tagText: '#835e16',
    },
    {
      stepNumber: 4,
      actName: 'Automated Remediate',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
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
      tagBg: '#edf3ec',
      tagText: '#34623f',
    },
  ];

  const currentAct = storyActs[activeActIndex];

  return (
    <section id="storyline" className="py-4 space-y-6" aria-label="Product Story Walkthrough">
      {/* Section Header */}
      <div className="space-y-1.5 border-b border-[rgba(55,53,47,0.06)] pb-4">
        <div className="flex items-center space-x-2 text-xs text-[#787774] font-semibold tracking-wider uppercase">
          <Terminal className="w-3.5 h-3.5 text-blue-600" />
          <span>Storyline &amp; Verification Mechanics</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#2f3437] tracking-tight">
          How Autonomous Fleets Go From Failure to Certified Safe
        </h2>
        <p className="text-xs sm:text-sm text-[#787774]">
          Step through the 4 acts below to see how Diffraction transforms unhandled physical hazards into automated safety policies.
        </p>
      </div>

      {/* Modern Database Tab Switcher */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[rgba(55,53,47,0.09)] pb-2">
        {storyActs.map((act, index) => {
          const isActive = index === activeActIndex;
          const tabCls = isActive
            ? 'px-3 py-1.5 rounded-lg bg-[#efefed] text-[#2f3437] font-semibold text-xs transition-all flex items-center space-x-2 border border-[#dfdfde] shadow-xs'
            : 'px-3 py-1.5 rounded-lg hover:bg-[#f7f6f3] text-[#787774] hover:text-[#2f3437] font-medium text-xs transition-colors flex items-center space-x-2 cursor-pointer';

          return (
            <button
              key={act.stepNumber}
              type="button"
              onClick={() => setActiveActIndex(index)}
              className={tabCls}
            >
              <span>{act.icon}</span>
              <span>
                Act {act.stepNumber}: {act.actName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Narrative Container */}
      <div className="bg-white rounded-2xl border border-[rgba(55,53,47,0.09)] card-shadow-md p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Narrative */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold mono"
              style={{ backgroundColor: currentAct.tagBg, color: currentAct.tagText }}
            >
              <span>{currentAct.tag}</span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#2f3437] tracking-tight leading-snug">
              {currentAct.title}
            </h3>

            {/* Notion Callout Box */}
            <div className="p-4 rounded-xl bg-[#fafaf9] border border-[rgba(55,53,47,0.09)] text-xs sm:text-sm text-[#5a5751] leading-relaxed">
              {currentAct.summary}
            </div>

            {/* Checklist items with Lucide CheckCircle2 */}
            <div className="space-y-2.5 text-xs sm:text-sm text-[#37352f] pt-1">
              {currentAct.bulletPoints.map((pt, i) => (
                <div key={i} className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-[#4a4742]">{pt}</span>
                </div>
              ))}
            </div>

            {/* Step Controls */}
            <div className="pt-5 flex items-center justify-between border-t border-[rgba(55,53,47,0.06)]">
              <button
                type="button"
                disabled={activeActIndex === 0}
                onClick={() => setActiveActIndex((prev) => Math.max(0, prev - 1))}
                className="px-3.5 py-1.5 rounded-md text-xs font-medium text-[#787774] hover:text-[#2f3437] hover:bg-[#efefed] disabled:opacity-30 cursor-pointer transition-colors"
              >
                ← Previous Act
              </button>

              {activeActIndex < storyActs.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveActIndex((prev) => prev + 1)}
                  className="px-4 py-1.5 rounded-lg bg-[#2f3437] hover:bg-[#1a1c1e] text-white font-medium text-xs transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <span>Next: {storyActs[activeActIndex + 1].actName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onLaunchSandbox}
                  className="px-4.5 py-2 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-white font-semibold text-xs shadow-sm transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Launch 3D Verification Sandbox</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Visual Graphic Container */}
          <div className="lg:col-span-5 bg-[#1e2226] rounded-xl p-5 text-white border border-[#373c41] shadow-lg space-y-4">
            {activeActIndex === 0 && (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-[11px] text-[#9a9a97] border-b border-[#373c41] pb-2">
                  <span className="flex items-center space-x-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-400" />
                    <span>ENVIRONMENT MATRIX</span>
                  </span>
                  <span className="text-amber-400 font-semibold">SIMULATION GAP</span>
                </div>
                <div className="space-y-2.5">
                  <div className="p-3 rounded-lg bg-[#282d33] border border-[#3d434a]">
                    <div className="text-[10px] uppercase text-[#9a9a97] font-semibold">
                      Lab Simulator (Idealized)
                    </div>
                    <div className="text-emerald-400 font-bold mt-1">μ = 0.80 (Nominal Traction)</div>
                    <div className="text-[#c4c4c2] text-[11px] mt-0.5">
                      Dry floors, 0 ms latency, no wheel slip.
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#3a2527] border border-[#5a3135]">
                    <div className="text-[10px] uppercase text-rose-300 font-semibold">
                      Real Factory Floor (Reality)
                    </div>
                    <div className="text-rose-400 font-bold mt-1">μ = 0.18 (Spilled Coolant)</div>
                    <div className="text-rose-200 text-[11px] mt-0.5">
                      Momentum skids 1.8m into crossing zone!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeActIndex === 1 && (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-[11px] text-[#9a9a97] border-b border-[#373c41] pb-2">
                  <span className="flex items-center space-x-1.5">
                    <Inbox className="w-3.5 h-3.5 text-sky-400" />
                    <span>BLACK BOX RING BUFFER</span>
                  </span>
                  <span className="text-emerald-400 font-semibold">INGESTED</span>
                </div>
                <div className="p-3 rounded-lg bg-[#282d33] border border-[#3d434a] space-y-2">
                  <div className="text-[10px] text-cyan-300">
                    packet: incident_wheeled_amr_20261106.mcap
                  </div>
                  <div className="text-[11px] text-[#d1d5db]">
                    Duration: <span className="text-white font-bold">5.00s</span> • Messages:{' '}
                    <span className="text-white font-bold">128</span>
                  </div>
                  <div className="text-[11px] text-[#9ca3af]">
                    SysID Calculated μ:{' '}
                    <span className="text-amber-400 font-bold">0.18</span> (Ground truth)
                  </div>
                  <div className="text-[10px] text-emerald-400">
                    ✓ Odometry slip &amp; motor torque vectors synchronized.
                  </div>
                </div>
              </div>
            )}

            {activeActIndex === 2 && (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-[11px] text-[#9a9a97] border-b border-[#373c41] pb-2">
                  <span className="flex items-center space-x-1.5">
                    <Cpu className="w-3.5 h-3.5 text-amber-400" />
                    <span>PARALLEL SWEEP MATRIX</span>
                  </span>
                  <span className="text-sky-400 font-semibold">150 ROLLOUTS</span>
                </div>
                <div className="p-3 rounded-lg bg-[#282d33] border border-[#3d434a] space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#9ca3af]">Friction range:</span>
                    <span className="text-white font-bold">μ = 0.12 - 1.15</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#9ca3af]">Adverse glare:</span>
                    <span className="text-white font-bold">Up to 95,000 Lux</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#9ca3af]">Safe Threshold:</span>
                    <span className="text-emerald-400 font-bold">μ ≥ 0.33</span>
                  </div>
                  <div className="w-full bg-[#1e2226] rounded-full h-1.5 mt-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 h-1.5 rounded-full w-full" />
                  </div>
                </div>
              </div>
            )}

            {activeActIndex === 3 && (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-[11px] text-[#9a9a97] border-b border-[#373c41] pb-2">
                  <span className="flex items-center space-x-1.5">
                    <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                    <span>TURNKEY ROS 2 PATCH</span>
                  </span>
                  <span className="text-emerald-400 font-semibold">ISO CERTIFIED</span>
                </div>
                <div className="p-3 rounded-lg bg-[#282d33] border border-[#3d434a] space-y-1.5 text-[11px]">
                  <div className="text-sky-300 font-bold"># speed_filter_patch.yaml</div>
                  <div className="text-[#9ca3af]">speed_filter_mask:</div>
                  <div className="text-[#d1d5db] pl-3">max_forward_vel: 0.65 # m/s</div>
                  <div className="text-[#d1d5db] pl-3">min_decel_rate: 1.85 # m/s²</div>
                  <div className="text-emerald-400 pt-1 text-[10px]">
                    ✓ Signed Dossier: ISO_3691-4_clause_4.1.2.pdf
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
