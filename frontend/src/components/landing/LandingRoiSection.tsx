/**
 * Presentation Component: Interactive Teleoperation vs Synthetic Data ROI Calculator
 * Empirically compares the multi-million dollar cost of human VR teleoperation
 * with Diffraction's Isaac Sim parallel generation engine.
 *
 * Strict Color Hunt 4-Color Palette: #2FA4D7, #F5E9D8, #3E2C23, #E76F2E (Zero Gradients).
 */

'use client';

import React, { useState } from 'react';
import { Calculator, ArrowRight, TrendingDown, Clock, Zap, CheckCircle2 } from 'lucide-react';

interface LandingRoiSectionProps {
  readonly onOpenPricing: () => void;
}

export const LandingRoiSection: React.FC<LandingRoiSectionProps> = ({ onOpenPricing }) => {
  const [targetTrajectories, setTargetTrajectories] = useState<number>(100000);
  const [teleopHourlyRate, setTeleopHourlyRate] = useState<number>(120);
  const [demosPerHour, setDemosPerHour] = useState<number>(3);

  // Math
  const totalTeleopHours = Math.round(targetTrajectories / demosPerHour);
  const teleopCost = Math.round(totalTeleopHours * teleopHourlyRate);
  const teleopMonths = (totalTeleopHours / (40 * 4 * 5)).toFixed(1); // 5 operators full time

  // Diffraction Isaac Sim generation (approx $0.08 per 120-frame trajectory)
  const synthCost = Math.round(targetTrajectories * 0.08);
  const synthHours = ((targetTrajectories * 120) / (64 * 750) / 3600).toFixed(1); // 64 H100s

  const capitalSaved = teleopCost - synthCost;
  const savingsPct = Math.round((capitalSaved / teleopCost) * 100);

  return (
    <section id="roi" className="py-20 relative bg-[#F5E9D8]" aria-label="Teleoperation Cost vs Synthetic Factory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-white border border-[#2FA4D7]/40 text-xs text-[#2FA4D7] font-mono">
            <Calculator className="w-3.5 h-3.5 text-[#2FA4D7]" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              VLA Training Economics &amp; Cost Calculator
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3E2C23] tracking-tight leading-tight font-headline">
            Stop paying the $150/hr
            <br />
            <span className="text-[#E76F2E]">
              teleoperation data tax.
            </span>
          </h2>

          <p className="text-[#3E2C23]/80 text-sm sm:text-base leading-relaxed font-body">
            Collecting physical robot demonstrations with human teleoperators in VR rigs does not scale to the millions of trajectories needed for foundation models. Compare your costs below.
          </p>
        </div>

        {/* Interactive Calculator Container */}
        <div className="rounded-2xl bg-white border-2 border-[#3E2C23] p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Slider 1: Target Trajectories */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold text-[#3E2C23] font-body">
                  <label htmlFor="targetTrajectories" className="cursor-pointer">
                    Target Demonstration Trajectories:
                  </label>
                  <span className="font-mono text-[#2FA4D7] font-bold">
                    {targetTrajectories.toLocaleString()} Trajectories
                  </span>
                </div>
                <input
                  type="range"
                  id="targetTrajectories"
                  min="10000"
                  max="500000"
                  step="10000"
                  value={targetTrajectories}
                  onChange={(e) => setTargetTrajectories(Number(e.target.value))}
                  className="w-full accent-[#2FA4D7] cursor-pointer"
                />
              </div>

              {/* Slider 2: Teleoperator Hourly Cost */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold text-[#3E2C23] font-body">
                  <label htmlFor="teleopRate" className="cursor-pointer">
                    Teleoperator Hourly Labor + Rig Cost:
                  </label>
                  <span className="font-mono text-[#E76F2E] font-bold">
                    ${teleopHourlyRate}/hour
                  </span>
                </div>
                <input
                  type="range"
                  id="teleopRate"
                  min="40"
                  max="200"
                  step="10"
                  value={teleopHourlyRate}
                  onChange={(e) => setTeleopHourlyRate(Number(e.target.value))}
                  className="w-full accent-[#E76F2E] cursor-pointer"
                />
              </div>

              {/* Slider 3: Teleoperation Throughput */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold text-[#3E2C23] font-body">
                  <label htmlFor="demosPerHour" className="cursor-pointer">
                    Demonstrations Recorded Per Operator Hour:
                  </label>
                  <span className="font-mono text-[#3E2C23] font-bold">
                    {demosPerHour} demos/hr
                  </span>
                </div>
                <input
                  type="range"
                  id="demosPerHour"
                  min="1"
                  max="8"
                  step="1"
                  value={demosPerHour}
                  onChange={(e) => setDemosPerHour(Number(e.target.value))}
                  className="w-full accent-[#3E2C23] cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-[#3E2C23]/15 text-xs text-[#3E2C23]/70 font-mono">
                Assumes a team of 5 full-time VR teleoperators recording physical robot runs.
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
                  {savingsPct}% Cost Reduction vs Physical Teleop
                </span>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10 text-xs font-mono">
                <div className="flex justify-between items-center bg-white/5 p-2.5 rounded-lg">
                  <span className="text-[#F5E9D8]/60">Physical Teleoperation:</span>
                  <span className="text-rose-400 font-bold">${teleopCost.toLocaleString()} ({teleopMonths} mos)</span>
                </div>

                <div className="flex justify-between items-center bg-[#2FA4D7]/20 p-2.5 rounded-lg border border-[#2FA4D7]/30">
                  <span className="text-[#F5E9D8]">Diffraction Isaac Sim:</span>
                  <span className="text-[#2FA4D7] font-bold">${synthCost.toLocaleString()} ({synthHours} hrs)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenPricing}
                className="w-full py-3 rounded-xl bg-[#E76F2E] hover:bg-[#E76F2E]/90 text-white font-extrabold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <span>View Dedicated Cluster Pricing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
