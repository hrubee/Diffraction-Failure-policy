/**
 * Presentation Component: Sample Deliverables & Client Work Portfolio
 * Displays verified sample assets built by Diffraction Studio:
 * 1. OpenUSD Physics Rigs & Isaac Lab RobotCfg classes
 * 2. Omniverse Replicator procedural stage generation recipes
 * 3. NVIDIA Cosmos Transfer 2.5 ControlNet spec files
 * 4. Hugging Face LeRobot v2 / Open-X datasets & PyTorch streaming dataloaders
 *
 * Strict Color Hunt 4-Color Palette: #2FA4D7, #F5E9D8, #3E2C23, #E76F2E (Zero Gradients).
 */

'use client';

import React, { useState } from 'react';
import { SEED_DATASETS, SAMPLE_DELIVERABLE_ASSETS } from '@/domain/synthetic/catalog';
import { PrebuiltSyntheticDataset, SampleDeliverableAsset } from '@/domain/synthetic/types';
import {
  Database,
  Download,
  Copy,
  Check,
  Search,
  Filter,
  Layers,
  Sparkles,
  ExternalLink,
  Code2,
  Cpu,
  ShieldCheck,
  FileText,
  PackageCheck,
  ArrowRight,
  FileCode,
} from 'lucide-react';

