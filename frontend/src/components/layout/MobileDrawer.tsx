/**
 * Presentation Component: Mobile Responsive Navigation Drawer
 */

'use client';

import React from 'react';

interface MobileDrawerProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly activeView: string;
  readonly onViewChange: (view: string) => void;
  readonly onOpenWorkspaceModal: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  activeView,
  onViewChange,
  onOpenWorkspaceModal,
}) => {
  if (!isOpen) return null;

  const navItems = [
    { id: 'overview', label: 'Story & Overview' },
    { id: 'console', label: 'Audit Console & 3D Twin' },
    { id: 'telematics', label: 'Telematics & Insurance' },
    { id: 'governor', label: 'Edge Safety Governor' },
    { id: 'cicd', label: 'CI/CD & API Keys' },
    { id: 'pricing', label: 'Pilot SOW & Pricing' },
  ];

  return (
    <div
      id="mobileDrawer"
      className="fixed inset-x-0 top-16 z-50 md:hidden border-b border-slate-800 bg-[#090d16]/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-3 shadow-2xl animate-soft-blur"
    >
      <div className="px-3 py-2 bg-[#0e1320] rounded-lg border border-slate-800 text-xs flex justify-between items-center">
        <span className="font-medium text-slate-300 font-headline">Proving Grounds: Active</span>
        <span className="text-emerald-400 font-bold bg-[#091a10] px-2 py-0.5 rounded border border-emerald-500/40 text-[10px] font-mono">
          ONLINE
        </span>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          const cls = isActive
            ? 'w-full min-h-[42px] px-3 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 flex items-center space-x-2'
            : 'w-full min-h-[42px] px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white flex items-center space-x-2 transition-colors';

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                onViewChange(item.id);
                onClose();
              }}
              className={cls}
            >
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      <div className="pt-2 border-t border-slate-800 space-y-2">
        <button
          type="button"
          onClick={() => {
            onViewChange('console');
            onClose();
          }}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold font-headline flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
        >
          <span>Open Verification App</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onOpenWorkspaceModal();
            onClose();
          }}
          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 cursor-pointer"
        >
          Enterprise Workspace Profile
        </button>
      </div>
    </div>
  );
};
