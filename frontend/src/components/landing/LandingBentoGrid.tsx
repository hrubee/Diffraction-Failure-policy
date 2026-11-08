/**
 * Presentation Component: Platform Capabilities Bento Grid
 * High-density showcase of the 6 pillars of the Diffraction Synthetic Data Factory.
 *
 * Strict Color Hunt 4-Color Palette: #2FA4D7, #F5E9D8, #3E2C23, #E76F2E (Zero Gradients).
 */

'use client';

import React from 'react';
import {
  Layers,
  Camera,
  Sliders,
  ShieldCheck,
  Database,
  Server,
  ArrowRight,
  Cpu,
} from 'lucide-react';

interface LandingBentoGridProps {
  readonly onLaunchConsole: () => void;
  readonly onOpenGovernor: () => void;
  readonly onOpenTelematics: () => void;
}

export const LandingBentoGrid: React.FC<LandingBentoGridProps> = ({
  onLaunchConsole,
  onOpenGovernor,
  onOpenTelematics,
}) => {
  return (
    <section id="capabilities" className="py-20 relative" aria-label="Diffraction Platform Capabilities">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-white border border-[#3E2C23]/20 text-xs text-[#3E2C23] font-mono shadow-xs">
            <Layers className="w-3.5 h-3.5 text-[#2FA4D7]" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              NVIDIA Isaac Sim &amp; OpenUSD Architecture
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3E2C23] tracking-tight leading-tight font-headline">
            Engineered for physical reality.
            <br />
            <span className="text-[#2FA4D7]">
              Not idealized lab animations.
            </span>
          </h2>

          <p className="text-[#3E2C23]/80 text-sm sm:text-base leading-relaxed font-body">
            Every layer of <strong>Diffraction</strong> is built on NVIDIA PhysX 5 GPU physics, RTX ray-tracing, and OpenUSD to synthesize training data that closes the reality gap.
          </p>
        </div>

        {/* The Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Procedural OpenUSD Stages */}
          <div className="rounded-2xl bg-white border-2 border-[#3E2C23] p-6 flex flex-col justify-between space-y-6 shadow-xs hover:border-[#2FA4D7] transition-all">
            <div className="space-y-4">
              <div className="p-3 w-fit rounded-lg bg-[#2FA4D7] text-white">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2FA4D7] font-mono">Pillar 01</span>
                <h3 className="text-lg font-bold text-[#3E2C23] tracking-tight font-headline">
                  Procedural OpenUSD Stages
                </h3>
                <p className="text-xs text-[#3E2C23]/75 leading-relaxed font-body">
                  Generate 10,000+ randomized 3D environments: high-bay fulfillment centers, solar-glare loading docks, cleanrooms, and domestic clutter with calibrated material friction and restitution.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#3E2C23] text-[#F5E9D8] font-mono text-[11px] space-y-1">
              <div className="text-[#2FA4D7] font-bold"># warehouse_fulfillment.usd</div>
              <div>Racks: <span className="text-white">14,200</span> • Lights: <span className="text-white">RTX Ray-Traced</span></div>
            </div>
          </div>

          {/* Card 2: RTX Multimodal Sensors */}
          <div className="rounded-2xl bg-white border-2 border-[#3E2C23] p-6 flex flex-col justify-between space-y-6 shadow-xs hover:border-[#2FA4D7] transition-all">
            <div className="space-y-4">
              <div className="p-3 w-fit rounded-lg bg-[#E76F2E] text-white">
                <Camera className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E76F2E] font-mono">Pillar 02</span>
                <h3 className="text-lg font-bold text-[#3E2C23] tracking-tight font-headline">
                  RTX Multimodal Sensor Streams
                </h3>
                <p className="text-xs text-[#3E2C23]/75 leading-relaxed font-body">
                  Simulate synchronized multi-view cameras, 16-bit normalized depth maps, pixel-accurate semantic masks, 32-beam 3D LiDAR point clouds, and 500Hz joint torques with rolling shutter artifacts.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#3E2C23] text-[#F5E9D8] font-mono text-[11px] space-y-1">
              <div className="text-[#E76F2E] font-bold"># sensor_suite_config.yaml</div>
              <div>Streams: <span className="text-white">5 Synchronized Channels</span> • Rate: <span className="text-white">60 FPS</span></div>
            </div>
          </div>

          {/* Card 3: Multi-Physics Domain Randomization */}
          <div className="rounded-2xl bg-white border-2 border-[#3E2C23] p-6 flex flex-col justify-between space-y-6 shadow-xs hover:border-[#2FA4D7] transition-all">
            <div className="space-y-4">
              <div className="p-3 w-fit rounded-lg bg-[#3E2C23] text-[#F5E9D8]">
                <Sliders className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#3E2C23] font-mono">Pillar 03</span>
                <h3 className="text-lg font-bold text-[#3E2C23] tracking-tight font-headline">
                  Multi-Physics Domain Randomization
                </h3>
                <p className="text-xs text-[#3E2C23]/75 leading-relaxed font-body">
                  Sweep lighting from 50 to 95,000 Lux, non-linear Pacejka friction (μ = 0.10 - 0.95), dynamic load transfer, motor torque saturation, and ROS 2 transport latency jitter.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#3E2C23] text-[#F5E9D8] font-mono text-[11px] space-y-1">
              <div className="text-emerald-400 font-bold"># domain_randomization.json</div>
              <div>Friction: <span className="text-white">μ ∈ [0.10, 0.95]</span> • Glare: <span className="text-white">95k Lux</span></div>
            </div>
          </div>

          {/* Card 4: Sim-to-Real Calibration Engine */}
          <div className="rounded-2xl bg-white border-2 border-[#3E2C23] p-6 flex flex-col justify-between space-y-6 shadow-xs hover:border-[#2FA4D7] transition-all">
            <div className="space-y-4">
              <div className="p-3 w-fit rounded-lg bg-emerald-600 text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 font-mono">Pillar 04</span>
                <h3 className="text-lg font-bold text-[#3E2C23] tracking-tight font-headline">
                  Sim-to-Real Calibration Engine
                </h3>
                <p className="text-xs text-[#3E2C23]/75 leading-relaxed font-body">
                  Empirically calibrate synthetic noise distributions against thousands of physical robot logs. Achieves a 94.2% zero-shot policy transfer success rate on physical hardware.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#3E2C23] text-[#F5E9D8] font-mono text-[11px] space-y-1">
              <div className="text-emerald-400 font-bold"># sim2real_metric.log</div>
              <div>Wasserstein W₁: <span className="text-white">0.038</span> • Zero-Shot: <span className="text-white">94.2%</span></div>
            </div>
          </div>

          {/* Card 5: Hugging Face LeRobot & Open-X */}
          <div className="rounded-2xl bg-white border-2 border-[#3E2C23] p-6 flex flex-col justify-between space-y-6 shadow-xs hover:border-[#2FA4D7] transition-all">
            <div className="space-y-4">
              <div className="p-3 w-fit rounded-lg bg-[#2FA4D7] text-white">
                <Database className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2FA4D7] font-mono">Pillar 05</span>
                <h3 className="text-lg font-bold text-[#3E2C23] tracking-tight font-headline">
                  LeRobot &amp; Open-X Exporters
                </h3>
                <p className="text-xs text-[#3E2C23]/75 leading-relaxed font-body">
                  One-click export directly into Hugging Face LeRobot, Google Open-X RLDS, PyTorch HDF5, and ROS 2 MCAP formats for immediate policy training in Diffusion Policy and OpenVLA.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#3E2C23] text-[#F5E9D8] font-mono text-[11px] space-y-1">
              <div className="text-[#2FA4D7] font-bold"># dataset_export.parquet</div>
              <div>Episodes: <span className="text-white">250,000</span> • Format: <span className="text-white">LeRobot v2</span></div>
            </div>
          </div>

          {/* Card 6: NVIDIA Cosmos Transfer 2.5 Augmentation */}
          <div className="rounded-2xl bg-white border-2 border-[#3E2C23] p-6 flex flex-col justify-between space-y-6 shadow-xs hover:border-[#2FA4D7] transition-all">
            <div className="space-y-4">
              <div className="p-3 w-fit rounded-lg bg-[#E76F2E] text-white">
                <Server className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E76F2E] font-mono">Pillar 06</span>
                <h3 className="text-lg font-bold text-[#3E2C23] tracking-tight font-headline">
                  NVIDIA Cosmos Transfer 2.5
                </h3>
                <p className="text-xs text-[#3E2C23]/75 leading-relaxed font-body">
                  Apply diffusion video transfer guided by ControlNet semantic maps and Canny edges. Turns coarse simulation into cinematic photorealism with zero action drift—proven to deliver the highest Sim2Real transfer in Physical AI.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#3E2C23] text-[#F5E9D8] font-mono text-[11px] space-y-1">
              <div className="text-[#E76F2E] font-bold"># cosmos_transfer_spec.json</div>
              <div>Model: <span className="text-white">Cosmos 2.5</span> • Kinematic Drift: <span className="text-emerald-400">0.000 mm</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
