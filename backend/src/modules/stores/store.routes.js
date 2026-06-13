// ==============================================================
// storeforge-ai/backend/src/modules/stores/store.routes.js
// ==============================================================
const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../../middleware/auth"
);

const {
  create,
  getAll,
  getOne,
  update,
  remove
} = require("./store.controller");

/*
|--------------------------------------------------------------------------
| Protect All Store Routes
|--------------------------------------------------------------------------
*/

router.use(authMiddleware);

/*
|--------------------------------------------------------------------------
| Store Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  create
);

router.get(
  "/",
  getAll
);

router.get(
  "/:id",
  getOne
);

router.put(
  "/:id",
  update
);

router.delete(
  "/:id",
  remove
);

module.exports = router;
