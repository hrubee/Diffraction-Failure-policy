/**
 * Reactive Domain Hook: Enterprise Workspace & Credentials
 */

'use client';

import { useState, useCallback } from 'react';
import { DEFAULT_API_KEY } from '../infrastructure/api-client';

export interface WorkspaceCredentials {
  tenantId: string;
  organization: string;
  apiKey: string;
  isModalOpen: boolean;
  copied: boolean;
  openModal: () => void;
  closeModal: () => void;
  copyApiKey: () => Promise<void>;
}

export const useWorkspaceCredentials = (): WorkspaceCredentials => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const copyApiKey = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(DEFAULT_API_KEY);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }, []);

  return {
    tenantId: 'tenant_enterprise_fleet_prod',
    organization: 'Autonomous Systems Global OEM',
    apiKey: DEFAULT_API_KEY,
    isModalOpen,
    copied,
    openModal,
    closeModal,
    copyApiKey,
  };
};
