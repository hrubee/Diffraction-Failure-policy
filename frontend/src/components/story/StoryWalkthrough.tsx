/**
 * Presentation Component: Notion-Style Interactive Storyline Walkthrough (4 Acts)
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
  readonly icon: string;
  readonly title: string;
  readonly summary: string;
  readonly bulletPoints: readonly string[];
  readonly tag: string;
  readonly tagBg: string;
  readonly tagText: string;
}

const STORY_ACTS: readonly StoryAct[] = [
  {
    stepNumber: 1,
    actName: 'The Problem',
    icon: '🔍',
    title: 'The Hidden Gap Between Simulation & Factory Reality',
    summary:
      'Robotics engineers test navigation stacks in idealized simulators where friction is constant, floors are clean, and lighting is uniform. But the real physical world is ruthless.',
    bulletPoints: [
      'Industrial floors accumulate coolant, oils, and moisture (friction drops from μ=0.8 to μ=0.15).',
      'Direct sunlight through warehouse loading bays saturates stereo cameras up to 95,000 Lux.',
      'A 12% grade or shifted payload triggers unmodeled momentum transfer and tipping limits.',
      'Result: Dangerous skids, intermittent phantom E-stops, and failed ISO certification audits.',
    ],
    tag: 'ACT 1 • REAL-WORLD DIVERGENCE',
    tagBg: '#faecec',
    tagText: '#933434',
  },
  {
    stepNumber: 2,
    actName: 'The Ingestion',
    icon: '📦',
    title: 'Drop the Black Box: 5 Seconds from Incident to System ID',
    summary:
      'Instead of spending 3 weeks manually slicing gigabytes of messy ROS bags, drop the robot’s black box incident log directly into Diffraction.',
    bulletPoints: [
      'Diffraction’s onboard ring buffer preserves the exact 5-second window prior to any E-stop or skid.',
      'Automated System Identification (SysID) reverse-engineers the ground truth physics.',
      'Measures exact surface friction (μ), wheel slip ratios, and joint wrench in milliseconds.',
      'Zero manual annotation needed: compatible with ROS 2 Humble/Jazzy, MCAP, and PX4 logs.',
    ],
    tag: 'ACT 2 • BLACK BOX INGESTION',
    tagBg: '#e9f3f7',
    tagText: '#2e5d7d',
  },
  {
    stepNumber: 3,
    actName: 'The Stress Sweep',
    icon: '⚡',
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
    actName: 'The Automated Fix',
    icon: '🛡️',
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

export const StoryWalkthrough: React.FC<StoryWalkthroughProps> = ({ onLaunchSandbox }) => {
  const [activeActIndex, setActiveActIndex] = useState<number>(0);
  const currentAct = STORY_ACTS[activeActIndex];

  return (
    <section id="storyline" className="py-6 space-y-6" aria-label="Product Story Walkthrough">
      {/* Section Header in Notion Style */}
      <div className="space-y-1.5 border-b border-[rgba(55,53,47,0.06)] pb-4">
        <div className="flex items-center space-x-2 text-xs text-[#787774] font-medium">
          <span>📚</span>
          <span>Storyline &amp; Verification Mechanics</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#37352f] tracking-tight">
          How Autonomous Fleets Go From Failure to Certified Safe
        </h2>
        <p className="text-xs sm:text-sm text-[#787774]">
          Step through the 4 acts below to see how Diffraction transforms unhandled physical hazards into automated safety policies.
        </p>
      </div>

      {/* Notion Database Tab Switcher */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[rgba(55,53,47,0.09)] pb-2">
        {STORY_ACTS.map((act, index) => {
          const isActive = index === activeActIndex;
          const tabCls = isActive
            ? 'px-3 py-1.5 rounded-md bg-[#efefed] text-[#37352f] font-semibold text-xs transition-colors flex items-center space-x-1.5 border border-[#dfdfde]'
            : 'px-3 py-1.5 rounded-md hover:bg-[#f7f6f3] text-[#787774] hover:text-[#37352f] font-medium text-xs transition-colors flex items-center space-x-1.5 cursor-pointer';

          return (
            <button
              key={act.stepNumber}
              type="button"
              onClick={() => setActiveActIndex(index)}
              className={tabCls}
            >
              <span>{act.icon}</span>
              <span>{act.stepNumber}. {act.actName}</span>
            </button>
          );
        })}
      </div>

      {/* Notion Document Container */}
      <div className="bg-white rounded-2xl border border-[rgba(55,53,47,0.09)] card-shadow p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Narrative */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded text-[11px] font-medium mono"
                 style={{ backgroundColor: currentAct.tagBg, color: currentAct.tagText }}>
              <span>{currentAct.tag}</span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#37352f] tracking-tight leading-snug">
              {currentAct.title}
            </h3>

            {/* Notion Callout Box */}
            <div className="p-3.5 rounded-xl bg-[#fbfbfa] border border-[rgba(55,53,47,0.09)] text-xs text-[#5a5751] leading-relaxed">
              {currentAct.summary}
            </div>

            {/* Notion Checklist style */}
            <div className="space-y-2 text-xs text-[#37352f]">
              {currentAct.bulletPoints.map((pt, i) => (
                <div key={i} className="flex items-start space-x-2">
                  <span className="text-[#2383e2] select-none font-bold">☑</span>
                  <span className="leading-relaxed text-[#5a5751]">{pt}</span>
                </div>
              ))}
            </div>

            {/* Step Controls */}
            <div className="pt-4 flex items-center justify-between border-t border-[rgba(55,53,47,0.06)]">
              <button
                type="button"
                disabled={activeActIndex === 0}
                onClick={() => setActiveActIndex((prev) => Math.max(0, prev - 1))}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-[#787774] hover:text-[#37352f] hover:bg-[#efefed] disabled:opacity-30 cursor-pointer"
              >
                ← Previous Act
              </button>

              {activeActIndex < STORY_ACTS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveActIndex((prev) => prev + 1)}
                  className="px-4 py-1.5 rounded-md bg-[#2f3437] hover:bg-[#37352f] text-white font-medium text-xs transition-colors cursor-pointer"
                >
                  Next: {STORY_ACTS[activeActIndex + 1].actName} →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onLaunchSandbox}
                  className="px-4 py-1.5 rounded-md bg-[#2383e2] hover:bg-[#1a73e8] text-white font-medium text-xs shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>⚡ Test In 3D Sandbox</span>
                  <span>→</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Visual Graphic Container (Notion Code / Inspector Box) */}
          <div className="lg:col-span-5 bg-[#2f3437] rounded-xl p-5 text-white border border-[rgba(55,53,47,0.15)] shadow-md space-y-4">
            {activeActIndex === 0 && (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-[11px] text-[#9a9a97] border-b border-[#474c50] pb-2">
                  <span>ENVIRONMENT MATRIX</span>
                  <span className="text-amber-300">SIMULATION GAP</span>
                </div>
                <div className="space-y-2.5">
                  <div className="p-3 rounded-lg bg-[#383d41] border border-[#474c50]">
                    <div className="text-[10px] uppercase text-[#9a9a97] font-semibold">Lab Simulator (Idealized)</div>
                    <div className="text-emerald-400 font-bold mt-1">μ = 0.80 (Nominal Traction)</div>
                    <div className="text-[#c4c4c2] text-[11px] mt-0.5">Dry floors, 0 ms latency, no wheel slip.</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#442b2b] border border-[#6b3a3a]">
                    <div className="text-[10px] uppercase text-rose-300 font-semibold">Real Factory Floor (Reality)</div>
                    <div className="text-rose-400 font-bold mt-1">μ = 0.18 (Spilled Coolant)</div>
                    <div className="text-rose-200 text-[11px] mt-0.5">Momentum skids 1.8m into crossing zone!</div>
                  </div>
                </div>
              </div>
            )}

            {activeActIndex === 1 && (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-[11px] text-[#9a9a97] border-b border-[#474c50] pb-2">
                  <span>TELEMETRY INGESTION</span>
                  <span className="text-sky-300">SYSID ENGINE</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 rounded bg-[#383d41] border border-[#474c50]">
                    <span className="text-[#9a9a97]">Input File:</span>
                    <span className="text-sky-300 font-bold">incident_amr_019.mcap</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-[#383d41] border border-[#474c50]">
                    <span className="text-[#9a9a97]">Estimated Friction:</span>
                    <span className="text-rose-400 font-bold">μ = 0.23 (Slick Floor)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-[#383d41] border border-[#474c50]">
                    <span className="text-[#9a9a97]">Wheel Slip Ratio:</span>
                    <span className="text-amber-300 font-bold">42.8% (Severe Slip)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-[#383d41] border border-[#474c50]">
                    <span className="text-[#9a9a97]">Trigger State:</span>
                    <span className="text-rose-400 font-bold">E-STOP TRIGGERED</span>
                  </div>
                </div>
              </div>
            )}

            {activeActIndex === 2 && (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-[11px] text-[#9a9a97] border-b border-[#474c50] pb-2">
                  <span>MONTE CARLO SWEEP</span>
                  <span className="text-emerald-400">150 ROLLOUTS</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] text-[#c4c4c2]">
                    <span>Safe Parametric Space:</span>
                    <span className="text-emerald-400 font-bold">62% Passed</span>
                  </div>
                  <div className="w-full bg-[#474c50] h-2 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-500 h-full" style={{ width: '62%' }} />
                    <div className="bg-rose-500 h-full" style={{ width: '38%' }} />
                  </div>
                  <div className="p-3 rounded-lg bg-[#383d41] border border-[#474c50] space-y-1 text-[11px]">
                    <div className="text-sky-300">Stopping Barrier Formula:</div>
                    <div className="text-white">v_safe = -at + sqrt((at)^2 + 2ad)</div>
                    <div className="text-[#9a9a97] text-[10px] mt-1">Dynamic speed derating per millisecond.</div>
                  </div>
                </div>
              </div>
            )}

            {activeActIndex === 3 && (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-[11px] text-[#9a9a97] border-b border-[#474c50] pb-2">
                  <span>TURNKEY DELIVERABLES</span>
                  <span className="text-emerald-400">CERTIFIED</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-[#383d41] border border-[#474c50]">
                    <div className="text-[10px] text-sky-300 font-bold">ROS 2 SPEED FILTER MASK</div>
                    <div className="text-white text-[11px] mt-0.5">speed_filter_mask.yaml</div>
                    <div className="text-emerald-400 text-[10px] mt-1">✓ Clamps v_max on wet friction zones</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#383d41] border border-[#474c50]">
                    <div className="text-[10px] text-emerald-400 font-bold">ISO COMPLIANCE DOSSIER</div>
                    <div className="text-white text-[11px] mt-0.5">ISO 3691-4 §4.1.2 Compliant</div>
                    <div className="text-[#9a9a97] text-[10px] mt-1">Ready for safety auditors &amp; insurers</div>
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
