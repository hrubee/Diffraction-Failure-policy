/**
 * Presentation Component: Enterprise Workspace & Multi-Tenant Credentials Modal (Notion Style)
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
      className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full border border-[rgba(55,53,47,0.12)] card-shadow-lg p-6 sm:p-8 space-y-5 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#787774] hover:text-[#37352f] hover:bg-[#efefed] rounded-md min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Close dialog"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-[#edf3ec] border border-[#d4e5d2] text-[#34623f] text-[11px] font-medium mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>ENTERPRISE SENTINEL • MULTI-TENANT PROD</span>
          </div>
          <h3 className="text-lg font-bold text-[#37352f] tracking-tight">
            Enterprise Autonomous Fleet Workspace
          </h3>
          <p className="text-xs text-[#787774]">
            Universal Physical AI Verification Engine with continuous fleet monitoring across 5 global proving grounds.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#f7f6f3] border border-[rgba(55,53,47,0.09)] space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#787774] font-medium">Tenant Organization:</span>
            <span className="font-semibold text-[#37352f]">{organization}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#787774] font-medium">Tenant ID:</span>
            <span className="mono font-semibold text-[#2383e2]">{tenantId}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#787774] font-medium">Proving Ground Nodes:</span>
            <span className="font-medium text-[#5a5751]">Munich, Nevada, Stuttgart, Chicago, Tokyo (5/5 Online)</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#787774] font-medium">Verification Quota:</span>
            <span className="font-semibold text-[#34623f] mono">Unlimited Monte Carlo Rollouts</span>
          </div>
        </div>

        <div className="space-y-2 border-t border-[rgba(55,53,47,0.06)] pt-3">
          <label htmlFor="modalApiKeyInput" className="block text-xs font-semibold text-[#37352f]">
            Production Fleet Live Ingestion Key
          </label>
          <div className="flex gap-2">
            <input
              id="modalApiKeyInput"
              type="text"
              readOnly
              value={apiKey}
              className="flex-1 px-3 py-2 bg-[#f7f6f3] border border-[rgba(55,53,47,0.09)] rounded-lg text-xs font-mono text-[#37352f] select-all focus:outline-none"
            />
            <button
              type="button"
              onClick={onCopyKey}
              className="min-h-[38px] px-3.5 py-1.5 bg-[#2383e2] hover:bg-[#1a73e8] text-white text-xs font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              {copied ? 'Copied!' : 'Copy Key'}
            </button>
          </div>
          <p className="text-[11px] text-[#787774]">
            Pass as <code className="mono text-[#37352f] bg-[#f1f1ef] px-1 py-0.5 rounded">X-API-Key</code> in your CI/CD pipelines or ROS 2 daemons.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#2f3437] hover:bg-[#37352f] text-white text-xs font-medium rounded-lg cursor-pointer transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
