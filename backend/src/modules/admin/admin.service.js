// ============================================================================
// StoreForge AI
// Admin Service
// ============================================================================

'use strict';

const User =
  require('../users/user.model');

const Store =
  require('../stores/store.model');

const Billing =
  require('../billing/billing.model');


// ============================================================================
// HELPERS
// ============================================================================

function escapeRegex(value = '') {
  return String(value).replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );
}


function toSafeUser(user) {
  if (!user) {
    return null;
  }

  if (
    typeof user.toSafeObject === 'function'
  ) {
    return user.toSafeObject();
  }

  const object =
    typeof user.toObject === 'function'
      ? user.toObject()
      : { ...user };

  delete object.passwordHash;
  delete object.passwordResetTokenHash;
  delete object.passwordResetExpiresAt;
  delete object.emailVerificationTokenHash;
  delete object.emailVerificationExpiresAt;
  delete object.lastLoginIp;

  return object;
}


// ============================================================================
// ADMIN DASHBOARD OVERVIEW
// ============================================================================

async function getDashboardOverview() {
  const [
    totalUsers,
    activeUsers,
    suspendedUsers,
    pendingUsers,
    deletedUsers,
    totalStores,
    activeStores,
    pendingStores,
    suspendedStores,
    uninstalledStores,
    totalSubscriptions,
    activeSubscriptions,
    trialSubscriptions,
    canceledSubscriptions,
    pastDueSubscriptions,
    revenueResult,
  ] = await Promise.all([
    User.countDocuments({
      deletedAt: null,
    }),

    User.countDocuments({
      deletedAt: null,
      isActive: true,
      status: 'active',
    }),

    User.countDocuments({
      deletedAt: null,
      status: 'suspended',
    }),

    User.countDocuments({
      deletedAt: null,
      status: 'pending',
    }),

    User.countDocuments({
      status: 'deleted',
    }),

    Store.countDocuments(),

    Store.countDocuments({
      status: 'active',
    }),

    Store.countDocuments({
      status: 'pending',
    }),

    Store.countDocuments({
      status: 'suspended',
    }),

    Store.countDocuments({
      status: 'uninstalled',
    }),

    Billing.countDocuments(),

    Billing.countDocuments({
      status: 'active',
    }),

    Billing.countDocuments({
      status: 'trialing',
    }),

    Billing.countDocuments({
      status: 'canceled',
    }),

    Billing.countDocuments({
      status: 'past_due',
    }),

    Billing.aggregate([
      {
        $match: {
          status: {
            $in: [
              'active',
              'trialing',
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          amount: {
            $sum: '$amount',
          },
        },
      },
    ]),
  ]);

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      suspended: suspendedUsers,
      pending: pendingUsers,
      deleted: deletedUsers,
    },

    stores: {
      total: totalStores,
      active: activeStores,
      pending: pendingStores,
      suspended: suspendedStores,
      uninstalled: uninstalledStores,
    },

    subscriptions: {
      total: totalSubscriptions,
      active: activeSubscriptions,
      trialing: trialSubscriptions,
      canceled: canceledSubscriptions,
      pastDue: pastDueSubscriptions,
    },

    billing: {
      activeAmount:
        revenueResult[0]?.amount || 0,
      currency: 'usd',
    },
  };
}


// ============================================================================
// LIST USERS
// ============================================================================

async function listUsers({
  page = 1,
  limit = 20,
  search = '',
  status = null,
  role = null,
} = {}) {
  const safePage =
    Math.max(
      Number(page) || 1,
      1
    );

  const safeLimit =
    Math.min(
      Math.max(
        Number(limit) || 20,
        1
      ),
      100
    );

  const query = {};

  if (search) {
    const regex =
      new RegExp(
        escapeRegex(search.trim()),
        'i'
      );

    query.$or = [
      {
        name: regex,
      },
      {
        email: regex,
      },
    ];
  }

  if (status) {
    query.status = status;
  }

  if (role) {
    query.role = role;
  }

  const skip =
    (safePage - 1) *
    safeLimit;

  const [
    users,
    total,
  ] = await Promise.all([
    User.find(query)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(safeLimit)
      .lean(),

    User.countDocuments(query),
  ]);

  return {
    users: users.map(toSafeUser),

    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages:
        Math.ceil(
          total / safeLimit
        ),
    },
  };
}


// ============================================================================
// GET USER
// ============================================================================

