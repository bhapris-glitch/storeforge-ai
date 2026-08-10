//========================================
// Layboka AI
// storeforge-ai/backend/aap.js
//========================================
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

const authRoutes = require(
  "./src/modules/auth/auth.routes"
);

const storeRoutes = require(
  "./src/modules/stores/store.routes"
);

const shopifyRoutes = require(
  "./src/modules/shopify/shopify.routes"
);

const themeRoutes = require(
  "./src/modules/themes/theme.routes"
);

const errorHandler = require(
  "./src/middleware/errorHandler"
);

const app = express();

/*
|--------------------------------------------------------------------------
| Security
|--------------------------------------------------------------------------
*/

app.use(helmet());

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      "http://localhost:3000",
    credentials: true
  })
);

/*
|--------------------------------------------------------------------------
| Performance
|--------------------------------------------------------------------------
*/

app.use(compression());

/*
|--------------------------------------------------------------------------
| Shopify Webhook Raw Body
|--------------------------------------------------------------------------
|
| Shopify HMAC verification requires the exact raw request body.
| This middleware MUST be registered before express.json().
|
*/

app.use(
  "/api/shopify/webhooks",
  express.raw({
    type: "application/json",
    limit: "10mb"
  })
);

/*
|--------------------------------------------------------------------------
| Body Parser
|--------------------------------------------------------------------------
*/

app.use(
  express.json({
    limit: "10mb"
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb"
  })
);

/*
|--------------------------------------------------------------------------
| Logger
|--------------------------------------------------------------------------
*/

app.use(morgan("dev"));

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "StoreForge AI API Running",
    version: "1.0.0"
  });
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/stores",
  storeRoutes
);

app.use(
  "/api/themes",
  themeRoutes
);

app.use(
  "/api/shopify",
  shopifyRoutes
);

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

module.exports = app;
