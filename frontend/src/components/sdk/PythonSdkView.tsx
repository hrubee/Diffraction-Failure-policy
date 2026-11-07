/**
 * Presentation Component: Python SDK & API Key Management
 * Provides terminal-first developer quickstart and programmatic
 * Python client integration for headless Isaac Sim cluster workflows.
 *
 * Strict Color Hunt 4-Color Palette: #2FA4D7, #F5E9D8, #3E2C23, #E76F2E (Zero Gradients).
 */

'use client';

import React, { useState } from 'react';
import {
  Terminal,
  Copy,
  Check,
  Code2,
  Key,
  ShieldAlert,
  Server,
  Layers,
  Sparkles,
} from 'lucide-react';

export const PythonSdkView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'train' | 'generate' | 'stream'>('train');
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const demoApiKey = 'diffract_live_sk_94827103a8fbc210948e7182903';

  const codeSnippets = {
    train: `# 1. Install official SDK
# pip install diffract-synth torch torchvision datasets

import torch
from diffract.data import load_physical_dataset
from lerobot.common.policies.diffusion.modeling_diffusion import DiffusionPolicy

# Load 250,000 synthetic demonstrations from Diffraction Isaac Sim Factory
dataset = load_physical_dataset(
    "diffraction/amr-pallet-docking-vla-250k",
    format="lerobot_v2",
    modalities=["rgb_1080p", "depth_16bit", "lidar_32beam", "joint_torques"],
    split="train",
    batch_size=64
)

# Initialize policy and train without teleoperation costs
policy = DiffusionPolicy.from_pretrained("lerobot/diffusion_pusht")
optimizer = torch.optim.AdamW(policy.parameters(), lr=1e-4)

for batch in dataset.iter_batches():
    loss = policy.compute_loss(batch)
    loss.backward()
    optimizer.step()
    print(f"Step Loss: {loss.item():.4f}")
`,
    generate: `import diffract
from diffract.synth import IsaacLabCluster, DomainRandomization

# Connect to Diffraction NVIDIA H100 Cloud Cluster
client = diffract.Client(api_key="${demoApiKey}")

# Define synthetic generation job across 64 GPU workers
job = client.factory.create_job(
    name="Humanoid Dynamic Balance Run v2",
    embodiment="humanoid_unitree_h1",
    environment="residential_kitchen",
    target_episodes=100000,
    format="OpenX_RLDS",
    randomization=DomainRandomization(
        lighting_lux_range=(80, 850),
        friction_mu_range=(0.20, 0.85),
        mass_variance_pct=25.0,
        ros2_latency_jitter_ms=(10, 80)
    ),
    cluster_gpus=64
)

print(f"Dispatched Job ID: {job.id}. Throughput: {job.fps} FPS")
job.wait_for_completion()
`,
    stream: `import diffract
from diffract.stream import LiveMultimodalViewer

# Stream live Isaac Sim camera & depth feed directly into OpenCV / PyTorch
stream = diffract.stream_job(
    job_id="job-prod-881",
    api_key="${demoApiKey}"
)

for frame in stream:
    rgb = frame["camera/rgb"]       # (1080, 1920, 3) uint8
    depth = frame["camera/depth"]   # (1080, 1920) float32
    lidar = frame["lidar/points"]   # (57600, 3) float32
    torques = frame["actuators/joint_torques"] # (4,) float32
    
    print(f"Frame #{frame.seq_id} | Surface Friction: μ={frame.surface_mu:.2f}")
`,
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(demoApiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#3E2C23] text-[#F5E9D8] p-6 sm:p-8 rounded-2xl border-2 border-[#3E2C23] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#2FA4D7] text-white">
              Python 3.10+ / PyTorch 2.4+
            </span>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#E76F2E] text-white">
              diffract-synth
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-headline tracking-tight text-[#F5E9D8]">
            Python SDK & Cluster API
          </h1>
          <p className="text-sm sm:text-base text-[#F5E9D8]/80 leading-relaxed">
            Programmatically dispatch Isaac Sim generation jobs, stream synthetic demonstrations into PyTorch DataLoader, and automate Physical AI CI/CD pipelines.
          </p>
        </div>

        <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/10 font-mono text-xs shrink-0">
          <span className="text-[#F5E9D8]/60 block uppercase">PyPI Package</span>
          <span className="text-[#F5E9D8] font-bold text-sm">pip install diffract-synth</span>
        </div>
      </div>

      {/* API Key Box */}
      <div className="bg-white border-2 border-[#3E2C23] rounded-2xl p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-[#2FA4D7]" />
            <h3 className="font-extrabold text-base sm:text-lg text-[#3E2C23] font-headline">
              Workspace API Key
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
            Active Tenant Key
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="password"
            value={demoApiKey}
            readOnly
            className="flex-1 bg-[#F5E9D8]/40 border-2 border-[#3E2C23]/20 rounded-xl px-4 py-2.5 font-mono text-xs font-bold text-[#3E2C23] focus:outline-none"
          />
          <button
            type="button"
            onClick={handleCopyKey}
            className="px-4 py-2.5 rounded-xl bg-[#2FA4D7] hover:bg-[#2FA4D7]/90 text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0"
          >
            {copiedKey ? (
              <>
                <Check className="w-4 h-4" /> Copied Key
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy API Key
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-[#3E2C23]/60 font-mono">
          Use this key in Python scripts or CI/CD runners via the <code className="font-bold">DIFFRACT_API_KEY</code> environment variable.
        </p>
      </div>

      {/* Code Snippets Box */}
      <div className="bg-[#3E2C23] border-2 border-[#3E2C23] rounded-2xl shadow-xs overflow-hidden">
        {/* Tab Header */}
        <div className="px-6 py-4 bg-[#2A1E18] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#2FA4D7]" />
            <span className="text-xs font-mono font-bold uppercase text-[#F5E9D8]">
              SDK Recipes
            </span>
          </div>

          <div className="flex items-center gap-2 bg-[#3E2C23] p-1 rounded-lg border border-white/10 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('train')}
              className={`px-3 py-1 rounded font-bold cursor-pointer transition-colors ${
                activeTab === 'train' ? 'bg-[#2FA4D7] text-white' : 'text-[#F5E9D8]/70 hover:text-white'
              }`}
            >
              1. Train VLA Policy
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('generate')}
              className={`px-3 py-1 rounded font-bold cursor-pointer transition-colors ${
                activeTab === 'generate' ? 'bg-[#2FA4D7] text-white' : 'text-[#F5E9D8]/70 hover:text-white'
              }`}
            >
              2. Launch Isaac Sim Job
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('stream')}
              className={`px-3 py-1 rounded font-bold cursor-pointer transition-colors ${
                activeTab === 'stream' ? 'bg-[#2FA4D7] text-white' : 'text-[#F5E9D8]/70 hover:text-white'
              }`}
            >
              3. Stream Sensor Frames
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#F5E9D8] font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#2FA4D7]" />}
            Copy Code
          </button>
        </div>

        {/* Code Content */}
        <div className="p-6">
          <pre className="text-xs font-mono text-[#F5E9D8] overflow-x-auto leading-relaxed">
            {codeSnippets[activeTab]}
          </pre>
        </div>
      </div>
    </div>
  );
};
