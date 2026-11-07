/**
 * Presentation Component: Audit KPI Metrics Grid
 * Styled with exact Color Hunt palette: #2FA4D7, #F5E9D8, #3E2C23, #E76F2E
 */

'use client';

import React from 'react';
import { AuditVerdict } from '@/domain/kinematics/types';

interface AuditKpiGridProps {
  readonly verdict: AuditVerdict | null;
}

export const AuditKpiGrid: React.FC<AuditKpiGridProps> = ({ verdict }) => {
  if (!verdict) return null; // Keep studio clean until audit results are available

  const score = `${verdict.complianceScore}%`;
  const scoreColor =
    verdict.complianceScore >= 90
      ? 'text-emerald-700'
      : verdict.complianceScore >= 75
      ? 'text-[#E76F2E]'
      : 'text-rose-700';

  const rollouts = String(verdict.totalScenarios);
  const friction = `μ ≥ ${verdict.safeFriction}`;
  const sysId = verdict?.sysIdProfile
    ? `μ = ${verdict.sysIdProfile.estimated_surface_friction_mu}`
    : '--';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      <div className="p-2.5 rounded-xl bg-[#FAF4EB] border border-[#3E2C23]/15 text-center">
        <div className="text-[10px] font-bold text-[#3E2C23]/60 uppercase tracking-wide font-mono">
          Safety Score
        </div>
        <div className={`text-lg font-bold mt-0.5 font-mono ${scoreColor}`}>{score}</div>
      </div>

      <div className="p-2.5 rounded-xl bg-[#FAF4EB] border border-[#3E2C23]/15 text-center">
        <div className="text-[10px] font-bold text-[#3E2C23]/60 uppercase tracking-wide font-mono">
          Sim Rollouts
        </div>
        <div className="text-lg font-bold text-[#3E2C23] mt-0.5 font-mono">{rollouts}</div>
      </div>

      <div className="p-2.5 rounded-xl bg-[#FAF4EB] border border-[#3E2C23]/15 text-center">
        <div className="text-[10px] font-bold text-[#3E2C23]/60 uppercase tracking-wide font-mono">
          Safe Min Friction
        </div>
        <div className="text-lg font-bold text-[#3E2C23] mt-0.5 font-mono">{friction}</div>
      </div>

      <div className="p-2.5 rounded-xl bg-[#FAF4EB] border border-[#3E2C23]/15 text-center">
        <div className="text-[10px] font-bold text-[#3E2C23]/60 uppercase tracking-wide font-mono">
          SysID Ground-Truth μ
        </div>
        <div className="text-lg font-bold text-[#2FA4D7] mt-0.5 font-mono">{sysId}</div>
      </div>
    </div>
  );
};
