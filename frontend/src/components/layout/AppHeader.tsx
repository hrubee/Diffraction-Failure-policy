/**
 * Presentation Component: Enterprise SaaS Header Navigation Bar
 */

'use client';

import React from 'react';
import { PROVING_GROUNDS } from '@/domain/proving-grounds/models';

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
    { id: 'overview', label: 'Story & Overview' },
    { id: 'console', label: 'Audit Console & 3D Twin' },
    { id: 'telematics', label: 'Telematics & Insurance' },
    { id: 'governor', label: 'Edge Governor' },
    { id: 'cicd', label: 'CI/CD & API' },
    { id: 'pricing', label: 'Enterprise SOW' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[rgba(55,53,47,0.09)] bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Notion-Style Breadcrumb & Workspace Logo */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <button
            type="button"
            onClick={onToggleMobileDrawer}
            className="md:hidden p-1.5 rounded-md text-[#787774] hover:text-[#37352f] hover:bg-[#efefed] min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              onViewChange('overview');
            }}
            className="flex items-center space-x-2 group"
          >
            <span className="text-xl select-none" role="img" aria-label="Diffraction Logo">
              📐
            </span>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-sm tracking-tight text-[#37352f]" translate="no">
                Diffraction
              </span>
              <span className="text-[#c4c4c2] text-xs">/</span>
              <span className="text-xs text-[#787774] hidden sm:inline">Verification Workspace</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#f1f1ef] text-[#787774] border border-[#e3e2e0] mono">
              v2.5
            </span>
          </a>

          <div className="hidden 2xl:flex items-center space-x-1.5 bg-[#f7f6f3] px-2 py-1 rounded-md border border-[rgba(55,53,47,0.09)] text-[11px]">
            <span className="font-medium text-[#787774]">Proving Grounds:</span>
            <select
              id="fleetSelect"
              className="bg-transparent font-medium text-[#37352f] rounded cursor-pointer pr-1 text-[11px] focus:outline-none"
              aria-label="Select Autonomous Proving Ground"
            >
              {PROVING_GROUNDS.map((pg) => (
                <option key={pg.id} value={pg.id}>
                  {pg.name}
                </option>
              ))}
            </select>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" title="Connected" />
          </div>
        </div>

        {/* Center: Desktop Notion Tabs */}
        <nav className="hidden md:flex items-center space-x-0.5 text-xs text-[#787774]">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            const cls = isActive
              ? 'px-2.5 py-1.5 rounded-md text-[#37352f] bg-[#efefed] font-medium transition-colors'
              : 'px-2.5 py-1.5 rounded-md hover:bg-[#efefed] hover:text-[#37352f] transition-colors';

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

        {/* Right: Notion Sentinel Badge & Try Sandbox */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          <button
            type="button"
            id="licensePill"
            onClick={onOpenWorkspaceModal}
            className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#edf3ec] hover:bg-[#e2ede0] border border-[#d4e5d2] text-[#34623f] text-[11px] font-medium mono transition-colors cursor-pointer"
            title="Enterprise Workspace Profile"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>ENTERPRISE SENTINEL</span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('console')}
            className="min-h-[34px] px-3 py-1.5 bg-[#2383e2] hover:bg-[#1a73e8] active:scale-[0.98] text-white text-xs font-medium rounded-lg shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <span>⚡ Try 3D Sandbox</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
