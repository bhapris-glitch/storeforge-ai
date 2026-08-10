/**
 * ============================================================================
 * StoreForge AI
 * Request Validation Middleware
 * ============================================================================
 *
 * File:
 *   backend/src/middleware/validate.js
 *
 * Purpose:
 *   Validate request body, query parameters, and route parameters before
 *   controller execution.
 *
 * Usage:
 *
 *   router.post(
 *     '/register',
 *     validate({
 *       body: {
 *         email: { required: true, type: 'email' },
 *         password: { required: true, type: 'string', minLength: 8 }
 *       }
 *     }),
 *     controller.register
 *   );
 *
 * ============================================================================
 */

'use strict';


// ============================================================================
// HELPERS
// ============================================================================

function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'string' && value.trim() === '')
  );
}


function getValue(source, field) {
  if (!source) {
    return undefined;
  }

  return source[field];
}


function addError(errors, field, message) {
  errors.push({
    field,
    message
  });
}


// ============================================================================
// TYPE VALIDATION
// ============================================================================

function validateType(value, rule) {
  if (rule.type === undefined) {
    return null;
  }

  switch (rule.type) {
    case 'string':
      if (typeof value !== 'string') {
        return 'must be a string';
      }
      break;

    case 'number':
      if (
        typeof value !== 'number' ||
        Number.isNaN(value)
      ) {
        return 'must be a number';
      }
      break;

    case 'integer':
      if (
        !Number.isInteger(value)
      ) {
        return 'must be an integer';
      }
      break;

    case 'boolean':
      if (typeof value !== 'boolean') {
        return 'must be a boolean';
      }
      break;

    case 'array':
      if (!Array.isArray(value)) {
        return 'must be an array';
      }
      break;

    case 'object':
      if (
        typeof value !== 'object' ||
        value === null ||
        Array.isArray(value)
      ) {
        return 'must be an object';
      }
      break;

    case 'email':
      if (
        typeof value !== 'string' ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        return 'must be a valid email address';
      }
      break;

    case 'url':
      try {
        new URL(value);
      } catch {
        return 'must be a valid URL';
      }
      break;

    case 'mongoId':
      if (
        typeof value !== 'string' ||
        !/^[a-fA-F0-9]{24}$/.test(value)
      ) {
        return 'must be a valid MongoDB ObjectId';
      }
      break;

    default:
      return `unsupported validation type: ${rule.type}`;
  }

  return null;
}


// ============================================================================
// SINGLE FIELD VALIDATION
// ============================================================================

function validateField(
  value,
  field,
  rule,
  errors
) {
  // --------------------------------------------------------------------------
  // Required
  // --------------------------------------------------------------------------

  if (rule.required && isEmpty(value)) {
    addError(
      errors,
      field,
      rule.requiredMessage ||
        `${field} is required`
    );

    return;
  }

  // Optional field that wasn't supplied.
  if (isEmpty(value)) {
    return;
  }

  // --------------------------------------------------------------------------
  // Type
  // --------------------------------------------------------------------------

  const typeError =
    validateType(value, rule);

  if (typeError) {
    addError(
      errors,
      field,
      `${field} ${typeError}`
    );

    return;
  }

  // --------------------------------------------------------------------------
  // String length
  // --------------------------------------------------------------------------

  if (
    typeof value === 'string' &&
    rule.minLength !== undefined &&
    value.length < rule.minLength
  ) {
    addError(
      errors,
      field,
      `${field} must be at least ${rule.minLength} characters`
    );
  }

  if (
    typeof value === 'string' &&
    rule.maxLength !== undefined &&
    value.length > rule.maxLength
  ) {
    addError(
      errors,
      field,
      `${field} must not exceed ${rule.maxLength} characters`
    );
  }

  // --------------------------------------------------------------------------
  // Number limits
  // --------------------------------------------------------------------------

  if (
    typeof value === 'number' &&
    rule.min !== undefined &&
    value < rule.min
  ) {
    addError(
      errors,
      field,
      `${field} must be at least ${rule.min}`
    );
  }

  if (
    typeof value === 'number' &&
    rule.max !== undefined &&
    value > rule.max
  ) {
    addError(
      errors,
      field,
      `${field} must not exceed ${rule.max}`
    );
  }

  // --------------------------------------------------------------------------
  // Array limits
  // --------------------------------------------------------------------------

  if (
    Array.isArray(value) &&
    rule.minItems !== undefined &&
    value.length < rule.minItems
  ) {
    addError(
      errors,
      field,
      `${field} must contain at least ${rule.minItems} items`
    );
  }

  if (
    Array.isArray(value) &&
    rule.maxItems !== undefined &&
    value.length > rule.maxItems
  ) {
    addError(
      errors,
      field,
      `${field} must not contain more than ${rule.maxItems} items`
    );
  }

  // --------------------------------------------------------------------------
  // Enum
  // --------------------------------------------------------------------------

  if (
    Array.isArray(rule.enum) &&
    !rule.enum.includes(value)
  ) {
    addError(
      errors,
      field,
      `${field} must be one of: ${rule.enum.join(', ')}`
    );
  }

  // --------------------------------------------------------------------------
  // Regular expression
  // --------------------------------------------------------------------------

  if (
    rule.pattern &&
    typeof value === 'string'
  ) {
    const regex =
      rule.pattern instanceof RegExp
        ? rule.pattern
        : new RegExp(rule.pattern);

    if (!regex.test(value)) {
      addError(
        errors,
        field,
        rule.patternMessage ||
          `${field} has an invalid format`
      );
    }
  }

  // --------------------------------------------------------------------------
  // Custom validator
  // --------------------------------------------------------------------------

  if (typeof rule.validate === 'function') {
    const result =
      rule.validate(value);

    if (result !== true) {
      addError(
        errors,
        field,
        typeof result === 'string'
          ? result
          : `${field} is invalid`
      );
    }
  }
}


// ============================================================================
// VALIDATE SOURCE
// ============================================================================

function validateSource(
  source,
  schema,
  errors
) {
  if (!schema) {
    return;
  }

  for (const [field, ruleConfig] of Object.entries(schema)) {
    const rule =
      typeof ruleConfig === 'function'
        ? { validate: ruleConfig }
        : ruleConfig || {};

    const value =
      getValue(source, field);

    validateField(
      value,
      field,
      rule,
      errors
    );
  }
}


// ============================================================================
// MAIN VALIDATE MIDDLEWARE
// ============================================================================

function validate(schema = {}) {
  return function validationMiddleware(
    req,
    res,
    next
  ) {
    try {
      const errors = [];

      validateSource(
        req.body,
        schema.body,
        errors
      );

      validateSource(
        req.query,
        schema.query,
        errors
      );

      validateSource(
        req.params,
        schema.params,
        errors
      );

      // ----------------------------------------------------------------------
      // Validation failed
      // ----------------------------------------------------------------------

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed.',
          errors
        });
      }

      return next();

    } catch (error) {
      return next(error);
    }
  };
}


// ============================================================================
// REQUIRED FIELD SHORTCUT
// ============================================================================

function required(fields = []) {
  const schema = {};

  for (const field of fields) {
    schema[field] = {
      required: true
    };
  }

  return schema;
}


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = validate;

module.exports.validate = validate;
module.exports.required = required;
module.exports.validateField = validateField;
module.exports.validateType = validateType;
