/**
 * Presentation Component: Regulatory Standards Compliance Matrix Table
 */

import React from 'react';
import { RegulatoryClause } from '@/domain/kinematics/types';

interface RegulatoryComplianceTableProps {
  readonly clauses: readonly RegulatoryClause[];
}

export const RegulatoryComplianceTable: React.FC<RegulatoryComplianceTableProps> = ({ clauses }) => {
  if (clauses.length === 0) return null;

  return (
    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mono flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-blue-600" />
          <span>Regulatory Standards Compliance (Multi-Modal ISO / ANSI / UL)</span>
        </h4>
        <span className="text-[10px] text-slate-400 mono">DUE DILIGENCE AUDIT</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] text-slate-500 uppercase mono bg-slate-50/70">
              <th scope="col" className="py-2 px-3">Standard &amp; Clause</th>
              <th scope="col" className="py-2 px-3">Safety Requirement &amp; Margin</th>
              <th scope="col" className="py-2 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clauses.map((r, idx) => {
              const badgeStyle =
                r.status === 'COMPLIANT'
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : r.status === 'CONDITIONAL'
                  ? 'border-amber-300 bg-amber-50 text-amber-700'
                  : 'border-red-300 bg-red-50 text-red-700';

              return (
                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900 text-xs">{r.standard}</div>
                    <div className="text-[10px] text-slate-500 mono">{r.clause}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="text-xs font-semibold text-slate-800">{r.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{r.requirementSummary}</div>
                    <div className="text-[11px] text-blue-600 mono mt-1 font-medium num-tabular">
                      {r.observedMargin}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-center align-middle">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${badgeStyle} mono`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
