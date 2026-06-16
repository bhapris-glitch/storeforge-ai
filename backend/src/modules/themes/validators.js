// == storeforge-ai/backend/src/modules/themes/validators.js
const {
  THEME_CATEGORIES,
  THEME_LAYOUTS,
  SECTION_TYPES
} = require("./constants");

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const isNonEmptyString = (value) => {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
};

const isObject = (value) => {
  return (
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
};

/*
|--------------------------------------------------------------------------
| Theme Validation
|--------------------------------------------------------------------------
*/

const validateCreateTheme = (
  payload = {}
) => {
  const errors = [];

  if (!isNonEmptyString(payload.storeId)) {
    errors.push(
      "storeId is required."
    );
  }

  if (!isNonEmptyString(payload.name)) {
    errors.push(
      "Theme name is required."
    );
  }

  if (
    payload.category &&
    !THEME_CATEGORIES.includes(
      payload.category
    )
  ) {
    errors.push(
      "Invalid theme category."
    );
  }

  if (
    payload.layout &&
    !THEME_LAYOUTS.includes(
      payload.layout
    )
  ) {
    errors.push(
      "Invalid theme layout."
    );
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/*
|--------------------------------------------------------------------------
| Update Theme Validation
|--------------------------------------------------------------------------
*/

const validateUpdateTheme = (
  payload = {}
) => {
  const errors = [];

  if (
    payload.name !== undefined &&
    !isNonEmptyString(payload.name)
  ) {
    errors.push(
      "Theme name cannot be empty."
    );
  }

  if (
    payload.category &&
    !THEME_CATEGORIES.includes(
      payload.category
    )
  ) {
    errors.push(
      "Invalid theme category."
    );
  }

  if (
    payload.layout &&
    !THEME_LAYOUTS.includes(
      payload.layout
    )
  ) {
    errors.push(
      "Invalid theme layout."
    );
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/*
|--------------------------------------------------------------------------
| Section Validation
|--------------------------------------------------------------------------
*/

const validateSection = (
  payload = {}
) => {
  const errors = [];

  if (!isNonEmptyString(payload.name)) {
    errors.push(
      "Section name is required."
    );
  }

  if (
    !SECTION_TYPES.includes(
      payload.type
    )
  ) {
    errors.push(
      "Invalid section type."
    );
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/*
|--------------------------------------------------------------------------
| Block Validation
|--------------------------------------------------------------------------
*/

const validateBlock = (
  payload = {}
) => {
  const errors = [];

  if (!isNonEmptyString(payload.type)) {
    errors.push(
      "Block type is required."
    );
  }

  if (
    payload.settings &&
    !isObject(payload.settings)
  ) {
    errors.push(
      "Block settings must be an object."
    );
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/*
|--------------------------------------------------------------------------
| AI Prompt Validation
|--------------------------------------------------------------------------
*/

const validateAIPrompt = (
  prompt
) => {
  const errors = [];

  if (!isNonEmptyString(prompt)) {
    errors.push(
      "AI prompt is required."
    );
  }

  if (
    typeof prompt === "string" &&
    prompt.length < 10
  ) {
    errors.push(
      "AI prompt is too short."
    );
  }

  if (
    typeof prompt === "string" &&
    prompt.length > 5000
  ) {
    errors.push(
      "AI prompt is too long."
    );
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/*
|--------------------------------------------------------------------------
| Asset Validation
|--------------------------------------------------------------------------
*/

const validateAsset = (
  payload = {}
) => {
  const errors = [];

  if (!isNonEmptyString(payload.key)) {
    errors.push(
      "Asset key is required."
    );
  }

  if (
    !payload.value &&
    !payload.attachment
  ) {
    errors.push(
      "Asset content is required."
    );
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

module.exports = {

  validateCreateTheme,

  validateUpdateTheme,

  validateSection,

  validateBlock,

  validateAIPrompt,

  validateAsset

};
