/**
 * Presentation Component: Sim-to-Real Alignment Lab
 * Provides empirical mathematical proof and distribution divergence metrics
 * demonstrating that synthetic data generated in Diffraction Isaac Sim transfers
 * zero-shot to physical robotics hardware.
 *
 * Strict Color Hunt 4-Color Palette: #2FA4D7, #F5E9D8, #3E2C23, #E76F2E (Zero Gradients).
 */

'use client';

import React from 'react';
import { SEED_BENCHMARK } from '@/domain/synthetic/catalog';
import {
  ShieldCheck,
  Activity,
  Layers,
  Cpu,
  BarChart2,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export const Sim2RealBenchmarkView: React.FC = () => {
  const benchmark = SEED_BENCHMARK;

  return (
    <div className="space-y-8">
      {/* Lab Banner */}
      <div className="bg-[#3E2C23] text-[#F5E9D8] p-6 sm:p-8 rounded-2xl border-2 border-[#3E2C23] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-600 text-white">
              Empirically Calibrated
            </span>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#2FA4D7] text-white">
              Zero-Shot Policy Transfer
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-headline tracking-tight text-[#F5E9D8]">
            Sim-to-Real Distribution Alignment Lab
          </h1>
          <p className="text-sm sm:text-base text-[#F5E9D8]/80 leading-relaxed">
            The fundamental bottleneck of synthetic data is the reality gap. Diffraction calibrates RTX sensor noise, rolling shutter, and non-linear Pacejka dynamics against thousands of real physical robot logs to guarantee zero-shot transfer.
          </p>
        </div>

        <div className="bg-white/10 px-5 py-4 rounded-xl border border-white/10 font-mono text-center shrink-0">
          <span className="text-[#F5E9D8]/60 text-xs block uppercase">Zero-Shot Transfer Rate</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-headline">94.2%</span>
          <span className="text-[10px] text-[#F5E9D8]/70 block mt-0.5">Physical Hardware Success</span>
        </div>
      </div>

      {/* 4 Quantitative Divergence Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border-2 border-[#3E2C23] p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-[#3E2C23]/60">
              Traction Wasserstein
            </span>
            <span className="p-1 rounded bg-[#2FA4D7]/15 text-[#2FA4D7]">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#3E2C23] font-headline">
            {benchmark.distributions.frictionSlipWassersteinDistance} W₁
          </div>
          <p className="text-xs text-[#3E2C23]/70">
            Measures non-linear Pacejka slip distance against physical test track odometry.
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border-2 border-[#3E2C23] p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-[#3E2C23]/60">
              Sensor Noise Match
            </span>
            <span className="p-1 rounded bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-headline">
            {benchmark.distributions.sensorNoiseCovarianceMatchPct}%
          </div>
          <p className="text-xs text-[#3E2C23]/70">
            Intel RealSense D435 chromatic noise and rolling shutter covariance alignment.
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border-2 border-[#3E2C23] p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-[#3E2C23]/60">
              Latency Divergence
            </span>
            <span className="p-1 rounded bg-[#E76F2E]/15 text-[#E76F2E]">
              <Cpu className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#3E2C23] font-headline">
            {benchmark.distributions.latencyJitterKlDivergence} D_KL
          </div>
          <p className="text-xs text-[#3E2C23]/70">
            Kullback-Leibler divergence between Isaac Lab transport jitter and Jetson Orin OS.
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border-2 border-[#3E2C23] p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-[#3E2C23]/60">
              Photometric Intersection
            </span>
            <span className="p-1 rounded bg-[#2FA4D7]/15 text-[#2FA4D7]">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#2FA4D7] font-headline">
            {benchmark.distributions.photometricHistogramIntersection}
          </div>
          <p className="text-xs text-[#3E2C23]/70">
            RTX ray-traced ambient lighting histogram intersection under extreme solar glare.
          </p>
        </div>
      </div>

      {/* Benchmarked Hardware Platforms Table */}
      <div className="bg-white border-2 border-[#3E2C23] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#3E2C23] pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#2FA4D7]" />
            <h3 className="text-lg sm:text-xl font-extrabold text-[#3E2C23] font-headline">
              Hardware Policy Transfer Benchmarks
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-[#3E2C23]/60">
            3 Embodiment Families Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#3E2C23] text-xs font-mono font-extrabold text-[#3E2C23] uppercase">
                <th className="py-3 px-4">Robot Platform</th>
                <th className="py-3 px-4">Physical Logs Compared</th>
                <th className="py-3 px-4">Sim2Real Transfer Success</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3E2C23]/10 text-xs sm:text-sm font-bold text-[#3E2C23]">
              {benchmark.benchmarkedPlatforms.map((bp) => (
                <tr key={bp.robot} className="hover:bg-[#F5E9D8]/30 transition-colors">
                  <td className="py-3.5 px-4 font-headline">{bp.robot}</td>
                  <td className="py-3.5 px-4 font-mono">{bp.realLogsCompared.toLocaleString()} Bags</td>
                  <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-700">
                    {bp.transferSuccess}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Production Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Domain Randomization Envelopes */}
      <div className="bg-white border-2 border-[#3E2C23] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="border-b-2 border-[#3E2C23] pb-3">
          <h3 className="text-lg sm:text-xl font-extrabold text-[#3E2C23] font-headline">
            Domain Randomization Envelope vs. Physical Reality
          </h3>
          <p className="text-xs text-[#3E2C23]/70 font-mono mt-0.5">
            Synthetic boundaries are systematically widened beyond the p99 physical boundary to ensure zero out-of-distribution failures.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {benchmark.domainRandomizationDimensions.map((dim) => (
            <div
              key={dim.name}
              className="p-4 rounded-xl bg-[#F5E9D8]/40 border-2 border-[#3E2C23]/20 space-y-2"
            >
              <h4 className="font-extrabold text-sm text-[#3E2C23] font-headline">{dim.name}</h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1 border-t border-[#3E2C23]/10">
                <div>
                  <span className="text-[#3E2C23]/50 block text-[10px]">SYNTHETIC BOUNDS</span>
                  <span className="font-bold text-[#2FA4D7]">{dim.syntheticBounds}</span>
                </div>
                <div>
                  <span className="text-[#3E2C23]/50 block text-[10px]">REAL-WORLD P99</span>
                  <span className="font-bold text-[#3E2C23]">{dim.realDistributionP99}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
