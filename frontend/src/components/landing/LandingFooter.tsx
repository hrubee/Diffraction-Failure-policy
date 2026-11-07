/**
 * Presentation Component: Enterprise Landing Footer
 * Sleek dark-mode footer with standard compliance links, platform status, and enterprise info.
 */

'use client';

import React from 'react';
import { ShieldCheck, Activity, Terminal } from 'lucide-react';

interface LandingFooterProps {
  readonly onLaunchConsole: () => void;
  readonly onOpenPricing: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onLaunchConsole,
  onOpenPricing,
}) => {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#06080d] text-slate-400 text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#1a73e8] to-[#0ea5e9] flex items-center justify-center text-white shadow-xs">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 4v16" strokeLinecap="round" />
                  <path d="M9 7v10" strokeLinecap="round" />
                  <path d="M14 9v6" strokeLinecap="round" />
                  <path d="M19 11v2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-extrabold text-base tracking-tight text-white" translate="no">
                Diffraction
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 mono font-semibold">
                v2.5 Enterprise
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The automated physical AI safety verification and policy remediation platform. 
              Eliminating sim-to-real divergence across humanoids, AMRs, heavy haulers, and robotic manipulators.
            </p>

            <div className="flex items-center space-x-2 text-[11px] text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-radar-dot" />
              <span>Global Proving Grounds API: Operational</span>
            </div>
          </div>

          {/* Column 1: Capabilities */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mono">Platform</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button type="button" onClick={onLaunchConsole} className="hover:text-white transition-colors cursor-pointer">
                  3D Digital Twin Viewer
                </button>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-white transition-colors">
                  150+ Physics Sweeps
                </a>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-white transition-colors">
                  ROS 2 Policy Patcher
                </a>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-white transition-colors">
                  Dynamic Edge Governor
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Modalities */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mono">Modalities</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#modalities" className="hover:text-white transition-colors">
                  Bipedal Humanoid
                </a>
              </li>
              <li>
                <a href="#modalities" className="hover:text-white transition-colors">
                  Heavy Mining Hauler
                </a>
              </li>
              <li>
                <a href="#modalities" className="hover:text-white transition-colors">
                  6-DOF Robotic Arm
                </a>
              </li>
              <li>
                <a href="#modalities" className="hover:text-white transition-colors">
                  Industrial AMR
                </a>
              </li>
              <li>
                <a href="#modalities" className="hover:text-white transition-colors">
                  Urban Sidewalk Rover
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Commercial */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mono">Commercial</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button type="button" onClick={onOpenPricing} className="hover:text-white transition-colors cursor-pointer">
                  30-Day Turnkey Pilot ($15k)
                </button>
              </li>
              <li>
                <a href="#roi" className="hover:text-white transition-colors">
                  Fleet Downtime ROI Model
                </a>
              </li>
              <li>
                <button type="button" onClick={onOpenPricing} className="hover:text-white transition-colors cursor-pointer">
                  Commercial Fleet License
                </button>
              </li>
              <li>
                <button type="button" onClick={onOpenPricing} className="hover:text-white transition-colors cursor-pointer">
                  OEM Enterprise Agreement
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; 2026 Diffraction AI Inc. All rights reserved. Physical AI Safety &amp; Verification Platform.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-400 mono">
            <span>ISO 3691-4</span>
            <span>•</span>
            <span>ISO 13482</span>
            <span>•</span>
            <span>ISO 17757</span>
            <span>•</span>
            <span>ISO 10218</span>
            <span>•</span>
            <span>ISO 22737</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
