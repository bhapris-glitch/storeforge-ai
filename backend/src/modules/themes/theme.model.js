// ==========================================================
// Layboka AI
// storeforge-ai/backend/src/modules/themes/theme.model.js
// =========================================================
const mongoose = require("mongoose");

const themeSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | Ownership
    |--------------------------------------------------------------------------
    */

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true
    },

    /*
    |--------------------------------------------------------------------------
    | Theme Information
    |--------------------------------------------------------------------------
    */

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    description: {
      type: String,
      default: ""
    },

    category: {
      type: String,
      enum: [
        "fashion",
        "electronics",
        "beauty",
        "furniture",
        "food",
        "restaurant",
        "jewelry",
        "automotive",
        "pets",
        "sports",
        "kids",
        "real-estate",
        "health",
        "luxury",
        "custom"
      ],
      default: "custom"
    },

    /*
    |--------------------------------------------------------------------------
    | Shopify
    |--------------------------------------------------------------------------
    */

    shopifyThemeId: {
      type: String,
      default: ""
    },

    role: {
      type: String,
      enum: [
        "main",
        "unpublished",
        "demo",
        "development"
      ],
      default: "development"
    },

    /*
    |--------------------------------------------------------------------------
    | AI
    |--------------------------------------------------------------------------
    */

    aiGenerated: {
      type: Boolean,
      default: false
    },

    aiPrompt: {
      type: String,
      default: ""
    },

    aiModel: {
      type: String,
      default: ""
    },

    /*
    |--------------------------------------------------------------------------
    | Theme Configuration
    |--------------------------------------------------------------------------
    */

    colors: {
      primary: {
        type: String,
        default: "#000000"
      },
      secondary: {
        type: String,
        default: "#FFFFFF"
      },
      accent: {
        type: String,
        default: "#2563EB"
      }
    },

    typography: {
      heading: {
        type: String,
        default: "Inter"
      },
      body: {
        type: String,
        default: "Inter"
      }
    },

    layout: {
      type: String,
      enum: [
        "classic",
        "modern",
        "minimal",
        "premium"
      ],
      default: "modern"
    },

    /*
    |--------------------------------------------------------------------------
    | Theme Assets
    |--------------------------------------------------------------------------
    */

    assets: [
      {
        fileName: String,
        type: String,
        size: Number,
        url: String
      }
    ],

    /*
    |--------------------------------------------------------------------------
    | Sections
    |--------------------------------------------------------------------------
    */

    sections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section"
      }
    ],

    /*
    |--------------------------------------------------------------------------
    | Versioning
    |--------------------------------------------------------------------------
    */

    version: {
      type: Number,
      default: 1
    },

    versions: [
      {
        version: Number,
        createdAt: {
          type: Date,
          default: Date.now
        },
        notes: String
      }
    ],

    /*
    |--------------------------------------------------------------------------
    | Preview
    |--------------------------------------------------------------------------
    */

    previewUrl: {
      type: String,
      default: ""
    },

    previewToken: {
  type: String,
  default: ""
},

previewEnabled: {
  type: Boolean,
  default: false
},

previewExpiresAt: {
  type: Date,
  default: null
},

    previewImage: {
      type: String,
      default: ""
    },

    /*
    |--------------------------------------------------------------------------
    | Deployment
    |--------------------------------------------------------------------------
    */

    deploymentStatus: {
      type: String,
      enum: [
        "draft",
        "building",
        "ready",
        "deploying",
        "published",
        "failed"
      ],
      default: "draft"
    },

    publishedAt: {
      type: Date,
      default: null
    },

    /*
    |--------------------------------------------------------------------------
    | Theme Status
    |--------------------------------------------------------------------------
    */

    status: {
      type: String,
      enum: [
        "active",
        "inactive",
        "archived",
        "deleted"
      ],
      default: "active"
    },

    /*
    |--------------------------------------------------------------------------
    | Analytics
    |--------------------------------------------------------------------------
    */

    views: {
      type: Number,
      default: 0
    },

    deployments: {
      type: Number,
      default: 0
    },

    clonedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theme",
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

themeSchema.index({
  userId: 1,
  storeId: 1
});

themeSchema.index({
  deploymentStatus: 1
});

themeSchema.index({
  status: 1
});

themeSchema.index({
  shopifyThemeId: 1
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

module.exports = mongoose.model(
  "Theme",
  themeSchema
);
