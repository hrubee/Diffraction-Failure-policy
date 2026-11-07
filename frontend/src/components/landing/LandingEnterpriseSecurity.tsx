/**
 * Presentation Component: Enterprise Data Sovereignty & Air-Gapped Deployment
 * Solves the critical IP & telemetry protection hurdle for enterprise robotics OEMs.
 * Palette: #2FA4D7 (Blue), #F5E9D8 (Beige Canvas), #3E2C23 (Espresso Brown), #E76F2E (Safety Orange)
 */

'use client';

import React, { useState } from 'react';
import { Shield, Lock, Server, CheckCircle2, Copy, Check, Terminal, FileText } from 'lucide-react';

export const LandingEnterpriseSecurity: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const dockerCommand = `docker run --gpus all --rm \\
  -v /var/log/robotics_bags:/data/telemetry:ro \\
  -v /opt/diffraction/reports:/output \\
  cr.diffraction.ai/enterprise-verifier:v2.5 \\
  --mcap /data/telemetry/incident_amr_042.mcap \\
  --scenarios 150 \\
  --standards ISO_3691_4,ANSI_R15_08`;

  const handleCopy = () => {
    navigator.clipboard.writeText(dockerCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="security" className="py-20 relative bg-[#F5E9D8]" aria-label="Enterprise Security & Data Sovereignty">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-white border border-[#2FA4D7]/40 text-xs text-[#2FA4D7] font-mono">
            <Shield className="w-3.5 h-3.5 text-[#2FA4D7]" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Air-Gapped Data Sovereignty &amp; IP Protection
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3E2C23] tracking-tight leading-tight font-headline">
            Your robot kinematics and facility floorplans
            <br />
            <span className="text-[#2FA4D7]">
              never leave your network.
            </span>
          </h2>

          <p className="text-[#3E2C23]/80 text-sm sm:text-base leading-relaxed font-body">
            Enterprise robotics OEMs cannot send proprietary motor controller CAN streams or client warehouse maps to public third-party clouds. 
            Diffraction deploys as an air-gapped on-premises container or dedicated private VPC appliance.
          </p>
        </div>

        {/* 3 Pillar Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Air-Gapped Local Appliance */}
          <div className="p-7 rounded-2xl bg-white border border-[#3E2C23]/15 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#2FA4D7]/15 text-[#2FA4D7] flex items-center justify-center font-bold">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#3E2C23] font-headline">
                Air-Gapped On-Premises
              </h3>
              <p className="text-xs text-[#3E2C23]/80 leading-relaxed font-body">
                Deploy as a signed, self-contained Docker image on your local NVIDIA RTX 4090 or DGX station. Zero outbound internet connection required.
              </p>
            </div>
            <div className="pt-4 border-t border-[#3E2C23]/10 space-y-2 text-[11px] font-mono text-[#3E2C23]/90">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2FA4D7]" />
                <span>NVIDIA PhysX 5.4 GPU Acceleration</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2FA4D7]" />
                <span>Local ROS 2 Humble/Jazzy Integration</span>
              </div>
            </div>
          </div>

          {/* Card 2: Zero Raw Telemetry Retention */}
          <div className="p-7 rounded-2xl bg-white border border-[#3E2C23]/15 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E76F2E]/15 text-[#E76F2E] flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#3E2C23] font-headline">
                Zero Telemetry Retention
              </h3>
              <p className="text-xs text-[#3E2C23]/80 leading-relaxed font-body">
                Raw sensor bags are ingested into ephemeral in-memory ring-buffers. As soon as Lyapunov barrier equations converge, raw packets are permanently purged.
              </p>
            </div>
            <div className="pt-4 border-t border-[#3E2C23]/10 space-y-2 text-[11px] font-mono text-[#3E2C23]/90">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E76F2E]" />
                <span>Only Cryptographic Hashes Retained</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E76F2E]" />
                <span>SOC 2 Type II Framework Aligned</span>
              </div>
            </div>
          </div>

          {/* Card 3: Dedicated Private Cloud VPC */}
          <div className="p-7 rounded-2xl bg-white border border-[#3E2C23]/15 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#3E2C23]/15 text-[#3E2C23] flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#3E2C23] font-headline">
                AWS GovCloud &amp; Private VPC
              </h3>
              <p className="text-xs text-[#3E2C23]/80 leading-relaxed font-body">
                For fleet-scale automated regression testing, deploy dedicated single-tenant clusters in your own AWS/Azure VPC with mTLS 1.3 encryption.
              </p>
            </div>
            <div className="pt-4 border-t border-[#3E2C23]/10 space-y-2 text-[11px] font-mono text-[#3E2C23]/90">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3E2C23]" />
                <span>VPC Peering &amp; Direct Connect</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3E2C23]" />
                <span>Custom Enterprise RBAC &amp; SSO</span>
              </div>
            </div>
          </div>
        </div>

        {/* Turnkey On-Premises Docker Appliance Box */}
        <div className="rounded-2xl bg-[#3E2C23] border border-[#3E2C23] p-6 sm:p-8 text-[#F5E9D8] shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#F5E9D8]/15 pb-4">
            <div className="flex items-center space-x-2.5">
              <Terminal className="w-4 h-4 text-[#2FA4D7]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Turnkey Local Docker Execution (Zero-Cloud Mode)
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-[#FAF4EB]/10 hover:bg-[#FAF4EB]/20 text-[#2FA4D7] text-xs font-mono transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Command'}</span>
            </button>
          </div>

          <pre className="text-xs text-[#F5E9D8] font-mono overflow-x-auto whitespace-pre leading-relaxed p-3 bg-[#2A1D17] rounded-xl border border-[#F5E9D8]/10">
            {dockerCommand}
          </pre>

          <div className="pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-[#F5E9D8]/70 font-mono">
            <span>Outputs signed ISO 3691-4 PDF certificate &amp; drop-in ROS 2 YAML patch directly into your local directory.</span>
            <a
              href="/reports/Diffraction-ISO-3691-4-Certified-Dossier-Sample.html"
              target="_blank"
              rel="noreferrer"
              className="text-[#2FA4D7] hover:underline font-bold flex items-center space-x-1 shrink-0"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Inspect Sample Dossier →</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
