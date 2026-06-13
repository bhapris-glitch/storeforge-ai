//============================================================
// storeforge-ai/backend/src/modules/stores/store.service.js
//=============================================================
const Store = require("./store.model");

/*
|--------------------------------------------------------------------------
| Create Store
|--------------------------------------------------------------------------
*/

const createStore = async ({
  userId,
  storeName,
  shopDomain
}) => {
  const existingStore =
    await Store.findOne({
      shopDomain: shopDomain
        .trim()
        .toLowerCase()
    });

  if (existingStore) {
    throw new Error(
      "Store already exists"
    );
  }

  const store =
    await Store.create({
      userId,
      storeName,
      shopDomain: shopDomain
        .trim()
        .toLowerCase()
    });

  return store;
};

/*
|--------------------------------------------------------------------------
| Get User Stores
|--------------------------------------------------------------------------
*/

const getUserStores = async (
  userId
) => {
  const stores =
    await Store.find({
      userId
    }).sort({
      createdAt: -1
    });

  return stores;
};

/*
|--------------------------------------------------------------------------
| Get Store By ID
|--------------------------------------------------------------------------
*/

const getStoreById = async (
  storeId,
  userId
) => {
  const store =
    await Store.findOne({
      _id: storeId,
      userId
    });

  if (!store) {
    throw new Error(
      "Store not found"
    );
  }

  return store;
};

/*
|--------------------------------------------------------------------------
| Update Store
|--------------------------------------------------------------------------
*/

const updateStore = async (
  storeId,
  userId,
  updateData
) => {
  const store =
    await Store.findOneAndUpdate(
      {
        _id: storeId,
        userId
      },
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

  if (!store) {
    throw new Error(
      "Store not found"
    );
  }

  return store;
};

/*
|--------------------------------------------------------------------------
| Delete Store
|--------------------------------------------------------------------------
*/

const deleteStore = async (
  storeId,
  userId
) => {
  const store =
    await Store.findOneAndDelete({
      _id: storeId,
      userId
    });

  if (!store) {
    throw new Error(
      "Store not found"
    );
  }

  return true;
};

module.exports = {
  createStore,
  getUserStores,
  getStoreById,
  updateStore,
  deleteStore
};
