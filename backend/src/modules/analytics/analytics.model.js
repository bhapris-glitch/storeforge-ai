// ============================================================================
// StoreForge AI
// Analytics Model
// ============================================================================

'use strict';

const mongoose = require('mongoose');


// ============================================================================
// ANALYTICS EVENT SCHEMA
// ============================================================================

const analyticsSchema = new mongoose.Schema(
  {
    // ------------------------------------------------------------------------
    // User / Store Reference
    // ------------------------------------------------------------------------

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },


    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      default: null,
      index: true,
    },


    // ------------------------------------------------------------------------
    // Event Information
    // ------------------------------------------------------------------------

    eventType: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },


    category: {
      type: String,
      enum: [
        'store',
        'product',
        'theme',
        'ai',
        'billing',
        'deployment',
        'user',
        'system',
      ],
      default: 'system',
      index: true,
    },


    // ------------------------------------------------------------------------
    // Event Data
    // ------------------------------------------------------------------------

    action: {
      type: String,
      default: null,
      trim: true,
    },


    entityType: {
      type: String,
      default: null,
      trim: true,
    },


    entityId: {
      type: String,
      default: null,
      trim: true,
    },


    // ------------------------------------------------------------------------
    // Usage Tracking
    // ------------------------------------------------------------------------

    usage: {
      aiTokens: {
        type: Number,
        default: 0,
      },

      aiRequests: {
        type: Number,
        default: 0,
      },

      processingTime: {
        type: Number,
        default: 0,
      },
    },


    // ------------------------------------------------------------------------
    // Revenue / Conversion Metrics
    // ------------------------------------------------------------------------

    revenue: {
      amount: {
        type: Number,
        default: 0,
      },

      currency: {
        type: String,
        default: 'usd',
      },
    },


    conversion: {
      type: Boolean,
      default: false,
    },


    // ------------------------------------------------------------------------
    // Request Information
    // ------------------------------------------------------------------------

    source: {
      type: String,
      default: null,
      trim: true,
    },


    device: {
      type: String,
      default: null,
      trim: true,
    },


    ipAddress: {
      type: String,
      default: null,
    },


    userAgent: {
      type: String,
      default: null,
    },


    // ------------------------------------------------------------------------
    // Flexible Metadata
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

analyticsSchema.index({
  storeId: 1,
  eventType: 1,
  createdAt: -1,
});


analyticsSchema.index({
  userId: 1,
  category: 1,
  createdAt: -1,
});


analyticsSchema.index({
  createdAt: -1,
});


// ============================================================================
// HELPERS
// ============================================================================

analyticsSchema.methods.isConversion = function () {
  return this.conversion === true;
};


analyticsSchema.methods.getRevenue = function () {
  return this.revenue?.amount || 0;
};


// ============================================================================
// EXPORT
// ============================================================================

module.exports = mongoose.model(
  'Analytics',
  analyticsSchema
);
