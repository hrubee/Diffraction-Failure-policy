/**
 * Synthetic Factory Catalog & API Gateway
 * Provides seed data and real-time API client methods for Isaac Sim generation jobs,
 * procedural environments, embodiments, and dataset manifests.
 */

import {
  RobotEmbodiment,
  ProceduralEnvironment,
  PrebuiltSyntheticDataset,
  SyntheticGenerationJob,
  Sim2RealBenchmarkData,
  SprintPackage,
  SampleDeliverableAsset,
} from './types';

export const SEED_EMBODIMENTS: readonly RobotEmbodiment[] = [
  {
    id: 'humanoid_unitree_h1',
    name: 'Unitree H1 Bipedal Humanoid',
    category: 'Humanoid',
    dof: 19,
    massKg: 47.0,
    actuators: 'High-Torque Quasi-Direct Drive (360 N·m peak)',
    defaultSensors: ['Dual Intel RealSense D435 RGB-D', 'Livox MID-360 LiDAR', '6-DOF Pelvis IMU', '19x Joint Encoders (500Hz)'],
    usdAsset: 'omniverse://diffraction/assets/robots/unitree_h1_v2.usd',
    description: 'Full-body 1.80m bipedal humanoid with dynamic balance and contact compliance.',
    controlFrequencyHz: 500,
  },
  {
    id: 'amr_agilex_hunter',
    name: 'AgileX Hunter SE Industrial AMR',
    category: 'Industrial AMR',
    dof: 4,
    massKg: 65.0,
    actuators: 'Front Ackermann Steering + Dual Rear In-Wheel Brushless Hub',
    defaultSensors: ['Forward Intel RealSense D455 Stereo', 'Ouster OS1-32 3D LiDAR', 'Wheel Odometry (200Hz)', 'Base IMU'],
    usdAsset: 'omniverse://diffraction/assets/robots/agilex_hunter_se.usd',
    description: 'Heavy-duty warehouse/logistics autonomous platform with non-linear tire slip dynamics.',
    controlFrequencyHz: 200,
  },
  {
    id: 'arm_franka_panda',
    name: 'Franka Emika Panda 7-DOF Manipulator',
    category: 'Manipulator',
    dof: 7,
    massKg: 18.0,
    actuators: 'Torque-Sensor Integrated Harmonic Drive',
    defaultSensors: ['Wrist-Mounted Intel RealSense D405', 'Overhead Static 4K Context Camera', 'Joint Torque Sensors (1000Hz)'],
    usdAsset: 'omniverse://diffraction/assets/robots/franka_panda_gripper.usd',
    description: 'Precision torque-controlled robotic arm for delicate bin picking, assembly, and door opening.',
    controlFrequencyHz: 1000,
  },
  {
    id: 'quadruped_unitree_go2',
    name: 'Unitree Go2 Autonomous Quadruped',
    category: 'Quadruped',
    dof: 12,
    massKg: 15.0,
    actuators: 'Ultra-Lightweight Coaxial Joint Actuators (45 N·m)',
    defaultSensors: ['Hemispheric Ultra-Wide Camera', '4D LiDAR L1', 'Foot Contact Force Sensors (1000Hz)'],
    usdAsset: 'omniverse://diffraction/assets/robots/unitree_go2.usd',
    description: 'Agile quadruped scout for stairs, industrial pipe inspection, and uneven terrain.',
    controlFrequencyHz: 500,
  },
];

