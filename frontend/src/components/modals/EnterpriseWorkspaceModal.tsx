/**
 * Presentation Component: Enterprise Workspace & Multi-Tenant Credentials Modal
 */

'use client';

import React from 'react';

interface EnterpriseWorkspaceModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly tenantId: string;
  readonly organization: string;
  readonly apiKey: string;
  readonly copied: boolean;
  readonly onCopyKey: () => void;
}

export const EnterpriseWorkspaceModal: React.FC<EnterpriseWorkspaceModalProps> = ({
  isOpen,
  onClose,
  tenantId,
  organization,
  apiKey,
  copied,
  onCopyKey,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="enterpriseProfileModal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 card-shadow-lg p-6 sm:p-8 space-y-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          aria-label="Close dialog"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>ENTERPRISE SENTINEL TIER • MULTI-TENANT PROD</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Enterprise Autonomous Fleet Workspace
          </h3>
          <p className="text-xs text-slate-500">
            Universal Physical AI Verification Engine with continuous fleet monitoring across 5 global proving grounds.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-semibold">Tenant Organization:</span>
            <span className="font-bold text-slate-900">{organization}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-semibold">Tenant ID:</span>
            <span className="mono font-bold text-blue-700">{tenantId}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-semibold">Proving Ground Nodes:</span>
            <span className="font-medium text-slate-700">Munich, Nevada, Stuttgart, Chicago, Tokyo (5/5 Online)</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-semibold">Verification Quota:</span>
            <span className="font-bold text-emerald-600 mono">Unlimited Monte Carlo Rollouts</span>
          </div>
        </div>

        <div className="space-y-2 border-t border-slate-100 pt-4">
          <label htmlFor="modalApiKeyInput" className="block text-xs font-bold text-slate-700">
            Production Fleet Live Ingestion Key
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="modalApiKeyInput"
              readOnly
              value={apiKey}
              className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 select-all"
            />
            <button
              type="button"
              onClick={onCopyKey}
              className="min-h-[44px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              {copied ? 'Copied!' : 'Copy Key'}
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Pass as <code className="mono text-slate-700 font-semibold">X-API-Key</code> in your CI/CD pipelines or ROS 2 daemons.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
