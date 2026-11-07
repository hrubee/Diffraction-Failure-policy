/**
 * Presentation Component: Commercial Pricing & SOW Packages for Landing Page
 * Crystal-clear enterprise commercial pricing designed for immediate conversion.
 */

'use client';

import React from 'react';
import { CheckCircle2, Zap, ArrowRight, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

interface LandingPricingSectionProps {
  readonly onSelectPlan: (tier: string) => void;
  readonly onLaunchConsole: () => void;
}

export const LandingPricingSection: React.FC<LandingPricingSectionProps> = ({
  onSelectPlan,
  onLaunchConsole,
}) => {
  return (
    <section id="pricing" className="py-20 relative" aria-label="Commercial Pricing Plans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-blue-950 border border-blue-500/40 text-xs text-blue-300 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Predictable Enterprise Commercials
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight font-headline">
            Start with a 30-Day Turnkey Pilot.
            <br />
            <span className="text-blue-400">
              Scale to full fleet operations.
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-body">
            Every package delivers signed ISO compliance dossiers and drop-in ROS 2 code patches. 
            Zero code lock-in.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Plan 1: 30-Day Turnkey Pilot */}
          <div className="relative rounded-2xl bg-[#0e1320] border-2 border-orange-500 p-8 shadow-xl flex flex-col justify-between space-y-8">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded bg-orange-600 text-white font-bold text-[10px] uppercase tracking-wider shadow-sm font-mono">
              RECOMMENDED FOR NEW FLEETS
            </div>

            <div className="space-y-6 pt-2">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400 font-mono">
                  30-Day Turnkey Pilot
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl sm:text-5xl font-bold text-white font-headline tracking-tight">
                    $15,000
                  </span>
                  <span className="text-xs text-slate-400 font-mono">one-time / site</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-body">
                  Turnkey verification on 1 facility with 3 incident audits and guaranteed signed ISO compliance dossiers.
                </p>
              </div>

              <div className="space-y-3 border-t border-slate-800 pt-6 text-xs text-slate-300 font-body">
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>3 incident root-cause audits (.mcap / ROS bags)</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>150+ parallel generative simulations per incident</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>Turnkey ROS 2 Nav2 &amp; PX4 code patches</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>Signed ISO 3691-4 / ISO 13482 audit dossier</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>Dedicated Physical AI verification engineer</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectPlan('pilot')}
              className="w-full py-3.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current text-yellow-300" />
              <span>Initiate $15k Pilot SOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Plan 2: Commercial Fleet License */}
          <div className="rounded-2xl bg-[#0e1320] border border-slate-800 hover:border-slate-700 p-8 shadow-xl flex flex-col justify-between space-y-8 transition-colors">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-mono">
                  Commercial Fleet License
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl sm:text-5xl font-bold text-white font-headline tracking-tight">
                    $4,500
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/ month</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-body">
                  Continuous safety policy monitoring and CI/CD automated regression gates for up to 50 robots.
                </p>
              </div>

              <div className="space-y-3 border-t border-slate-800 pt-6 text-xs text-slate-300 font-body">
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Up to 50 connected autonomous robots</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Unlimited monthly incident black-box audits</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>CI/CD GitHub Action regression testing</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Dynamic Edge Safety Governor integration</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>FSR-AAA telematics insurance risk rating</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectPlan('monthly')}
              className="w-full py-3.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm tracking-wide border border-slate-700 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Subscribe to Fleet License</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Plan 3: OEM Enterprise Tier */}
          <div className="rounded-2xl bg-[#0e1320] border border-slate-800 hover:border-slate-700 p-8 shadow-xl flex flex-col justify-between space-y-8 transition-colors">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-yellow-400 font-mono">
                  OEM Enterprise
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl sm:text-5xl font-bold text-white font-headline tracking-tight">
                    $12,000
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/ month</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-body">
                  For Tier-1 robotics OEMs and massive fleet operators requiring air-gapped on-premises security.
                </p>
              </div>

              <div className="space-y-3 border-t border-slate-800 pt-6 text-xs text-slate-300 font-body">
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <span>Unlimited robots across global proving grounds</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <span>Air-gapped on-premises / private VPC deployment</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <span>Hardware-in-the-loop (HIL) simulator bridges</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <span>Custom ROS 2 C++ safety controller packages</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <span>24/7 dedicated engineering SLA &amp; insurance backing</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectPlan('oem')}
              className="w-full py-3.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-yellow-300 border border-yellow-400/40 font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4" />
              <span>Contact OEM Architecture Team</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
