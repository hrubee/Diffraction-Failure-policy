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
    { id: 'overview', label: 'Overview' },
    { id: 'console', label: 'Audit Console' },
    { id: 'telematics', label: 'Telematics & Insurance' },
    { id: 'governor', label: 'Edge Governor' },
    { id: 'cicd', label: 'CI/CD & API' },
    { id: 'pricing', label: 'Enterprise SOW' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-subtle bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo & Proving Grounds */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <button
            type="button"
            onClick={onToggleMobileDrawer}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
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
            className="flex items-center space-x-2"
          >
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-base shadow-sm">
              ▲
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 hidden sm:inline" translate="no">
              DIFFRACTION
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 mono">
              v2.5
            </span>
          </a>

          <div className="hidden 2xl:flex items-center space-x-1.5 bg-white px-2 py-1 rounded-lg border border-subtle text-[11px]">
            <span className="font-bold text-slate-700">Proving Grounds</span>
            <span className="text-slate-300">/</span>
            <select
              id="fleetSelect"
              className="bg-transparent font-medium text-slate-600 rounded cursor-pointer pr-1 text-[11px]"
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

        {/* Center: Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-0.5 lg:space-x-1 text-xs font-semibold text-slate-600">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            const cls = isActive
              ? 'px-2.5 py-1.5 rounded-lg text-blue-600 bg-blue-50 font-bold transition-colors'
              : 'px-2.5 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors';

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

        {/* Right: Enterprise Sentinel Badge & Launch Action */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          <button
            type="button"
            id="licensePill"
            onClick={onOpenWorkspaceModal}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-bold mono transition-colors cursor-pointer"
            title="Enterprise Workspace Profile"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>ENTERPRISE SENTINEL</span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('console')}
            className="min-h-[40px] px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Launch Verification</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
