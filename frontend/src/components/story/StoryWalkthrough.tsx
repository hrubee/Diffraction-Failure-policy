/**
 * Presentation Component: Interactive Storyline Walkthrough (4 Acts)
 * Guides prospects through the exact journey of why robots fail and how Diffraction automates the fix.
 */

'use client';

import React, { useState } from 'react';

interface StoryWalkthroughProps {
  readonly onLaunchSandbox: () => void;
}

interface StoryAct {
  readonly stepNumber: number;
  readonly actName: string;
  readonly title: string;
  readonly summary: string;
  readonly bulletPoints: readonly string[];
  readonly badge: string;
}

const STORY_ACTS: readonly StoryAct[] = [
  {
    stepNumber: 1,
    actName: 'The Problem',
    title: 'The Hidden Gap Between Simulation & Factory Reality',
    summary:
      'Robotics engineers test navigation stacks in idealized simulators where friction is constant, floors are clean, and lighting is uniform. But the real physical world is ruthless.',
    bulletPoints: [
      'Industrial floors accumulate coolant, oils, and moisture (friction drops from μ=0.8 to μ=0.15).',
      'Direct sunlight through warehouse loading bays saturates stereo cameras up to 95,000 Lux.',
      'A 12% grade or shifted payload triggers unmodeled momentum transfer and tipping limits.',
      'Result: Dangerous skids, intermittent phantom E-stops, and failed ISO certification audits.',
    ],
    badge: 'ACT 1: REAL-WORLD DIVERGENCE',
  },
  {
    stepNumber: 2,
    actName: 'The Ingestion',
    title: 'Drop the Black Box: 5 Seconds from Incident to System ID',
    summary:
      'Instead of spending 3 weeks manually slicing gigabytes of messy ROS bags, drop the robot’s black box incident log directly into Diffraction.',
    bulletPoints: [
      'Diffraction’s onboard ring buffer preserves the exact 5-second window prior to any E-stop or skid.',
      'Automated System Identification (SysID) reverse-engineers the ground truth physics.',
      'Measures exact surface friction (μ), wheel slip ratios, and joint wrench in milliseconds.',
      'Zero manual annotation needed: compatible with ROS 2 Humble/Jazzy, MCAP, and PX4 logs.',
    ],
    badge: 'ACT 2: BLACK BOX INGESTION',
  },
  {
    stepNumber: 3,
    actName: 'The Stress Sweep',
    title: '150+ Generative Physics Replays in Cloud Simulation',
    summary:
      'Diffraction does not just replay the log once. It spins up 150 parallel physics simulations to find the exact mathematical boundary where autonomy fails.',
    bulletPoints: [
      'Sweeps surface friction across μ = 0.12 to 1.15 to identify the critical traction threshold.',
      'Injects adversarial glare, slope grades (up to 15%), and actuator latency jitter (±45 ms).',
      'Calculates the non-linear stopping barrier function: v_safe = -at + sqrt((at)^2 + 2ad).',
      'Visualizes dynamic ZMP stability polygons and 3D digital twins in real time.',
    ],
    badge: 'ACT 3: ADVERSARIAL VERIFICATION',
  },
  {
    stepNumber: 4,
    actName: 'The Automated Fix',
    title: 'Not Just an Error Log: Drop-in Code Patches & ISO Certification',
    summary:
      'Diffraction delivers the complete solution directly into your engineering pipeline: the exact ROS 2 controller patch and a signed audit dossier for safety inspectors.',
    bulletPoints: [
      'Turnkey Nav2 Speed Filter YAML masks and impedance damping controller patches.',
      'Signed ISO compliance verification dossier (ISO 3691-4, ISO 13482, ISO 17757, ISO 10218).',
      'CI/CD GitHub Action integration to block regressions before software ships to customer sites.',
      'Insurance risk underwriting rating to lower fleet operational liability premiums.',
    ],
    badge: 'ACT 4: CERTIFICATION & REMEDIATION',
  },
];

