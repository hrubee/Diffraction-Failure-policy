/**
 * Presentation Component: Multi-Modal Robotic Class Card
 */

import React from 'react';
import { RobotModality } from '@/domain/kinematics/types';

interface ModalityCardProps {
  readonly modality: RobotModality;
  readonly title: string;
  readonly badge: string;
  readonly badgeColor: string;
  readonly description: string;
  readonly standard: string;
  readonly onSelect: () => void;
}

export const ModalityCard: React.FC<ModalityCardProps> = ({
  title,
  badge,
  badgeColor,
  description,
  standard,
  onSelect,
}) => {
  return (
    <div className="p-4 rounded-xl bg-white border border-subtle card-shadow flex flex-col justify-between space-y-3">
      <div>
        <div className="flex justify-between items-start mb-1.5">
          <span className="text-xl" aria-hidden="true">
            {badge.includes('HUMANOID') ? '🦿' : badge.includes('HAULER') ? '🚜' : badge.includes('MANIPULATOR') ? '🦾' : badge.includes('WHEELED') ? '🤖' : '🛴'}
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold mono uppercase ${badgeColor}`}>
            {badge}
          </span>
        </div>
        <div className="text-xs font-bold text-slate-900">{title}</div>
        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{description}</p>
      </div>
      <button
        type="button"
        onClick={onSelect}
        className="text-[11px] font-bold text-blue-600 hover:text-blue-700 text-left cursor-pointer flex items-center space-x-1"
      >
        <span>Verify {standard}</span>
        <span>&rarr;</span>
      </button>
    </div>
  );
};
