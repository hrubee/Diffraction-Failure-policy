/**
 * Presentation Component: Super Banger Landing Header Navigation Bar
 * Dark obsidian glassmorphic header with navigation anchors, compliance badge,
 * and direct Launch Console gateway CTA.
 */

'use client';

import React from 'react';
import { PROVING_GROUNDS } from '@/domain/proving-grounds/models';
import { Zap, ShieldCheck, ArrowRight, Menu } from 'lucide-react';

interface LandingHeaderProps {
  readonly onLaunchConsole: () => void;
  readonly onOpenWorkspaceModal: () => void;
  readonly onToggleMobileDrawer: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  onLaunchConsole,
  onOpenWorkspaceModal,
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
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-[#3E2C23] border border-[#3E2C23]/20 font-mono">
                Physical AI Platform
              </span>
            </div>
          </a>

          {/* Hidden proving ground selector for DOM selector compatibility */}
          <div className="hidden">
            <select id="fleetSelect" aria-label="Select Autonomous Proving Ground">
              {PROVING_GROUNDS.map((pg) => (
                <option key={pg.id} value={pg.id}>
                  {pg.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Anchor Links */}
        <nav className="hidden md:flex items-center space-x-6 text-xs text-[#3E2C23]/80 font-medium font-body">
          <a href="#capabilities" className="hover:text-[#3E2C23] transition-colors">
            Capabilities
          </a>
          <a href="#modalities" className="hover:text-[#3E2C23] transition-colors">
            Modalities
          </a>
          <a href="#how-it-works" className="hover:text-[#3E2C23] transition-colors">
            4-Act Engine
          </a>
          <a href="#roi" className="hover:text-[#3E2C23] transition-colors">
            ROI Calculator
          </a>
          <a href="#pricing" className="hover:text-[#3E2C23] transition-colors">
            Commercial SOW
          </a>
        </nav>

        {/* Right: Tenant Status & Direct Gateway to Console */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <button
            type="button"
            id="licensePill"
            onClick={onOpenWorkspaceModal}
            className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded bg-white hover:bg-[#FAF4EB] border border-[#3E2C23]/25 text-xs transition-colors cursor-pointer"
            title="Configure Enterprise Workspace & Cloud API"
          >
            <span className="h-2 w-2 rounded-full bg-[#2FA4D7]" />
            <span className="font-semibold text-[#3E2C23] text-[11px] font-mono uppercase">
              SENTINEL ACTIVE
            </span>
          </button>

          <button
            type="button"
            id="navConsole"
            onClick={onLaunchConsole}
            className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg bg-[#2FA4D7] hover:bg-[#248ab8] active:bg-[#1d7ca8] text-white text-xs font-bold transition-all cursor-pointer group shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-white group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Open Verification App</span>
            <span className="sm:hidden">App</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};
