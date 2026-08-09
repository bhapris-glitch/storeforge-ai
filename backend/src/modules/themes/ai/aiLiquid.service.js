/*
|--------------------------------------------------------------------------
| StoreForge AI
| aiLiquid.service.js
|--------------------------------------------------------------------------
|
| Converts StoreForge AI theme design + content into Shopify Liquid files.
|
| Responsibilities:
|
| - Shopify Liquid generation
| - Theme layouts
| - Sections
| - Snippets
| - Templates
| - Config files
| - Schema generation
| - Navigation
| - Product rendering
| - Collection rendering
| - Cart rendering
| - Responsive storefront structure
| - Shopify-compatible Liquid syntax
|
|--------------------------------------------------------------------------
*/


"use strict";


/*
|--------------------------------------------------------------------------
| Dependencies
|--------------------------------------------------------------------------
*/

const crypto =
  require("crypto");


/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

const SERVICE_NAME =
  "StoreForge AI Liquid Engine";

const SERVICE_VERSION =
  "1.0.0";

const SHOPIFY_API_VERSION =
  process.env.SHOPIFY_API_VERSION ||
  "2025-10";


/*
|--------------------------------------------------------------------------
| Shopify Theme Directories
|--------------------------------------------------------------------------
*/

const LIQUID_DIRECTORIES = [

  "layout",

  "templates",

  "sections",

  "snippets",

  "config",

  "locales",

  "assets"

];


/*
|--------------------------------------------------------------------------
| Allowed Shopify Template Types
|--------------------------------------------------------------------------
*/

const TEMPLATE_TYPES = [

  "index",

  "product",

  "collection",

  "cart",

  "page",

  "blog",

  "article",

  "search",

  "404",

  "list-collections",

  "customers/account",

  "customers/login",

  "customers/register",

  "customers/reset_password",

  "customers/activate_account",

  "customers/order",

  "customers/addresses"

];


/*
|--------------------------------------------------------------------------
| Generate ID
|--------------------------------------------------------------------------
*/

const generateId = (
 prefix = "liquid"
) => {

  return `${prefix}_${crypto
    .randomUUID()
    .replace(/-/g, "")}`;

};


/*
|--------------------------------------------------------------------------
| Safe String
|--------------------------------------------------------------------------
*/

const safeString = (
 value,
  fallback = ""
) => {

  if (
    value === null ||
    value === undefined
  ) {

    return fallback;

  }

  return String(
    value
  );

};


/*
|--------------------------------------------------------------------------
| Escape HTML
|--------------------------------------------------------------------------
*/

const escapeHtml = (
 value
) => {

  return safeString(
    value
  )

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

};


/*
|--------------------------------------------------------------------------
| Escape Liquid String
|--------------------------------------------------------------------------
*/

const escapeLiquidString = (
 value
) => {

  return safeString(
    value
  )

    .replace(
      /\\/g,
      "\\\\"
    )

    .replace(
      /"/g,
      '\\"'
    )

    .replace(
      /\r?\n/g,
      "\\n"
    );

};


/*
|--------------------------------------------------------------------------
| Slugify
|--------------------------------------------------------------------------
*/

const slugify = (
 value
) => {

  return safeString(
    value
  )

    .toLowerCase()

    .trim()

    .replace(
      /[^a-z0-9]+/g,
      "-"
    )

    .replace(
      /^-+|-+$/g,
      "");

};


/*
|--------------------------------------------------------------------------
| Filename Normalizer
|--------------------------------------------------------------------------
*/

const normalizeFilename = (
 filename
) => {

  return slugify(
    safeString(
      filename
    )
      .replace(
        /\.liquid$/i,
        ""
      )
  );

};


/*
|--------------------------------------------------------------------------
| Indent Text
|--------------------------------------------------------------------------
*/

const indent = (
 text,
 spaces = 2
) => {

  const prefix =
    " ".repeat(
      spaces
    );

  return safeString(
    text
  )
    .split("\n")
    .map(
      line =>
        line.length
          ? prefix + line
          : line
    )
    .join("\n");

};


/*
|--------------------------------------------------------------------------
| Join Lines
|--------------------------------------------------------------------------
*/

const joinLines = (
 lines
) => {

  return lines

    .filter(
      line =>
        line !== null &&
        line !== undefined
    )

    .join("\n");

};


