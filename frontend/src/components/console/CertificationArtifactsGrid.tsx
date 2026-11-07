/**
 * Presentation Component: Exported Certification Artifacts & Risk Underwriting
 */

import React from 'react';
import { AuditVerdict } from '@/domain/kinematics/types';

interface CertificationArtifactsGridProps {
  readonly verdict: AuditVerdict | null;
}

export const CertificationArtifactsGrid: React.FC<CertificationArtifactsGridProps> = ({ verdict }) => {
  if (!verdict) return null;

  return (
    <div className="p-6 rounded-2xl bg-white border border-subtle card-shadow space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2 mono">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Exported Certification Artifacts &amp; Risk Underwriting</span>
        </h3>
        <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold mono">
          AUDIT CERTIFIED
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <a
          href={`/reports/${verdict.htmlReportFilename}`}
          target="_blank"
          rel="noreferrer"
          className="min-h-[44px] p-3.5 rounded-xl bg-blue-50/80 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center space-x-3 text-blue-700 cursor-pointer"
        >
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">Executive Audit Report</div>
            <div className="text-[10px] text-blue-600 mono font-semibold">ISO Audit Certificate</div>
          </div>
        </a>

        <a
          href="/api/v1/compliance/site-risk-assessment"
          target="_blank"
          rel="noreferrer"
          className="min-h-[44px] p-3.5 rounded-xl bg-amber-50/80 hover:bg-amber-100 border border-amber-200 transition-colors flex items-center space-x-3 text-amber-700 cursor-pointer"
        >
          <div className="h-8 w-8 rounded-lg bg-amber-600 flex items-center justify-center text-white shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">Carrier Site Risk Dossier</div>
            <div className="text-[10px] text-amber-600 mono font-semibold">Insurance Telematics</div>
          </div>
        </a>

        <a
          href={`/stages/${verdict.usdStageFilename}`}
          download={verdict.usdStageFilename}
          className="min-h-[44px] p-3.5 rounded-xl bg-purple-50/80 hover:bg-purple-100 border border-purple-200 transition-colors flex items-center space-x-3 text-purple-700 cursor-pointer"
        >
          <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center text-white shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">3D OpenUSD Stage</div>
            <div className="text-[10px] text-purple-600 mono font-semibold">Digital Twin Package</div>
          </div>
        </a>
      </div>
    </div>
  );
};
