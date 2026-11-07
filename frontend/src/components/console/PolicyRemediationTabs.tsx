/**
 * Presentation Component: 1-Click Policy Remediation Tabs & Downloads
 */

'use client';

import React, { useState } from 'react';
import { RemediationPackage } from '@/domain/kinematics/types';

interface PolicyRemediationTabsProps {
  readonly remediation?: RemediationPackage;
}

export const PolicyRemediationTabs: React.FC<PolicyRemediationTabsProps> = ({ remediation }) => {
  const [activeTab, setActiveTab] = useState<'speed' | 'controller' | 'rl'>('speed');
  const [copied, setCopied] = useState<boolean>(false);

  if (!remediation) return null;

  let code = remediation.speedFilterMaskYaml;
  let filename = remediation.speedFilterMaskFilename;
  if (activeTab === 'controller') {
    code = remediation.controllerPatchYaml;
    filename = remediation.controllerPatchFilename;
  } else if (activeTab === 'rl') {
    code = `# Isaac Lab DirectRLEnv Verification Gym:\n# Filename: ${remediation.rlTrainingFilename}\nimport isaaclab.envs as envs\n`;
    filename = remediation.rlTrainingFilename;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const activeBtnClass = 'min-h-[36px] px-2.5 py-1 rounded text-[11px] font-semibold bg-blue-600 text-white mono cursor-pointer';
  const inactiveBtnClass = 'min-h-[36px] px-2.5 py-1 rounded text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 mono cursor-pointer';

  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <div className="flex items-center space-x-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mono flex items-center space-x-1.5">
            <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span>1-Click Policy &amp; Firmware Remediation</span>
          </h4>
          <span className="text-[9px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold mono">
            ZERO RETRAINING
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'speed'}
            onClick={() => setActiveTab('speed')}
            className={activeTab === 'speed' ? activeBtnClass : inactiveBtnClass}
          >
            Kinematic Mask
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'controller'}
            onClick={() => setActiveTab('controller')}
            className={activeTab === 'controller' ? activeBtnClass : inactiveBtnClass}
          >
            Firmware Governor
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'rl'}
            onClick={() => setActiveTab('rl')}
            className={activeTab === 'rl' ? activeBtnClass : inactiveBtnClass}
          >
            Digital Twin Env
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="relative bg-slate-900 rounded-lg p-3 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-56">
          <pre className="whitespace-pre">{code}</pre>
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] mono border border-slate-700 cursor-pointer"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <a
              href={`/patches/${filename}`}
              download={filename}
              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] mono cursor-pointer"
            >
              Download
            </a>
          </div>
        </div>
      </div>

      {remediation.summaryInstructions && (
        <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
          {remediation.summaryInstructions}
        </p>
      )}
    </div>
  );
};
