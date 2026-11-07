/**
 * Presentation Component: Multi-Modal Autonomous Fleet Architecture Showcase
 * Explicitly proves generalization across Humanoids, Heavy Off-Highway, Manipulators, AMRs, and Rovers.
 */

'use client';

import React, { useState } from 'react';
import {
  Activity,
  Truck,
  Cpu,
  Bot,
  Compass,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface LandingInteractiveModalitiesProps {
  readonly onSelectScenarioAndAudit: (scenarioKey: string) => void;
}

interface ModalityData {
  readonly key: string;
  readonly name: string;
  readonly category: string;
  readonly icon: React.ReactNode;
  readonly standard: string;
  readonly facility: string;
  readonly failureHazard: string;
  readonly consequence: string;
  readonly rootCause: string;
  readonly automatedPatch: string;
  readonly patchYaml: string;
  readonly stats: {
    readonly failureRateBefore: string;
    readonly failureRateAfter: string;
    readonly downtimeSaved: string;
  };
}

const MODALITY_FLEET: readonly ModalityData[] = [
  {
    key: 'humanoid_zmp_slip',
    name: 'Bipedal Humanoid Logistics',
    category: 'Humanoid Bipedal',
    icon: <Activity className="w-5 h-5 text-purple-400" />,
    standard: 'ISO 13482:2014 §5.3 (Personal Care & Humanoid Safety)',
    facility: 'Munich Robotics Proving Ground',
    failureHazard: 'Zero-Moment Point (ZMP) Foot Slip & Torso Tipping',
    consequence: 'Catastrophic robot structural damage ($120k/incident), line safety lockouts, and human worker hazard.',
    rootCause: 'Uneven pallet lifting across slick epoxy floor causes support foot traction loss; ZMP exits convex support polygon.',
    automatedPatch: 'Active Impedance Damping & Torso Accel Clamping Patch',
    patchYaml: `humanoid_balance_controller:
  ros__parameters:
    zmp_margin_threshold: 0.04 # m
    max_torso_pitch_rate: 0.35 # rad/s
    foot_traction_recovery_gain: 2.85`,
    stats: {
      failureRateBefore: '24.2%',
      failureRateAfter: '0.0%',
      downtimeSaved: '$180,000/mo',
    },
  },
  {
    key: 'heavy_hauler_skid',
    name: 'Autonomous Heavy Hauler (50T)',
    category: 'Mining & Heavy Off-Highway',
    icon: <Truck className="w-5 h-5 text-amber-400" />,
    standard: 'ISO 17757:2019 §4.3 (Earth-Moving & Mining Autonomy)',
    facility: 'Nevada Heavy Autonomy Range',
    failureHazard: '12% Grade Incline Mud Skid & Berm Breach Risk',
    consequence: '50-ton vehicle rollover, quarry berm breach, and catastrophic mine work halts.',
    rootCause: 'Rainwater mud reduces tire adhesion below μ=0.28 while descending 12% grade with 35-ton payload.',
    automatedPatch: 'Grade-Aware Deceleration Retarder Rate Limiter',
    patchYaml: `hauler_grade_speed_filter:
  ros__parameters:
    max_downhill_speed: 3.2 # m/s
    retarder_brake_precharge_pct: 45.0
    anti_slide_traction_lock: true`,
    stats: {
      failureRateBefore: '18.5%',
      failureRateAfter: '0.0%',
      downtimeSaved: '$340,000/mo',
    },
  },
  {
    key: 'manipulator_wrench_fault',
    name: '6-DOF Collaborative Robotic Arm',
    category: 'Industrial Manufacturing Cell',
    icon: <Cpu className="w-5 h-5 text-emerald-400" />,
    standard: 'ISO 10218-1 / ISO/TS 15066 (Collaborative Robotics)',
    facility: 'Stuttgart Automation Cell',
    failureHazard: 'Kinematic Singularity Dynamic Torque Limit Fault',
    consequence: 'Joint actuator trip-outs, dropped high-value auto parts, and collaborative safety shutdowns.',
    rootCause: 'High-speed pick trajectory passes through wrist singularity, spiking joint 5 torque to 195 Nm (>140 Nm limit).',
    automatedPatch: 'Cartesian Jerk Limiting & Null-Space Velocity Redistribution',
    patchYaml: `arm_kinematic_safety_governor:
  ros__parameters:
    singularity_avoidance_weight: 0.85
    max_joint_torque_nm: 135.0
    jerk_envelope_limit: 8.5 # rad/s³`,
    stats: {
      failureRateBefore: '31.0%',
      failureRateAfter: '0.0%',
      downtimeSaved: '$95,000/mo',
    },
  },
  {
    key: 'wheeled_amr_stopping_breach',
    name: 'Wheeled Industrial AMR (800kg)',
    category: 'Warehouse & Intralogistics',
    icon: <Bot className="w-5 h-5 text-blue-400" />,
    standard: 'ISO 3691-4:2020 §4.1.2 (Driverless Industrial Trucks)',
    facility: 'Chicago Logistics Distribution Hub',
    failureHazard: 'Spilled Coolant Low Friction Stopping Distance Breach',
    consequence: 'Fork-truck near-miss collisions, pedestrian zone intrusions, and OSHA facility shutdown fines.',
    rootCause: 'Spilled machining coolant drops friction to μ=0.18; AMR skids 1.8 meters past laser safety field.',
    automatedPatch: 'Dynamic Nav2 Speed Filter Velocity Mask',
    patchYaml: `speed_filter_mask_costmap:
  ros__parameters:
    filter_type: 0
    max_forward_speed: 0.65 # m/s
    min_deceleration_rate: 1.85 # m/s²`,
    stats: {
      failureRateBefore: '42.3%',
      failureRateAfter: '0.0%',
      downtimeSaved: '$210,000/mo',
    },
  },
  {
    key: 'urban_rover_glare',
    name: 'Urban Sidewalk Delivery Rover',
    category: 'Last-Mile Pedestrian Autonomy',
    icon: <Compass className="w-5 h-5 text-cyan-400" />,
    standard: 'ISO 22737:2021 (Low-Speed Autonomous Driving)',
    facility: 'Tokyo Urban Mobility Range',
    failureHazard: '95,000 Lux Direct Solar Glare Blind Spot',
    consequence: 'Phantom obstacle freeze in crosswalks, traffic disruption, and municipal operating permit risk.',
    rootCause: 'Low-angle afternoon sun blinds forward RGB cameras; perception drops pedestrian tracker confidence below 0.3.',
    automatedPatch: 'LiDAR/Radar Sensory Weight Re-balancing Node',
    patchYaml: `sensor_fusion_governor:
  ros__parameters:
    glare_lux_threshold: 85000
    lidar_confidence_boost: 1.65
    rgb_dropout_timeout_ms: 150`,
    stats: {
      failureRateBefore: '27.8%',
      failureRateAfter: '0.0%',
      downtimeSaved: '$65,000/mo',
    },
  },
];

export const LandingInteractiveModalities: React.FC<LandingInteractiveModalitiesProps> = ({
  onSelectScenarioAndAudit,
}) => {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const current = MODALITY_FLEET[activeIdx];

  return (
    <section id="modalities" className="py-20 relative" aria-label="Autonomous Modalities">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-xs text-purple-400 mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                Hardware Agnostic Physical AI
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              One Universal Safety Engine.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400">
                Five Autonomous Form Factors.
              </span>
            </h2>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Whether you build bipedal humanoids, 50-ton mining haulers, or collaborative robot arms, 
              Diffraction ingests your kinematics and automates ISO safety compliance without custom test rigs.
            </p>
          </div>

          <span className="text-xs text-slate-500 mono hidden lg:inline-block">
            5 Global Proving Grounds • Standardized ROS 2 Remediation
          </span>
        </div>

        {/* Interactive Modality Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-2">
          {MODALITY_FLEET.map((item, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center space-x-2.5 cursor-pointer ${
                  isActive
                    ? 'bg-white/[0.1] text-white border border-white/[0.2] shadow-lg shadow-black/50'
                    : 'bg-white/[0.03] hover:bg-white/[0.07] text-slate-400 border border-white/[0.06]'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Detailed Modality Display Container */}
        <div className="rounded-3xl bg-gradient-to-b from-[#111726] to-[#0c101a] border border-white/[0.12] p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: The Failure Breakdown */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 mono font-bold">
                  {current.category}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 mono">{current.facility}</span>
                <span className="text-slate-500">•</span>
                <span className="text-cyan-400 mono font-semibold">{current.standard}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {current.failureHazard}
              </h3>

              {/* Real World Consequence Callout */}
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs sm:text-sm text-rose-300 leading-relaxed flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-rose-200">The Real-World Financial Risk:</strong>{' '}
                  {current.consequence}
                </div>
              </div>

              {/* Root Cause Explanation */}
              <div className="space-y-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <div className="font-semibold text-white tracking-wide uppercase text-[11px] mono">
                  Physics Root Cause Analysis:
                </div>
                <p className="text-slate-400">{current.rootCause}</p>
              </div>

              {/* Solution Description */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm text-emerald-300 leading-relaxed flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-emerald-200">Diffraction Synthesized Remedy:</strong>{' '}
                  {current.automatedPatch}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onSelectScenarioAndAudit(current.key)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 cursor-pointer group"
                >
                  <Zap className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                  <span>Execute Complete Verification on {current.name}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right: Code Patch & Impact Stats */}
            <div className="lg:col-span-5 space-y-5">
              {/* Turnkey Patch Preview */}
              <div className="rounded-2xl bg-black/60 border border-white/[0.1] p-5 font-mono text-xs space-y-3">
                <div className="flex justify-between items-center text-[11px] text-slate-400 border-b border-white/[0.08] pb-2">
                  <span className="text-cyan-400 font-bold">ROS 2 SYNTHESIZED CONTROLLER PATCH</span>
                  <span className="text-emerald-400">READY TO MERGE</span>
                </div>
                <pre className="text-slate-300 text-[11px] leading-relaxed overflow-x-auto whitespace-pre">
                  {current.patchYaml}
                </pre>
                <div className="pt-2 border-t border-white/[0.08] flex justify-between items-center text-[10px] text-slate-400">
                  <span>Target: Nav2 / Zenoh Middleware</span>
                  <span className="text-emerald-400">✓ Signed Dossier Generated</span>
                </div>
              </div>

              {/* Benchmarked Impact Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase mono">Sim-to-Real Fail</div>
                  <div className="text-lg font-bold text-rose-400 mt-1 line-through">{current.stats.failureRateBefore}</div>
                  <div className="text-[10px] text-emerald-400 font-bold mt-0.5">→ {current.stats.failureRateAfter}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase mono">Downtime Saved</div>
                  <div className="text-sm sm:text-base font-bold text-emerald-300 mt-1.5 mono">
                    {current.stats.downtimeSaved}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase mono">Audit Speed</div>
                  <div className="text-sm sm:text-base font-bold text-cyan-300 mt-1.5 mono">
                    30 Sec
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
