/**
 * Presentation Component: Commercial Pricing & Statement of Work Tiers
 */

import React from 'react';

export const EnterprisePricingView: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2 pt-4">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mono">
          Enterprise Commercial Model
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Turnkey Beachhead Pilot &amp; CI/CD Licensing
        </h2>
        <p className="text-xs text-slate-600">
          Fixed-scope 30-day proof of value on your worst field disengagements, transitioning to continuous fleet CI/CD.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tier 1 */}
        <div className="p-6 rounded-2xl bg-white border-2 border-blue-600 card-shadow-lg relative flex flex-col justify-between">
          <div className="absolute -top-3 right-6 px-3 py-0.5 bg-blue-600 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-white mono">
            Recommended Beachhead
          </div>
          <div className="space-y-4">
            <div className="text-xs font-bold text-blue-600 mono uppercase tracking-wider">
              Phase 1: Proof of Value
            </div>
            <h3 className="text-lg font-bold text-slate-900">30-Day Diagnostic Pilot</h3>
            <div className="text-3xl font-black text-slate-900 num-tabular">
              $20,000&nbsp;<span className="text-xs font-normal text-slate-400 mono">Fixed Fee</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Isolate root cause and generate guaranteed firmware patches on your 5 most costly field disengagements.
            </p>

            <ul className="text-xs text-slate-700 space-y-2 border-t border-slate-100 pt-3">
              <li className="flex items-center space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>5 Disengagement MCAP Ingestions</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>3D USD Spatial Twin Reconstructions</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span className="num-tabular">25,000 Adversarial Stress Rollouts</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>ISO 13482, 17757, 10218, 3691-4 Dossiers</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Executive Presentation to VP Robotics</span>
              </li>
            </ul>
          </div>

          <a
            href="mailto:founder@diffraction.ai?subject=Inquiry:%2030-Day%20Diagnostic%20Pilot%20($20k)"
            className="min-h-[44px] mt-6 flex items-center justify-center py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
          >
            Book Diagnostic Pilot ($20k)
          </a>
        </div>

        {/* Tier 2 */}
        <div className="p-6 rounded-2xl bg-white border border-subtle card-shadow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-xs font-bold text-slate-500 mono uppercase tracking-wider">
              Phase 2: Fleet Scale
            </div>
            <h3 className="text-lg font-bold text-slate-900">Safety CI/CD Platform</h3>
            <div className="text-3xl font-black text-slate-900 num-tabular">
              $4,500&nbsp;<span className="text-xs font-normal text-slate-400 mono">/ mo + $75/robot</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Continuous automated regression gates on every Git commit and PR touching autonomy stacks.
            </p>

            <ul className="text-xs text-slate-700 space-y-2 border-t border-slate-100 pt-3">
              <li className="flex items-center space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Unlimited PR Safety Regression Gates</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Real-time Dynamic Edge Governor Lib</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Continuous Carrier Underwriting Dossier</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>1-Click Nav2 &amp; WBC Filter Exports</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Dedicated Autonomy Engineer SLA</span>
              </li>
            </ul>
          </div>

          <a
            href="mailto:founder@diffraction.ai?subject=Inquiry:%20Continuous%20Safety%20CI/CD%20Subscription"
            className="min-h-[44px] mt-6 flex items-center justify-center py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
          >
            Subscribe to CI/CD Platform
          </a>
        </div>

        {/* Tier 3 */}
        <div className="p-6 rounded-2xl bg-white border border-subtle card-shadow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-xs font-bold text-slate-500 mono uppercase tracking-wider">
              Phase 3: OEM Global
            </div>
            <h3 className="text-lg font-bold text-slate-900">Enterprise Dedicated</h3>
            <div className="text-3xl font-black text-slate-900">
              Custom&nbsp;<span className="text-xs font-normal text-slate-400 mono">Annual SOW</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Air-gapped on-premise simulation clusters for defence, aerospace, and high-security manufacturing.
            </p>

            <ul className="text-xs text-slate-700 space-y-2 border-t border-slate-100 pt-3">
              <li className="flex items-center space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Air-Gapped On-Premise Deployment</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Custom Kinematics &amp; Sensor Rig SysID</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Underwriter Insurance Consortium API</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Dedicated 24/7 Incident Hotline</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>SOC 2 Type II &amp; FedRAMP Ready</span>
              </li>
            </ul>
          </div>

          <a
            href="mailto:founder@diffraction.ai?subject=Inquiry:%20Enterprise%20Dedicated%20Air-Gapped"
            className="min-h-[44px] mt-6 flex items-center justify-center py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors cursor-pointer"
          >
            Contact Enterprise Sales
          </a>
        </div>
      </div>
    </div>
  );
};
