/**
 * Main Application View Router
 * Next.js 15 App Router page with multi-view state and domain hooks.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { MobileDrawer } from '@/components/layout/MobileDrawer';
import { AppFooter } from '@/components/layout/AppFooter';
import { EnterpriseWorkspaceModal } from '@/components/modals/EnterpriseWorkspaceModal';
import { useWorkspaceCredentials } from '@/hooks/useWorkspaceCredentials';
import { useVerificationAudit } from '@/hooks/useVerificationAudit';
import { ModalityShowcaseGrid } from '@/components/overview/ModalityShowcaseGrid';
import { FleetKpiTiles } from '@/components/overview/FleetKpiTiles';
import { RoiCalculator } from '@/components/overview/RoiCalculator';
import { IncidentQueueTable } from '@/components/overview/IncidentQueueTable';
import { AuditConsoleView } from '@/components/console/AuditConsoleView';
import { UnderwritingBanner } from '@/components/telematics/UnderwritingBanner';
import { ProvingGroundsTable } from '@/components/telematics/ProvingGroundsTable';
import { GovernorPlayground } from '@/components/governor/GovernorPlayground';
import { GithubActionTurnkeyYaml } from '@/components/cicd/GithubActionTurnkeyYaml';
import { ApiKeyManager } from '@/components/cicd/ApiKeyManager';
import { EnterprisePricingView } from '@/components/pricing/EnterprisePricingView';

export default function Home() {
  const [activeView, setActiveView] = useState<string>('overview');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  const workspace = useWorkspaceCredentials();
  const audit = useVerificationAudit();

  // Sync with URL hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['overview', 'console', 'telematics', 'governor', 'cicd', 'pricing'].includes(hash)) {
        setActiveView(hash);
      }
    };
    handleHash();
    window.addEventListener('popstate', handleHash);
    return () => window.removeEventListener('popstate', handleHash);
  }, []);

  const handleViewChange = (view: string) => {
    setActiveView(view);
    if (window.location.hash !== `#${view}`) {
      window.history.pushState(null, '', `#${view}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectScenarioAndAudit = (key: string) => {
    audit.selectScenario(key);
    handleViewChange('console');
  };

  return (
    <>
      <AppHeader
        activeView={activeView}
        onViewChange={handleViewChange}
        onOpenWorkspaceModal={workspace.openModal}
        onToggleMobileDrawer={() => setIsMobileDrawerOpen((prev) => !prev)}
      />

      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        activeView={activeView}
        onViewChange={handleViewChange}
        onOpenWorkspaceModal={workspace.openModal}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* VIEW 1: EXECUTIVE OPERATIONS OVERVIEW */}
        {activeView === 'overview' && (
          <section id="viewOverview" className="space-y-8" aria-label="Executive Operations Overview">
            {/* Top Fleet Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white card-shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="h-10 w-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm tracking-tight">
                      Enterprise Physical AI Sentinel: 5 Autonomous Robotic Modalities Active
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 mono">
                      MULTI-MODAL VERIFIED
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Continuous physics verification across Humanoids, Heavy Haulers, Manipulators, Wheeled AMRs &amp; Sidewalk Rovers.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleViewChange('console')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-sm transition-colors shrink-0 cursor-pointer"
              >
                Launch Verification Console
              </button>
            </div>

            <ModalityShowcaseGrid onSelectScenario={handleSelectScenarioAndAudit} />
            <FleetKpiTiles />
            <RoiCalculator />
            <IncidentQueueTable onOpenAudit={handleSelectScenarioAndAudit} />
          </section>
        )}

        {/* VIEW 2: INCIDENT AUDIT CONSOLE */}
        {activeView === 'console' && <AuditConsoleView audit={audit} />}

        {/* VIEW 3: TELEMATICS & PROVING GROUNDS */}
        {activeView === 'telematics' && (
          <section id="viewTelematics" className="space-y-6" aria-label="Fleet Telematics and Proving Grounds">
            <UnderwritingBanner />
            <ProvingGroundsTable />
          </section>
        )}

        {/* VIEW 4: DYNAMIC SAFETY GOVERNOR */}
        {activeView === 'governor' && (
          <section id="viewGovernor" className="space-y-6" aria-label="Dynamic Safety Governor Simulator">
            <GovernorPlayground />
          </section>
        )}

        {/* VIEW 5: CI/CD & API KEYS */}
        {activeView === 'cicd' && (
          <section id="viewCicd" className="space-y-6" aria-label="CI/CD Integration and APIs">
            <GithubActionTurnkeyYaml />
            <ApiKeyManager />
          </section>
        )}

        {/* VIEW 6: COMMERCIAL PRICING & SOW */}
        {activeView === 'pricing' && (
          <section id="viewPricing" className="space-y-8" aria-label="Commercial Pricing and Pilot Statement of Work">
            <EnterprisePricingView />
          </section>
        )}
      </main>

      <AppFooter />

      <EnterpriseWorkspaceModal
        isOpen={workspace.isModalOpen}
        onClose={workspace.closeModal}
        tenantId={workspace.tenantId}
        organization={workspace.organization}
        apiKey={workspace.apiKey}
        copied={workspace.copied}
        onCopyKey={workspace.copyApiKey}
      />
    </>
  );
}
