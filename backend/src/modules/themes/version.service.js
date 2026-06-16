//== storeforge-ai/backend/src/modules/themes/version.service.js
const Theme = require("./theme.model");

/*
|--------------------------------------------------------------------------
| Create Snapshot
|--------------------------------------------------------------------------
|
| Stores a complete snapshot of the theme before any major change.
|
*/

const createSnapshot = async (
  themeId,
  userId,
  notes = "Manual version"
) => {

  const theme = await Theme.findOne({
    _id: themeId,
    userId,
    status: {
      $ne: "deleted"
    }
  });

  if (!theme) {
    throw new Error("Theme not found");
  }

  const nextVersion =
    theme.version + 1;

  const snapshot = {

    version: nextVersion,

    notes,

    createdAt: new Date(),

    data: {

      name: theme.name,

      description:
        theme.description,

      category:
        theme.category,

      layout:
        theme.layout,

      colors:
        theme.colors,

      typography:
        theme.typography,

      assets:
        theme.assets,

      sections:
        theme.sections,

      aiGenerated:
        theme.aiGenerated,

      aiPrompt:
        theme.aiPrompt

    }

  };

  theme.version =
    nextVersion;

  theme.versions.push(
    snapshot
  );

  await theme.save();

  return snapshot;

};

/*
|--------------------------------------------------------------------------
| Get Version History
|--------------------------------------------------------------------------
*/

const getVersionHistory =
  async (
    themeId,
    userId
  ) => {

    const theme =
      await Theme.findOne({
        _id: themeId,
        userId
      }).select(
        "version versions"
      );

    if (!theme) {
      throw new Error(
        "Theme not found"
      );
    }

    return theme.versions.sort(
      (a, b) =>
        b.version -
        a.version
    );

  };

/*
|--------------------------------------------------------------------------
| Get Version
|--------------------------------------------------------------------------
*/

const getVersion =
  async (
    themeId,
    userId,
    version
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

    const snapshot =
      theme.versions.find(
        v =>
          v.version ===
          version
      );

    if (!snapshot) {
      throw new Error(
        "Version not found"
      );
    }

    return snapshot;

  };

/*
|--------------------------------------------------------------------------
| Restore Version
|--------------------------------------------------------------------------
*/

const restoreVersion =
  async (
    themeId,
    userId,
    version
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

    const snapshot =
      theme.versions.find(
        v =>
          v.version ===
          version
      );

    if (!snapshot) {
      throw new Error(
        "Version not found"
      );
    }

    Object.assign(
      theme,
      snapshot.data
    );

    theme.version =
      snapshot.version;

    await theme.save();

    return theme;

  };

/*
|--------------------------------------------------------------------------
| Compare Versions
|--------------------------------------------------------------------------
*/

const compareVersions =
  async (
    themeId,
    userId,
    fromVersion,
    toVersion
  ) => {

    const first =
      await getVersion(
        themeId,
        userId,
        fromVersion
      );

    const second =
      await getVersion(
        themeId,
        userId,
        toVersion
      );

    return {

      from:
        first.version,

      to:
        second.version,

      changes: {

        name:
          first.data.name !==
          second.data.name,

        layout:
          first.data.layout !==
          second.data.layout,

        category:
          first.data.category !==
          second.data.category,

        colors:
          JSON.stringify(
            first.data.colors
          ) !==
          JSON.stringify(
            second.data.colors
          ),

        typography:
          JSON.stringify(
            first.data.typography
          ) !==
          JSON.stringify(
            second.data.typography
          ),

        assets:
          first.data.assets.length !==
          second.data.assets.length,

        sections:
          first.data.sections.length !==
          second.data.sections.length

      }

    };

  };

/*
|--------------------------------------------------------------------------
| Delete Version
|--------------------------------------------------------------------------
*/

const deleteVersion =
  async (
    themeId,
    userId,
    version
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

    theme.versions =
      theme.versions.filter(
        item =>
          item.version !==
          version
      );

    await theme.save();

    return true;

  };

/*
|--------------------------------------------------------------------------
| Keep Latest Versions
|--------------------------------------------------------------------------
*/

const cleanupVersions =
  async (
    themeId,
    userId,
    keep = 25
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

    theme.versions =
      theme.versions
        .sort(
          (a, b) =>
            b.version -
            a.version
        )
        .slice(0, keep);

    await theme.save();

    return theme.versions;

  };

module.exports = {

  createSnapshot,

  getVersionHistory,

  getVersion,

  restoreVersion,

  compareVersions,

  deleteVersion,

  cleanupVersions

};
