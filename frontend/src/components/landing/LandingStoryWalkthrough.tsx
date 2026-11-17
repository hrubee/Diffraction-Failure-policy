/**
 * Presentation & Interactive Component: How Diffraction Works
 * Provides a clear visual idea of:
 * 1. Architecture: Where Diffraction sits between existing Nav2 stack and motor inverters.
 * 2. Physical Safety Barrier: 2D animated top-down warehouse aisle simulation.
 * 3. 14-Day Deployment Roadmap: From 5s telemetry drop to plant signoff.
 *
 * Strict Color Hunt 4-Color Palette: #2FA4D7, #F5E9D8, #3E2C23, #E76F2E (Zero Gradients).
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Bot,
  Cpu,
  ArrowRight,
  Play,
  RotateCcw,
  Zap,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Activity,
  FileCheck,
} from 'lucide-react';

interface LandingStoryWalkthroughProps {
  readonly onLaunchConsole: () => void;
}

type ViewMode = 'architecture' | 'simulation' | 'workflow';

export const LandingStoryWalkthrough: React.FC<LandingStoryWalkthroughProps> = ({
  onLaunchConsole,
}) => {
  const [activeView, setActiveView] = useState<ViewMode>('architecture');
  const [isGuardEnabled, setIsGuardEnabled] = useState<boolean>(true);

  // Simulation state for top-down 2D warehouse aisle
  const [simRunning, setSimRunning] = useState<boolean>(false);
  const [robotX, setRobotX] = useState<number>(60);
  const [robotSpeed, setRobotSpeed] = useState<number>(1.8);
  const [simState, setSimState] = useState<'cruising' | 'braking' | 'safe_stop' | 'crashed'>('cruising');
  const animRef = useRef<number | null>(null);

  // Reset simulation
  const resetSimulation = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setSimRunning(false);
    setRobotX(60);
    setRobotSpeed(1.8);
    setSimState('cruising');
  };

  // Run top-down simulation loop
  useEffect(() => {
    if (!simRunning) return;

    let posX = robotX;
    let speed = 1.8;
    const wetPatchStart = 380;
    const obstacleX = 660;

    const tick = () => {
      // Robot encounters wet patch
      if (posX >= wetPatchStart) {
        if (isGuardEnabled) {
          // Diffraction CBF-QP actively clamps speed and stops safely
          setSimState('braking');
          speed = Math.max(0, speed - 0.055);
          posX += speed * 3.5;

          if (speed <= 0.02) {
            speed = 0;
            posX = Math.min(posX, obstacleX - 85);
            setRobotX(posX);
            setRobotSpeed(0);
            setSimState('safe_stop');
            setSimRunning(false);
            return;
          }
        } else {
          // Standard: locks wheels, slips on mu=0.22, crashes into obstacle
          setSimState('braking');
          // Slips with very low deceleration
          speed = Math.max(0.6, speed - 0.008);
          posX += speed * 3.5;

          if (posX >= obstacleX - 35) {
            posX = obstacleX - 35;
            setRobotX(posX);
            setRobotSpeed(0);
            setSimState('crashed');
            setSimRunning(false);
            return;
          }
        }
      } else {
        posX += speed * 3.5;
      }

      setRobotX(posX);
      setRobotSpeed(speed);
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [simRunning, isGuardEnabled]);

  return (
    <section id="how-it-works" className="py-20 relative bg-white border-y-2 border-[#3E2C23]" aria-label="How Diffraction Works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#F5E9D8] border border-[#3E2C23]/20 text-xs text-[#3E2C23] font-mono shadow-xs">
            <Zap className="w-3.5 h-3.5 text-[#2FA4D7]" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              System Architecture &amp; Signal Flow
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3E2C23] tracking-tight leading-tight font-headline">
            How Diffraction works inside your robot.
          </h2>

          <p className="text-[#3E2C23]/80 text-sm sm:text-base leading-relaxed font-body">
            A drop-in runtime safety governor for ROS 2 fleets. Intercepts navigation velocity commands in <strong>62 microseconds</strong> to enforce Lyapunov safety bounds before wheels ever slip.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setActiveView('architecture')}
            className={`p-4 rounded-xl text-left border-2 transition-all cursor-pointer flex items-center justify-between ${
              activeView === 'architecture'
                ? 'border-[#2FA4D7] bg-[#2FA4D7]/10 text-[#3E2C23]'
                : 'border-[#3E2C23]/20 bg-[#F5E9D8]/30 hover:border-[#3E2C23] text-[#3E2C23]/70'
            }`}
          >
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold text-[#2FA4D7] block uppercase">View 1</span>
              <span className="text-sm font-bold font-headline block">Signal Flow Architecture</span>
            </div>
            <Cpu className="w-5 h-5 text-[#2FA4D7]" />
          </button>

          <button
            type="button"
            onClick={() => setActiveView('simulation')}
            className={`p-4 rounded-xl text-left border-2 transition-all cursor-pointer flex items-center justify-between ${
              activeView === 'simulation'
                ? 'border-[#2FA4D7] bg-[#2FA4D7]/10 text-[#3E2C23]'
                : 'border-[#3E2C23]/20 bg-[#F5E9D8]/30 hover:border-[#3E2C23] text-[#3E2C23]/70'
            }`}
          >
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold text-[#2FA4D7] block uppercase">View 2</span>
              <span className="text-sm font-bold font-headline block">Physical Barrier Invariance</span>
            </div>
            <Activity className="w-5 h-5 text-emerald-600" />
          </button>

          <button
            type="button"
            onClick={() => setActiveView('workflow')}
            className={`p-4 rounded-xl text-left border-2 transition-all cursor-pointer flex items-center justify-between ${
              activeView === 'workflow'
                ? 'border-[#2FA4D7] bg-[#2FA4D7]/10 text-[#3E2C23]'
                : 'border-[#3E2C23]/20 bg-[#F5E9D8]/30 hover:border-[#3E2C23] text-[#3E2C23]/70'
            }`}
          >
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold text-[#2FA4D7] block uppercase">View 3</span>
              <span className="text-sm font-bold font-headline block">14-Day Deployment Lifecycle</span>
            </div>
            <FileCheck className="w-5 h-5 text-[#E76F2E]" />
          </button>
        </div>

        {/* VIEW 1: SOFTWARE ARCHITECTURE & SIGNAL FLOW */}
        {activeView === 'architecture' && (
          <div className="bg-[#F5E9D8]/40 border-2 border-[#3E2C23] rounded-2xl p-6 sm:p-8 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#3E2C23]/10 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#2FA4D7] tracking-wider uppercase">
                  Runtime Control Pipeline
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#3E2C23] font-headline mt-1">
                  Where Diffraction sits inside the robot compute stack
                </h3>
              </div>

              {/* Guard Toggle */}
              <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-[#3E2C23]/20">
                <span className="text-xs font-mono font-semibold text-[#3E2C23]">Diffraction Guard:</span>
                <button
                  type="button"
                  onClick={() => setIsGuardEnabled(!isGuardEnabled)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer ${
                    isGuardEnabled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {isGuardEnabled ? 'ACTIVE (ENFORCED)' : 'BYPASSED (OFF)'}
                </button>
              </div>
            </div>

            {/* Architecture Node Diagram */}
            <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
              
              {/* Node 1: Existing Navigation Stack */}
              <div className="lg:col-span-3 bg-white border-2 border-[#3E2C23] rounded-xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#3E2C23]/10 text-[#3E2C23]">
                    LAYER 1
                  </span>
                  <Bot className="w-4 h-4 text-[#3E2C23]/60" />
                </div>
                <div className="space-y-1">
                  <div className="font-extrabold text-sm text-[#3E2C23] font-headline">
                    Your Existing Navigation Stack
                  </div>
                  <div className="text-xs text-[#3E2C23]/70 font-body">
                    ROS 2 Nav2 / Autoware / Waypoint Planner
                  </div>
                </div>
                <div className="p-2.5 rounded bg-[#F5E9D8]/60 font-mono text-[11px] space-y-1 border border-[#3E2C23]/10">
                  <div className="text-[#3E2C23]/60">Topic: /cmd_vel</div>
                  <div className="font-bold text-[#3E2C23]">v_desired = 1.80 m/s</div>
                  <div className="text-[10px] text-amber-800">Unaware of low-friction floor</div>
                </div>
              </div>

              {/* Arrow 1 */}
              <div className="lg:col-span-1 flex flex-col items-center justify-center">
                <div className="hidden lg:flex items-center text-[#2FA4D7]">
                  <div className="w-8 h-0.5 bg-[#2FA4D7]"></div>
                  <ArrowRight className="w-5 h-5 -ml-1 text-[#2FA4D7]" />
                </div>
                <div className="lg:hidden flex justify-center text-[#2FA4D7] py-2">
                  <ArrowRight className="w-5 h-5 rotate-90 text-[#2FA4D7]" />
                </div>
                <span className="text-[9px] font-mono text-[#3E2C23]/60 mt-1">/cmd_vel</span>
              </div>

              {/* Node 2: Diffraction Runtime Safety Guard */}
              <div className={`lg:col-span-3 border-2 rounded-xl p-5 space-y-3 shadow-xs transition-all ${
                isGuardEnabled
                  ? 'bg-[#2FA4D7]/10 border-[#2FA4D7]'
                  : 'bg-red-50 border-red-400 border-dashed opacity-60'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded text-white ${
                    isGuardEnabled ? 'bg-[#2FA4D7]' : 'bg-red-600'
                  }`}>
                    {isGuardEnabled ? '62μs ACTIVE-SET QP' : 'BYPASSED'}
                  </span>
                  <Cpu className={`w-4 h-4 ${isGuardEnabled ? 'text-[#2FA4D7]' : 'text-red-500'}`} />
                </div>
                <div className="space-y-1">
                  <div className="font-extrabold text-sm text-[#3E2C23] font-headline">
                    Diffraction Safety Governor
                  </div>
                  <div className="text-xs text-[#3E2C23]/70 font-body">
                    {isGuardEnabled
                      ? 'Solves Control Barrier Function h(x) ≥ 0 at 500 Hz'
                      : 'Guard inactive — commands pass through unverified'}
                  </div>
                </div>
                <div className="p-2.5 rounded bg-white font-mono text-[11px] space-y-1 border border-[#3E2C23]/15">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-[#3E2C23]/60">Solve Time:</span>
                    <strong className="text-emerald-700">0.062 ms</strong>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-[#3E2C23]/60">Slip Feedback:</span>
                    <strong>500 Hz IMU / Encoders</strong>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-[#3E2C23]/60">Safety Invariant:</span>
                    <strong className={isGuardEnabled ? 'text-emerald-700' : 'text-red-600'}>
                      {isGuardEnabled ? 'h(x) ≥ +0.18m (SAFE)' : 'h(x) < 0 (UNSAFE)'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Arrow 2 */}
              <div className="lg:col-span-1 flex flex-col items-center justify-center">
                <div className="hidden lg:flex items-center text-emerald-600">
                  <div className="w-8 h-0.5 bg-emerald-600"></div>
                  <ArrowRight className="w-5 h-5 -ml-1 text-emerald-600" />
                </div>
                <div className="lg:hidden flex justify-center text-emerald-600 py-2">
                  <ArrowRight className="w-5 h-5 rotate-90 text-emerald-600" />
                </div>
                <span className="text-[9px] font-mono text-emerald-800 mt-1">/cmd_vel_safe</span>
              </div>

              {/* Node 3: Motor Controllers & Wheel Inverters */}
              <div className="lg:col-span-3 bg-white border-2 border-[#3E2C23] rounded-xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#3E2C23]/10 text-[#3E2C23]">
                    LAYER 3
                  </span>
                  <Sliders className="w-4 h-4 text-[#3E2C23]/60" />
                </div>
                <div className="space-y-1">
                  <div className="font-extrabold text-sm text-[#3E2C23] font-headline">
                    Motor Drive &amp; CAN-Bus Actuators
                  </div>
                  <div className="text-xs text-[#3E2C23]/70 font-body">
                    Wheel Inverters &amp; Safety Relays
                  </div>
                </div>
                <div className="p-2.5 rounded bg-[#F5E9D8]/60 font-mono text-[11px] space-y-1 border border-[#3E2C23]/10">
                  <div className="text-[#3E2C23]/60">Filtered Command:</div>
                  <div className="font-bold text-[#3E2C23]">
                    {isGuardEnabled ? 'v_safe = 1.12 m/s (Traction Locked)' : 'v_raw = 1.80 m/s (Wheel Skid)'}
                  </div>
                  <div className={`text-[10px] font-bold ${isGuardEnabled ? 'text-emerald-700' : 'text-red-600'}`}>
                    {isGuardEnabled ? 'Outcome: Zero Skidding • 100% Grip' : 'Outcome: Wheel Slip • Collision Risk'}
                  </div>
                </div>
              </div>

            </div>

            {/* Explanatory Technical Footer */}
            <div className="p-4 rounded-xl bg-white border border-[#3E2C23]/15 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#3E2C23]">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero code changes required in your path planner or navigation stack.</span>
              </div>
              <div className="flex items-center space-x-4 text-[11px] text-[#3E2C23]/70">
                <span>ROS 2 Humble / Iron / Jazzy</span>
                <span>•</span>
                <span>C++20 Zero-Allocation</span>
                <span>•</span>
                <span>ISO 3691-4:2023 Cl. 5.2</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: PHYSICAL SAFETY ENVELOPE (TOP-DOWN AISLE SIMULATION) */}
        {activeView === 'simulation' && (
          <div className="bg-[#F5E9D8]/40 border-2 border-[#3E2C23] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#3E2C23]/10 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#2FA4D7] tracking-wider uppercase">
                  Physical Safety Barrier Invariance
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#3E2C23] font-headline mt-1">
                  How the mathematical barrier stops AMR skids before impact
                </h3>
              </div>

              {/* Simulation Controls */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsGuardEnabled(!isGuardEnabled)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer ${
                    isGuardEnabled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {isGuardEnabled ? 'Diffraction: ON' : 'Diffraction: OFF'}
                </button>

                {!simRunning ? (
                  <button
                    type="button"
                    onClick={() => {
                      resetSimulation();
                      setSimRunning(true);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-[#2FA4D7] text-white text-xs font-bold font-mono flex items-center space-x-1.5 hover:bg-[#2FA4D7]/90 cursor-pointer shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Run Aisle Drive</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={resetSimulation}
                    className="px-4 py-1.5 rounded-lg bg-[#3E2C23] text-white text-xs font-bold font-mono flex items-center space-x-1.5 hover:bg-[#3E2C23]/90 cursor-pointer shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Top-Down 2D Warehouse Canvas / SVG */}
            <div className="relative w-full h-64 sm:h-72 bg-[#F5E9D8] rounded-xl border-2 border-[#3E2C23] overflow-hidden select-none">
              
              {/* Top Warehouse Storage Racks */}
              <div className="absolute top-0 left-0 right-0 h-12 bg-[#3E2C23] flex items-center px-4 justify-between border-b-2 border-amber-400">
                <span className="text-[10px] font-mono text-[#F5E9D8] tracking-widest uppercase">AISLE 04 • HIGH-BAY STORAGE RACKING (ZONE A)</span>
                <span className="text-[10px] font-mono text-amber-300">KEEP CLEAR</span>
              </div>

              {/* Bottom Warehouse Storage Racks */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#3E2C23] flex items-center px-4 justify-between border-t-2 border-amber-400">
                <span className="text-[10px] font-mono text-[#F5E9D8] tracking-widest uppercase">AISLE 04 • HIGH-BAY STORAGE RACKING (ZONE B)</span>
                <span className="text-[10px] font-mono text-amber-300">ISO 3691-4 BOUNDARY</span>
              </div>

              {/* Aisle Floor Markings */}
              <div className="absolute top-12 bottom-12 left-0 right-0 flex items-center justify-between px-6 pointer-events-none opacity-20">
                <div className="w-full border-b border-dashed border-[#3E2C23]"></div>
              </div>

              {/* Hazard Area: Wet Polished Epoxy Surface */}
              <div 
                className="absolute top-12 bottom-12 bg-[#2FA4D7]/20 border-l-2 border-r-2 border-[#2FA4D7] flex flex-col justify-between p-2"
                style={{ left: '380px', width: '260px' }}
              >
                <div className="flex items-center space-x-1 text-[10px] font-mono font-bold text-[#2FA4D7]">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>WET POLISHED FLOOR (μ = 0.22)</span>
                </div>
                <div className="text-[9px] font-mono text-[#3E2C23]/60">
                  Normal Nav2 assumes dry μ = 0.70
                </div>
              </div>

              {/* Static Obstacle / Worker Pallet Jack */}
              <div
                className="absolute top-16 bottom-16 w-8 bg-red-600 border-2 border-[#3E2C23] rounded flex flex-col items-center justify-center text-white"
                style={{ left: '660px' }}
              >
                <span className="text-[8px] font-mono font-bold -rotate-90 whitespace-nowrap">OBSTACLE</span>
              </div>

              {/* Moving Robot AMR Graphic */}
              <div
                className="absolute top-24 transition-transform will-change-transform"
                style={{
                  transform: `translateX(${robotX}px)`,
                  transition: simRunning ? 'none' : 'transform 0.2s ease-out',
                }}
              >
                {/* Robot Body */}
                <div className="relative w-16 h-20 bg-[#3E2C23] rounded-lg border-2 border-white shadow-md flex flex-col items-center justify-between p-1.5 text-white">
                  <div className="w-3 h-3 rounded-full bg-[#2FA4D7] border border-white animate-pulse"></div>
                  <div className="text-[8px] font-mono font-bold">AMR 500</div>
                  <div className="w-8 h-1 bg-amber-400 rounded-full"></div>

                  {/* Dynamic Control Barrier Envelope (Visible when Diffraction is ON) */}
                  {isGuardEnabled && (
                    <div
                      className="absolute left-full top-1/2 -translate-y-1/2 h-28 border-2 border-emerald-500 bg-emerald-500/20 rounded-r-full pointer-events-none transition-all flex items-center justify-end pr-2"
                      style={{
                        width: `${Math.max(30, robotSpeed * 45)}px`,
                      }}
                    >
                      <span className="text-[8px] font-mono font-bold text-emerald-800 -rotate-90">
                        h(x) ≥ 0
                      </span>
                    </div>
                  )}

                  {/* Slip Sparks / Warning if guard OFF and in wet zone */}
                  {!isGuardEnabled && robotX >= 380 && (
                    <div className="absolute -top-3 -right-3 px-1.5 py-0.5 rounded bg-red-600 text-white font-mono text-[8px] font-bold animate-bounce">
                      SLIP!
                    </div>
                  )}
                </div>
              </div>

              {/* Live HUD Telemetry Overlay */}
              <div className="absolute bottom-14 left-4 bg-[#3E2C23]/90 text-white px-3 py-1.5 rounded-lg font-mono text-[11px] space-x-3 flex items-center backdrop-blur-xs">
                <span>Speed: <strong>{robotSpeed.toFixed(2)} m/s</strong></span>
                <span>•</span>
                <span>Friction: <strong>{robotX >= 380 ? 'μ = 0.22' : 'μ = 0.72'}</strong></span>
                <span>•</span>
                <span>
                  Status:{' '}
                  {simState === 'cruising' && <strong className="text-[#2FA4D7]">Cruising Aisle</strong>}
                  {simState === 'braking' && (
                    <strong className={isGuardEnabled ? 'text-amber-400' : 'text-red-400'}>
                      {isGuardEnabled ? 'Active Torque Modulation' : 'Wheel Lockup Detected'}
                    </strong>
                  )}
                  {simState === 'safe_stop' && <strong className="text-emerald-400">Safe Stop (0.85m Clearance)</strong>}
                  {simState === 'crashed' && <strong className="text-red-400">Impact Crash (Boundary Breach)</strong>}
                </span>
              </div>

            </div>

            {/* Simulation Findings Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border-2 ${
                isGuardEnabled ? 'bg-white border-emerald-600' : 'bg-white/50 border-[#3E2C23]/20'
              }`}>
                <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs font-headline">
                  <ShieldCheck className="w-4 h-4" />
                  <span>WITH DIFFRACTION RUNTIME GUARD</span>
                </div>
                <p className="text-xs text-[#3E2C23]/80 font-body mt-1 leading-relaxed">
                  The QP solver enforces forward invariance. As soon as tire odometry decouples on wet epoxy (&mu; = 0.22), it modulates brake torque in 62 microseconds, stopping safely within certified ISO 3691-4 stopping distance.
                </p>
              </div>

              <div className={`p-4 rounded-xl border-2 ${
                !isGuardEnabled ? 'bg-white border-red-500' : 'bg-white/50 border-[#3E2C23]/20'
              }`}>
                <div className="flex items-center space-x-2 text-red-600 font-bold text-xs font-headline">
                  <ShieldAlert className="w-4 h-4" />
                  <span>WITHOUT GUARD (STANDARD NAV2)</span>
                </div>
                <p className="text-xs text-[#3E2C23]/80 font-body mt-1 leading-relaxed">
                  Nav2 assumes standard factory friction (&mu; = 0.70). Approaching the obstacle at 1.8 m/s, the wheels lock instantly, kinetic friction drops, and the robot skids 2.45 meters into the hazard.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 3: 14-DAY DEPLOYMENT LIFECYCLE */}
        {activeView === 'workflow' && (
          <div className="bg-[#F5E9D8]/40 border-2 border-[#3E2C23] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="border-b-2 border-[#3E2C23]/10 pb-4">
              <span className="text-xs font-mono font-bold text-[#2FA4D7] tracking-wider uppercase">
                Zero Engineer Travel • 14-Day SLA
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#3E2C23] font-headline mt-1">
                From 5-second customer log to certified plant rollout
              </h3>
            </div>

            {/* 3 Steps Visual Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Step 1 */}
              <div className="bg-white border-2 border-[#3E2C23] rounded-xl p-5 space-y-3 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#3E2C23] text-[#F5E9D8]">
                      DAYS 1 – 3
                    </span>
                    <Sliders className="w-4 h-4 text-[#2FA4D7]" />
                  </div>
                  <h4 className="font-extrabold text-sm text-[#3E2C23] font-headline">
                    1. 5-Second Telemetry Drop
                  </h4>
                  <p className="text-xs text-[#3E2C23]/75 leading-relaxed font-body">
                    Your local plant team runs one robot along typical transit aisles for 5 seconds. Drop the raw ROS 2 bag file (<code className="text-[#2FA4D7] font-mono">.mcap</code> or <code className="text-[#2FA4D7] font-mono">.csv</code>) into our secure portal.
                  </p>
                </div>
                <div className="p-2.5 rounded bg-[#F5E9D8]/60 text-[11px] font-mono text-[#3E2C23]/80 border border-[#3E2C23]/10">
                  Zero on-site engineers needed.
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white border-2 border-[#3E2C23] rounded-xl p-5 space-y-3 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#2FA4D7] text-white">
                      DAYS 4 – 7
                    </span>
                    <Layers className="w-4 h-4 text-[#2FA4D7]" />
                  </div>
                  <h4 className="font-extrabold text-sm text-[#3E2C23] font-headline">
                    2. Cloud Inverse Physics Calibration
                  </h4>
                  <p className="text-xs text-[#3E2C23]/75 leading-relaxed font-body">
                    Diffraction unrolls continuous Runge-Kutta 4 dynamics on GPU cloud instances to extract true floor friction ($\mu$), CAN latency ($\tau$), and center-of-mass bounds in 3 minutes.
                  </p>
                </div>
                <div className="p-2.5 rounded bg-[#F5E9D8]/60 text-[11px] font-mono text-[#3E2C23]/80 border border-[#3E2C23]/10">
                  Mines 7,200 edge failure scenarios.
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white border-2 border-[#3E2C23] rounded-xl p-5 space-y-3 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-600 text-white">
                      DAYS 8 – 14
                    </span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h4 className="font-extrabold text-sm text-[#3E2C23] font-headline">
                    3. Flash ROS 2 Guard &amp; Plant Signoff
                  </h4>
                  <p className="text-xs text-[#3E2C23]/75 leading-relaxed font-body">
                    Deploy the compiled C++ safety node directly to your robot fleet. Automatically download the ISO 3691-4 &amp; ANSI/RIA R15.08 safety dossier for insurance signoff.
                  </p>
                </div>
                <div className="p-2.5 rounded bg-[#F5E9D8]/60 text-[11px] font-mono text-emerald-800 font-bold border border-emerald-500/20">
                  Full money-back collision guarantee.
                </div>
              </div>

            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onLaunchConsole}
                className="px-6 py-3 rounded-xl bg-[#2FA4D7] hover:bg-[#2FA4D7]/90 text-white font-extrabold text-xs sm:text-sm tracking-wide flex items-center gap-2 cursor-pointer shadow-xs transition-transform active:scale-95 font-mono"
              >
                <span>Request 14-Day Pilot ($25k Fixed Fee)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
