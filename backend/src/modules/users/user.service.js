/**
 * ============================================================================
 * StoreForge AI
 * User Service
 * ============================================================================
 *
 * File:
 *   backend/src/modules/users/user.service.js
 *
 * Purpose:
 *   Business logic for StoreForge users.
 *
 * Responsibilities:
 *   - Create users
 *   - Find users
 *   - Update profiles
 *   - Manage account status
 *   - Manage onboarding state
 *   - Soft delete users
 *
 * Authentication/password logic remains in:
 *   modules/auth/auth.service.js
 * ============================================================================
 */

'use strict';

const User = require('./user.model');


// ============================================================================
// CREATE USER
// ============================================================================

async function createUser(data = {}) {
  const {
    name,
    email,
    passwordHash,
    role,
    status
  } = data;

  if (!name) {
    throw new Error('Name is required.');
  }

  if (!email) {
    throw new Error('Email is required.');
  }

  const normalizedEmail =
    String(email).trim().toLowerCase();

  const existingUser =
    await User.findOne({
      email: normalizedEmail,
      status: { $ne: 'deleted' }
    });

  if (existingUser) {
    const error = new Error(
      'An account with this email already exists.'
    );

    error.code = 'USER_ALREADY_EXISTS';

    throw error;
  }

  const user = new User({
    name: String(name).trim(),
    email: normalizedEmail,
    passwordHash,
    role: role || 'user',
    status: status || 'pending'
  });

  await user.save();

  return user.toSafeObject();
}


// ============================================================================
// FIND USER BY ID
// ============================================================================

async function findById(userId, options = {}) {
  if (!userId) {
    throw new Error('User ID is required.');
  }

  let query = User.findById(userId);

  if (options.includeSensitive === true) {
    query = query.select(
      '+passwordHash ' +
      '+passwordResetTokenHash ' +
      '+passwordResetExpiresAt ' +
      '+emailVerificationTokenHash ' +
      '+emailVerificationExpiresAt ' +
      '+lastLoginIp'
    );
  }

  const user = await query;

  if (!user) {
    return null;
  }

  if (options.includeSensitive === true) {
    return user;
  }

  return user.toSafeObject();
}


// ============================================================================
// FIND USER BY EMAIL
// ============================================================================

async function findByEmail(
  email,
  options = {}
) {
  if (!email) {
    throw new Error('Email is required.');
  }

  const normalizedEmail =
    String(email).trim().toLowerCase();

  let query = User.findOne({
    email: normalizedEmail
  });

  if (options.includeSensitive === true) {
    query = query.select(
      '+passwordHash ' +
      '+passwordResetTokenHash ' +
      '+passwordResetExpiresAt ' +
      '+emailVerificationTokenHash ' +
      '+emailVerificationExpiresAt ' +
      '+lastLoginIp'
    );
  }

  const user = await query;

  if (!user) {
    return null;
  }

  if (options.includeSensitive === true) {
    return user;
  }

  return user.toSafeObject();
}


// ============================================================================
// LIST USERS
// ============================================================================

async function listUsers(options = {}) {
  const {
    page = 1,
    limit = 20,
    search,
    role,
    status
  } = options;

  const safePage =
    Math.max(1, Number(page) || 1);

  const safeLimit =
    Math.min(
      100,
      Math.max(1, Number(limit) || 20)
    );

  const filter = {
    status: { $ne: 'deleted' }
  };

  if (role) {
    filter.role = role;
  }

  if (status) {
    filter.status = status;
  }

  if (search) {
    const escapedSearch =
      String(search)
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    filter.$or = [
      {
        name: {
          $regex: escapedSearch,
          $options: 'i'
        }
      },
      {
        email: {
          $regex: escapedSearch,
          $options: 'i'
        }
      }
    ];
  }

  const skip =
    (safePage - 1) * safeLimit;

  const [
    users,
    total
  ] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit),

    User.countDocuments(filter)
  ]);

  return {
    users: users.map(
      (user) => user.toSafeObject()
    ),

    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(
        total / safeLimit
      )
    }
  };
}


// ============================================================================
// UPDATE PROFILE
// ============================================================================

async function updateProfile(
  userId,
  updates = {}
) {
  if (!userId) {
    throw new Error('User ID is required.');
  }

  const allowedUpdates = {};

  if (updates.name !== undefined) {
    allowedUpdates.name =
      String(updates.name).trim();
  }

  if (updates.avatarUrl !== undefined) {
    allowedUpdates.avatarUrl =
      updates.avatarUrl || null;
  }

  if (updates.timezone !== undefined) {
    allowedUpdates.timezone =
      String(updates.timezone).trim();
  }

  const user =
    await User.findByIdAndUpdate(
      userId,
      {
        $set: allowedUpdates
      },
      {
        new: true,
        runValidators: true
      }
    );

  if (!user) {
    const error =
      new Error('User not found.');

    error.code = 'USER_NOT_FOUND';

    throw error;
  }

  return user.toSafeObject();
}


// ============================================================================
// UPDATE EMAIL
// ============================================================================
//
// Email changes should normally be followed by email verification.
//

