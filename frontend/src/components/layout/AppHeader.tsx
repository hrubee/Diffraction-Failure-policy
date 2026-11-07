/**
 * Presentation Component: Enterprise Application Header Navigation Bar
 * Dark obsidian styling matching the Super Banger platform theme.
 */

'use client';

import React from 'react';
import { PROVING_GROUNDS } from '@/domain/proving-grounds/models';
import {
  Zap,
  Menu,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

interface AppHeaderProps {
  readonly activeView: string;
  readonly onViewChange: (view: string) => void;
  readonly onOpenWorkspaceModal: () => void;
  readonly onToggleMobileDrawer: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  activeView,
  onViewChange,
  onOpenWorkspaceModal,
  onToggleMobileDrawer,
}) => {
  const navItems = [
    { id: 'overview', label: '← Return to Website' },
    { id: 'console', label: 'Diffract Studio' },
    { id: 'telematics', label: 'Telematics & Insurance' },
    { id: 'governor', label: 'Edge Governor' },
    { id: 'cicd', label: 'CI/CD & API' },
    { id: 'pricing', label: 'Enterprise SOW' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#3E2C23]/15 bg-[#F5E9D8]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Mark & Proving Ground Selector */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <button
            type="button"
            onClick={onToggleMobileDrawer}
            className="md:hidden p-1.5 rounded-lg text-[#3E2C23] hover:bg-white/80 min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              onViewChange('overview');
            }}
            className="flex items-center space-x-2.5 group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#2FA4D7] flex items-center justify-center shadow-xs text-white group-hover:scale-105 transition-transform">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 4v16" strokeLinecap="round" />
                <path d="M9 7v10" strokeLinecap="round" />
                <path d="M14 9v6" strokeLinecap="round" />
                <path d="M19 11v2" strokeLinecap="round" />
              </svg>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#3E2C23] font-headline" translate="no">
                Diffraction
              </span>
              <span className="text-[#3E2C23]/40 text-xs">/</span>
              <span className="text-xs text-[#3E2C23] font-bold hidden sm:inline">Diffract Studio™</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#2FA4D7]/15 text-[#2FA4D7] border border-[#2FA4D7]/30 mono">
              v2.5
            </span>
          </a>

          <div className="hidden 2xl:flex items-center space-x-1.5 bg-white/70 px-2.5 py-1 rounded-lg border border-[#3E2C23]/15 text-[11px]">
            <span className="font-medium text-[#3E2C23]/70">Proving Grounds:</span>
            <select
              id="fleetSelect"
              className="bg-transparent font-medium text-[#3E2C23] rounded cursor-pointer pr-1 text-[11px] focus:outline-none"
              aria-label="Select Autonomous Proving Ground"
            >
              {PROVING_GROUNDS.map((pg) => (
                <option key={pg.id} value={pg.id} className="bg-[#F5E9D8] text-[#3E2C23]">
                  {pg.name}
                </option>
              ))}
            </select>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-radar-dot" title="Connected" />
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 text-xs text-[#3E2C23]">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            const cls = isActive
              ? 'px-3 py-1.5 rounded-lg text-white bg-[#2FA4D7] font-semibold transition-all shadow-xs'
              : 'px-3 py-1.5 rounded-lg text-[#3E2C23]/80 hover:bg-white/70 hover:text-[#3E2C23] transition-colors font-medium cursor-pointer';

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                id={`nav${item.id.charAt(0).toUpperCase() + item.id.slice(1)}`}
                onClick={(e) => {
                  e.preventDefault();
                  onViewChange(item.id);
                }}
                className={cls}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Right: Tenant Status & Call To Action */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            type="button"
            id="licensePill"
            onClick={onOpenWorkspaceModal}
            className="flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white border border-[#3E2C23]/15 text-xs transition-colors cursor-pointer"
            title="Configure Enterprise Workspace & Cloud API"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-radar-dot" />
            <span className="font-semibold text-[#3E2C23] text-[11px] mono uppercase">
              ENTERPRISE SENTINEL
            </span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('console')}
            className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-[#2FA4D7] hover:bg-[#258ec0] active:bg-[#1f7ca8] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>3D Sandbox</span>
          </button>
        </div>
      </div>
    </header>
  );
};
