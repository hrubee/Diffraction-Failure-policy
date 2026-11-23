/**
 * Presentation Component: Commercial Pricing & SOW Packages for Landing Page
 * Crystal-clear enterprise commercial pricing designed for immediate conversion.
 * Features 3 Productized Tiers with Inline Pilot Application Form.
 *
 * Palette: #2FA4D7, #F5E9D8, #3E2C23, #E76F2E (Zero Gradients).
 */

'use client';

import React, { useState } from 'react';
import { SPRINT_PACKAGES } from '@/domain/synthetic/catalog';
import { CheckCircle2, Zap, ArrowRight, ShieldCheck, Sparkles, Send, Check } from 'lucide-react';

interface LandingPricingSectionProps {
  readonly onSelectPlan?: (tier: string) => void;
}

export const LandingPricingSection: React.FC<LandingPricingSectionProps> = () => {
  const [selectedTier, setSelectedTier] = useState<string>('turnkey_pilot');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [robotType, setRobotType] = useState<string>('ROS 2 Nav2 Differential Drive (500kg AMR)');
  const [floorIssue, setFloorIssue] = useState<string>('Polished wet epoxy / dock door condensation');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    setSubmitted(true);
  };

  return (
    <section id="pricing" className="py-20 relative bg-[#F5E9D8]" aria-label="Commercial Pricing Plans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-white border border-[#2FA4D7]/40 text-xs text-[#2FA4D7] font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#E76F2E]" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Turnkey Pilot &amp; Fleet Licensing
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3E2C23] tracking-tight font-headline">
            The 14-Day Braking Stability Pilot.
            <br />
            <span className="text-[#2FA4D7]">
              Fixed Fee. Guaranteed Stopping Invariance.
            </span>
          </h2>

          <p className="text-[#3E2C23]/80 text-sm sm:text-base leading-relaxed font-body">
            Stop running fleets de-tuned to 0.6 m/s. We diagnose real-world floor friction from a 5-second driving log, simulate stopping envelopes across 10,000 edge cases, and deliver an ISO compliance audit with a drop-in ROS 2 governor in 14 days.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {SPRINT_PACKAGES.map((pkg) => {
            const isFeatured = pkg.id === selectedTier;
            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedTier(pkg.id)}
                className={`relative rounded-2xl bg-white border-2 p-8 shadow-sm flex flex-col justify-between space-y-8 cursor-pointer transition-all ${
                  isFeatured
                    ? 'border-[#2FA4D7] shadow-md ring-2 ring-[#2FA4D7]/20'
                    : 'border-[#3E2C23] hover:border-[#2FA4D7]/60'
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-md bg-[#2FA4D7] text-white font-bold text-[10px] uppercase tracking-wider shadow-sm font-mono">
                    RECOMMENDED BEACHHEAD
                  </div>
                )}

                <div className="space-y-6 pt-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#E76F2E] font-mono">
                        {pkg.turnaroundDays}-Day SLA
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F5E9D8] text-[#3E2C23] font-bold border border-[#3E2C23]/15">
                        Fixed Scope
                      </span>
                    </div>

                    <div className="flex items-baseline space-x-2">
                      <span className="text-4xl sm:text-5xl font-bold text-[#3E2C23] font-headline tracking-tight">
                        ${pkg.priceUsd.toLocaleString()}
                      </span>
                      <span className="text-xs text-[#3E2C23]/60 font-mono">
                        {pkg.id === 'fleet_governor_license' ? '/ year' : 'fixed fee'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#3E2C23] font-headline">
                      {pkg.name}
                    </h3>

                    <p className="text-xs text-[#3E2C23]/80 leading-relaxed font-body">
                      {pkg.tagline}
                    </p>
                  </div>

                  {/* Deliverables Checklist */}
                  <div className="space-y-2.5 pt-4 border-t border-[#3E2C23]/10">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#3E2C23] block font-mono">
                      Guaranteed Deliverables:
                    </span>
                    <ul className="space-y-2">
                      {pkg.deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs text-[#3E2C23]/90 font-body">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2FA4D7] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#3E2C23]/10 space-y-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTier(pkg.id);
                      const el = document.getElementById('pilot-form');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full py-3 px-4 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-xs ${
                      isFeatured
                        ? 'bg-[#E76F2E] text-white hover:bg-[#E76F2E]/90'
                        : 'bg-[#3E2C23] text-white hover:bg-[#2A1D17]'
                    }`}
                  >
                    <span>Select {pkg.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono text-[#3E2C23]/60 text-center block">
                    {pkg.sla}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 100% Money-Back Guarantee Strip */}
        <div className="rounded-2xl bg-white border-2 border-[#3E2C23] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base sm:text-lg font-bold text-[#3E2C23] font-headline">
                The 100% Zero-Collision Guarantee
              </h4>
              <p className="text-xs sm:text-sm text-[#3E2C23]/80 font-body max-w-3xl">
                Every pilot includes provable safety barrier functions and inverse physics calibration. If your robot experiences an unprevented collision under our safety governor, or if the dossier fails ISO 3691-4 compliance review, we refund 100% of your pilot fee.
              </p>
            </div>
          </div>
        </div>

        {/* Direct Pilot Request Form */}
        <div id="pilot-form" className="rounded-2xl bg-white border-2 border-[#3E2C23] p-8 max-w-3xl mx-auto shadow-sm space-y-6">
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#F5E9D8] text-xs font-mono font-bold text-[#3E2C23]">
              <Zap className="w-3.5 h-3.5 text-[#E76F2E]" />
              <span>Direct Pilot Application</span>
            </div>
            <h3 className="text-2xl font-bold font-headline text-[#3E2C23]">
              Schedule Your 14-Day Pilot
            </h3>
            <p className="text-xs sm:text-sm text-[#3E2C23]/75 font-body">
              Enter your fleet details below. Our robotics engineering team will review your robot kinematics and contact you within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-50 border-2 border-emerald-500 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-emerald-900 font-headline">
                Pilot Request Received!
              </h4>
              <p className="text-xs text-emerald-800 font-body max-w-md mx-auto">
                Thank you, <strong>{name}</strong>. We received your request for <strong>{company}</strong> ({robotType}). A senior robotics engineer will reach out to <strong>{email}</strong> within 24 hours to coordinate your 5-second telemetry drop.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#3E2C23] font-bold block">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#3E2C23]/25 bg-[#FAF4EB] text-[#3E2C23] focus:outline-[#2FA4D7]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#3E2C23] font-bold block">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@robotics-oem.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#3E2C23]/25 bg-[#FAF4EB] text-[#3E2C23] focus:outline-[#2FA4D7]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#3E2C23] font-bold block">Company / Organization *</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Apex Intralogistics"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#3E2C23]/25 bg-[#FAF4EB] text-[#3E2C23] focus:outline-[#2FA4D7]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#3E2C23] font-bold block">Robot Platform Type</label>
                  <input
                    type="text"
                    value={robotType}
                    onChange={(e) => setRobotType(e.target.value)}
                    placeholder="e.g. Nav2 Differential Drive, Ackermann"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#3E2C23]/25 bg-[#FAF4EB] text-[#3E2C23] focus:outline-[#2FA4D7]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#3E2C23] font-bold block">Floor / Slip Bottleneck</label>
                  <input
                    type="text"
                    value={floorIssue}
                    onChange={(e) => setFloorIssue(e.target.value)}
                    placeholder="e.g. Slick epoxy, dust, dock condensation"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#3E2C23]/25 bg-[#FAF4EB] text-[#3E2C23] focus:outline-[#2FA4D7]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#E76F2E] hover:bg-[#E76F2E]/90 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xs cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Pilot Request</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
