// ============================================================================
// StoreForge AI
// Stripe Billing Webhook Controller
// ============================================================================

'use strict';

const {
  getStripeClient,
  getStripeWebhookSecret,
} = require('../../config/stripe');

const {
  processStripeEvent,
} = require('./billing.service');


// ============================================================================
// STRIPE WEBHOOK
// POST /api/billing/webhook
//
// IMPORTANT:
// This route must receive the RAW request body.
// Do NOT run express.json() before this route.
// ============================================================================

async function handleStripeWebhook(req, res) {
  const stripe = getStripeClient();

  const webhookSecret =
    getStripeWebhookSecret();

  if (!webhookSecret) {
    console.error(
      '[Billing Webhook] STRIPE_WEBHOOK_SECRET is not configured.'
    );

    return res.status(500).json({
      success: false,
      message:
        'Stripe webhook configuration is missing.',
    });
  }

  const signature =
    req.headers['stripe-signature'];

  if (!signature) {
    return res.status(400).json({
      success: false,
      message:
        'Missing Stripe signature.',
    });
  }

  let event;

  try {
    /*
     * Stripe requires the exact raw request body
     * for signature verification.
     */
    event =
      stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
  } catch (error) {
    console.error(
      '[Billing Webhook] Signature verification failed:',
      error.message
    );

    return res.status(400).json({
      success: false,
      message:
        'Invalid Stripe webhook signature.',
    });
  }

  try {
    const result =
      await processStripeEvent(event);

    console.log(
      `[Billing Webhook] ${event.type} processed successfully.`
    );

    return res.status(200).json({
      received: true,
      success: true,
      eventType: event.type,
      duplicate:
        result?.duplicate || false,
    });
  } catch (error) {
    console.error(
      `[Billing Webhook] Failed processing ${event.type}:`,
      error
    );

    /*
     * Return 500 so Stripe can retry events that
     * failed because of a temporary server/database issue.
     */
    return res.status(500).json({
      received: false,
      success: false,
      message:
        'Webhook processing failed.',
    });
  }
}


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  handleStripeWebhook,
};
