// storeforge-ai/backend/src/modules/themes/preview.service.js
const crypto = require("crypto");

const Theme = require("./theme.model");

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const generateToken = () => {
  return crypto
    .randomBytes(32)
    .toString("hex");
};

/*
|--------------------------------------------------------------------------
| Create Preview
|--------------------------------------------------------------------------
*/

const createPreview = async (
  themeId,
  userId
) => {

  const theme =
    await Theme.findOne({
      _id: themeId,
      userId,
      status: {
        $ne: "deleted"
      }
    });

  if (!theme) {
    throw new Error(
      "Theme not found"
    );
  }

  const token =
    generateToken();

  const expiresAt =
    new Date(
      Date.now() +
      1000 * 60 * 60 * 24
    ); // 24 Hours

  theme.previewUrl =
    `${process.env.APP_URL}/preview/${token}`;

  theme.previewToken =
    token;

  theme.previewEnabled =
    true;

  theme.previewExpiresAt =
    expiresAt;

  await theme.save();

  return {
    previewUrl:
      theme.previewUrl,
    expiresAt
  };

};

/*
|--------------------------------------------------------------------------
| Validate Preview
|--------------------------------------------------------------------------
*/

const validatePreview =
  async (token) => {

    const theme =
      await Theme.findOne({
        previewToken:
          token,
        previewEnabled:
          true
      });

    if (!theme) {
      throw new Error(
        "Preview not found"
      );
    }

    if (
      theme.previewExpiresAt &&
      theme.previewExpiresAt <
        new Date()
    ) {
      throw new Error(
        "Preview expired"
      );
    }

    theme.views += 1;

    await theme.save();

    return theme;

  };

/*
|--------------------------------------------------------------------------
| Disable Preview
|--------------------------------------------------------------------------
*/

const disablePreview =
  async (
    themeId,
    userId
  ) => {

    const theme =
      await Theme.findOne({
        _id: themeId,
        userId
      });

    if (!theme) {
      throw new Error(
        "Theme not found"
      );
    }

    theme.previewEnabled =
      false;

    theme.previewToken =
      "";

    theme.previewUrl =
      "";

    theme.previewExpiresAt =
      null;

    await theme.save();

    return theme;

  };

/*
|--------------------------------------------------------------------------
| Refresh Preview
|--------------------------------------------------------------------------
*/

const refreshPreview =
  async (
    themeId,
    userId
  ) => {

    await disablePreview(
      themeId,
      userId
    );

    return createPreview(
      themeId,
      userId
    );

  };

/*
|--------------------------------------------------------------------------
| Extend Preview
|--------------------------------------------------------------------------
*/

const extendPreview =
  async (
    themeId,
    userId,
    hours = 24
  ) => {

    const theme =
      await Theme.findOne({
        _id: themeId,
        userId
      });

    if (!theme) {
      throw new Error(
        "Theme not found"
      );
    }

    theme.previewExpiresAt =
      new Date(
        Date.now() +
        hours *
          60 *
          60 *
          1000
      );

    await theme.save();

    return theme;

  };

/*
|--------------------------------------------------------------------------
| Get Preview Information
|--------------------------------------------------------------------------
*/

const getPreview =
  async (
    themeId,
    userId
  ) => {

    const theme =
      await Theme.findOne({
        _id: themeId,
        userId
      });

    if (!theme) {
      throw new Error(
        "Theme not found"
      );
    }

    return {
      previewEnabled:
        theme.previewEnabled,
      previewUrl:
        theme.previewUrl,
      previewExpiresAt:
        theme.previewExpiresAt
    };

  };

module.exports = {

  createPreview,

  validatePreview,

  disablePreview,

  refreshPreview,

  extendPreview,

  getPreview

};
