/**
 * Presentation Component: Multimodal Stream Inspector
 * Displays 5 synchronized sensor channels generated from NVIDIA Isaac Sim / Isaac Lab:
 * 1. Photorealistic RTX Camera Feed with 3D Bounding Boxes
 * 2. 16-Bit Normalized Depth Map
 * 3. Ground Truth Semantic Segmentation Mask
 * 4. 32-Beam 3D LiDAR Point Cloud / Polar Raycast
 * 5. Synchronized Proprioception & Action Vectors (Joint Torques, Velocities)
 *
 * Strict Color Hunt 4-Color Palette: #2FA4D7, #F5E9D8, #3E2C23, #E76F2E (Zero Gradients).
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Camera,
  Layers,
  Eye,
  Radio,
  Activity,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Maximize2,
  Download,
} from 'lucide-react';

interface MultimodalStreamInspectorProps {
  readonly selectedEmbodimentId: string;
  readonly selectedEnvironmentId: string;
  readonly lightingLux: number;
  readonly frictionMu: number;
}

export const MultimodalStreamInspector: React.FC<MultimodalStreamInspectorProps> = ({
  selectedEmbodimentId,
  selectedEnvironmentId,
  lightingLux,
  frictionMu,
}) => {
  const [activeChannel, setActiveChannel] = useState<'all' | 'rgb' | 'depth' | 'seg' | 'lidar' | 'action'>('all');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [frameIndex, setFrameIndex] = useState<number>(42);
  const totalFrames = 120;

  // Real-time frame loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev >= totalFrames ? 0 : prev + 1));
    }, 80);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const progressPct = ((frameIndex / totalFrames) * 100).toFixed(1);
  const simulatedTimeSec = (frameIndex * 0.05).toFixed(2);

  // Simulated telemetry based on frameIndex
  const velocity = (1.2 + Math.sin(frameIndex * 0.1) * 0.4).toFixed(2);
  const jointTorque = (38.4 + Math.cos(frameIndex * 0.15) * 12.2).toFixed(1);
  const slipRatio = (frictionMu < 0.3 ? 14.8 + Math.sin(frameIndex * 0.2) * 4.2 : 2.1).toFixed(1);

  return (
    <div className="bg-white border-2 border-[#3E2C23] rounded-xl shadow-xs overflow-hidden flex flex-col">
      {/* Top Header & Channel Switcher */}
      <div className="bg-[#3E2C23] text-[#F5E9D8] px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#3E2C23]">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-[#E76F2E] animate-pulse" />
          <span className="font-extrabold text-sm sm:text-base font-headline tracking-wide uppercase">
            Isaac Sim Multimodal Stream Inspector
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2FA4D7] text-white">
            RTX Ray-Traced 60 FPS
          </span>
        </div>

        {/* Channel Segmented Buttons */}
        <div className="flex items-center bg-[#3E2C23]/60 p-0.5 rounded-lg border border-[#F5E9D8]/20 text-xs">
          <button
            type="button"
            onClick={() => setActiveChannel('all')}
            className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
              activeChannel === 'all' ? 'bg-[#2FA4D7] text-white' : 'text-[#F5E9D8]/70 hover:text-white'
            }`}
          >
            All Channels (5)
          </button>
          <button
            type="button"
            onClick={() => setActiveChannel('rgb')}
            className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
              activeChannel === 'rgb' ? 'bg-[#2FA4D7] text-white' : 'text-[#F5E9D8]/70 hover:text-white'
            }`}
          >
            RGB Photoreal
          </button>
          <button
            type="button"
            onClick={() => setActiveChannel('depth')}
            className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
              activeChannel === 'depth' ? 'bg-[#2FA4D7] text-white' : 'text-[#F5E9D8]/70 hover:text-white'
            }`}
          >
            16-Bit Depth
          </button>
          <button
            type="button"
            onClick={() => setActiveChannel('seg')}
            className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
              activeChannel === 'seg' ? 'bg-[#2FA4D7] text-white' : 'text-[#F5E9D8]/70 hover:text-white'
            }`}
          >
            Semantic Seg
          </button>
          <button
            type="button"
            onClick={() => setActiveChannel('lidar')}
            className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
              activeChannel === 'lidar' ? 'bg-[#2FA4D7] text-white' : 'text-[#F5E9D8]/70 hover:text-white'
            }`}
          >
            3D LiDAR
          </button>
        </div>
      </div>

      {/* Main Viewport Matrix */}
      <div className="p-4 bg-[#F5E9D8]/40">
        {activeChannel === 'all' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Channel 1: RGB */}
            <div className="bg-[#3E2C23] rounded-lg border-2 border-[#3E2C23] overflow-hidden flex flex-col">
              <div className="bg-[#3E2C23] px-3 py-1.5 flex items-center justify-between text-white text-xs font-bold border-b border-white/10">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#2FA4D7]" /> Primary Camera (RGB)
                </span>
                <span className="text-[10px] text-[#F5E9D8]/60 font-mono">1080p @ 60Hz</span>
              </div>
              <div className="relative aspect-4/3 bg-[#3E2C23] flex items-center justify-center overflow-hidden">
                {/* Simulated Photorealistic Warehouse View with dynamic lighting */}
                <svg className="w-full h-full" viewBox="0 0 400 300">
                  {/* Background Warehouse Racks */}
                  <rect width="400" height="300" fill="#2A1E18" />
                  {/* Floor with perspective */}
                  <polygon points="0,180 400,180 400,300 0,300" fill="#3E2C23" />
                  <line x1="80" y1="180" x2="0" y2="300" stroke="#F5E9D8" strokeWidth="1" strokeOpacity="0.2" />
                  <line x1="200" y1="180" x2="200" y2="300" stroke="#F5E9D8" strokeWidth="1" strokeOpacity="0.2" />
                  <line x1="320" y1="180" x2="400" y2="300" stroke="#F5E9D8" strokeWidth="1" strokeOpacity="0.2" />
                  
                  {/* Warehouse Pallet Rack */}
                  <rect x="30" y="40" width="100" height="140" fill="#2FA4D7" fillOpacity="0.15" stroke="#2FA4D7" strokeWidth="2" />
                  <line x1="30" y1="90" x2="130" y2="90" stroke="#2FA4D7" strokeWidth="2" />
                  <line x1="30" y1="140" x2="130" y2="140" stroke="#2FA4D7" strokeWidth="2" />
                  
                  {/* Robot Model */}
                  <rect
                    x={150 + Math.sin(frameIndex * 0.05) * 40}
                    y={190 + Math.cos(frameIndex * 0.05) * 15}
                    width="90"
                    height="60"
                    rx="6"
                    fill="#2FA4D7"
                    stroke="#F5E9D8"
                    strokeWidth="2"
                  />
                  {/* 3D Bounding Box overlay */}
                  <rect
                    x={145 + Math.sin(frameIndex * 0.05) * 40}
                    y={185 + Math.cos(frameIndex * 0.05) * 15}
                    width="100"
                    height="70"
                    fill="none"
                    stroke="#E76F2E"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  <text
                    x={148 + Math.sin(frameIndex * 0.05) * 40}
                    y={180 + Math.cos(frameIndex * 0.05) * 15}
                    fill="#E76F2E"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    Robot [99.4%]
                  </text>
                  
                  {/* Sunlight / Light Flare effect based on lightingLux */}
                  <circle cx="340" cy="50" r={Math.min(50, lightingLux / 1200)} fill="#F5E9D8" fillOpacity="0.3" />
                </svg>

                <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-[#3E2C23]/80 text-[10px] font-mono text-[#F5E9D8]">
                  E: {lightingLux} Lux
                </div>
              </div>
            </div>

            {/* Channel 2: 16-Bit Depth */}
            <div className="bg-[#3E2C23] rounded-lg border-2 border-[#3E2C23] overflow-hidden flex flex-col">
              <div className="bg-[#3E2C23] px-3 py-1.5 flex items-center justify-between text-white text-xs font-bold border-b border-white/10">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#E76F2E]" /> 16-Bit Normalized Depth
                </span>
                <span className="text-[10px] text-[#F5E9D8]/60 font-mono">Z-Range: 0.2m - 18m</span>
              </div>
              <div className="relative aspect-4/3 bg-black flex items-center justify-center overflow-hidden">
                {/* Simulated Normalized Depth Map (Greyscale gradient) */}
                <svg className="w-full h-full" viewBox="0 0 400 300">
                  <rect width="400" height="300" fill="#111111" />
                  <polygon points="0,180 400,180 400,300 0,300" fill="#333333" />
                  {/* Distant rack (darker gray) */}
                  <rect x="30" y="40" width="100" height="140" fill="#555555" />
                  {/* Foreground Robot (bright white for near distance) */}
                  <rect
                    x={150 + Math.sin(frameIndex * 0.05) * 40}
                    y={190 + Math.cos(frameIndex * 0.05) * 15}
                    width="90"
                    height="60"
                    rx="6"
                    fill="#E0E0E0"
                  />
                </svg>
                <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#F5E9D8]">
                  Center Depth: 2.34m
                </div>
              </div>
            </div>

            {/* Channel 3: Semantic Segmentation */}
            <div className="bg-[#3E2C23] rounded-lg border-2 border-[#3E2C23] overflow-hidden flex flex-col">
              <div className="bg-[#3E2C23] px-3 py-1.5 flex items-center justify-between text-white text-xs font-bold border-b border-white/10">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#2FA4D7]" /> Pixel Semantic Mask
                </span>
                <span className="text-[10px] text-[#F5E9D8]/60 font-mono">12 Classes</span>
              </div>
              <div className="relative aspect-4/3 bg-[#3E2C23] flex items-center justify-center overflow-hidden">
                {/* Color-coded Semantic Segmentation */}
                <svg className="w-full h-full" viewBox="0 0 400 300">
                  {/* Background / Wall */}
                  <rect width="400" height="180" fill="#3E2C23" />
                  {/* Floor (Class 1) */}
                  <rect x="0" y="180" width="400" height="120" fill="#2FA4D7" fillOpacity="0.4" />
                  {/* Rack / Structure (Class 4) */}
                  <rect x="30" y="40" width="100" height="140" fill="#E76F2E" fillOpacity="0.8" />
                  {/* Robot Body (Class 7) */}
                  <rect
                    x={150 + Math.sin(frameIndex * 0.05) * 40}
                    y={190 + Math.cos(frameIndex * 0.05) * 15}
                    width="90"
                    height="60"
                    rx="6"
                    fill="#2FA4D7"
                  />
                  {/* Hazard / Spill Region (Class 9) */}
                  <ellipse cx="280" cy="240" rx="45" ry="18" fill="#DC2626" fillOpacity="0.7" />
                </svg>
                <div className="absolute bottom-2 left-2 flex gap-1 text-[9px] font-mono text-white">
                  <span className="px-1 py-0.5 rounded bg-[#2FA4D7]">Robot</span>
                  <span className="px-1 py-0.5 rounded bg-[#E76F2E]">Rack</span>
                  <span className="px-1 py-0.5 rounded bg-[#DC2626]">Spill</span>
                </div>
              </div>
            </div>

            {/* Channel 4: 3D LiDAR Pointcloud */}
            <div className="bg-[#3E2C23] rounded-lg border-2 border-[#3E2C23] overflow-hidden flex flex-col">
              <div className="bg-[#3E2C23] px-3 py-1.5 flex items-center justify-between text-white text-xs font-bold border-b border-white/10">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-[#E76F2E]" /> 32-Beam 3D LiDAR Scan
                </span>
                <span className="text-[10px] text-[#F5E9D8]/60 font-mono">20Hz / 57.6k pts</span>
              </div>
              <div className="relative aspect-4/3 bg-[#1A120E] flex items-center justify-center overflow-hidden">
                {/* Simulated Polar LiDAR scan returns */}
                <svg className="w-full h-full" viewBox="0 0 400 300">
                  <circle cx="200" cy="150" r="120" fill="none" stroke="#F5E9D8" strokeWidth="0.5" strokeOpacity="0.15" />
                  <circle cx="200" cy="150" r="80" fill="none" stroke="#F5E9D8" strokeWidth="0.5" strokeOpacity="0.15" />
                  <circle cx="200" cy="150" r="40" fill="none" stroke="#F5E9D8" strokeWidth="0.5" strokeOpacity="0.15" />
                  <line x1="200" y1="30" x2="200" y2="270" stroke="#F5E9D8" strokeWidth="0.5" strokeOpacity="0.1" />
                  <line x1="80" y1="150" x2="320" y2="150" stroke="#F5E9D8" strokeWidth="0.5" strokeOpacity="0.1" />
                  
                  {/* Sensor center */}
                  <circle cx="200" cy="150" r="3" fill="#E76F2E" />

                  {/* Radial point returns */}
                  {Array.from({ length: 48 }).map((_, i) => {
                    const angle = (i / 48) * Math.PI * 2 + (frameIndex * 0.05);
                    const dist = 60 + ((i * 17) % 55);
                    const px = 200 + Math.cos(angle) * dist;
                    const py = 150 + Math.sin(angle) * dist;
                    return (
                      <circle
                        key={i}
                        cx={px}
                        cy={py}
                        r="1.5"
                        fill={i % 3 === 0 ? '#2FA4D7' : '#E76F2E'}
                      />
                    );
                  })}
                </svg>
                <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#F5E9D8]">
                  Beam Drop Rate: 0.12%
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Single Channel Zoom View */
          <div className="bg-[#3E2C23] rounded-lg border-2 border-[#3E2C23] p-4 text-white min-h-[360px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm uppercase text-[#2FA4D7] font-mono">
                  Channel Inspector: {activeChannel.toUpperCase()}
                </span>
                <span className="text-xs text-[#F5E9D8]/70">
                  Embodiment: {selectedEmbodimentId} | Environment: {selectedEnvironmentId}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveChannel('all')}
                className="text-xs font-bold text-[#E76F2E] hover:underline cursor-pointer"
              >
                ← Return to Grid View
              </button>
            </div>

            <div className="my-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#2FA4D7]/20 flex items-center justify-center mb-4">
                <Eye className="w-8 h-8 text-[#2FA4D7]" />
              </div>
              <h4 className="text-lg font-bold font-headline mb-2 text-[#F5E9D8]">
                Focused Stream: {activeChannel.toUpperCase()}
              </h4>
              <p className="text-sm text-[#F5E9D8]/70 max-w-lg">
                Full-resolution RTX stream telemetry. Sim2Real transfer covariance is calibrated against physical sensor benchmarks at {progressPct}% trajectory completion.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 p-3 rounded-lg text-xs font-mono">
              <div>
                <span className="text-[#F5E9D8]/50 block">Throughput</span>
                <span className="text-white font-bold">60.0 FPS</span>
              </div>
              <div>
                <span className="text-[#F5E9D8]/50 block">Illuminance</span>
                <span className="text-white font-bold">{lightingLux} Lux</span>
              </div>
              <div>
                <span className="text-[#F5E9D8]/50 block">Surface Friction</span>
                <span className="text-white font-bold">μ = {frictionMu}</span>
              </div>
              <div>
                <span className="text-[#F5E9D8]/50 block">Latency Jitter</span>
                <span className="text-white font-bold">18.4 ms</span>
              </div>
            </div>
          </div>
        )}

        {/* Channel 5: Synchronized Proprioception & Action HUD Strip */}
        <div className="mt-4 bg-[#3E2C23] text-white rounded-lg p-3 border-2 border-[#3E2C23] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className="p-2 rounded-lg bg-[#2FA4D7] text-white hover:bg-[#2FA4D7]/90 transition-colors cursor-pointer"
              aria-label={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setFrameIndex(0)}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Restart Episode"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <div className="text-xs font-mono">
              <span className="text-[#F5E9D8]/60">EPISODE FRAME:</span>{' '}
              <span className="font-bold text-[#F5E9D8]">{frameIndex} / {totalFrames}</span>
              <span className="mx-2 text-[#F5E9D8]/30">|</span>
              <span className="text-[#F5E9D8]/60">SIM T:</span>{' '}
              <span className="font-bold text-[#2FA4D7]">{simulatedTimeSec}s</span>
            </div>
          </div>

          {/* Synchronized Telemetry Chips */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="bg-white/10 px-2.5 py-1 rounded">
              <span className="text-[#F5E9D8]/60">Velocity:</span>{' '}
              <span className="font-bold text-white">{velocity} m/s</span>
            </div>
            <div className="bg-white/10 px-2.5 py-1 rounded">
              <span className="text-[#F5E9D8]/60">Peak Torque:</span>{' '}
              <span className="font-bold text-white">{jointTorque} N·m</span>
            </div>
            <div className="bg-white/10 px-2.5 py-1 rounded">
              <span className="text-[#F5E9D8]/60">Slip Ratio:</span>{' '}
              <span className={`font-bold ${parseFloat(slipRatio) > 10 ? 'text-[#E76F2E]' : 'text-emerald-400'}`}>
                {slipRatio}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
