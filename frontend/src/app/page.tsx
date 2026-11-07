/**
 * Main Application View Router
 * Super Banger Marketing & Commercial Landing Website on root `/`,
 * seamlessly transitioning into the interactive Enterprise Verification App Workspace.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingHero } from '@/components/landing/LandingHero';
import { LandingEcosystemMarquee } from '@/components/landing/LandingEcosystemMarquee';
import { LandingBentoGrid } from '@/components/landing/LandingBentoGrid';
import { LandingInteractiveModalities } from '@/components/landing/LandingInteractiveModalities';
import { LandingStoryWalkthrough } from '@/components/landing/LandingStoryWalkthrough';
import { LandingRoiSection } from '@/components/landing/LandingRoiSection';
import { LandingPricingSection } from '@/components/landing/LandingPricingSection';
import { LandingCtaBanner } from '@/components/landing/LandingCtaBanner';
import { LandingFooter } from '@/components/landing/LandingFooter';

import { AppHeader } from '@/components/layout/AppHeader';
import { MobileDrawer } from '@/components/layout/MobileDrawer';
import { AppFooter } from '@/components/layout/AppFooter';
import { EnterpriseWorkspaceModal } from '@/components/modals/EnterpriseWorkspaceModal';
import { useWorkspaceCredentials } from '@/hooks/useWorkspaceCredentials';
import { useVerificationAudit } from '@/hooks/useVerificationAudit';
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
      if (['overview', 'landing', 'console', 'telematics', 'governor', 'cicd', 'pricing'].includes(hash)) {
        setActiveView(hash === 'landing' ? 'overview' : hash);
      }
    };
    handleHash();
    window.addEventListener('popstate', handleHash);
    return () => window.removeEventListener('popstate', handleHash);
  }, []);

  const handleViewChange = (view: string) => {
    const target = view === 'landing' ? 'overview' : view;
    setActiveView(target);
    if (window.location.hash !== `#${target}`) {
      window.history.pushState(null, '', `#${target}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectScenarioAndAudit = (key: string) => {
    audit.selectScenario(key);
    handleViewChange('console');
  };

  const isMarketingMode = activeView === 'overview';

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* 1. MARKETING LANDING PAGE MODE (DEFAULT ROOT) */}
      {isMarketingMode ? (
        <>
          <LandingHeader
            onLaunchConsole={() => handleViewChange('console')}
            onOpenWorkspaceModal={workspace.openModal}
            onToggleMobileDrawer={() => setIsMobileDrawerOpen((prev) => !prev)}
          />

          <main className="flex-1 w-full">
            {/* Grand Hero with Kinetic Typography and Live Physics Simulator */}
            <LandingHero
              onLaunchConsole={(scenarioKey) => {
                if (scenarioKey) {
                  audit.selectScenario(scenarioKey);
                }
                handleViewChange('console');
              }}
              onExploreStory={() => {
                const el = document.getElementById('how-it-works');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenPricing={() => {
                const el = document.getElementById('pricing');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Continuous Ecosystem Marquee */}
            <LandingEcosystemMarquee />

            {/* Bento Grid Capabilities */}
            <LandingBentoGrid
              onLaunchConsole={() => handleViewChange('console')}
              onOpenGovernor={() => handleViewChange('governor')}
              onOpenTelematics={() => handleViewChange('telematics')}
            />

            {/* Multi-Modal Autonomous Architectures */}
            <LandingInteractiveModalities
              onSelectScenarioAndAudit={handleSelectScenarioAndAudit}
            />

            {/* The 4-Act Verification Engine */}
            <LandingStoryWalkthrough
              onLaunchConsole={() => handleViewChange('console')}
            />

            {/* Financial ROI Stoppage Calculator */}
            <LandingRoiSection
              onOpenPricing={() => {
                const el = document.getElementById('pricing');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Commercial SOW & Licensing Tiers */}
            <LandingPricingSection
              onSelectPlan={(tier) => {
                handleViewChange('pricing');
              }}
              onLaunchConsole={() => handleViewChange('console')}
            />

            {/* Final Magnetic Conversion CTA */}
            <LandingCtaBanner
              onLaunchConsole={() => handleViewChange('console')}
              onOpenPricing={() => {
                const el = document.getElementById('pricing');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </main>

          <LandingFooter
            onLaunchConsole={() => handleViewChange('console')}
            onOpenPricing={() => handleViewChange('pricing')}
          />
        </>
      ) : (
        /* 2. INTERACTIVE APP WORKSPACE MODE (AUDIT CONSOLE, TELEMATICS, GOVERNOR, CICD, PRICING) */
        <>
          <AppHeader
            activeView={activeView}
            onViewChange={handleViewChange}
            onOpenWorkspaceModal={workspace.openModal}
            onToggleMobileDrawer={() => setIsMobileDrawerOpen((prev) => !prev)}
          />

          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
        </>
      )}

      {/* Global Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        activeView={activeView}
        onViewChange={handleViewChange}
        onOpenWorkspaceModal={workspace.openModal}
      />

      {/* Enterprise Workspace Modal */}
      <EnterpriseWorkspaceModal
        isOpen={workspace.isModalOpen}
        onClose={workspace.closeModal}
        tenantId={workspace.tenantId}
        organization={workspace.organization}
        apiKey={workspace.apiKey}
        copied={workspace.copied}
        onCopyKey={workspace.copyApiKey}
      />
    </div>
  );
}
