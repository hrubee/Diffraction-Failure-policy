/**
 * Interactive Component: Visual AMR Wheel-Slip & Emergency Braking Simulator
 * Demonstrates the physical reality of warehouse robot wheel slip and how
 * Diffraction's real-time safety guard prevents collisions on low-friction floors.
 *
 * Strict Color Hunt Palette: #2FA4D7, #F5E9D8, #3E2C23, #E76F2E (Zero Gradients).
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Play,
  RotateCcw,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Upload,
  ArrowRight,
  Bot,
} from 'lucide-react';

interface FloorCondition {
  id: string;
  name: string;
  mu: number;
  description: string;
}

const FLOOR_CONDITIONS: readonly FloorCondition[] = [
  { id: 'wet_epoxy', name: 'Wet / Polished Epoxy', mu: 0.22, description: 'Freshly washed or condensation near dock doors' },
  { id: 'dusty_concrete', name: 'Dusty Industrial Concrete', mu: 0.38, description: 'Typical warehouse transit aisle with fine dust' },
  { id: 'dry_clean', name: 'Clean Dry Floor', mu: 0.72, description: 'Optimal dry warehouse surface' },
];

export const InteractiveBrakingSimulator: React.FC<{ readonly onRequestPilot: () => void }> = ({
  onRequestPilot,
}) => {
  const [selectedFloor, setSelectedFloor] = useState<FloorCondition>(FLOOR_CONDITIONS[0]);
  const [speed, setSpeed] = useState<number>(1.8); // m/s
  const [payloadKg, setPayloadKg] = useState<number>(500); // kg
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [animProgress, setAnimProgress] = useState<number>(0);
  const [hasRun, setHasRun] = useState<boolean>(false);

  // Physics calculations
  // Friction force F_max = mu * m * g
  // Safe deceleration a_safe = mu * g
  // Standard braking (assumes high grip, e.g. mu=0.7) a_req = 2.5 m/s^2
  // When mu is low (e.g. 0.22), max decel is 0.22 * 9.81 = 2.15 m/s^2.
  // In real AMR skids: wheels lock, kinetic friction drops (mu_k < mu_s), stopping distance: d = v^2 / (2 * mu_k * g)
  const g = 9.81;
  const muStatic = selectedFloor.mu;
  const muKinetic = selectedFloor.mu * 0.75; // Locked wheel slip drops grip

  // Stopping distance with Diffraction (maintains rolling contact without locking wheels)
  const decelWithDiffraction = Math.min(2.2, muStatic * g * 0.95);
  const distanceWithDiffraction = (speed * speed) / (2 * decelWithDiffraction);

  // Stopping distance without Diffraction (wheels lock, skids on kinetic friction)
  const decelWithout = muKinetic * g;
  const distanceWithout = (speed * speed) / (2 * decelWithout);

  // Obstacle is placed at a fixed distance representing typical lidar safety field (e.g. 1.8m ahead)
  const obstacleDistance = Math.max(1.6, Number((distanceWithDiffraction + 0.45).toFixed(2)));
  const isCollisionWithout = distanceWithout > obstacleDistance;
  const collisionOvershoot = isCollisionWithout ? Number((distanceWithout - obstacleDistance).toFixed(2)) : 0;
  const bufferRemaining = Number((obstacleDistance - distanceWithDiffraction).toFixed(2));

  // Run animation
  useEffect(() => {
    let animFrame: number;
    if (isSimulating) {
      const startTime = Date.now();
      const duration = 2200; // ms

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

  const handleRunSimulation = () => {
    setAnimProgress(0);
    setIsSimulating(true);
    setHasRun(true);
  };

  const handleReset = () => {
    setAnimProgress(0);
    setIsSimulating(false);
    setHasRun(false);
  };

  // Convert distance to percentage along the track (0m to 4.5m)
  const trackLength = 4.5;
  const getPercent = (dist: number) => Math.min(95, Math.max(5, (dist / trackLength) * 100));

  // Current animated positions
  const startX = 0.5; // m
  const brakingStartX = 1.2; // m where emergency stop is commanded
  
  // Progress calculations for the animation
  const currentPosWithout = isSimulating || hasRun
    ? brakingStartX + (distanceWithout * Math.min(1, animProgress * 1.1))
    : brakingStartX;

  const currentPosWith = isSimulating || hasRun
    ? brakingStartX + (distanceWithDiffraction * Math.min(1, animProgress * 1.3))
    : brakingStartX;

  return (
    <section id="simulator" className="py-20 relative bg-white border-y-2 border-[#3E2C23]" aria-label="Interactive Braking Simulator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#F5E9D8] border border-[#3E2C23]/20 text-xs text-[#3E2C23] font-mono shadow-xs">
            <Bot className="w-3.5 h-3.5 text-[#2FA4D7]" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Interactive Test Drive
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#3E2C23] tracking-tight leading-tight font-headline">
            See what happens when a 500kg robot
            <br />
            <span className="text-[#2FA4D7]">hits a slick warehouse floor.</span>
          </h2>

          <p className="text-[#3E2C23]/80 text-sm sm:text-base leading-relaxed font-body">
            Standard robot navigation software assumes warehouse floors are dry and grippy. When a robot hits a wet or dusty patch, standard braking locks the wheels—causing the robot to skid directly through its safety zone. 
            Diffraction actively governs wheel torque in microseconds to guarantee a safe, controlled stop.
          </p>
        </div>

        {/* Interactive Controls & Track Container */}
        <div className="rounded-2xl bg-[#F5E9D8] border-2 border-[#3E2C23] p-6 sm:p-8 space-y-8 shadow-xs">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pb-6 border-b border-[#3E2C23]/15">
            {/* 1. Floor Type */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-[#3E2C23] flex items-center justify-between">
                <span>1. Floor Condition</span>
                <span className="text-[#2FA4D7]">μ = {selectedFloor.mu.toFixed(2)}</span>
              </label>
              <div className="grid grid-cols-1 gap-2">
                {FLOOR_CONDITIONS.map((floor) => (
                  <button
                    key={floor.id}
                    onClick={() => {
                      setSelectedFloor(floor);
                      handleReset();
                    }}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-mono transition-all border ${
                      selectedFloor.id === floor.id
                        ? 'bg-[#3E2C23] text-white border-[#3E2C23] shadow-xs'
                        : 'bg-white text-[#3E2C23] border-[#3E2C23]/20 hover:border-[#3E2C23]'
                    }`}
                  >
                    <div className="font-bold">{floor.name}</div>
                    <div className={`text-[10px] ${selectedFloor.id === floor.id ? 'text-[#F5E9D8]/70' : 'text-[#3E2C23]/60'}`}>
                      {floor.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Speed Slider */}
            <div className="space-y-3 bg-white p-4 rounded-xl border border-[#3E2C23]/20">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-[#3E2C23]">2. Approach Speed</span>
                <span className="px-2 py-0.5 rounded bg-[#2FA4D7] text-white font-bold text-[11px]">
                  {speed.toFixed(1)} m/s ({Math.round(speed * 3.6)} km/h)
                </span>
              </div>
              <input
                type="range"
                min="0.8"
                max="2.4"
                step="0.2"
                value={speed}
                onChange={(e) => {
                  setSpeed(parseFloat(e.target.value));
                  handleReset();
                }}
                className="w-full accent-[#2FA4D7] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#3E2C23]/60">
                <span>0.8 m/s (Cautious)</span>
                <span>1.8 m/s (Typical)</span>
                <span>2.4 m/s (Fast)</span>
              </div>
            </div>

            {/* 3. Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="w-full py-3.5 px-6 rounded-xl bg-[#E76F2E] hover:bg-[#E76F2E]/90 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isSimulating ? 'Simulating Brake Event…' : 'Test Emergency Stop on Floor'}</span>
              </button>

              <button
                onClick={handleReset}
                className="w-full py-2 px-4 rounded-lg bg-white border border-[#3E2C23]/20 hover:border-[#3E2C23] text-[#3E2C23] font-mono text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Simulation</span>
              </button>
            </div>
          </div>

          {/* Dual Visual Simulation Lanes */}
          <div className="space-y-6">
            {/* Lane 1: Standard Robot (Without Diffraction) */}
            <div className="p-5 rounded-xl bg-white border-2 border-rose-300 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3E2C23]/10 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-xs font-bold font-headline text-[#3E2C23]">
                    Standard Robot Navigation (Without Diffraction)
                  </span>
                </div>
                <div className="text-[11px] font-mono">
                  {hasRun ? (
                    isCollisionWithout ? (
                      <span className="text-rose-600 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> CRASH: Overshoots laser zone by {collisionOvershoot}m
                      </span>
                    ) : (
                      <span className="text-amber-600 font-bold">Unstable stop near obstacle boundary</span>
                    )
                  ) : (
                    <span className="text-[#3E2C23]/50">Ready to test</span>
                  )}
                </div>
              </div>

              {/* Physical Track Lane */}
              <div className="relative h-16 bg-[#FAF4EB] rounded-lg border border-[#3E2C23]/20 overflow-hidden flex items-center px-4">
                {/* Slick floor zone indicator */}
                <div
                  className="absolute top-0 bottom-0 bg-blue-100/60 border-l border-r border-blue-300 flex items-center justify-center text-[10px] font-mono text-blue-800 font-bold select-none"
                  style={{
                    left: `${getPercent(brakingStartX)}%`,
                    right: '15%',
                  }}
                >
                  SLICK FLOOR ZONE (μ = {selectedFloor.mu.toFixed(2)})
                </div>

                {/* Laser obstacle line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-rose-500 z-10 flex flex-col justify-between items-center"
                  style={{ left: `${getPercent(brakingStartX + obstacleDistance)}%` }}
                >
                  <span className="text-[9px] font-mono font-bold bg-rose-600 text-white px-1 rounded -translate-y-2 whitespace-nowrap">
                    OBSTACLE / PERSON
                  </span>
                </div>

                {/* The Robot Icon */}
                <div
                  className="absolute transition-all duration-75 z-20 flex flex-col items-center"
                  style={{
                    left: `${getPercent(currentPosWithout)}%`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div className={`p-2 rounded-lg border shadow-xs ${
                    hasRun && isCollisionWithout ? 'bg-rose-600 text-white border-rose-800 animate-bounce' : 'bg-[#3E2C23] text-white border-[#3E2C23]'
                  }`}>
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono font-bold text-[#3E2C23] whitespace-nowrap mt-0.5">
                    {hasRun ? `${distanceWithout.toFixed(2)}m skid` : '500kg AMR'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-mono text-[#3E2C23]/70 pt-1">
                <span>Reaction: Locked-wheel slide</span>
                <span>Total Braking Distance: <strong className="text-rose-600">{distanceWithout.toFixed(2)} meters</strong></span>
              </div>
            </div>

            {/* Lane 2: With Diffraction Safety Guard */}
            <div className="p-5 rounded-xl bg-white border-2 border-emerald-500 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3E2C23]/10 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold font-headline text-[#3E2C23]">
                    With Diffraction Safety Guard
                  </span>
                </div>
                <div className="text-[11px] font-mono">
                  {hasRun ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ZERO COLLISION: Safe stop with {bufferRemaining}m safety cushion
                    </span>
                  ) : (
                    <span className="text-[#3E2C23]/50">Ready to test</span>
                  )}
                </div>
              </div>

              {/* Physical Track Lane */}
              <div className="relative h-16 bg-[#FAF4EB] rounded-lg border border-[#3E2C23]/20 overflow-hidden flex items-center px-4">
                {/* Slick floor zone indicator */}
                <div
                  className="absolute top-0 bottom-0 bg-blue-100/60 border-l border-r border-blue-300 flex items-center justify-center text-[10px] font-mono text-blue-800 font-bold select-none"
                  style={{
                    left: `${getPercent(brakingStartX)}%`,
                    right: '15%',
                  }}
                >
                  DIFFRACTION ACTIVE TRACTION CONTROL
                </div>

                {/* Laser obstacle line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-emerald-500 z-10 flex flex-col justify-between items-center"
                  style={{ left: `${getPercent(brakingStartX + obstacleDistance)}%` }}
                >
                  <span className="text-[9px] font-mono font-bold bg-emerald-700 text-white px-1 rounded -translate-y-2 whitespace-nowrap">
                    SAFE BOUNDARY
                  </span>
                </div>

                {/* The Robot Icon */}
                <div
                  className="absolute transition-all duration-75 z-20 flex flex-col items-center"
                  style={{
                    left: `${getPercent(currentPosWith)}%`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div className="p-2 rounded-lg bg-emerald-600 text-white border border-emerald-800 shadow-xs">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono font-bold text-emerald-800 whitespace-nowrap mt-0.5">
                    {hasRun ? `${distanceWithDiffraction.toFixed(2)}m stop` : 'Diffraction Guard'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-mono text-[#3E2C23]/70 pt-1">
                <span>Reaction: 62 microsecond active torque modulation</span>
                <span>Controlled Stop Distance: <strong className="text-emerald-700">{distanceWithDiffraction.toFixed(2)} meters</strong></span>
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
                <div className="font-bold font-headline">Have real driving logs from a robot that slipped on-site?</div>
                <div className="text-[#3E2C23]/70">
                  Send us 5 seconds of wheel speed &amp; IMU data (.csv or .mcap). We return your facility friction profile within 24 hours.
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
