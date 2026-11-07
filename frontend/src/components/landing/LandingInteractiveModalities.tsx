/**
 * Presentation Component: Multi-Modal Autonomous Fleet Architecture Showcase
 * Explicitly proves generalization across Humanoids, Heavy Off-Highway, Manipulators, AMRs, and Rovers.
 * Palette: #2FA4D7 (Blue), #F5E9D8 (Beige Canvas), #3E2C23 (Espresso Brown), #E76F2E (Safety Orange)
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
    icon: <Activity className="w-5 h-5 text-[#2FA4D7]" />,
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
    icon: <Truck className="w-5 h-5 text-[#E76F2E]" />,
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
    icon: <Cpu className="w-5 h-5 text-[#2FA4D7]" />,
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
    icon: <Bot className="w-5 h-5 text-[#E76F2E]" />,
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
    icon: <Compass className="w-5 h-5 text-[#2FA4D7]" />,
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
    <section id="modalities" className="py-20 relative bg-[#F5E9D8]" aria-label="Autonomous Modalities">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#3E2C23]/15 pb-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-white border border-[#2FA4D7]/40 text-xs text-[#2FA4D7] font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#E76F2E]" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                Hardware Agnostic Physical AI
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3E2C23] tracking-tight leading-tight font-headline">
              One Universal Safety Engine.
              <br />
              <span className="text-[#E76F2E]">
                Five Autonomous Form Factors.
              </span>
            </h2>

            <p className="text-[#3E2C23]/80 text-sm sm:text-base leading-relaxed font-body">
              Whether you build bipedal humanoids, 50-ton mining haulers, or collaborative robot arms, 
              <strong>Diffract™</strong> ingests your kinematics and automates ISO safety compliance without custom test rigs.
            </p>
          </div>

          <span className="text-xs text-[#3E2C23]/60 font-mono hidden lg:inline-block">
            5 Global Proving Grounds • Standardized ROS 2 Remediation
          </span>
        </div>

        {/* Interactive Modality Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {MODALITY_FLEET.map((item, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`py-2.5 px-4 rounded-lg text-xs font-bold font-mono transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#3E2C23] text-[#F5E9D8] shadow-sm'
                    : 'bg-white hover:bg-[#FAF4EB] text-[#3E2C23] border border-[#3E2C23]/20'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Detailed Modality Display Container */}
        <div className="rounded-2xl bg-white border border-[#3E2C23]/15 p-6 sm:p-10 shadow-sm space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: The Failure Breakdown */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded bg-[#2FA4D7]/15 text-[#2FA4D7] border border-[#2FA4D7]/30 font-mono font-bold">
                  {current.category}
                </span>
                <span className="text-[#3E2C23]/40">•</span>
                <span className="text-[#3E2C23]/70 font-mono">{current.facility}</span>
                <span className="text-[#3E2C23]/40">•</span>
                <span className="text-[#E76F2E] font-mono font-bold">{current.standard}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-[#3E2C23] tracking-tight font-headline">
                {current.failureHazard}
              </h3>

              {/* Real World Consequence Callout */}
              <div className="p-4 rounded-xl bg-[#FFF4ED] border border-[#E76F2E]/30 text-xs sm:text-sm text-[#3E2C23] leading-relaxed flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-[#E76F2E] shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-[#E76F2E]">The Real-World Financial Risk:</strong>{' '}
                  {current.consequence}
                </div>
              </div>

              {/* Root Cause Explanation */}
              <div className="space-y-1.5 text-xs sm:text-sm text-[#3E2C23]/90 leading-relaxed font-body">
                <div className="font-bold text-[#3E2C23] tracking-wide uppercase text-[11px] font-mono">
                  Physics Root Cause Analysis:
                </div>
                <p className="text-[#3E2C23]/80">{current.rootCause}</p>
              </div>

              {/* Solution Description */}
              <div className="p-4 rounded-xl bg-[#EDF7FC] border border-[#2FA4D7]/30 text-xs sm:text-sm text-[#3E2C23] leading-relaxed flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-[#2FA4D7] shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-[#2FA4D7]">Diffract™ Synthesized Remedy:</strong>{' '}
                  {current.automatedPatch}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onSelectScenarioAndAudit(current.key)}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#2FA4D7] hover:bg-[#258ec0] active:bg-[#1d749e] text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer group"
                >
                  <Zap className="w-4 h-4 fill-current text-[#F5E9D8] group-hover:scale-110 transition-transform" />
                  <span>Execute Verification in Diffract Studio</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right: Code Patch & Impact Stats (High Contrast Espresso Terminal) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Turnkey Patch Preview */}
              <div className="rounded-xl bg-[#3E2C23] border border-[#3E2C23] p-5 font-mono text-xs space-y-3 text-[#F5E9D8] shadow-md">
                <div className="flex justify-between items-center text-[11px] text-[#F5E9D8]/70 border-b border-[#F5E9D8]/15 pb-2">
                  <span className="text-[#2FA4D7] font-bold">ROS 2 SYNTHESIZED CONTROLLER PATCH</span>
                  <span className="text-[#E76F2E] font-bold">READY TO MERGE</span>
                </div>
                <pre className="text-[#F5E9D8] text-[11px] leading-relaxed overflow-x-auto whitespace-pre font-mono">
                  {current.patchYaml}
                </pre>
                <div className="pt-2 border-t border-[#F5E9D8]/15 flex justify-between items-center text-[10px] text-[#F5E9D8]/70">
                  <span>Target: Nav2 / Zenoh Middleware</span>
                  <span className="text-[#2FA4D7] font-bold">✓ Signed Dossier Generated</span>
                </div>
              </div>

              {/* Benchmarked Impact Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#FAF4EB] border border-[#3E2C23]/15 text-center">
                  <div className="text-[10px] font-semibold text-[#3E2C23]/70 uppercase mono">Sim-to-Real Fail</div>
                  <div className="text-lg font-bold text-[#E76F2E] mt-1 line-through">{current.stats.failureRateBefore}</div>
                  <div className="text-[10px] text-[#2FA4D7] font-bold mt-0.5">→ {current.stats.failureRateAfter}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF4EB] border border-[#3E2C23]/15 text-center">
                  <div className="text-[10px] font-semibold text-[#3E2C23]/70 uppercase mono">Downtime Saved</div>
                  <div className="text-sm sm:text-base font-bold text-[#3E2C23] mt-1.5 mono">
                    {current.stats.downtimeSaved}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF4EB] border border-[#3E2C23]/15 text-center">
                  <div className="text-[10px] font-semibold text-[#3E2C23]/70 uppercase mono">Audit Speed</div>
                  <div className="text-sm sm:text-base font-bold text-[#2FA4D7] mt-1.5 mono">
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
