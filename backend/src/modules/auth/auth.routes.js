const express = require("express");

const router = express.Router();

const {
  register,
  login,
  getMe
} = require("./auth.controller");

const authMiddleware = require("../../middleware/auth");

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/register",
  register
);

router.post(
  "/login",
  login
);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/me",
  authMiddleware,
  getMe
);

module.exports = router;
