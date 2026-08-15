// ============================================================================
// StoreForge AI
// Admin Controller
// ============================================================================

'use strict';

const adminService =
  require('./admin.service');


// ============================================================================
// HELPERS
// ============================================================================

function sendError(res, error) {
  const statusCode =
    error.statusCode ||
    error.status ||
    500;

  return res.status(statusCode).json({
    success: false,
    message:
      error.message ||
      'Admin request failed.',
  });
}


function getPagination(req) {
  return {
    page:
      Number(req.query?.page) || 1,

    limit:
      Number(req.query?.limit) || 20,
  };
}


// ============================================================================
// DASHBOARD
// ============================================================================

// GET /api/admin/dashboard
async function getDashboard(
  req,
  res
) {
  try {
    const dashboard =
      await adminService.getDashboardOverview();

    return res.status(200).json({
      success: true,
      dashboard,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// ============================================================================
// SYSTEM OVERVIEW
// ============================================================================

// GET /api/admin/overview
async function getSystemOverview(
  req,
  res
) {
  try {
    const overview =
      await adminService.getSystemOverview();

    return res.status(200).json({
      success: true,
      ...overview,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// ============================================================================
// USERS
// ============================================================================

// GET /api/admin/users
async function listUsers(
  req,
  res
) {
  try {
    const {
      page,
      limit,
    } = getPagination(req);

    const result =
      await adminService.listUsers({
        page,
        limit,
        search:
          req.query?.search || '',
        status:
          req.query?.status || null,
        role:
          req.query?.role || null,
      });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// GET /api/admin/users/:userId
async function getUser(
  req,
  res
) {
  try {
    const user =
      await adminService.getUserById(
        req.params.userId
      );

    return res.status(200).json({
      success: true,
      ...user,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// PATCH /api/admin/users/:userId/status
async function updateUserStatus(
  req,
  res
) {
  try {
    const {
      status,
    } = req.body || {};

    if (!status) {
      return res.status(400).json({
        success: false,
        message:
          'Status is required.',
      });
    }

    const user =
      await adminService.updateUserStatus(
        req.params.userId,
        status
      );

    return res.status(200).json({
      success: true,
      message:
        'User status updated successfully.',
      user,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// PATCH /api/admin/users/:userId/activate
async function activateUser(
  req,
  res
) {
  try {
    const user =
      await adminService.activateUser(
        req.params.userId
      );

    return res.status(200).json({
      success: true,
      message:
        'User activated successfully.',
      user,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// PATCH /api/admin/users/:userId/suspend
async function suspendUser(
  req,
  res
) {
  try {
    const user =
      await adminService.suspendUser(
        req.params.userId
      );

    return res.status(200).json({
      success: true,
      message:
        'User suspended successfully.',
      user,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// DELETE /api/admin/users/:userId
async function deleteUser(
  req,
  res
) {
  try {
    const user =
      await adminService.deleteUser(
        req.params.userId
      );

    return res.status(200).json({
      success: true,
      message:
        'User deleted successfully.',
      user,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// ============================================================================
// STORES
// ============================================================================

// GET /api/admin/stores
async function listStores(
  req,
  res
) {
  try {
    const {
      page,
      limit,
    } = getPagination(req);

    const result =
      await adminService.listStores({
        page,
        limit,
        search:
          req.query?.search || '',
        status:
          req.query?.status || null,
      });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// GET /api/admin/stores/:storeId
async function getStore(
  req,
  res
) {
  try {
    const result =
      await adminService.getStoreById(
        req.params.storeId
      );

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// PATCH /api/admin/stores/:storeId/status
async function updateStoreStatus(
  req,
  res
) {
  try {
    const {
      status,
    } = req.body || {};

    if (!status) {
      return res.status(400).json({
        success: false,
        message:
          'Status is required.',
      });
    }

    const store =
      await adminService.updateStoreStatus(
        req.params.storeId,
        status
      );

    return res.status(200).json({
      success: true,
      message:
        'Store status updated successfully.',
      store,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// ============================================================================
// BILLING
// ============================================================================

// GET /api/admin/billing
async function listBilling(
  req,
  res
) {
  try {
    const {
      page,
      limit,
    } = getPagination(req);

    const result =
      await adminService.listBilling({
        page,
        limit,
        plan:
          req.query?.plan || null,
        status:
          req.query?.status || null,
      });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// GET /api/admin/billing/summary
async function getBillingSummary(
  req,
  res
) {
  try {
    const summary =
      await adminService.getBillingSummary();

    return res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// ============================================================================
// COUNTS
// ============================================================================

// GET /api/admin/users/counts
async function getUserCounts(
  req,
  res
) {
  try {
    const counts =
      await adminService.getUserCounts();

    return res.status(200).json({
      success: true,
      counts,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// GET /api/admin/stores/counts
async function getStoreCounts(
  req,
  res
) {
  try {
    const counts =
      await adminService.getStoreCounts();

    return res.status(200).json({
      success: true,
      counts,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// ============================================================================
// RECENT ACTIVITY
// ============================================================================

// GET /api/admin/recent/users
async function getRecentUsers(
  req,
  res
) {
  try {
    const users =
      await adminService.getRecentUsers(
        Number(req.query?.limit) || 10
      );

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// GET /api/admin/recent/stores
async function getRecentStores(
  req,
  res
) {
  try {
    const stores =
      await adminService.getRecentStores(
        Number(req.query?.limit) || 10
      );

    return res.status(200).json({
      success: true,
      stores,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  getDashboard,
  getSystemOverview,

  listUsers,
  getUser,
  updateUserStatus,
  activateUser,
  suspendUser,
  deleteUser,

  listStores,
  getStore,
  updateStoreStatus,

  listBilling,
  getBillingSummary,

  getUserCounts,
  getStoreCounts,

  getRecentUsers,
  getRecentStores,
};
