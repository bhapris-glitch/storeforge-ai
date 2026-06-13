//===============================================================
//storeforge-ai/backend/src/modules/stores/store.controller.js
//===============================================================
const {
  createStore,
  getUserStores,
  getStoreById,
  updateStore,
  deleteStore
} = require("./store.service");

/*
|--------------------------------------------------------------------------
| Create Store
|--------------------------------------------------------------------------
*/

const create = async (req, res, next) => {
  try {
    const {
      storeName,
      shopDomain
    } = req.body;

    if (!storeName || !shopDomain) {
      return res.status(400).json({
        success: false,
        message:
          "storeName and shopDomain are required"
      });
    }

    const store =
      await createStore({
        userId: req.user.id,
        storeName,
        shopDomain
      });

    return res.status(201).json({
      success: true,
      message:
        "Store created successfully",
      data: store
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get User Stores
|--------------------------------------------------------------------------
*/

const getAll = async (
  req,
  res,
  next
) => {
  try {
    const stores =
      await getUserStores(
        req.user.id
      );

    return res.status(200).json({
      success: true,
      count: stores.length,
      data: stores
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Single Store
|--------------------------------------------------------------------------
*/

const getOne = async (
  req,
  res,
  next
) => {
  try {
    const store =
      await getStoreById(
        req.params.id,
        req.user.id
      );

    return res.status(200).json({
      success: true,
      data: store
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Update Store
|--------------------------------------------------------------------------
*/

const update = async (
  req,
  res,
  next
) => {
  try {
    const store =
      await updateStore(
        req.params.id,
        req.user.id,
        req.body
      );

    return res.status(200).json({
      success: true,
      message:
        "Store updated successfully",
      data: store
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Delete Store
|--------------------------------------------------------------------------
*/

const remove = async (
  req,
  res,
  next
) => {
  try {
    await deleteStore(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Store deleted successfully"
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
  remove
};
