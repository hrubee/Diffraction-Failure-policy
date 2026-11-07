/**
 * Presentation Component: Modality Fleet Database Gallery
 * Replaces cartoonish emojis with refined Lucide engineering icons,
 * high-contrast risk badges, and direct 1-click 3D verification CTAs.
 */

'use client';

import React from 'react';
import {
  Bot,
  Activity,
  Truck,
  Cpu,
  Compass,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Layers,
} from 'lucide-react';

interface ModalityExplainerProps {
  readonly onSelectScenario: (scenarioKey: string) => void;
}

interface ModalityStoryItem {
  readonly key: string;
  readonly icon: React.ReactNode;
  readonly robotType: string;
  readonly realWorldHazard: string;
  readonly consequence: string;
  readonly standard: string;
  readonly automatedSolution: string;
  readonly tag: string;
  readonly tagClass: string;
}

export const ModalityExplainer: React.FC<ModalityExplainerProps> = ({ onSelectScenario }) => {
  const modalityStories: readonly ModalityStoryItem[] = [
    {
      key: 'wheeled_amr_stopping_breach',
      icon: <Bot className="w-5 h-5 text-blue-600" />,
      robotType: 'Warehouse & Logistics AMRs',
      realWorldHazard:
        'AMRs carry heavy 800kg pallets at 1.8 m/s. When floor coolant drops friction below μ=0.25, the robot cannot stop before entering human crossing aisles.',
      consequence: 'OSHA violations, near-miss collisions with fork trucks, and $50k/hr facility shutdowns.',
      standard: 'ISO 3691-4 §4.1.2',
      automatedSolution: 'Dynamic speed filter mask clamping forward velocity as soon as wheel slip exceeds 12%.',
      tag: 'Logistics AMR',
      tagClass: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      key: 'humanoid_zmp_slip',
      icon: <Activity className="w-5 h-5 text-purple-600" />,
      robotType: 'Bipedal Humanoid Logistics',
      realWorldHazard:
        'When lifting or transferring uneven loads across smooth factory epoxy, sudden foot slip causes the Zero Moment Point (ZMP) to exit the support polygon.',
      consequence: 'Catastrophic tipping, $120k robot structural damage, and line safety lockouts.',
      standard: 'ISO 13482 §5.2',
      automatedSolution: 'Active impedance damping patch that dynamically widens leg stance and limits torso acceleration.',
      tag: 'Humanoid',
      tagClass: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      key: 'heavy_hauler_skid',
      icon: <Truck className="w-5 h-5 text-amber-600" />,
      robotType: 'Autonomous Heavy Haulers',
      realWorldHazard:
        '50-ton earth-moving haulers descending 12% gravel slopes encounter loose mud during rain. Momentum overcomes tire adhesion, causing runaway skidding.',
      consequence: 'Quarry berm breach, severe vehicle rollover risk, and mine safety halt.',
      standard: 'ISO 17757 §4.3',
      automatedSolution: 'Grade-aware deceleration rate limiter that enforces dynamic retarder braking before slope entry.',
      tag: 'Heavy Off-Road',
      tagClass: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      key: 'manipulator_wrench_fault',
      icon: <Cpu className="w-5 h-5 text-emerald-600" />,
      robotType: 'Collaborative Robot Arms',
      realWorldHazard:
        'High-speed pick-and-place trajectories passing near kinematic singularities experience sudden joint torque spikes exceeding 195 Nm.',
      consequence: 'Safety controller trip-outs, dropped payloads, and broken collaborative safety compliance.',
      standard: 'ISO 10218 §5.10',
      automatedSolution: 'Cartesian jerk-limiting profile that smooths trajectory transitions near joint limits.',
      tag: 'Industrial Cell',
      tagClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      key: 'urban_rover_glare',
      icon: <Compass className="w-5 h-5 text-cyan-600" />,
      robotType: 'Urban Sidewalk Delivery Rovers',
      realWorldHazard:
        'Low-angle afternoon sun (up to 95,000 Lux) blinds forward RGB cameras while approaching crosswalks, triggering phantom obstacles and sudden stops in traffic.',
      consequence: 'Traffic blockages, pedestrian complaints, and municipal operating permit suspensions.',
      standard: 'ISO 22737 §6.4',
      automatedSolution: 'LiDAR/radar sensory confidence re-weighting rule when camera pixel saturation exceeds 85%.',
      tag: 'Last-Mile Mobility',
      tagClass: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    },
  ];

  return (
    <section className="py-4 space-y-4" aria-label="Autonomous Modalities and Solutions">
      {/* Database Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(55,53,47,0.09)] pb-3">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-[#2f3437] tracking-tight">
            Robotic Modality Fleet Architectures
          </h2>
          <span className="px-2 py-0.5 rounded-full bg-[#f1f1ef] text-[#787774] text-[11px] font-mono border border-[#e3e2e0]">
            5 Production Architectures
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs text-[#787774]">
          <span className="hover:bg-[#efefed] px-2 py-1 rounded cursor-pointer transition-colors">
            All Ground Truths
          </span>
          <span className="text-[#c4c4c2]">•</span>
          <span className="hover:bg-[#efefed] px-2 py-1 rounded cursor-pointer transition-colors font-medium text-[#2f3437]">
            Sort: Adversarial Severity
          </span>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modalityStories.map((item) => (
          <div
            key={item.key}
            className="rounded-xl bg-white border border-[rgba(55,53,47,0.09)] card-shadow hover:card-shadow-md hover:border-[rgba(55,53,47,0.18)] transition-all p-5 flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              {/* Header Icon + Type */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-[#fafaf9] border border-[rgba(55,53,47,0.08)] group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2f3437] group-hover:text-[#2383e2] transition-colors leading-tight">
                      {item.robotType}
                    </h3>
                    <span className="text-[10px] text-[#787774] mono">{item.standard}</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider mono border ${item.tagClass}`}
                >
                  {item.tag}
                </span>
              </div>

              {/* Real World Hazard Description */}
              <div className="space-y-1.5 text-xs">
                <div className="text-[11px] font-semibold text-[#787774] uppercase tracking-wider">
                  The Physical Failure:
                </div>
                <p className="text-[#5a5751] leading-relaxed">{item.realWorldHazard}</p>
              </div>

              {/* Consequence Alert */}
              <div className="p-2.5 rounded-lg bg-[#faecec] border border-[#f5d0d0] text-xs text-[#933434] leading-relaxed flex items-start space-x-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600" />
                <span>{item.consequence}</span>
              </div>

              {/* Automated Solution */}
              <div className="p-2.5 rounded-lg bg-[#edf3ec] border border-[#d3e5d7] text-xs text-[#34623f] leading-relaxed flex items-start space-x-2">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
                <span>
                  <strong className="font-semibold text-[#295232]">Diffraction Solution:</strong>{' '}
                  {item.automatedSolution}
                </span>
              </div>
            </div>

            {/* Direct Verification CTA Button */}
            <div className="pt-2 border-t border-[rgba(55,53,47,0.06)]">
              <button
                type="button"
                onClick={() => onSelectScenario(item.key)}
                className="w-full py-2 px-3 rounded-lg bg-[#fafaf9] hover:bg-[#2383e2] text-[#37352f] hover:text-white border border-[rgba(55,53,47,0.1)] hover:border-transparent text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs group-hover:bg-[#2383e2] group-hover:text-white"
              >
                <span>Verify &amp; Audit in 3D</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
