/**
 * ============================================================================
 * StoreForge AI
 * Deployment Service
 * ============================================================================
 *
 * File:
 * frontend/src/services/deployment.service.ts
 *
 * Purpose:
 * - Get deployment history
 * - Get a deployment
 * - Get deployment status
 * - Create/start a deployment
 * - Cancel a deployment
 *
 * ============================================================================
 */

'use client';
import deploymentApi from '@/lib/api';


// ============================================================================
// TYPES
// ============================================================================

export interface Deployment {

  id: string;

  _id?: string;

  storeId?: string;

  userId?: string;

  themeId?: string;

  themeName?: string;

  platform?: string;

  status?: string;

  type?: string;

  environment?: string;

  shopifyThemeId?: string;

  deploymentUrl?: string;

  previewUrl?: string;

  error?: string;

  errorMessage?: string;

  startedAt?: string;

  completedAt?: string;

  createdAt?: string;

  updatedAt?: string;

}


export interface CreateDeploymentData {

  themeId: string;

  environment?: string;

  type?: string;

}


export interface DeploymentResponse {

  success?: boolean;

  message?: string;

  deployment?: Deployment;

  data?:
    | Deployment
    | {
        deployment?: Deployment;
      };

}


export interface DeploymentsResponse {

  success?: boolean;

  message?: string;

  deployments?: Deployment[];

  data?:
    | Deployment[]
    | {
        deployments?: Deployment[];
      };

}


// ============================================================================
// RESPONSE HELPERS
// ============================================================================

function extractDeployment(
  response: DeploymentResponse
): Deployment | null {

  if (response.deployment) {

    return response.deployment;

  }


  if (
    response.data &&
    !Array.isArray(response.data)
  ) {

    if (
      'deployment' in response.data &&
      response.data.deployment
    ) {

      return response.data.deployment;

    }


    if (
      'id' in response.data ||
      '_id' in response.data
    ) {

      return response.data as Deployment;

    }

  }


  return null;

}


function extractDeployments(
  response: DeploymentsResponse
): Deployment[] {

  if (
    Array.isArray(
      response.deployments
    )
  ) {

    return response.deployments;

  }


  if (
    Array.isArray(response.data)
  ) {

    return response.data;

  }


  if (
    response.data &&
    !Array.isArray(response.data) &&
    Array.isArray(
      response.data.deployments
    )
  ) {

    return response.data.deployments;

  }


  return [];

}

// ============================================================================
// GET DEPLOYMENT HISTORY
// ============================================================================

export async function getDeployments(
  storeId: string
): Promise<Deployment[]> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  const response =
    await deploymentApi.list<DeploymentsResponse>(
      storeId
    );


  return extractDeployments(
    response
  );

}


// ============================================================================
// GET SINGLE DEPLOYMENT
// ============================================================================

export async function getDeployment(
  storeId: string,
  deploymentId: string
): Promise<Deployment> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  if (!deploymentId) {

    throw new Error(
      'Deployment ID is required.'
    );

  }


  const response =
    await deploymentApi.get<DeploymentResponse>(
      storeId,
      deploymentId
    );


  const deployment =
    extractDeployment(
      response
    );


  if (!deployment) {

    throw new Error(
      'Deployment was not returned by the server.'
    );

  }


  return deployment;

}


// ============================================================================
// CREATE / START DEPLOYMENT
// ============================================================================

export async function createDeployment(
  storeId: string,
  data: CreateDeploymentData
): Promise<Deployment> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  if (!data.themeId) {

    throw new Error(
      'Theme ID is required.'
    );

  }

  const response =
  await deploymentApi.create<DeploymentResponse>(
    storeId,
    data as unknown as Record<string, unknown>
  );


  const deployment =
    extractDeployment(
      response
    );


  if (!deployment) {

    throw new Error(
      'Deployment was not returned after creation.'
    );

  }


  return deployment;

}


// ============================================================================
// GET DEPLOYMENT STATUS
// ============================================================================

export async function getDeploymentStatus(
  storeId: string,
  deploymentId: string
): Promise<Deployment> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  if (!deploymentId) {

    throw new Error(
      'Deployment ID is required.'
    );

  }


  const response =
    await deploymentApi.status<DeploymentResponse>(
      storeId,
      deploymentId
    );


  const deployment =
    extractDeployment(
      response
    );


  if (!deployment) {

    throw new Error(
      'Deployment status was not returned by the server.'
    );

  }


  return deployment;

}


// ============================================================================
// CANCEL DEPLOYMENT
// ============================================================================

export async function cancelDeployment(
  storeId: string,
  deploymentId: string
): Promise<void> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  if (!deploymentId) {

    throw new Error(
      'Deployment ID is required.'
    );

  }


  await deploymentApi.cancel(
    storeId,
    deploymentId
  );

}


// ============================================================================
// STATUS HELPERS
// ============================================================================

export function isDeploymentPending(
  deployment: Deployment
): boolean {

  return (
    deployment.status === 'pending' ||
    deployment.status === 'queued'
  );

}


export function isDeploymentRunning(
  deployment: Deployment
): boolean {

  return (
    deployment.status === 'running' ||
    deployment.status === 'processing' ||
    deployment.status === 'deploying'
  );

}


export function isDeploymentSuccessful(
  deployment: Deployment
): boolean {

  return (
    deployment.status === 'completed' ||
    deployment.status === 'success' ||
    deployment.status === 'deployed'
  );

}


export function isDeploymentFailed(
  deployment: Deployment
): boolean {

  return (
    deployment.status === 'failed' ||
    deployment.status === 'error'
  );

}


export function isDeploymentFinished(
  deployment: Deployment
): boolean {

  return (
    isDeploymentSuccessful(deployment) ||
    isDeploymentFailed(deployment) ||
    deployment.status === 'cancelled'
  );

}


// ============================================================================
// DEFAULT EXPORT
// ============================================================================

const deploymentService = {

  getDeployments,

  getDeployment,

  createDeployment,

  getDeploymentStatus,

  cancelDeployment,

  isDeploymentPending,

  isDeploymentRunning,

  isDeploymentSuccessful,

  isDeploymentFailed,

  isDeploymentFinished

};


export default deploymentService;
