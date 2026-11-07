/**
 * Presentation Component: Interactive Fleet Downtime & ROI Exposure Model
 * Empirically proves how automated verification eliminates the $50k/hr line stoppage tax.
 */

'use client';

import React, { useState } from 'react';
import { Calculator, DollarSign, TrendingDown, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface LandingRoiSectionProps {
  readonly onOpenPricing: () => void;
}

export const LandingRoiSection: React.FC<LandingRoiSectionProps> = ({ onOpenPricing }) => {
  const [fleetSize, setFleetSize] = useState<number>(50);
  const [disengagements, setDisengagements] = useState<number>(4);
  const [costPerHour, setCostPerHour] = useState<number>(50000);

  // Benchmarked: 0.25h stall per unhandled stop, 12 months/year
  const totalHours = fleetSize * disengagements * 12 * 0.25;
  const annualCost = Math.round(totalHours * costPerHour);
  const savings = Math.round(annualCost * 0.8);

  return (
    <section id="roi" className="py-20 relative" aria-label="Financial ROI Exposure Model">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-blue-950 border border-blue-500/40 text-xs text-blue-300 font-mono">
            <Calculator className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Financial Exposure &amp; Payback Calculator
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight font-headline">
            Stop paying the $50,000/hr
            <br />
            <span className="text-orange-400">
              unhandled corner-case tax.
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-body">
            Every unexplained emergency stop or traction skid halts automated production lines. 
            Adjust your fleet metrics below to benchmark your exact financial exposure.
          </p>
        </div>

        {/* Interactive Calculator Container */}
        <div className="rounded-2xl bg-[#0e1320] border border-slate-800 p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Slider 1: Fleet Size */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold text-slate-200 font-body">
                  <label htmlFor="landingFleetSize" className="cursor-pointer">
                    Commercial Fleet Size:
                  </label>
                  <span className="font-mono text-blue-400 font-bold">{fleetSize} Robots</span>
                </div>
                <input
                  type="range"
                  id="landingFleetSize"
                  min="5"
                  max="300"
                  step="5"
                  value={fleetSize}
                  onChange={(e) => setFleetSize(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>5 units</span>
                  <span>150 units</span>
                  <span>300 units</span>
                </div>
              </div>

              {/* Slider 2: Disengagements */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold text-slate-200 font-body">
                  <label htmlFor="landingDisengagements" className="cursor-pointer">
                    Unhandled Disengagements per Robot / Month:
                  </label>
                  <span className="font-mono text-orange-400 font-bold">{disengagements} stops</span>
                </div>
                <input
                  type="range"
                  id="landingDisengagements"
                  min="1"
                  max="20"
                  step="1"
                  value={disengagements}
                  onChange={(e) => setDisengagements(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>1 stop (Rare)</span>
                  <span>10 stops (Average)</span>
                  <span>20 stops (Severe)</span>
                </div>
              </div>

              {/* Slider 3: Cost per Hour */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold text-slate-200 font-body">
                  <label htmlFor="landingCostPerHour" className="cursor-pointer">
                    Facility Stoppage Cost per Hour:
                  </label>
                  <span className="font-mono text-yellow-400 font-bold">
                    ${costPerHour.toLocaleString()} / hr
                  </span>
                </div>
                <input
                  type="range"
                  id="landingCostPerHour"
                  min="10000"
                  max="200000"
                  step="5000"
                  value={costPerHour}
                  onChange={(e) => setCostPerHour(Number(e.target.value))}
                  className="w-full accent-yellow-400 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>$10,000/hr (Light)</span>
                  <span>$50,000/hr (Industrial Benchmark)</span>
                  <span>$200,000/hr (Automotive Assembly)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#07090e] border border-slate-800 text-xs text-slate-400 flex items-center space-x-2.5 font-body">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Based on benchmarked 15-minute average stall time for safety clearance and telemetry triage.
                </span>
              </div>
            </div>

            {/* Right Output Card */}
            <div className="lg:col-span-5 bg-[#07090e] rounded-xl p-6 sm:p-8 text-center border border-slate-800 shadow-xl space-y-6">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Annual Downtime Exposure
                </span>
                <div className="text-3xl sm:text-4xl font-bold text-orange-400 font-headline tracking-tight">
                  ${annualCost.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400 font-body">
                  {totalHours.toLocaleString()} lost operational hours / year
                </div>
              </div>

              <div className="py-5 border-y border-slate-800 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-yellow-400 font-mono">
                  Net Capital Saved With Diffraction
                </span>
                <div className="text-4xl sm:text-5xl font-bold text-yellow-400 font-headline tracking-tight">
                  ${savings.toLocaleString()}
                </div>
                <div className="text-xs text-yellow-300 font-medium font-body">
                  80% elimination of corner-case regression field stops
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={onOpenPricing}
                  className="w-full py-3.5 px-6 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current text-yellow-300" />
                  <span>Lock In 30-Day Turnkey Pilot ($15k SOW)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-slate-400 font-mono">
                  Average customer ROI payback period: &lt; 7 Days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
