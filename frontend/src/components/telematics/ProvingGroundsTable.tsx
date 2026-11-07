/**
 * Presentation Component: Autonomous Operational Design Domain (ODD) Proving Grounds Table
 */

import React from 'react';
import { PROVING_GROUNDS } from '@/domain/proving-grounds/models';

export const ProvingGroundsTable: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-subtle card-shadow space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Autonomous Operational Design Domain (ODD) Compliance &amp; Proving Grounds
        </h3>
        <span className="text-xs text-slate-500 mono">5 Global Proving Grounds Live Telematics</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] text-slate-500 uppercase tracking-wider mono bg-slate-50/70">
              <th scope="col" className="py-2.5 px-3">Proving Ground &amp; Site</th>
              <th scope="col" className="py-2.5 px-3">Robot Modality &amp; Model</th>
              <th scope="col" className="py-2.5 px-3">Physical Hazard Envelope</th>
              <th scope="col" className="py-2.5 px-3">Enforced Safety Governor</th>
              <th scope="col" className="py-2.5 px-3">Stopping Margin</th>
              <th scope="col" className="py-2.5 px-3 text-center">Risk Tier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {PROVING_GROUNDS.map((pg) => {
              const badgeClass =
                pg.primaryModality === 'bipedal_humanoid'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : pg.primaryModality === 'heavy_ackermann_hauler'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : pg.primaryModality === 'articulated_manipulator_arm'
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : pg.primaryModality === 'industrial_differential_drive'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-purple-50 text-purple-700 border-purple-200';

              return (
                <tr key={pg.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 font-bold text-slate-900">{pg.name}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded border mono text-[11px] ${badgeClass}`}>
                      {pg.robotModel}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 mono num-tabular">{pg.hazardDescription}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold mono">
                      {pg.enforcedGovernor}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-emerald-600 font-bold mono num-tabular">
                    {pg.stoppingMargin}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] mono">
                      {pg.riskTier}
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