/*
|--------------------------------------------------------------------------
| Liquid Comment
|--------------------------------------------------------------------------
*/

const liquidComment = (
 text
) => {

  return `{% comment %}\n${safeString(
    text
  )}\n{% endcomment %}`;

};


/*
|--------------------------------------------------------------------------
| Liquid Variable
|--------------------------------------------------------------------------
*/

const liquidVariable = (
 expression
) => {

  return `{{ ${safeString(
    expression
  )} }}`;

};


/*
|--------------------------------------------------------------------------
| Liquid Render
|--------------------------------------------------------------------------
*/

const liquidRender = (
 snippet,
 attributes = {}
) => {

  const entries =
    Object.entries(
      attributes
    );

  if (
    entries.length === 0
  ) {

    return `{% render '${snippet}' %}`;

  }

  const params =
    entries

      .map(
        ([key, value]) =>
          `${key}: ${value}`
      )

      .join(
        ", "
      );

  return `{% render '${snippet}', ${params} %}`;

};


/*
|--------------------------------------------------------------------------
| Liquid Section
|--------------------------------------------------------------------------
*/

const liquidSection = (
 section
) => {

  return `{% section '${section}' %}`;

};


/*
|--------------------------------------------------------------------------
| Liquid Include
|--------------------------------------------------------------------------
|
| Legacy include is intentionally avoided.
|
|--------------------------------------------------------------------------
*/

const liquidInclude = (
 snippet
) => {

  return liquidRender(
    snippet
  );

};


/*
|--------------------------------------------------------------------------
| Liquid If
|--------------------------------------------------------------------------
*/

const liquidIf = (
 condition,
 content,
 elseContent = ""
) => {

  const output = [

    `{% if ${condition} %}`,

    content,

    elseContent
      ? `{% else %}\n${elseContent}`
      : "",

    "{% endif %}"

  ];

  return joinLines(
    output
  );

};


/*
|--------------------------------------------------------------------------
| Liquid Unless
|--------------------------------------------------------------------------
*/

const liquidUnless = (
 condition,
 content
) => {

  return joinLines([

    `{% unless ${condition} %}`,

    content,

    "{% endunless %}"

  ]);

};


/*
|--------------------------------------------------------------------------
| Liquid For Loop
|--------------------------------------------------------------------------
*/

const liquidFor = (
 variable,
 collection,
 content,
 options = ""
) => {

  const suffix =
    options
      ? ` ${options}`
      : "";

  return joinLines([

    `{% for ${variable} in ${collection}${suffix} %}`,

    content,

    "{% endfor %}"

  ]);

};


/*
|--------------------------------------------------------------------------
| Liquid Case
|--------------------------------------------------------------------------
*/

const liquidCase = (
 expression,
 branches = []
) => {

  const output = [

    `{% case ${expression} %}`

  ];

  branches.forEach(
    branch => {

      output.push(
        `{% when ${branch.when} %}`
      );

      output.push(
        branch.content
      );

    }
  );

  output.push(
    "{% endcase %}"
  );

  return joinLines(
    output
  );

};


/*
|--------------------------------------------------------------------------
| JSON String
|--------------------------------------------------------------------------
*/

const safeJson = (
 value
) => {

  try {

    return JSON.stringify(
      value
    );

  } catch (
    error
  ) {

    return "{}";

  }

};


/*
|--------------------------------------------------------------------------
| Liquid JSON
|--------------------------------------------------------------------------
*/

const liquidJson = (
 value
) => {

  return safeJson(
    value
  )
    .replace(
      /<\//g,
      "<\\/"
    );

};


/*
|--------------------------------------------------------------------------
| Shopify Asset URL
|--------------------------------------------------------------------------
*/

const assetUrl = (
 filename
) => {

  return `{{ '${escapeLiquidString(
    filename
  )}' | asset_url }}`;

};


/*
|--------------------------------------------------------------------------
| Shopify Image URL
|--------------------------------------------------------------------------
*/

const imageUrl = (
 image,
 width = 1200
) => {

  if (
    image
  ) {

    return `{{ '${escapeLiquidString(
      image
    )}' | image_url: width: ${width} }}`;

  }

  return `{{ 'image' | placeholder_svg_tag }}`;

};


/*
|--------------------------------------------------------------------------
| Shopify Routes
|--------------------------------------------------------------------------
*/

