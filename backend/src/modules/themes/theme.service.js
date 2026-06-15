// =============================================================
// Layboka AI 
// storeforge-ai/backend/src/modules/themes/theme.service.js
// =============================================================
const Theme = require("./theme.model");

/*
|--------------------------------------------------------------------------
| Create Theme
|--------------------------------------------------------------------------
*/

const createTheme = async ({
  userId,
  storeId,
  name,
  description = "",
  category = "custom",
  aiGenerated = false,
  aiPrompt = ""
}) => {
  const theme = await Theme.create({
    userId,
    storeId,
    name,
    description,
    category,
    aiGenerated,
    aiPrompt
  });

  return theme;
};

/*
|--------------------------------------------------------------------------
| Get User Themes
|--------------------------------------------------------------------------
*/

const getUserThemes = async (
  userId,
  storeId
) => {
  const filter = {
    userId,
    status: {
      $ne: "deleted"
    }
  };

  if (storeId) {
    filter.storeId = storeId;
  }

  return await Theme.find(filter)
    .sort({
      updatedAt: -1
    })
    .populate(
      "storeId",
      "storeName shopDomain"
    );
};

/*
|--------------------------------------------------------------------------
| Get Theme By ID
|--------------------------------------------------------------------------
*/

const getThemeById = async (
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
    })
      .populate(
        "storeId",
        "storeName shopDomain"
      )
      .populate("sections");

  if (!theme) {
    throw new Error(
      "Theme not found"
    );
  }

  return theme;
};

/*
|--------------------------------------------------------------------------
| Update Theme
|--------------------------------------------------------------------------
*/

const updateTheme = async (
  themeId,
  userId,
  updateData
) => {
  const theme =
    await Theme.findOneAndUpdate(
      {
        _id: themeId,
        userId,
        status: {
          $ne: "deleted"
        }
      },
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

  if (!theme) {
    throw new Error(
      "Theme not found"
    );
  }

  return theme;
};

/*
|--------------------------------------------------------------------------
| Duplicate Theme
|--------------------------------------------------------------------------
*/

const duplicateTheme = async (
  themeId,
  userId
) => {
  const original =
    await getThemeById(
      themeId,
      userId
    );

  const clone =
    original.toObject();

  delete clone._id;
  delete clone.createdAt;
  delete clone.updatedAt;

  clone.name =
    `${original.name} Copy`;

  clone.role =
    "development";

  clone.shopifyThemeId =
    "";

  clone.deploymentStatus =
    "draft";

  clone.publishedAt = null;

  clone.deployments = 0;

  clone.views = 0;

  clone.version = 1;

  clone.versions = [];

  clone.clonedFrom =
    original._id;

  return await Theme.create(
    clone
  );
};

/*
|--------------------------------------------------------------------------
| Publish Theme
|--------------------------------------------------------------------------
*/

const publishTheme = async (
  themeId,
  userId
) => {
  const theme =
    await getThemeById(
      themeId,
      userId
    );

  theme.role = "main";

  theme.deploymentStatus =
    "published";

  theme.publishedAt =
    new Date();

  theme.deployments += 1;

  await theme.save();

  return theme;
};

/*
|--------------------------------------------------------------------------
| Archive Theme
|--------------------------------------------------------------------------
*/

const archiveTheme = async (
  themeId,
  userId
) => {
  const theme =
    await getThemeById(
      themeId,
      userId
    );

  theme.status =
    "archived";

  await theme.save();

  return theme;
};

/*
|--------------------------------------------------------------------------
| Soft Delete Theme
|--------------------------------------------------------------------------
*/

const deleteTheme = async (
  themeId,
  userId
) => {
  const theme =
    await getThemeById(
      themeId,
      userId
    );

  theme.status =
    "deleted";

  await theme.save();

  return true;
};

/*
|--------------------------------------------------------------------------
| Restore Theme
|--------------------------------------------------------------------------
*/

const restoreTheme = async (
  themeId,
  userId
) => {
  const theme =
    await Theme.findOne({
      _id: themeId,
      userId,
      status: "deleted"
    });

  if (!theme) {
    throw new Error(
      "Theme not found"
    );
  }

  theme.status =
    "active";

  await theme.save();

  return theme;
};

/*
|--------------------------------------------------------------------------
| Save Version
|--------------------------------------------------------------------------
*/

const saveVersion = async (
  themeId,
  userId,
  notes = ""
) => {
  const theme =
    await getThemeById(
      themeId,
      userId
    );

  theme.version += 1;

  theme.versions.push({
    version:
      theme.version,
    notes
  });

  await theme.save();

  return theme;
};

/*
|--------------------------------------------------------------------------
| Rollback Version
|--------------------------------------------------------------------------
*/

const rollbackVersion =
  async (
    themeId,
    userId,
    version
  ) => {
    const theme =
      await getThemeById(
        themeId,
        userId
      );

    const exists =
      theme.versions.find(
        (v) =>
          v.version ===
          version
      );

    if (!exists) {
      throw new Error(
        "Version not found"
      );
    }

    theme.version =
      version;

    await theme.save();

    return theme;
  };

/*
|--------------------------------------------------------------------------
| Generate Preview
|--------------------------------------------------------------------------
*/

const generatePreview =
  async (
    themeId,
    userId
  ) => {
    const theme =
      await getThemeById(
        themeId,
        userId
      );

    theme.previewUrl =
      `https://preview.storeforge.ai/${theme._id}`;

    await theme.save();

    return theme;
  };

/*
|--------------------------------------------------------------------------
| Deploy Theme
|--------------------------------------------------------------------------
|
| Placeholder.
| Will later deploy through Shopify Admin API.
|
*/

const deployTheme = async (
  themeId,
  userId
) => {
  const theme =
    await getThemeById(
      themeId,
      userId
    );

  theme.deploymentStatus =
    "deploying";

  await theme.save();

  return {
    success: true,
    message:
      "Deployment started.",
    theme
  };
};

module.exports = {
  createTheme,
  getUserThemes,
  getThemeById,
  updateTheme,
  duplicateTheme,
  publishTheme,
  archiveTheme,
  deleteTheme,
  restoreTheme,
  saveVersion,
  rollbackVersion,
  generatePreview,
  deployTheme
};
