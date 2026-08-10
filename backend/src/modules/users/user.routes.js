/**
 * ============================================================================
 * StoreForge AI
 * User Routes
 * ============================================================================
 *
 * File:
 *   backend/src/modules/users/user.routes.js
 *
 * Purpose:
 *   User profile, account, and admin user-management routes.
 *
 * Middleware:
 *   auth  -> authentication
 *   admin -> admin authorization
 *   validate -> request validation
 * ============================================================================
 */

'use strict';

const express = require('express');

const router = express.Router();

const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const validate = require('../../middleware/validate');

const userController = require('./user.controller');


// ============================================================================
// CURRENT USER VALIDATION
// ============================================================================

const updateProfileValidation = {
  body: {
    name: {
      required: false,
      type: 'string',
      minLength: 2,
      maxLength: 100
    },

    avatarUrl: {
      required: false,
      type: 'url',
      maxLength: 2048
    },

    timezone: {
      required: false,
      type: 'string',
      maxLength: 100
    }
  }
};


const updateEmailValidation = {
  body: {
    email: {
      required: true,
      type: 'email',
      maxLength: 254
    }
  }
};


const updateOnboardingValidation = {
  body: {
    step: {
      required: true,
      type: 'string',
      enum: [
        'account',
        'store',
        'branding',
        'theme',
        'products',
        'deployment',
        'completed'
      ]
    },

    completed: {
      required: false,
      type: 'boolean'
    }
  }
};


// ============================================================================
// ADMIN VALIDATION
// ============================================================================

const userIdValidation = {
  params: {
    userId: {
      required: true,
      type: 'mongoId'
    }
  }
};


const adminUpdateUserValidation = {
  params: {
    userId: {
      required: true,
      type: 'mongoId'
    }
  },

  body: {
    name: {
      required: false,
      type: 'string',
      minLength: 2,
      maxLength: 100
    },

    avatarUrl: {
      required: false,
      type: 'url',
      maxLength: 2048
    },

    timezone: {
      required: false,
      type: 'string',
      maxLength: 100
    }
  }
};


const updateStatusValidation = {
  params: {
    userId: {
      required: true,
      type: 'mongoId'
    }
  },

  body: {
    status: {
      required: true,
      type: 'string',
      enum: [
        'active',
        'pending',
        'suspended',
        'deleted'
      ]
    }
  }
};


const updateRoleValidation = {
  params: {
    userId: {
      required: true,
      type: 'mongoId'
    }
  },

  body: {
    role: {
      required: true,
      type: 'string',
      enum: [
        'user',
        'admin',
        'superadmin'
      ]
    }
  }
};


// ============================================================================
// CURRENT USER ROUTES
// ============================================================================

/**
 * GET /api/users/me
 *
 * Get currently authenticated user.
 */
router.get(
  '/me',
  auth,
  userController.getMe
);


/**
 * PATCH /api/users/me
 *
 * Update current user's profile.
 */
router.patch(
  '/me',
  auth,
  validate(updateProfileValidation),
  userController.updateProfile
);


/**
 * PATCH /api/users/me/email
 *
 * Change current user's email.
 */
router.patch(
  '/me/email',
  auth,
  validate(updateEmailValidation),
  userController.updateEmail
);


/**
 * PATCH /api/users/me/onboarding
 *
 * Update onboarding progress.
 */
router.patch(
  '/me/onboarding',
  auth,
  validate(updateOnboardingValidation),
  userController.updateOnboarding
);


/**
 * DELETE /api/users/me
 *
 * Soft-delete current account.
 */
router.delete(
  '/me',
  auth,
  userController.deleteMe
);


// ============================================================================
// ADMIN USER ROUTES
// ============================================================================

/**
 * GET /api/users
 *
 * List users.
 *
 * Query parameters:
 *   page
 *   limit
 *   search
 *   role
 *   status
 */
router.get(
  '/',
  auth,
  admin,
  userController.listUsers
);


/**
 * GET /api/users/:userId
 *
 * Get a specific user.
 */
router.get(
  '/:userId',
  auth,
  admin,
  validate(userIdValidation),
  userController.getUser
);


/**
 * PATCH /api/users/:userId
 *
 * Update user profile.
 */
router.patch(
  '/:userId',
  auth,
  admin,
  validate(adminUpdateUserValidation),
  userController.updateUser
);


/**
 * PATCH /api/users/:userId/status
 *
 * Activate, suspend, pending, or delete a user.
 */
router.patch(
  '/:userId/status',
  auth,
  admin,
  validate(updateStatusValidation),
  userController.updateStatus
);


/**
 * PATCH /api/users/:userId/role
 *
 * Change user role.
 */
router.patch(
  '/:userId/role',
  auth,
  admin,
  validate(updateRoleValidation),
  userController.updateRole
);


/**
 * POST /api/users/:userId/restore
 *
 * Restore a soft-deleted user.
 */
router.post(
  '/:userId/restore',
  auth,
  admin,
  validate(userIdValidation),
  userController.restoreUser
);


/**
 * DELETE /api/users/:userId
 *
 * Soft-delete a user.
 */
router.delete(
  '/:userId',
  auth,
  admin,
  validate(userIdValidation),
  userController.deleteUser
);


// ============================================================================
// EXPORT
// ============================================================================

module.exports = router;