async function getUserById(
  userId
) {
  const user =
    await User.findById(userId);

  if (!user) {
    const error =
      new Error(
        'User not found.'
      );

    error.statusCode = 404;

    throw error;
  }

  const [
    stores,
    billing,
  ] = await Promise.all([
    Store.find({
      userId: user._id,
    })
      .sort({
        createdAt: -1,
      })
      .lean(),

    Billing.find({
      userId: user._id,
    })
      .sort({
        createdAt: -1,
      })
      .lean(),
  ]);

  return {
    user: toSafeUser(user),
    stores,
    billing,
  };
}


// ============================================================================
// UPDATE USER STATUS
// ============================================================================

async function updateUserStatus(
  userId,
  status
) {
  const allowedStatuses = [
    'active',
    'pending',
    'suspended',
    'deleted',
  ];

  if (
    !allowedStatuses.includes(status)
  ) {
    const error =
      new Error(
        'Invalid user status.'
      );

    error.statusCode = 400;

    throw error;
  }

  const update = {
    status,
  };

  if (status === 'active') {
    update.isActive = true;
    update.deletedAt = null;
  }

  if (status === 'suspended') {
    update.isActive = false;
  }

  if (status === 'pending') {
    update.isActive = false;
  }

  if (status === 'deleted') {
    update.isActive = false;
    update.deletedAt = new Date();
  }

  const user =
    await User.findByIdAndUpdate(
      userId,
      update,
      {
        new: true,
        runValidators: true,
      }
    );

  if (!user) {
    const error =
      new Error(
        'User not found.'
      );

    error.statusCode = 404;

    throw error;
  }

  return toSafeUser(user);
}


// ============================================================================
// ACTIVATE USER
// ============================================================================

async function activateUser(
  userId
) {
  return updateUserStatus(
    userId,
    'active'
  );
}


// ============================================================================
// SUSPEND USER
// ============================================================================

async function suspendUser(
  userId
) {
  return updateUserStatus(
    userId,
    'suspended'
  );
}


// ============================================================================
// DELETE USER
// ============================================================================
//
// Soft delete only.
// ============================================================================

async function deleteUser(
  userId
) {
  return updateUserStatus(
    userId,
    'deleted'
  );
}


// ============================================================================
// LIST STORES
// ============================================================================

async function listStores({
  page = 1,
  limit = 20,
  search = '',
  status = null,
} = {}) {
  const safePage =
    Math.max(
      Number(page) || 1,
      1
    );

  const safeLimit =
    Math.min(
      Math.max(
        Number(limit) || 20,
        1
      ),
      100
    );

  const query = {};

  if (search) {
    const regex =
      new RegExp(
        escapeRegex(search.trim()),
        'i'
      );

    query.$or = [
      {
        storeName: regex,
      },
      {
        shopDomain: regex,
      },
      {
        email: regex,
      },
    ];
  }

  if (status) {
    query.status = status;
  }

  const skip =
    (safePage - 1) *
    safeLimit;

  const [
    stores,
    total,
  ] = await Promise.all([
    Store.find(query)
      .select(
        '-accessToken'
      )
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(safeLimit)
      .lean(),

    Store.countDocuments(query),
  ]);

  return {
    stores,

    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages:
        Math.ceil(
          total / safeLimit
        ),
    },
  };
}


// ============================================================================
// GET STORE
// ============================================================================

async function getStoreById(
  storeId
) {
  const store =
    await Store.findById(storeId)
      .select(
        '-accessToken'
      )
      .lean();

  if (!store) {
    const error =
      new Error(
        'Store not found.'
      );

    error.statusCode = 404;

    throw error;
  }

  const [
    owner,
    billing,
  ] = await Promise.all([
    User.findById(
      store.userId
    ),

    Billing.find({
      storeId: store._id,
    })
      .sort({
        createdAt: -1,
      })
      .lean(),
  ]);

  return {
    store,
    owner:
      toSafeUser(owner),
    billing,
  };
}


// ============================================================================
// UPDATE STORE STATUS
// ============================================================================

