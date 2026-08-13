//==========================================================
// StoreForge AI
// backend/src/modules/stores/store.model.js
//==========================================================

const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    storeName: {
      type: String,
      required: true,
      trim: true
    },

    shopDomain: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    accessToken: {
      type: String,
      default: null
    },

    scope: {
      type: String,
      default: ""
    },

    shopifyPlan: {
      type: String,
      default: ""
    },

    currency: {
      type: String,
      default: "USD"
    },

    timezone: {
      type: String,
      default: ""
    },

    email: {
      type: String,
      default: ""
    },

    country: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: [
        "pending",
        "active",
        "suspended",
        "uninstalled"
      ],
      default: "pending"
    },

    installedAt: {
      type: Date,
      default: null
    },

    uninstalledAt: {
      type: Date,
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

storeSchema.index({
  userId: 1
});

storeSchema.index({
  shopDomain: 1
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

module.exports = mongoose.model(
  "Store",
  storeSchema
);
