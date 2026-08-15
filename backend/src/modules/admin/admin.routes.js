// ============================================================================
// StoreForge AI
// Admin Routes
// ============================================================================

'use strict';

const express = require('express');

const adminController =
  require('./admin.controller');

const auth =
  require('../../middleware/auth');

const {
  admin,
  superAdmin,
} =
  require('../../middleware/admin');

const router =
  express.Router();


// ============================================================================
// AUTHENTICATION + ADMIN AUTHORIZATION
// ============================================================================
//
// All routes below require:
// 1. Valid authentication
// 2. Admin or Superadmin role
//
// Your existing middleware/admin.js handles the role check.
// ============================================================================

router.use(
  auth,
  admin
);


// ============================================================================
// DASHBOARD
// ============================================================================

// GET /api/admin/dashboard
router.get(
  '/dashboard',
  adminController.getDashboard
);


// GET /api/admin/overview
router.get(
  '/overview',
  adminController.getSystemOverview
);


// ============================================================================
// USERS
// ============================================================================

// GET /api/admin/users
//
// Query:
// ?page=1&limit=20&search=john&status=active&role=user
//
router.get(
  '/users',
  adminController.listUsers
);


// GET /api/admin/users/counts
router.get(
  '/users/counts',
  adminController.getUserCounts
);


// GET /api/admin/users/:userId
router.get(
  '/users/:userId',
  adminController.getUser
);


// PATCH /api/admin/users/:userId/status
router.patch(
  '/users/:userId/status',
  adminController.updateUserStatus
);


// PATCH /api/admin/users/:userId/activate
router.patch(
  '/users/:userId/activate',
  adminController.activateUser
);


// PATCH /api/admin/users/:userId/suspend
router.patch(
  '/users/:userId/suspend',
  adminController.suspendUser
);


// DELETE /api/admin/users/:userId
router.delete(
  '/users/:userId',
  adminController.deleteUser
);


// ============================================================================
// STORES
// ============================================================================

// GET /api/admin/stores
//
// Query:
// ?page=1&limit=20&search=shop&status=active
//
router.get(
  '/stores',
  adminController.listStores
);


// GET /api/admin/stores/counts
router.get(
  '/stores/counts',
  adminController.getStoreCounts
);


// GET /api/admin/stores/:storeId
router.get(
  '/stores/:storeId',
  adminController.getStore
);


// PATCH /api/admin/stores/:storeId/status
router.patch(
  '/stores/:storeId/status',
  adminController.updateStoreStatus
);


// ============================================================================
// BILLING
// ============================================================================

// GET /api/admin/billing
//
// Query:
// ?page=1&limit=20&plan=premium&status=active
//
router.get(
  '/billing',
  adminController.listBilling
);


// GET /api/admin/billing/summary
router.get(
  '/billing/summary',
  adminController.getBillingSummary
);


// ============================================================================
// RECENT ACTIVITY
// ============================================================================

// GET /api/admin/recent/users
router.get(
  '/recent/users',
  adminController.getRecentUsers
);


// GET /api/admin/recent/stores
router.get(
  '/recent/stores',
  adminController.getRecentStores
);


// ============================================================================
// SUPERADMIN-ONLY ROUTES
// ============================================================================
//
// Keep this section for operations that should NEVER be available to a
// normal admin.
//
// Currently no destructive superadmin-only operation is exposed.
// When we add one, put `superAdmin` before the controller here.
//
// Example:
//
// router.delete(
//   '/system/users/:userId/permanent',
//   superAdmin,
//   adminController.permanentlyDeleteUser
// );
//
// ============================================================================


// ============================================================================
// EXPORT
// ============================================================================

module.exports = router;
