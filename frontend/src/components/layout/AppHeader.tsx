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
    { id: 'console', label: 'Audit Console & 3D Twin' },
    { id: 'telematics', label: 'Telematics & Insurance' },
    { id: 'governor', label: 'Edge Governor' },
    { id: 'cicd', label: 'CI/CD & API' },
    { id: 'pricing', label: 'Enterprise SOW' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#080b11]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Mark & Proving Ground Selector */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <button
            type="button"
            onClick={onToggleMobileDrawer}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
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
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-xs text-white group-hover:scale-105 transition-transform">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 4v16" strokeLinecap="round" />
                <path d="M9 7v10" strokeLinecap="round" />
                <path d="M14 9v6" strokeLinecap="round" />
                <path d="M19 11v2" strokeLinecap="round" />
              </svg>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white" translate="no">
                Diffraction
              </span>
              <span className="text-slate-600 text-xs">/</span>
              <span className="text-xs text-slate-300 font-medium hidden sm:inline">Verification Workspace</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white/[0.05] text-slate-400 border border-white/[0.08] mono">
              v2.5
            </span>
          </a>

          <div className="hidden 2xl:flex items-center space-x-1.5 bg-white/[0.03] px-2.5 py-1 rounded-lg border border-white/[0.08] text-[11px]">
            <span className="font-medium text-slate-400">Proving Grounds:</span>
            <select
              id="fleetSelect"
              className="bg-transparent font-medium text-white rounded cursor-pointer pr-1 text-[11px] focus:outline-none"
              aria-label="Select Autonomous Proving Ground"
            >
              {PROVING_GROUNDS.map((pg) => (
                <option key={pg.id} value={pg.id} className="bg-[#0f1422] text-white">
                  {pg.name}
                </option>
              ))}
            </select>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-radar-dot" title="Connected" />
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 text-xs text-slate-300">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            const cls = isActive
              ? 'px-3 py-1.5 rounded-lg text-white bg-white/[0.1] font-semibold transition-all border border-white/[0.18] shadow-xs'
              : 'px-3 py-1.5 rounded-lg hover:bg-white/[0.05] hover:text-white transition-colors font-medium cursor-pointer';

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
            className="flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-xs transition-colors cursor-pointer"
            title="Configure Enterprise Workspace & Cloud API"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-radar-dot" />
            <span className="font-semibold text-emerald-300 text-[11px] mono uppercase">
              ENTERPRISE SENTINEL
            </span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('console')}
            className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>3D Sandbox</span>
          </button>
        </div>
      </div>
    </header>
  );
};
