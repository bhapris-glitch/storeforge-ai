/**
 * ============================================================================
 * StoreForge AI
 * Model Router
 * ============================================================================
 *
 * File:
 * backend/src/modules/ai/modelRouter.js
 *
 * Purpose:
 * - Select the AI model for StoreForge generation tasks
 * - Support plan-based model selection
 * - Support task-based model selection
 * - Keep model/provider decisions in one place
 *
 * NOT USED FOR:
 * - Chatbot
 * - Sales agent
 * - Customer conversations
 * - Chat memory
 * - Cart recovery
 *
 * ============================================================================
 */

'use strict';


// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

const DEFAULT_PROVIDER =
  process.env.AI_PROVIDER || 'openai';

const DEFAULT_MODEL =
  process.env.OPENAI_MODEL || 'gpt-4o-mini';


// ============================================================================
// MODEL CONFIGURATION
// ============================================================================
//
// These can later be changed without modifying the rest of the application.
//
// Current StoreForge default:
// OpenAI
//
// Claude can be added later through the same router if desired.
//

const MODELS = {

  openai: {

    default:
      process.env.OPENAI_MODEL ||
      'gpt-4o-mini',

    fast:
      process.env.OPENAI_FAST_MODEL ||
      'gpt-4o-mini',

    quality:
      process.env.OPENAI_QUALITY_MODEL ||
      'gpt-4o-mini'

  }

};


// ============================================================================
// PLAN → MODEL CONFIGURATION
// ============================================================================
//
// Keep this centralized.
//
// Example future setup:
//
// Starter   → fast
// Growth    → fast
// Premium   → quality
// Enterprise → quality
//

const PLAN_MODEL_MAP = {

  starter: {
    provider: 'openai',
    tier: 'fast'
  },

  growth: {
    provider: 'openai',
    tier: 'fast'
  },

  premium: {
    provider: 'openai',
    tier: 'quality'
  },

  enterprise: {
    provider: 'openai',
    tier: 'quality'
  },

  free: {
    provider: 'openai',
    tier: 'fast'
  }

};


// ============================================================================
// TASK → MODEL CONFIGURATION
// ============================================================================
//
// StoreForge generation tasks only.
//

const TASK_MODEL_MAP = {

  product: {
    tier: 'quality'
  },

  product_description: {
    tier: 'fast'
  },

  product_seo: {
    tier: 'fast'
  },

  store_content: {
    tier: 'quality'
  },

  branding: {
    tier: 'quality'
  },

  theme: {
    tier: 'quality'
  },

  liquid: {
    tier: 'quality'
  },

  general: {
    tier: 'fast'
  }

};


// ============================================================================
// NORMALIZE PLAN
// ============================================================================

const normalizePlan = (
  plan
) => {

  if (!plan) {

    return 'starter';

  }


  return String(plan)
    .trim()
    .toLowerCase();

};


// ============================================================================
// NORMALIZE TASK
// ============================================================================

const normalizeTask = (
  task
) => {

  if (!task) {

    return 'general';

  }


  return String(task)
    .trim()
    .toLowerCase();

};


// ============================================================================
// GET PROVIDER
// ============================================================================

const getProvider = (
  requestedProvider
) => {

  const provider =
    String(
      requestedProvider ||
      DEFAULT_PROVIDER
    )
      .trim()
      .toLowerCase();


  if (
    !MODELS[provider]
  ) {

    throw new Error(
      `Unsupported AI provider: ${provider}`
    );

  }


  return provider;

};


// ============================================================================
// GET MODEL BY TIER
// ============================================================================

const getModelByTier = (
  provider,
  tier
) => {

  const providerModels =
    MODELS[provider];


  if (!providerModels) {

    throw new Error(
      `AI provider is not configured: ${provider}`
    );

  }


  const selectedTier =
    tier || 'default';


  return (
    providerModels[selectedTier] ||
    providerModels.default ||
    DEFAULT_MODEL
  );

};


// ============================================================================
// GET MODEL FOR PLAN
// ============================================================================

const getModelForPlan = ({
  plan = 'starter',
  provider
} = {}) => {

  const normalizedPlan =
    normalizePlan(plan);


  const planConfig =
    PLAN_MODEL_MAP[
      normalizedPlan
    ] ||
    PLAN_MODEL_MAP.starter;


  const selectedProvider =
    getProvider(
      provider ||
      planConfig.provider
    );


  const model =
    getModelByTier(

      selectedProvider,

      planConfig.tier

    );


  return {

    provider:
      selectedProvider,

    model,

    tier:
      planConfig.tier,

    plan:
      normalizedPlan

  };

};


