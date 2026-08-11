/**
 * ============================================================================
 * StoreForge AI
 * Brand Model
 * ============================================================================
 *
 * File:
 * backend/src/modules/branding/brand.model.js
 *
 * Purpose:
 * Stores the merchant's brand identity used by StoreForge AI for:
 *
 * - AI theme generation
 * - AI design decisions
 * - Store styling
 * - Generated content
 * - Theme regeneration
 *
 * ============================================================================
 */

'use strict';

const mongoose = require('mongoose');


// ============================================================================
// BRAND SCHEMA
// ============================================================================

const brandSchema = new mongoose.Schema(
  {

    // ------------------------------------------------------------------------
    // USER
    // ------------------------------------------------------------------------
    //
    // The StoreForge account that owns this brand.
    //

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },


    // ------------------------------------------------------------------------
    // STORE
    // ------------------------------------------------------------------------
    //
    // Brand belongs to a specific Shopify/store connection.
    //

    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
      index: true
    },


    // ------------------------------------------------------------------------
    // BRAND NAME
    // ------------------------------------------------------------------------

    brandName: {
      type: String,
      trim: true,
      maxlength: 120
    },


    // ------------------------------------------------------------------------
    // TAGLINE
    // ------------------------------------------------------------------------

    tagline: {
      type: String,
      trim: true,
      maxlength: 300
    },


    // ------------------------------------------------------------------------
    // DESCRIPTION
    // ------------------------------------------------------------------------

    description: {
      type: String,
      trim: true,
      maxlength: 3000
    },


    // ------------------------------------------------------------------------
    // LOGO
    // ------------------------------------------------------------------------

    logo: {

      url: {
        type: String,
        trim: true,
        maxlength: 2000
      },

      alt: {
        type: String,
        trim: true,
        maxlength: 200
      }

    },


    // ------------------------------------------------------------------------
    // FAVICON
    // ------------------------------------------------------------------------

    favicon: {
      type: String,
      trim: true,
      maxlength: 2000
    },


    // ------------------------------------------------------------------------
    // BRAND COLORS
    // ------------------------------------------------------------------------

    colors: {

      primary: {
        type: String,
        trim: true,
        maxlength: 30
      },

      secondary: {
        type: String,
        trim: true,
        maxlength: 30
      },

      accent: {
        type: String,
        trim: true,
        maxlength: 30
      },

      background: {
        type: String,
        trim: true,
        maxlength: 30
      },

      surface: {
        type: String,
        trim: true,
        maxlength: 30
      },

      text: {
        type: String,
        trim: true,
        maxlength: 30
      },

      mutedText: {
        type: String,
        trim: true,
        maxlength: 30
      }

    },


    // ------------------------------------------------------------------------
    // TYPOGRAPHY
    // ------------------------------------------------------------------------

    typography: {

      headingFont: {
        type: String,
        trim: true,
        maxlength: 100
      },

      bodyFont: {
        type: String,
        trim: true,
        maxlength: 100
      },

      headingWeight: {
        type: Number,
        min: 100,
        max: 900
      },

      bodyWeight: {
        type: Number,
        min: 100,
        max: 900
      }

    },


    // ------------------------------------------------------------------------
    // DESIGN STYLE
    // ------------------------------------------------------------------------
    //
    // Used by the AI design/planning layer.
    //

    designStyle: {
      type: String,
      trim: true,
      maxlength: 100
    },


    // ------------------------------------------------------------------------
    // DESIGN PREFERENCES
    // ------------------------------------------------------------------------

    designPreferences: {

      borderRadius: {
        type: String,
        trim: true,
        maxlength: 50
      },

      buttonStyle: {
        type: String,
        trim: true,
        maxlength: 50
      },

      cardStyle: {
        type: String,
        trim: true,
        maxlength: 50
      },

      spacingStyle: {
        type: String,
        trim: true,
        maxlength: 50
      },

      imageStyle: {
        type: String,
        trim: true,
        maxlength: 100
      },

      animationLevel: {
        type: String,
        enum: [
          'none',
          'minimal',
          'moderate',
          'rich'
        ],
        default: 'moderate'
      }

    },


    // ------------------------------------------------------------------------
    // BRAND VOICE
    // ------------------------------------------------------------------------

    brandVoice: {

      tone: {
        type: String,
        trim: true,
        maxlength: 100
      },

      personality: {
        type: String,
        trim: true,
        maxlength: 500
      },

      keywords: [{
        type: String,
        trim: true,
        maxlength: 100
      }],

      avoidWords: [{
        type: String,
        trim: true,
        maxlength: 100
      }]

    },


    // ------------------------------------------------------------------------
    // TARGET AUDIENCE
    // ------------------------------------------------------------------------

    targetAudience: {

      description: {
        type: String,
        trim: true,
        maxlength: 2000
      },

      ageRange: {
        type: String,
        trim: true,
        maxlength: 50
      },

      gender: {
        type: String,
        trim: true,
        maxlength: 100
      },

      interests: [{
        type: String,
        trim: true,
        maxlength: 100
      }]

    },


    // ------------------------------------------------------------------------
    // SOCIAL LINKS
    // ------------------------------------------------------------------------

    socialLinks: {

      instagram: {
        type: String,
        trim: true,
        maxlength: 1000
      },

      facebook: {
        type: String,
        trim: true,
        maxlength: 1000
      },

      youtube: {
        type: String,
        trim: true,
        maxlength: 1000
      },

      twitter: {
        type: String,
        trim: true,
        maxlength: 1000
      },

      tiktok: {
        type: String,
        trim: true,
        maxlength: 1000
      },

      pinterest: {
        type: String,
        trim: true,
        maxlength: 1000
      },

      linkedin: {
        type: String,
        trim: true,
        maxlength: 1000
      }

    },


    // ------------------------------------------------------------------------
    // BRAND ASSETS
    // ------------------------------------------------------------------------
    //
    // Additional images/files that may be used by the AI theme generator.
    //

    assets: [{

      type: {
        type: String,
        trim: true,
        maxlength: 50
      },

      url: {
        type: String,
        trim: true,
        maxlength: 2000
      },

      alt: {
        type: String,
        trim: true,
        maxlength: 200
      },

      name: {
        type: String,
        trim: true,
        maxlength: 200
      }

    }],


    // ------------------------------------------------------------------------
    // AI BRAND PROFILE
    // ------------------------------------------------------------------------
    //
    // Stores normalized information produced by the AI branding pipeline.
    //

    aiProfile: {

      industry: {
        type: String,
        trim: true,
        maxlength: 150
      },

      niche: {
        type: String,
        trim: true,
        maxlength: 150
      },

      visualKeywords: [{
        type: String,
        trim: true,
        maxlength: 100
      }],

      recommendedStyle: {
        type: String,
        trim: true,
        maxlength: 150
      },

      recommendedPalette: [{
        type: String,
        trim: true,
        maxlength: 30
      }],

      confidence: {
        type: Number,
        min: 0,
        max: 1
      }

    },


    // ------------------------------------------------------------------------
    // SETUP STATUS
    // ------------------------------------------------------------------------

    isComplete: {
      type: Boolean,
      default: false,
      index: true
    },


    // ------------------------------------------------------------------------
    // SOURCE
    // ------------------------------------------------------------------------
    //
    // Indicates how the brand information was created.
    //

    source: {
      type: String,
      enum: [
        'manual',
        'shopify',
        'ai',
        'imported'
      ],
      default: 'manual'
    },


    // ------------------------------------------------------------------------
    // LAST AI UPDATE
    // ------------------------------------------------------------------------

    lastAIUpdateAt: {
      type: Date
    }

  },
  {
    timestamps: true,

    versionKey: false
  }
);


// ============================================================================
// INDEXES
// ============================================================================
//
// A store should have one active brand profile.
//

brandSchema.index(
  {
    userId: 1,
    storeId: 1
  },
  {
    unique: true
  }
);


// Useful when retrieving recently updated brand profiles.

brandSchema.index({
  updatedAt: -1
});


// ============================================================================
// EXPORT
// ============================================================================

const Brand = mongoose.model(
  'Brand',
  brandSchema
);

module.exports = Brand;
