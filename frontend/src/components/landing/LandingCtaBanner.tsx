/**
 * Presentation Component: Final Conversion CTA Banner
 * Magnetic conversion hook leading directly into the Isaac Sim Synthetic Factory Studio.
 *
 * Strict Color Hunt 4-Color Palette: #2FA4D7, #F5E9D8, #3E2C23, #E76F2E (Zero Gradients).
 */

'use client';

import React from 'react';
import { Zap, ArrowRight, Sparkles, Server, Database } from 'lucide-react';

interface LandingCtaBannerProps {
  readonly onLaunchConsole: () => void;
  readonly onOpenPricing: () => void;
}

export const LandingCtaBanner: React.FC<LandingCtaBannerProps> = ({
  onLaunchConsole,
  onOpenPricing,
}) => {
  return (
    <section className="py-16 relative overflow-hidden bg-[#F5E9D8]" aria-label="Call to Action">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-[#3E2C23] border-2 border-[#2FA4D7] p-8 sm:p-12 text-center space-y-6 shadow-md text-[#F5E9D8]">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#4A372E] border border-[#2FA4D7]/40 text-xs text-[#2FA4D7] font-mono">
              <Server className="w-3.5 h-3.5 text-[#2FA4D7]" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                14-Day Pilot Program • Zero On-Site Risk
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight font-headline">
              Deploy Your Fleet With Mathematical Certainty.
              <br />
              <span className="text-[#2FA4D7]">
                Stop losing 8 weeks to floor slip.
              </span>
            </h2>

            <p className="text-[#F5E9D8]/90 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-body">
              Ingest a 5-second telemetry drop from your robot. In 14 days, receive a calibrated active-set CBF-QP safety governor (&lt; 0.1ms solve), 4D failure frontier analysis, and an ISO 3691-4 / ANSI R15.08 compliance dossier for your insurance underwriter.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onLaunchConsole}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-lg bg-[#2FA4D7] hover:bg-[#258ec0] text-white text-sm font-bold shadow-sm transition-all flex items-center justify-center space-x-2.5 cursor-pointer group"
            >
              <Zap className="w-4 h-4 fill-current text-[#F5E9D8] group-hover:scale-110 transition-transform" />
              <span>Request 14-Day Pilot SOW ($25k)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onOpenPricing}
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-[#F5E9D8] text-sm font-bold border border-white/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#E76F2E]" />
              <span>Pilot Terms &amp; Scope</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
