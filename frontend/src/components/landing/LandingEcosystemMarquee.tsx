/**
 * Presentation Component: Ecosystem & Regulatory Standards Marquee
 * Continuous infinite ticker demonstrating tier-1 physical AI infrastructure support.
 */

'use client';

import React from 'react';
import { Cpu, ShieldCheck, Layers, Terminal, Sparkles } from 'lucide-react';

interface EcosystemItem {
  readonly name: string;
  readonly category: string;
}

const ECOSYSTEM_ITEMS: readonly EcosystemItem[] = [
  { name: 'NVIDIA Omniverse', category: 'RTX Photorealism' },
  { name: 'NVIDIA Isaac Sim', category: 'GPU Physics Engine' },
  { name: 'NVIDIA Isaac Lab', category: 'VLA & RL Framework' },
  { name: 'OpenUSD', category: 'Universal 3D Asset Standard' },
  { name: 'Hugging Face LeRobot', category: 'Physical AI Dataset Format' },
  { name: 'Google Open-X Embodiment', category: 'RLDS Benchmark Standard' },
  { name: 'PhysX 5', category: 'GPU Rigid Body & Contact' },
  { name: 'PyTorch 2.4+', category: 'Policy Training Backbone' },
  { name: 'ROS 2 Humble & Jazzy', category: 'Robotics Middleware' },
  { name: 'NVIDIA DGX Cloud', category: 'H100 Cluster Execution' },
  { name: 'Foxglove MCAP', category: 'Zero-Copy Log Container' },
  { name: 'Diffusion Policy & ACT', category: 'Frontier Action Models' },
];

export const LandingEcosystemMarquee: React.FC = () => {
  return (
    <div className="w-full py-5 border-y border-[#3E2C23]/15 bg-[#FAF4EB] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-3 flex items-center justify-between text-xs text-[#3E2C23]/70">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-[#2FA4D7]" />
          <span className="font-bold uppercase tracking-wider text-[11px] text-[#3E2C23] font-mono">
            Autonomous Ecosystem Compatibility
          </span>
        </div>
        <span className="hidden sm:inline-block text-[11px] text-[#3E2C23]/70 font-mono">
          Hardware Agnostic • Native ROS 2 / Zenoh Ingestion
        </span>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="animate-marquee flex items-center gap-4">
          {/* Double array for seamless loop */}
          {[...ECOSYSTEM_ITEMS, ...ECOSYSTEM_ITEMS].map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-lg bg-white border border-[#3E2C23]/15 hover:border-[#3E2C23]/30 transition-colors whitespace-nowrap shadow-2xs"
            >
              <span className={`h-1.5 w-1.5 rounded-full ${index % 2 === 0 ? 'bg-[#2FA4D7]' : 'bg-[#E76F2E]'}`} />
              <span className="text-xs font-bold text-[#3E2C23] tracking-tight font-headline">{item.name}</span>
              <span className="text-[10px] text-[#3E2C23]/70 font-mono px-1.5 py-0.5 rounded bg-[#FAF4EB]">
                {item.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
