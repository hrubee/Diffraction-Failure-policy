/**
 * Presentation Component: Carrier Insurance Underwriting Shield Banner
 */

import React from 'react';

export const UnderwritingBanner: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900 via-slate-900 to-blue-950 text-white card-shadow-md grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
      <div className="md:col-span-8 flex items-center space-x-5">
        <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
          <span className="text-2xl font-black mono">AAA</span>
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-emerald-400 mono tracking-wider">
            Fleet Safety Rating (FSR)
          </div>
          <h3 className="text-xl font-black text-white">Tier 1 Qualified: 30% Commercial Premium Reduction</h3>
          <p className="text-xs text-slate-300 mt-1">
            Facility composite safety score of <strong className="text-white num-tabular">94.2%</strong> exceeds the minimum 90.0% threshold mandated by commercial robotics liability carriers.
          </p>
        </div>
      </div>
      <div className="md:col-span-4 p-4 rounded-xl bg-white/5 border border-white/10 text-center">
        <div className="text-[10px] uppercase font-bold text-slate-400 mono">Annual Liability Rebate</div>
        <div className="text-3xl font-black text-emerald-400 mt-1 num-tabular">$60,000</div>
        <div className="text-[10px] text-slate-300 mt-1">Based on $200k base fleet policy</div>
      </div>
    </div>
  );
};
