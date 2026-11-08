/**
 * Presentation Component: Client Sprint Portal & SOW Workspace
 * Positions Diffraction as an elite productized service studio for Physical AI.
 * Clients scope fixed-fee sprints, track active engineering milestones,
 * and download certified PhysX 5 OpenUSD assets and Cosmos datasets.
 *
 * Strict Color Hunt 4-Color Palette: #2FA4D7, #F5E9D8, #3E2C23, #E76F2E (Zero Gradients).
 */

'use client';

import React, { useState } from 'react';
import {
  SPRINT_PACKAGES,
  SEED_EMBODIMENTS,
  SEED_ENVIRONMENTS,
} from '@/domain/synthetic/catalog';
import { ClientSowConfigurator } from './ClientSowConfigurator';
import { MultimodalStreamInspector } from './MultimodalStreamInspector';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  FileText,
  Download,
  Layers,
  ArrowRight,
  Send,
  Zap,
  Cpu,
  UserCheck,
  PackageCheck,
  ExternalLink,
} from 'lucide-react';

interface ActiveClientSprint {
  readonly id: string;
  readonly clientName: string;
  readonly packageName: string;
  readonly packageId: string;
  readonly embodiment: string;
  readonly environment: string;
  readonly fixedFeeUsd: number;
  readonly turnaroundDays: number;
  readonly currentDay: number;
  readonly currentMilestone: string;
  readonly progressPct: number;
  readonly status: 'IN_PROGRESS' | 'COMPLETED' | 'IN_REVIEW';
  readonly sim2realFidelity: string;
  readonly assignedLead: string;
  readonly deliverables: readonly string[];
}

const ACTIVE_CLIENT_SPRINTS: readonly ActiveClientSprint[] = [
  {
    id: 'SOW-2026-8812',
    clientName: 'AgileX Robotics Corp',
    packageName: 'Cosmos Synthetic Dataset Sprint',
    packageId: 'cosmos_dataset',
    embodiment: 'AgileX Hunter SE Industrial AMR',
    environment: 'Automated High-Bay Logistics Fulfillment Center',
    fixedFeeUsd: 35000,
    turnaroundDays: 14,
    currentDay: 11,
    currentMilestone: 'Phase 4: NVIDIA Cosmos Transfer 2.5 Action-Invariant Diffusion Augmentation',
    progressPct: 78,
    status: 'IN_PROGRESS',
    sim2realFidelity: '98.6% (Wasserstein W1 = 0.038)',
    assignedLead: 'Dr. Elena Rostova (Senior Simulation Lead)',
    deliverables: [
      '250,000 demonstration trajectories across 500 warehouse lighting permutations',
      'Synchronized 1080p RGB, 16-bit Depth, Semantic Segmentation, and 32-beam LiDAR',
      'Hugging Face LeRobot v2 parquet shards + zero-copy PyTorch DataLoader',
      'Signed Sim2Real Wasserstein distribution certification report',
    ],
  },
  {
    id: 'SOW-2026-8810',
    clientName: 'Sanctuary Physical AI Labs',
    packageName: 'Robot USD Physics Rig Sprint',
    packageId: 'robot_usd_rig',
    embodiment: 'Unitree H1 Bipedal Humanoid (19-DoF)',
    environment: 'Domestic Kitchen & Living Environment',
    fixedFeeUsd: 7500,
    turnaroundDays: 3,
    currentDay: 3,
    currentMilestone: 'Sprint Complete: All assets verified & delivered',
    progressPct: 100,
    status: 'COMPLETED',
    sim2realFidelity: '97.9% Verified (Zero Kinematic Drift)',
    assignedLead: 'Marcus Vance (Principal PhysX Engineer)',
    deliverables: [
      'Turnkey unitree_h1_physx5.usda asset with rigid bodies & collision envelopes',
      'Joint damping, drive stiffness, and inertia tensor calibration at 500Hz',
      'Drop-in Python unitree_h1_cfg.py class for NVIDIA Isaac Lab / Orbit',
      '10-episode sanity check verification video + physics stability log',
    ],
  },
  {
    id: 'SOW-2026-8806',
    clientName: 'Apex Logistics Automation',
    packageName: 'Procedural Training Stage Sprint',
    packageId: 'procedural_stage',
    embodiment: 'Autonomous High-Bay Forklift Fleet',
    environment: 'Exterior Loading Dock with Solar Glare & Rain Slicks',
    fixedFeeUsd: 18500,
    turnaroundDays: 7,
    currentDay: 7,
    currentMilestone: 'Sprint Complete: OpenUSD Stage & Replicator Recipe Delivered',
    progressPct: 100,
    status: 'COMPLETED',
    sim2realFidelity: '98.4% Surface Calibration',
    assignedLead: 'Marcus Vance (Principal PhysX Engineer)',
    deliverables: [
      'Exterior loading dock OpenUSD stage with afternoon solar glare (>85,000 Lux)',
      'Omniverse Replicator dynamic friction recipe (μ = 0.15 - 0.75, rain slicks)',
      'Dynamic obstacle traffic generators (forklifts, pedestrians, chokepoints)',
      'Multi-camera sensor rig definitions (Stereo RGB, LiDAR, Depth)',
    ],
  },
];

