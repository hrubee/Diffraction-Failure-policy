/**
 * Presentation Component: Commercial Pricing & GPU Cluster Tiers
 * Strict Color Hunt 4-Color Palette: #2FA4D7, #F5E9D8, #3E2C23, #E76F2E (Zero Gradients).
 */

'use client';

import React from 'react';
import { Server, Zap, Check, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const EnterprisePricingView: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2 pt-4">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2FA4D7]">
          NVIDIA Isaac Sim Cloud Compute
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3E2C23] font-headline tracking-tight">
          Synthetic Data Factory &amp; Cluster Licensing
        </h2>
        <p className="text-xs sm:text-sm text-[#3E2C23]/75 font-body">
          Generate millions of photorealistic demonstrations in hours. Stop hiring armies of human teleoperators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tier 1 */}
        <div className="p-6 rounded-2xl bg-white border-2 border-[#3E2C23] shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="text-xs font-mono font-bold text-[#3E2C23]/70 uppercase tracking-wider">
              Robotics Lab Tier
            </div>
            <h3 className="text-lg font-bold text-[#3E2C23] font-headline">Research &amp; Prototyping</h3>
            <div className="text-3xl font-black text-[#3E2C23] font-headline">
              $2,500 <span className="text-xs font-normal text-[#3E2C23]/60 font-mono">/ month</span>
            </div>
            <p className="text-xs text-[#3E2C23]/80 leading-relaxed font-body">
              Ideal for research teams and early-stage Physical AI startups training their first VLA policies.
            </p>

            <ul className="text-xs text-[#3E2C23] space-y-2.5 border-t border-[#3E2C23]/15 pt-4 font-mono font-bold">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#2FA4D7] shrink-0" />
                <span>50,000 Synthetic Episodes / month</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#2FA4D7] shrink-0" />
                <span>16x Headless GPU Workers (12,000 FPS)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#2FA4D7] shrink-0" />
                <span>4 Standard OpenUSD Procedural Worlds</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#2FA4D7] shrink-0" />
                <span>Hugging Face LeRobot &amp; Open-X Export</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#2FA4D7] shrink-0" />
                <span>Standard Community Support</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => alert('Developer pilot requested. Our engineering team will contact you within 2 hours.')}
            className="w-full py-2.5 rounded-lg border-2 border-[#3E2C23] text-[#3E2C23] hover:bg-[#F5E9D8] text-xs font-bold font-mono transition-colors cursor-pointer"
          >
            Start Lab Pilot
          </button>
        </div>

        {/* Tier 2: Recommended */}
        <div className="p-6 rounded-2xl bg-white border-2 border-[#2FA4D7] shadow-md relative flex flex-col justify-between space-y-6">
          <div className="absolute -top-3 right-6 px-3 py-0.5 bg-[#2FA4D7] rounded-full text-[9px] font-extrabold uppercase tracking-widest text-white font-mono">
            Most Popular
          </div>
          <div className="space-y-4">
            <div className="text-xs font-mono font-bold text-[#2FA4D7] uppercase tracking-wider">
              Commercial Fleet Scale
            </div>
            <h3 className="text-lg font-bold text-[#3E2C23] font-headline">Foundation Model Factory</h3>
            <div className="text-3xl font-black text-[#3E2C23] font-headline">
              $9,500 <span className="text-xs font-normal text-[#3E2C23]/60 font-mono">/ month</span>
            </div>
            <p className="text-xs text-[#3E2C23]/80 leading-relaxed font-body">
              For commercial AMR, humanoid, and manipulator fleets training high-throughput production foundation models.
            </p>

            <ul className="text-xs text-[#3E2C23] space-y-2.5 border-t border-[#3E2C23]/15 pt-4 font-mono font-bold">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#2FA4D7] shrink-0" />
                <span>250,000 Synthetic Episodes / month</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#2FA4D7] shrink-0" />
                <span>64x NVIDIA H100 SXM5 Workers (48,200 FPS)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#2FA4D7] shrink-0" />
                <span>Custom OpenUSD Stage Authoring</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#2FA4D7] shrink-0" />
                <span>Empirical Sim-to-Real Calibration Engine</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#2FA4D7] shrink-0" />
                <span>Python SDK &amp; GitHub Actions CI/CD Integration</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#2FA4D7] shrink-0" />
                <span>Dedicated Sim2Real Solutions Architect</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => alert('Foundation Factory plan selected. Setup call scheduled.')}
            className="w-full py-2.5 rounded-lg bg-[#2FA4D7] hover:bg-[#2FA4D7]/90 text-white text-xs font-bold font-mono transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>Deploy Factory Cluster</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tier 3: Enterprise Dedicated */}
        <div className="p-6 rounded-2xl bg-white border-2 border-[#3E2C23] shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="text-xs font-mono font-bold text-[#E76F2E] uppercase tracking-wider">
              Dedicated DGX Cloud
            </div>
            <h3 className="text-lg font-bold text-[#3E2C23] font-headline">Enterprise Air-Gapped</h3>
            <div className="text-3xl font-black text-[#3E2C23] font-headline">
              $35,000 <span className="text-xs font-normal text-[#3E2C23]/60 font-mono">/ month</span>
            </div>
            <p className="text-xs text-[#3E2C23]/80 leading-relaxed font-body">
              Dedicated, private cluster instances for autonomous vehicle OEMs, defense contractors, and large robotics fleets.
            </p>

            <ul className="text-xs text-[#3E2C23] space-y-2.5 border-t border-[#3E2C23]/15 pt-4 font-mono font-bold">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#E76F2E] shrink-0" />
                <span>Unlimited Synthetic Episodes</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#E76F2E] shrink-0" />
                <span>128+ Dedicated NVIDIA H100 / Blackwell Nodes</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#E76F2E] shrink-0" />
                <span>VPC On-Premises or Private Cloud Deployment</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#E76F2E] shrink-0" />
                <span>Hardware-Specific Sensor Profiling &amp; Noise Tuning</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#E76F2E] shrink-0" />
                <span>24/7 Priority SLA &amp; SOTIF Compliance Dossiers</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => alert('Enterprise DGX Cloud inquiry received. Enterprise director will coordinate.')}
            className="w-full py-2.5 rounded-lg bg-[#3E2C23] hover:bg-[#3E2C23]/90 text-[#F5E9D8] text-xs font-bold font-mono transition-colors cursor-pointer"
          >
            Contact Enterprise Sales
          </button>
        </div>
      </div>
    </div>
  );
};
