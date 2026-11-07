/**
 * Presentation Component: Narrative Product Hero
 * Bridges the gap between lab simulation and real-world robot deployment failures.
 */

'use client';

import React from 'react';

interface ProductStoryHeroProps {
  readonly onExploreStory: () => void;
  readonly onLaunchSandbox: () => void;
  readonly onOpenPricing: () => void;
}

export const ProductStoryHero: React.FC<ProductStoryHeroProps> = ({
  onExploreStory,
  onLaunchSandbox,
  onOpenPricing,
}) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white border border-slate-800 p-8 sm:p-12 lg:p-16 shadow-2xl mb-10">
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl space-y-6">
        {/* Category Pill */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold mono">
          <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
          <span>PHYSICAL AI SAFETY &amp; CONTINUOUS VERIFICATION PLATFORM</span>
        </div>

        {/* Primary Story Hook */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-slate-100">
          Robots pass simulation in the lab. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
            They fail on the factory floor.
          </span>
        </h1>

        {/* Plain English Value Proposition */}
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl font-normal">
          In real operations, slick wet floors, blinding sunlight, and shifting payloads cause robots to skid, 
          mysteriously E-stop, or fail ISO safety audits—costing industrial operators over <span className="text-white font-semibold">$50,000/hour in line stoppages</span>. 
          Diffraction ingests a single incident log (<code className="text-blue-300 font-mono text-sm">.mcap</code> or ROS bag), 
          runs <span className="text-white font-semibold">150+ adversarial physics stress-tests</span>, and generates 
          <span className="text-white font-semibold"> turnkey safety code patches</span> with signed ISO compliance certificates in 30 seconds.
        </p>

        {/* Primary Call-to-Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onLaunchSandbox}
            className="min-h-[48px] px-6 py-3 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center space-x-2.5 cursor-pointer"
          >
            <span>⚡ Launch Live 3D Sandbox</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          <button
            type="button"
            onClick={onExploreStory}
            className="min-h-[48px] px-6 py-3 bg-slate-800/80 hover:bg-slate-700/90 text-slate-200 hover:text-white text-sm font-semibold rounded-xl border border-slate-700 transition-colors flex items-center space-x-2 cursor-pointer"
          >
            <span>🎬 See How It Works (4 Steps)</span>
          </button>

          <button
            type="button"
            onClick={onOpenPricing}
            className="min-h-[48px] px-5 py-3 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors cursor-pointer"
          >
            Turnkey $15k Pilot SOW →
          </button>
        </div>

        {/* Proof Points & Standards Grid */}
        <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">30 Sec</div>
            <div className="text-slate-400 text-[11px] mt-0.5">Log to signed audit dossier</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-blue-400 font-mono">150+ Sweeps</div>
            <div className="text-slate-400 text-[11px] mt-0.5">Parallel physics edge cases</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">5 Modalities</div>
            <div className="text-slate-400 text-[11px] mt-0.5">Humanoid, Hauler, Arm, AMR, Rover</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-200 font-mono">Zero Code Lock-in</div>
            <div className="text-slate-400 text-[11px] mt-0.5">Drop-in ROS 2 &amp; Nav2 YAMLs</div>
          </div>
        </div>
      </div>
    </section>
  );
};
