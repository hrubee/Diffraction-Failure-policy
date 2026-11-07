/**
 * Infrastructure Layer: Audit Pipeline Gateway
 */

import { requestJson } from './api-client';
import { AuditVerdict, RegulatoryClause, RemediationPackage } from '../domain/kinematics/types';

interface RawBackendAuditResponse {
  status: 'CERTIFIED_SAFE' | 'CONDITIONAL_PASS' | 'FAILED_CRITICAL_RISK';
  compliance_score: number;
  total_scenarios: number;
  passed_scenarios: number;
  failed_scenarios: number;
  safe_friction: number;
  incident_id: string;
  html_report_filename: string;
  json_report_filename: string;
  usd_stage_filename: string;
  recommendations: string[];
  failure_breakdown: Record<string, number>;
  sysid_profile?: {
    estimated_surface_friction_mu: number;
    estimated_ambient_lux: number;
    observed_max_slip_ratio: number;
  };
  regulatory_compliance?: Array<{
    standard: string;
    clause: string;
    title: string;
    status: 'COMPLIANT' | 'CONDITIONAL' | 'NON_COMPLIANT';
    requirement_summary: string;
    observed_margin: string;
    pass_criteria: string;
  }>;
  remediation?: {
    speed_filter_mask_filename: string;
    speed_filter_mask_yaml: string;
    controller_patch_filename: string;
    controller_patch_yaml: string;
    rl_training_filename: string;
    summary_instructions: string;
  };
}

export const executeVerificationAudit = async (
  scenarioCount: number,
  incidentId?: string
): Promise<AuditVerdict> => {
  let url = `/api/v1/simulation/run-audit?scenario_count=${scenarioCount}`;
  if (incidentId) {
    url += `&incident_id=${encodeURIComponent(incidentId)}`;
  }

  const raw = await requestJson<RawBackendAuditResponse>(url, { method: 'POST' });

  const regulatoryCompliance: RegulatoryClause[] = (raw.regulatory_compliance || []).map((r) => ({
    standard: r.standard,
    clause: r.clause,
    title: r.title,
    status: r.status,
    requirementSummary: r.requirement_summary,
    observedMargin: r.observed_margin,
    passCriteria: r.pass_criteria,
  }));

  let remediation: RemediationPackage | undefined;
  if (raw.remediation) {
    remediation = {
      speedFilterMaskFilename: raw.remediation.speed_filter_mask_filename,
      speedFilterMaskYaml: raw.remediation.speed_filter_mask_yaml,
      controllerPatchFilename: raw.remediation.controller_patch_filename,
      controllerPatchYaml: raw.remediation.controller_patch_yaml,
      rlTrainingFilename: raw.remediation.rl_training_filename,
      summaryInstructions: raw.remediation.summary_instructions,
    };
  }

  return {
    status: raw.status,
    complianceScore: raw.compliance_score,
    totalScenarios: raw.total_scenarios,
    passedScenarios: raw.passed_scenarios,
    failedScenarios: raw.failed_scenarios,
    safeFriction: raw.safe_friction,
    incidentId: raw.incident_id,
    htmlReportFilename: raw.html_report_filename,
    jsonReportFilename: raw.json_report_filename,
    usdStageFilename: raw.usd_stage_filename,
    recommendations: raw.recommendations || [],
    failureBreakdown: raw.failure_breakdown || {},
    sysIdProfile: raw.sysid_profile,
    regulatoryCompliance,
    remediation,
  };
};
