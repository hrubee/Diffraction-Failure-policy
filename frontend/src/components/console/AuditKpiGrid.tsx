/**
 * Presentation Component: Audit KPI Metrics Grid
 */

import React from 'react';
import { AuditVerdict } from '@/domain/kinematics/types';

interface AuditKpiGridProps {
  readonly verdict: AuditVerdict | null;
}

export const AuditKpiGrid: React.FC<AuditKpiGridProps> = ({ verdict }) => {
  const score = verdict ? `${verdict.complianceScore}%` : '--';
  const scoreColor = verdict
    ? verdict.complianceScore >= 95
      ? 'text-emerald-600'
      : verdict.complianceScore >= 85
      ? 'text-amber-600'
      : 'text-rose-600'
    : 'text-slate-400';

  const rollouts = verdict ? String(verdict.totalScenarios) : '--';
  const friction = verdict ? `μ ≥ ${verdict.safeFriction}` : '--';
  const sysId = verdict?.sysIdProfile
    ? `μ = ${verdict.sysIdProfile.estimated_surface_friction_mu}`
    : '--';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mono">Safety Score</div>
        <div className={`text-2xl font-black mt-1 num-tabular ${scoreColor}`}>{score}</div>
      </div>
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mono">Sim Rollouts</div>
        <div className="text-2xl font-black text-slate-800 mt-1 num-tabular">{rollouts}</div>
      </div>
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mono">Safe Min Friction</div>
        <div className="text-2xl font-black text-slate-800 mt-1 num-tabular">{friction}</div>
      </div>
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mono">SysID Ground-Truth μ</div>
        <div className="text-2xl font-black text-blue-600 mt-1 num-tabular">{sysId}</div>
      </div>
    </div>
  );
};