export const SEED_ENVIRONMENTS: readonly ProceduralEnvironment[] = [
  {
    id: 'warehouse_fulfillment',
    name: 'Amazon-Class Automated Fulfillment Center',
    category: 'Logistics',
    description: 'High-bay pallet racking, dynamic autonomous forklift traffic, smooth epoxy flooring, and sodium/LED overhead lighting.',
    usdStage: 'omniverse://diffraction/environments/warehouse_fulfillment_center.usd',
    lightingLuxRange: [150, 1200],
    frictionMuRange: [0.18, 0.85],
    clutterLevels: ['Clean', 'Operational Clutter', 'Extreme Pallet Spills'],
    sampleTasks: ['High-Bay Pallet Docking', 'Dynamic Obstacle Swerving', 'Wet Spill Recovery'],
  },
  {
    id: 'loading_dock_glare',
    name: 'Exterior Loading Dock with Extreme Solar Glare',
    category: 'Industrial',
    description: 'Indoor-to-outdoor roll-up door transition, direct afternoon solar glare (>85,000 Lux), concrete ramps, and expansion joints.',
    usdStage: 'omniverse://diffraction/environments/exterior_loading_dock.usd',
    lightingLuxRange: [200, 95000],
    frictionMuRange: [0.15, 0.75],
    clutterLevels: ['Semi-Trailer Parked', 'Forklift Choke Point'],
    sampleTasks: ['Ramp Ascent Under Glare', 'Trailer Ingress/Egress', 'Sensor Exposure Adaptation'],
  },
  {
    id: 'manufacturing_cleanroom',
    name: 'Precision Electronics Assembly Cleanroom',
    category: 'Manufacturing',
    description: 'Specular brushed stainless-steel surfaces, overhead surgical lighting, electrostatic dissipative (ESD) flooring, and collaborative robot cages.',
    usdStage: 'omniverse://diffraction/environments/cleanroom_cell.usd',
    lightingLuxRange: [800, 3500],
    frictionMuRange: [0.45, 0.90],
    clutterLevels: ['Component Trays', 'PCB Bin Clutter'],
    sampleTasks: ['Micro-Connector Insertion', 'Bin Picking with Occlusion', 'Cable Dressing'],
  },
  {
    id: 'residential_kitchen',
    name: 'Domestic Kitchen & Living Environment',
    category: 'Service Robotics',
    description: 'Laminate and tiled countertops, cabinet doors, refrigerator handles, varied flooring (wood, linoleum, rug), and ambient domestic clutter.',
    usdStage: 'omniverse://diffraction/environments/domestic_kitchen_v4.usd',
    lightingLuxRange: [80, 850],
    frictionMuRange: [0.25, 0.80],
    clutterLevels: ['Dish Clutter', 'Floor Toys', 'Pet Obstacles'],
    sampleTasks: ['Refrigerator Handle Manipulation', 'Dishwasher Loading', 'Threshold Step-Over'],
  },
];

export const SEED_DATASETS: readonly PrebuiltSyntheticDataset[] = [
  {
    id: 'ds-amr-pallet-docking-vla-250k',
    title: 'AMR Pallet Docking & Wet Floor Recovery (250K Trajectories)',
    embodiment: 'AgileX Hunter SE',
    task: 'Pallet Ingress & Traction Recovery',
    episodes: 250000,
    framesTotal: 37500000,
    sizeGb: 420.5,
    format: 'LeRobot v2 / Parquet + MP4',
    sim2realScore: 98.6,
    huggingfaceSlug: 'diffraction/amr-pallet-docking-vla-250k',
    description: 'Massive scale synthetic dataset containing 250,000 trajectories across 500 warehouse lighting permutations, wet floor friction variations (μ = 0.12 - 0.85), and dynamic obstacle cut-ins.',
    sensorStreams: ['RGB 1080p @ 60Hz', '16-bit Normalized Depth', 'Semantic Segmentation', '32-Beam Ouster LiDAR', 'Proprioception (200Hz)'],
    license: 'Commercial / Enterprise Use',
  },
  {
    id: 'ds-humanoid-locomotion-ood-100k',
    title: 'Unitree H1 Bipedal Locomotion on Unstable Terrains (100K Trajectories)',
    embodiment: 'Unitree H1 Humanoid',
    task: 'Rough Terrain Walking & Slip Balancing',
    episodes: 100000,
    framesTotal: 20000000,
    sizeGb: 310.2,
    format: 'Open-X Embodiment / RLDS',
    sim2realScore: 97.4,
    huggingfaceSlug: 'diffraction/humanoid-bipedal-ood-100k',
    description: 'Synthesized bipedal walking over gravel, slick ramps, stairs, and sudden push disturbances. Ground truth ZMP and contact wrenches recorded at 500 Hz.',
    sensorStreams: ['Head RGB-D (720p)', 'Livox LiDAR 360', '19-DOF Joint Torques', 'Pelvis IMU (500Hz)'],
    license: 'Commercial / Enterprise Use',
  },
  {
    id: 'ds-franka-cluttered-bin-picking-150k',
    title: 'Franka Panda 7-DOF Cluttered Bin Picking (150K Demonstrations)',
    embodiment: 'Franka Emika Panda',
    task: 'Complex Object Grasping & Re-orientation',
    episodes: 150000,
    framesTotal: 22500000,
    sizeGb: 284.0,
    format: 'HDF5 / PyTorch & JAX',
    sim2realScore: 99.1,
    huggingfaceSlug: 'diffraction/franka-cluttered-bins-150k',
    description: '150,000 robotic manipulation trajectories with randomized object shapes, mass, friction, and specular metal reflections. Ground truth 6D pose annotations.',
    sensorStreams: ['Wrist RGB-D 1080p', 'Static Context RGB 4K', 'End-Effector 6D Wrench', 'Joint Velocities (1000Hz)'],
    license: 'Commercial / Enterprise Use',
  },
  {
    id: 'ds-dock-extreme-glare-edgecases-75k',
    title: 'Autonomous Forklift & Hauler Extreme Solar Glare (75K Trajectories)',
    embodiment: 'Heavy Ackermann Hauler',
    task: 'Solar Flare Ingress & Blindspot Braking',
    episodes: 75000,
    framesTotal: 11250000,
    sizeGb: 165.8,
    format: 'ROS 2 / MCAP + LeRobot',
    sim2realScore: 98.2,
    huggingfaceSlug: 'diffraction/hauler-solar-glare-75k',
    description: 'Targeted edge-case corpus focusing on auto-exposure blowout (>80,000 Lux), camera sensor saturation, and LiDAR retro-reflective scattering at loading docks.',
    sensorStreams: ['HDR Forward Stereo (120dB)', 'Velodyne 64-Beam LiDAR', 'IMU + GNSS RTK', 'Vehicle CAN Telemetry'],
    license: 'Commercial / Enterprise Use',
  },
];

