/**
 * Reactive Domain Hook: Physical AI Verification Audit Execution
 * Integrates high-density operational simulation streaming ("Labor Illusion")
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { SCENARIO_PRESETS } from '../domain/kinematics/scenarios';
import { ScenarioKinematicsConfig, AuditVerdict, OdometryPoint } from '../domain/kinematics/types';
import { executeVerificationAudit } from '../infrastructure/audit-gateway';
import { triggerSyntheticScenario, uploadMcapFile } from '../infrastructure/telemetry-ingest';

export interface UseVerificationAuditReturn {
  activeScenario: ScenarioKinematicsConfig;
  scenarioCount: number;
  setScenarioCount: (n: number) => void;
  isLoading: boolean;
  isSimulating: boolean;
  statusText: string;
  verdict: AuditVerdict | null;
  uploadedFileName: string | null;
  uploadedFileDetails: string | null;
  trajectoryPoints: {
    planned: readonly OdometryPoint[];
    actual: readonly OdometryPoint[];
    hazard: readonly OdometryPoint[];
    hazardLabel: string;
  };
  selectScenario: (key: string) => Promise<void>;
  handleFileUpload: (file: File) => Promise<void>;
  runAudit: () => Promise<void>;
  finishSimulation: () => void;
  skipSimulation: () => void;
}

export const useVerificationAudit = (): UseVerificationAuditReturn => {
  const [activeScenario, setActiveScenario] = useState<ScenarioKinematicsConfig>(
    SCENARIO_PRESETS.humanoid_zmp_slip
  );
  const [scenarioCount, setScenarioCount] = useState<number>(150);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>('STANDBY');
  const [verdict, setVerdict] = useState<AuditVerdict | null>(null);
  const [currentIncidentId, setCurrentIncidentId] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileDetails, setUploadedFileDetails] = useState<string | null>(null);
  const [trajectoryPoints, setTrajectoryPoints] = useState({
    planned: SCENARIO_PRESETS.humanoid_zmp_slip.planned,
    actual: SCENARIO_PRESETS.humanoid_zmp_slip.actual,
    hazard: SCENARIO_PRESETS.humanoid_zmp_slip.hazard,
    hazardLabel: SCENARIO_PRESETS.humanoid_zmp_slip.hazardLabel,
  });

  const pendingVerdictRef = useRef<AuditVerdict | null>(null);

  const selectScenario = useCallback(async (key: string) => {
    const config = SCENARIO_PRESETS[key] || SCENARIO_PRESETS.humanoid_zmp_slip;
    setActiveScenario(config);
    setIsLoading(true);
    setStatusText(`Capturing ${config.name} from autonomous proving ground…`);

    try {
      const res = await triggerSyntheticScenario(key);
      const incId = res.incident_file.replace('.mcap', '');
      setCurrentIncidentId(incId);
      setUploadedFileName(res.incident_file);
      setUploadedFileDetails(`Robot: ${config.robotId} • ${res.messages} msgs • ${config.facility} • ${config.standard}`);
      setTrajectoryPoints({
        planned: config.planned,
        actual: config.actual,
        hazard: config.hazard,
        hazardLabel: config.hazardLabel,
      });
      setStatusText('READY FOR AUDIT');
    } catch (err) {
      console.error('Failed to trigger scenario:', err);
      setStatusText('ERROR');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.mcap')) {
      alert('Please drop or select a valid ROS 2 / Zenoh MCAP container (.mcap).');
      return;
    }

    setIsLoading(true);
    setStatusText(`Ingesting ${file.name}…`);
    try {
      const res = await uploadMcapFile(file);
      setCurrentIncidentId(res.incident_id);
      setUploadedFileName(file.name);
      const details = res.details || {};
      setUploadedFileDetails(
        `Robot: ${details.robot_id || 'AMR'} • ${details.total_messages || 0} msgs • ${details.trigger_type || 'custom_drop'}`
      );
      if (res.trajectory && res.trajectory.length > 0) {
        setTrajectoryPoints((prev) => ({
          ...prev,
          actual: res.trajectory!,
        }));
      }
      setStatusText('READY FOR AUDIT');
    } catch (err) {
      console.error('File upload failed:', err);
      alert('Upload failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const finishSimulation = useCallback(() => {
    if (pendingVerdictRef.current) {
      setVerdict(pendingVerdictRef.current);
      setStatusText(pendingVerdictRef.current.status);
    }
    setIsSimulating(false);
    setIsLoading(false);
  }, []);

  const skipSimulation = useCallback(() => {
    finishSimulation();
  }, [finishSimulation]);

  const runAudit = useCallback(async () => {
    setIsLoading(true);
    setIsSimulating(true);
    setVerdict(null);
    setStatusText(`Allocating 8x GPU workers for ${scenarioCount} rollouts…`);

    try {
      // Execute backend audit pipeline asynchronously while UI streams simulation telemetry
      const res = await executeVerificationAudit(scenarioCount, currentIncidentId || undefined);
      pendingVerdictRef.current = res;
    } catch (err) {
      console.error('Audit failed:', err);
      setIsSimulating(false);
      setIsLoading(false);
      alert('Verification audit execution failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  }, [scenarioCount, currentIncidentId]);

  return {
    activeScenario,
    scenarioCount,
    setScenarioCount,
    isLoading,
    isSimulating,
    statusText,
    verdict,
    uploadedFileName,
    uploadedFileDetails,
    trajectoryPoints,
    selectScenario,
    handleFileUpload,
    runAudit,
    finishSimulation,
    skipSimulation,
  };
};
