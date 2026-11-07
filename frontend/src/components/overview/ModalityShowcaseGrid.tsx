/**
 * Presentation Component: Universal Multi-Modal Coverage Grid
 */

import React from 'react';
import { ModalityCard } from './ModalityCard';

interface ModalityShowcaseGridProps {
  readonly onSelectScenario: (key: string) => void;
}

export const ModalityShowcaseGrid: React.FC<ModalityShowcaseGridProps> = ({ onSelectScenario }) => {
  const cards = [
    {
      key: 'humanoid_zmp_slip',
      modality: 'bipedal_humanoid' as const,
      title: 'Bipedal Dynamic Balance',
      badge: 'HUMANOID',
      badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200',
      description: 'Foot-ground friction slip, ZMP stability margin drift, and balance recovery.',
      standard: 'ISO 13482',
    },
    {
      key: 'heavy_hauler_skid',
      modality: 'heavy_ackermann_hauler' as const,
      title: 'Heavy Off-Highway Incline',
      badge: 'HAULER 12T',
      badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200',
      description: '12-ton payload grade slide on loose aggregate and dynamic runaway stopping.',
      standard: 'ISO 17757',
    },
    {
      key: 'manipulator_wrench_fault',
      modality: 'articulated_manipulator_arm' as const,
      title: '6-DOF Tool Wrench Limits',
      badge: 'MANIPULATOR',
      badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
      description: 'Dynamic contact force spikes (>140N) & end-effector high-speed slip.',
      standard: 'ISO 10218',
    },
    {
      key: 'wheeled_amr_stopping_breach',
      modality: 'industrial_differential_drive' as const,
      title: 'Mobile Stopping Envelope',
      badge: 'WHEELED AMR',
      badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200',
      description: 'Degraded friction stopping distance & 0.50m safety envelope breaches.',
      standard: 'ISO 3691-4',
    },
    {
      key: 'urban_rover_glare',
      modality: 'urban_delivery_rover' as const,
      title: 'Pedestrian Crosswalk Glare',
      badge: 'URBAN ROVER',
      badgeColor: 'bg-purple-50 text-purple-700 border border-purple-200',
      description: 'Direct sunset (92k Lux) optical camera washout & false phantom E-stops.',
      standard: 'ISO 22737',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mono">
            Universal Multi-Modal Physical AI Coverage
          </span>
          <p className="text-xs text-slate-500">
            Automated physics verification, ZMP stability, dynamic contact force ceilings, and regulatory certification:
          </p>
        </div>
        <div className="flex items-center space-x-1.5 text-[10px] text-blue-600 font-bold mono">
          <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
            ISO 13482 • ISO 17757 • ISO 10218 • ISO 3691-4
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {cards.map((c) => (
          <ModalityCard
            key={c.key}
            modality={c.modality}
            title={c.title}
            badge={c.badge}
            badgeColor={c.badgeColor}
            description={c.description}
            standard={c.standard}
            onSelect={() => onSelectScenario(c.key)}
          />
        ))}
      </div>
    </div>
  );
};