export const StoryWalkthrough: React.FC<StoryWalkthroughProps> = ({ onLaunchSandbox }) => {
  const [activeActIndex, setActiveActIndex] = useState<number>(0);
  const currentAct = STORY_ACTS[activeActIndex];

  return (
    <section id="storyline" className="py-10 space-y-8" aria-label="Product Story Walkthrough">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold mono">
          <span>THE DIFFRACTION STORYLINE</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How Autonomous Fleets Go From Failure to Certified Safe
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Click through the 4 acts below to understand how Diffraction transforms an unhandled real-world hazard into an automated, mathematically verified safety policy.
        </p>
      </div>

      {/* Stepper Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 max-w-4xl mx-auto">
        {STORY_ACTS.map((act, index) => {
          const isActive = index === activeActIndex;
          const isCompleted = index < activeActIndex;

          const tabCls = isActive
            ? 'px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2'
            : isCompleted
            ? 'px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs transition-colors flex items-center space-x-2 cursor-pointer'
            : 'px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center space-x-2 cursor-pointer';

          return (
            <button
              key={act.stepNumber}
              type="button"
              onClick={() => setActiveActIndex(index)}
              className={tabCls}
            >
              <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                isActive ? 'bg-white text-blue-600' : isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
              }`}>
                {act.stepNumber}
              </span>
              <span>{act.actName}</span>
            </button>
          );
        })}
      </div>

      {/* Main Act Visual Card */}
      <div className="bg-white rounded-3xl border border-slate-200 card-shadow-lg p-6 sm:p-10 max-w-5xl mx-auto transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Narrative */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold mono">
              <span>{currentAct.badge}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {currentAct.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {currentAct.summary}
            </p>

            <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
              {currentAct.bulletPoints.map((pt, i) => (
                <li key={i} className="flex items-start space-x-2.5">
                  <span className="text-blue-600 font-bold shrink-0">✓</span>
                  <span className="leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>

            {/* Step Controls */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                disabled={activeActIndex === 0}
                onClick={() => setActiveActIndex((prev) => Math.max(0, prev - 1))}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
              >
                ← Previous Act
              </button>

              {activeActIndex < STORY_ACTS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveActIndex((prev) => prev + 1)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Next: {STORY_ACTS[activeActIndex + 1].actName} →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onLaunchSandbox}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>⚡ Test In Live 3D Sandbox</span>
                  <span>→</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Visual Graphic Container */}
          <div className="lg:col-span-5 bg-slate-950 rounded-2xl p-6 text-white border border-slate-800 shadow-inner space-y-4">
            {activeActIndex === 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span>ENVIRONMENT MATRIX</span>
                  <span className="text-amber-400">SIMULATION GAP</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="font-bold text-slate-400 text-[10px] uppercase">Lab Simulator (Nominal)</div>
                    <div className="text-emerald-400 font-mono font-bold mt-1">μ = 0.80 (Dry &amp; Predictable)</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">Zero glare, 0 ms latency, robot stops safely.</div>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60">
                    <div className="font-bold text-rose-300 text-[10px] uppercase">Real Factory Floor (Reality)</div>
                    <div className="text-rose-400 font-mono font-bold mt-1">μ = 0.18 (Wet Coolant Film)</div>
                    <div className="text-rose-200 text-[11px] mt-0.5">Momentum skids 1.8m into human crossing zone!</div>
                  </div>
                </div>
              </div>
            )}

            {activeActIndex === 1 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span>TELEMETRY INGESTION</span>
                  <span className="text-blue-400">SYSID ENGINE</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Input File:</span>
                    <span className="text-blue-300 font-bold">incident_amr_019.mcap</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Estimated Friction:</span>
                    <span className="text-rose-400 font-bold">μ = 0.23 (Slick Floor)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Wheel Slip Ratio:</span>
                    <span className="text-amber-400 font-bold">42.8% (Severe Slip)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Trigger State:</span>
                    <span className="text-rose-400 font-bold">E-STOP TRIGGERED</span>
                  </div>
                </div>
              </div>
            )}

            {activeActIndex === 2 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span>MONTE CARLO SWEEP</span>
                  <span className="text-emerald-400">150 ROLLOUTS</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-[11px] mono text-slate-300">
                    <span>Safe Parametric Space:</span>
                    <span className="text-emerald-400 font-bold">62% Passed</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-500 h-full" style={{ width: '62%' }} />
                    <div className="bg-rose-500 h-full" style={{ width: '38%' }} />
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 font-mono text-[11px]">
                    <div className="text-blue-400">Quadratic Barrier Formula:</div>
                    <div className="text-slate-300">v_safe = -at + sqrt((at)^2 + 2ad)</div>
                    <div className="text-slate-400 text-[10px] mt-1">Calculates exact derated speed per millisecond.</div>
                  </div>
                </div>
              </div>
            )}

            {activeActIndex === 3 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span>TURNKEY DELIVERABLES</span>
                  <span className="text-emerald-400">CERTIFIED</span>
                </div>
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-800/80">
                    <div className="text-[10px] text-blue-400 font-bold">ROS 2 SPEED FILTER MASK</div>
                    <div className="text-slate-300 text-[11px] mt-0.5">speed_filter_mask.yaml</div>
                    <div className="text-emerald-400 text-[10px] mt-1">✓ Clamps v_max to 0.72 m/s on wet zones</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-emerald-400 font-bold">ISO COMPLIANCE DOSSIER</div>
                    <div className="text-slate-300 text-[11px] mt-0.5">ISO 3691-4 §4.1.2 Compliant</div>
                    <div className="text-slate-400 text-[10px] mt-1">Ready for safety auditors &amp; insurers</div>
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
