/**
 * ============================================================================
 * StoreForge AI
 * Authentication Validation Schemas
 * ============================================================================
 *
 * File:
 *   backend/src/modules/auth/auth.validation.js
 *
 * Purpose:
 *   Validation rules for authentication-related requests.
 *
 * Used by:
 *   modules/auth/auth.routes.js
 *
 * Validation middleware:
 *   src/middleware/validate.js
 * ============================================================================
 */

'use strict';


// ============================================================================
// REGISTER
// ============================================================================

const registerValidation = {
  body: {
    name: {
      required: true,
      type: 'string',
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-ZÀ-ÿ0-9 .'-]+$/,
      patternMessage:
        'Name contains invalid characters.'
    },

    email: {
      required: true,
      type: 'email',
      maxLength: 254
    },

    password: {
      required: true,
      type: 'string',
      minLength: 8,
      maxLength: 128
    }
  }
};


// ============================================================================
// LOGIN
// ============================================================================

const loginValidation = {
  body: {
    email: {
      required: true,
      type: 'email',
      maxLength: 254
    },

    password: {
      required: true,
      type: 'string',
      minLength: 1,
      maxLength: 128
    }
  }
};


// ============================================================================
// REFRESH TOKEN
// ============================================================================

const refreshTokenValidation = {
  body: {
    refreshToken: {
      required: true,
      type: 'string',
      minLength: 20,
      maxLength: 4096
    }
  }
};


// ============================================================================
// LOGOUT
// ============================================================================

const logoutValidation = {
  body: {
    refreshToken: {
      required: false,
      type: 'string',
      maxLength: 4096
    }
  }
};


// ============================================================================
// FORGOT PASSWORD
// ============================================================================

const forgotPasswordValidation = {
  body: {
    email: {
      required: true,
      type: 'email',
      maxLength: 254
    }
  }
};


// ============================================================================
// RESET PASSWORD
// ============================================================================

const resetPasswordValidation = {
  body: {
    token: {
      required: true,
      type: 'string',
      minLength: 20,
      maxLength: 4096
    },

    password: {
      required: true,
      type: 'string',
      minLength: 8,
      maxLength: 128
    }
  }
};


// ============================================================================
// CHANGE PASSWORD
// ============================================================================

const changePasswordValidation = {
  body: {
    currentPassword: {
      required: true,
      type: 'string',
      minLength: 1,
      maxLength: 128
    },

    newPassword: {
      required: true,
      type: 'string',
      minLength: 8,
      maxLength: 128
    }
  }
};


// ============================================================================
// VERIFY EMAIL
// ============================================================================

const verifyEmailValidation = {
  body: {
    token: {
      required: true,
      type: 'string',
      minLength: 20,
      maxLength: 4096
    }
  }
};


// ============================================================================
// RESEND EMAIL VERIFICATION
// ============================================================================

const resendVerificationValidation = {
  body: {
    email: {
      required: true,
      type: 'email',
      maxLength: 254
    }
  }
};


// ============================================================================
// UPDATE PROFILE
// ============================================================================

const updateProfileValidation = {
  body: {
    name: {
      required: false,
      type: 'string',
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-ZÀ-ÿ0-9 .'-]+$/,
      patternMessage:
        'Name contains invalid characters.'
    },

    email: {
      required: false,
      type: 'email',
      maxLength: 254
    }
  }
};


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
  logoutValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  verifyEmailValidation,
  resendVerificationValidation,
  updateProfileValidation
};