async function updateEmail(
  userId,
  email
) {
  if (!userId) {
    throw new Error('User ID is required.');
  }

  if (!email) {
    throw new Error('Email is required.');
  }

  const normalizedEmail =
    String(email).trim().toLowerCase();

  const existingUser =
    await User.findOne({
      email: normalizedEmail,
      _id: { $ne: userId },
      status: { $ne: 'deleted' }
    });

  if (existingUser) {
    const error = new Error(
      'An account with this email already exists.'
    );

    error.code = 'EMAIL_ALREADY_IN_USE';

    throw error;
  }

  const user =
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          email: normalizedEmail,
          emailVerified: false,
          emailVerifiedAt: null
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

  if (!user) {
    const error =
      new Error('User not found.');

    error.code = 'USER_NOT_FOUND';

    throw error;
  }

  return user.toSafeObject();
}


// ============================================================================
// UPDATE LOGIN INFORMATION
// ============================================================================

async function updateLastLogin(
  userId,
  ipAddress = null
) {
  if (!userId) {
    throw new Error('User ID is required.');
  }

  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress
      }
    }
  );
}


// ============================================================================
// UPDATE ONBOARDING
// ============================================================================

async function updateOnboarding(
  userId,
  step,
  completed = false
) {
  if (!userId) {
    throw new Error('User ID is required.');
  }

  const update = {
    onboardingStep: step
  };

  if (completed) {
    update.onboardingCompleted = true;
    update.onboardingStep = 'completed';
  }

  const user =
    await User.findByIdAndUpdate(
      userId,
      {
        $set: update
      },
      {
        new: true,
        runValidators: true
      }
    );

  if (!user) {
    const error =
      new Error('User not found.');

    error.code = 'USER_NOT_FOUND';

    throw error;
  }

  return user.toSafeObject();
}


// ============================================================================
// VERIFY EMAIL
// ============================================================================

async function markEmailVerified(userId) {
  if (!userId) {
    throw new Error('User ID is required.');
  }

  const user =
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          emailVerified: true,
          emailVerifiedAt: new Date(),

          status: 'active',

          emailVerificationTokenHash: null,
          emailVerificationExpiresAt: null
        }
      },
      {
        new: true
      }
    );

  if (!user) {
    const error =
      new Error('User not found.');

    error.code = 'USER_NOT_FOUND';

    throw error;
  }

  return user.toSafeObject();
}


// ============================================================================
// UPDATE ACCOUNT STATUS
// ============================================================================

async function updateStatus(
  userId,
  status
) {
  const allowedStatuses = [
    'active',
    'pending',
    'suspended',
    'deleted'
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error(
      `Invalid user status: ${status}`
    );
  }

  const user =
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          status,
          isActive:
            status === 'active'
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

  if (!user) {
    const error =
      new Error('User not found.');

    error.code = 'USER_NOT_FOUND';

    throw error;
  }

  return user.toSafeObject();
}


// ============================================================================
// UPDATE ROLE
// ============================================================================

async function updateRole(
  userId,
  role
) {
  const allowedRoles = [
    'user',
    'admin',
    'superadmin'
  ];

  if (!allowedRoles.includes(role)) {
    throw new Error(
      `Invalid user role: ${role}`
    );
  }

  const user =
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          role
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

  if (!user) {
    const error =
      new Error('User not found.');

    error.code = 'USER_NOT_FOUND';

    throw error;
  }

  return user.toSafeObject();
}


// ============================================================================
// INCREMENT TOKEN VERSION
// ============================================================================
//
// Used to invalidate existing refresh tokens/sessions.
//

async function incrementTokenVersion(
  userId
) {
  if (!userId) {
    throw new Error('User ID is required.');
  }

  const user =
    await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          tokenVersion: 1
        }
      },
      {
        new: true
      }
    );

  if (!user) {
    const error =
      new Error('User not found.');

    error.code = 'USER_NOT_FOUND';

    throw error;
  }

  return user.tokenVersion;
}


// ============================================================================
// SOFT DELETE
// ============================================================================

async function deleteUser(userId) {
  if (!userId) {
    throw new Error('User ID is required.');
  }

  const user =
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          status: 'deleted',
          isActive: false,
          deletedAt: new Date()
        }
      },
      {
        new: true
      }
    );

  if (!user) {
    const error =
      new Error('User not found.');

    error.code = 'USER_NOT_FOUND';

    throw error;
  }

  return {
    success: true,
    userId: user._id
  };
}


// ============================================================================
// RESTORE USER
// ============================================================================

async function restoreUser(userId) {
  if (!userId) {
    throw new Error('User ID is required.');
  }

  const user =
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          status: 'active',
          isActive: true,
          deletedAt: null
        }
      },
      {
        new: true
      }
    );

  if (!user) {
    const error =
      new Error('User not found.');

    error.code = 'USER_NOT_FOUND';

    throw error;
  }

  return user.toSafeObject();
}


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  createUser,
  findById,
  findByEmail,
  listUsers,
  updateProfile,
  updateEmail,
  updateLastLogin,
  updateOnboarding,
  markEmailVerified,
  updateStatus,
  updateRole,
  incrementTokenVersion,
  deleteUser,
  restoreUser
};
