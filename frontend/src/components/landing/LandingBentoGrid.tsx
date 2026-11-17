/**
 * Presentation Component: Platform Capabilities Bento Grid
 * Dual-depth showcase designed for both Decision Makers (Outcomes & Business Value)
 * and Robotics Engineers (Underlying Physics, Math, and Architecture).
 *
 * Strict Color Hunt 4-Color Palette: #2FA4D7, #F5E9D8, #3E2C23, #E76F2E (Zero Gradients).
 */

'use client';

import React, { useState } from 'react';
import {
  Layers,
  Camera,
  Sliders,
  ShieldCheck,
  Database,
  Server,
  ArrowRight,
  Cpu,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Wrench,
  CheckCircle2,
} from 'lucide-react';

interface LandingBentoGridProps {
  readonly onLaunchConsole: () => void;
  readonly onOpenGovernor: () => void;
  readonly onOpenTelematics: () => void;
}

interface PillarCard {
  readonly id: string;
  readonly number: string;
  readonly icon: React.ReactNode;
  readonly businessTitle: string;
  readonly businessBenefit: string;
  readonly businessPill: string;
  readonly engineeringTitle: string;
  readonly engineeringSpecs: string;
  readonly engineeringSnippet: {
    readonly file: string;
    readonly line1: string;
    readonly line2: string;
  };
}

