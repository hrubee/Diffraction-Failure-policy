/**
 * Presentation Component: 5 Robot Modality Segmented Selector Bar
 * Keeps exact DOM IDs (#btnHazardHumanoid, etc.) intact for test suites
 * while rendering clean Lucide engineering icons and crisp typography.
 */

import React from 'react';
import { Activity, Truck, Cpu, Bot, Compass } from 'lucide-react';

interface ModalitySegmentedBarProps {
  readonly activeKey: string;
  readonly onSelect: (key: string) => void;
  readonly disabled?: boolean;
}

interface ModalityOption {
  readonly key: string;
  readonly label: string;
  readonly id: string;
  readonly icon: React.ReactNode;
}

export const ModalitySegmentedBar: React.FC<ModalitySegmentedBarProps> = ({
  activeKey,
  onSelect,
  disabled = false,
}) => {
  const modalities: readonly ModalityOption[] = [
    {
      key: 'humanoid_zmp_slip',
      label: '1. Humanoid',
      id: 'btnHazardHumanoid',
      icon: <Activity className="w-3.5 h-3.5" />,
    },
    {
      key: 'heavy_hauler_skid',
      label: '2. Heavy Hauler',
      id: 'btnHazardHauler',
      icon: <Truck className="w-3.5 h-3.5" />,
    },
    {
      key: 'manipulator_wrench_fault',
      label: '3. Manipulator',
      id: 'btnHazardManipulator',
      icon: <Cpu className="w-3.5 h-3.5" />,
    },
    {
      key: 'wheeled_amr_stopping_breach',
      label: '4. Wheeled AMR',
      id: 'btnHazardAMR',
      icon: <Bot className="w-3.5 h-3.5" />,
    },
    {
      key: 'urban_rover_glare',
      label: '5. Urban Rover',
      id: 'btnHazardRover',
      icon: <Compass className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Robot Modality Selector">
      {modalities.map((m) => {
        const isActive = activeKey === m.key;
        const cls = isActive
          ? 'px-3 py-1.5 bg-[#2383e2] text-white text-[11px] font-semibold rounded-lg mono transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer'
          : 'px-3 py-1.5 bg-[#f1f1ef] hover:bg-[#e6e5e3] text-[#4a4742] text-[11px] font-medium rounded-lg mono transition-colors flex items-center space-x-1.5 cursor-pointer';

        return (
          <button
            key={m.key}
            type="button"
            id={m.id}
            disabled={disabled}
            onClick={() => onSelect(m.key)}
            className={cls}
          >
            <span>{m.icon}</span>
            <span>{m.label}</span>
          </button>
        );
      })}
    </div>
  );
};
