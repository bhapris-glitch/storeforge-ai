// ============================================================================
// StoreForge AI
// Billing Model
// ============================================================================

'use strict';

const mongoose = require('mongoose');


// ============================================================================
// BILLING SCHEMA
// ============================================================================

const billingSchema = new mongoose.Schema(
  {
    // ------------------------------------------------------------------------
    // User
    // ------------------------------------------------------------------------

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },


    // ------------------------------------------------------------------------
    // Store
    // ------------------------------------------------------------------------

    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      default: null,
      index: true,
    },


    // ------------------------------------------------------------------------
    // Stripe Customer
    // ------------------------------------------------------------------------

    stripeCustomerId: {
      type: String,
      default: null,
      index: true,
      trim: true,
    },


    // ------------------------------------------------------------------------
    // Stripe Subscription
    // ------------------------------------------------------------------------

    stripeSubscriptionId: {
      type: String,
      default: null,
      index: true,
      trim: true,
    },


    // ------------------------------------------------------------------------
    // Stripe Price
    // ------------------------------------------------------------------------

    stripePriceId: {
      type: String,
      default: null,
      trim: true,
    },


    // ------------------------------------------------------------------------
    // Current Plan
    // ------------------------------------------------------------------------

    plan: {
      type: String,
      enum: [
        'starter',
        'growth',
        'premium',
        'enterprise',
      ],
      default: 'starter',
      index: true,
    },


    // ------------------------------------------------------------------------
    // Billing Interval
    // ------------------------------------------------------------------------

    interval: {
      type: String,
      enum: [
        'month',
        'year',
      ],
      default: 'month',
    },


    // ------------------------------------------------------------------------
    // Amount
    // Stored in the smallest Stripe currency unit.
    // Example: $25 = 2500
    // ------------------------------------------------------------------------

    amount: {
      type: Number,
      default: 0,
      min: 0,
    },


    // ------------------------------------------------------------------------
    // Currency
    // ------------------------------------------------------------------------

    currency: {
      type: String,
      default: 'usd',
      lowercase: true,
      trim: true,
    },


    // ------------------------------------------------------------------------
    // Subscription Status
    // ------------------------------------------------------------------------

    status: {
      type: String,
      enum: [
        'incomplete',
        'incomplete_expired',
        'trialing',
        'active',
        'past_due',
        'canceled',
        'unpaid',
        'paused',
      ],
      default: 'incomplete',
      index: true,
    },


    // ------------------------------------------------------------------------
    // Subscription Dates
    // ------------------------------------------------------------------------

    currentPeriodStart: {
      type: Date,
      default: null,
    },

    currentPeriodEnd: {
      type: Date,
      default: null,
    },


    // ------------------------------------------------------------------------
    // Trial
    // ------------------------------------------------------------------------

    trialStart: {
      type: Date,
      default: null,
    },

    trialEnd: {
      type: Date,
      default: null,
    },


    // ------------------------------------------------------------------------
    // Cancellation
    // ------------------------------------------------------------------------

    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },

    canceledAt: {
      type: Date,
      default: null,
    },


    // ------------------------------------------------------------------------
    // Stripe Checkout
    // ------------------------------------------------------------------------

    stripeCheckoutSessionId: {
      type: String,
      default: null,
      index: true,
      trim: true,
    },


    // ------------------------------------------------------------------------
    // Last Stripe Event
    // Prevents accidental duplicate webhook processing.
    // ------------------------------------------------------------------------

    lastStripeEventId: {
      type: String,
      default: null,
      index: true,
      trim: true,
    },


    // ------------------------------------------------------------------------
    // Metadata
    // ------------------------------------------------------------------------

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


// ============================================================================
// INDEXES
// ============================================================================

billingSchema.index({
  userId: 1,
  status: 1,
});

billingSchema.index({
  storeId: 1,
  status: 1,
});

billingSchema.index({
  stripeCustomerId: 1,
  stripeSubscriptionId: 1,
});


// ============================================================================
// HELPERS
// ============================================================================

billingSchema.methods.isActive = function () {
  return (
    this.status === 'active' ||
    this.status === 'trialing'
  );
};


billingSchema.methods.isCanceled = function () {
  return this.status === 'canceled';
};


billingSchema.methods.isTrialing = function () {
  return this.status === 'trialing';
};


// ============================================================================
// EXPORT
// ============================================================================

module.exports = mongoose.model(
  'Billing',
  billingSchema
);
