/**
 * Presentation Component: 5 Robot Modality Segmented Selector Bar
 */

import React from 'react';

interface ModalitySegmentedBarProps {
  readonly activeKey: string;
  readonly onSelect: (key: string) => void;
  readonly disabled?: boolean;
}

const MODALITIES = [
  { key: 'humanoid_zmp_slip', label: '🦿 1. Humanoid', id: 'btnHazardHumanoid' },
  { key: 'heavy_hauler_skid', label: '🚜 2. Heavy Hauler', id: 'btnHazardHauler' },
  { key: 'manipulator_wrench_fault', label: '🦾 3. Manipulator', id: 'btnHazardManipulator' },
  { key: 'wheeled_amr_stopping_breach', label: '🤖 4. Wheeled AMR', id: 'btnHazardAMR' },
  { key: 'urban_rover_glare', label: '🛴 5. Urban Rover', id: 'btnHazardRover' },
];

export const ModalitySegmentedBar: React.FC<ModalitySegmentedBarProps> = ({
  activeKey,
  onSelect,
  disabled = false,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Robot Modality Selector">
      {MODALITIES.map((m) => {
        const isActive = activeKey === m.key;
        const cls = isActive
          ? 'px-2.5 py-1.5 bg-blue-600 text-white text-[11px] font-semibold rounded-lg mono cursor-pointer'
          : 'px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg mono cursor-pointer';

        return (
          <button
            key={m.key}
            type="button"
            id={m.id}
            disabled={disabled}
            onClick={() => onSelect(m.key)}
            className={cls}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
};
