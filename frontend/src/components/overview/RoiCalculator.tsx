/**
 * Presentation Component: Interactive Fleet Downtime & ROI Exposure Model
 */

'use client';

import React, { useState } from 'react';

export const RoiCalculator: React.FC = () => {
  const [fleetSize, setFleetSize] = useState<number>(50);
  const [disengagements, setDisengagements] = useState<number>(4);
  const [costPerHour, setCostPerHour] = useState<number>(50000);

  // Benchmarked: 0.25h stall per unhandled stop, 12 months/year
  const totalHours = fleetSize * disengagements * 12 * 0.25;
  const annualCost = Math.round(totalHours * costPerHour);
  const savings = Math.round(annualCost * 0.8);

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-subtle card-shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Fleet Downtime &amp; ROI Exposure Model
          </h3>
          <p className="text-xs text-slate-500">
            Benchmark your site-specific loss from unhandled field stops against automated verification.
          </p>
        </div>
        <span className="text-xs font-bold text-blue-600 mono bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
          Interactive Model
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
              <label htmlFor="ovFleetInput" className="cursor-pointer">
                Commercial Fleet Size
              </label>
              <span id="ovFleetVal" className="mono text-blue-600 font-bold num-tabular">
                {fleetSize}&nbsp;Robots
              </span>
            </div>
            <input
              type="range"
              id="ovFleetInput"
              min="5"
              max="300"
              step="5"
              value={fleetSize}
              onChange={(e) => setFleetSize(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 mono num-tabular">
              <span>5 units</span>
              <span>150 units</span>
              <span>300 units</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
              <label htmlFor="ovDisengageInput" className="cursor-pointer">
                Disengagements per Robot / Month
              </label>
              <span id="ovDisengageVal" className="mono text-blue-600 font-bold num-tabular">
                {disengagements}&nbsp;incidents
              </span>
            </div>
            <input
              type="range"
              id="ovDisengageInput"
              min="1"
              max="20"
              step="1"
              value={disengagements}
              onChange={(e) => setDisengagements(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 mono num-tabular">
              <span>1 stop</span>
              <span>10 stops</span>
              <span>20 stops</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
              <label htmlFor="ovCostInput" className="cursor-pointer">
                Facility Stoppage Cost per Hour
              </label>
              <span id="ovCostVal" className="mono text-blue-600 font-bold num-tabular">
                ${costPerHour.toLocaleString()}&nbsp;/&nbsp;hr
              </span>
            </div>
            <input
              type="range"
              id="ovCostInput"
              min="10000"
              max="200000"
              step="5000"
              value={costPerHour}
              onChange={(e) => setCostPerHour(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 mono num-tabular">
              <span>$10,000/hr</span>
              <span>$100,000/hr</span>
              <span>$200,000/hr</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 text-white space-y-6 text-center card-shadow-md">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-rose-400 font-bold mono">
              Current Annual Downtime Exposure
            </div>
            <div className="text-3xl font-black text-white mt-1 num-tabular">
              ${annualCost.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Based on benchmark 0.25h facility stall per unhandled stop</p>
          </div>

          <div className="pt-5 border-t border-slate-800">
            <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold mono">
              Net Annual Capital Saved with Diffraction
            </div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 mt-1 num-tabular">
              ${savings.toLocaleString()}
            </div>
            <p className="text-[10px] text-emerald-400/90 mt-1 font-medium">
              80% elimination of corner-case field regressions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
