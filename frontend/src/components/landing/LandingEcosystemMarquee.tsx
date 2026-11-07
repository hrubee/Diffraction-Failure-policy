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
  { name: 'ROS 2 Humble & Jazzy', category: 'Robotics Middleware' },
  { name: 'NVIDIA Isaac Sim', category: 'Omniverse Digital Twins' },
  { name: 'Foxglove MCAP', category: 'Telemetry Container' },
  { name: 'PX4 Autopilot', category: 'Off-Road & Aerial' },
  { name: 'Zenoh Protocol', category: 'Zero-Copy Pub/Sub' },
  { name: 'OpenUSD', category: '3D Physics Assets' },
  { name: 'ISO 3691-4', category: 'Industrial AMR Standard' },
  { name: 'ISO 13482', category: 'Bipedal Humanoid Safety' },
  { name: 'ISO 17757', category: 'Mining & Heavy Hauler' },
  { name: 'ISO 10218', category: 'Industrial Manipulators' },
  { name: 'ANSI/RIA R15.08', category: 'Part 2 Fleet Safety' },
  { name: 'C++20 / WebAssembly', category: 'Edge Governor' },
];

export const LandingEcosystemMarquee: React.FC = () => {
  return (
    <div className="w-full py-5 border-y border-slate-800 bg-[#0a0e17] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-3 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-bold uppercase tracking-wider text-[11px] text-slate-300 font-mono">
            Autonomous Ecosystem Compatibility
          </span>
        </div>
        <span className="hidden sm:inline-block text-[11px] text-slate-400 font-mono">
          Hardware Agnostic • Native ROS 2 / Zenoh Ingestion
        </span>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="animate-marquee flex items-center gap-4">
          {/* Double array for seamless loop */}
          {[...ECOSYSTEM_ITEMS, ...ECOSYSTEM_ITEMS].map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-lg bg-[#0e1320] border border-slate-800 hover:border-slate-700 transition-colors whitespace-nowrap"
            >
              <span className={`h-1.5 w-1.5 rounded-full ${index % 3 === 0 ? 'bg-blue-500' : index % 3 === 1 ? 'bg-orange-500' : 'bg-yellow-400'}`} />
              <span className="text-xs font-bold text-slate-200 tracking-tight font-headline">{item.name}</span>
              <span className="text-[10px] text-slate-400 font-mono px-1.5 py-0.5 rounded bg-slate-800">
                {item.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
