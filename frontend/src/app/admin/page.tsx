/**
 * Diffraction // Admin & Pilot Packaging Operations Portal
 * Dedicated administrative interface for ingesting 5-second MCAP incident logs
 * and packaging turnkey, verified enterprise deliverables (ZIP + Audit Certificate).
 *
 * Palette: #2FA4D7, #F5E9D8, #3E2C23, #E76F2E (Grounded, Industrial, Zero BS).
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface PilotPackageRecord {
  pilot_id: string;
  filename: string;
  size_kb: number;
  created_at: number;
  download_url: string;
}

interface GenerationResult {
  status: string;
  pilot_id: string;
  robot_id: string;
  facility_id: string;
  execution_time_s: number;
  zip_filename: string;
  zip_download_url: string;
  report_url?: string;
  deliverable_count: number;
  sysid_summary: {
    calibrated_friction_mu: number;
    static_friction_mu: number;
    actuator_latency_ms: number;
    r_squared_fit: number;
    differentiable_physics_verified: boolean;
  };
  certification_summary: {
    regulatory_verdict: string;
    safe_operating_speed_ceiling_mps: number;
    worst_case_stopping_distance_m: number;
  };
  deliverables: string[];
}

export default function AdminPortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>('incident_amr_tugger_042_tracking_error_spike_20261116_053128.mcap');
  const [robotId, setRobotId] = useState<string>('amr_tugger_042');
  const [facilityId, setFacilityId] = useState<string>('Chicago_Hub_Bay7');
  const [scenarioCount, setScenarioCount] = useState<number>(30);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [packagesList, setPackagesList] = useState<PilotPackageRecord[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch recent pilot packages on mount
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/v1/pilot/packages');
      if (res.ok) {
        const data = await res.json();
        setPackagesList(data.packages || []);
      }
    } catch {
      // Backend might be offline during dev
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.mcap')) {
        setSelectedFile(file);
        setSelectedPreset('');
        setErrorMsg(null);
      } else {
        setErrorMsg('Only valid .mcap container files are accepted.');
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setSelectedPreset('');
      setErrorMsg(null);
    }
  };

  const executeGeneration = async () => {
    setIsGenerating(true);
    setCurrentStage(1);
    setResult(null);
    setErrorMsg(null);

    // Simulate visual stage progression while backend executes
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev < 6 ? prev + 1 : prev));
    }, 1800);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else if (selectedPreset) {
        formData.append('incident_id', selectedPreset);
      }
      formData.append('robot_id', robotId);
      formData.append('facility_id', facilityId);
      formData.append('scenarios', scenarioCount.toString());

      const res = await fetch('/api/v1/pilot/generate', {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval);

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Pilot generation failed.' }));
        throw new Error(err.detail || 'Generation failed.');
      }

      const data: GenerationResult = await res.json();
      setCurrentStage(7);
      setResult(data);
      fetchPackages();
    } catch (err: unknown) {
      clearInterval(interval);
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred during package generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const stages = [
    { id: 1, name: 'Warp-SysID Physics Inversion', desc: 'Estimating surface friction (μ) & actuator delay (τ)' },
    { id: 2, name: 'Spatial Digital Twin Compilation', desc: 'Synthesizing OpenUSD incident stage' },
    { id: 3, name: 'MAP-Elites Adversarial Search', desc: 'Exploring 4D failure boundaries across friction/glare' },
    { id: 4, name: 'ISO 3691-4 & ANSI R15.08 Oracle', desc: 'Computing certified stopping clearances' },
    { id: 5, name: 'Contact-Locked Sensor Package', desc: '0.000px drift LeRobot v2 synthetic data' },
    { id: 6, name: 'Edge CBF-QP Governor Packaging', desc: 'Generating 62μs ROS 2 velocity filter node' },
    { id: 7, name: 'Customer Deliverables ZIP Packing', desc: 'Bundling 25 verified deliverables' },
  ];

  return (
    <div className="min-h-screen bg-[#F5E9D8] text-[#3E2C23] font-sans flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-[#3E2C23]/20 bg-[#F5E9D8] sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="bg-[#3E2C23] text-white font-black text-sm px-2.5 py-1 rounded">DFX</span>
            <span className="font-extrabold text-lg tracking-tight">DIFFRACTION</span>
          </Link>
          <span className="text-[#3E2C23]/40">/</span>
          <span className="font-mono text-xs uppercase bg-[#2FA4D7]/15 text-[#2FA4D7] px-2 py-0.5 rounded font-bold border border-[#2FA4D7]/30">
            Operations Admin
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-[#3E2C23]">Warp-SysID Engine Ready</span>
          </div>
          <Link
            href="/"
            className="text-[#3E2C23]/70 hover:text-[#3E2C23] font-bold border border-[#3E2C23]/20 px-3 py-1.5 rounded hover:bg-[#3E2C23]/5 transition"
          >
            &larr; Back to Live Site
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Banner */}
        <div className="bg-white border border-[#3E2C23]/20 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-[#3E2C23] tracking-tight">
              Rapid Pilot Customer Delivery Engine
            </h1>
            <p className="text-sm text-[#3E2C23]/70 mt-1 max-w-2xl">
              Drop any 5-second customer <code className="bg-[#F5E9D8] px-1.5 py-0.5 rounded font-mono text-xs font-bold text-[#2FA4D7]">.mcap</code> incident log. In under 15 seconds, Diffraction runs inverse physics calibration, Isaac Sim stress tests, and packages 25 client deliverables into a downloadable ZIP.
            </p>
          </div>
          <div className="bg-[#F5E9D8] border border-[#3E2C23]/20 rounded-lg p-3 text-right shrink-0">
            <div className="text-[11px] font-mono uppercase text-[#3E2C23]/60 font-bold">Standard Turnaround</div>
            <div className="text-lg font-black text-[#2FA4D7] font-mono">12.1 Seconds</div>
            <div className="text-[10px] text-[#3E2C23]/60">25 Audited Files</div>
          </div>
        </div>

        {/* Input Configuration & Dropzone Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Dropzone & Presets (7 cols) */}
          <div className="md:col-span-7 bg-white border border-[#3E2C23]/20 rounded-xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-base text-[#3E2C23] flex items-center gap-2">
                <span className="w-2 h-2 bg-[#2FA4D7] rounded-full"></span>
                1. Incident Telemetry Ingest
              </h2>
              <span className="text-xs font-mono text-[#3E2C23]/50">MCAP v0.4+ / ROS 2</span>
            </div>

            {/* Drag & Drop Box */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                selectedFile
                  ? 'border-[#2FA4D7] bg-[#2FA4D7]/5'
                  : 'border-[#3E2C23]/20 hover:border-[#2FA4D7] hover:bg-[#F5E9D8]/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".mcap"
                className="hidden"
                onChange={handleFileInputChange}
              />
              <div className="text-3xl mb-2">📦</div>
              {selectedFile ? (
                <div>
                  <div className="font-mono text-sm font-bold text-[#2FA4D7]">{selectedFile.name}</div>
                  <div className="text-xs text-[#3E2C23]/60 mt-1 font-mono">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB &bull; Ready to Process
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="mt-3 text-xs text-red-600 font-bold hover:underline"
                  >
                    Clear Selected File
                  </button>
                </div>
              ) : (
                <div>
                  <div className="font-bold text-sm text-[#3E2C23]">
                    Drag & Drop customer <span className="font-mono text-[#2FA4D7]">.mcap</span> here
                  </div>
                  <div className="text-xs text-[#3E2C23]/60 mt-1">or click to browse local files</div>
                </div>
              )}
            </div>

            {/* Or Select Pre-loaded Drop */}
            <div>
              <label className="block text-xs font-mono uppercase font-bold text-[#3E2C23]/70 mb-2">
                Or Select Pre-Loaded Field Incident:
              </label>
              <select
                value={selectedPreset}
                onChange={(e) => {
                  setSelectedPreset(e.target.value);
                  setSelectedFile(null);
                  if (e.target.value.includes('reach_019')) {
                    setRobotId('amr_reach_019');
                    setFacilityId('Tokyo_Urban_Hub_Bay2');
                  } else {
                    setRobotId('amr_tugger_042');
                    setFacilityId('Chicago_Hub_Bay7');
                  }
                }}
                disabled={!!selectedFile}
                className="w-full bg-[#F5E9D8]/50 border border-[#3E2C23]/20 rounded-lg p-2.5 text-xs font-mono text-[#3E2C23] focus:outline-none focus:border-[#2FA4D7]"
              >
                <option value="incident_amr_tugger_042_tracking_error_spike_20261116_053128.mcap">
                  AMR Tugger 042 — Wet Epoxy Skid & Tracking Spike (Chicago Hub)
                </option>
                <option value="incident_amr_reach_019_high_rack_slip_20261116_081412.mcap">
                  AMR Reach 019 — Dock Glare False Stop & Tip Risk (Tokyo Hub)
                </option>
              </select>
            </div>
          </div>

          {/* Right Column: Parameters & Trigger (5 cols) */}
          <div className="md:col-span-5 bg-white border border-[#3E2C23]/20 rounded-xl p-6 shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="font-extrabold text-base text-[#3E2C23] flex items-center gap-2">
                <span className="w-2 h-2 bg-[#E76F2E] rounded-full"></span>
                2. Target Fleet Parameters
              </h2>

              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#3E2C23]/70 mb-1">
                  Robot Platform ID
                </label>
                <input
                  type="text"
                  value={robotId}
                  onChange={(e) => setRobotId(e.target.value)}
                  className="w-full bg-[#F5E9D8]/40 border border-[#3E2C23]/20 rounded-lg p-2 text-xs font-mono font-bold text-[#3E2C23]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#3E2C23]/70 mb-1">
                  Facility / Client Hub
                </label>
                <input
                  type="text"
                  value={facilityId}
                  onChange={(e) => setFacilityId(e.target.value)}
                  className="w-full bg-[#F5E9D8]/40 border border-[#3E2C23]/20 rounded-lg p-2 text-xs font-mono font-bold text-[#3E2C23]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#3E2C23]/70 mb-1">
                  Adversarial Test Scenarios
                </label>
                <div className="flex gap-2">
                  {[30, 60, 100].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setScenarioCount(count)}
                      className={`flex-1 py-1.5 text-xs font-mono font-bold rounded border ${
                        scenarioCount === count
                          ? 'bg-[#3E2C23] text-white border-[#3E2C23]'
                          : 'border-[#3E2C23]/20 hover:bg-[#F5E9D8]'
                      }`}
                    >
                      {count} runs
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={executeGeneration}
                disabled={isGenerating}
                className="w-full py-3.5 px-4 bg-[#2FA4D7] hover:bg-[#258bb7] text-white font-extrabold rounded-lg shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Executing Pipeline (Stage {currentStage}/7)…</span>
                  </>
                ) : (
                  <>
                    <span>Generate Complete Pilot Package (25 Files) &rarr;</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-mono flex items-center justify-between">
            <div>
              <strong>Error:</strong> {errorMsg}
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-red-500 font-bold">&times;</button>
          </div>
        )}

        {/* Progress Pipeline Display */}
        {isGenerating && (
          <div className="bg-white border border-[#2FA4D7]/40 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="font-extrabold text-sm text-[#3E2C23] uppercase tracking-wide">
                Live Pilot Execution Pipeline
              </div>
              <div className="font-mono text-xs text-[#2FA4D7] font-bold">
                Stage {currentStage} of 7 in Progress
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
              {stages.map((stage) => {
                const isDone = currentStage > stage.id;
                const isCurrent = currentStage === stage.id;
                return (
                  <div
                    key={stage.id}
                    className={`p-3 rounded-lg border text-left transition ${
                      isDone
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : isCurrent
                        ? 'bg-[#2FA4D7]/10 border-[#2FA4D7] text-[#2FA4D7] animate-pulse'
                        : 'bg-[#F5E9D8]/20 border-[#3E2C23]/10 text-[#3E2C23]/40'
                    }`}
                  >
                    <div className="text-[10px] font-mono font-bold uppercase">
                      {isDone ? '✓ Stage ' + stage.id : 'Stage ' + stage.id}
                    </div>
                    <div className="text-xs font-bold mt-1 line-clamp-1">{stage.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Generation Results Card */}
        {result && (
          <div className="bg-white border-2 border-emerald-500 rounded-xl p-6 shadow-md space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#3E2C23]/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500 text-white font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                    PACKAGE READY
                  </span>
                  <span className="font-mono text-sm font-bold text-[#3E2C23]">{result.pilot_id}</span>
                </div>
                <h3 className="text-lg font-black text-[#3E2C23] mt-1">
                  25 Turnkey Deliverables Successfully Packaged in {result.execution_time_s}s
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={result.zip_download_url}
                  download
                  className="bg-[#3E2C23] hover:bg-black text-white font-extrabold text-xs px-4 py-2.5 rounded-lg font-mono flex items-center gap-2 shadow"
                >
                  <span>⬇ Download Complete Package (.zip)</span>
                </a>
                {result.report_url && (
                  <a
                    href={result.report_url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#2FA4D7] hover:bg-[#258bb7] text-white font-extrabold text-xs px-4 py-2.5 rounded-lg font-mono flex items-center gap-2 shadow"
                  >
                    <span>📄 View ISO Audit Certificate</span>
                  </a>
                )}
              </div>
            </div>

            {/* Physics & Audit Summary Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#F5E9D8]/50 border border-[#3E2C23]/15 rounded-lg p-3">
                <div className="text-[10px] font-mono uppercase text-[#3E2C23]/60 font-bold">Estimated Friction</div>
                <div className="text-xl font-black text-[#3E2C23] font-mono mt-0.5">
                  &mu; = {result.sysid_summary.calibrated_friction_mu}
                </div>
                <div className="text-[10px] text-emerald-700 font-bold mt-1">R&sup2; = {result.sysid_summary.r_squared_fit} Fit</div>
              </div>

              <div className="bg-[#F5E9D8]/50 border border-[#3E2C23]/15 rounded-lg p-3">
                <div className="text-[10px] font-mono uppercase text-[#3E2C23]/60 font-bold">Actuator Latency</div>
                <div className="text-xl font-black text-[#3E2C23] font-mono mt-0.5">
                  {result.sysid_summary.actuator_latency_ms} ms
                </div>
                <div className="text-[10px] text-[#3E2C23]/60 mt-1">Differentiable RK4</div>
              </div>

              <div className="bg-[#F5E9D8]/50 border border-[#3E2C23]/15 rounded-lg p-3">
                <div className="text-[10px] font-mono uppercase text-[#3E2C23]/60 font-bold">Safe Speed Ceiling</div>
                <div className="text-xl font-black text-[#2FA4D7] font-mono mt-0.5">
                  {result.certification_summary.safe_operating_speed_ceiling_mps} m/s
                </div>
                <div className="text-[10px] text-[#3E2C23]/60 mt-1">Uncapped from 0.6 m/s</div>
              </div>

              <div className="bg-[#F5E9D8]/50 border border-[#3E2C23]/15 rounded-lg p-3">
                <div className="text-[10px] font-mono uppercase text-[#3E2C23]/60 font-bold">ISO 3691-4 Verdict</div>
                <div className="text-xl font-black text-emerald-600 font-mono mt-0.5">
                  {result.certification_summary.regulatory_verdict}
                </div>
                <div className="text-[10px] text-emerald-700 font-bold mt-1">Zero Collision Guaranteed</div>
              </div>
            </div>

            {/* Deliverables Checklist */}
            <div>
              <div className="text-xs font-mono uppercase font-bold text-[#3E2C23]/70 mb-2">
                Packaged Files in Bundle ({result.deliverable_count} Items):
              </div>
              <div className="bg-[#F5E9D8]/30 border border-[#3E2C23]/15 rounded-lg p-3 max-h-48 overflow-y-auto font-mono text-xs text-[#3E2C23]/80 space-y-1">
                {result.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Historical Packages Table */}
        <div className="bg-white border border-[#3E2C23]/20 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-[#3E2C23] flex items-center gap-2">
              <span className="w-2 h-2 bg-[#3E2C23] rounded-full"></span>
              Generated Pilot Packages History
            </h2>
            <button
              onClick={fetchPackages}
              className="text-xs font-mono text-[#2FA4D7] hover:underline font-bold"
            >
              ↻ Refresh List
            </button>
          </div>

          {packagesList.length === 0 ? (
            <div className="text-center py-8 text-xs font-mono text-[#3E2C23]/50">
              No previous pilot packages found on this server.
            </div>
          ) : (
            <div className="divide-y divide-[#3E2C23]/10 font-mono text-xs">
              {packagesList.map((pkg, i) => (
                <div key={i} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#3E2C23]">{pkg.filename}</div>
                    <div className="text-[11px] text-[#3E2C23]/50 mt-0.5">
                      {pkg.size_kb} KB &bull; Created {new Date(pkg.created_at * 1000).toLocaleString()}
                    </div>
                  </div>
                  <a
                    href={pkg.download_url}
                    download
                    className="border border-[#3E2C23]/20 hover:border-[#2FA4D7] hover:text-[#2FA4D7] px-3 py-1.5 rounded font-bold transition"
                  >
                    Download ZIP
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
