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
import { LandingEnterpriseSecurity } from '@/components/landing/LandingEnterpriseSecurity';
import { LandingPricingSection } from '@/components/landing/LandingPricingSection';
import { LandingCtaBanner } from '@/components/landing/LandingCtaBanner';
import { LandingFooter } from '@/components/landing/LandingFooter';

import { AppHeader } from '@/components/layout/AppHeader';
import { MobileDrawer } from '@/components/layout/MobileDrawer';
import { AppFooter } from '@/components/layout/AppFooter';
import { EnterpriseWorkspaceModal } from '@/components/modals/EnterpriseWorkspaceModal';
import { useWorkspaceCredentials } from '@/hooks/useWorkspaceCredentials';
import { useVerificationAudit } from '@/hooks/useVerificationAudit';
import { SyntheticFactoryStudio } from '@/components/studio/SyntheticFactoryStudio';
import { DatasetCatalogView } from '@/components/catalog/DatasetCatalogView';
import { Sim2RealBenchmarkView } from '@/components/sim2real/Sim2RealBenchmarkView';
import { PythonSdkView } from '@/components/sdk/PythonSdkView';
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
      const validViews = [
        'overview', 'landing', 'studio', 'console',
        'catalog', 'telematics', 'sim2real', 'governor',
        'sdk', 'cicd', 'pricing'
      ];
      if (validViews.includes(hash)) {
        if (hash === 'landing') setActiveView('overview');
        else if (hash === 'console') setActiveView('studio');
        else if (hash === 'telematics') setActiveView('catalog');
        else if (hash === 'governor') setActiveView('sim2real');
        else if (hash === 'cicd') setActiveView('sdk');
        else setActiveView(hash);
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
    <div className="min-h-screen bg-[#F5E9D8] text-[#3E2C23] flex flex-col selection:bg-[#2FA4D7] selection:text-white">
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

            {/* Enterprise Security & Air-Gapped Data Sovereignty */}
            <LandingEnterpriseSecurity />

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
            {/* VIEW 2: ISAAC SIM SYNTHETIC FACTORY STUDIO */}
            {(activeView === 'studio' || activeView === 'console') && <SyntheticFactoryStudio />}

            {/* VIEW 3: SYNTHETIC DATASET CATALOG */}
            {(activeView === 'catalog' || activeView === 'telematics') && <DatasetCatalogView />}

            {/* VIEW 4: SIM-TO-REAL ALIGNMENT LAB */}
            {(activeView === 'sim2real' || activeView === 'governor') && <Sim2RealBenchmarkView />}

            {/* VIEW 5: PYTHON SDK & CLUSTER API */}
            {(activeView === 'sdk' || activeView === 'cicd') && <PythonSdkView />}

            {/* VIEW 6: COMMERCIAL PRICING & GPU CLUSTERS */}
            {activeView === 'pricing' && (
              <section id="viewPricing" className="space-y-8" aria-label="Commercial Pricing and Dedicated GPU Clusters">
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