const shopifyRoutes = {

  root:
    "{{ routes.root_url }}",

  cart:
    "{{ routes.cart_url }}",

  checkout:
    "{{ routes.checkout_url }}",

  search:
    "{{ routes.search_url }}",

  account:
    "{{ routes.account_url }}",

  login:
    "{{ routes.account_login_url }}",

  register:
    "{{ routes.account_register_url }}",

  collections:
    "{{ routes.collections_url }}",

  allProducts:
    "{{ routes.all_products_collection_url }}"

};


/*
|--------------------------------------------------------------------------
| Shopify Theme File Object
|--------------------------------------------------------------------------
*/

const createThemeFile = (
 path,
 content,
 type = "liquid"
) => {

  return {

    id:
      generateId(
        "file"
      ),

    path,

    type,

    content:
      safeString(
        content
      ),

    size:
      Buffer.byteLength(
        safeString(
          content
        ),
        "utf8"
      ),

    generatedBy:
      SERVICE_NAME,

    version:
      SERVICE_VERSION

  };

};


/*
|--------------------------------------------------------------------------
| Create Liquid File
|--------------------------------------------------------------------------
*/

const createLiquidFile = (
 path,
 content
) => {

  return createThemeFile(
    path,
    content,
    "liquid"
  );

};


/*
|--------------------------------------------------------------------------
| Create JSON File
|--------------------------------------------------------------------------
*/

const createJsonFile = (
 path,
 data
) => {

  return createThemeFile(

    path,

    JSON.stringify(
      data,
      null,
      2
    ),

    "json"

  );

};


/*
|--------------------------------------------------------------------------
| Create CSS File
|--------------------------------------------------------------------------
*/

const createCssFile = (
 path,
 content
) => {

  return createThemeFile(
    path,
    content,
    "css"
  );

};


/*
|--------------------------------------------------------------------------
| Create JS File
|--------------------------------------------------------------------------
*/

const createJsFile = (
 path,
 content
) => {

  return createThemeFile(
    path,
    content,
    "javascript"
  );

};


/*
|--------------------------------------------------------------------------
| Theme File Validation
|--------------------------------------------------------------------------
*/

const validateThemeFile = (
 file
) => {

  const errors = [];

  if (
    !file.path
  ) {

    errors.push(
      "Theme file path is required."
    );

  }

  if (
    file.content === undefined ||
    file.content === null
  ) {

    errors.push(
      "Theme file content is required."
    );

  }

  if (
    !LIQUID_DIRECTORIES.some(
      directory =>
        file.path.startsWith(
          `${directory}/`
        )
    )
  ) {

    errors.push(

      `Invalid Shopify theme directory: ${file.path}`

    );

  }

  return {

    valid:
      errors.length === 0,

    errors

  };

};


/*
|--------------------------------------------------------------------------
| Validate Theme Files
|--------------------------------------------------------------------------
*/

const validateThemeFiles = (
 files = []
) => {

  const errors = [];

  const paths =
    new Set();

  files.forEach(
    file => {

      const validation =
        validateThemeFile(
          file
        );

      if (
        !validation.valid
      ) {

        errors.push(
          ...validation.errors
        );

      }

      if (
        paths.has(
          file.path
        )
      ) {

        errors.push(

          `Duplicate theme file: ${file.path}`

        );

      }

      paths.add(
        file.path
      );

    }
  );

  return {

    valid:
      errors.length === 0,

    errors,

    fileCount:
      files.length,

    paths:
      Array.from(
        paths
      )

  };

};


/*
|--------------------------------------------------------------------------
| Build Theme Context
|--------------------------------------------------------------------------
*/

const buildThemeContext = (
 plan = {},
 content = {},
 design = {}
) => {

  return {

    themeId:
      plan.themeId ||
      null,

    generationId:
      content.metadata?.generationId ||
      generateId(
        "generation"
      ),

    brand: {

      name:
        plan.brandName ||
        content.brandName ||
        "Store",

      category:
        plan.category ||
        "general",

      language:
        plan.language ||
        "en",

      locale:
        plan.locale ||
        "en-US"

    },

    design: {

      ...design

    },

    content: {

      ...content

    },

    shopify: {

      apiVersion:
        SHOPIFY_API_VERSION,

      routes:
        shopifyRoutes

    }

  };

};


