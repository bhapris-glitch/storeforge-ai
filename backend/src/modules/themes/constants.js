// ==storeforge-ai/backend/src/modules/themes/constants.js
/*
|--------------------------------------------------------------------------
| Theme Categories
|--------------------------------------------------------------------------
*/

const THEME_CATEGORIES = [
  "fashion",
  "electronics",
  "beauty",
  "furniture",
  "food",
  "restaurant",
  "jewelry",
  "automotive",
  "pets",
  "sports",
  "kids",
  "health",
  "real-estate",
  "luxury",
  "custom"
];

/*
|--------------------------------------------------------------------------
| Theme Layouts
|--------------------------------------------------------------------------
*/

const THEME_LAYOUTS = [
  "classic",
  "modern",
  "minimal",
  "premium"
];

/*
|--------------------------------------------------------------------------
| Theme Roles
|--------------------------------------------------------------------------
*/

const THEME_ROLES = [
  "main",
  "development",
  "unpublished",
  "demo"
];

/*
|--------------------------------------------------------------------------
| Theme Status
|--------------------------------------------------------------------------
*/

const THEME_STATUS = [
  "active",
  "inactive",
  "archived",
  "deleted"
];

/*
|--------------------------------------------------------------------------
| Deployment Status
|--------------------------------------------------------------------------
*/

const DEPLOYMENT_STATUS = [
  "draft",
  "building",
  "ready",
  "deploying",
  "published",
  "failed"
];

/*
|--------------------------------------------------------------------------
| Section Types
|--------------------------------------------------------------------------
*/

const SECTION_TYPES = [
  "announcement-bar",
  "header",
  "hero",
  "slideshow",
  "image-banner",
  "featured-product",
  "featured-collection",
  "collection-list",
  "product-grid",
  "product-slider",
  "video",
  "gallery",
  "image-with-text",
  "rich-text",
  "countdown",
  "comparison-table",
  "testimonials",
  "brands",
  "logo-list",
  "instagram",
  "tiktok",
  "newsletter",
  "faq",
  "contact",
  "map",
  "blog",
  "article",
  "cart-upsell",
  "related-products",
  "recently-viewed",
  "footer",
  "custom"
];

/*
|--------------------------------------------------------------------------
| Default Colors
|--------------------------------------------------------------------------
*/

const DEFAULT_COLORS = {
  primary: "#111827",
  secondary: "#ffffff",
  accent: "#2563EB",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444"
};

/*
|--------------------------------------------------------------------------
| Default Typography
|--------------------------------------------------------------------------
*/

const DEFAULT_TYPOGRAPHY = {
  heading: "Inter",
  body: "Inter",
  button: "Inter"
};

/*
|--------------------------------------------------------------------------
| Theme Limits
|--------------------------------------------------------------------------
*/

const LIMITS = {

  maxThemesPerStore: 50,

  maxSections: 100,

  maxBlocks: 1000,

  maxAssets: 5000,

  maxThemeSizeMB: 500

};

/*
|--------------------------------------------------------------------------
| AI Prompt Templates
|--------------------------------------------------------------------------
*/

const AI_PROMPTS = {

  fashion:
    "Create a premium fashion Shopify theme.",

  furniture:
    "Create a luxury furniture Shopify theme.",

  beauty:
    "Create a modern beauty Shopify theme.",

  electronics:
    "Create a clean electronics Shopify theme.",

  jewelry:
    "Create a premium jewelry Shopify theme.",

  restaurant:
    "Create a restaurant Shopify theme with online ordering.",

  pets:
    "Create a modern pet products Shopify theme.",

  sports:
    "Create a sports equipment Shopify theme.",

  custom:
    "Create a custom Shopify Online Store 2.0 theme."

};

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

module.exports = {

  THEME_CATEGORIES,

  THEME_LAYOUTS,

  THEME_ROLES,

  THEME_STATUS,

  DEPLOYMENT_STATUS,

  SECTION_TYPES,

  DEFAULT_COLORS,

  DEFAULT_TYPOGRAPHY,

  LIMITS,

  AI_PROMPTS

};
