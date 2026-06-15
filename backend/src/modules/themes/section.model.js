// ==========================================================
// Layboka AI 
// storeforge-ai/backend/src/modules/themes/section.model.js
// ==========================================================
const mongoose = require("mongoose");

/*
|--------------------------------------------------------------------------
| Block Schema
|--------------------------------------------------------------------------
|
| A section can contain multiple blocks.
| Example:
| Hero -> Buttons
| FAQ -> Questions
| Gallery -> Images
| Testimonials -> Cards
|
*/

const blockSchema = new mongoose.Schema(
  {
    blockId: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      required: true,
      trim: true
    },

    title: {
      type: String,
      default: ""
    },

    settings: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    order: {
      type: Number,
      default: 0
    },

    visible: {
      type: Boolean,
      default: true
    }
  },
  {
    _id: false
  }
);

/*
|--------------------------------------------------------------------------
| Section Schema
|--------------------------------------------------------------------------
*/

const sectionSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | Ownership
    |--------------------------------------------------------------------------
    */

    themeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theme",
      required: true,
      index: true
    },

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
    | Section Information
    |--------------------------------------------------------------------------
    */

    sectionId: {
      type: String,
      required: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      required: true,
      enum: [
        "announcement-bar",
        "header",
        "hero",
        "slideshow",
        "image-banner",
        "featured-product",
        "featured-collection",
        "collection-list",
        "product-grid",
        "product-slider",
        "video",
        "gallery",
        "image-with-text",
        "rich-text",
        "countdown",
        "comparison-table",
        "testimonials",
        "brands",
        "logo-list",
        "instagram",
        "tiktok",
        "newsletter",
        "faq",
        "contact",
        "map",
        "blog",
        "article",
        "cart-upsell",
        "related-products",
        "recently-viewed",
        "footer",
        "custom"
      ]
    },

    /*
    |--------------------------------------------------------------------------
    | Layout
    |--------------------------------------------------------------------------
    */

    order: {
      type: Number,
      default: 0
    },

    visible: {
      type: Boolean,
      default: true
    },

    locked: {
      type: Boolean,
      default: false
    },

    /*
    |--------------------------------------------------------------------------
    | Content
    |--------------------------------------------------------------------------
    */

    title: {
      type: String,
      default: ""
    },

    subtitle: {
      type: String,
      default: ""
    },

    description: {
      type: String,
      default: ""
    },

    settings: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    styles: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
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

    /*
    |--------------------------------------------------------------------------
    | Blocks
    |--------------------------------------------------------------------------
    */

    blocks: {
      type: [blockSchema],
      default: []
    },

    /*
    |--------------------------------------------------------------------------
    | SEO
    |--------------------------------------------------------------------------
    */

    seo: {
      title: {
        type: String,
        default: ""
      },

      description: {
        type: String,
        default: ""
      },

      keywords: [
        {
          type: String
        }
      ]
    },

    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    status: {
      type: String,
      enum: [
        "draft",
        "active",
        "archived"
      ],
      default: "active"
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

sectionSchema.index({
  themeId: 1,
  order: 1
});

sectionSchema.index({
  userId: 1
});

sectionSchema.index({
  storeId: 1
});

sectionSchema.index({
  type: 1
});

sectionSchema.index({
  status: 1
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

module.exports = mongoose.model(
  "Section",
  sectionSchema
);