export const DatasetCatalogView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sample_assets' | 'datasets'>('sample_assets');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [selectedDataset, setSelectedDataset] = useState<PrebuiltSyntheticDataset | null>(null);
  const [selectedSampleAsset, setSelectedSampleAsset] = useState<SampleDeliverableAsset | null>(
    SAMPLE_DELIVERABLE_ASSETS[0]
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredDatasets = SEED_DATASETS.filter((ds) => {
    const matchesSearch =
      ds.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.embodiment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.task.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFormat =
      selectedFormat === 'all' || ds.format.toLowerCase().includes(selectedFormat.toLowerCase());
    return matchesSearch && matchesFormat;
  });

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownloadSampleAsset = (asset: SampleDeliverableAsset) => {
    const blob = new Blob([asset.codePreview], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = asset.downloadFileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Portfolio Header Banner */}
      <div className="bg-[#3E2C23] text-[#F5E9D8] p-6 sm:p-8 rounded-2xl border-2 border-[#3E2C23] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#2FA4D7] text-white">
              Studio Deliverables Portfolio
            </span>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#E76F2E] text-white">
              OpenUSD • Cosmos 2.5 • Isaac Lab
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-headline tracking-tight text-[#F5E9D8]">
            Sample Deliverables &amp; Asset Catalog
          </h1>
          <p className="text-sm sm:text-base text-[#F5E9D8]/80 leading-relaxed font-body">
            Inspect real source assets delivered to robotics startups: PhysX 5 OpenUSD articulation rigs, procedural Omniverse Replicator recipes, NVIDIA Cosmos ControlNet specs, and Hugging Face LeRobot demonstration corpora.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex bg-[#2A1D17] p-1 rounded-xl border border-white/10 shrink-0 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('sample_assets')}
            className={`px-4 py-2.5 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'sample_assets' ? 'bg-[#2FA4D7] text-white shadow-xs' : 'text-[#F5E9D8]/70 hover:text-white'
            }`}
          >
            <PackageCheck className="w-4 h-4 text-[#E76F2E]" />
            <span>Sample Deliverable Assets (4)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('datasets')}
            className={`px-4 py-2.5 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'datasets' ? 'bg-[#2FA4D7] text-white shadow-xs' : 'text-[#F5E9D8]/70 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Demonstration Datasets (575K)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SAMPLE DELIVERABLE ASSETS & CODE INSPECTOR */}
      {activeTab === 'sample_assets' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SAMPLE_DELIVERABLE_ASSETS.map((asset) => {
              const isSelected = selectedSampleAsset?.id === asset.id;
              return (
                <div
                  key={asset.id}
                  onClick={() => setSelectedSampleAsset(asset)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'border-[#2FA4D7] bg-[#2FA4D7]/10 shadow-xs'
                      : 'border-[#3E2C23]/20 bg-white hover:border-[#3E2C23]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#3E2C23] text-[#F5E9D8] uppercase shrink-0">
                        {asset.category.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-mono text-[#3E2C23]/60 truncate text-right">{asset.sizeFormatted}</span>
                    </div>
                    <h3 className="font-bold text-sm text-[#3E2C23] font-headline">{asset.title}</h3>
                    <p className="text-xs text-[#3E2C23]/70 font-body line-clamp-2">{asset.description}</p>
                  </div>

                  <div className="pt-2 border-t border-[#3E2C23]/10 flex items-center justify-between text-[11px] font-mono text-[#2FA4D7] font-bold">
                    <span>Inspect Source</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Asset Inspector Card */}
          {selectedSampleAsset && (
            <div className="bg-white border-2 border-[#3E2C23] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3E2C23]/15 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#2FA4D7] text-white uppercase">
                      {selectedSampleAsset.fileFormat}
                    </span>
                    <span className="text-xs font-mono text-[#3E2C23]/60">{selectedSampleAsset.sizeFormatted}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#3E2C23] font-headline">
                    {selectedSampleAsset.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#3E2C23]/80 font-body">
                    {selectedSampleAsset.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopyText(selectedSampleAsset.id, selectedSampleAsset.codePreview)}
                    className="px-3 py-2 rounded-lg border-2 border-[#3E2C23] text-[#3E2C23] hover:bg-[#F5E9D8] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {copiedId === selectedSampleAsset.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === selectedSampleAsset.id ? 'Copied!' : 'Copy Code'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadSampleAsset(selectedSampleAsset)}
                    className="px-4 py-2 rounded-lg bg-[#2FA4D7] hover:bg-[#258ec0] text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {selectedSampleAsset.downloadFileName}</span>
                  </button>
                </div>
              </div>

              {/* Code Preview Block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#3E2C23]/70">
                  <span className="flex items-center gap-1.5 font-bold">
                    <FileCode className="w-4 h-4 text-[#2FA4D7]" /> Source Code Preview:
                  </span>
                  <span>Compatible with Isaac Sim 2026 &amp; Isaac Lab</span>
                </div>
                <pre className="p-4 rounded-xl bg-[#2A1D17] text-[#F5E9D8] text-xs font-mono overflow-x-auto border-2 border-[#3E2C23] max-h-96">
                  <code>{selectedSampleAsset.codePreview}</code>
                </pre>
              </div>

              {/* Conversion Callout Banner */}
              <div className="p-4 bg-[#F5E9D8] rounded-xl border border-[#3E2C23]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm text-[#3E2C23] font-headline">
                    Need this calibrated for your proprietary robot?
                  </h4>
                  <p className="text-xs text-[#3E2C23]/80 font-body">
                    We turn your URDF or CAD into a tuned PhysX 5 OpenUSD asset + Isaac Lab config in 3 days for $7,500.
                  </p>
                </div>

                <a
                  href="#sow-builder"
                  onClick={() => {
                    const el = document.getElementById('sow-builder');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2.5 rounded-lg bg-[#3E2C23] text-white hover:bg-[#2A1D17] text-xs font-mono font-bold shrink-0 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E76F2E]" />
                  <span>Configure Sprint SOW</span>
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PREBUILT DEMONSTRATION DATASETS */}
      {activeTab === 'datasets' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="bg-white border-2 border-[#3E2C23] p-4 rounded-xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#3E2C23]/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by robot, task, or sensor..."
                className="w-full pl-9 pr-4 py-2 bg-[#F5E9D8]/30 border border-[#3E2C23]/20 rounded-lg text-xs font-bold text-[#3E2C23] focus:outline-none focus:border-[#2FA4D7]"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <span className="text-xs font-bold text-[#3E2C23]/60 flex items-center gap-1 shrink-0 font-mono">
                <Filter className="w-3.5 h-3.5" /> FORMAT:
              </span>
              {['all', 'LeRobot', 'Open-X', 'HDF5', 'MCAP'].map((fmt) => (
                <button
                  type="button"
                  key={fmt}
                  onClick={() => setSelectedFormat(fmt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer shrink-0 border ${
                    selectedFormat === fmt
                      ? 'bg-[#2FA4D7] text-white border-[#2FA4D7]'
                      : 'bg-white text-[#3E2C23] border-[#3E2C23]/20 hover:border-[#3E2C23]'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Dataset Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDatasets.map((ds) => (
              <div
                key={ds.id}
                className="bg-white border-2 border-[#3E2C23] rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#2FA4D7] transition-all"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#3E2C23] text-[#F5E9D8]">
                      {ds.embodiment}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2FA4D7] text-white">
                        {ds.format}
                      </span>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {ds.sim2realScore}% Sim2Real
                      </span>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base sm:text-lg text-[#3E2C23] font-headline mb-2">
                    {ds.title}
                  </h3>
                  <p className="text-xs text-[#3E2C23]/80 leading-relaxed mb-4">
                    {ds.description}
                  </p>

                  <div className="space-y-1.5 mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#3E2C23]/60 block">
                      Synchronized Sensor Streams:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {ds.sensorStreams.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F5E9D8] text-[#3E2C23] border border-[#3E2C23]/15 font-bold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#F5E9D8]/40 border border-[#3E2C23]/10 font-mono text-xs">
                    <div>
                      <span className="text-[#3E2C23]/50 block text-[10px]">EPISODES</span>
                      <span className="font-extrabold text-[#3E2C23]">{ds.episodes.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[#3E2C23]/50 block text-[10px]">FRAMES</span>
                      <span className="font-extrabold text-[#3E2C23]">{(ds.framesTotal / 1000000).toFixed(1)}M</span>
                    </div>
                    <div>
                      <span className="text-[#3E2C23]/50 block text-[10px]">STORAGE</span>
                      <span className="font-extrabold text-[#3E2C23]">{ds.sizeGb} GB</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-[#3E2C23]/10 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const snippet = `import datasets
from lerobot.common.datasets.lerobot_dataset import LeRobotDataset

dataset = LeRobotDataset(
    repo_id="${ds.huggingfaceSlug}",
    split="train",
    use_videos=True,
    delta_timestamps={"observation.image": [-0.1, 0.0], "action": [0.0, 0.1, 0.2]}
)
print(f"Loaded {len(dataset)} transitions for Physical AI training.")`;
                      handleCopyText(ds.id, snippet);
                    }}
                    className="px-3 py-2 rounded-lg bg-[#3E2C23] hover:bg-[#3E2C23]/90 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {copiedId === ds.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Copied PyTorch Snippet!
                      </>
                    ) : (
                      <>
                        <Code2 className="w-3.5 h-3.5 text-[#2FA4D7]" />
                        Copy PyTorch Loader
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedDataset(ds)}
                    className="px-3 py-2 rounded-lg bg-[#2FA4D7] hover:bg-[#2FA4D7]/90 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    View Dataset Card
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dataset Details Modal */}
      {selectedDataset && (
        <div className="fixed inset-0 z-50 bg-[#3E2C23]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#3E2C23] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedDataset(null)}
              className="absolute top-4 right-4 text-[#3E2C23]/60 hover:text-[#3E2C23] font-bold text-lg cursor-pointer"
            >
              ✕
            </button>

            <div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#3E2C23] text-[#F5E9D8]">
                {selectedDataset.format}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#3E2C23] font-headline mt-2">
                {selectedDataset.title}
              </h2>
              <p className="text-xs font-mono text-[#2FA4D7] font-bold mt-1">
                Repository: {selectedDataset.huggingfaceSlug}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase text-[#3E2C23]/70">Description</h4>
              <p className="text-sm text-[#3E2C23] leading-relaxed">
                {selectedDataset.description}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t-2 border-[#3E2C23]/10">
              <button
                type="button"
                onClick={() => setSelectedDataset(null)}
                className="px-4 py-2 rounded-lg border-2 border-[#3E2C23] text-xs font-bold text-[#3E2C23] hover:bg-[#F5E9D8] cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const snippet = `import datasets
from lerobot.common.datasets.lerobot_dataset import LeRobotDataset

dataset = LeRobotDataset(
    repo_id="${selectedDataset.huggingfaceSlug}",
    split="train",
    use_videos=True,
    delta_timestamps={"observation.image": [-0.1, 0.0], "action": [0.0, 0.1, 0.2]}
)
print(f"Loaded {len(dataset)} transitions for Physical AI training.")`;
                  handleCopyText(selectedDataset.id, snippet);
                }}
                className="px-4 py-2 rounded-lg bg-[#2FA4D7] text-white text-xs font-bold hover:bg-[#2FA4D7]/90 cursor-pointer flex items-center gap-2"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Loader Script
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