export const SyntheticFactoryStudio: React.FC = () => {
  const [activePortalTab, setActivePortalTab] = useState<'sow' | 'tracker' | 'quality'>('sow');
  const [selectedSprint, setSelectedSprint] = useState<ActiveClientSprint>(ACTIVE_CLIENT_SPRINTS[0]);

  return (
    <div className="space-y-8">
      {/* Studio Banner */}
      <div className="bg-[#3E2C23] text-[#F5E9D8] p-6 sm:p-8 rounded-2xl border-2 border-[#3E2C23] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#2FA4D7] text-white">
              Diffraction Physical AI Studio
            </span>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#E76F2E] text-white">
              Bespoke Engineering Sprints
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-headline tracking-tight text-[#F5E9D8]">
            Client Sprint Portal &amp; SOW Workspace
          </h1>
          <p className="text-sm sm:text-base text-[#F5E9D8]/80 leading-relaxed font-body">
            Diffraction delivers turnkey NVIDIA Isaac Sim OpenUSD assets, procedural training stages, and Cosmos demonstration datasets in 3 to 14 days. Configure your statement of work or track active sprint milestones below.
          </p>
        </div>

        {/* Portal Tab Switcher */}
        <div className="flex bg-[#2A1D17] p-1 rounded-xl border border-white/10 shrink-0 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActivePortalTab('sow')}
            className={`px-4 py-2.5 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activePortalTab === 'sow' ? 'bg-[#2FA4D7] text-white shadow-xs' : 'text-[#F5E9D8]/70 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#E76F2E]" />
            <span>Scope Sprint SOW ($7.5k+)</span>
          </button>
          <button
            type="button"
            onClick={() => setActivePortalTab('tracker')}
            className={`px-4 py-2.5 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activePortalTab === 'tracker' ? 'bg-[#2FA4D7] text-white shadow-xs' : 'text-[#F5E9D8]/70 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Active Sprint Tracker (3)</span>
          </button>
          <button
            type="button"
            onClick={() => setActivePortalTab('quality')}
            className={`px-4 py-2.5 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activePortalTab === 'quality' ? 'bg-[#2FA4D7] text-white shadow-xs' : 'text-[#F5E9D8]/70 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sim2Real Quality Inspector</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SOW CONFIGURATOR */}
      {activePortalTab === 'sow' && <ClientSowConfigurator />}

      {/* TAB 2: ACTIVE SPRINT DELIVERY TRACKER */}
      {activePortalTab === 'tracker' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {ACTIVE_CLIENT_SPRINTS.map((sprint) => {
              const isSelected = selectedSprint.id === sprint.id;
              return (
                <div
                  key={sprint.id}
                  onClick={() => setSelectedSprint(sprint)}
                  className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'border-[#2FA4D7] bg-[#2FA4D7]/10 shadow-xs'
                      : 'border-[#3E2C23]/20 bg-white hover:border-[#3E2C23]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#2FA4D7]">{sprint.id}</span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          sprint.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-[#E76F2E] text-white'
                        }`}
                      >
                        {sprint.status === 'COMPLETED' ? 'DELIVERED' : 'IN DELIVERY'}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-[#3E2C23] font-headline">{sprint.clientName}</h3>
                    <p className="text-xs text-[#3E2C23]/80 font-body">{sprint.packageName}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#3E2C23]/10">
                    <div className="flex justify-between text-xs font-mono text-[#3E2C23]">
                      <span>Progress: Day {sprint.currentDay} / {sprint.turnaroundDays}</span>
                      <span className="font-bold text-[#2FA4D7]">{sprint.progressPct}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#F5E9D8] rounded-full overflow-hidden border border-[#3E2C23]/20">
                      <div
                        className="h-full bg-[#2FA4D7] transition-all"
                        style={{ width: `${sprint.progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Sprint Detailed Dossier */}
          {selectedSprint && (
            <div className="bg-white border-2 border-[#3E2C23] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3E2C23]/15 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#2FA4D7]">{selectedSprint.id}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#3E2C23] text-white font-bold">
                      ${selectedSprint.fixedFeeUsd.toLocaleString()} Fixed Contract
                    </span>
                    <span className="text-xs font-mono text-emerald-700 font-bold">
                      {selectedSprint.turnaroundDays}-Day Delivery SLA
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#3E2C23] font-headline">
                    {selectedSprint.clientName}: {selectedSprint.packageName}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#3E2C23]/80 font-body">
                    <strong>Target Embodiment:</strong> {selectedSprint.embodiment} • <strong>Environment:</strong> {selectedSprint.environment}
                  </p>
                </div>

                <div className="text-right shrink-0 font-mono text-xs text-[#3E2C23] space-y-1">
                  <div className="flex items-center gap-1.5 justify-end text-[#3E2C23]/70">
                    <UserCheck className="w-4 h-4 text-[#2FA4D7]" />
                    <span>Sprint Lead:</span>
                  </div>
                  <div className="font-bold">{selectedSprint.assignedLead}</div>
                </div>
              </div>

              {/* Current Milestone Status */}
              <div className="p-4 bg-[#F5E9D8]/60 rounded-xl border border-[#3E2C23]/20 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#E76F2E] uppercase">CURRENT SPRINT MILESTONE:</span>
                  <span className="text-[#3E2C23]/70">Day {selectedSprint.currentDay} of {selectedSprint.turnaroundDays}</span>
                </div>
                <div className="text-sm font-bold text-[#3E2C23] font-headline">
                  {selectedSprint.currentMilestone}
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-800">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sim2Real Calibration Status: <strong>{selectedSprint.sim2realFidelity}</strong></span>
                </div>
              </div>

              {/* Deliverables Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold font-headline uppercase tracking-wide text-[#3E2C23]">
                  Sprint Deliverables &amp; Artifacts:
                </h4>
                <div className="space-y-2">
                  {selectedSprint.deliverables.map((del, i) => (
                    <div
                      key={i}
                      className="p-3 bg-white rounded-lg border border-[#3E2C23]/20 flex items-center justify-between gap-4 text-xs font-body text-[#3E2C23]"
                    >
                      <div className="flex items-center space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#2FA4D7] shrink-0" />
                        <span>{del}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F5E9D8] text-[#3E2C23] font-bold shrink-0 border border-[#3E2C23]/15">
                        {selectedSprint.status === 'COMPLETED' ? 'DELIVERED' : 'IN QA REVIEW'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Action Bar */}
              <div className="pt-4 border-t border-[#3E2C23]/15 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs font-mono text-[#3E2C23]/70">
                  Backed by the <strong>100% Sim-to-Real Transfer Guarantee</strong>.
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => alert(`Deliverable archive for ${selectedSprint.id} is encrypted with your tenant private key. Please check your secure email drop.`)}
                    className="px-4 py-2.5 rounded-lg bg-[#2FA4D7] hover:bg-[#258ec0] text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Certified Deliverables</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActivePortalTab('sow');
                    }}
                    className="px-4 py-2.5 rounded-lg border-2 border-[#3E2C23] text-[#3E2C23] hover:bg-[#F5E9D8] text-xs font-mono font-bold cursor-pointer transition-colors"
                  >
                    Scope Next Sprint →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SIM2REAL QUALITY INSPECTOR */}
      {activePortalTab === 'quality' && (
        <section aria-label="Sim2Real Quality Assurance">
          <div className="space-y-4 mb-4">
            <h3 className="text-lg font-bold font-headline text-[#3E2C23]">
              Sim-to-Real Multi-Modal Quality Assurance &amp; Kinematic Invariance
            </h3>
            <p className="text-xs sm:text-sm text-[#3E2C23]/80 font-body">
              Every deliverable produced by Diffraction Studio is verified against our 3-stage validation pipeline to guarantee that robot joint kinematics remain 100% invariant while visual streams achieve photorealism.
            </p>
          </div>
          <MultimodalStreamInspector
            selectedEmbodimentId={SEED_EMBODIMENTS[1].name}
            selectedEnvironmentId={SEED_ENVIRONMENTS[0].name}
            lightingLux={450}
            frictionMu={0.28}
          />
        </section>
      )}
    </div>
  );
};