// ============================================================================
// GET MODEL FOR TASK
// ============================================================================

const getModelForTask = ({
  task = 'general',
  provider,
  plan = 'starter'
} = {}) => {

  const normalizedTask =
    normalizeTask(task);


  const taskConfig =
    TASK_MODEL_MAP[
      normalizedTask
    ] ||
    TASK_MODEL_MAP.general;


  const planConfig =
    PLAN_MODEL_MAP[
      normalizePlan(plan)
    ] ||
    PLAN_MODEL_MAP.starter;


  const selectedProvider =
    getProvider(
      provider ||
      planConfig.provider
    );


  const model =
    getModelByTier(

      selectedProvider,

      taskConfig.tier

    );


  return {

    provider:
      selectedProvider,

    model,

    tier:
      taskConfig.tier,

    task:
      normalizedTask,

    plan:
      normalizePlan(plan)

  };

};


// ============================================================================
// RESOLVE MODEL
// ============================================================================
//
// Main function used by StoreForge services.
//
// Priority:
//
// 1. Explicit model
// 2. Task configuration
// 3. Plan configuration
// 4. Default model
//

const resolveModel = ({
  model,
  provider,
  task = 'general',
  plan = 'starter'
} = {}) => {

  // --------------------------------------------------------------------------
  // Explicit model
  // --------------------------------------------------------------------------

  if (model) {

    const selectedProvider =
      getProvider(
        provider
      );


    return {

      provider:
        selectedProvider,

      model:
        String(model),

      task:
        normalizeTask(task),

      plan:
        normalizePlan(plan),

      source:
        'explicit'

    };

  }


  // --------------------------------------------------------------------------
  // Task based model
  // --------------------------------------------------------------------------

  const taskModel =
    getModelForTask({

      task,

      provider,

      plan

    });


  return {

    ...taskModel,

    source:
      'task'

  };

};


// ============================================================================
// CHECK PROVIDER SUPPORT
// ============================================================================

const isProviderSupported = (
  provider
) => {

  if (!provider) {

    return false;

  }


  return Boolean(
    MODELS[
      String(provider)
        .trim()
        .toLowerCase()
    ]
  );

};


// ============================================================================
// GET SUPPORTED PROVIDERS
// ============================================================================

const getSupportedProviders = () => {

  return Object.keys(
    MODELS
  );

};


// ============================================================================
// GET AVAILABLE MODELS
// ============================================================================

const getAvailableModels = (
  provider
) => {

  const selectedProvider =
    getProvider(
      provider
    );


  return {

    provider:
      selectedProvider,

    models:
      {
        ...MODELS[
          selectedProvider
        ]
      }

  };

};


// ============================================================================
// GET PLAN CONFIGURATION
// ============================================================================

const getPlanConfiguration = (
  plan
) => {

  const normalizedPlan =
    normalizePlan(plan);


  return (
    PLAN_MODEL_MAP[
      normalizedPlan
    ] ||
    PLAN_MODEL_MAP.starter
  );

};


// ============================================================================
// GET TASK CONFIGURATION
// ============================================================================

const getTaskConfiguration = (
  task
) => {

  const normalizedTask =
    normalizeTask(task);


  return (
    TASK_MODEL_MAP[
      normalizedTask
    ] ||
    TASK_MODEL_MAP.general
  );

};


// ============================================================================
// VALIDATE AI CONFIGURATION
// ============================================================================

const validateConfiguration = () => {

  const provider =
    DEFAULT_PROVIDER
      .trim()
      .toLowerCase();


  if (
    !MODELS[provider]
  ) {

    return {

      valid: false,

      provider,

      message:
        `Unsupported AI provider: ${provider}`

    };

  }


  const model =
    getModelByTier(
      provider,
      'default'
    );


  if (!model) {

    return {

      valid: false,

      provider,

      message:
        'No default AI model configured.'

    };

  }


  return {

    valid: true,

    provider,

    model

  };

};


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {

  MODELS,

  PLAN_MODEL_MAP,

  TASK_MODEL_MAP,

  getProvider,

  getModelByTier,

  getModelForPlan,

  getModelForTask,

  resolveModel,

  isProviderSupported,

  getSupportedProviders,

  getAvailableModels,

  getPlanConfiguration,

  getTaskConfiguration,

  validateConfiguration

};
