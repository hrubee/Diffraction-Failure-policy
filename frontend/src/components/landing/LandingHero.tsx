/**
 * Presentation Component: Physical AI Synthetic Data Factory Landing Hero
 * Powered by NVIDIA Isaac Sim & OpenUSD.
 * Features interactive multimodal sensor stream switcher (RGB, Depth, Semantic Seg, LiDAR)
 * and direct ROI metrics comparing physical teleoperation with synthetic generation.
 *
 * Strict Color Hunt 4-Color Palette: #2FA4D7, #F5E9D8, #3E2C23, #E76F2E (Zero Gradients).
 */

'use client';

import React, { useState } from 'react';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  Activity,
  Cpu,
  Layers,
  Sparkles,
  Camera,
  Radio,
  Eye,
  Database,
  CheckCircle2,
  Server,
  TrendingDown,
} from 'lucide-react';

interface LandingHeroProps {
  readonly onLaunchConsole: (scenarioKey?: string) => void;
  readonly onExploreStory: () => void;
  readonly onOpenPricing: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onLaunchConsole,
  onExploreStory,
  onOpenPricing,
}) => {
  const [activeChannel, setActiveChannel] = useState<'rgb' | 'depth' | 'seg' | 'lidar'>('rgb');

  return (
    <section className="relative pt-8 pb-16 overflow-hidden" aria-label="Diffraction Physical AI Hero">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Badges & Live Status */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-white border border-[#3E2C23]/20 text-xs text-[#3E2C23] shadow-xs">
            <span className="h-2 w-2 rounded-full bg-[#2FA4D7] animate-pulse" />
            <span className="font-semibold tracking-wide uppercase text-[10px] font-mono">
              PRODUCTIZED STUDIO • NVIDIA ISAAC SIM &amp; COSMOS 2.5
            </span>
          </div>

          <span className="text-[#3E2C23]/40 hidden sm:inline">•</span>

          <span className="inline-flex items-center px-3 py-1 rounded bg-white border border-[#3E2C23]/20 text-[#3E2C23] text-xs font-mono shadow-xs">
            OpenUSD • Isaac Lab • Hugging Face LeRobot • PhysX 5
          </span>

          <span className="text-[#3E2C23]/40 hidden md:inline">•</span>

          <span className="hidden md:inline-flex px-3 py-1 rounded bg-[#E76F2E] text-white text-xs font-mono font-bold shadow-xs">
            3 to 14 Day Delivery SLA
          </span>
        </div>

        {/* Grand Headline & Narrative Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Headline & Value Prop */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#2FA4D7] block">
                The Tech-Enabled Synthetic Asset Studio
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#3E2C23] font-headline tracking-tight leading-[1.12]">
                Photorealistic NVIDIA Isaac Sim, Cosmos &amp; OpenUSD Environments —{' '}
                <span className="text-[#2FA4D7] underline decoration-[#2FA4D7]/40 decoration-4 underline-offset-4">
                  Delivered in Days.
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-[#3E2C23]/85 leading-relaxed font-body max-w-2xl">
              Robotics startups spend{' '}
              <strong className="text-[#E76F2E] font-bold underline decoration-[#E76F2E]/80 decoration-2 underline-offset-4">
                6 months
              </strong>{' '}
              recruiting simulation engineers and $150/hr on manual teleoperation. We build photorealistic, physics-calibrated environments and Cosmos datasets 5x faster using our proprietary procedural tooling.
            </p>

            <p className="text-sm text-[#3E2C23]/80 leading-relaxed font-body max-w-2xl">
              From converting your URDF/CAD into a tuned PhysX 5 rigid-body asset, to procedural high-bay warehouses with dynamic friction, to 500,000 Cosmos-augmented demonstrations formatted for Hugging Face LeRobot—delivered on fixed-fee sprint contracts.
            </p>

            {/* Micro ROI Stat Callout */}
            <div className="grid grid-cols-2 gap-3 max-w-lg p-3 rounded-xl bg-white border border-[#3E2C23]/20 font-mono text-xs">
              <div>
                <span className="text-[#3E2C23]/50 block text-[10px]">IN-HOUSE SIM ENGINEER</span>
                <span className="text-rose-700 font-bold">$220,000/yr + 6mo hiring delay</span>
              </div>
              <div>
                <span className="text-[#3E2C23]/50 block text-[10px]">DIFFRACTION SPRINT</span>
                <span className="text-emerald-700 font-bold">$7,500 - $35,000 (3-14 days)</span>
              </div>
            </div>

            {/* CTA Group */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                type="button"
                onClick={() => onLaunchConsole()}
                className="min-h-[48px] px-6 py-3 rounded-lg bg-[#2FA4D7] hover:bg-[#248ab8] text-white text-sm font-bold shadow-md transition-all flex items-center justify-center space-x-2.5 cursor-pointer group"
              >
                <Zap className="w-4 h-4 fill-current text-white group-hover:scale-110 transition-transform" />
                <span>Configure Sprint SOW ($7.5k+)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.hash = '#catalog';
                }}
                className="min-h-[48px] px-5 py-3 rounded-lg bg-white hover:bg-[#FAF4EB] text-[#3E2C23] text-sm font-semibold border border-[#3E2C23]/25 transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
              >
                <Database className="w-4 h-4 text-[#2FA4D7]" />
                <span>Inspect Sample Deliverables</span>
              </button>

              <button
                type="button"
                onClick={onOpenPricing}
                className="min-h-[44px] px-3 py-2 text-[#E76F2E] hover:text-[#d35b1d] text-xs sm:text-sm font-bold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#E76F2E]" />
                <span>Sprint Pricing →</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Multimodal Stream Preview Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-[#3E2C23] text-[#F5E9D8] border-2 border-[#3E2C23] p-5 sm:p-6 shadow-2xl space-y-4">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-[#F5E9D8]/15 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-md bg-[#2FA4D7] text-white">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#F5E9D8] tracking-wide uppercase font-headline">
                      Studio Deliverable Quality Assurance
                    </h3>
                    <p className="text-[10px] text-[#F5E9D8]/70 font-mono">NVIDIA Isaac Sim + Cosmos 2.5</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#E76F2E] text-white">
                  3-14 Day Turnaround
                </span>
              </div>

              {/* Channel Selector Pills */}
              <div className="grid grid-cols-4 gap-1 bg-[#2A1D17] p-1 rounded-lg border border-[#F5E9D8]/10 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setActiveChannel('rgb')}
                  className={`py-1.5 rounded font-bold transition-colors cursor-pointer text-center ${
                    activeChannel === 'rgb' ? 'bg-[#2FA4D7] text-white' : 'text-[#F5E9D8]/60 hover:text-white'
                  }`}
                >
                  RGB 1080p
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChannel('depth')}
                  className={`py-1.5 rounded font-bold transition-colors cursor-pointer text-center ${
                    activeChannel === 'depth' ? 'bg-[#2FA4D7] text-white' : 'text-[#F5E9D8]/60 hover:text-white'
                  }`}
                >
                  16-Bit Depth
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChannel('seg')}
                  className={`py-1.5 rounded font-bold transition-colors cursor-pointer text-center ${
                    activeChannel === 'seg' ? 'bg-[#2FA4D7] text-white' : 'text-[#F5E9D8]/60 hover:text-white'
                  }`}
                >
                  Semantic Seg
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChannel('lidar')}
                  className={`py-1.5 rounded font-bold transition-colors cursor-pointer text-center ${
                    activeChannel === 'lidar' ? 'bg-[#2FA4D7] text-white' : 'text-[#F5E9D8]/60 hover:text-white'
                  }`}
                >
                  3D LiDAR
                </button>
              </div>

              {/* Viewport Frame */}
              <div className="relative aspect-4/3 bg-[#1A120E] rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
                {activeChannel === 'rgb' && (
                  <svg className="w-full h-full" viewBox="0 0 400 300">
                    <rect width="400" height="300" fill="#2A1E18" />
                    <polygon points="0,170 400,170 400,300 0,300" fill="#3E2C23" />
                    <line x1="80" y1="170" x2="0" y2="300" stroke="#F5E9D8" strokeWidth="1" strokeOpacity="0.15" />
                    <line x1="320" y1="170" x2="400" y2="300" stroke="#F5E9D8" strokeWidth="1" strokeOpacity="0.15" />
                    {/* Warehouse Rack */}
                    <rect x="40" y="50" width="90" height="120" fill="#2FA4D7" fillOpacity="0.15" stroke="#2FA4D7" strokeWidth="2" />
                    {/* AMR Robot with 3D Bounding Box */}
                    <rect x="160" y="195" width="85" height="55" rx="6" fill="#2FA4D7" stroke="#F5E9D8" strokeWidth="2" />
                    <rect x="155" y="190" width="95" height="65" fill="none" stroke="#E76F2E" strokeWidth="1.5" strokeDasharray="4 2" />
                    <text x="158" y="185" fill="#E76F2E" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      Robot [99.2%]
                    </text>
                  </svg>
                )}

                {activeChannel === 'depth' && (
                  <svg className="w-full h-full" viewBox="0 0 400 300">
                    <rect width="400" height="300" fill="#111111" />
                    <polygon points="0,170 400,170 400,300 0,300" fill="#333333" />
                    <rect x="40" y="50" width="90" height="120" fill="#666666" />
                    <rect x="160" y="195" width="85" height="55" rx="6" fill="#E5E5E5" />
                  </svg>
                )}

                {activeChannel === 'seg' && (
                  <svg className="w-full h-full" viewBox="0 0 400 300">
                    <rect width="400" height="170" fill="#3E2C23" />
                    <rect x="0" y="170" width="400" height="130" fill="#2FA4D7" fillOpacity="0.4" />
                    <rect x="40" y="50" width="90" height="120" fill="#E76F2E" fillOpacity="0.8" />
                    <rect x="160" y="195" width="85" height="55" rx="6" fill="#2FA4D7" />
                  </svg>
                )}

                {activeChannel === 'lidar' && (
                  <svg className="w-full h-full" viewBox="0 0 400 300">
                    <circle cx="200" cy="150" r="110" fill="none" stroke="#F5E9D8" strokeWidth="0.5" strokeOpacity="0.15" />
                    <circle cx="200" cy="150" r="70" fill="none" stroke="#F5E9D8" strokeWidth="0.5" strokeOpacity="0.15" />
                    <circle cx="200" cy="150" r="3" fill="#E76F2E" />
                    {Array.from({ length: 36 }).map((_, i) => {
                      const angle = (i / 36) * Math.PI * 2;
                      const dist = 50 + ((i * 19) % 55);
                      return (
                        <circle
                          key={i}
                          cx={200 + Math.cos(angle) * dist}
                          cy={150 + Math.sin(angle) * dist}
                          r="1.5"
                          fill={i % 2 === 0 ? '#2FA4D7' : '#E76F2E'}
                        />
                      );
                    })}
                  </svg>
                )}

                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#F5E9D8]">
                  Sim2Real Match: 98.6%
                </div>
              </div>

              {/* Live Sensor Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono bg-white/5 p-2.5 rounded-lg border border-white/10">
                <div>
                  <span className="text-[#F5E9D8]/50 text-[10px] block">CLUSTERS</span>
                  <span className="font-bold text-white">64x H100</span>
                </div>
                <div>
                  <span className="text-[#F5E9D8]/50 text-[10px] block">THROUGHPUT</span>
                  <span className="font-bold text-[#2FA4D7]">48,200 FPS</span>
                </div>
                <div>
                  <span className="text-[#F5E9D8]/50 text-[10px] block">FORMAT</span>
                  <span className="font-bold text-[#E76F2E]">LeRobot v2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
