// ============================================================================
// StoreForge AI
// Admin Validation
// ============================================================================

'use strict';


// ============================================================================
// HELPERS
// ============================================================================

function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(
    String(id || '')
  );
}


function validateRequiredFields(
  body,
  fields = []
) {
  const errors = [];

  fields.forEach((field) => {
    if (
      body[field] === undefined ||
      body[field] === null ||
      body[field] === ''
    ) {
      errors.push(
        `${field} is required.`
      );
    }
  });

  return errors;
}


// ============================================================================
// USER VALIDATION
// ============================================================================


// Validate user ID
function validateUserId(
  req,
  res,
  next
) {
  const {
    userId,
  } = req.params;

  if (
    !isValidObjectId(userId)
  ) {
    return res.status(400).json({
      success: false,
      message:
        'Invalid user ID.',
    });
  }

  next();
}


// Validate user status update

function validateUserStatus(
  req,
  res,
  next
) {
  const {
    status,
  } = req.body || {};

  const allowedStatuses = [
    'active',
    'pending',
    'suspended',
    'deleted',
  ];

  if (
    !status ||
    !allowedStatuses.includes(status)
  ) {
    return res.status(400).json({
      success: false,
      message:
        'Invalid user status.',
      allowedStatuses,
    });
  }

  next();
}


// ============================================================================
// STORE VALIDATION
// ============================================================================


// Validate store ID

function validateStoreId(
  req,
  res,
  next
) {
  const {
    storeId,
  } = req.params;

  if (
    !isValidObjectId(storeId)
  ) {
    return res.status(400).json({
      success: false,
      message:
        'Invalid store ID.',
    });
  }

  next();
}


// Validate store status update

function validateStoreStatus(
  req,
  res,
  next
) {
  const {
    status,
  } = req.body || {};

  const allowedStatuses = [
    'pending',
    'active',
    'suspended',
    'uninstalled',
  ];

  if (
    !status ||
    !allowedStatuses.includes(status)
  ) {
    return res.status(400).json({
      success: false,
      message:
        'Invalid store status.',
      allowedStatuses,
    });
  }

  next();
}


// ============================================================================
// PAGINATION VALIDATION
// ============================================================================

function validatePagination(
  req,
  res,
  next
) {
  const {
    page,
    limit,
  } = req.query || {};

  if (
    page &&
    (
      Number.isNaN(
        Number(page)
      ) ||
      Number(page) < 1
    )
  ) {
    return res.status(400).json({
      success: false,
      message:
        'Page must be a positive number.',
    });
  }


  if (
    limit &&
    (
      Number.isNaN(
        Number(limit)
      ) ||
      Number(limit) < 1 ||
      Number(limit) > 100
    )
  ) {
    return res.status(400).json({
      success: false,
      message:
        'Limit must be between 1 and 100.',
    });
  }

  next();
}


// ============================================================================
// SEARCH VALIDATION
// ============================================================================

function validateSearch(
  req,
  res,
  next
) {
  const {
    search,
  } = req.query || {};

  if (
    search &&
    String(search).length > 100
  ) {
    return res.status(400).json({
      success: false,
      message:
        'Search query is too long.',
    });
  }

  next();
}


// ============================================================================
// BILLING VALIDATION
// ============================================================================


// Validate billing filters

function validateBillingFilters(
  req,
  res,
  next
) {
  const {
    plan,
    status,
  } = req.query || {};


  const allowedPlans = [
    'starter',
    'growth',
    'premium',
    'enterprise',
  ];


  const allowedStatuses = [
    'trialing',
    'active',
    'past_due',
    'canceled',
    'incomplete',
    'incomplete_expired',
  ];


  if (
    plan &&
    !allowedPlans.includes(plan)
  ) {
    return res.status(400).json({
      success: false,
      message:
        'Invalid billing plan.',
      allowedPlans,
    });
  }


  if (
    status &&
    !allowedStatuses.includes(status)
  ) {
    return res.status(400).json({
      success: false,
      message:
        'Invalid billing status.',
      allowedStatuses,
    });
  }


  next();
}


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {

  // helpers
  validateRequiredFields,

  // users
  validateUserId,
  validateUserStatus,

  // stores
  validateStoreId,
  validateStoreStatus,

  // common
  validatePagination,
  validateSearch,

  // billing
  validateBillingFilters,
};
