/**
 * Presentation Component: Enterprise Landing Footer
 * Sleek espresso footer with standard compliance links, platform status, and enterprise info.
 * Palette: #2FA4D7 (Blue), #F5E9D8 (Beige Canvas), #3E2C23 (Espresso Brown), #E76F2E (Safety Orange)
 */

'use client';

import React from 'react';

interface LandingFooterProps {
  readonly onLaunchConsole: () => void;
  readonly onOpenPricing: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onLaunchConsole,
  onOpenPricing,
}) => {
  return (
    <footer className="w-full border-t border-[#3E2C23] bg-[#3E2C23] text-[#F5E9D8]/80 text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#2FA4D7] flex items-center justify-center text-white font-bold shadow-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 4v16" strokeLinecap="round" />
                  <path d="M9 7v10" strokeLinecap="round" />
                  <path d="M14 9v6" strokeLinecap="round" />
                  <path d="M19 11v2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-extrabold text-base tracking-tight text-white font-headline" translate="no">
                Diffraction
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#4A372E] text-[#2FA4D7] border border-[#2FA4D7]/40 font-mono font-semibold">
                v2.5 Enterprise
              </span>
            </div>

            <p className="text-[#F5E9D8]/80 text-xs leading-relaxed max-w-sm font-body">
              The automated physical AI safety verification and policy remediation platform. 
              Eliminating sim-to-real divergence across humanoids, AMRs, heavy haulers, and robotic manipulators.
            </p>

            <div className="flex items-center space-x-2 text-[11px] text-[#F5E9D8]/70 font-mono">
              <span className="h-2 w-2 rounded-full bg-[#2FA4D7]" />
              <span>Global Proving Grounds API: Operational</span>
            </div>
          </div>

          {/* Column 1: Capabilities */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mono">Platform</h4>
            <ul className="space-y-2 text-[#F5E9D8]/70">
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
            <ul className="space-y-2 text-[#F5E9D8]/70">
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
            <ul className="space-y-2 text-[#F5E9D8]/70">
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
        <div className="pt-8 border-t border-[#F5E9D8]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#F5E9D8]/60">
          <div>
            &copy; 2026 Diffraction AI Inc. All rights reserved. Physical AI Safety &amp; Verification Platform.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[#F5E9D8]/80 mono">
            <span>ISO 3691-4</span>
            <span>•</span>
            <span>ISO 13482</span>
            <span>•</span>
            <span>ISO 17757</span>
            <span>•</span>
            <span>ISO 10218</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
