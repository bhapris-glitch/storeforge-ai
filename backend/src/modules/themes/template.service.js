// == storeforge-ai/backend/src/modules/themes/template.service.js
const {
  DEFAULT_COLORS,
  DEFAULT_TYPOGRAPHY
} = require("./constants");

/*
|--------------------------------------------------------------------------
| Store Templates
|--------------------------------------------------------------------------
*/

const templates = {

  fashion: {
    category: "fashion",

    name: "Fashion Premium",

    layout: "modern",

    colors: {
      primary: "#111827",
      secondary: "#FFFFFF",
      accent: "#EC4899"
    },

    typography: {
      heading: "Poppins",
      body: "Inter"
    },

    homepage: [
      "announcement-bar",
      "header",
      "hero",
      "featured-collection",
      "product-slider",
      "gallery",
      "testimonials",
      "newsletter",
      "footer"
    ]
  },

  electronics: {

    category: "electronics",

    name: "Electronics Store",

    layout: "modern",

    colors: {
      primary: "#0F172A",
      secondary: "#FFFFFF",
      accent: "#2563EB"
    },

    typography: {
      heading: "Inter",
      body: "Inter"
    },

    homepage: [
      "announcement-bar",
      "header",
      "hero",
      "featured-product",
      "collection-list",
      "product-grid",
      "faq",
      "newsletter",
      "footer"
    ]
  },

  furniture: {

    category: "furniture",

    name: "Luxury Furniture",

    layout: "premium",

    colors: {
      primary: "#3E2723",
      secondary: "#FDFBF7",
      accent: "#8D6E63"
    },

    typography: {
      heading: "Playfair Display",
      body: "Inter"
    },

    homepage: [
      "header",
      "hero",
      "gallery",
      "featured-collection",
      "image-with-text",
      "testimonials",
      "newsletter",
      "footer"
    ]
  },

  beauty: {

    category: "beauty",

    name: "Beauty Store",

    layout: "minimal",

    colors: {
      primary: "#1F2937",
      secondary: "#FFF8FC",
      accent: "#EC4899"
    },

    typography: {
      heading: "Poppins",
      body: "Inter"
    },

    homepage: [
      "announcement-bar",
      "header",
      "hero",
      "featured-product",
      "gallery",
      "testimonials",
      "newsletter",
      "footer"
    ]
  },

  jewelry: {

    category: "jewelry",

    name: "Luxury Jewelry",

    layout: "premium",

    colors: {
      primary: "#111111",
      secondary: "#FFFFFF",
      accent: "#D4AF37"
    },

    typography: {
      heading: "Cormorant Garamond",
      body: "Inter"
    },

    homepage: [
      "header",
      "hero",
      "gallery",
      "featured-product",
      "brands",
      "testimonials",
      "footer"
    ]
  }

};

/*
|--------------------------------------------------------------------------
| Get Template
|--------------------------------------------------------------------------
*/

const getTemplate = (
  category
) => {

  return (
    templates[category] || {

      category: "custom",

      name: "Custom Theme",

      layout: "modern",

      colors: DEFAULT_COLORS,

      typography:
        DEFAULT_TYPOGRAPHY,

      homepage: [
        "header",
        "hero",
        "featured-product",
        "footer"
      ]

    }
  );

};

/*
|--------------------------------------------------------------------------
| Get All Templates
|--------------------------------------------------------------------------
*/

const getTemplates = () => {

  return Object.keys(
    templates
  ).map(key => templates[key]);

};

/*
|--------------------------------------------------------------------------
| Register Template
|--------------------------------------------------------------------------
|
| Allows future Marketplace templates.
|
*/

const registerTemplate = (
  key,
  template
) => {

  templates[key] =
    template;

  return template;

};

/*
|--------------------------------------------------------------------------
| Clone Template
|--------------------------------------------------------------------------
*/

const cloneTemplate = (
  category
) => {

  return JSON.parse(
    JSON.stringify(
      getTemplate(category)
    )
  );

};

module.exports = {

  getTemplate,

  getTemplates,

  registerTemplate,

  cloneTemplate

};
