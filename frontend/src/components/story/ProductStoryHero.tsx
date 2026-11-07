/**
 * Presentation Component: Notion-Style Narrative Product Hero
 * Emulates the iconic, clean, distraction-free aesthetic of a Notion workspace document.
 */

'use client';

import React from 'react';
import { AnimateText } from '@/components/ui/AnimateText';

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
    <section className="relative rounded-2xl bg-white border border-[rgba(55,53,47,0.09)] card-shadow p-6 sm:p-10 lg:p-12 mb-8">
      {/* Top Notion Page Properties Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-6 text-xs border-b border-[rgba(55,53,47,0.06)] pb-4">
        <div className="flex items-center space-x-1.5 text-[#787774]">
          <span className="text-sm">🏷️</span>
          <span className="font-medium">Category:</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-[#e9f3f7] text-[#2e5d7d] font-medium text-[11px]">
          Physical AI Verification
        </span>

        <span className="text-[#c4c4c2] mx-1">•</span>

        <div className="flex items-center space-x-1.5 text-[#787774]">
          <span className="text-sm">🛡️</span>
          <span className="font-medium">Audit Compliance:</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-[#edf3ec] text-[#34623f] font-medium text-[11px]">
          ISO 3691-4 • ISO 13482 • ISO 17757 • ISO 10218
        </span>

        <span className="text-[#c4c4c2] mx-1">•</span>

        <div className="flex items-center space-x-1.5 text-[#787774]">
          <span className="text-sm">⚡</span>
          <span className="font-medium">Audit Latency:</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-[#fbf3db] text-[#835e16] font-medium text-[11px] mono">
          30 Seconds Turnkey
        </span>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Notion Page Icon */}
        <div className="text-4xl sm:text-5xl select-none" role="img" aria-label="Notion Robot Icon">
          🤖
        </div>

        {/* Notion Document Title with Text Animation */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#37352f] tracking-tight leading-[1.2]">
          <AnimateText text="Robots pass simulation in the lab." effect="soft-blur-in" delayMs={100} />
          <br className="hidden sm:inline" />
          <span className="text-[#2383e2]">
            <AnimateText text="They fail on the factory floor." effect="soft-blur-in" delayMs={500} />
          </span>
        </h1>

        {/* Notion Signature Callout Box */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#fbfbfa] border border-[rgba(55,53,47,0.12)] flex items-start space-x-3.5 text-[#37352f]">
          <span className="text-2xl select-none shrink-0" role="img" aria-label="Lightbulb">
            💡
          </span>
          <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
            <p className="font-semibold text-[#37352f]">
              The Real-World Dilemma:
            </p>
            <p className="text-[#5a5751]">
              In actual operations, slick wet floors, blinding sunlight, and shifting payloads cause autonomous robots to skid, 
              mysteriously E-stop, or fail ISO safety audits—costing industrial operators over <span className="font-semibold text-[#37352f]">$50,000/hour in line stoppages</span>. 
              Diffraction ingests a single incident log (<code className="bg-[#f1f1ef] px-1.5 py-0.5 rounded font-mono text-xs text-[#37352f]">.mcap</code> or ROS bag), 
              runs <span className="font-semibold text-[#37352f]">150+ adversarial physics stress-tests</span>, and generates 
              <span className="font-semibold text-[#37352f]"> turnkey ROS 2 safety code patches</span> with signed ISO compliance certificates in 30 seconds.
            </p>
          </div>
        </div>

        {/* Notion Minimalist Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onLaunchSandbox}
            className="min-h-[40px] px-4 py-2 bg-[#2383e2] hover:bg-[#1a73e8] active:scale-[0.99] text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center space-x-2 cursor-pointer"
          >
            <span>⚡ Open 3D Verification Sandbox</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          <button
            type="button"
            onClick={onExploreStory}
            className="min-h-[40px] px-4 py-2 bg-white hover:bg-[#efefed] text-[#37352f] text-xs font-medium rounded-lg border border-[#dfdfde] transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <span>📖 Read the 4-Act Story</span>
          </button>

          <button
            type="button"
            onClick={onOpenPricing}
            className="min-h-[40px] px-3.5 py-2 text-[#787774] hover:text-[#37352f] text-xs font-medium transition-colors cursor-pointer"
          >
            Enterprise $15k Pilot SOW →
          </button>
        </div>

        {/* Notion Key Stats Grid */}
        <div className="pt-6 border-t border-[rgba(55,53,47,0.06)] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-[#f7f6f3] border border-[rgba(55,53,47,0.06)]">
            <div className="text-xl font-bold text-[#37352f] font-mono">30 Sec</div>
            <div className="text-[#787774] text-[11px] mt-0.5">Log to signed audit dossier</div>
          </div>
          <div className="p-3 rounded-lg bg-[#f7f6f3] border border-[rgba(55,53,47,0.06)]">
            <div className="text-xl font-bold text-[#2e5d7d] font-mono">150+ Sweeps</div>
            <div className="text-[#787774] text-[11px] mt-0.5">Parallel physics edge cases</div>
          </div>
          <div className="p-3 rounded-lg bg-[#f7f6f3] border border-[rgba(55,53,47,0.06)]">
            <div className="text-xl font-bold text-[#34623f] font-mono">5 Modalities</div>
            <div className="text-[#787774] text-[11px] mt-0.5">Humanoid, Hauler, Arm, AMR, Rover</div>
          </div>
          <div className="p-3 rounded-lg bg-[#f7f6f3] border border-[rgba(55,53,47,0.06)]">
            <div className="text-xl font-bold text-[#835e16] font-mono">Zero Code Lock-in</div>
            <div className="text-[#787774] text-[11px] mt-0.5">Drop-in ROS 2 YAML patches</div>
          </div>
        </div>
      </div>
    </section>
  );
};
