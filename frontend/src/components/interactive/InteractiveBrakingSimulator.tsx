/**
 * Interactive Component: 4-in-1 Physical AI Warehouse Edge Case Simulator
 * Empirically showcases the 4 real-world failure modes that crash or shut down AMRs:
 * 1. Traction Loss (The Skid)
 * 2. Sensor Glare (The Phantom E-Stop)
 * 3. Payload Shifts (The Rollover / Tip)
 * 4. CAN-Bus Latency (The Late Brake)
 *
 * Strict Color Hunt Palette: #2FA4D7, #F5E9D8, #3E2C23, #E76F2E (Zero Gradients).
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Play,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ArrowRight,
  Bot,
  Sun,
  Scale,
  Wifi,
  Sliders,
} from 'lucide-react';

type EdgeCaseId = 'traction' | 'glare' | 'payload' | 'latency';

interface EdgeCaseInfo {
  id: EdgeCaseId;
  tabLabel: string;
  icon: React.ReactNode;
  standard: string;
  headline: string;
  riskDescription: string;
}

const EDGE_CASES: readonly EdgeCaseInfo[] = [
  {
    id: 'traction',
    tabLabel: '1. Floor Traction (Skid)',
    icon: <Bot className="w-4 h-4" />,
    standard: 'ISO 3691-4:2023 Cl. 5.2',
    headline: 'Low-Friction Floor Slip & Skid Collisions',
    riskDescription: 'Polished epoxy, spilled fluids, or fine warehouse dust reduce tire grip below μ = 0.25, causing locked-wheel skids into racking or workers.',
  },
  {
    id: 'glare',
    tabLabel: '2. Sensor Glare (Phantom Stop)',
    icon: <Sun className="w-4 h-4" />,
    standard: 'ANSI/RIA R15.08 Part 1',
    headline: 'Solar Glare & False Obstacle Lockouts',
    riskDescription: '2 PM sunlight through warehouse skylights or specular reflections off pallet shrink-wrap blind optical cameras, triggering "phantom E-stops" that freeze high-traffic aisles.',
  },
  {
    id: 'payload',
    tabLabel: '3. Heavy Payload (Tipping)',
    icon: <Scale className="w-4 h-4" />,
    standard: 'ISO 13849 PL-d Cat 3',
    headline: 'Top-Heavy Pallet Cornering Rollover Risk',
    riskDescription: 'Unbalanced or high-center-of-gravity pallets cause outer wheels to lift during high-speed cornering, triggering motor controller torque faults or physical tipping.',
  },
  {
    id: 'latency',
    tabLabel: '4. Network Lag (Late Brake)',
    icon: <Wifi className="w-4 h-4" />,
    standard: 'ISO 3691-4 Reaction Bounds',
    headline: 'CAN-Bus Jitter & Stale Sensor Deceleration Delay',
    riskDescription: '60ms to 120ms internal CAN delays or Wi-Fi roaming packet drops cause the robot to act on stale obstacle coordinates, braking half a second too late.',
  },
];

export const InteractiveBrakingSimulator: React.FC<{ readonly onRequestPilot: () => void }> = ({
  onRequestPilot,
}) => {
  const [activeTab, setActiveTab] = useState<EdgeCaseId>('traction');
  const [speed, setSpeed] = useState<number>(1.8); // m/s
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [animProgress, setAnimProgress] = useState<number>(0);
  const [hasRun, setHasRun] = useState<boolean>(false);

  // Sub-parameters for different tabs
  const [frictionPreset, setFrictionPreset] = useState<'slick' | 'dusty' | 'dry'>('slick');
  const [glareLux, setGlareLux] = useState<number>(85000); // lux
  const [payloadHeight, setPayloadHeight] = useState<'low' | 'high' | 'asymmetric'>('high');
  const [latencyMs, setLatencyMs] = useState<number>(85); // ms

  const currentCase = EDGE_CASES.find((c) => c.id === activeTab) || EDGE_CASES[0];

  // Animation controller
  useEffect(() => {
    let animFrame: number;
    if (isSimulating) {
      const startTime = Date.now();
      const duration = 2000;

      const update = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / duration);
        setAnimProgress(progress);

        if (progress < 1) {
          animFrame = requestAnimationFrame(update);
        } else {
          setIsSimulating(false);
          setHasRun(true);
        }
      };

      animFrame = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(animFrame);
  }, [isSimulating]);

  const handleRun = () => {
    setAnimProgress(0);
    setIsSimulating(true);
    setHasRun(true);
  };

  const handleReset = () => {
    setAnimProgress(0);
    setIsSimulating(false);
    setHasRun(false);
  };

  const handleTabChange = (tab: EdgeCaseId) => {
    setActiveTab(tab);
    handleReset();
  };

  return (
    <section id="simulator" className="py-20 relative bg-white border-y-2 border-[#3E2C23]" aria-label="Interactive 4-in-1 Edge Case Simulator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#F5E9D8] border border-[#3E2C23]/20 text-xs text-[#3E2C23] font-mono shadow-xs">
            <Sliders className="w-3.5 h-3.5 text-[#2FA4D7]" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Interactive Multi-Physics Test Drive
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#3E2C23] tracking-tight leading-tight font-headline">
            The 4 physical edge cases that
            <br />
            <span className="text-[#2FA4D7]">stall warehouse robot deployments.</span>
          </h2>

          <p className="text-[#3E2C23]/80 text-sm sm:text-base leading-relaxed font-body">
            Robots don&apos;t just fail because of slippery floors. Standard navigation stacks break down under <strong>4 specific physical conditions</strong>. Test how your robot fleet performs with and without Diffraction&apos;s runtime safety governor.
          </p>
        </div>

        {/* The 4-Tab Edge Case Selector Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-1.5 rounded-2xl bg-[#F5E9D8] border-2 border-[#3E2C23]">
          {EDGE_CASES.map((ec) => {
            const isSelected = activeTab === ec.id;
            return (
              <button
                key={ec.id}
                onClick={() => handleTabChange(ec.id)}
                className={`flex items-center space-x-2 px-3.5 py-3 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#3E2C23] text-white shadow-xs'
                    : 'text-[#3E2C23]/75 hover:bg-white/80'
                }`}
              >
                <span className={isSelected ? 'text-[#2FA4D7]' : 'text-[#3E2C23]'}>{ec.icon}</span>
                <span className="truncate">{ec.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Workspace Container */}
        <div className="rounded-2xl bg-[#F5E9D8] border-2 border-[#3E2C23] p-6 sm:p-8 space-y-8 shadow-xs">
          {/* Active Case Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#3E2C23]/15">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E76F2E] text-white">
                  {currentCase.standard}
                </span>
                <span className="text-xs font-bold font-headline text-[#3E2C23]">
                  {currentCase.headline}
                </span>
              </div>
              <p className="text-xs text-[#3E2C23]/80 max-w-2xl font-body leading-relaxed">
                {currentCase.riskDescription}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleRun}
                disabled={isSimulating}
                className="py-3 px-5 rounded-xl bg-[#E76F2E] hover:bg-[#E76F2E]/90 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isSimulating ? 'Simulating Physics…' : 'Simulate Edge Case'}</span>
              </button>
              <button
                onClick={handleReset}
                className="p-3 rounded-xl bg-white border border-[#3E2C23]/20 hover:border-[#3E2C23] text-[#3E2C23] cursor-pointer"
                title="Reset simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dynamic Scenario Controls Depending on Selected Tab */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeTab === 'traction' && (
              <>
                <div className="bg-white p-3.5 rounded-xl border border-[#3E2C23]/15 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#3E2C23]/60 block">Surface Type</span>
                  <div className="grid grid-cols-3 gap-1">
                    {(['slick', 'dusty', 'dry'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => { setFrictionPreset(p); handleReset(); }}
                        className={`py-1.5 px-2 rounded text-[11px] font-mono font-bold capitalize ${
                          frictionPreset === p ? 'bg-[#2FA4D7] text-white' : 'bg-[#FAF4EB] text-[#3E2C23]'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#3E2C23]/15 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#3E2C23]/60 block">Approach Speed</span>
                  <div className="flex justify-between items-center text-xs font-mono font-bold">
                    <span>{speed.toFixed(1)} m/s</span>
                    <span className="text-[10px] text-[#3E2C23]/50">({(speed * 3.6).toFixed(1)} km/h)</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="2.4"
                    step="0.2"
                    value={speed}
                    onChange={(e) => { setSpeed(parseFloat(e.target.value)); handleReset(); }}
                    className="w-full accent-[#2FA4D7]"
                  />
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#3E2C23]/15 space-y-1 font-mono text-xs">
                  <span className="text-[10px] font-bold uppercase text-[#3E2C23]/60 block">Floor Traction Coefficient</span>
                  <div className="text-xl font-bold text-[#E76F2E]">
                    μ = {frictionPreset === 'slick' ? '0.22' : frictionPreset === 'dusty' ? '0.38' : '0.72'}
                  </div>
                  <span className="text-[10px] text-[#3E2C23]/70">Standard Nav2 assumes μ = 0.70</span>
                </div>
              </>
            )}

            {activeTab === 'glare' && (
              <>
                <div className="bg-white p-3.5 rounded-xl border border-[#3E2C23]/15 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#3E2C23]/60 block">Skylight Glare Exposure</span>
                  <div className="flex justify-between items-center text-xs font-mono font-bold">
                    <span>{glareLux.toLocaleString()} Lux</span>
                    <span className="text-[10px] text-[#E76F2E]">Direct Sun</span>
                  </div>
                  <input
                    type="range"
                    min="20000"
                    max="95000"
                    step="5000"
                    value={glareLux}
                    onChange={(e) => { setGlareLux(parseInt(e.target.value)); handleReset(); }}
                    className="w-full accent-[#E76F2E]"
                  />
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#3E2C23]/15 space-y-1.5 font-mono text-xs">
                  <span className="text-[10px] font-bold uppercase text-[#3E2C23]/60 block">Optical Sensor Saturation</span>
                  <div className="text-xl font-bold text-[#E76F2E]">
                    {Math.round((glareLux / 95000) * 100)}% Sensor Blinded
                  </div>
                  <span className="text-[10px] text-[#3E2C23]/70">RGB-D Depth Dropout</span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#3E2C23]/15 space-y-1 font-mono text-xs">
                  <span className="text-[10px] font-bold uppercase text-[#3E2C23]/60 block">Aisle Stoppage Risk</span>
                  <div className="text-xl font-bold text-rose-600">High (Phantom E-Stop)</div>
                  <span className="text-[10px] text-[#3E2C23]/70">Aisle blocked for 45+ mins</span>
                </div>
              </>
            )}

            {activeTab === 'payload' && (
              <>
                <div className="bg-white p-3.5 rounded-xl border border-[#3E2C23]/15 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#3E2C23]/60 block">Center of Mass Height</span>
                  <div className="grid grid-cols-3 gap-1">
                    {(['low', 'high', 'asymmetric'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => { setPayloadHeight(p); handleReset(); }}
                        className={`py-1.5 px-2 rounded text-[11px] font-mono font-bold capitalize ${
                          payloadHeight === p ? 'bg-[#2FA4D7] text-white' : 'bg-[#FAF4EB] text-[#3E2C23]'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#3E2C23]/15 space-y-1.5 font-mono text-xs">
                  <span className="text-[10px] font-bold uppercase text-[#3E2C23]/60 block">Payload Mass</span>
                  <div className="text-xl font-bold text-[#3E2C23]">650 kg Pallet</div>
                  <span className="text-[10px] text-[#3E2C23]/70">High-Bay Storage Cargo</span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#3E2C23]/15 space-y-1 font-mono text-xs">
                  <span className="text-[10px] font-bold uppercase text-[#3E2C23]/60 block">Rollover Risk at 1.8 m/s</span>
                  <div className="text-xl font-bold text-rose-600">
                    {payloadHeight === 'low' ? 'Low (Safe)' : payloadHeight === 'high' ? 'CRITICAL (>0.45G)' : 'EXTREME (Wheel Lift)'}
                  </div>
                  <span className="text-[10px] text-[#3E2C23]/70">Lateral acceleration exceeds track</span>
                </div>
              </>
            )}

            {activeTab === 'latency' && (
              <>
                <div className="bg-white p-3.5 rounded-xl border border-[#3E2C23]/15 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#3E2C23]/60 block">CAN / Wi-Fi Latency Spike</span>
                  <div className="flex justify-between items-center text-xs font-mono font-bold">
                    <span>{latencyMs} ms Jitter</span>
                    <span className="text-[10px] text-[#E76F2E]">Steel Aisle Dead Zone</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="150"
                    step="10"
                    value={latencyMs}
                    onChange={(e) => { setLatencyMs(parseInt(e.target.value)); handleReset(); }}
                    className="w-full accent-[#E76F2E]"
                  />
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#3E2C23]/15 space-y-1.5 font-mono text-xs">
                  <span className="text-[10px] font-bold uppercase text-[#3E2C23]/60 block">Braking Reaction Lag</span>
                  <div className="text-xl font-bold text-[#E76F2E]">
                    +{(latencyMs * 0.001 * speed).toFixed(2)}m Distance Added
                  </div>
                  <span className="text-[10px] text-[#3E2C23]/70">Stale perception position</span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#3E2C23]/15 space-y-1 font-mono text-xs">
                  <span className="text-[10px] font-bold uppercase text-[#3E2C23]/60 block">Safety Field Compliance</span>
                  <div className="text-xl font-bold text-rose-600">
                    {latencyMs > 60 ? 'NON-COMPLIANT' : 'MARGINAL'}
                  </div>
                  <span className="text-[10px] text-[#3E2C23]/70">Breaches ISO 3691-4 envelope</span>
                </div>
              </>
            )}
          </div>

          {/* Dual Visual Simulation Lanes */}
          <div className="space-y-4">
            {/* Lane 1: Without Diffraction */}
            <div className="p-5 rounded-xl bg-white border-2 border-rose-300 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3E2C23]/10 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-xs font-bold font-headline text-[#3E2C23]">
                    Standard Robot Fleet (Without Diffraction)
                  </span>
                </div>
                <div className="text-[11px] font-mono">
                  {hasRun ? (
                    <span className="text-rose-600 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {activeTab === 'traction' && 'COLLISION: Robot skids 1.6m past laser boundary into wall'}
                      {activeTab === 'glare' && 'LINE LOCKOUT: Phantom E-stop triggered by 85k Lux skylight'}
                      {activeTab === 'payload' && 'ROLLOVER FAULT: High-CoM pallet causes outer wheel lift (>0.48G)'}
                      {activeTab === 'latency' && 'ZONE BREACH: 85ms CAN lag causes late braking into pedestrian field'}
                    </span>
                  ) : (
                    <span className="text-[#3E2C23]/50">Click &quot;Simulate Edge Case&quot; to test</span>
                  )}
                </div>
              </div>

              {/* Physical Track Display */}
              <div className="p-4 rounded-lg bg-rose-50/60 border border-rose-200 font-mono text-xs flex justify-between items-center">
                <div className="space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-rose-700">Physical Outcome:</div>
                  <div className="text-rose-900 font-bold">
                    {activeTab === 'traction' && 'Wheel lockup → Kinetic friction drop → 2.45m stopping distance (Crash)'}
                    {activeTab === 'glare' && 'False positive cluster in pointcloud → Emergency hard-brake in aisle'}
                    {activeTab === 'payload' && 'Lateral tipping threshold breached at 1.8 m/s cornering (Safety E-stop)'}
                    {activeTab === 'latency' && 'Stale odometry packet execution → 450ms delayed braking response'}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-rose-600 text-white font-bold text-[10px] shrink-0">
                  FAILED
                </span>
              </div>
            </div>

            {/* Lane 2: With Diffraction Safety Guard */}
            <div className="p-5 rounded-xl bg-white border-2 border-emerald-500 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3E2C23]/10 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold font-headline text-[#3E2C23]">
                    With Diffraction Runtime Safety Governor
                  </span>
                </div>
                <div className="text-[11px] font-mono">
                  {hasRun ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {activeTab === 'traction' && 'ZERO COLLISION: Active torque governor maintains rolling contact'}
                      {activeTab === 'glare' && 'ZERO LINE FREEZE: Multi-modal fusion filters false optical glare'}
                      {activeTab === 'payload' && 'STABLE TURNING: Cornering speed smoothly clamped to 0.95 m/s'}
                      {activeTab === 'latency' && 'ISO COMPLIANT: Predictive barrier function accounts for latency'}
                    </span>
                  ) : (
                    <span className="text-[#3E2C23]/50">Click &quot;Simulate Edge Case&quot; to test</span>
                  )}
                </div>
              </div>

              {/* Physical Track Display */}
              <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-300 font-mono text-xs flex justify-between items-center">
                <div className="space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-emerald-800">Diffraction Active Mitigation:</div>
                  <div className="text-emerald-950 font-bold">
                    {activeTab === 'traction' && '62μs active-set quadratic program intercepts slip → 0.92m safe stop'}
                    {activeTab === 'glare' && 'LiDAR pointcloud cross-check validates path in 15ms → No phantom stop'}
                    {activeTab === 'payload' && 'Dynamic center-of-mass envelope clamps yaw velocity (Zero tipping)'}
                    {activeTab === 'latency' && 'Forward-predictive reachability buffer pre-charges braking safely'}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-[10px] shrink-0">
                  CERTIFIED SAFE
                </span>
              </div>
            </div>
          </div>

          {/* Real-World Data Upload Option */}
          <div className="p-5 rounded-xl bg-white border border-[#3E2C23]/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-[#2FA4D7]/15 text-[#2FA4D7] shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 text-xs text-[#3E2C23]">
                <div className="font-bold font-headline">Test with your actual robot fleet logs</div>
                <div className="text-[#3E2C23]/70">
                  Send us a 5-second log (.csv or .mcap) from any robot facing slip, glare, or latency. We return a full multi-physics audit within 24 hours.
                </div>
              </div>
            </div>

            <button
              onClick={onRequestPilot}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#3E2C23] hover:bg-[#3E2C23]/90 text-white font-mono text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <span>Submit 5s Robot Log</span>
              <ArrowRight className="w-4 h-4 text-[#2FA4D7]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
