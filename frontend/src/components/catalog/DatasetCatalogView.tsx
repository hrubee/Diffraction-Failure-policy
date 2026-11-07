/**
 * Presentation Component: Prebuilt Synthetic Dataset Catalog & Hub
 * Provides an enterprise library of verified, downloadable demonstration datasets
 * formatted for Hugging Face LeRobot, Google Open-X, PyTorch HDF5, and ROS 2 MCAP.
 *
 * Strict Color Hunt 4-Color Palette: #2FA4D7, #F5E9D8, #3E2C23, #E76F2E (Zero Gradients).
 */

'use client';

import React, { useState } from 'react';
import { SEED_DATASETS } from '@/domain/synthetic/catalog';
import { PrebuiltSyntheticDataset } from '@/domain/synthetic/types';
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
} from 'lucide-react';

export const DatasetCatalogView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [selectedDataset, setSelectedDataset] = useState<PrebuiltSyntheticDataset | null>(null);
  const [copiedDatasetId, setCopiedDatasetId] = useState<string | null>(null);

  const filteredDatasets = SEED_DATASETS.filter((ds) => {
    const matchesSearch =
      ds.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.embodiment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.task.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFormat =
      selectedFormat === 'all' || ds.format.toLowerCase().includes(selectedFormat.toLowerCase());
    return matchesSearch && matchesFormat;
  });

  const handleCopyCode = (ds: PrebuiltSyntheticDataset) => {
    const code = `import datasets
from lerobot.common.datasets.lerobot_dataset import LeRobotDataset

# Direct zero-copy loading into PyTorch DataLoader
dataset = LeRobotDataset(
    repo_id="${ds.huggingfaceSlug}",
    split="train",
    use_videos=True,
    delta_timestamps={"observation.image": [-0.1, 0.0], "action": [0.0, 0.1, 0.2]}
)
print(f"Loaded {len(dataset)} transitions for Physical AI policy training.")`;

    navigator.clipboard.writeText(code);
    setCopiedDatasetId(ds.id);
    setTimeout(() => setCopiedDatasetId(null), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Catalog Header */}
      <div className="bg-[#3E2C23] text-[#F5E9D8] p-6 sm:p-8 rounded-2xl border-2 border-[#3E2C23] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#2FA4D7] text-white">
              Hugging Face LeRobot & Open-X Ready
            </span>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-600 text-white">
              Sim2Real Verified
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-headline tracking-tight text-[#F5E9D8]">
            Physical AI Dataset Hub
          </h1>
          <p className="text-sm sm:text-base text-[#F5E9D8]/80 leading-relaxed">
            High-fidelity synthetic demonstration datasets generated in NVIDIA Isaac Sim. Ready for immediate zero-shot policy training in OpenVLA, ACT, Diffusion Policy, and $\pi_0$.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0 font-mono text-xs">
          <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/10">
            <span className="text-[#F5E9D8]/60 block uppercase">Total Episodes</span>
            <span className="text-[#2FA4D7] font-bold text-sm">575,000+</span>
          </div>
          <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/10">
            <span className="text-[#F5E9D8]/60 block uppercase">Curated Volume</span>
            <span className="text-[#E76F2E] font-bold text-sm">1.18 TB</span>
          </div>
        </div>
      </div>

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
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#3E2C23] text-[#F5E9D8]">
                  {ds.embodiment}
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2FA4D7] text-white">
                    {ds.format}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {ds.sim2realScore}% Sim2Real
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="font-extrabold text-base sm:text-lg text-[#3E2C23] font-headline mb-2">
                {ds.title}
              </h3>
              <p className="text-xs text-[#3E2C23]/80 leading-relaxed mb-4">
                {ds.description}
              </p>

              {/* Sensor stream tags */}
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

              {/* Numbers Grid */}
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

            {/* Actions */}
            <div className="pt-3 border-t-2 border-[#3E2C23]/10 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleCopyCode(ds)}
                className="px-3 py-2 rounded-lg bg-[#3E2C23] hover:bg-[#3E2C23]/90 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {copiedDatasetId === ds.id ? (
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

            {/* Code Block */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase text-[#3E2C23]/70">PyTorch Integration</h4>
              <pre className="bg-[#3E2C23] text-[#F5E9D8] p-4 rounded-xl text-xs font-mono overflow-x-auto border-2 border-[#3E2C23]">
                {`import datasets
from lerobot.common.datasets.lerobot_dataset import LeRobotDataset

# Direct training integration
dataset = LeRobotDataset(
    repo_id="${selectedDataset.huggingfaceSlug}",
    split="train",
    use_videos=True,
    delta_timestamps={"observation.image": [-0.1, 0.0], "action": [0.0, 0.1, 0.2]}
)
print(f"Loaded {len(dataset)} transitions for Physical AI policy training.")`}
              </pre>
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
                onClick={() => handleCopyCode(selectedDataset)}
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
