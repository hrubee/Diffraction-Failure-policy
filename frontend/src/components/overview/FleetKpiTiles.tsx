/**
 * Presentation Component: Executive Operations Fleet KPI Tiles
 */

import React from 'react';

export const FleetKpiTiles: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-5 rounded-2xl bg-white border border-subtle card-shadow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mono">
            Mean Time Btw Interventions
          </span>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded num-tabular">
            +18.4%
          </span>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight num-tabular">
          142.8&nbsp;<span className="text-xs font-semibold text-slate-400">hours</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-2 flex items-center space-x-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Zero human stops in last 48h</span>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-white border border-subtle card-shadow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mono">
            Fleet Safety Rating
          </span>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            Tier 1
          </span>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">FSR-AAA</div>
        <div className="text-[11px] text-slate-500 mt-2 flex items-center space-x-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>ANSI/RIA R15.08 Part 2 Certified</span>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-white border border-subtle card-shadow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mono">
            Adversarial Permutations
          </span>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
            Real-time
          </span>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight num-tabular">
          25,400+
        </div>
        <div className="text-[11px] text-slate-500 mt-2 flex items-center space-x-1">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          <span>Friction, Glare &amp; Latency Swept</span>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-white border border-subtle card-shadow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mono">
            Annual Insurance Savings
          </span>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
            Active
          </span>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-indigo-600 tracking-tight num-tabular">
          $60,000&nbsp;<span className="text-xs font-semibold text-slate-400">/ yr</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-2 flex items-center space-x-1">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
          <span>Underwriting rebate eligible</span>
        </div>
      </div>
    </div>
  );
};