/*
|--------------------------------------------------------------------------
| Default Theme Settings
|--------------------------------------------------------------------------
*/

const DEFAULT_THEME_SETTINGS = {

  color_scheme:
    "scheme-1",

  page_width:
    "1200",

  spacing:
    "comfortable",

  button_style:
    "rounded",

  card_style:
    "rounded",

  enable_animations:
    true,

  enable_sticky_header:
    true,

  enable_predictive_search:
    true,

  enable_cart_drawer:
    true

};


/*
|--------------------------------------------------------------------------
| Normalize Theme Settings
|--------------------------------------------------------------------------
*/

const normalizeThemeSettings = (
 settings = {}
) => {

  return {

    ...DEFAULT_THEME_SETTINGS,

    ...settings

  };

};


/*
|--------------------------------------------------------------------------
| Theme CSS Variable
|--------------------------------------------------------------------------
*/

const cssVariable = (
 name,
 value
) => {

  return `--${slugify(
    name
  )}: ${safeString(
    value
  )};`;

};


/*
|--------------------------------------------------------------------------
| Theme Setting Schema Property
|--------------------------------------------------------------------------
*/

const settingSchema = (
 id,
 type,
 label,
 defaultValue,
 extra = {}
) => {

  return {

    type,

    id,

    label,

    default:
      defaultValue,

    ...extra

  };

};


/*
|--------------------------------------------------------------------------
| Shopify Section Schema
|--------------------------------------------------------------------------
*/

const buildSectionSchema = ({
  name,
  settings = [],
  blocks = [],
  presets = []
}) => {

  const schema = {

    name:
      name ||

      "StoreForge Section",

    settings,

    blocks,

    presets

  };

  return [

    "<script type=\"application/json\" data-section-schema>",

    JSON.stringify(
      schema,
      null,
      2
    ),

    "</script>"

  ].join(
    "\n"
  );

};


/*
|--------------------------------------------------------------------------
| Shopify Native Schema
|--------------------------------------------------------------------------
|
| Shopify section schema must be inside:
|
| {% schema %}
| {
|   ...
| }
| {% endschema %}
|
|--------------------------------------------------------------------------
*/

const buildNativeSectionSchema = (
 schema
) => {

  return joinLines([

    "{% schema %}",

    JSON.stringify(
      schema,
      null,
      2
    ),

    "{% endschema %}"

  ]);

};


/*
|--------------------------------------------------------------------------
| Section ID Helper
|--------------------------------------------------------------------------
*/

const sectionId = (
 name
) => {

  return `section-${slugify(
    name
  )}`;

};


/*
|--------------------------------------------------------------------------
| Render Product URL
|--------------------------------------------------------------------------
*/

const productUrl = () => {

  return "{{ product.url }}";

};


/*
|--------------------------------------------------------------------------
| Render Collection URL
|--------------------------------------------------------------------------
*/

const collectionUrl = () => {

  return "{{ collection.url }}";

};


/*
|--------------------------------------------------------------------------
| Render Product Image
|--------------------------------------------------------------------------
*/

const productImage = (
 productExpression = "product",
 width = 800
) => {

  return `{{ ${productExpression}.featured_image | image_url: width: ${width} }}`;

};


/*
|--------------------------------------------------------------------------
| Render Product Price
|--------------------------------------------------------------------------
*/

const productPrice = (
 productExpression = "product"
) => {

  return `{{ ${productExpression}.price | money }}`;

};


/*
|--------------------------------------------------------------------------
| Render Product Compare Price
|--------------------------------------------------------------------------
*/

const productComparePrice = (
 productExpression = "product"
) => {

  return `{{ ${productExpression}.compare_at_price | money }}`;

};


/*
|--------------------------------------------------------------------------
| Render Product Title
|--------------------------------------------------------------------------
*/

const productTitle = (
 productExpression = "product"
) => {

  return `{{ ${productExpression}.title | escape }}`;

};


/*
|--------------------------------------------------------------------------
| Render Cart Count
|--------------------------------------------------------------------------
*/

const cartCount = () => {

  return "{{ cart.item_count }}";

};


/*
|--------------------------------------------------------------------------
| Render Cart Total
|--------------------------------------------------------------------------
*/

const cartTotal = () => {

  return "{{ cart.total_price | money }}";

};


