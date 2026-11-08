/**
 * Presentation Component: Commercial Productized Studio Pricing & Sprints
 * Features the 3 fixed-scope productized sprint tiers:
 * - Package 1: Robot USD Physics Rig ($7,500 • 3 Days)
 * - Package 2: Procedural Training Stage ($18,500 • 7 Days)
 * - Package 3: Cosmos Synthetic Dataset ($35,000 • 14 Days)
 *
 * Strict Color Hunt 4-Color Palette: #2FA4D7, #F5E9D8, #3E2C23, #E76F2E (Zero Gradients).
 */

'use client';

import React from 'react';
import { SPRINT_PACKAGES } from '@/domain/synthetic/catalog';
import { Server, Zap, Check, ArrowRight, ShieldCheck, Sparkles, Clock } from 'lucide-react';

export const EnterprisePricingView: React.FC = () => {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2FA4D7]">
          Productized Studio Commercials
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3E2C23] font-headline tracking-tight">
          Fixed-Fee Sprints. Turnkey Deliverables.
        </h2>
        <p className="text-xs sm:text-sm text-[#3E2C23]/75 font-body leading-relaxed">
          Robotics startups don&apos;t have 6 months to hire a $220,000/yr simulation engineer. 
          Diffraction delivers calibrated PhysX 5 OpenUSD assets and Cosmos synthetic datasets in 3 to 14 days, backed by a 100% Sim-to-Real policy transfer guarantee.
        </p>
      </div>

      {/* 3 Sprint Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {SPRINT_PACKAGES.map((pkg) => {
          const isFeatured = pkg.isPopular;
          return (
            <div
              key={pkg.id}
              className={`p-6 sm:p-8 rounded-2xl bg-white border-2 flex flex-col justify-between space-y-6 relative transition-all ${
                isFeatured
                  ? 'border-[#2FA4D7] shadow-md ring-2 ring-[#2FA4D7]/20'
                  : 'border-[#3E2C23] shadow-xs'
              }`}
            >
              {isFeatured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#2FA4D7] rounded-full text-[10px] font-extrabold uppercase tracking-widest text-white font-mono shadow-xs">
                  MOST POPULAR SPRINT
                </div>
              )}

              <div className="space-y-5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#3E2C23]/70 uppercase tracking-wider">
                      {pkg.turnaroundDays}-Day Turnaround SLA
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F5E9D8] text-[#3E2C23] font-bold border border-[#3E2C23]/15">
                      Fixed Scope
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#3E2C23] font-headline">{pkg.name}</h3>
                  <div className="text-3xl sm:text-4xl font-black text-[#3E2C23] font-headline pt-1">
                    ${pkg.priceUsd.toLocaleString()}{' '}
                    <span className="text-xs font-normal text-[#3E2C23]/60 font-mono">/ sprint</span>
                  </div>
                </div>

                <p className="text-xs text-[#3E2C23]/80 leading-relaxed font-body">
                  {pkg.targetClient}
                </p>

                {/* Deliverables Checklist */}
                <div className="space-y-2 border-t border-[#3E2C23]/15 pt-5">
                  <span className="text-[11px] font-mono font-bold uppercase text-[#3E2C23]/70 block">
                    Turnkey Deliverables:
                  </span>
                  <ul className="text-xs text-[#3E2C23] space-y-2.5 font-body">
                    {pkg.deliverables.map((d, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-[#2FA4D7] shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer / CTA */}
              <div className="space-y-3 pt-4 border-t border-[#3E2C23]/10">
                <a
                  href="#sow-builder"
                  onClick={() => {
                    window.location.hash = '#studio';
                  }}
                  className={`w-full py-3 rounded-xl text-center text-xs font-bold font-mono transition-all block cursor-pointer ${
                    isFeatured
                      ? 'bg-[#2FA4D7] hover:bg-[#258ec0] text-white shadow-xs'
                      : 'border-2 border-[#3E2C23] text-[#3E2C23] hover:bg-[#F5E9D8]'
                  }`}
                >
                  Configure {pkg.name} SOW →
                </a>
                <span className="text-[10px] font-mono text-[#3E2C23]/60 text-center block">
                  {pkg.sla}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enterprise Retainer Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#3E2C23] text-[#F5E9D8] border-2 border-[#3E2C23] shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E76F2E] text-white uppercase">
            Dedicated Robotics Lab Retainer
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-headline text-white">
            Need an Embedded NVIDIA Simulation Squad?
          </h3>
          <p className="text-xs sm:text-sm text-[#F5E9D8]/80 leading-relaxed font-body">
            For robotics foundation model labs with multiple embodiments and weekly simulation runs. Dedicated simulation lead, custom procedural generators, and guaranteed cluster GPU quota.
          </p>
        </div>

        <div className="shrink-0 text-center sm:text-right space-y-2">
          <div className="text-2xl font-black text-[#2FA4D7] font-headline">From $28,000 / mo</div>
          <a
            href="mailto:contact@diffraction.in?subject=Dedicated%20Robotics%20Lab%20Retainer"
            className="px-5 py-2.5 rounded-lg bg-white text-[#3E2C23] hover:bg-[#F5E9D8] text-xs font-mono font-bold inline-block shadow-xs transition-colors cursor-pointer"
          >
            Inquire About Dedicated Retainer
          </a>
        </div>
      </div>
    </div>
  );
};
