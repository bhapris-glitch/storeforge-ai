// storeforge-ai/backend/src/modules/themes/theme.routes.js
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
  duplicate,
  publish,
  archive,
  remove,
  restore,
  version,
  rollback,
  preview,
  deploy
} = require("./theme.controller");

/*
|--------------------------------------------------------------------------
| Protect All Theme Routes
|--------------------------------------------------------------------------
*/

router.use(authMiddleware);

/*
|--------------------------------------------------------------------------
| Theme CRUD
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

/*
|--------------------------------------------------------------------------
| Theme Actions
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/duplicate",
  duplicate
);

router.post(
  "/:id/publish",
  publish
);

router.post(
  "/:id/archive",
  archive
);

router.post(
  "/:id/restore",
  restore
);

router.post(
  "/:id/version",
  version
);

router.post(
  "/:id/rollback",
  rollback
);

router.post(
  "/:id/preview",
  preview
);

router.post(
  "/:id/deploy",
  deploy
);

module.exports = router;
