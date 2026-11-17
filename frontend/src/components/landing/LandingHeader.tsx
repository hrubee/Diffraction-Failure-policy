/**
 * Presentation Component: Clean Landing Header Navigation Bar
 * Simplified, honest navigation focusing on How It Works, Interactive Demo, ROI, and Pilot.
 * Palette: #2FA4D7, #F5E9D8, #3E2C23, #E76F2E (Zero Gradients).
 */

'use client';

import React from 'react';
import { Zap, Menu, ArrowRight } from 'lucide-react';

interface LandingHeaderProps {
  readonly onLaunchPilotModal: () => void;
  readonly onToggleMobileDrawer: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  onLaunchPilotModal,
  onToggleMobileDrawer,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#3E2C23]/15 bg-[#F5E9D8]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            type="button"
            onClick={onToggleMobileDrawer}
            className="md:hidden p-1.5 rounded-lg text-[#3E2C23] hover:bg-white min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <a href="#" className="flex items-center space-x-2.5 group cursor-pointer">
            <div className="w-7 h-7 rounded-lg bg-[#2FA4D7] flex items-center justify-center text-white font-bold shadow-sm group-hover:bg-[#248ab8] transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 4v16" strokeLinecap="round" />
                <path d="M9 7v10" strokeLinecap="round" />
                <path d="M14 9v6" strokeLinecap="round" />
                <path d="M19 11v2" strokeLinecap="round" />
              </svg>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight text-[#3E2C23] font-headline" translate="no">
                Diffraction
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#2FA4D7]/15 text-[#2FA4D7] border border-[#2FA4D7]/30 font-mono">
                Autonomous Robot Safety &amp; Commissioning
              </span>
            </div>
          </a>
        </div>

        {/* Center: Anchor Links */}
        <nav className="hidden md:flex items-center space-x-6 text-xs text-[#3E2C23]/80 font-medium font-body">
          <a href="#how-it-works" className="hover:text-[#3E2C23] transition-colors">
            How It Works
          </a>
          <a href="#simulator" className="hover:text-[#3E2C23] font-bold text-[#2FA4D7] transition-colors">
            Interactive Test Drive
          </a>
          <a href="#roi" className="hover:text-[#3E2C23] transition-colors">
            Cost Savings (ROI)
          </a>
          <a href="#pricing" className="hover:text-[#3E2C23] transition-colors">
            14-Day Pilot ($25k)
          </a>
        </nav>

        {/* Right: Primary Call to Action */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <button
            type="button"
            onClick={onLaunchPilotModal}
            className="flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-4 py-2 rounded-lg bg-[#E76F2E] hover:bg-[#E76F2E]/90 text-white text-xs font-bold transition-all cursor-pointer group shadow-sm font-mono"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-white group-hover:scale-110 transition-transform" />
            <span>Request 14-Day Pilot</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};
