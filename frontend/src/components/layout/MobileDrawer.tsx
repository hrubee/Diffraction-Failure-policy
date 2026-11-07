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
    { id: 'overview', label: 'Executive Overview' },
    { id: 'console', label: 'Audit Console' },
    { id: 'telematics', label: 'Telematics & Insurance' },
    { id: 'governor', label: 'Edge Safety Governor' },
    { id: 'cicd', label: 'CI/CD & API Keys' },
    { id: 'pricing', label: 'Pilot SOW & Pricing' },
  ];

  return (
    <div id="mobileDrawer" className="md:hidden border-b border-subtle bg-white px-4 pt-2 pb-4 space-y-2">
      <div className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-xs flex justify-between items-center">
        <span className="font-bold text-slate-700">Proving Grounds • Multi-Modal</span>
        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px] mono">
          ONLINE
        </span>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          const cls = isActive
            ? 'w-full min-h-[44px] px-3 py-2.5 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 flex items-center space-x-2'
            : 'w-full min-h-[44px] px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2';

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

      <div className="pt-2 border-t border-slate-200 px-3">
        <button
          type="button"
          onClick={() => {
            onOpenWorkspaceModal();
            onClose();
          }}
          className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
        >
          Enterprise Workspace Profile
        </button>
      </div>
    </div>
  );
};
