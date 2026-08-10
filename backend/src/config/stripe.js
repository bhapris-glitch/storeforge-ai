/**
 * ============================================================================
 * StoreForge AI
 * Stripe Configuration
 * ============================================================================
 *
 * File:
 *   backend/src/config/stripe.js
 *
 * Purpose:
 *   Central Stripe client/configuration for StoreForge billing.
 *
 * Used by:
 *   - modules/billing/billing.service.js
 *   - Stripe checkout/subscriptions
 *   - Stripe webhook handling
 *
 * Currency:
 *   USD is the primary billing currency.
 *
 * IMPORTANT:
 *   Never expose STRIPE_SECRET_KEY to the frontend.
 *   Never put Stripe secret keys in source code.
 * ============================================================================
 */

'use strict';

const Stripe = require('stripe');

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

const secretKey = process.env.STRIPE_SECRET_KEY;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const defaultCurrency =
  (process.env.STRIPE_CURRENCY || 'usd').toLowerCase();


// ============================================================================
// VALIDATION
// ============================================================================

function validateStripeConfig() {
  if (!secretKey) {
    throw new Error(
      'STRIPE_SECRET_KEY is not configured. Add STRIPE_SECRET_KEY to your .env file.'
    );
  }

  if (!defaultCurrency) {
    throw new Error(
      'STRIPE_CURRENCY is not configured.'
    );
  }

  return true;
}


// ============================================================================
// STRIPE CLIENT
// ============================================================================

let stripeClient = null;

function getStripeClient() {
  if (stripeClient) {
    return stripeClient;
  }

  validateStripeConfig();

  stripeClient = new Stripe(secretKey);

  return stripeClient;
}


// ============================================================================
// WEBHOOK SECRET
// ============================================================================

function getStripeWebhookSecret() {
  if (!webhookSecret) {
    throw new Error(
      'STRIPE_WEBHOOK_SECRET is not configured.'
    );
  }

  return webhookSecret;
}


// ============================================================================
// DEFAULT CURRENCY
// ============================================================================

function getStripeCurrency() {
  return defaultCurrency;
}


// ============================================================================
// CONFIGURATION INFORMATION
// ============================================================================

function getStripeConfig() {
  return {
    configured: Boolean(secretKey),
    webhookConfigured: Boolean(webhookSecret),
    currency: defaultCurrency
  };
}


// ============================================================================
// STRIPE HEALTH CHECK
// ============================================================================

async function testStripeConnection() {
  const stripe = getStripeClient();

  const account = await stripe.accounts.retrieve();

  return {
    success: true,
    accountId: account.id
  };
}


// ============================================================================
// RESET CLIENT
// ============================================================================
//
// Useful for tests or controlled configuration reloads.
// ============================================================================

function resetStripeClient() {
  stripeClient = null;
}


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  getStripeClient,
  getStripeWebhookSecret,
  getStripeCurrency,
  getStripeConfig,
  validateStripeConfig,
  testStripeConnection,
  resetStripeClient
};
