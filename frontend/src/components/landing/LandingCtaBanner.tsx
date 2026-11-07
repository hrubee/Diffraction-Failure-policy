/**
 * Presentation Component: Final Conversion CTA Banner
 * Magnetic end-of-page conversion hook leading directly into the interactive app or pilot booking.
 * Palette: #2FA4D7 (Blue), #F5E9D8 (Beige Canvas), #3E2C23 (Espresso Brown), #E76F2E (Safety Orange)
 */

'use client';

import React from 'react';
import { Zap, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

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
              <ShieldCheck className="w-3.5 h-3.5 text-[#2FA4D7]" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                Autonomous Safety Guarantee
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight font-headline">
              Don’t let your robots learn physics
              <br />
              <span className="text-[#E76F2E]">
                on your customer’s factory floor.
              </span>
            </h2>

            <p className="text-[#F5E9D8]/90 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-body">
              Test your autonomous navigation stack against 150+ adversarial physical conditions right now. 
              Drop an incident log, review the 3D twin, and export drop-in ROS 2 YAML patches in 30 seconds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onLaunchConsole}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-lg bg-[#2FA4D7] hover:bg-[#258ec0] active:bg-[#1d749e] text-white text-sm font-bold shadow-sm transition-all flex items-center justify-center space-x-2.5 cursor-pointer group"
            >
              <Zap className="w-4 h-4 fill-current text-[#F5E9D8] group-hover:scale-110 transition-transform" />
              <span>Launch Diffract Studio Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onOpenPricing}
              className="w-full sm:w-auto min-h-[48px] px-7 py-3 rounded-lg bg-[#FAF4EB] hover:bg-white text-[#3E2C23] text-sm font-bold border border-[#F5E9D8] transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#E76F2E]" />
              <span>Book $15k Pilot SOW</span>
            </button>
          </div>

          <div className="pt-4 flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs text-[#F5E9D8]/80 font-mono">
            <span><strong className="text-[#2FA4D7]">✓</strong> No hardware changes required</span>
            <span><strong className="text-[#E76F2E]">✓</strong> Compatible with ROS 2 &amp; PX4</span>
            <span><strong className="text-[#2FA4D7]">✓</strong> Signed ISO 3691-4 dossiers</span>
          </div>
        </div>
      </div>
    </section>
  );
};
