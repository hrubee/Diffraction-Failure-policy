/**
 * Infrastructure Layer: Telemetry Ingestion Client
 */

import { requestJson } from './api-client';

export interface TelemetryUploadResponse {
  readonly status: string;
  readonly incident_id: string;
  readonly trajectory?: readonly { x: number; y: number }[];
  readonly details?: {
    readonly robot_id?: string;
    readonly total_messages?: number;
    readonly trigger_type?: string;
  };
}

export interface SyntheticIncidentResponse {
  readonly status: string;
  readonly incident_id: string;
  readonly incident_file: string;
  readonly trigger_type: string;
  readonly messages: number;
}

export const uploadMcapFile = async (file: File): Promise<TelemetryUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  return requestJson<TelemetryUploadResponse>('/api/v1/telemetry/upload', {
    method: 'POST',
    body: formData,
  });
};

export const triggerSyntheticScenario = async (
  scenarioKey: string
): Promise<SyntheticIncidentResponse> => {
  return requestJson<SyntheticIncidentResponse>(
    `/api/v1/simulation/simulate-incident?scenario=${encodeURIComponent(scenarioKey)}`,
    {
      method: 'POST',
    }
  );
};
