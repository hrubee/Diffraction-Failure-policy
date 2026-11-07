/**
 * Presentation Component: Enterprise SaaS Footer
 */

import React from 'react';

export const AppFooter: React.FC = () => {
  return (
    <footer className="border-t border-subtle bg-white px-4 sm:px-6 lg:px-8 py-5 mt-auto text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-800" translate="no">
            DIFFRACTION AI
          </span>
          <span aria-hidden="true">•</span>
          <span>Universal Physical AI Verification Engine</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11px] mono">
          <span>ISO 13482 • ISO 17757 • ISO 10218 • ISO 3691-4 • ISO 22737</span>
          <a
            href="/api/v1/health"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline"
          >
            API Status: Operational (v2.5)
          </a>
        </div>
      </div>
    </footer>
  );
};
