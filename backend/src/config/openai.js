/**
 * ============================================================================
 * StoreForge AI
 * OpenAI Configuration
 * ============================================================================
 *
 * File:
 *   backend/src/config/openai.js
 *
 * Purpose:
 *   Central configuration and client for OpenAI-powered StoreForge features.
 *
 * Used by:
 *   - modules/ai/ai.service.js
 *   - modules/ai/prompt.service.js
 *   - AI Store Generator
 *
 * IMPORTANT:
 *   Never expose OPENAI_API_KEY to the frontend.
 * ============================================================================
 */

'use strict';

const OpenAI = require('openai');

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

const apiKey = process.env.OPENAI_API_KEY;

const defaultModel =
  process.env.OPENAI_MODEL || 'gpt-4o-mini';

const timeout =
  Number(process.env.OPENAI_TIMEOUT_MS) || 60000;

const maxRetries =
  Number(process.env.OPENAI_MAX_RETRIES) || 2;


// ============================================================================
// VALIDATION
// ============================================================================

function validateOpenAIConfig() {
  if (!apiKey) {
    throw new Error(
      'OPENAI_API_KEY is not configured. Add OPENAI_API_KEY to your .env file.'
    );
  }

  if (!defaultModel) {
    throw new Error(
      'OPENAI_MODEL is not configured.'
    );
  }

  return true;
}


// ============================================================================
// OPENAI CLIENT
// ============================================================================

let openaiClient = null;

function getOpenAIClient() {
  if (openaiClient) {
    return openaiClient;
  }

  validateOpenAIConfig();

  openaiClient = new OpenAI({
    apiKey,
    timeout,
    maxRetries
  });

  return openaiClient;
}


// ============================================================================
// MODEL CONFIGURATION
// ============================================================================

function getOpenAIModel() {
  return defaultModel;
}


// ============================================================================
// CONFIGURATION INFORMATION
// ============================================================================

function getOpenAIConfig() {
  return {
    configured: Boolean(apiKey),
    model: defaultModel,
    timeout,
    maxRetries
  };
}


// ============================================================================
// CONNECTION / API HEALTH CHECK
// ============================================================================

async function testOpenAIConnection() {
  const client = getOpenAIClient();

  const response = await client.models.retrieve(defaultModel);

  return {
    success: true,
    model: response.id
  };
}


// ============================================================================
// RESET CLIENT
// ============================================================================
//
// Useful for tests or controlled configuration reloads.
// ============================================================================

function resetOpenAIClient() {
  openaiClient = null;
}


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  getOpenAIClient,
  getOpenAIModel,
  getOpenAIConfig,
  validateOpenAIConfig,
  testOpenAIConnection,
  resetOpenAIClient
};
