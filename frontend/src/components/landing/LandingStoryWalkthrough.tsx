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
      actName: 'Pilot Purgatory',
      icon: <AlertTriangle className="w-4 h-4 text-[#E76F2E]" />,
      title: 'The $300,000 / 8-Week AMR Site Commissioning Crisis',
      summary:
        'Robotics OEMs face sudden friction drops (smooth epoxy, dock condensation, forklift rubber) on customer floors. Wheel odometry decouples from LiDAR, triggering phantom E-stops and stalling 70% of customer pilots.',
      bulletPoints: [
        'Over 70% of warehouse robotics deployments stall indefinitely in "Pilot Purgatory" after the 3-robot trial.',
        'Flying 2-3 Field Application Engineers (FAEs) to live in hotels for 8 to 12 weeks burns $150,000 to $300,000 per facility.',
        'Engineers manually guess friction coefficients and PID gains using tape measures and joysticks.',
        'Result: Multi-million dollar robotics contracts freeze when a robot slips and blocks a high-traffic aisle.',
      ],
      tag: 'ACT 1 • THE COMMISSIONING CRISIS',
    },
    {
      stepNumber: 2,
      actName: 'Warp-SysID Inverse Physics',
      icon: <Layers className="w-4 h-4 text-[#2FA4D7]" />,
      title: 'Automated Ground-Truth Friction Recovery from 5s of Telemetry',
      summary:
        'The robot records a 5-second blackbox telemetry drop during its first slip. Diffraction unrolls continuous-time Runge-Kutta 4 physics and recovers ground truth in under 3 minutes.',
      bulletPoints: [
        'Ingests raw wheel encoder counts, IMU yaw rates, and motor currents via ROS 2 MCAP or CSV.',
        'Unrolls continuous-time RK4 differential equations across 100 timesteps to compute autodiff gradients (∂L/∂μ).',
        'Recovers true kinetic floor friction (μ = 0.22) and actuator delay (τ = 45ms) with R² fit > 0.99.',
        'Eliminates 6 weeks of manual trial-and-error friction estimation on-site.',
      ],
      tag: 'ACT 2 • WARP-SYSID INVERSE PHYSICS',
    },
    {
      stepNumber: 3,
      actName: '4D MAP-Elites Search',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
      title: 'Mining Catastrophic Edge Cases Across 5,000 Virtual Rollouts',
      summary:
        'Instead of waiting weeks for a dangerous collision to happen in front of the customer, Diffraction illuminates the 4D behavioral archive in a digital twin before production.',
      bulletPoints: [
        'Illuminates 7,200 behavioral niches across friction (μ), specular warehouse glare, CAN latency, and payload mass.',
        'Discovers exact Pareto failure cliffs: e.g. turning sharper than 1.2 rad/s with > 180kg payload on μ < 0.23.',
        'Generates contact-locked multi-modal sensor streams with 0.000 px drift across 10 environmental modalities.',
        'Computes dynamic stopping distance and lateral rollover stability bounds automatically.',
      ],
      tag: 'ACT 3 • 4D FAILURE ILLUMINATION',
    },
    {
      stepNumber: 4,
      actName: 'CBF-QP Safety & ISO Dossier',
      icon: <Database className="w-4 h-4 text-[#2FA4D7]" />,
      title: 'Sub-Millisecond Edge Governor & Insurance Signoff in 14 Days',
      summary:
        'Flashes the compiled active-set CBF-QP governor directly to the robot. Intercepts dangerous commands in 62 microseconds and auto-generates the ISO 13849 compliance dossier.',
      bulletPoints: [
        'Active-set Quadratic Program solves in 62 μs (500 Hz control budget) on NVIDIA Jetson Orin / x86 compute.',
        'Intercepts unverified neural network/navigation commands and mathematically guarantees forward invariance: h(x) ≥ 0.',
        'Zero collisions and zero traction spin-outs across the 14-day customer evaluation.',
        'Auto-compiles formal ISO 3691-4:2023 & ANSI/RIA R15.08 compliance dossiers ready for plant safety inspectors and insurance underwriters.',
      ],
      tag: 'ACT 4 • CERTIFIED ZERO-COLLISION CLEARANCE',
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
              The 14-Day Automated Commissioning Lifecycle
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3E2C23] tracking-tight leading-tight font-headline">
            From 5s telemetry drop to
            <br />
            <span className="text-[#2FA4D7]">
              zero-collision certified clearance.
            </span>
          </h2>

          <p className="text-[#3E2C23]/80 text-sm sm:text-base leading-relaxed font-body">
            How Diffraction replaces 8 to 12 weeks of manual on-site engineering with unrolled inverse physics, 4D quality-diversity simulation, and sub-millisecond edge safety filtering.
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
              className="px-6 py-3 rounded-xl bg-[#2FA4D7] hover:bg-[#2FA4D7]/90 text-white font-extrabold text-xs sm:text-sm tracking-wide flex items-center gap-2 cursor-pointer shadow-xs transition-transform active:scale-95 font-mono"
            >
              <span>Request 14-Day Pilot ($25k)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
