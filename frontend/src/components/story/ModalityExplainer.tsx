/**
 * Presentation Component: Modality Explainer in Plain Human Language
 * Explains the real-world operational hazard across all 5 robotics modalities and allows 1-click testing in the 3D sandbox.
 */

'use client';

import React from 'react';

interface ModalityExplainerProps {
  readonly onSelectScenario: (scenarioKey: string) => void;
}

interface ModalityStoryItem {
  readonly key: string;
  readonly icon: string;
  readonly robotType: string;
  readonly realWorldHazard: string;
  readonly consequence: string;
  readonly standard: string;
  readonly automatedSolution: string;
  readonly tag: string;
}

const MODALITY_STORIES: readonly ModalityStoryItem[] = [
  {
    key: 'wheeled_amr_stopping_breach',
    icon: '🤖',
    robotType: 'Warehouse & Logistics AMRs',
    realWorldHazard:
      'AMRs carry heavy 800kg pallets at 1.8 m/s. When floor coolant or moisture drops friction below μ=0.25, the robot cannot stop before entering human crossing aisles.',
    consequence: 'OSHA violations, near-miss collisions with fork trucks, and $50k/hr facility shutdowns.',
    standard: 'ISO 3691-4 §4.1.2 (Braking & Clearance)',
    automatedSolution: 'Dynamic speed filter mask clamping forward velocity as soon as wheel slip exceeds 12%.',
    tag: 'LOGISTICS & FULFILLMENT',
  },
  {
    key: 'humanoid_zmp_slip',
    icon: '🦿',
    robotType: 'Bipedal Humanoid Logistics',
    realWorldHazard:
      'When lifting or transferring uneven loads across smooth factory epoxy, sudden foot slip causes the Zero Moment Point (ZMP) to exit the support polygon.',
    consequence: 'Catastrophic tipping, $120k robot structural damage, and line safety lockouts.',
    standard: 'ISO 13482 §5.2 (Personal Care Dynamic Stability)',
    automatedSolution: 'Active impedance damping patch that dynamically widens leg stance and limits torso acceleration.',
    tag: 'ADVANCED MANUFACTURING',
  },
  {
    key: 'heavy_hauler_skid',
    icon: '🚜',
    robotType: 'Autonomous Heavy Haulers',
    realWorldHazard:
      '50-ton earth-moving haulers descending 12% gravel slopes encounter loose mud during rain. Momentum overcomes tire adhesion, causing runaway skidding.',
    consequence: 'Quarry berm breach, severe vehicle rollover risk, and mine safety halt.',
    standard: 'ISO 17757 §4.3 (Earth-Moving Autonomous Braking)',
    automatedSolution: 'Grade-aware deceleration rate limiter that enforces dynamic retarder braking before slope entry.',
    tag: 'MINING & HEAVY INFRASTRUCTURE',
  },
  {
    key: 'manipulator_wrench_fault',
    icon: '🦾',
    robotType: 'Collaborative Robot Arms',
    realWorldHazard:
      'High-speed pick-and-place trajectories passing near kinematic singularities experience sudden joint torque spikes exceeding 195 Nm.',
    consequence: 'Safety controller trip-outs, dropped payloads, and broken collaborative safety compliance.',
    standard: 'ISO 10218 §5.10 (Collaborative Force Clamping)',
    automatedSolution: 'Cartesian jerk-limiting profile that smooths trajectory transitions near joint limits.',
    tag: 'AUTOMOTIVE & AEROSPACE',
  },
  {
    key: 'urban_rover_glare',
    icon: '🛴',
    robotType: 'Urban Sidewalk Delivery Rovers',
    realWorldHazard:
      'Low-angle afternoon sun (up to 95,000 Lux) blinds forward RGB cameras while approaching crosswalks, triggering phantom obstacles and sudden stops in traffic.',
    consequence: 'Traffic blockages, pedestrian complaints, and municipal operating permit suspensions.',
    standard: 'ISO 22737 §6.4 (Low-Speed Autonomous Transport)',
    automatedSolution: 'LiDAR/radar sensory confidence re-weighting rule when camera pixel saturation exceeds 85%.',
    tag: 'LAST-MILE & SMART CITIES',
  },
];

export const ModalityExplainer: React.FC<ModalityExplainerProps> = ({ onSelectScenario }) => {
  return (
    <section className="py-8 space-y-6" aria-label="Autonomous Modalities and Solutions">
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold mono">
          <span>MULTI-MODAL FLEET COVERAGE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Every Robot Architecture Has Real-World Physical Blindspots
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Click any modality below to see its physical failure mode and test the automated verification audit in the live 3D sandbox.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODALITY_STORIES.map((item) => (
          <div
            key={item.key}
            className="rounded-2xl bg-white border border-slate-200 card-shadow hover:border-blue-400 transition-all p-6 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl" role="img" aria-label={item.robotType}>
                  {item.icon}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 mono">
                  {item.tag}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  {item.robotType}
                </h3>
                <div className="text-[11px] font-mono text-slate-500 font-semibold mt-0.5">
                  Standard: {item.standard}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-900">The Real Hazard: </span>
                  <span className="text-slate-600 leading-relaxed">{item.realWorldHazard}</span>
                </div>
                <div>
                  <span className="font-bold text-rose-700">The Consequence: </span>
                  <span className="text-rose-900 leading-relaxed">{item.consequence}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px]">
                  <span className="font-bold text-blue-700">Diffraction Patch: </span>
                  <span className="text-slate-700 leading-relaxed">{item.automatedSolution}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectScenario(item.key)}
              className="w-full min-h-[42px] py-2 px-3.5 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Test This in 3D Sandbox</span>
              <span>→</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
