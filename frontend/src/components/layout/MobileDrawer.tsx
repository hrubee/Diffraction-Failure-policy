/**
 * Presentation Component: Clean Mobile Responsive Navigation Drawer
 * Palette: #2FA4D7, #F5E9D8, #3E2C23, #E76F2E (Zero Gradients).
 */

'use client';

import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';

interface MobileDrawerProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onOpenPilot: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onOpenPilot,
}) => {
  if (!isOpen) return null;

  const navItems = [
    { href: '#how-it-works', label: 'How It Works (3 Steps)' },
    { href: '#simulator', label: 'Interactive Test Drive' },
    { href: '#capabilities', label: '4 Deep-Tech Pillars' },
    { href: '#roi', label: 'Cost Savings ROI' },
    { href: '#pricing', label: '14-Day Pilot ($25,000)' },
  ];

  return (
    <div
      id="mobileDrawer"
      className="fixed inset-x-0 top-16 z-50 md:hidden border-b border-[#3E2C23]/20 bg-[#F5E9D8] px-4 pt-3 pb-5 space-y-3 shadow-xl animate-soft-blur"
    >
      <nav className="space-y-1">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={() => onClose()}
            className="w-full min-h-[42px] px-3 py-2.5 rounded-lg text-xs font-mono font-bold text-[#3E2C23] hover:bg-white flex items-center justify-between transition-colors"
          >
            <span>{item.label}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#2FA4D7]" />
          </a>
        ))}
      </nav>

      <div className="pt-2 border-t border-[#3E2C23]/15">
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenPilot();
          }}
          className="w-full py-3 rounded-lg bg-[#E76F2E] text-white text-xs font-mono font-bold flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Request 14-Day Pilot ($25k)</span>
        </button>
      </div>
    </div>
  );
};
