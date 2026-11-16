/**
 * Presentation Component: Interactive AMR Commissioning & FAE Cost ROI Calculator
 * Empirically compares the $200,000+ cost and 8-12 week delay of on-site FAE tuning
 * with Diffraction's automated 14-day zero-collision pilot.
 *
 * Strict Color Hunt 4-Color Palette: #2FA4D7, #F5E9D8, #3E2C23, #E76F2E (Zero Gradients).
 */

'use client';

import React, { useState } from 'react';
import { Calculator, ArrowRight, TrendingDown, Clock, Zap, CheckCircle2, Building, Wrench } from 'lucide-react';

interface LandingRoiSectionProps {
  readonly onOpenPricing: () => void;
}

export const LandingRoiSection: React.FC<LandingRoiSectionProps> = ({ onOpenPricing }) => {
  const [facilitiesCount, setFacilitiesCount] = useState<number>(4);
  const [faeWeeksPerSite, setFaeWeeksPerSite] = useState<number>(8);
  const [weeklyFaeBurn, setWeeklyFaeBurn] = useState<number>(24000);

  // Financial Calculations
  const manualCommissioningCost = facilitiesCount * faeWeeksPerSite * weeklyFaeBurn;
  const manualTotalWeeks = facilitiesCount * faeWeeksPerSite;

  // Diffraction Turnkey Pilot ($25k per facility, 2 weeks turnaround)
  const diffractionCost = facilitiesCount * 25000;
  const diffractionTotalWeeks = facilitiesCount * 2;

  const capitalSaved = manualCommissioningCost - diffractionCost;
  const savingsPct = Math.round((capitalSaved / manualCommissioningCost) * 100);
  const weeksSaved = manualTotalWeeks - diffractionTotalWeeks;

  return (
    <section id="roi" className="py-20 relative bg-[#F5E9D8]" aria-label="Commissioning Cost vs Diffraction Pilot">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-white border border-[#2FA4D7]/40 text-xs text-[#2FA4D7] font-mono">
            <Calculator className="w-3.5 h-3.5 text-[#2FA4D7]" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Commissioning Economics &amp; Pilot Purgatory ROI
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3E2C23] tracking-tight leading-tight font-headline">
            Stop paying the $250k
            <br />
            <span className="text-[#E76F2E]">
              on-site commissioning tax.
            </span>
          </h2>

          <p className="text-[#3E2C23]/80 text-sm sm:text-base leading-relaxed font-body">
            Flying 3 senior robotics engineers to live in hotels for 8 to 12 weeks manually hand-tuning wheel friction and braking limits drains cash and causes 70% of warehouse robotics pilots to stall. Compare your deployment costs below.
          </p>
        </div>

        {/* Interactive Calculator Container */}
        <div className="rounded-2xl bg-white border-2 border-[#3E2C23] p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Slider 1: Number of Facilities */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold text-[#3E2C23] font-body">
                  <label htmlFor="facilitiesCount" className="cursor-pointer">
                    Target Deployment Facilities / Customer Sites:
                  </label>
                  <span className="font-mono text-[#2FA4D7] font-bold">
                    {facilitiesCount} Facilities
                  </span>
                </div>
                <input
                  type="range"
                  id="facilitiesCount"
                  min="1"
                  max="20"
                  step="1"
                  value={facilitiesCount}
                  onChange={(e) => setFacilitiesCount(Number(e.target.value))}
                  className="w-full accent-[#2FA4D7] cursor-pointer"
                />
              </div>

              {/* Slider 2: Weeks per Site */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold text-[#3E2C23] font-body">
                  <label htmlFor="faeWeeks" className="cursor-pointer">
                    Traditional On-Site FAE Tuning Duration:
                  </label>
                  <span className="font-mono text-[#E76F2E] font-bold">
                    {faeWeeksPerSite} Weeks / Facility
                  </span>
                </div>
                <input
                  type="range"
                  id="faeWeeks"
                  min="4"
                  max="16"
                  step="1"
                  value={faeWeeksPerSite}
                  onChange={(e) => setFaeWeeksPerSite(Number(e.target.value))}
                  className="w-full accent-[#E76F2E] cursor-pointer"
                />
              </div>

              {/* Slider 3: FAE Team Weekly Burn */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold text-[#3E2C23] font-body">
                  <label htmlFor="faeBurn" className="cursor-pointer">
                    Weekly Cost for 2-3 FAEs (Salaries, Flights, Hotels, Per Diem):
                  </label>
                  <span className="font-mono text-[#3E2C23] font-bold">
                    ${weeklyFaeBurn.toLocaleString()} / week
                  </span>
                </div>
                <input
                  type="range"
                  id="faeBurn"
                  min="15000"
                  max="40000"
                  step="1000"
                  value={weeklyFaeBurn}
                  onChange={(e) => setWeeklyFaeBurn(Number(e.target.value))}
                  className="w-full accent-[#3E2C23] cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-[#3E2C23]/15 text-xs text-[#3E2C23]/70 font-mono">
                Assumes a team of 2-3 Field Application Engineers running on-site friction tests and manual PID calibration.
              </div>
            </div>

            {/* Right Financial Comparison Box */}
            <div className="lg:col-span-5 rounded-2xl bg-[#3E2C23] text-[#F5E9D8] border-2 border-[#3E2C23] p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold uppercase text-[#2FA4D7]">
                  Estimated Net Capital Savings
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-headline">
                  ${capitalSaved.toLocaleString()}
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold block">
                  {savingsPct}% Cost Reduction &amp; {weeksSaved} Weeks Saved
                </span>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10 text-xs font-mono">
                <div className="flex justify-between items-center bg-white/5 p-2.5 rounded-lg">
                  <span className="text-[#F5E9D8]/60">Manual On-Site Tuning:</span>
                  <span className="text-rose-400 font-bold">${manualCommissioningCost.toLocaleString()} ({manualTotalWeeks} wks)</span>
                </div>

                <div className="flex justify-between items-center bg-[#2FA4D7]/20 p-2.5 rounded-lg border border-[#2FA4D7]/30">
                  <span className="text-[#F5E9D8]">Diffraction 14-Day Pilots:</span>
                  <span className="text-[#2FA4D7] font-bold">${diffractionCost.toLocaleString()} ({diffractionTotalWeeks} wks)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenPricing}
                className="w-full py-3 rounded-xl bg-[#E76F2E] hover:bg-[#E76F2E]/90 text-white font-extrabold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <span>View 14-Day Pilot SOW Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