export const SEED_JOBS: readonly SyntheticGenerationJob[] = [
  {
    id: 'job-prod-881',
    name: 'Isaac Lab Fleet Run: Warehouse Pallet Swerve v4',
    embodimentId: 'amr_agilex_hunter',
    environmentId: 'warehouse_fulfillment',
    targetEpisodes: 100000,
    completedEpisodes: 64280,
    status: 'GENERATING',
    fps: 48200,
    activeGpuWorkers: 64,
    storageGb: 108.4,
    sim2realScore: 98.4,
    format: 'LeRobot_v2',
    createdAt: Date.now() - 3600000 * 3,
    lightingLuxRange: [200, 1500],
    frictionMuRange: [0.15, 0.85],
    sensorSuite: ['RGB 1080p', 'Depth 16-bit', 'Semantic Seg', '32-Beam LiDAR', 'Joint Torques (200Hz)'],
    clusterNodes: '64x NVIDIA H100 SXM5 (AWS us-east-1)',
  },
  {
    id: 'job-prod-882',
    name: 'Unitree H1 Bipedal Stair Descent & Dynamic Balance',
    embodimentId: 'humanoid_unitree_h1',
    environmentId: 'residential_kitchen',
    targetEpisodes: 50000,
    completedEpisodes: 50000,
    status: 'COMPLETED',
    fps: 0,
    activeGpuWorkers: 0,
    storageGb: 154.2,
    sim2realScore: 97.9,
    format: 'OpenX_RLDS',
    createdAt: Date.now() - 3600000 * 18,
    lightingLuxRange: [100, 800],
    frictionMuRange: [0.25, 0.75],
    sensorSuite: ['Head RGB-D', 'Livox 360', '19x Joint Encoders (500Hz)'],
    clusterNodes: '32x NVIDIA L40S (RunPod)',
  },
];

