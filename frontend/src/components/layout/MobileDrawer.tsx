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
    <div id="mobileDrawer" className="md:hidden border-b border-[rgba(55,53,47,0.09)] bg-white px-4 pt-2 pb-4 space-y-2">
      <div className="px-3 py-2 bg-[#f7f6f3] rounded-lg border border-[rgba(55,53,47,0.09)] text-xs flex justify-between items-center">
        <span className="font-medium text-[#37352f]">Proving Grounds: Active</span>
        <span className="text-[#34623f] font-medium bg-[#edf3ec] px-2 py-0.5 rounded border border-[#d4e5d2] text-[10px] mono">
          ONLINE
        </span>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          const cls = isActive
            ? 'w-full min-h-[40px] px-3 py-2 rounded-lg text-xs font-semibold text-[#37352f] bg-[#efefed] flex items-center space-x-2'
            : 'w-full min-h-[40px] px-3 py-2 rounded-lg text-xs font-medium text-[#787774] hover:bg-[#f7f6f3] hover:text-[#37352f] flex items-center space-x-2 transition-colors';

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

      <div className="pt-2 border-t border-[rgba(55,53,47,0.09)] px-3">
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
