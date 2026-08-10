/**
 * ============================================================================
 * StoreForge AI
 * Admin Authentication Middleware
 * ============================================================================
 *
 * File:
 *   backend/src/middleware/admin.js
 *
 * Purpose:
 *   Protect admin-only API endpoints.
 *
 * Expected authentication flow:
 *
 *   Request
 *      ↓
 *   auth.js
 *      ↓
 *   req.user
 *      ↓
 *   admin.js
 *      ↓
 *   Admin API
 *
 * IMPORTANT:
 *   This middleware assumes auth.js has already authenticated the user and
 *   populated req.user.
 * ============================================================================
 */

'use strict';


// ============================================================================
// ADMIN ROLE CHECK
// ============================================================================

function isAdminUser(user) {
  if (!user) {
    return false;
  }

  /*
   * Support the common role representations:
   *
   *   role: "admin"
   *
   *   role: "ADMIN"
   *
   *   roles: ["admin"]
   *
   *   isAdmin: true
   */

  if (user.isAdmin === true) {
    return true;
  }

  if (
    typeof user.role === 'string' &&
    user.role.toLowerCase() === 'admin'
  ) {
    return true;
  }

  if (Array.isArray(user.roles)) {
    return user.roles.some(
      (role) =>
        typeof role === 'string' &&
        role.toLowerCase() === 'admin'
    );
  }

  return false;
}


// ============================================================================
// ADMIN MIDDLEWARE
// ============================================================================

function admin(req, res, next) {
  try {
    // auth.js should run before this middleware.
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!isAdminUser(req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required.'
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
}


// ============================================================================
// SUPER ADMIN CHECK
// ============================================================================

function isSuperAdminUser(user) {
  if (!user) {
    return false;
  }

  if (user.isSuperAdmin === true) {
    return true;
  }

  if (
    typeof user.role === 'string' &&
    user.role.toLowerCase() === 'superadmin'
  ) {
    return true;
  }

  if (Array.isArray(user.roles)) {
    return user.roles.some(
      (role) =>
        typeof role === 'string' &&
        role.toLowerCase() === 'superadmin'
    );
  }

  return false;
}


// ============================================================================
// SUPER ADMIN MIDDLEWARE
// ============================================================================

function superAdmin(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!isSuperAdminUser(req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Super admin access required.'
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
}


// ============================================================================
// ROLE MIDDLEWARE
// ============================================================================
//
// Usage:
//
// router.get(
//   '/some-admin-route',
//   auth,
//   requireRole('admin'),
//   controller
// );
//
// ============================================================================

function requireRole(...allowedRoles) {
  const normalizedRoles = allowedRoles
    .filter((role) => typeof role === 'string')
    .map((role) => role.toLowerCase());

  return function roleMiddleware(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.'
        });
      }

      const userRoles = [];

      if (typeof req.user.role === 'string') {
        userRoles.push(req.user.role.toLowerCase());
      }

      if (Array.isArray(req.user.roles)) {
        userRoles.push(
          ...req.user.roles
            .filter((role) => typeof role === 'string')
            .map((role) => role.toLowerCase())
        );
      }

      if (req.user.isAdmin === true) {
        userRoles.push('admin');
      }

      const hasPermission = normalizedRoles.some(
        (role) => userRoles.includes(role)
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions.'
        });
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = admin;

module.exports.admin = admin;
module.exports.superAdmin = superAdmin;
module.exports.requireRole = requireRole;
module.exports.isAdminUser = isAdminUser;
module.exports.isSuperAdminUser = isSuperAdminUser;
