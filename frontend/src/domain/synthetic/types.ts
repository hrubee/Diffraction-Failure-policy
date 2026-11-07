/**
 * Domain Entities: NVIDIA Isaac Sim / Isaac Lab Synthetic Data Factory
 * Defines types for Robot Embodiments, Procedural OpenUSD Worlds,
 * Domain Randomization (DR) ranges, Multimodal Sensor Suites,
 * Generation Jobs, and Dataset Manifests.
 */

export type RobotCategory = 'Humanoid' | 'Industrial AMR' | 'Manipulator' | 'Quadruped';

export interface RobotEmbodiment {
  readonly id: string;
  readonly name: string;
  readonly category: RobotCategory;
  readonly dof: number;
  readonly massKg: number;
  readonly actuators: string;
  readonly defaultSensors: readonly string[];
  readonly usdAsset: string;
  readonly description: string;
  readonly controlFrequencyHz: number;
}

export interface ProceduralEnvironment {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly description: string;
  readonly usdStage: string;
  readonly lightingLuxRange: readonly [number, number];
  readonly frictionMuRange: readonly [number, number];
  readonly clutterLevels: readonly string[];
  readonly sampleTasks: readonly string[];
}

export interface DomainRandomizationConfig {
  readonly lightingLuxMin: number;
  readonly lightingLuxMax: number;
  readonly frictionMuMin: number;
  readonly frictionMuMax: number;
  readonly massVariancePercent: number;
  readonly sensorLatencyJitterMs: number;
  readonly cameraNoiseSnr: number;
  readonly lidarAtmosphericDropout: number;
}

export interface SensorSuiteConfig {
  readonly rgbResolution: '720p' | '1080p' | '4K';
  readonly rgbFps: number;
  readonly includeDepth: boolean;
  readonly depthResolution: '720p' | '1080p';
  readonly includeSemanticSegmentation: boolean;
  readonly includeLidar: boolean;
  readonly lidarBeams: 16 | 32 | 64 | 128;
  readonly proprioceptionFrequencyHz: number;
}

export type DatasetExportFormat = 'LeRobot_v2' | 'OpenX_RLDS' | 'HDF5_PyTorch' | 'MCAP_ROS2';

export interface SyntheticGenerationJob {
  readonly id: string;
  readonly name: string;
  readonly embodimentId: string;
  readonly environmentId: string;
  readonly targetEpisodes: number;
  readonly completedEpisodes: number;
  readonly status: 'QUEUED' | 'GENERATING' | 'COMPLETED' | 'PAUSED';
  readonly fps: number;
  readonly activeGpuWorkers: number;
  readonly storageGb: number;
  readonly sim2realScore: number;
  readonly format: DatasetExportFormat;
  readonly createdAt: number;
  readonly clusterNodes: string;
  readonly lightingLuxRange: readonly [number, number];
  readonly frictionMuRange: readonly [number, number];
  readonly sensorSuite: readonly string[];
}

export interface PrebuiltSyntheticDataset {
  readonly id: string;
  readonly title: string;
  readonly embodiment: string;
  readonly task: string;
  readonly episodes: number;
  readonly framesTotal: number;
  readonly sizeGb: number;
  readonly format: string;
  readonly sim2realScore: number;
  readonly huggingfaceSlug: string;
  readonly description: string;
  readonly sensorStreams: readonly string[];
  readonly license: string;
}

export interface Sim2RealBenchmarkData {
  readonly overallSim2RealFidelityPct: number;
  readonly policyZeroShotTransferRate: string;
  readonly distributions: {
    readonly frictionSlipWassersteinDistance: number;
    readonly sensorNoiseCovarianceMatchPct: number;
    readonly latencyJitterKlDivergence: number;
    readonly photometricHistogramIntersection: number;
  };
  readonly benchmarkedPlatforms: readonly {
    readonly robot: string;
    readonly realLogsCompared: number;
    readonly transferSuccess: string;
  }[];
  readonly domainRandomizationDimensions: readonly {
    readonly name: string;
    readonly syntheticBounds: string;
    readonly realDistributionP99: string;
  }[];
}
