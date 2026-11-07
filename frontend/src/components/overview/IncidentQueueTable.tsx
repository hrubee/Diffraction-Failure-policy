/**
 * Presentation Component: Multi-Modal Incident Queue Table
 */

import React from 'react';

interface IncidentQueueTableProps {
  readonly onOpenAudit: (key: string) => void;
}

export const IncidentQueueTable: React.FC<IncidentQueueTableProps> = ({ onOpenAudit }) => {
  const incidents = [
    {
      key: 'humanoid_zmp_slip',
      robotId: 'humanoid_digit_03',
      facility: 'Munich Proving Ground',
      badge: 'Bipedal Humanoid',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      failureSignature: 'ZMP Foot Slip • ISO 13482:2014 Clause 5.3',
    },
    {
      key: 'heavy_hauler_skid',
      robotId: 'hauler_titan_09',
      facility: 'Nevada Heavy Autonomy',
      badge: 'Heavy Hauler (12T)',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      failureSignature: '12% Grade Slide • ISO 17757:2019 Clause 4.3',
    },
    {
      key: 'manipulator_wrench_fault',
      robotId: 'arm_ur16e_cell2',
      facility: 'Stuttgart Automation Cell',
      badge: '6-DOF Manipulator',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      failureSignature: 'Force = 195N > 140N • ISO/TS 15066',
    },
    {
      key: 'wheeled_amr_stopping_breach',
      robotId: 'carrier_amr_500',
      facility: 'Chicago Logistics Hub',
      badge: 'Wheeled Mobile AMR',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      failureSignature: 'μ = 0.35 Slip • ISO 3691-4 Clause 5.2.3',
    },
    {
      key: 'urban_rover_glare',
      robotId: 'rover_scout_08',
      facility: 'Tokyo Urban Mobility',
      badge: 'Urban Sidewalk Rover',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
      failureSignature: '92,000 Lux Glare • ISO 22737:2021',
    },
  ];

  return (
    <div className="p-6 rounded-2xl bg-white border border-subtle card-shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-blue-600" />
          <span>Enterprise Fleet Sentinel Live Incident Queue</span>
        </h3>
        <span className="text-[11px] text-slate-400 mono">Auto-Captured Across 5 Global Proving Grounds</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] text-slate-500 uppercase tracking-wider mono bg-slate-50/70">
              <th scope="col" className="py-2.5 px-3">Robot ID</th>
              <th scope="col" className="py-2.5 px-3">Autonomous Proving Ground</th>
              <th scope="col" className="py-2.5 px-3">Kinematic Robot Class</th>
              <th scope="col" className="py-2.5 px-3">Physical Failure Signature &amp; Standard</th>
              <th scope="col" className="py-2.5 px-3 text-center">Safety Status</th>
              <th scope="col" className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {incidents.map((inc) => (
              <tr key={inc.key} className="hover:bg-slate-50/50">
                <td className="py-3 px-3 font-bold text-slate-900 mono">{inc.robotId}</td>
                <td className="py-3 px-3 text-slate-600">{inc.facility}</td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded border mono text-[11px] ${inc.badgeClass}`}>
                    {inc.badge}
                  </span>
                </td>
                <td className="py-3 px-3 mono text-slate-700 num-tabular">{inc.failureSignature}</td>
                <td className="py-3 px-3 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] mono">
                    VERIFIED
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    type="button"
                    onClick={() => onOpenAudit(inc.key)}
                    className="min-h-[36px] px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs mono cursor-pointer"
                  >
                    Open Audit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
