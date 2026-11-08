/**
 * Presentation Component: Commercial Pricing & SOW Packages for Landing Page
 * Crystal-clear enterprise commercial pricing designed for immediate conversion.
 * Features 3 Productized Studio Sprints ($7,500 / $18,500 / $35,000)
 *
 * Palette: #2FA4D7 (Blue), #F5E9D8 (Beige Canvas), #3E2C23 (Espresso Brown), #E76F2E (Safety Orange)
 */

'use client';

import React from 'react';
import { SPRINT_PACKAGES } from '@/domain/synthetic/catalog';
import { CheckCircle2, Zap, ArrowRight, Sparkles, Building2, ShieldCheck, Clock } from 'lucide-react';

interface LandingPricingSectionProps {
  readonly onSelectPlan: (tier: string) => void;
  readonly onLaunchConsole: () => void;
}

export const LandingPricingSection: React.FC<LandingPricingSectionProps> = ({
  onSelectPlan,
  onLaunchConsole,
}) => {
  return (
    <section id="pricing" className="py-20 relative bg-[#F5E9D8]" aria-label="Commercial Pricing Plans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-white border border-[#2FA4D7]/40 text-xs text-[#2FA4D7] font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#E76F2E]" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Productized Studio Pricing
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3E2C23] tracking-tight font-headline">
            Fixed-Fee Sprints.
            <br />
            <span className="text-[#2FA4D7]">
              Delivered in 3 to 14 Days.
            </span>
          </h2>

          <p className="text-[#3E2C23]/80 text-sm sm:text-base leading-relaxed font-body">
            Stop waiting 6 months to recruit a simulation engineer. We use proprietary procedural tooling to build your calibrated OpenUSD stages and Cosmos datasets at 5x the speed.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {SPRINT_PACKAGES.map((pkg) => {
            const isFeatured = pkg.isPopular;
            return (
              <div
                key={pkg.id}
                className={`relative rounded-2xl bg-white border-2 p-8 shadow-sm flex flex-col justify-between space-y-8 ${
                  isFeatured
                    ? 'border-[#2FA4D7] shadow-md ring-2 ring-[#2FA4D7]/20'
                    : 'border-[#3E2C23]'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-md bg-[#2FA4D7] text-white font-bold text-[10px] uppercase tracking-wider shadow-sm font-mono">
                    MOST POPULAR SPRINT
                  </div>
                )}

                <div className="space-y-6 pt-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#E76F2E] font-mono">
                        {pkg.turnaroundDays}-Day SLA
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F5E9D8] text-[#3E2C23] font-bold border border-[#3E2C23]/15">
                        Fixed Scope
                      </span>
                    </div>

                    <div className="flex items-baseline space-x-2">
                      <span className="text-4xl sm:text-5xl font-bold text-[#3E2C23] font-headline tracking-tight">
                        ${pkg.priceUsd.toLocaleString()}
                      </span>
                      <span className="text-xs text-[#3E2C23]/60 font-mono">/ sprint</span>
                    </div>

                    <h3 className="text-lg font-bold text-[#3E2C23] font-headline">
                      {pkg.name}
                    </h3>

                    <p className="text-xs text-[#3E2C23]/80 leading-relaxed font-body">
                      {pkg.targetClient}
                    </p>
                  </div>

                  <div className="space-y-3 border-t border-[#3E2C23]/15 pt-6 text-xs text-[#3E2C23]/90 font-body">
                    {pkg.deliverables.map((d, i) => (
                      <div key={i} className="flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#2FA4D7] shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      onLaunchConsole();
                    }}
                    className={`w-full py-3.5 px-4 rounded-lg font-bold text-xs sm:text-sm tracking-wide shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                      isFeatured
                        ? 'bg-[#2FA4D7] hover:bg-[#258ec0] text-white'
                        : 'border-2 border-[#3E2C23] text-[#3E2C23] hover:bg-[#F5E9D8]'
                    }`}
                  >
                    <Zap className="w-4 h-4 fill-current text-[#F5E9D8]" />
                    <span>Configure Sprint SOW</span>
                  </button>
                  <span className="text-[10px] font-mono text-[#3E2C23]/60 text-center block">
                    {pkg.sla}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sim2Real Policy Transfer Guarantee Strip */}
        <div className="rounded-2xl bg-white border-2 border-[#3E2C23] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base sm:text-lg font-bold text-[#3E2C23] font-headline">
                The 100% Sim-to-Real Policy Transfer Guarantee
              </h4>
              <p className="text-xs sm:text-sm text-[#3E2C23]/80 font-body max-w-3xl">
                Every asset, procedural stage, and dataset undergoes Wasserstein distribution alignment verification. If your policy fails hardware deployment due to physical or visual simulation divergence, we re-calibrate at zero charge or refund 100% of your sprint fee.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLaunchConsole}
            className="px-6 py-3 rounded-lg bg-[#3E2C23] hover:bg-[#2A1D17] text-white text-xs sm:text-sm font-mono font-bold shrink-0 transition-colors cursor-pointer"
          >
            Review Feasibility (24h)
          </button>
        </div>
      </div>
    </section>
  );
};
