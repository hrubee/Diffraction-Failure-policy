/**
 * Presentation Component: Notion-Style Modality Explainer Gallery
 * Displays the 5 autonomous robotic architectures as a clean Notion Database Gallery view.
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
      'AMRs carry heavy 800kg pallets at 1.8 m/s. When floor coolant drops friction below μ=0.25, the robot cannot stop before entering human crossing aisles.',
    consequence: 'OSHA violations, near-miss collisions with fork trucks, and $50k/hr facility shutdowns.',
    standard: 'ISO 3691-4 §4.1.2',
    automatedSolution: 'Dynamic speed filter mask clamping forward velocity as soon as wheel slip exceeds 12%.',
    tag: 'Logistics',
  },
  {
    key: 'humanoid_zmp_slip',
    icon: '🦿',
    robotType: 'Bipedal Humanoid Logistics',
    realWorldHazard:
      'When lifting or transferring uneven loads across smooth factory epoxy, sudden foot slip causes the Zero Moment Point (ZMP) to exit the support polygon.',
    consequence: 'Catastrophic tipping, $120k robot structural damage, and line safety lockouts.',
    standard: 'ISO 13482 §5.2',
    automatedSolution: 'Active impedance damping patch that dynamically widens leg stance and limits torso acceleration.',
    tag: 'Humanoid',
  },
  {
    key: 'heavy_hauler_skid',
    icon: '🚜',
    robotType: 'Autonomous Heavy Haulers',
    realWorldHazard:
      '50-ton earth-moving haulers descending 12% gravel slopes encounter loose mud during rain. Momentum overcomes tire adhesion, causing runaway skidding.',
    consequence: 'Quarry berm breach, severe vehicle rollover risk, and mine safety halt.',
    standard: 'ISO 17757 §4.3',
    automatedSolution: 'Grade-aware deceleration rate limiter that enforces dynamic retarder braking before slope entry.',
    tag: 'Heavy Off-Road',
  },
  {
    key: 'manipulator_wrench_fault',
    icon: '🦾',
    robotType: 'Collaborative Robot Arms',
    realWorldHazard:
      'High-speed pick-and-place trajectories passing near kinematic singularities experience sudden joint torque spikes exceeding 195 Nm.',
    consequence: 'Safety controller trip-outs, dropped payloads, and broken collaborative safety compliance.',
    standard: 'ISO 10218 §5.10',
    automatedSolution: 'Cartesian jerk-limiting profile that smooths trajectory transitions near joint limits.',
    tag: 'Industrial Cell',
  },
  {
    key: 'urban_rover_glare',
    icon: '🛴',
    robotType: 'Urban Sidewalk Delivery Rovers',
    realWorldHazard:
      'Low-angle afternoon sun (up to 95,000 Lux) blinds forward RGB cameras while approaching crosswalks, triggering phantom obstacles and sudden stops in traffic.',
    consequence: 'Traffic blockages, pedestrian complaints, and municipal operating permit suspensions.',
    standard: 'ISO 22737 §6.4',
    automatedSolution: 'LiDAR/radar sensory confidence re-weighting rule when camera pixel saturation exceeds 85%.',
    tag: 'Last-Mile Mobility',
  },
];

export const ModalityExplainer: React.FC<ModalityExplainerProps> = ({ onSelectScenario }) => {
  return (
    <section className="py-6 space-y-4" aria-label="Autonomous Modalities and Solutions">
      {/* Notion Database Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(55,53,47,0.09)] pb-3">
        <div className="flex items-center space-x-2">
          <span className="text-base">🗂️</span>
          <h2 className="text-sm font-bold text-[#37352f] tracking-tight">
            Robotic Modality Fleet Database
          </h2>
          <span className="px-1.5 py-0.2 rounded bg-[#f1f1ef] text-[#787774] text-[11px] font-mono">
            5 Views
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs text-[#787774]">
          <span className="hover:bg-[#efefed] px-2 py-1 rounded cursor-pointer transition-colors">
            Filter: All
          </span>
          <span className="text-[#c4c4c2]">•</span>
          <span className="hover:bg-[#efefed] px-2 py-1 rounded cursor-pointer transition-colors">
            Sort: Hazard Risk
          </span>
        </div>
      </div>

      {/* Notion Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODALITY_STORIES.map((item) => (
          <div
            key={item.key}
            className="rounded-xl bg-white border border-[rgba(55,53,47,0.09)] card-shadow hover:shadow-[0_2px_8px_rgba(15,15,15,0.08)] transition-all p-5 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Header Icon + Type */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="text-2xl select-none" role="img" aria-label={item.robotType}>
                    {item.icon}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[#37352f] tracking-tight leading-snug">
                      {item.robotType}
                    </h3>
                    <div className="text-[11px] font-mono text-[#787774] mt-0.5">
                      {item.standard}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#f1f1ef] text-[#787774] border border-[#e3e2e0]">
                  {item.tag}
                </span>
              </div>

              {/* Notion Property Rows */}
              <div className="space-y-2 text-xs pt-1 border-t border-[rgba(55,53,47,0.06)]">
                <div>
                  <span className="font-semibold text-[#37352f]">Physical Hazard: </span>
                  <span className="text-[#5a5751] leading-relaxed">{item.realWorldHazard}</span>
                </div>

                <div className="text-[11px] text-[#933434] bg-[#faecec] p-2 rounded-lg border border-[#f5d7d7]">
                  <span className="font-semibold">Risk: </span>
                  <span className="leading-relaxed">{item.consequence}</span>
                </div>

                <div className="text-[11px] text-[#2e5d7d] bg-[#e9f3f7] p-2 rounded-lg border border-[#d3e5ef]">
                  <span className="font-semibold">Diffraction Fix: </span>
                  <span className="leading-relaxed">{item.automatedSolution}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectScenario(item.key)}
              className="w-full min-h-[36px] py-1.5 px-3 bg-white hover:bg-[#efefed] border border-[#dfdfde] text-[#37352f] font-medium text-xs rounded-lg transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
            >
              <span>Test In 3D Sandbox</span>
              <span>↗</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
