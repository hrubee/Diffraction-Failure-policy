/**
 * Presentation Component: 4-Act Storyline Walkthrough for Landing Page
 * Takes prospective buyers through the journey of the Physical AI Data Crisis
 * and how Diffraction's Isaac Sim Factory generates millions of demonstrations.
 *
 * Strict Color Hunt 4-Color Palette: #2FA4D7, #F5E9D8, #3E2C23, #E76F2E (Zero Gradients).
 */

'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  Sliders,
  Database,
  Cpu,
  Server,
} from 'lucide-react';

interface LandingStoryWalkthroughProps {
  readonly onLaunchConsole: () => void;
}

interface StoryAct {
  readonly stepNumber: number;
  readonly actName: string;
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly summary: string;
  readonly bulletPoints: readonly string[];
  readonly tag: string;
}

export const LandingStoryWalkthrough: React.FC<LandingStoryWalkthroughProps> = ({
  onLaunchConsole,
}) => {
  const [activeActIndex, setActiveActIndex] = useState<number>(0);

  const storyActs: readonly StoryAct[] = [
    {
      stepNumber: 1,
      actName: 'The Data Desert',
      icon: <AlertTriangle className="w-4 h-4 text-[#E76F2E]" />,
      title: 'The Multi-Million Dollar Physical AI Teleoperation Bottleneck',
      summary:
        'Large Language Models had trillions of text tokens on the public internet. Physical AI and robotics foundation models have almost zero demonstration data.',
      bulletPoints: [
        'Collecting physical demonstrations with human teleoperators in VR rigs costs $150/hour.',
        '100,000 hours of physical data collection costs $15,000,000 and takes over 2 years with a team of 20 operators.',
        'Human teleoperation cannot capture extreme edge cases (slipping on wet oil, 95,000 Lux solar flares) without damaging expensive robots.',
        'Result: Robotics foundation models remain starved of multimodal demonstration data.',
      ],
      tag: 'ACT 1 • THE PHYSICAL AI CRISIS',
    },
    {
      stepNumber: 2,
      actName: 'USD & Cosmos Transfer',
      icon: <Layers className="w-4 h-4 text-[#2FA4D7]" />,
      title: 'Procedural World Synthesis in Isaac Sim & NVIDIA Cosmos Transfer',
      summary:
        'Diffraction builds procedural OpenUSD stages and applies NVIDIA Cosmos Transfer 2.5 diffusion to generate photorealistic demonstrations with 100% action invariance.',
      bulletPoints: [
        'Procedurally generates OpenUSD stages with Omniverse Replicator (lighting 50-95k Lux, clutter, dynamic friction).',
        'PhysX 5 GPU-accelerated rigid-body and contact mechanics compute realistic non-linear tire slip and joint torques.',
        'NVIDIA Cosmos Transfer 2.5 diffusion augments simulation with photorealistic lighting bloom and floor reflections.',
        'Geometry and physical action vectors remain 100% invariant via ControlNet segmentation locks.',
      ],
      tag: 'ACT 2 • PROCEDURAL TOOLS & COSMOS DIFFUSION',
    },
    {
      stepNumber: 3,
      actName: 'Sim-to-Real Calibration',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
      title: 'Closing the Reality Gap with Empirical Physical Distribution Matching',
      summary:
        'Synthetic data is useless if models fail when transferred to physical robots. Diffraction empirically aligns synthetic distributions against real hardware logs.',
      bulletPoints: [
        'Sensor noise profiles calibrated against real Intel RealSense D435 and Ouster OS1 LiDAR hardware.',
        'Non-linear Pacejka tire curves match real-world wheel slip with Wasserstein distance W₁ = 0.038.',
        'Domain randomization systematically widens bounds beyond the physical p99 operating envelope.',
        'Achieves a verified 94.2% zero-shot policy transfer success rate on physical hardware testbeds.',
      ],
      tag: 'ACT 3 • REALITY GAP ERADICATION',
    },
    {
      stepNumber: 4,
      actName: 'Foundation Model Export',
      icon: <Database className="w-4 h-4 text-[#2FA4D7]" />,
      title: 'Zero-Copy Training in Hugging Face LeRobot, Open-X & PyTorch',
      summary:
        'Export millions of demonstrations directly into standard robotics AI formats for immediate policy training in Diffusion Policy, ACT, and OpenVLA.',
      bulletPoints: [
        'First-class support for Hugging Face LeRobot v2 (Parquet metadata + MP4 synchronized video).',
        'Google Open-X Embodiment (RLDS / TFDS) compatibility for cross-embodiment foundation models.',
        'Pre-tokenized action vectors (joint torques, end-effector poses) synchronized at 500 Hz.',
        'One-click PyTorch DataLoader loader snippet for immediate cluster training.',
      ],
      tag: 'ACT 4 • IMMEDIATE ZERO-SHOT TRAINING',
    },
  ];

  const currentAct = storyActs[activeActIndex];

  return (
    <section id="how-it-works" className="py-20 relative bg-white border-y-2 border-[#3E2C23]" aria-label="4-Act Synthetic Generation Pipeline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#F5E9D8] border border-[#3E2C23]/20 text-xs text-[#3E2C23] font-mono shadow-xs">
            <Zap className="w-3.5 h-3.5 text-[#2FA4D7]" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              The 4-Act Physical AI Data Factory
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3E2C23] tracking-tight leading-tight font-headline">
            From data desert to
            <br />
            <span className="text-[#2FA4D7]">
              frontier VLA foundation models.
            </span>
          </h2>

          <p className="text-[#3E2C23]/80 text-sm sm:text-base leading-relaxed font-body">
            How Diffraction replaces millions of dollars in manual teleoperation with automated, physics-calibrated synthetic generation in NVIDIA Isaac Sim.
          </p>
        </div>

        {/* 4-Act Stepper Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {storyActs.map((act, index) => {
            const isActive = activeActIndex === index;
            return (
              <button
                type="button"
                key={act.stepNumber}
                onClick={() => setActiveActIndex(index)}
                className={`p-4 rounded-xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[90px] ${
                  isActive
                    ? 'border-[#2FA4D7] bg-[#2FA4D7]/10'
                    : 'border-[#3E2C23]/20 bg-[#F5E9D8]/30 hover:border-[#3E2C23]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#3E2C23] text-[#F5E9D8]">
                    Act {act.stepNumber}
                  </span>
                  {act.icon}
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#3E2C23] font-headline mt-2">
                  {act.actName}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Act Display Card */}
        <div className="bg-[#F5E9D8]/40 border-2 border-[#3E2C23] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#3E2C23]/10 pb-4">
            <span className="text-xs font-mono font-bold text-[#2FA4D7] tracking-wider uppercase">
              {currentAct.tag}
            </span>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-[#3E2C23] text-[#F5E9D8]">
              Step {currentAct.stepNumber} of 4
            </span>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#3E2C23] font-headline">
              {currentAct.title}
            </h3>
            <p className="text-sm sm:text-base text-[#3E2C23]/80 leading-relaxed font-body">
              {currentAct.summary}
            </p>
          </div>

          {/* Bullet points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {currentAct.bulletPoints.map((bp, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white border border-[#3E2C23]/15 flex items-start space-x-3 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-[#2FA4D7] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-[#3E2C23] leading-relaxed font-body">
                  {bp}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={onLaunchConsole}
              className="px-6 py-3 rounded-xl bg-[#2FA4D7] hover:bg-[#2FA4D7]/90 text-white font-extrabold text-xs sm:text-sm tracking-wide flex items-center gap-2 cursor-pointer shadow-xs transition-transform active:scale-95"
            >
              <span>Launch Isaac Sim Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
