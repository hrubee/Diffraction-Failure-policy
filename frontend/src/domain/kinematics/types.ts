/**
 * Domain Entities: Kinematics, Telemetry & Audit Verdicts
 * Pure TypeScript models decoupled from any UI framework.
 */

export type RobotModality =
  | 'bipedal_humanoid'
  | 'heavy_ackermann_hauler'
  | 'articulated_manipulator_arm'
  | 'industrial_differential_drive'
  | 'urban_delivery_rover';

export interface OdometryPoint {
  readonly x: number;
  readonly y: number;
}

export interface ScenarioKinematicsConfig {
  readonly key: string;
  readonly modality: RobotModality;
  readonly name: string;
  readonly robotId: string;
  readonly facility: string;
  readonly standard: string;
  readonly trigger: string;
  readonly planned: readonly OdometryPoint[];
  readonly actual: readonly OdometryPoint[];
  readonly hazard: readonly OdometryPoint[];
  readonly hazardLabel: string;
}

export interface RegulatoryClause {
  readonly standard: string;
  readonly clause: string;
  readonly title: string;
  readonly status: 'COMPLIANT' | 'CONDITIONAL' | 'NON_COMPLIANT';
  readonly requirementSummary: string;
  readonly observedMargin: string;
  readonly passCriteria: string;
}

export interface RemediationPackage {
  readonly speedFilterMaskFilename: string;
  readonly speedFilterMaskYaml: string;
  readonly controllerPatchFilename: string;
  readonly controllerPatchYaml: string;
  readonly rlTrainingFilename: string;
  readonly summaryInstructions: string;
}

export interface AuditVerdict {
  readonly status: 'CERTIFIED_SAFE' | 'CONDITIONAL_PASS' | 'FAILED_CRITICAL_RISK' | 'STANDBY';
  readonly complianceScore: number;
  readonly totalScenarios: number;
  readonly passedScenarios: number;
  readonly failedScenarios: number;
  readonly safeFriction: number;
  readonly incidentId: string;
  readonly htmlReportFilename: string;
  readonly jsonReportFilename: string;
  readonly usdStageFilename: string;
  readonly recommendations: readonly string[];
  readonly failureBreakdown: Record<string, number>;
  readonly sysIdProfile?: {
    readonly estimated_surface_friction_mu: number;
    readonly estimated_ambient_lux: number;
    readonly observed_max_slip_ratio: number;
  };
  readonly regulatoryCompliance: readonly RegulatoryClause[];
  readonly remediation?: RemediationPackage;
}
