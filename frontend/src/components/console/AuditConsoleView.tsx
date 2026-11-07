/**
 * Presentation Component: Audit Console Main View
 */

'use client';

import React, { useState } from 'react';
import { UseVerificationAuditReturn } from '@/hooks/useVerificationAudit';
import { ModalitySegmentedBar } from './ModalitySegmentedBar';
import { McapDropzone } from './McapDropzone';
import { AdversarialMatrixCard } from './AdversarialMatrixCard';
import { AuditKpiGrid } from './AuditKpiGrid';
import { DigitalTwin3DViewer } from './DigitalTwin3DViewer';
import { TrajectoryScatterPlot } from './TrajectoryScatterPlot';
import { RegulatoryComplianceTable } from './RegulatoryComplianceTable';
import { CertificationArtifactsGrid } from './CertificationArtifactsGrid';
import { PolicyRemediationTabs } from './PolicyRemediationTabs';

interface AuditConsoleViewProps {
  readonly audit: UseVerificationAuditReturn;
}

export const AuditConsoleView: React.FC<AuditConsoleViewProps> = ({ audit }) => {
  const [viewportMode, setViewportMode] = useState<'3d' | '2d'>('3d');

  const {
    activeScenario,
    scenarioCount,
    setScenarioCount,
    isLoading,
    statusText,
    verdict,
    uploadedFileName,
    uploadedFileDetails,
    trajectoryPoints,
    selectScenario,
    handleFileUpload,
    runAudit,
  } = audit;

  const statusPillClass =
    statusText === 'STANDBY'
      ? 'bg-slate-100 text-slate-600 border-slate-200'
      : statusText === 'CERTIFIED_SAFE'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : statusText === 'FAILED_CRITICAL_RISK'
      ? 'bg-rose-50 text-rose-700 border-rose-200'
      : 'bg-blue-50 text-blue-700 border-blue-200';

  return (
    <section id="viewConsole" className="space-y-6" aria-label="Incident Audit Console">
      {/* Top Console Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-2xl border border-subtle card-shadow">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Universal Physical AI Incident Audit &amp; Verification Console</span>
            <span id="consoleStatusPill" className={`text-[10px] px-2 py-0.5 rounded-full border mono font-bold ${statusPillClass}`}>
              {statusText}
            </span>
          </h2>
          <p id="incidentSubtitle" className="text-xs text-slate-500 mono mt-0.5">
            {activeScenario.name} • {activeScenario.facility} ({activeScenario.standard})
          </p>
        </div>

        <ModalitySegmentedBar
          activeKey={activeScenario.key}
          onSelect={selectScenario}
          disabled={isLoading}
        />
      </div>

      {/* Two-Column Audit Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Ingestion & Matrix */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <McapDropzone
            onFileSelected={handleFileUpload}
            uploadedFileName={uploadedFileName}
            uploadedFileDetails={uploadedFileDetails}
            isLoading={isLoading}
          />

          <AdversarialMatrixCard
            scenarioCount={scenarioCount}
            onChangeScenarioCount={setScenarioCount}
            onExecuteAudit={runAudit}
            isLoading={isLoading}
          />
        </div>

        {/* Right Column: Active Intelligence & Artifacts */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-subtle card-shadow space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Active Audit Intelligence</h3>
                <div id="auditHeaderSummary" className="text-xs text-slate-500 mono mt-0.5">
                  {verdict
                    ? `Audit Complete for ${verdict.incidentId} (${verdict.totalScenarios} rollouts)`
                    : 'Awaiting telemetry packet…'}
                </div>
              </div>

              {/* Viewport Mode Switcher: 3D Twin vs 2D Plot */}
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-[10px] mono font-bold">
                <button
                  type="button"
                  onClick={() => setViewportMode('3d')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    viewportMode === '3d' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  3D Digital Twin
                </button>
                <button
                  type="button"
                  onClick={() => setViewportMode('2d')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    viewportMode === '2d' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  2D Odometry Plot
                </button>
              </div>
            </div>

            <AuditKpiGrid verdict={verdict} />

            {/* Viewport Container */}
            {viewportMode === '3d' ? (
              <DigitalTwin3DViewer
                modality={activeScenario.modality}
                robotId={activeScenario.robotId}
                status={verdict ? verdict.status : statusText}
              />
            ) : (
              <TrajectoryScatterPlot
                planned={trajectoryPoints.planned}
                actual={trajectoryPoints.actual}
                hazard={trajectoryPoints.hazard}
                hazardLabel={trajectoryPoints.hazardLabel}
              />
            )}

            {verdict && <RegulatoryComplianceTable clauses={verdict.regulatoryCompliance} />}
          </div>

          <div id="artifactsCard" className={verdict ? 'space-y-6' : 'hidden'}>
            <CertificationArtifactsGrid verdict={verdict} />
            <PolicyRemediationTabs remediation={verdict?.remediation} />

            {verdict && verdict.recommendations.length > 0 && (
              <div className="p-6 rounded-2xl bg-white border border-subtle card-shadow">
                <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 mono">
                  Root-Cause Engineering Directives:
                </h4>
                <ul id="recommendationsList" className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                  {verdict.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
