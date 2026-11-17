/**
 * Main Application View
 * Unified, razor-sharp single-page architecture for Diffraction.
 * Focused 100% on AMR floor-slip prevention, zero collisions, and 14-day site commissioning.
 *
 * Palette: #2FA4D7, #F5E9D8, #3E2C23, #E76F2E (Zero Gradients).
 */

'use client';

import React, { useState } from 'react';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingHero } from '@/components/landing/LandingHero';
import { InteractiveBrakingSimulator } from '@/components/interactive/InteractiveBrakingSimulator';
import { LandingStoryWalkthrough } from '@/components/landing/LandingStoryWalkthrough';
import { LandingBentoGrid } from '@/components/landing/LandingBentoGrid';
import { LandingRoiSection } from '@/components/landing/LandingRoiSection';
import { LandingPricingSection } from '@/components/landing/LandingPricingSection';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { MobileDrawer } from '@/components/layout/MobileDrawer';

export default function Home() {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  const scrollToPilot = () => {
    const el = document.getElementById('pricing');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSimulator = () => {
    const el = document.getElementById('simulator');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F5E9D8] text-[#3E2C23] flex flex-col selection:bg-[#2FA4D7] selection:text-white">
      {/* 1. Header Navigation */}
      <LandingHeader
        onLaunchPilotModal={scrollToPilot}
        onToggleMobileDrawer={() => setIsMobileDrawerOpen((prev) => !prev)}
      />

      {/* 2. Main Narrative Flow */}
      <main className="flex-1 w-full">
        {/* Section 1: Hero — The Problem & Value Proposition */}
        <LandingHero
          onLaunchConsole={scrollToSimulator}
          onExploreStory={() => {
            const el = document.getElementById('how-it-works');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenPricing={scrollToPilot}
        />

        {/* Section 2: Interactive Test Drive — Visual AMR Braking Simulator */}
        <InteractiveBrakingSimulator onRequestPilot={scrollToPilot} />

        {/* Section 3: How It Works — The 14-Day Automated Commissioning Lifecycle */}
        <LandingStoryWalkthrough onLaunchConsole={scrollToPilot} />

        {/* Section 4: 4 Deep-Tech Pillars — Continuous SysID, CBF-QP, MAP-Elites */}
        <LandingBentoGrid
          onLaunchConsole={scrollToPilot}
          onOpenGovernor={scrollToPilot}
          onOpenTelematics={scrollToPilot}
        />

        {/* Section 5: Commissioning ROI — $250k FAE Travel vs. $25k Pilot */}
        <LandingRoiSection onOpenPricing={scrollToPilot} />

        {/* Section 6: Commercial Offer & Direct Pilot Application Form */}
        <LandingPricingSection />
      </main>

      {/* 3. Footer */}
      <LandingFooter />

      {/* 4. Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        onOpenPilot={scrollToPilot}
      />
    </div>
  );
}
