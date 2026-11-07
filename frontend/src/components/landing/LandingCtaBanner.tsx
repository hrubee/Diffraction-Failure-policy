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
    <section className="py-20 relative overflow-hidden" aria-label="Call to Action">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-white/[0.12] p-8 sm:p-14 text-center space-y-8 shadow-2xl overflow-hidden card-glow-blue">
          {/* Subtle Glow Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-xs text-cyan-400 mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                Autonomous Safety Guarantee
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Don’t let your robots learn physics
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                on your customer’s factory floor.
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Test your autonomous navigation stack against 150+ adversarial physical conditions right now. 
              Drop an incident log, review the 3D twin, and export drop-in ROS 2 YAML patches in 30 seconds.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={onLaunchConsole}
              className="min-h-[50px] px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 active:scale-[0.98] text-white text-sm font-bold shadow-xl shadow-blue-500/30 transition-all flex items-center space-x-2.5 cursor-pointer group"
            >
              <Zap className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
              <span>Launch 3D Verification App Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onOpenPricing}
              className="min-h-[50px] px-7 py-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-sm font-semibold border border-white/[0.12] transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Book $15k Pilot SOW</span>
            </button>
          </div>

          <div className="relative z-10 pt-4 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400 mono">
            <span>✓ No hardware changes required</span>
            <span>✓ Compatible with ROS 2 &amp; PX4</span>
            <span>✓ Signed ISO 3691-4 dossiers</span>
          </div>
        </div>
      </div>
    </section>
  );
};
