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
import { ProductStoryHero } from '@/components/story/ProductStoryHero';
import { StoryWalkthrough } from '@/components/story/StoryWalkthrough';
import { ModalityExplainer } from '@/components/story/ModalityExplainer';
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
        {/* VIEW 1: EXECUTIVE OPERATIONS OVERVIEW & STORYLINE */}
        {activeView === 'overview' && (
          <section id="viewOverview" className="space-y-12" aria-label="Executive Operations Overview & Storyline">
            {/* 1. Grand Narrative Hook Hero */}
            <ProductStoryHero
              onExploreStory={() => {
                const el = document.getElementById('storyline');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onLaunchSandbox={() => handleViewChange('console')}
              onOpenPricing={() => handleViewChange('pricing')}
            />

            {/* 2. Interactive 4-Act Storyline Walkthrough */}
            <StoryWalkthrough onLaunchSandbox={() => handleViewChange('console')} />

            {/* 3. Plain Human Language Multi-Modal Explainer */}
            <ModalityExplainer onSelectScenario={handleSelectScenarioAndAudit} />

            {/* 4. Fleet Scale & Insured Value KPI Metrics */}
            <FleetKpiTiles />

            {/* 5. Fleet Line Stoppage ROI Calculator */}
            <RoiCalculator />

            {/* 6. Active Telemetry Stream & Incidents */}
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
