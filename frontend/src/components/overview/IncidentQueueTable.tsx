/**
 * Presentation Component: Multi-Modal Incident Queue Table (Notion Database Table Style)
 */

'use client';

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
      badgeClass: 'bg-[#e9f3f7] text-[#2e5d7d] border-[#d3e5ef]',
      failureSignature: 'ZMP Foot Slip • ISO 13482:2014 §5.3',
    },
    {
      key: 'heavy_hauler_skid',
      robotId: 'hauler_titan_09',
      facility: 'Nevada Heavy Autonomy',
      badge: 'Heavy Hauler (12T)',
      badgeClass: 'bg-[#fbf3db] text-[#835e16] border-[#ebdcb2]',
      failureSignature: '12% Grade Slide • ISO 17757:2019 §4.3',
    },
    {
      key: 'manipulator_wrench_fault',
      robotId: 'arm_ur16e_cell2',
      facility: 'Stuttgart Automation Cell',
      badge: '6-DOF Manipulator',
      badgeClass: 'bg-[#f4eff9] text-[#6940a5] border-[#e4d7f5]',
      failureSignature: 'Force = 195N > 140N • ISO/TS 15066',
    },
    {
      key: 'wheeled_amr_stopping_breach',
      robotId: 'carrier_amr_500',
      facility: 'Chicago Logistics Hub',
      badge: 'Wheeled Mobile AMR',
      badgeClass: 'bg-[#faecec] text-[#933434] border-[#f5d7d7]',
      failureSignature: 'μ = 0.35 Slip • ISO 3691-4 §5.2.3',
    },
    {
      key: 'urban_rover_glare',
      robotId: 'rover_scout_08',
      facility: 'Tokyo Urban Mobility',
      badge: 'Urban Sidewalk Rover',
      badgeClass: 'bg-[#edf3ec] text-[#34623f] border-[#d4e5d2]',
      failureSignature: '92,000 Lux Glare • ISO 22737:2021',
    },
  ];

  return (
    <div className="p-6 rounded-2xl bg-white border border-[rgba(55,53,47,0.09)] card-shadow space-y-3">
      <div className="flex justify-between items-center pb-2 border-b border-[rgba(55,53,47,0.06)]">
        <div className="flex items-center space-x-2">
          <span className="text-base">📋</span>
          <h3 className="text-sm font-bold text-[#37352f] tracking-tight">
            Fleet Black Box Ingestion Log Database
          </h3>
        </div>
        <span className="text-[11px] text-[#787774] mono">
          Auto-Captured Across 5 Global Proving Grounds
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[rgba(55,53,47,0.09)] text-[11px] text-[#787774] font-medium bg-[#f7f6f3]">
              <th scope="col" className="py-2.5 px-3">Robot ID</th>
              <th scope="col" className="py-2.5 px-3">Proving Ground</th>
              <th scope="col" className="py-2.5 px-3">Modality</th>
              <th scope="col" className="py-2.5 px-3">Failure Signature &amp; Standard</th>
              <th scope="col" className="py-2.5 px-3 text-center">Audit Status</th>
              <th scope="col" className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(55,53,47,0.06)]">
            {incidents.map((inc) => (
              <tr key={inc.key} className="hover:bg-[#f7f6f3]/60 transition-colors">
                <td className="py-2.5 px-3 font-semibold text-[#37352f] mono">{inc.robotId}</td>
                <td className="py-2.5 px-3 text-[#5a5751]">{inc.facility}</td>
                <td className="py-2.5 px-3">
                  <span className={`px-2 py-0.5 rounded border text-[11px] font-medium ${inc.badgeClass}`}>
                    {inc.badge}
                  </span>
                </td>
                <td className="py-2.5 px-3 mono text-[#37352f] num-tabular">{inc.failureSignature}</td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-2 py-0.5 rounded bg-[#edf3ec] text-[#34623f] border border-[#d4e5d2] font-medium text-[10px] mono">
                    VERIFIED
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <button
                    type="button"
                    onClick={() => onOpenAudit(inc.key)}
                    className="min-h-[30px] px-2.5 py-1 bg-white hover:bg-[#efefed] border border-[#dfdfde] text-[#37352f] font-medium rounded-md text-xs transition-colors cursor-pointer"
                  >
                    Open Audit ↗
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
