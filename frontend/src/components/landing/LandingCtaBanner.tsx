/**
 * Presentation Component: Final Conversion CTA Banner
 * Magnetic end-of-page conversion hook leading directly into the interactive app or pilot booking.
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
    <section className="py-16 relative overflow-hidden" aria-label="Call to Action">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-[#0e1320] border-2 border-blue-600 p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-blue-950 border border-blue-500/40 text-xs text-blue-300 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                Autonomous Safety Guarantee
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight font-headline">
              Don’t let your robots learn physics
              <br />
              <span className="text-orange-400">
                on your customer’s factory floor.
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-body">
              Test your autonomous navigation stack against 150+ adversarial physical conditions right now. 
              Drop an incident log, review the 3D twin, and export drop-in ROS 2 YAML patches in 30 seconds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onLaunchConsole}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-bold shadow-md transition-all flex items-center justify-center space-x-2.5 cursor-pointer group"
            >
              <Zap className="w-4 h-4 fill-current text-yellow-300 group-hover:scale-110 transition-transform" />
              <span>Launch 3D Verification App Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onOpenPricing}
              className="w-full sm:w-auto min-h-[48px] px-7 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-yellow-300 text-sm font-bold border border-yellow-400/40 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>Book $15k Pilot SOW</span>
            </button>
          </div>

          <div className="pt-4 flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs text-slate-400 font-mono">
            <span><strong className="text-yellow-400">✓</strong> No hardware changes required</span>
            <span><strong className="text-blue-400">✓</strong> Compatible with ROS 2 &amp; PX4</span>
            <span><strong className="text-orange-400">✓</strong> Signed ISO 3691-4 dossiers</span>
          </div>
        </div>
      </div>
    </section>
  );
};
