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
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-xs text-blue-400 mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Predictable Enterprise Commercials
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Start with a 30-Day Turnkey Pilot.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
              Scale to full fleet operations.
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Every package delivers signed ISO compliance dossiers and drop-in ROS 2 code patches. 
            Zero code lock-in.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Plan 1: 30-Day Turnkey Pilot */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#131a29] to-[#0c101a] border-2 border-cyan-500/50 p-8 shadow-2xl flex flex-col justify-between space-y-8 card-glow-blue">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-[10px] uppercase tracking-wider shadow-md">
              RECOMMENDED FOR NEW FLEETS
            </div>

            <div className="space-y-6 pt-2">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 mono">
                  30-Day Turnkey Pilot
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                    $15,000
                  </span>
                  <span className="text-xs text-slate-400 font-mono">one-time / site</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Turnkey verification on 1 facility with 3 incident audits and guaranteed signed ISO compliance dossiers.
                </p>
              </div>

              <div className="space-y-3 border-t border-white/[0.08] pt-6 text-xs text-slate-300">
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>3 incident root-cause audits (.mcap / ROS bags)</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>150+ parallel generative simulations per incident</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Turnkey ROS 2 Nav2 &amp; PX4 code patches</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Signed ISO 3691-4 / ISO 13482 audit dossier</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Dedicated Physical AI verification engineer</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectPlan('pilot')}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Initiate $15k Pilot SOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Plan 2: Commercial Fleet License */}
          <div className="rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] hover:border-white/[0.18] p-8 shadow-xl flex flex-col justify-between space-y-8 transition-all">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mono">
                  Commercial Fleet License
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                    $4,500
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/ month</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Continuous safety policy monitoring and CI/CD automated regression gates for up to 50 robots.
                </p>
              </div>

              <div className="space-y-3 border-t border-white/[0.08] pt-6 text-xs text-slate-300">
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Up to 50 connected autonomous robots</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Unlimited monthly incident black-box audits</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>CI/CD GitHub Action regression testing</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Dynamic Edge Safety Governor integration</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>FSR-AAA telematics insurance risk rating</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectPlan('monthly')}
              className="w-full py-3.5 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-bold text-xs sm:text-sm tracking-wide border border-white/[0.1] transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Subscribe to Fleet License</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Plan 3: OEM Enterprise Tier */}
          <div className="rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] hover:border-white/[0.18] p-8 shadow-xl flex flex-col justify-between space-y-8 transition-all">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 mono">
                  OEM Enterprise
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                    $12,000
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/ month</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  For Tier-1 robotics OEMs and massive fleet operators requiring air-gapped on-premises security.
                </p>
              </div>

              <div className="space-y-3 border-t border-white/[0.08] pt-6 text-xs text-slate-300">
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Unlimited robots across global proving grounds</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Air-gapped on-premises / private VPC deployment</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Hardware-in-the-loop (HIL) simulator bridges</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Custom ROS 2 C++ safety controller packages</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>24/7 dedicated engineering SLA &amp; insurance backing</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectPlan('oem')}
              className="w-full py-3.5 px-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/25 font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center space-x-2 cursor-pointer"
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
