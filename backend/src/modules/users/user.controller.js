/**
 * ============================================================================
 * StoreForge AI
 * User Controller
 * ============================================================================
 *
 * File:
 *   backend/src/modules/users/user.controller.js
 *
 * Purpose:
 *   HTTP controllers for user profile and account management.
 *
 * Responsibilities:
 *   - Get current user
 *   - Update profile
 *   - Update email
 *   - Update onboarding
 *   - Get users (admin)
 *   - Update user status (admin)
 *   - Update user role (admin)
 *   - Delete / restore users
 *
 * Business/database logic:
 *   users/user.service.js
 *
 * Authentication:
 *   middleware/auth.js
 *
 * Authorization:
 *   middleware/admin.js
 * ============================================================================
 */

'use strict';

const userService = require('./user.service');


// ============================================================================
// HELPERS
// ============================================================================

function getUserId(req) {
  return (
    req.user?.id ||
    req.user?._id ||
    req.params?.userId
  );
}


function getErrorStatus(error) {
  switch (error.code) {
    case 'USER_NOT_FOUND':
      return 404;

    case 'USER_ALREADY_EXISTS':
    case 'EMAIL_ALREADY_IN_USE':
      return 409;

    default:
      return 500;
  }
}


// ============================================================================
// GET CURRENT USER
// ============================================================================

async function getMe(req, res, next) {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const user =
      await userService.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    return next(error);
  }
}


// ============================================================================
// GET USER BY ID
// ============================================================================

async function getUser(req, res, next) {
  try {
    const user =
      await userService.findById(
        req.params.userId
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    return next(error);
  }
}


// ============================================================================
// LIST USERS
// ============================================================================

async function listUsers(req, res, next) {
  try {
    const result =
      await userService.listUsers({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        role: req.query.role,
        status: req.query.status
      });

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    return next(error);
  }
}


// ============================================================================
// UPDATE CURRENT USER PROFILE
// ============================================================================

async function updateProfile(req, res, next) {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const user =
      await userService.updateProfile(
        userId,
        req.body
      );

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user
    });
  } catch (error) {
    return next(error);
  }
}


// ============================================================================
// UPDATE USER BY ID
// ============================================================================
//
// Admin operation.
// Only explicitly supported profile fields are passed to the service.
//

async function updateUser(req, res, next) {
  try {
    const userId =
      req.params.userId;

    const user =
      await userService.updateProfile(
        userId,
        req.body
      );

    return res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      user
    });
  } catch (error) {
    return next(error);
  }
}


// ============================================================================
// UPDATE EMAIL
// ============================================================================

async function updateEmail(req, res, next) {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const user =
      await userService.updateEmail(
        userId,
        req.body.email
      );

    return res.status(200).json({
      success: true,
      message:
        'Email updated. Please verify your new email address.',
      user
    });
  } catch (error) {
    const status =
      getErrorStatus(error);

    return res.status(status).json({
      success: false,
      message: error.message
    });
  }
}


// ============================================================================
// UPDATE ONBOARDING
// ============================================================================

async function updateOnboarding(req, res, next) {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const {
      step,
      completed
    } = req.body;

    const user =
      await userService.updateOnboarding(
        userId,
        step,
        completed === true
      );

    return res.status(200).json({
      success: true,
      message:
        'Onboarding progress updated.',
      user
    });
  } catch (error) {
    return next(error);
  }
}


// ============================================================================
// UPDATE USER STATUS
// ============================================================================

async function updateStatus(req, res, next) {
  try {
    const user =
      await userService.updateStatus(
        req.params.userId,
        req.body.status
      );

    return res.status(200).json({
      success: true,
      message:
        'User status updated successfully.',
      user
    });
  } catch (error) {
    const status =
      getErrorStatus(error);

    return res.status(status).json({
      success: false,
      message: error.message
    });
  }
}


// ============================================================================
// UPDATE USER ROLE
// ============================================================================

async function updateRole(req, res, next) {
  try {
    const user =
      await userService.updateRole(
        req.params.userId,
        req.body.role
      );

    return res.status(200).json({
      success: true,
      message:
        'User role updated successfully.',
      user
    });
  } catch (error) {
    const status =
      getErrorStatus(error);

    return res.status(status).json({
      success: false,
      message: error.message
    });
  }
}


// ============================================================================
// RESTORE USER
// ============================================================================

async function restoreUser(req, res, next) {
  try {
    const user =
      await userService.restoreUser(
        req.params.userId
      );

    return res.status(200).json({
      success: true,
      message:
        'User restored successfully.',
      user
    });
  } catch (error) {
    const status =
      getErrorStatus(error);

    return res.status(status).json({
      success: false,
      message: error.message
    });
  }
}


// ============================================================================
// DELETE CURRENT USER
// ============================================================================

async function deleteMe(req, res, next) {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const result =
      await userService.deleteUser(
        userId
      );

    return res.status(200).json({
      success: true,
      message:
        'Your account has been deleted.',
      ...result
    });
  } catch (error) {
    return next(error);
  }
}


// ============================================================================
// DELETE USER BY ID
// ============================================================================
//
// Admin operation.
//

async function deleteUser(req, res, next) {
  try {
    const result =
      await userService.deleteUser(
        req.params.userId
      );

    return res.status(200).json({
      success: true,
      message:
        'User deleted successfully.',
      ...result
    });
  } catch (error) {
    return next(error);
  }
}


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  getMe,
  getUser,
  listUsers,
  updateProfile,
  updateUser,
  updateEmail,
  updateOnboarding,
  updateStatus,
  updateRole,
  restoreUser,
  deleteMe,
  deleteUser
};
