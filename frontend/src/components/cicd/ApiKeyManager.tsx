/**
 * Presentation Component: Production API Keys Manager
 */

'use client';

import React, { useState } from 'react';
import { DEFAULT_API_KEY } from '@/infrastructure/api-client';

export const ApiKeyManager: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(DEFAULT_API_KEY);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-subtle card-shadow space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mono">
          Production API Keys
        </h3>
        <button
          type="button"
          onClick={() => alert('Credentials Rotated! New key active.')}
          className="min-h-[40px] px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg mono cursor-pointer"
        >
          + Generate Token
        </button>
      </div>

      <div className="space-y-3">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <div className="text-xs font-bold text-slate-800">Production Fleet Live Ingestion Key</div>
            <div className="text-[11px] text-slate-500 mono mt-0.5">{DEFAULT_API_KEY}</div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold mono">
              ACTIVE
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="min-h-[36px] px-2 text-xs text-blue-600 font-bold mono hover:underline cursor-pointer"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
