/**
 * Presentation Component: Multimodal Stream Inspector & NVIDIA Cosmos Transfer Pipeline
 * Demonstrates the 3-stage Physical AI generation and photorealism pipeline:
 * 1. Coarse Isaac Sim Simulation Frame (RTX camera sensor)
 * 2. ControlNet Conditioning Maps (Semantic Segmentation + Canny Edge Detection)
 * 3. NVIDIA Cosmos Transfer 2.5 Photorealistic Diffusion Output (Action-Invariant Sim2Real)
 *
 * Also includes Interactive ControlNet Spec Editor and 5-channel sensor inspection.
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
  Sparkles,
  Code2,
  Copy,
  Check,
  Zap,
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
  const [activeTab, setActiveTab] = useState<'pipeline' | 'sensors' | 'spec'>('pipeline');
  const [activeSensorChannel, setActiveSensorChannel] = useState<'all' | 'rgb' | 'depth' | 'seg' | 'lidar'>('all');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [frameIndex, setFrameIndex] = useState<number>(42);
  const [copiedSpec, setCopiedSpec] = useState<boolean>(false);
  const [sliderSplit, setSliderSplit] = useState<number>(50);

  // Cosmos ControlNet Spec State
  const [semanticWeight, setSemanticWeight] = useState<number>(1.0);
  const [edgeWeight, setEdgeWeight] = useState<number>(0.85);
  const [promptText, setPromptText] = useState<string>(
    'cinematic photorealistic automated warehouse, sodium high-bay lighting, specular reflections on epoxy floor, scuff marks, realistic dust particles'
  );

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
  const velocity = (1.2 + Math.sin(frameIndex * 0.1) * 0.4).toFixed(2);
  const jointTorque = (38.4 + Math.cos(frameIndex * 0.15) * 12.2).toFixed(1);
  const slipRatio = (frictionMu < 0.3 ? 14.8 + Math.sin(frameIndex * 0.2) * 4.2 : 2.1).toFixed(1);

  const robotX = 150 + Math.sin(frameIndex * 0.05) * 40;
  const robotY = 190 + Math.cos(frameIndex * 0.05) * 15;

  const cosmosSpecJson = JSON.stringify(
    {
      pipeline: 'nvidia/cosmos-transfer-2.5',
      task: 'sim2real_photorealism_augmentation',
      conditioning: {
        semantic_segmentation: {
          api: 'omni.syntheticdata.SemanticsAPI',
          weight: semanticWeight,
        },
        canny_edges: {
          weight: edgeWeight,
          thresholds: [100, 200],
        },
        action_invariance_lock: true,
      },
      prompt: promptText,
      negative_prompt: 'cartoon, 3d render, blurry, deformed geometry, phantom limbs',
      parameters: {
        guidance_scale: 7.5,
        inference_steps: 30,
        seed: 420881,
        source_fps: 60,
      },
    },
    null,
    2
  );

  const handleCopySpec = () => {
    navigator.clipboard.writeText(cosmosSpecJson);
    setCopiedSpec(true);
    setTimeout(() => setCopiedSpec(false), 2000);
  };

  return (
    <div className="bg-white border-2 border-[#3E2C23] rounded-xl shadow-xs overflow-hidden flex flex-col">
      {/* Top Header & Mode Switcher */}
      <div className="bg-[#3E2C23] text-[#F5E9D8] px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#3E2C23]">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-[#E76F2E] animate-pulse" />
          <span className="font-extrabold text-sm sm:text-base font-headline tracking-wide uppercase">
            NVIDIA Cosmos Transfer 2.5 Sim2Real Pipeline
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2FA4D7] text-white">
            Action-Invariant Photorealism
          </span>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-[#2A1D17] p-0.5 rounded-lg border border-[#F5E9D8]/20 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1 rounded font-bold transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'pipeline' ? 'bg-[#2FA4D7] text-white' : 'text-[#F5E9D8]/70 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E76F2E]" />
            <span>Cosmos 3-Stage Pipeline</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sensors')}
            className={`px-3 py-1 rounded font-bold transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'sensors' ? 'bg-[#2FA4D7] text-white' : 'text-[#F5E9D8]/70 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>5-Channel Sensor Matrix</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('spec')}
            className={`px-3 py-1 rounded font-bold transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'spec' ? 'bg-[#2FA4D7] text-white' : 'text-[#F5E9D8]/70 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>ControlNet Spec Editor</span>
          </button>
        </div>
      </div>

      {/* Main Display Area */}
      <div className="p-4 bg-[#F5E9D8]/40 space-y-4">
        {/* MODE 1: THE COSMOS TRANSFER 3-STAGE PIPELINE */}
        {activeTab === 'pipeline' && (
          <div className="space-y-4">
            {/* Visual Process Architecture Banner */}
            <div className="p-3 bg-white rounded-lg border border-[#3E2C23]/20 flex flex-wrap items-center justify-between text-xs font-mono text-[#3E2C23] gap-2">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-[#E76F2E]">PIPELINE ARCHITECTURE:</span>
                <span>Isaac Sim Physics → ControlNet Geometry Lock → NVIDIA Cosmos 2.5 Diffusion</span>
              </div>
              <div className="flex items-center space-x-3 text-[11px]">
                <span className="text-[#3E2C23]/70">Kinematic Drift:</span>
                <span className="font-bold text-emerald-700">0.000 mm (100% Invariant)</span>
              </div>
            </div>

            {/* 3-Stage Pipeline Visual Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* STAGE 1: COARSE SIMULATION RENDER */}
              <div className="bg-[#3E2C23] rounded-lg border-2 border-[#3E2C23] overflow-hidden flex flex-col">
                <div className="bg-[#3E2C23] px-3 py-2 flex items-center justify-between text-white text-xs font-bold border-b border-white/10">
                  <span className="flex items-center gap-1.5 font-headline">
                    <span className="w-5 h-5 rounded-full bg-[#2FA4D7] text-white flex items-center justify-center text-[10px]">1</span>
                    Coarse Isaac Sim Render
                  </span>
                  <span className="text-[10px] text-[#F5E9D8]/60 font-mono">RTX Sensor</span>
                </div>
                <div className="relative aspect-4/3 bg-[#2A1D17] flex items-center justify-center overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 400 300">
                    <rect width="400" height="300" fill="#2A1E18" />
                    {/* Floor grid */}
                    <polygon points="0,180 400,180 400,300 0,300" fill="#38251C" />
                    <line x1="80" y1="180" x2="0" y2="300" stroke="#F5E9D8" strokeWidth="1" strokeOpacity="0.2" />
                    <line x1="200" y1="180" x2="200" y2="300" stroke="#F5E9D8" strokeWidth="1" strokeOpacity="0.2" />
                    <line x1="320" y1="180" x2="400" y2="300" stroke="#F5E9D8" strokeWidth="1" strokeOpacity="0.2" />
                    {/* Warehouse Rack */}
                    <rect x="30" y="40" width="100" height="140" fill="#2FA4D7" fillOpacity="0.2" stroke="#2FA4D7" strokeWidth="1.5" />
                    <line x1="30" y1="90" x2="130" y2="90" stroke="#2FA4D7" strokeWidth="1.5" />
                    <line x1="30" y1="140" x2="130" y2="140" stroke="#2FA4D7" strokeWidth="1.5" />
                    {/* Robot Chassis */}
                    <rect x={robotX} y={robotY} width="90" height="60" rx="6" fill="#2FA4D7" stroke="#F5E9D8" strokeWidth="2" />
                    <circle cx={robotX + 20} cy={robotY + 58} r="8" fill="#1A120E" />
                    <circle cx={robotX + 70} cy={robotY + 58} r="8" fill="#1A120E" />
                    {/* Coarse Sim Label */}
                    <rect x={robotX - 4} y={robotY - 4} width="98" height="68" fill="none" stroke="#E76F2E" strokeWidth="1" strokeDasharray="3 3" />
                  </svg>
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono text-[#F5E9D8]">
                    Input Simulation Frame
                  </div>
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-[#3E2C23]/90 text-[10px] font-mono text-white">
                    Lighting: {lightingLux} Lux
                  </div>
                </div>
                <div className="p-2.5 bg-white text-[#3E2C23] text-[11px] font-mono border-t border-[#3E2C23]/10">
                  <strong className="text-[#3E2C23]">Isaac Sim Output:</strong> Accurate physics, rigid collisions, but synthetic appearance.
                </div>
              </div>

              {/* STAGE 2: CONTROLNET CONDITIONING MASKS */}
              <div className="bg-[#3E2C23] rounded-lg border-2 border-[#3E2C23] overflow-hidden flex flex-col">
                <div className="bg-[#3E2C23] px-3 py-2 flex items-center justify-between text-white text-xs font-bold border-b border-white/10">
                  <span className="flex items-center gap-1.5 font-headline">
                    <span className="w-5 h-5 rounded-full bg-[#E76F2E] text-white flex items-center justify-center text-[10px]">2</span>
                    ControlNet Conditioning Mask
                  </span>
                  <span className="text-[10px] text-[#F5E9D8]/60 font-mono">SemanticsAPI + Canny</span>
                </div>
                <div className="relative aspect-4/3 bg-black flex items-center justify-center overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 400 300">
                    {/* Background Wall */}
                    <rect width="400" height="180" fill="#1F1510" />
                    {/* Floor class */}
                    <polygon points="0,180 400,180 400,300 0,300" fill="#2FA4D7" fillOpacity="0.45" />
                    {/* Rack structure class */}
                    <rect x="30" y="40" width="100" height="140" fill="#E76F2E" fillOpacity="0.85" />
                    {/* Robot body class */}
                    <rect x={robotX} y={robotY} width="90" height="60" rx="6" fill="#2FA4D7" />
                    {/* High-frequency Canny Edge Overlays */}
                    <rect x={robotX} y={robotY} width="90" height="60" rx="6" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
                    <line x1="30" y1="40" x2="130" y2="40" stroke="#FFFFFF" strokeWidth="1" />
                    <line x1="30" y1="90" x2="130" y2="90" stroke="#FFFFFF" strokeWidth="1" />
                    <line x1="30" y1="140" x2="130" y2="140" stroke="#FFFFFF" strokeWidth="1" />
                    <line x1="0" y1="180" x2="400" y2="180" stroke="#FFFFFF" strokeWidth="1.5" />
                  </svg>
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono text-[#F5E9D8]">
                    ControlNet Conditioning Spec
                  </div>
                  <div className="absolute bottom-2 left-2 flex gap-1 text-[9px] font-mono text-white">
                    <span className="px-1 py-0.5 rounded bg-[#2FA4D7]">Robot Class</span>
                    <span className="px-1 py-0.5 rounded bg-[#E76F2E]">Rack Class</span>
                    <span className="px-1 py-0.5 rounded bg-white text-black font-bold">Canny Edges</span>
                  </div>
                </div>
                <div className="p-2.5 bg-white text-[#3E2C23] text-[11px] font-mono border-t border-[#3E2C23]/10">
                  <strong className="text-[#E76F2E]">Geometry Guard:</strong> Enforces pixel-perfect object bounds so robot action remains unchanged.
                </div>
              </div>

              {/* STAGE 3: NVIDIA COSMOS TRANSFER 2.5 OUTPUT */}
              <div className="bg-[#3E2C23] rounded-lg border-2 border-[#2FA4D7] overflow-hidden flex flex-col shadow-sm">
                <div className="bg-[#2FA4D7] px-3 py-2 flex items-center justify-between text-white text-xs font-bold">
                  <span className="flex items-center gap-1.5 font-headline">
                    <span className="w-5 h-5 rounded-full bg-white text-[#2FA4D7] flex items-center justify-center text-[10px]">3</span>
                    Cosmos Transfer 2.5 Photoreal
                  </span>
                  <span className="text-[10px] bg-[#3E2C23] text-white px-1.5 py-0.5 rounded font-mono">Diffusion Aug</span>
                </div>
                <div className="relative aspect-4/3 bg-[#1A120E] flex items-center justify-center overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 400 300">
                    {/* Photorealistic Lighting & Atmospheric Haze */}
                    <rect width="400" height="300" fill="#1C140E" />
                    {/* High-Bay Sodium Ambient Glow */}
                    <circle cx="330" cy="50" r="110" fill="#F5E9D8" fillOpacity="0.22" />
                    <line x1="330" y1="50" x2="250" y2="300" stroke="#F5E9D8" strokeWidth="40" strokeOpacity="0.08" />
                    {/* Polished Epoxy Floor with Specular Gloss & Reflections */}
                    <polygon points="0,175 400,175 400,300 0,300" fill="#261A14" />
                    {/* Subtle floor skid marks & scratches */}
                    <path d="M 60 240 Q 120 220 180 250" stroke="#120D0A" strokeWidth="2.5" fill="none" strokeOpacity="0.6" />
                    <path d="M 280 260 Q 320 270 380 255" stroke="#120D0A" strokeWidth="3" fill="none" strokeOpacity="0.5" />
                    {/* Photoreal Industrial Rack */}
                    <rect x="30" y="40" width="100" height="135" fill="#1F2A38" stroke="#3A4D63" strokeWidth="2" />
                    <line x1="30" y1="85" x2="130" y2="85" stroke="#3A4D63" strokeWidth="2" />
                    <line x1="30" y1="130" x2="130" y2="130" stroke="#3A4D63" strokeWidth="2" />
                    {/* Highly Detailed Robot with Metallic Highlights */}
                    {/* Specular Floor Reflection of Robot */}
                    <ellipse cx={robotX + 45} cy={robotY + 62} rx="48" ry="8" fill="#0D0907" fillOpacity="0.8" />
                    <rect x={robotX} y={robotY} width="90" height="60" rx="6" fill="#1A78A8" stroke="#71C7EE" strokeWidth="2" />
                    {/* Brushed metal body panel */}
                    <rect x={robotX + 8} y={robotY + 8} width="74" height="20" rx="3" fill="#2FA4D7" />
                    {/* Real tire hubs */}
                    <circle cx={robotX + 20} cy={robotY + 58} r="8" fill="#0B0806" stroke="#4A382D" strokeWidth="2" />
                    <circle cx={robotX + 70} cy={robotY + 58} r="8" fill="#0B0806" stroke="#4A382D" strokeWidth="2" />
                  </svg>
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#2FA4D7] text-[10px] font-mono text-white font-bold">
                    Photorealistic VLA Training Frame
                  </div>
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#F5E9D8]">
                    Cosmos 2.5 • Steps: 30
                  </div>
                </div>
                <div className="p-2.5 bg-white text-[#3E2C23] text-[11px] font-mono border-t border-[#3E2C23]/10">
                  <strong className="text-[#2FA4D7]">Cosmos Transfer:</strong> Photorealistic sensor noise, lighting bloom, and material textures for zero-shot real-world transfer.
                </div>
              </div>
            </div>

            {/* Interactive Split-Screen Comparison Slider */}
            <div className="bg-white p-4 rounded-xl border-2 border-[#3E2C23] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase font-headline tracking-wide text-[#3E2C23]">
                  Sim vs Cosmos Photorealism Comparison Slider
                </span>
                <span className="text-xs font-mono text-[#3E2C23]/70">
                  Slide to inspect visual fidelity vs geometric invariance: {sliderSplit}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderSplit}
                onChange={(e) => setSliderSplit(Number(e.target.value))}
                className="w-full h-2 bg-[#F5E9D8] rounded-lg appearance-none cursor-pointer accent-[#2FA4D7]"
              />
              <div className="flex justify-between text-[11px] font-mono text-[#3E2C23]/70">
                <span>← 100% Coarse Simulation (Physics Engine)</span>
                <span>100% Cosmos Transfer (Photoreal Diffusion) →</span>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: 5-CHANNEL SENSOR SUITE INSPECTION */}
        {activeTab === 'sensors' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-[#3E2C23]/20">
              <span className="text-xs font-bold font-headline text-[#3E2C23]">
                Multimodal Sensor Streams Recorded for LeRobot v2 / Open-X Dataset
              </span>
              <div className="flex gap-1 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setActiveSensorChannel('all')}
                  className={`px-2 py-0.5 rounded ${
                    activeSensorChannel === 'all' ? 'bg-[#2FA4D7] text-white font-bold' : 'text-[#3E2C23]/70 hover:bg-[#F5E9D8]'
                  }`}
                >
                  All Channels
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSensorChannel('rgb')}
                  className={`px-2 py-0.5 rounded ${
                    activeSensorChannel === 'rgb' ? 'bg-[#2FA4D7] text-white font-bold' : 'text-[#3E2C23]/70 hover:bg-[#F5E9D8]'
                  }`}
                >
                  RGB 1080p
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSensorChannel('depth')}
                  className={`px-2 py-0.5 rounded ${
                    activeSensorChannel === 'depth' ? 'bg-[#2FA4D7] text-white font-bold' : 'text-[#3E2C23]/70 hover:bg-[#F5E9D8]'
                  }`}
                >
                  16-Bit Depth
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSensorChannel('seg')}
                  className={`px-2 py-0.5 rounded ${
                    activeSensorChannel === 'seg' ? 'bg-[#2FA4D7] text-white font-bold' : 'text-[#3E2C23]/70 hover:bg-[#F5E9D8]'
                  }`}
                >
                  Semantic Mask
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSensorChannel('lidar')}
                  className={`px-2 py-0.5 rounded ${
                    activeSensorChannel === 'lidar' ? 'bg-[#2FA4D7] text-white font-bold' : 'text-[#3E2C23]/70 hover:bg-[#F5E9D8]'
                  }`}
                >
                  32-Beam LiDAR
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Channel 1: RGB */}
              <div className="bg-[#3E2C23] rounded-lg border border-[#3E2C23] overflow-hidden">
                <div className="bg-[#3E2C23] px-3 py-1.5 text-white text-xs font-bold border-b border-white/10 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#2FA4D7]" /> Primary Camera (RGB)
                  </span>
                  <span className="text-[10px] text-[#F5E9D8]/60 font-mono">1080p @ 60Hz</span>
                </div>
                <div className="relative aspect-4/3 bg-[#2A1D17]">
                  <svg className="w-full h-full" viewBox="0 0 400 300">
                    <rect width="400" height="300" fill="#2A1E18" />
                    <polygon points="0,180 400,180 400,300 0,300" fill="#38251C" />
                    <rect x="30" y="40" width="100" height="140" fill="#2FA4D7" fillOpacity="0.2" stroke="#2FA4D7" strokeWidth="1.5" />
                    <rect x={robotX} y={robotY} width="90" height="60" rx="6" fill="#2FA4D7" stroke="#F5E9D8" strokeWidth="2" />
                  </svg>
                  <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-[#3E2C23]/80 text-[10px] font-mono text-[#F5E9D8]">
                    E: {lightingLux} Lux
                  </div>
                </div>
              </div>

              {/* Channel 2: Depth */}
              <div className="bg-[#3E2C23] rounded-lg border border-[#3E2C23] overflow-hidden">
                <div className="bg-[#3E2C23] px-3 py-1.5 text-white text-xs font-bold border-b border-white/10 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#E76F2E]" /> 16-Bit Depth
                  </span>
                  <span className="text-[10px] text-[#F5E9D8]/60 font-mono">Z: 0.2m - 18m</span>
                </div>
                <div className="relative aspect-4/3 bg-black">
                  <svg className="w-full h-full" viewBox="0 0 400 300">
                    <rect width="400" height="300" fill="#111111" />
                    <polygon points="0,180 400,180 400,300 0,300" fill="#333333" />
                    <rect x="30" y="40" width="100" height="140" fill="#555555" />
                    <rect x={robotX} y={robotY} width="90" height="60" rx="6" fill="#E0E0E0" />
                  </svg>
                  <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#F5E9D8]">
                    Center: 2.34m
                  </div>
                </div>
              </div>

              {/* Channel 3: Semantic Seg */}
              <div className="bg-[#3E2C23] rounded-lg border border-[#3E2C23] overflow-hidden">
                <div className="bg-[#3E2C23] px-3 py-1.5 text-white text-xs font-bold border-b border-white/10 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#2FA4D7]" /> Semantic Seg
                  </span>
                  <span className="text-[10px] text-[#F5E9D8]/60 font-mono">12 Classes</span>
                </div>
                <div className="relative aspect-4/3 bg-[#3E2C23]">
                  <svg className="w-full h-full" viewBox="0 0 400 300">
                    <rect width="400" height="180" fill="#3E2C23" />
                    <rect x="0" y="180" width="400" height="120" fill="#2FA4D7" fillOpacity="0.4" />
                    <rect x="30" y="40" width="100" height="140" fill="#E76F2E" fillOpacity="0.8" />
                    <rect x={robotX} y={robotY} width="90" height="60" rx="6" fill="#2FA4D7" />
                  </svg>
                  <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#F5E9D8]">
                    SemanticsAPI
                  </div>
                </div>
              </div>

              {/* Channel 4: LiDAR */}
              <div className="bg-[#3E2C23] rounded-lg border border-[#3E2C23] overflow-hidden">
                <div className="bg-[#3E2C23] px-3 py-1.5 text-white text-xs font-bold border-b border-white/10 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-[#E76F2E]" /> 32-Beam 3D LiDAR
                  </span>
                  <span className="text-[10px] text-[#F5E9D8]/60 font-mono">20Hz / 57.6k pts</span>
                </div>
                <div className="relative aspect-4/3 bg-[#1A120E]">
                  <svg className="w-full h-full" viewBox="0 0 400 300">
                    <circle cx="200" cy="150" r="110" fill="none" stroke="#F5E9D8" strokeWidth="0.5" strokeOpacity="0.15" />
                    <circle cx="200" cy="150" r="70" fill="none" stroke="#F5E9D8" strokeWidth="0.5" strokeOpacity="0.15" />
                    <circle cx="200" cy="150" r="3" fill="#E76F2E" />
                    {Array.from({ length: 36 }).map((_, i) => {
                      const angle = (i / 36) * Math.PI * 2 + frameIndex * 0.05;
                      const dist = 50 + ((i * 19) % 60);
                      return (
                        <circle
                          key={i}
                          cx={200 + Math.cos(angle) * dist}
                          cy={150 + Math.sin(angle) * dist}
                          r="1.5"
                          fill="#2FA4D7"
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#F5E9D8]">
                    Ouster OS1
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: INTERACTIVE COSMOS CONTROLNET SPEC EDITOR */}
        {activeTab === 'spec' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Column: Spec Sliders & Tuning */}
            <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-[#3E2C23]/20 space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold font-headline text-[#3E2C23]">
                  NVIDIA Cosmos ControlNet Spec Parameters
                </h4>
                <p className="text-xs text-[#3E2C23]/70 font-body">
                  Tune the conditioning weight of simulation semantics versus diffusion imagination.
                </p>
              </div>

              <div className="space-y-3 font-mono text-xs text-[#3E2C23]">
                <div>
                  <div className="flex justify-between py-1">
                    <span>Semantic Segmentation Weight:</span>
                    <span className="font-bold text-[#2FA4D7]">{semanticWeight.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={semanticWeight}
                    onChange={(e) => setSemanticWeight(Number(e.target.value))}
                    className="w-full accent-[#2FA4D7]"
                  />
                  <span className="text-[10px] text-[#3E2C23]/60 block">Locks semantic classes (robot, obstacles, floor).</span>
                </div>

                <div>
                  <div className="flex justify-between py-1">
                    <span>Canny Edge Guidance Weight:</span>
                    <span className="font-bold text-[#E76F2E]">{edgeWeight.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.3"
                    max="1.2"
                    step="0.05"
                    value={edgeWeight}
                    onChange={(e) => setEdgeWeight(Number(e.target.value))}
                    className="w-full accent-[#E76F2E]"
                  />
                  <span className="text-[10px] text-[#3E2C23]/60 block">Locks structural boundaries & rigid-body outlines.</span>
                </div>

                <div>
                  <label className="block py-1 font-bold">Augmentation Prompt:</label>
                  <textarea
                    rows={3}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    className="w-full p-2 text-[11px] bg-[#F5E9D8]/50 border border-[#3E2C23]/30 rounded-lg focus:outline-none focus:border-[#2FA4D7]"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Real-Time Generated JSON Payload */}
            <div className="lg:col-span-7 bg-[#2A1D17] text-[#F5E9D8] p-4 rounded-xl border border-[#3E2C23] flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold font-mono text-[#F5E9D8]">
                  cosmos_transfer_spec.json (Auto-Generated)
                </span>
                <button
                  type="button"
                  onClick={handleCopySpec}
                  className="px-2.5 py-1 rounded bg-[#2FA4D7] text-white hover:bg-[#258ec0] text-[10px] font-mono font-bold flex items-center space-x-1 cursor-pointer"
                >
                  {copiedSpec ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSpec ? 'Copied' : 'Copy Spec JSON'}</span>
                </button>
              </div>

              <pre className="p-3 text-[11px] font-mono overflow-x-auto text-[#2FA4D7] bg-[#1A120E] rounded-lg border border-white/5 my-2">
                <code>{cosmosSpecJson}</code>
              </pre>

              <div className="text-[10px] font-mono text-[#F5E9D8]/60 flex items-center justify-between pt-1">
                <span>Certified for: NVIDIA Cosmos Transfer 1 &amp; 2.5</span>
                <span className="text-emerald-400">Action Invariance Verified</span>
              </div>
            </div>
          </div>
        )}

        {/* Global Bottom Playback & Telemetry Strip */}
        <div className="bg-[#3E2C23] text-white p-3 rounded-lg flex flex-wrap items-center justify-between gap-3 border border-[#3E2C23]">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-md bg-[#2FA4D7] hover:bg-[#258ec0] text-white transition-colors cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              type="button"
              onClick={() => setFrameIndex(0)}
              className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Reset Frame"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <div className="text-xs font-mono text-[#F5E9D8]">
              Frame <strong className="text-white">{frameIndex}</strong> / {totalFrames} ({simulatedTimeSec}s)
            </div>
          </div>

          {/* Telemetry Metric Readouts */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-[#F5E9D8]/60 text-[10px] block">LINEAR VELOCITY</span>
              <span className="text-white font-bold">{velocity} m/s</span>
            </div>
            <div>
              <span className="text-[#F5E9D8]/60 text-[10px] block">JOINT TORQUE</span>
              <span className="text-[#2FA4D7] font-bold">{jointTorque} N·m</span>
            </div>
            <div>
              <span className="text-[#F5E9D8]/60 text-[10px] block">WHEEL SLIP RATIO</span>
              <span className={`font-bold ${Number(slipRatio) > 10 ? 'text-[#E76F2E]' : 'text-emerald-400'}`}>
                {slipRatio}%
              </span>
            </div>
            <div>
              <span className="text-[#F5E9D8]/60 text-[10px] block">SIM2REAL DIST.</span>
              <span className="text-emerald-400 font-bold">W = 0.038</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