export const SEED_BENCHMARK: Sim2RealBenchmarkData = {
  overallSim2RealFidelityPct: 98.4,
  policyZeroShotTransferRate: '94.2% Success on Physical Hardware',
  distributions: {
    frictionSlipWassersteinDistance: 0.038,
    sensorNoiseCovarianceMatchPct: 98.7,
    latencyJitterKlDivergence: 0.024,
    photometricHistogramIntersection: 0.962,
  },
  benchmarkedPlatforms: [
    { robot: 'Unitree H1 Humanoid', realLogsCompared: 1420, transferSuccess: '93.8%' },
    { robot: 'AgileX Hunter AMR', realLogsCompared: 3890, transferSuccess: '96.5%' },
    { robot: 'Franka Emika Panda', realLogsCompared: 5210, transferSuccess: '97.2%' },
  ],
  domainRandomizationDimensions: [
    { name: 'Surface Friction (μ)', syntheticBounds: '0.10 to 0.95', realDistributionP99: '0.14 to 0.88' },
    { name: 'Ambient Illuminance', syntheticBounds: '50 to 95,000 Lux', realDistributionP99: '120 to 88,000 Lux' },
    { name: 'Transport Latency Jitter', syntheticBounds: '5ms to 95ms', realDistributionP99: '12ms to 84ms' },
    { name: 'Payload Mass Variance', syntheticBounds: '±25%', realDistributionP99: '±20%' },
  ],
};

export const SPRINT_PACKAGES: readonly SprintPackage[] = [
  {
    id: 'robot_usd_rig',
    name: 'Robot USD Physics Rig',
    tagline: 'URDF / CAD to Calibrated PhysX 5 OpenUSD & Isaac Lab Articulation',
    priceUsd: 7500,
    turnaroundDays: 3,
    badge: '3-Day Turnaround',
    targetClient: 'Hardware & robotics startups with a physical robot URDF/CAD that need an Isaac Sim & Isaac Lab ready asset.',
    deliverables: [
      'Turnkey OpenUSD (.usd) asset with PhysX 5 rigid bodies & collision envelopes',
      'Joint limits, damping, drive stiffness, and inertia tensor calibration',
      'Drop-in Python RobotCfg class for NVIDIA Isaac Lab / Orbit',
      'Actuator saturation curves & 500Hz PD drive tuning suite',
      'Automated joint verification test script + 10-episode sanity check video',
      'Zero-drift physics verification guarantee',
    ],
    techStack: ['NVIDIA Isaac Sim', 'OpenUSD', 'PhysX 5', 'Isaac Lab', 'URDF Parser'],
    sla: '72-Hour Guaranteed Delivery with 2 Revision Cycles',
  },
  {
    id: 'procedural_stage',
    name: 'Procedural Training Stage',
    tagline: 'Custom Photorealistic OpenUSD Stage with Omniverse Replicator Domain Randomization',
    priceUsd: 18500,
    turnaroundDays: 7,
    isPopular: true,
    badge: 'Most Popular',
    targetClient: 'Teams training navigation, mobile manipulation, or bipedal locomotion in specialized environments (logistics, healthcare, offshore).',
    deliverables: [
      'Production-grade OpenUSD stage tailored to your operational domain (Warehouse, Dock, Cleanroom, Clinic)',
      'Omniverse Replicator procedural script with 50+ randomization parameters',
      'Lighting randomization (50 to 95,000 Lux, CCT 2800K to 6500K, HDR skies)',
      'Dynamic floor friction profiles (μ = 0.10 to 0.95, wet spills, ice patches)',
      'Dynamic obstacles: automated forklifts, pedestrian rigs, falling clutter',
      'Synchronized multi-camera sensor rigs (RGB, 16-bit Depth, Semantic Mask, 3D LiDAR)',
      'Interactive Omniverse stage walkthrough & Isaac Lab environment wrapper',
    ],
    techStack: ['NVIDIA Isaac Sim', 'Omniverse Replicator', 'OpenUSD Stage', 'PhysX 5 Materials', 'RTX Ray-Tracing'],
    sla: '7-Day Turnaround with Full Source Code & Python Recipes',
  },
  {
    id: 'cosmos_dataset',
    name: 'Cosmos Synthetic Dataset',
    tagline: '100k-500k Demonstration Trajectories Augmented with NVIDIA Cosmos Transfer 2.5',
    priceUsd: 35000,
    turnaroundDays: 14,
    badge: 'Frontier AI Scale',
    targetClient: 'Labs training Vision-Language-Action (VLA) foundation models, Diffusion Policies, or ACT policies needing massive multimodal data.',
    deliverables: [
      '100,000 to 500,000 demonstration trajectories executed across headless Isaac Lab GPU cluster',
      'NVIDIA Cosmos Transfer 2.5 photorealistic diffusion augmentation with ControlNet conditioning',
      'Multi-modal synchronized streams: 1080p RGB, 16-bit Depth, Semantic Masks, 32-beam LiDAR, 500Hz joint actions',
      'Zero physics distortion: robot actions and joint kinematics remain 100% mathematically invariant',
      'Packaged in Hugging Face LeRobot v2 or Open-X Embodiment RLDS format',
      'Turnkey PyTorch streaming DataLoader with sub-millisecond batch feeding',
      'Sim-to-Real Wasserstein fidelity certification report',
    ],
    techStack: ['NVIDIA Cosmos Transfer 2.5', 'Isaac Lab', 'Hugging Face LeRobot v2', 'PyTorch / JAX', 'ControlNet'],
    sla: '14-Day Delivery • 100% Sim-to-Real Policy Transfer Guarantee',
  },
];

