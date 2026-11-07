/**
 * Presentation Component: Executive Operations Fleet KPI Tiles (Notion Style)
 */

'use client';

import React from 'react';

export const FleetKpiTiles: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="p-4 rounded-xl bg-white border border-[rgba(55,53,47,0.09)] card-shadow">
        <div className="flex justify-between items-start mb-1.5">
          <span className="text-[11px] font-medium text-[#787774] mono">
            Mean Time Btw Interventions
          </span>
          <span className="text-[10px] font-medium text-[#34623f] bg-[#edf3ec] px-1.5 py-0.5 rounded num-tabular">
            +18.4%
          </span>
        </div>
        <div className="text-2xl font-bold text-[#37352f] tracking-tight num-tabular">
          142.8&nbsp;<span className="text-xs font-normal text-[#787774]">hours</span>
        </div>
        <div className="text-[11px] text-[#787774] mt-2 flex items-center space-x-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Zero human stops in last 48h</span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white border border-[rgba(55,53,47,0.09)] card-shadow">
        <div className="flex justify-between items-start mb-1.5">
          <span className="text-[11px] font-medium text-[#787774] mono">
            Fleet Safety Rating
          </span>
          <span className="text-[10px] font-medium text-[#34623f] bg-[#edf3ec] px-1.5 py-0.5 rounded">
            Tier 1
          </span>
        </div>
        <div className="text-2xl font-bold text-[#34623f] tracking-tight">FSR-AAA</div>
        <div className="text-[11px] text-[#787774] mt-2 flex items-center space-x-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>ANSI/RIA R15.08 Part 2 Certified</span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white border border-[rgba(55,53,47,0.09)] card-shadow">
        <div className="flex justify-between items-start mb-1.5">
          <span className="text-[11px] font-medium text-[#787774] mono">
            Adversarial Permutations
          </span>
          <span className="text-[10px] font-medium text-[#2e5d7d] bg-[#e9f3f7] px-1.5 py-0.5 rounded">
            Real-time
          </span>
        </div>
        <div className="text-2xl font-bold text-[#2e5d7d] tracking-tight num-tabular">
          25,400+&nbsp;<span className="text-xs font-normal text-[#787774]">runs</span>
        </div>
        <div className="text-[11px] text-[#787774] mt-2 flex items-center space-x-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          <span>Friction, Glare &amp; Latency Swept</span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white border border-[rgba(55,53,47,0.09)] card-shadow">
        <div className="flex justify-between items-start mb-1.5">
          <span className="text-[11px] font-medium text-[#787774] mono">
            Annual Insurance Savings
          </span>
          <span className="text-[10px] font-medium text-[#835e16] bg-[#fbf3db] px-1.5 py-0.5 rounded">
            Rebate
          </span>
        </div>
        <div className="text-2xl font-bold text-[#37352f] tracking-tight num-tabular">
          $60,000&nbsp;<span className="text-xs font-normal text-[#787774]">/ yr</span>
        </div>
        <div className="text-[11px] text-[#787774] mt-2 flex items-center space-x-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Underwriting rebate eligible</span>
        </div>
      </div>
    </div>
  );
};
