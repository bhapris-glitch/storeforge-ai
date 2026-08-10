/**
 * ============================================================================
 * StoreForge AI
 * User Model
 * ============================================================================
 *
 * File:
 *   backend/src/modules/users/user.model.js
 *
 * Purpose:
 *   MongoDB/Mongoose model for StoreForge users.
 *
 * Relationships:
 *   User
 *    ├── Stores
 *    ├── Branding
 *    ├── Products
 *    ├── Themes
 *    ├── Deployments
 *    ├── Billing
 *    └── Analytics
 * ============================================================================
 */

'use strict';

const mongoose = require('mongoose');


// ============================================================================
// USER SCHEMA
// ============================================================================

const userSchema = new mongoose.Schema(
  {
    // ------------------------------------------------------------------------
    // BASIC INFORMATION
    // ------------------------------------------------------------------------

    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
      index: true
    },

    // ------------------------------------------------------------------------
    // AUTHENTICATION
    // ------------------------------------------------------------------------

    passwordHash: {
      type: String,
      select: false
    },

    emailVerified: {
      type: Boolean,
      default: false,
      index: true
    },

    emailVerifiedAt: {
      type: Date,
      default: null
    },

    // ------------------------------------------------------------------------
    // ROLE / PERMISSIONS
    // ------------------------------------------------------------------------

    role: {
      type: String,
      enum: [
        'user',
        'admin',
        'superadmin'
      ],
      default: 'user',
      index: true
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true
    },

    // ------------------------------------------------------------------------
    // ACCOUNT STATUS
    // ------------------------------------------------------------------------

    status: {
      type: String,
      enum: [
        'active',
        'pending',
        'suspended',
        'deleted'
      ],
      default: 'pending',
      index: true
    },

    // ------------------------------------------------------------------------
    // PASSWORD / SECURITY
    // ------------------------------------------------------------------------

    passwordChangedAt: {
      type: Date,
      default: null
    },

    passwordResetTokenHash: {
      type: String,
      select: false
    },

    passwordResetExpiresAt: {
      type: Date,
      select: false,
      default: null
    },

    // ------------------------------------------------------------------------
    // EMAIL VERIFICATION
    // ------------------------------------------------------------------------

    emailVerificationTokenHash: {
      type: String,
      select: false
    },

    emailVerificationExpiresAt: {
      type: Date,
      select: false,
      default: null
    },

    // ------------------------------------------------------------------------
    // REFRESH TOKEN / SESSION SECURITY
    // ------------------------------------------------------------------------

    tokenVersion: {
      type: Number,
      default: 0
    },

    // ------------------------------------------------------------------------
    // LOGIN INFORMATION
    // ------------------------------------------------------------------------

    lastLoginAt: {
      type: Date,
      default: null
    },

    lastLoginIp: {
      type: String,
      default: null,
      select: false
    },

    // ------------------------------------------------------------------------
    // PROFILE
    // ------------------------------------------------------------------------

    avatarUrl: {
      type: String,
      default: null,
      trim: true
    },

    timezone: {
      type: String,
      default: 'UTC',
      trim: true
    },

    // ------------------------------------------------------------------------
    // ONBOARDING
    // ------------------------------------------------------------------------

    onboardingCompleted: {
      type: Boolean,
      default: false
    },

    onboardingStep: {
      type: String,
      enum: [
        'account',
        'store',
        'branding',
        'theme',
        'products',
        'deployment',
        'completed'
      ],
      default: 'account'
    },

    // ------------------------------------------------------------------------
    // SOFT DELETE
    // ------------------------------------------------------------------------

    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,

    versionKey: true
  }
);


// ============================================================================
// INDEXES
// ============================================================================

userSchema.index({
  email: 1
});

userSchema.index({
  role: 1,
  status: 1
});

userSchema.index({
  createdAt: -1
});

userSchema.index({
  deletedAt: 1
});


// ============================================================================
// NORMALIZE EMAIL
// ============================================================================

userSchema.pre('save', function normalizeEmail(next) {
  if (this.email) {
    this.email = this.email.trim().toLowerCase();
  }

  next();
});


// ============================================================================
// HIDE SENSITIVE FIELDS
// ============================================================================

userSchema.methods.toSafeObject = function toSafeObject() {
  const user = this.toObject();

  delete user.passwordHash;
  delete user.passwordResetTokenHash;
  delete user.passwordResetExpiresAt;
  delete user.emailVerificationTokenHash;
  delete user.emailVerificationExpiresAt;
  delete user.lastLoginIp;

  return user;
};


// ============================================================================
// ADMIN CHECK
// ============================================================================

userSchema.methods.isAdmin = function isAdmin() {
  return (
    this.role === 'admin' ||
    this.role === 'superadmin'
  );
};


// ============================================================================
// SUPER ADMIN CHECK
// ============================================================================

userSchema.methods.isSuperAdmin = function isSuperAdmin() {
  return this.role === 'superadmin';
};


// ============================================================================
// ACCOUNT ACTIVE CHECK
// ============================================================================

userSchema.methods.canLogin = function canLogin() {
  return (
    this.isActive === true &&
    this.status !== 'suspended' &&
    this.status !== 'deleted'
  );
};


// ============================================================================
// MODEL
// ============================================================================

const User =
  mongoose.models.User ||
  mongoose.model('User', userSchema);


// ============================================================================
// EXPORT
// ============================================================================

module.exports = User;