export const LandingBentoGrid: React.FC<LandingBentoGridProps> = ({
  onLaunchConsole,
  onOpenGovernor,
  onOpenTelematics,
}) => {
  const [activeMode, setActiveMode] = useState<'business' | 'engineering'>('business');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const pillars: PillarCard[] = [
    {
      id: 'sysid',
      number: '01',
      icon: <Sliders className="w-5 h-5 text-white" />,
      businessTitle: 'Automatic Floor Traction Calibration',
      businessBenefit:
        'Eliminates 8 weeks of manual track testing. Upload a 5-second driving log from your robot, and Diffraction calculates exact floor slipperiness and brake reaction times automatically.',
      businessPill: '8 Weeks Manual Testing → 5 Seconds',
      engineeringTitle: 'Continuous Warp-SysID RK4',
      engineeringSpecs:
        'Autodiff inverse dynamics unrolling continuous Runge-Kutta 4 across 100 timesteps. Recovers ground-truth friction (μ) and actuator latency (τ) with R² > 0.996 from raw IMU/wheel odometry.',
      engineeringSnippet: {
        file: '# warp_sysid_optimizer.py (GPU Autodiff)',
        line1: 'Friction: μ = 0.220 ± 0.008 • Delay: 45.2 ms',
        line2: 'Loss: 0.00031 (L2 Odometry Drift)',
      },
    },
    {
      id: 'cbf_qp',
      number: '02',
      icon: <ShieldCheck className="w-5 h-5 text-white" />,
      businessTitle: 'Zero-Collision Safety Shield',
      businessBenefit:
        'Guarantees zero physical crashes on wet or polished warehouse floors. An on-robot guard overrides unsafe commands in 62 microseconds before wheels can slip into people or racks.',
      businessPill: '100% Money-Back Crash Guarantee',
      engineeringTitle: 'Active-Set CBF-QP Governor',
      engineeringSpecs:
        'Deterministic active-set Quadratic Program running at 500 Hz on edge compute. Solves in 62 μs to enforce Control Barrier Functions h(x) ≥ 0 with Lyapunov stability proofs.',
      engineeringSnippet: {
        file: '# safety_governor.py (Edge Active-Set)',
        line1: 'Solve Time: 0.062 ms • Collisions: 0 / 1,000',
        line2: 'Invariance: h(x) ≥ 0.04m (Safe Manifold)',
      },
    },
    {
      id: 'map_elites',
      number: '03',
      icon: <Layers className="w-5 h-5 text-white" />,
      businessTitle: 'Pre-Deployment Stress Testing',
      businessBenefit:
        'Discovers hidden edge cases—like sudden wet patches, floor glare, and heavy loads—in simulation before your robots ever touch the customer’s facility.',
      businessPill: 'Mines 7,200 Failure Scenarios in Cloud',
      engineeringTitle: '4D MAP-Elites Failure Mining',
      engineeringSpecs:
        'Quality-diversity evolutionary search across 4 coupled physical axes: friction (μ), specular warehouse glare, CAN bus latency, and payload offsets. Mines Pareto failure cliffs automatically.',
      engineeringSnippet: {
        file: '# map_elites_search.py (Quality-Diversity)',
        line1: 'Capacity: 7,200 Niches • Frontier: μ < 0.23',
        line2: 'Evaluations: 60 rollouts / min',
      },
    },
    {
      id: 'contact_manifold',
      number: '04',
      icon: <Camera className="w-5 h-5 text-white" />,
      businessTitle: 'Real-World Factory Twins',
      businessBenefit:
        'Trains and validates your robot’s cameras and sensors across extreme facility conditions: night shifts, low sodium lights, steam, and intense floor reflections.',
      businessPill: '10 Real-World Factory Sensor Streams',
      engineeringTitle: 'Contact-Locked Multi-Modal Corpus',
      engineeringSpecs:
        'Sub-pixel Signed Distance Field (SDF) manifold locking guaranteeing 0.000 px contact drift across 10 environmental modalities: Thermal FLIR, LiDAR depth, daylight, sodium vapor, and UV inspection.',
      engineeringSnippet: {
        file: '# contact_manifold.py (SDF Manifold)',
        line1: 'Contact Drift: 0.000 px • Streams: 10 Modalities',
        line2: 'Alignment: Sub-pixel Contact Raycasting',
      },
    },
    {
      id: 'regulatory_oracle',
      number: '05',
      icon: <Database className="w-5 h-5 text-white" />,
      businessTitle: '1-Click Safety & Insurance Signoff',
      businessBenefit:
        'Turns months of safety bureaucracy into instant approvals. Generates audited mathematical safety proofs ready for plant safety managers and insurance underwriters.',
      businessPill: 'ISO 3691-4 & ANSI R15.08 Certified',
      engineeringTitle: 'Automated Regulatory Oracle',
      engineeringSpecs:
        'Automated compliance compiler evaluating stopping envelopes against ISO 3691-4:2023 Cl. 5.2, ISO 13849 (PL-d), and ANSI/RIA R15.08 Part 2. Auto-generates verifiable JSON/HTML dossiers.',
      engineeringSnippet: {
        file: '# regulatory_audit_dossier.html',
        line1: 'Standard: ISO 13849 PL-d • Status: PASSED',
        line2: 'Forward Reachability: Verified Convex Hull',
      },
    },
    {
      id: 'ros2_nav2',
      number: '06',
      icon: <Server className="w-5 h-5 text-white" />,
      businessTitle: '60-Second Fleet Deployment',
      businessBenefit:
        'Zero code rewrites. Zero engineering disruption. Download a pre-tuned configuration patch and flash your existing robots in less than a minute.',
      businessPill: 'Drop-In ROS 2 Nav2 Compatibility',
      engineeringTitle: 'Drop-In ROS 2 Nav2 Patches',
      engineeringSpecs:
        'Direct deployment to ROS 2 Humble/Iron stacks. Outputs pre-tuned nav2_params.yaml, dynamic costmap speed filter masks, and deploy_edge_governor.sh with zero kernel modifications.',
      engineeringSnippet: {
        file: '# deploy_edge_governor.sh (ROS 2)',
        line1: 'Target: ROS 2 Humble / Iron • Setup: < 60s',
        line2: 'Config: nav2_controller_params.yaml',
      },
    },
  ];

  return (
    <section id="capabilities" className="py-20 relative bg-white" aria-label="Diffraction Platform Capabilities">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header with Dual-Audience Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#3E2C23]/15">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#F5E9D8] border border-[#3E2C23]/20 text-xs text-[#3E2C23] font-mono shadow-xs">
              <Cpu className="w-3.5 h-3.5 text-[#2FA4D7]" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                The Core Technology
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#3E2C23] tracking-tight leading-tight font-headline">
              {activeMode === 'business' ? (
                <>
                  Built for rapid deployment.
                  <br />
                  <span className="text-[#2FA4D7]">Zero crashes. Zero trial-and-error.</span>
                </>
              ) : (
                <>
                  Provable control physics.
                  <br />
                  <span className="text-[#2FA4D7]">Not heuristic guesswork.</span>
                </>
              )}
            </h2>

            <p className="text-[#3E2C23]/80 text-sm leading-relaxed font-body">
              {activeMode === 'business'
                ? 'How Diffraction removes the technical bottlenecks that stall robotics deployments, cuts commissioning from 8 weeks to 14 days, and protects your customer contracts.'
                : 'Under the hood: Continuous-time inverse dynamics, active-set quadratic programming, 4D quality-diversity exploration, and formal barrier function safety.'}
            </p>
          </div>

          {/* Perspective Toggle Buttons */}
          <div className="inline-flex p-1 rounded-xl bg-[#F5E9D8] border-2 border-[#3E2C23] shadow-xs shrink-0 self-start md:self-end">
            <button
              onClick={() => setActiveMode('business')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeMode === 'business'
                  ? 'bg-[#3E2C23] text-white shadow-xs'
                  : 'text-[#3E2C23]/70 hover:text-[#3E2C23]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-[#2FA4D7]" />
              <span>Executive View</span>
            </button>
            <button
              onClick={() => setActiveMode('engineering')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeMode === 'engineering'
                  ? 'bg-[#2FA4D7] text-white shadow-xs'
                  : 'text-[#3E2C23]/70 hover:text-[#3E2C23]'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-white" />
              <span>Robotics Engineering View</span>
            </button>
          </div>
        </div>

        {/* The Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const isCardOpen = expandedCards[pillar.id] ?? false;

            return (
              <div
                key={pillar.id}
                className="rounded-2xl bg-white border-2 border-[#3E2C23] p-6 flex flex-col justify-between space-y-5 shadow-xs hover:border-[#2FA4D7] transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-lg bg-[#3E2C23] text-white">
                      {pillar.icon}
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#3E2C23]/40">
                      PILLAR {pillar.number}
                    </span>
                  </div>

                  {activeMode === 'business' ? (
                    /* Business / Executive Content */
                    <div className="space-y-2">
                      <div className="inline-block px-2.5 py-0.5 rounded bg-[#F5E9D8] text-[10px] font-mono font-bold text-[#3E2C23]">
                        {pillar.businessPill}
                      </div>
                      <h3 className="text-lg font-bold text-[#3E2C23] tracking-tight font-headline">
                        {pillar.businessTitle}
                      </h3>
                      <p className="text-xs text-[#3E2C23]/80 leading-relaxed font-body">
                        {pillar.businessBenefit}
                      </p>
                    </div>
                  ) : (
                    /* Engineering / Deep-Tech Content */
                    <div className="space-y-2">
                      <div className="inline-block px-2.5 py-0.5 rounded bg-[#2FA4D7]/15 text-[10px] font-mono font-bold text-[#2FA4D7]">
                        {pillar.engineeringTitle}
                      </div>
                      <h3 className="text-lg font-bold text-[#3E2C23] tracking-tight font-headline">
                        {pillar.engineeringTitle}
                      </h3>
                      <p className="text-xs text-[#3E2C23]/80 leading-relaxed font-body">
                        {pillar.engineeringSpecs}
                      </p>
                    </div>
                  )}
                </div>

                {/* Collapsible Technical Drill-Down for Inquisitive Decision Makers & Engineers */}
                <div className="space-y-3 pt-3 border-t border-[#3E2C23]/10">
                  <button
                    onClick={() => toggleCard(pillar.id)}
                    className="flex items-center justify-between w-full text-[11px] font-mono font-semibold text-[#2FA4D7] hover:text-[#3E2C23] transition-colors"
                  >
                    <span>
                      {isCardOpen ? 'Hide Technical Architecture' : 'Learn Technical Architecture (Math & Code)'}
                    </span>
                    {isCardOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {/* Expandable Engineering Details */}
                  {isCardOpen && (
                    <div className="p-3 rounded-lg bg-[#F5E9D8] text-xs space-y-2 border border-[#3E2C23]/15">
                      <div className="font-bold text-[#3E2C23] text-[11px]">
                        Robotics Implementation:
                      </div>
                      <p className="text-[11px] text-[#3E2C23]/80 leading-relaxed">
                        {pillar.engineeringSpecs}
                      </p>
                    </div>
                  )}

                  {/* Code / Telemetry Metric Snippet */}
                  <div className="p-3 rounded-lg bg-[#3E2C23] text-[#F5E9D8] font-mono text-[11px] space-y-1">
                    <div className="text-[#2FA4D7] font-bold text-[10px] truncate">
                      {pillar.engineeringSnippet.file}
                    </div>
                    <div className="text-white text-[11px] truncate">
                      {pillar.engineeringSnippet.line1}
                    </div>
                    <div className="text-[#F5E9D8]/60 text-[10px] truncate">
                      {pillar.engineeringSnippet.line2}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Proof Assurance Banner */}
        <div className="p-6 rounded-2xl bg-[#F5E9D8] border-2 border-[#3E2C23] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-xs sm:text-sm text-[#3E2C23] font-body">
              <strong>Guaranteed Results:</strong> If our 14-day pilot does not eliminate wheel-slip and pass your customer’s safety audit, you pay nothing.
            </p>
          </div>
          <button
            onClick={onLaunchConsole}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#E76F2E] text-white font-mono text-xs font-bold hover:bg-[#E76F2E]/90 transition-all shadow-xs shrink-0"
          >
            <span>Request 14-Day Pilot</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