export const SAMPLE_DELIVERABLE_ASSETS: readonly SampleDeliverableAsset[] = [
  {
    id: 'sample-usd-unitree-h1',
    title: 'Unitree H1 Bipedal Humanoid PhysX 5 Rig',
    category: 'usd_rig',
    fileFormat: 'OpenUSD (.usd) + Isaac Lab Python Config',
    sizeFormatted: '48.2 MB',
    description: 'Fully calibrated 19-DOF bipedal humanoid with PhysX 5 articulation, convex hull collision hulls, and 500Hz joint impedance drives.',
    techStack: ['OpenUSD', 'PhysX 5', 'Isaac Lab'],
    downloadFileName: 'unitree_h1_physics_rig.usd',
    codePreview: `# Isaac Lab RobotCfg Class generated by Diffraction Studio
from omni.isaac.lab.actuators import ImplicitActuatorCfg
from omni.isaac.lab.assets import ArticulationCfg
import omni.isaac.lab.sim as sim_utils

UNITREE_H1_CFG = ArticulationCfg(
    spawn=sim_utils.UsdFileCfg(
        usd_path="diffraction_assets/robots/unitree_h1_physx5.usd",
        rigid_props=sim_utils.RigidBodyPropertiesCfg(
            rigid_body_enabled=True,
            max_linear_velocity=100.0,
            max_angular_velocity=100.0,
            max_depenetration_velocity=1.0,
            enable_gyroscopic_forces=True,
        ),
        articulation_props=sim_utils.ArticulationRootPropertiesCfg(
            enabled_self_collisions=False,
            solver_position_iteration_count=8,
            solver_velocity_iteration_count=4,
        ),
    ),
    init_state=ArticulationCfg.InitialStateCfg(
        pos=(0.0, 0.0, 1.05),
        joint_pos={
            ".*_hip_yaw": 0.0,
            ".*_hip_roll": 0.0,
            ".*_hip_pitch": -0.28,
            ".*_knee": 0.65,
            ".*_ankle": -0.37,
        },
    ),
    actuators={
        "legs": ImplicitActuatorCfg(
            joint_names_expr=[".*_hip_.*", ".*_knee", ".*_ankle"],
            effort_limit=360.0,
            velocity_limit=20.0,
            stiffness=150.0,
            damping=5.0,
        ),
    },
)`,
  },
  {
    id: 'sample-procedural-stage-warehouse',
    title: 'Omniverse Replicator Procedural Warehouse Recipe',
    category: 'stage_recipe',
    fileFormat: 'Python (.py) for Isaac Sim Replicator',
    sizeFormatted: '12.4 KB Script',
    description: 'Procedural generation script creating endless high-bay warehouse layouts with dynamic lighting (150-1200 Lux), randomized pallet clutter, and floor friction maps.',
    techStack: ['Omniverse Replicator', 'Isaac Sim', 'Python'],
    downloadFileName: 'procedural_warehouse_recipe.py',
    codePreview: `# Procedural Warehouse Domain Randomization Script
import omni.replicator.core as rep

def randomize_warehouse_stage():
    with rep.new_layer():
        # 1. Randomize overhead high-bay sodium and LED luminaires
        lights = rep.get.prims(path_pattern="/World/Lighting/HighBay_.*")
        with lights:
            rep.modify.attribute("intensity", rep.distribution.uniform(150.0, 2400.0))
            rep.modify.attribute("colorTemperature", rep.distribution.choice([3200.0, 4500.0, 6000.0]))

        # 2. Randomize floor surface friction (epoxy, wet spills, polished concrete)
        floors = rep.get.prims(path_pattern="/World/Floor/EpoxyTile_.*")
        with floors:
            rep.physics.physics_material(
                dynamic_friction=rep.distribution.uniform(0.12, 0.88),
                static_friction=rep.distribution.uniform(0.18, 0.95),
                restitution=0.05
            )

        # 3. Randomize pallet stack clutter & obstacle placements
        pallets = rep.get.prims(path_pattern="/World/Clutter/Pallet_.*")
        with pallets:
            rep.modify.pose(
                position=rep.distribution.uniform((-15.0, -8.0, 0.0), (15.0, 8.0, 0.0)),
                rotation=rep.distribution.uniform((0, 0, -180), (0, 0, 180))
            )

rep.orchestrator.run()`,
  },
  {
    id: 'sample-cosmos-controlnet-spec',
    title: 'NVIDIA Cosmos Transfer 2.5 ControlNet Spec',
    category: 'cosmos_spec',
    fileFormat: 'JSON (.json) Schema Specification',
    sizeFormatted: '4.8 KB',
    description: 'Exact ControlNet conditioning configuration binding Isaac Sim semantic segmentation and Canny edges to Cosmos Transfer 2.5 for photoreal video augmentation.',
    techStack: ['NVIDIA Cosmos Transfer 2.5', 'ControlNet', 'JSON Schema'],
    downloadFileName: 'cosmos_transfer_spec.json',
    codePreview: `{
  "pipeline": "nvidia/cosmos-transfer-2.5",
  "task": "sim2real_photorealism_augmentation",
  "conditioning_sources": {
    "semantic_segmentation": {
      "api": "omni.syntheticdata.SemanticsAPI",
      "colormap": "ade20k_robotics_12class",
      "control_weight": 1.00,
      "guidance_start": 0.0,
      "guidance_end": 1.0
    },
    "edge_preservation": {
      "detector": "canny",
      "low_threshold": 100,
      "high_threshold": 200,
      "control_weight": 0.85
    },
    "action_invariance_lock": {
      "lock_geometry": true,
      "lock_joint_kinematics": true,
      "enforce_rigid_boundaries": true
    }
  },
  "prompt": "cinematic photorealistic automated warehouse, sodium high-bay lighting, specular reflections on epoxy floor, scuff marks, realistic dust particles, 8k resolution, uncompressed raw footage",
  "negative_prompt": "cartoon, 3d render, low poly, oversaturated, blurry, artifacts, phantom limbs, geometry deformation",
  "diffusion_parameters": {
    "guidance_scale": 7.5,
    "num_inference_steps": 30,
    "seed": 420881,
    "fps": 60
  }
}`,
  },
  {
    id: 'sample-lerobot-dataloader',
    title: 'Hugging Face LeRobot v2 PyTorch Streaming Loader',
    category: 'dataloader_script',
    fileFormat: 'Python (.py) PyTorch / LeRobot',
    sizeFormatted: '8.2 KB',
    description: 'Zero-copy streaming DataLoader reading parquet episodes and MP4 video shards directly into PyTorch for Diffusion Policy and OpenVLA training.',
    techStack: ['Hugging Face LeRobot', 'PyTorch', 'Parquet', 'VLA'],
    downloadFileName: 'diffraction_lerobot_loader.py',
    codePreview: `import torch
from torch.utils.data import DataLoader
from lerobot.common.datasets.lerobot_dataset import LeRobotDataset

def create_diffraction_vla_dataloader(batch_size: int = 64):
    """
    Direct zero-copy DataLoader for Diffraction Cosmos-augmented synthetic datasets.
    Supports sub-millisecond batch collation for Diffusion Policies and Action Chunking (ACT).
    """
    dataset = LeRobotDataset(
        repo_id="diffraction/amr-pallet-docking-vla-250k",
        split="train",
        use_videos=True,
        delta_timestamps={
            "observation.images.primary_rgb": [-0.1, 0.0],
            "observation.images.depth_map": [-0.1, 0.0],
            "action": [0.0, 0.05, 0.10, 0.15, 0.20],
        },
    )

    loader = DataLoader(
        dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=8,
        pin_memory=True,
        prefetch_factor=4,
    )
    print(f"Loaded {len(dataset)} episodes ({len(dataset) * 150} transitions) for Physical AI training.")
    return loader`,
  },
];

