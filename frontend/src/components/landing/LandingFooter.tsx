/**
 * Presentation Component: Clean Enterprise Landing Footer
 * Sleek espresso footer with standard compliance links, platform status, and enterprise info.
 * Palette: #2FA4D7, #F5E9D8, #3E2C23, #E76F2E (Zero Gradients).
 */

'use client';

import React from 'react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#3E2C23] bg-[#3E2C23] text-[#F5E9D8]/80 text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                Autonomous Safety Platform
              </span>
            </div>

            <p className="text-[#F5E9D8]/80 text-xs leading-relaxed max-w-sm font-body">
              <strong>Diffraction</strong>: Runtime safety and automated site commissioning for autonomous mobile robots. Eliminates floor slip, prevents warehouse collisions, and cuts site deployment from 8 weeks to 14 days.
            </p>

            <div className="flex items-center space-x-2 text-[11px] text-[#F5E9D8]/70 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Safety Governor System: Active (500 Hz deterministic)</span>
            </div>
          </div>

          {/* Column 1: Navigation */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white font-mono">Navigation</h4>
            <ul className="space-y-2 text-[#F5E9D8]/70 font-body">
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works (3 Steps)
                </a>
              </li>
              <li>
                <a href="#simulator" className="hover:text-white transition-colors">
                  Interactive Test Drive
                </a>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-white transition-colors">
                  4 Deep-Tech Pillars
                </a>
              </li>
              <li>
                <a href="#roi" className="hover:text-white transition-colors">
                  Commissioning ROI Calculator
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  14-Day Pilot ($25,000)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Safety Standards */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white font-mono">Compliance &amp; Standards</h4>
            <ul className="space-y-2 text-[#F5E9D8]/70 font-mono text-[11px]">
              <li className="flex items-center space-x-1.5">
                <span className="text-[#2FA4D7]">✓</span>
                <span>ISO 3691-4:2023 Cl. 5.2</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-[#2FA4D7]">✓</span>
                <span>ANSI/RIA R15.08 Part 2</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-[#2FA4D7]">✓</span>
                <span>ISO 13849-1 (PL-d Category 3)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-[#2FA4D7]">✓</span>
                <span>ROS 2 Humble / Iron / Jazzy</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#F5E9D8]/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-[#F5E9D8]/50 font-mono">
          <div>
            &copy; {new Date().getFullYear()} Diffraction AI, Inc. All rights reserved. Zero-collision runtime safety.
          </div>
          <div className="flex space-x-6">
            <span>Air-Gapped &amp; On-Premises Ready</span>
            <span>Made for Autonomous Fleets</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