async function updateStoreStatus(
  storeId,
  status
) {
  const allowedStatuses = [
    'pending',
    'active',
    'suspended',
    'uninstalled',
  ];

  if (
    !allowedStatuses.includes(status)
  ) {
    const error =
      new Error(
        'Invalid store status.'
      );

    error.statusCode = 400;

    throw error;
  }

  const update = {
    status,
  };

  if (
    status === 'uninstalled'
  ) {
    update.uninstalledAt =
      new Date();
  }

  if (
    status === 'active'
  ) {
    update.uninstalledAt =
      null;
  }

  const store =
    await Store.findByIdAndUpdate(
      storeId,
      update,
      {
        new: true,
        runValidators: true,
      }
    )
      .select(
        '-accessToken'
      );

  if (!store) {
    const error =
      new Error(
        'Store not found.'
      );

    error.statusCode = 404;

    throw error;
  }

  return store;
}


// ============================================================================
// LIST BILLING / SUBSCRIPTIONS
// ============================================================================

async function listBilling({
  page = 1,
  limit = 20,
  plan = null,
  status = null,
} = {}) {
  const safePage =
    Math.max(
      Number(page) || 1,
      1
    );

  const safeLimit =
    Math.min(
      Math.max(
        Number(limit) || 20,
        1
      ),
      100
    );

  const query = {};

  if (plan) {
    query.plan = plan;
  }

  if (status) {
    query.status = status;
  }

  const skip =
    (safePage - 1) *
    safeLimit;

  const [
    billing,
    total,
  ] = await Promise.all([
    Billing.find(query)
      .populate(
        'userId',
        'name email role status'
      )
      .populate(
        'storeId',
        'storeName shopDomain status'
      )
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(safeLimit)
      .lean(),

    Billing.countDocuments(query),
  ]);

  return {
    billing,

    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages:
        Math.ceil(
          total / safeLimit
        ),
    },
  };
}


// ============================================================================
// BILLING SUMMARY
// ============================================================================

async function getBillingSummary() {
  const [
    byPlan,
    byStatus,
    revenue,
  ] = await Promise.all([
    Billing.aggregate([
      {
        $group: {
          _id: '$plan',
          count: {
            $sum: 1,
          },
          amount: {
            $sum: '$amount',
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]),

    Billing.aggregate([
      {
        $group: {
          _id: '$status',
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]),

    Billing.aggregate([
      {
        $match: {
          status: {
            $in: [
              'active',
              'trialing',
            ],
          },
        },
      },
      {
        $group: {
          _id: '$currency',
          amount: {
            $sum: '$amount',
          },
        },
      },
    ]),
  ]);

  return {
    byPlan,
    byStatus,
    revenue,
  };
}


// ============================================================================
// USER COUNTS
// ============================================================================

async function getUserCounts() {
  const result =
    await User.aggregate([
      {
        $group: {
          _id: '$status',
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

  return result;
}


// ============================================================================
// STORE COUNTS
// ============================================================================

async function getStoreCounts() {
  const result =
    await Store.aggregate([
      {
        $group: {
          _id: '$status',
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

  return result;
}


// ============================================================================
// RECENT USERS
// ============================================================================

async function getRecentUsers(
  limit = 10
) {
  const safeLimit =
    Math.min(
      Math.max(
        Number(limit) || 10,
        1
      ),
      50
    );

  const users =
    await User.find({
      deletedAt: null,
    })
      .sort({
        createdAt: -1,
      })
      .limit(safeLimit)
      .lean();

  return users.map(
    toSafeUser
  );
}


// ============================================================================
// RECENT STORES
// ============================================================================

async function getRecentStores(
  limit = 10
) {
  const safeLimit =
    Math.min(
      Math.max(
        Number(limit) || 10,
        1
      ),
      50
    );

  return Store.find({})
    .select(
      '-accessToken'
    )
    .sort({
      createdAt: -1,
    })
    .limit(safeLimit)
    .lean();
}


// ============================================================================
// SYSTEM OVERVIEW
// ============================================================================

async function getSystemOverview() {
  const [
    dashboard,
    recentUsers,
    recentStores,
  ] = await Promise.all([
    getDashboardOverview(),
    getRecentUsers(10),
    getRecentStores(10),
  ]);

  return {
    dashboard,
    recentUsers,
    recentStores,
  };
}


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  getDashboardOverview,

  listUsers,
  getUserById,

  updateUserStatus,
  activateUser,
  suspendUser,
  deleteUser,

  listStores,
  getStoreById,
  updateStoreStatus,

  listBilling,
  getBillingSummary,

  getUserCounts,
  getStoreCounts,

  getRecentUsers,
  getRecentStores,

  getSystemOverview,
};