/*
|--------------------------------------------------------------------------
| Render Shop Name
|--------------------------------------------------------------------------
*/

const shopName = () => {

  return "{{ shop.name | escape }}";

};


/*
|--------------------------------------------------------------------------
| Render Shop URL
|--------------------------------------------------------------------------
*/

const shopUrl = () => {

  return "{{ shop.url }}";

};


/*
|--------------------------------------------------------------------------
| Render Customer Name
|--------------------------------------------------------------------------
*/

const customerName = () => {

  return "{{ customer.first_name | escape }}";

};


/*
|--------------------------------------------------------------------------
| Render Current Year
|--------------------------------------------------------------------------
*/

const currentYear = () => {

  return "{{ 'now' | date: '%Y' }}";

};


/*
|--------------------------------------------------------------------------
| Render Translation
|--------------------------------------------------------------------------
*/

const translation = (
 key,
 fallback = ""
) => {

  if (
    fallback
  ) {

    return `{{ '${escapeLiquidString(
      key
    )}' | t: default: '${escapeLiquidString(
      fallback
    )}' }}`;

  }

  return `{{ '${escapeLiquidString(
    key
  )}' | t }}`;

};


/*
|--------------------------------------------------------------------------
| Normalize Section Name
|--------------------------------------------------------------------------
*/

const normalizeSectionName = (
 name
) => {

  const normalized =
    slugify(
      name
    );

  return normalized ||
    "storeforge-section";

};


/*
|--------------------------------------------------------------------------
| Normalize Template Name
|--------------------------------------------------------------------------
*/

const normalizeTemplateName = (
 name
) => {

  const normalized =
    safeString(
      name
    )
      .toLowerCase()
      .trim()
      .replace(
        /\.json$/i,
        ""
      );

  return normalized;

};


/*
|--------------------------------------------------------------------------
| Theme Generation Context
|--------------------------------------------------------------------------
*/

const createGenerationContext = ({
  plan = {},
  content = {},
  design = {}
} = {}) => {

  const context =
    buildThemeContext(
      plan,
      content,
      design
    );

  context.settings =
    normalizeThemeSettings(
      design.settings ||
      {}
    );

  context.files = [];

  context.warnings = [];

  context.errors = [];

  return context;

};


/*
|--------------------------------------------------------------------------
| Add File To Context
|--------------------------------------------------------------------------
*/

const addThemeFile = (
 context,
 file
) => {

  if (
    !context ||
    !Array.isArray(
      context.files
    )
  ) {

    throw new Error(
      "Invalid theme generation context."
    );

  }

  const validation =
    validateThemeFile(
      file
    );

  if (
    !validation.valid
  ) {

    context.errors.push(
      ...validation.errors
    );

    return null;

  }

  const existingIndex =
    context.files.findIndex(
      existing =>
        existing.path ===
        file.path
    );

  if (
    existingIndex >= 0
  ) {

    context.files[
      existingIndex
    ] = file;

    return file;

  }

  context.files.push(
    file
  );

  return file;

};


/*
|--------------------------------------------------------------------------
| Add Liquid File To Context
|--------------------------------------------------------------------------
*/

const addLiquidFile = (
 context,
 path,
 content
) => {

  return addThemeFile(

    context,

    createLiquidFile(
      path,
      content
    )

  );

};


/*
|--------------------------------------------------------------------------
| Add JSON File To Context
|--------------------------------------------------------------------------
*/

const addJsonFile = (
 context,
 path,
 data
) => {

  return addThemeFile(

    context,

    createJsonFile(
      path,
      data
    )

  );

};


/*
|--------------------------------------------------------------------------
| Finalize Theme Context
|--------------------------------------------------------------------------
*/

const finalizeThemeContext = (
 context
) => {

  const validation =
    validateThemeFiles(
      context.files
    );

  return {

    ...context,

    validation,

    success:

      validation.valid &&

      context.errors.length === 0,

    fileCount:
      context.files.length,

    generatedAt:
      new Date().toISOString(),

    service: {

      name:
        SERVICE_NAME,

      version:
        SERVICE_VERSION

    }

  };

};


/*
|--------------------------------------------------------------------------
| Export Part 1 Utilities
|--------------------------------------------------------------------------
|
| Additional generation functions will be added in Parts 2-10.
|
|--------------------------------------------------------------------------
*/
