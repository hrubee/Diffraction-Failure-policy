/**
 * Presentation Component: Narrative Product Hero with Kinetic Typography
 * Combines Notion-level structural clarity with high-craft engineering motion.
 */

'use client';

import React from 'react';
import {
  Zap,
  BookOpen,
  ArrowRight,
  Clock,
  Activity,
  Layers,
  FileCode,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import {
  KineticRotatingHeadline,
  ShimmerBadge,
  KineticSplitReveal,
} from '@/components/ui/KineticTypography';

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
    <section className="relative rounded-2xl bg-white border border-[rgba(55,53,47,0.1)] card-shadow-md p-6 sm:p-10 lg:p-12 mb-8 overflow-hidden">

      {/* Top Notion Page Properties Bar */}
      <div className="relative z-10 flex flex-wrap items-center gap-2.5 mb-8 text-xs border-b border-[rgba(55,53,47,0.06)] pb-4.5">
        <div className="flex items-center space-x-1.5 text-[#787774]">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-radar-dot" />
          <span className="font-semibold tracking-wider uppercase text-[10px] text-[#37352f]">
            Physical AI Engine
          </span>
        </div>

        <span className="text-[#c4c4c2] mx-0.5">•</span>

        <span className="px-2.5 py-0.5 rounded-full bg-[#e9f3f7] text-[#2e5d7d] font-medium text-[11px] border border-[#d3e5ef]">
          Autonomous Fleet Verification
        </span>

        <span className="text-[#c4c4c2] mx-0.5 hidden sm:inline">•</span>

        <ShimmerBadge className="hidden sm:inline-flex text-[11px] bg-[#edf3ec] text-[#34623f] border-[#d8e6d9]">
          ISO 3691-4 • ISO 13482 • ISO 17757 • ISO 10218
        </ShimmerBadge>

        <span className="text-[#c4c4c2] mx-0.5 hidden lg:inline">•</span>

        <span className="hidden lg:inline-flex px-2.5 py-0.5 rounded-full bg-[#fbf3db] text-[#835e16] font-medium text-[11px] mono border border-[#f3e7c4]">
          ⚡ 30s Turnkey Dossier
        </span>
      </div>

      <div className="relative z-10 max-w-5xl space-y-7">
        {/* Kinetic Rotating Headline */}
        <KineticRotatingHeadline />

        {/* Narrative Callout Box */}
        <div className="p-4.5 sm:p-5.5 rounded-xl bg-[#fafaf9] border border-[rgba(55,53,47,0.12)] flex items-start space-x-4 text-[#37352f] transition-all hover:border-[rgba(55,53,47,0.2)]">
          <div className="p-2 rounded-lg bg-amber-100/70 text-amber-800 shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[#2f3437] tracking-tight text-sm">
                The Real-World Divergence Problem:
              </span>
              <span className="px-2 py-0.2 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-800 mono">
                $50,000/hr Line Stoppage Risk
              </span>
            </div>
            <p className="text-[#5a5751]">
              In production facilities, wet epoxy floors, blinding solar glare, and unmodeled payload shifts cause autonomous robots to skid, trigger phantom E-stops, or fail ISO safety audits.
              Diffraction ingests raw black-box telemetry (<code className="bg-[#efefed] px-1.5 py-0.5 rounded font-mono text-xs text-[#2f3437]">.mcap</code> / ROS 2 bags), runs <span className="font-semibold text-[#2f3437]">150+ adversarial physics stress sweeps</span>, and synthesizes <span className="font-semibold text-[#2f3437]">turnkey ROS 2 safety controller patches</span> with signed ISO compliance certificates in 30 seconds.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-1 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onLaunchSandbox}
            className="min-h-[42px] px-5 py-2.5 bg-[#2383e2] hover:bg-[#1a73e8] active:scale-[0.99] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center space-x-2 cursor-pointer group"
          >
            <Zap className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
            <span>Open 3D Verification Sandbox</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={onExploreStory}
            className="min-h-[42px] px-4.5 py-2.5 bg-white hover:bg-[#f1f1ef] text-[#37352f] text-xs sm:text-sm font-medium rounded-lg border border-[#dfdfde] transition-colors flex items-center space-x-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#787774]" />
            <span>Read 4-Act Storyline</span>
          </button>

          <button
            type="button"
            onClick={onOpenPricing}
            className="min-h-[42px] px-4 py-2.5 text-[#787774] hover:text-[#2f3437] text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1" />
            <span>Commercial $15k Pilot SOW</span>
            <span className="text-[#a4a4a1]">→</span>
          </button>
        </div>

        {/* High-Craft Key Stats Grid (Prevents Word Wrapping Glitches) */}
        <div className="pt-6 border-t border-[rgba(55,53,47,0.06)] grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3.5 sm:p-4 rounded-xl bg-[#fafaf9] border border-[rgba(55,53,47,0.08)] transition-all hover:bg-white hover:card-shadow">
            <div className="flex items-center space-x-2 text-[#787774] mb-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[11px] font-medium mono uppercase tracking-wider">Turnkey SLA</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#2f3437] font-mono tracking-tight">
              30 Sec
            </div>
            <div className="text-[#787774] text-[11px] mt-0.5 whitespace-nowrap">
              Log to signed dossier
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-[#fafaf9] border border-[rgba(55,53,47,0.08)] transition-all hover:bg-white hover:card-shadow">
            <div className="flex items-center space-x-2 text-[#787774] mb-1">
              <Activity className="w-3.5 h-3.5 text-cyan-600" />
              <span className="text-[11px] font-medium mono uppercase tracking-wider">Physics Sweep</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#2e5d7d] font-mono tracking-tight">
              150+ Runs
            </div>
            <div className="text-[#787774] text-[11px] mt-0.5 whitespace-nowrap">
              Parallel edge cases
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-[#fafaf9] border border-[rgba(55,53,47,0.08)] transition-all hover:bg-white hover:card-shadow">
            <div className="flex items-center space-x-2 text-[#787774] mb-1">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] font-medium mono uppercase tracking-wider">Architectures</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#34623f] font-mono tracking-tight">
              5 Modalities
            </div>
            <div className="text-[#787774] text-[11px] mt-0.5 whitespace-nowrap">
              Humanoid, AMR, Arm, Hauler
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-[#fafaf9] border border-[rgba(55,53,47,0.08)] transition-all hover:bg-white hover:card-shadow">
            <div className="flex items-center space-x-2 text-[#787774] mb-1">
              <FileCode className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[11px] font-medium mono uppercase tracking-wider">Remediation</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#835e16] font-mono tracking-tight whitespace-nowrap">
              Zero Lock-in
            </div>
            <div className="text-[#787774] text-[11px] mt-0.5 whitespace-nowrap">
              ROS 2 & PX4 YAML patches
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
