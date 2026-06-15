// =====================================================================
// Layboka AI 
// storeforge-ai/backend/src/modules/themes/theme.controller.js
// ===============================================================
const {
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
} = require("./theme.service");

/*
|--------------------------------------------------------------------------
| Create Theme
|--------------------------------------------------------------------------
*/

const create = async (
  req,
  res,
  next
) => {
  try {
    const {
      storeId,
      name,
      description,
      category,
      aiGenerated,
      aiPrompt
    } = req.body;

    if (!storeId || !name) {
      return res.status(400).json({
        success: false,
        message:
          "storeId and name are required"
      });
    }

    const theme =
      await createTheme({
        userId: req.user.id,
        storeId,
        name,
        description,
        category,
        aiGenerated,
        aiPrompt
      });

    return res.status(201).json({
      success: true,
      message:
        "Theme created successfully",
      data: theme
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get All Themes
|--------------------------------------------------------------------------
*/

const getAll = async (
  req,
  res,
  next
) => {
  try {
    const {
      storeId
    } = req.query;

    const themes =
      await getUserThemes(
        req.user.id,
        storeId
      );

    return res.status(200).json({
      success: true,
      count: themes.length,
      data: themes
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Theme
|--------------------------------------------------------------------------
*/

const getOne = async (
  req,
  res,
  next
) => {
  try {
    const theme =
      await getThemeById(
        req.params.id,
        req.user.id
      );

    return res.status(200).json({
      success: true,
      data: theme
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Update Theme
|--------------------------------------------------------------------------
*/

const update = async (
  req,
  res,
  next
) => {
  try {
    const theme =
      await updateTheme(
        req.params.id,
        req.user.id,
        req.body
      );

    return res.status(200).json({
      success: true,
      message:
        "Theme updated successfully",
      data: theme
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Duplicate Theme
|--------------------------------------------------------------------------
*/

const duplicate = async (
  req,
  res,
  next
) => {
  try {
    const theme =
      await duplicateTheme(
        req.params.id,
        req.user.id
      );

    return res.status(201).json({
      success: true,
      message:
        "Theme duplicated successfully",
      data: theme
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Publish Theme
|--------------------------------------------------------------------------
*/

const publish = async (
  req,
  res,
  next
) => {
  try {
    const theme =
      await publishTheme(
        req.params.id,
        req.user.id
      );

    return res.status(200).json({
      success: true,
      message:
        "Theme published successfully",
      data: theme
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Archive Theme
|--------------------------------------------------------------------------
*/

const archive = async (
  req,
  res,
  next
) => {
  try {
    const theme =
      await archiveTheme(
        req.params.id,
        req.user.id
      );

    return res.status(200).json({
      success: true,
      message:
        "Theme archived successfully",
      data: theme
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Delete Theme
|--------------------------------------------------------------------------
*/

const remove = async (
  req,
  res,
  next
) => {
  try {
    await deleteTheme(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Theme deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Restore Theme
|--------------------------------------------------------------------------
*/

const restore = async (
  req,
  res,
  next
) => {
  try {
    const theme =
      await restoreTheme(
        req.params.id,
        req.user.id
      );

    return res.status(200).json({
      success: true,
      message:
        "Theme restored successfully",
      data: theme
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Save Version
|--------------------------------------------------------------------------
*/

const version = async (
  req,
  res,
  next
) => {
  try {
    const theme =
      await saveVersion(
        req.params.id,
        req.user.id,
        req.body.notes
      );

    return res.status(200).json({
      success: true,
      message:
        "Version saved successfully",
      data: theme
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Rollback Theme
|--------------------------------------------------------------------------
*/

const rollback = async (
  req,
  res,
  next
) => {
  try {
    const theme =
      await rollbackVersion(
        req.params.id,
        req.user.id,
        req.body.version
      );

    return res.status(200).json({
      success: true,
      message:
        "Rollback completed",
      data: theme
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Preview Theme
|--------------------------------------------------------------------------
*/

const preview = async (
  req,
  res,
  next
) => {
  try {
    const theme =
      await generatePreview(
        req.params.id,
        req.user.id
      );

    return res.status(200).json({
      success: true,
      message:
        "Preview generated",
      data: theme
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Deploy Theme
|--------------------------------------------------------------------------
*/

const deploy = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await deployTheme(
        req.params.id,
        req.user.id
      );

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  duplicate,
  publish,
  archive,
  remove,
  restore,
  version,
  rollback,
  preview,
  deploy
};
