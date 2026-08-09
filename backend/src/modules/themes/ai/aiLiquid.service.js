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
/*
|--------------------------------------------------------------------------
| PART 2 / 10
| Global Shopify Liquid Layout
|--------------------------------------------------------------------------
|
| Generates:
|
| - layout/theme.liquid
| - sections/header.liquid
| - sections/footer.liquid
| - snippets/icon.liquid
| - snippets/meta-tags.liquid
| - snippets/global-scripts.liquid
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Global HTML Head
|--------------------------------------------------------------------------
*/

const buildGlobalHead = (
  context
) => {

  const brandName =
    escapeLiquidString(
      context.brand.name
    );

  return joinLines([

    "<head>",

    '  <meta charset="utf-8">',

    '  <meta http-equiv="X-UA-Compatible" content="IE=edge">',

    '  <meta name="viewport" content="width=device-width, initial-scale=1">',

    '  <meta name="theme-color" content="{{ settings.color_scheme }}">',

    '  {% if page_description %}',

    '    <meta name="description" content="{{ page_description | escape }}">',

    '  {% endif %}',

    "",

    "  {% render 'meta-tags' %}",

    "",

    "  {{ content_for_header }}",

    "",

    `  <title>{{ page_title | escape }} | ${brandName}</title>`,

    "",

    "  {{ 'theme.css' | asset_url | stylesheet_tag }}",

    "",

    "</head>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Global Skip Link
|--------------------------------------------------------------------------
*/

const buildSkipLink = () => {

  return joinLines([

    '<a',

    '  class="skip-to-content-link visually-hidden-focusable"',

    '  href="#MainContent"',

    ">",

    "  Skip to content",

    "</a>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Global Header Render
|--------------------------------------------------------------------------
*/

const buildHeaderRender = () => {

  return "{% section 'header' %}";

};


/*
|--------------------------------------------------------------------------
| Global Footer Render
|--------------------------------------------------------------------------
*/

const buildFooterRender = () => {

  return "{% section 'footer' %}";

};


/*
|--------------------------------------------------------------------------
| Global Scripts
|--------------------------------------------------------------------------
*/

const buildGlobalScriptRender = () => {

  return "{% render 'global-scripts' %}";

};


/*
|--------------------------------------------------------------------------
| Theme Body Attributes
|--------------------------------------------------------------------------
*/

const buildBodyAttributes = (
  context
) => {

  const themeId =
    escapeHtml(
      context.themeId ||
      ""
    );

  return joinLines([

    '  class="storeforge-theme"', 

    `  data-storeforge-theme="${themeId}"`,

    `  data-storeforge-version="${SERVICE_VERSION}"`,

    `  data-shopify-api="${SHOPIFY_API_VERSION}"`

  ]);

};


/*
|--------------------------------------------------------------------------
| Theme Liquid Layout
|--------------------------------------------------------------------------
*/

const buildThemeLiquid = (
  context
) => {

  const head =
    buildGlobalHead(
      context
    );

  const skipLink =
    buildSkipLink();

  const header =
    buildHeaderRender();

  const footer =
    buildFooterRender();

  const scripts =
    buildGlobalScriptRender();

  const bodyAttributes =
    buildBodyAttributes(
      context
    );

  const content = [

    liquidComment(
      "StoreForge AI generated Shopify theme layout."
    ),

    "<!doctype html>",

    "<html",

    `  lang="{{ request.locale.iso_code | default: '${escapeLiquidString(
      context.brand.language
    )}' }}"`,

    ">",

    head,

    "",

    "<body",

    bodyAttributes,

    ">",

    "",

    skipLink,

    "",

    header,

    "",

    '<main id="MainContent" role="main" tabindex="-1">',

    "  {{ content_for_layout }}",

    "</main>",

    "",

    footer,

    "",

    scripts,

    "",

    "</body>",

    "</html>"

  ];

  return joinLines(
    content
  );

};


/*
|--------------------------------------------------------------------------
| Meta Tags Snippet
|--------------------------------------------------------------------------
*/

const buildMetaTagsSnippet = (
  context
) => {

  return joinLines([

    liquidComment(
      "StoreForge AI SEO and social metadata."
    ),

    "{% if template == 'index' %}",

    '  <meta property="og:type" content="website">',

    "{% elsif template contains 'product' %}",

    '  <meta property="og:type" content="product">',

    "{% elsif template contains 'article' %}",

    '  <meta property="og:type" content="article">',

    "{% else %}",

    '  <meta property="og:type" content="website">',

    "{% endif %}",

    "",

    '<meta property="og:title" content="{{ page_title | escape }}">',

    '<meta property="og:description" content="{{ page_description | escape }}">',

    '<meta property="og:url" content="{{ canonical_url }}">',

    "",

    "{% if page_image %}",

    '<meta property="og:image" content="{{ page_image | image_url: width: 1200 }}">',

    "{% elsif settings.social_image %}",

    '<meta property="og:image" content="{{ settings.social_image | image_url: width: 1200 }}">',

    "{% endif %}",

    "",

    '<meta name="twitter:card" content="summary_large_image">',

    '<meta name="twitter:title" content="{{ page_title | escape }}">',

    '<meta name="twitter:description" content="{{ page_description | escape }}">',

    "",

    "{% if settings.social_image %}",

    '<meta name="twitter:image" content="{{ settings.social_image | image_url: width: 1200 }}">',

    "{% endif %}",

    "",

    '<link rel="canonical" href="{{ canonical_url }}">',

    "",

    "{% if request.page_type == 'search' %}",

    '  <meta name="robots" content="noindex,follow">',

    "{% endif %}"

  ]);

};


/*
|--------------------------------------------------------------------------
| Header Navigation Items
|--------------------------------------------------------------------------
*/

const buildHeaderNavigation = (
  context
) => {

  const menu =
    context.design?.header?.menu ||
    "main-menu";

  return joinLines([

    '<nav class="site-header__navigation"',

    '     aria-label="Main navigation">',

    `  {% if linklists['${escapeLiquidString(
      menu
    )}'] != blank %}`,

    `    <ul class="site-header__menu">`,

    `      {% for link in linklists['${escapeLiquidString(
      menu
    )}'].links %}`,

    '        <li class="site-header__menu-item">',

    '          <a',

    '            href="{{ link.url }}"',

    '            class="site-header__menu-link{% if link.active %} is-active{% endif %}"',

    '            {% if link.current %}aria-current="page"{% endif %}',

    "          >",

    "            {{ link.title | escape }}",

    "          </a>",

    "        </li>",

    "      {% endfor %}",

    "    </ul>",

    "  {% else %}",

    "    <ul class=\"site-header__menu\">",

    '      <li><a href="{{ routes.root_url }}">Home</a></li>',

    '      <li><a href="{{ routes.all_products_collection_url }}">Shop</a></li>',

    '      <li><a href="{{ routes.collections_url }}">Collections</a></li>',

    "    </ul>",

    "  {% endif %}",

    "</nav>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Header Search
|--------------------------------------------------------------------------
*/

const buildHeaderSearch = () => {

  return joinLines([

    '<form',

    '  action="{{ routes.search_url }}"',

    '  method="get"',

    '  role="search"',

    '  class="site-header__search-form"',

    ">",

    '  <label',

    '    class="visually-hidden"',

    '    for="HeaderSearchInput"',

    ">",

    "    Search",

    "  </label>",

    "",

    '  <input',

    '    id="HeaderSearchInput"',

    '    type="search"',

    '    name="q"',

    '    value="{{ search.terms | escape }}"',

    '    placeholder="Search products..."',

    '    autocomplete="off"',

    '    class="site-header__search-input"',

    '    aria-label="Search products"',

    ">",

    "",

    '  <input type="hidden" name="options[prefix]" value="last">',

    "",

    '  <button',

    '    type="submit"',

    '    class="site-header__search-button"',

    '    aria-label="Submit search"',

    ">",

    "    Search",

    "  </button>",

    "</form>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Header Actions
|--------------------------------------------------------------------------
*/

const buildHeaderActions = () => {

  return joinLines([

    '<div class="site-header__actions">',

    "",

    '  <a',

    '    href="{{ routes.search_url }}"',

    '    class="site-header__action site-header__search-toggle"',

    '    aria-label="Search"',

    ">",

    '    {% render "icon", name: "search" %}',

    "  </a>",

    "",

    "  {% if shop.customer_accounts_enabled %}",

    '    <a',

    '      href="{{ routes.account_url }}"',

    '      class="site-header__action"',

    '      aria-label="Account"',

    "    >",

    '      {% render "icon", name: "account" %}',

    "    </a>",

    "  {% endif %}",

    "",

    '  <a',

    '    href="{{ routes.cart_url }}"',

    '    class="site-header__action site-header__cart-link"',

    '    aria-label="Cart, {{ cart.item_count }} items"',

    ">",

    '    {% render "icon", name: "cart" %}',

    '    <span class="site-header__cart-count" data-cart-count>',

    "      {{ cart.item_count }}",

    "    </span>",

    "  </a>",

    "",

    "</div>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Mobile Menu
|--------------------------------------------------------------------------
*/

const buildMobileMenu = () => {

  return joinLines([

    '<details class="mobile-menu">',

    "  <summary",

    '    class="mobile-menu__toggle"',

    '    aria-label="Open navigation menu"',

    ">",

    '    {% render "icon", name: "menu" %}',

    "  </summary>",

    "",

    '  <div class="mobile-menu__drawer">',

    "",

    '    <button',

    '      type="button"',

    '      class="mobile-menu__close"',

    '      aria-label="Close navigation menu"',

    "    >",

    '      {% render "icon", name: "close" %}',

    "    </button>",

    "",

    '    {% render "mobile-navigation" %}',

    "",

    "  </div>",

    "</details>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Header Section
|--------------------------------------------------------------------------
*/

const buildHeaderSection = (
  context
) => {

  const brandName =
    escapeLiquidString(
      context.brand.name
    );

  const navigation =
    buildHeaderNavigation(
      context
    );

  const search =
    buildHeaderSearch();

  const actions =
    buildHeaderActions();

  const mobileMenu =
    buildMobileMenu();

  const schema = {

    name:
      "Header",

    settings: [

      settingSchema(
        "logo_width",
        "range",
        "Logo width",
        140,
        {
          min:
            80,

          max:
            260,

          step:
            10,

          unit:
            "px"
        }
      ),

      settingSchema(
        "sticky_header",
        "checkbox",
        "Enable sticky header",
        true
      ),

      settingSchema(
        "show_search",
        "checkbox",
        "Show search",
        true
      ),

      settingSchema(
        "show_account",
        "checkbox",
        "Show account",
        true
      ),

      settingSchema(
        "show_cart",
        "checkbox",
        "Show cart",
        true
      )

    ],

    blocks: [],

    presets: [

      {

        name:
          "Header"

      }

    ]

  };


  const content = joinLines([

    liquidComment(
      "StoreForge AI Header Section"
    ),

    '<header',

    '  class="site-header{% if section.settings.sticky_header %} site-header--sticky{% endif %}"',

    '  data-section-id="{{ section.id }}"',

    '  data-section-type="header"',

    ">",

    "",

    '  <div class="site-header__container page-width">',

    "",

    '    <div class="site-header__mobile-toggle">',

    `      ${mobileMenu}`,

    "    </div>",

    "",

    '    <div class="site-header__brand">',

    '      <a',

    '        href="{{ routes.root_url }}"',

    '        class="site-header__logo-link"',

    `        aria-label="${brandName}"`,

    "      >",

    "        {% if settings.logo != blank %}",

    '          {{ settings.logo | image_url: width: 500 | image_tag:',

    '            class: "site-header__logo",',

    '            widths: "100, 150, 200, 300, 400, 500",',

    '            sizes: "(min-width: 990px) 200px, 150px",',

    '            alt: shop.name',

    "          }}",

    "        {% else %}",

    `          <span class="site-header__logo-text">${brandName}</span>`,

    "        {% endif %}",

    "      </a>",

    "    </div>",

    "",

    '    <div class="site-header__desktop-navigation">',

    `      ${navigation}`,

    "    </div>",

    "",

    '    <div class="site-header__search">',

    `      ${search}`,

    "    </div>",

    "",

    `    ${actions}`,

    "",

    "  </div>",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</header>"

  ]);

  return content;

};


/*
|--------------------------------------------------------------------------
| Footer Navigation
|--------------------------------------------------------------------------
*/

const buildFooterNavigation = () => {

  return joinLines([

    '<div class="site-footer__navigation">',

    "",

    "  {% for linklist in linklists %}",

    "",

    "    {% if linklist.title != blank %}",

    '      <div class="site-footer__menu-group">',

    "",

    "        <h2 class=\"site-footer__menu-title\">",

    "          {{ linklist.title | escape }}",

    "        </h2>",

    "",

    "        <ul class=\"site-footer__menu\">",

    "",

    "          {% for link in linklist.links limit: 8 %}",

    "            <li>",

    '              <a href="{{ link.url }}">',

    "                {{ link.title | escape }}",

    "              </a>",

    "            </li>",

    "          {% endfor %}",

    "",

    "        </ul>",

    "",

    "      </div>",

    "    {% endif %}",

    "",

    "  {% endfor %}",

    "",

    "</div>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Footer Newsletter
|--------------------------------------------------------------------------
*/

const buildFooterNewsletter = () => {

  return joinLines([

    '<div class="site-footer__newsletter">',

    "",

    "  <h2 class=\"site-footer__newsletter-title\">",

    "    Stay in the loop",

    "  </h2>",

    "",

    "  <p class=\"site-footer__newsletter-text\">",

    "    Get product updates, special offers, and news delivered to your inbox.",

    "  </p>",

    "",

    '  {% form "customer", class: "newsletter-form" %}',

    "",

    "    <input",

    '      type="hidden"',

    '      name="contact[tags]"',

    '      value="newsletter"',

    "    >",

    "",

    "    <label",

    '      for="FooterNewsletterEmail"',

    '      class="visually-hidden"',

    "    >",

    "      Email address",

    "    </label>",

    "",

    "    <input",

    '      id="FooterNewsletterEmail"',

    '      type="email"',

    '      name="contact[email]"',

    '      value="{{ form.email }}"',

    '      placeholder="Your email address"',

    '      autocomplete="email"',

    '      required',

    "    >",

    "",

    "    <button",

    '      type="submit"',

    '      class="button"',

    "    >",

    "      Subscribe",

    "    </button>",

    "",

    "    {% if form.posted_successfully? %}",

    '      <p class="form-success" role="status">',

    "        Thanks for subscribing!",

    "      </p>",

    "    {% endif %}",

    "",

    "    {% if form.errors %}",

    '      <div class="form-errors" role="alert">',

    "        {{ form.errors | default_errors }}",

    "      </div>",

    "    {% endif %}",

    "",

    "  {% endform %}",

    "",

    "</div>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Footer Social Links
|--------------------------------------------------------------------------
*/

const buildFooterSocialLinks = () => {

  return joinLines([

    '<div class="site-footer__social">',

    "",

    "  {% if settings.social_instagram != blank %}",

    '    <a href="{{ settings.social_instagram }}"',

    '       target="_blank"',

    '       rel="noopener noreferrer"',

    '       aria-label="Instagram">',

    '      {% render "icon", name: "instagram" %}',

    "    </a>",

    "  {% endif %}",

    "",

    "  {% if settings.social_facebook != blank %}",

    '    <a href="{{ settings.social_facebook }}"',

    '       target="_blank"',

    '       rel="noopener noreferrer"',

    '       aria-label="Facebook">',

    '      {% render "icon", name: "facebook" %}',

    "    </a>",

    "  {% endif %}",

    "",

    "  {% if settings.social_youtube != blank %}",

    '    <a href="{{ settings.social_youtube }}"',

    '       target="_blank"',

    '       rel="noopener noreferrer"',

    '       aria-label="YouTube">',

    '      {% render "icon", name: "youtube" %}',

    "    </a>",

    "  {% endif %}",

    "",

    "  {% if settings.social_tiktok != blank %}",

    '    <a href="{{ settings.social_tiktok }}"',

    '       target="_blank"',

    '       rel="noopener noreferrer"',

    '       aria-label="TikTok">',

    '      {% render "icon", name: "tiktok" %}',

    "    </a>",

    "  {% endif %}",

    "",

    "</div>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Footer Section
|--------------------------------------------------------------------------
*/

const buildFooterSection = (
  context
) => {

  const navigation =
    buildFooterNavigation();

  const newsletter =
    buildFooterNewsletter();

  const social =
    buildFooterSocialLinks();

  const schema = {

    name:
      "Footer",

    settings: [

      settingSchema(
        "show_newsletter",
        "checkbox",
        "Show newsletter",
        true
      ),

      settingSchema(
        "show_social",
        "checkbox",
        "Show social links",
        true
      ),

      settingSchema(
        "show_payment_icons",
        "checkbox",
        "Show payment icons",
        true
      )

    ],

    blocks: [],

    presets: [

      {

        name:
          "Footer"

      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Footer Section"
    ),

    '<footer',

    '  class="site-footer"',

    '  data-section-id="{{ section.id }}"',

    '  data-section-type="footer"',

    ">",

    "",

    '  <div class="site-footer__container page-width">',

    "",

    `    ${navigation}`,

    "",

    "    {% if section.settings.show_newsletter %}",

    `      ${newsletter}`,

    "    {% endif %}",

    "",

    "    {% if section.settings.show_social %}",

    `      ${social}`,

    "    {% endif %}",

    "",

    '    <div class="site-footer__bottom">',

    "",

    '      <p class="site-footer__copyright">',

    "        &copy; ",

    currentYear(),

    " ",

    shopName(),

    ". All rights reserved.",

    "      </p>",

    "",

    "      {% if section.settings.show_payment_icons %}",

    '        <div class="site-footer__payments"',

    '             aria-label="Payment methods">',

    "",

    "          {% for type in shop.enabled_payment_types %}",

    "            {{ type | payment_type_svg_tag: class: 'payment-icon' }}",

    "          {% endfor %}",

    "",

    "        </div>",

    "      {% endif %}",

    "",

    "    </div>",

    "",

    "  </div>",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</footer>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Mobile Navigation Snippet
|--------------------------------------------------------------------------
*/

const buildMobileNavigationSnippet = () => {

  return joinLines([

    liquidComment(
      "StoreForge AI Mobile Navigation"
    ),

    '<nav class="mobile-navigation"',

    '     aria-label="Mobile navigation">',

    "",

    "  <ul>",

    "",

    "    {% for link in linklists.main-menu.links %}",

    "",

    "      <li>",

    "",

    "        <a",

    '          href="{{ link.url }}"',

    '          {% if link.current %}aria-current="page"{% endif %}',

    "        >",

    "          {{ link.title | escape }}",

    "        </a>",

    "",

    "        {% if link.links != blank %}",

    "",

    "          <ul>",

    "",

    "            {% for child_link in link.links %}",

    "              <li>",

    '                <a href="{{ child_link.url }}">',

    "                  {{ child_link.title | escape }}",

    "                </a>",

    "              </li>",

    "            {% endfor %}",

    "",

    "          </ul>",

    "",

    "        {% endif %}",

    "",

    "      </li>",

    "",

    "    {% endfor %}",

    "",

    "  </ul>",

    "",

    "</nav>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Icon Snippet
|--------------------------------------------------------------------------
*/

const buildIconSnippet = () => {

  return joinLines([

    liquidComment(
      "StoreForge AI SVG icon system"
    ),

    "{% case name %}",

    "",

    "{% when 'search' %}",

    '  <svg viewBox="0 0 24 24"',

    '       aria-hidden="true"',

    '       focusable="false">',

    '    <circle cx="11" cy="11" r="7"></circle>',

    '    <path d="m20 20-4-4"></path>',

    "  </svg>",

    "",

    "{% when 'account' %}",

    '  <svg viewBox="0 0 24 24"',

    '       aria-hidden="true"',

    '       focusable="false">',

    '    <circle cx="12" cy="8" r="4"></circle>',

    '    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"></path>',

    "  </svg>",

    "",

    "{% when 'cart' %}",

    '  <svg viewBox="0 0 24 24"',

    '       aria-hidden="true"',

    '       focusable="false">',

    '    <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6"></path>',

    '    <circle cx="10" cy="20" r="1"></circle>',

    '    <circle cx="18" cy="20" r="1"></circle>',

    "  </svg>",

    "",

    "{% when 'menu' %}",

    '  <svg viewBox="0 0 24 24"',

    '       aria-hidden="true"',

    '       focusable="false">',

    '    <path d="M3 6h18M3 12h18M3 18h18"></path>',

    "  </svg>",

    "",

    "{% when 'close' %}",

    '  <svg viewBox="0 0 24 24"',

    '       aria-hidden="true"',

    '       focusable="false">',

    '    <path d="M5 5l14 14M19 5 5 19"></path>',

    "  </svg>",

    "",

    "{% when 'instagram' %}",

    '  <svg viewBox="0 0 24 24"',

    '       aria-hidden="true"',

    '       focusable="false">',

    '    <rect x="3" y="3" width="18" height="18" rx="5"></rect>',

    '    <circle cx="12" cy="12" r="4"></circle>',

    '    <circle cx="17.5" cy="6.5" r="1"></circle>',

    "  </svg>",

    "",

    "{% when 'facebook' %}",

    '  <svg viewBox="0 0 24 24"',

    '       aria-hidden="true"',

    '       focusable="false">',

    '    <path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1z"></path>',

    "  </svg>",

    "",

    "{% when 'youtube' %}",

    '  <svg viewBox="0 0 24 24"',

    '       aria-hidden="true"',

    '       focusable="false">',

    '    <rect x="3" y="6" width="18" height="12" rx="3"></rect>',

    '    <path d="m10 9 5 3-5 3z"></path>',

    "  </svg>",

    "",

    "{% when 'tiktok' %}",

    '  <svg viewBox="0 0 24 24"',

    '       aria-hidden="true"',

    '       focusable="false">',

    '    <path d="M14 4v10.5a4.5 4.5 0 1 1-4-4.47"></path>',

    '    <path d="M14 4c1 2 2.4 3 5 3"></path>',

    "  </svg>",

    "",

    "{% endcase %}"

  ]);

};


/*
|--------------------------------------------------------------------------
| Global Scripts Snippet
|--------------------------------------------------------------------------
*/

const buildGlobalScriptsSnippet = () => {

  return joinLines([

    liquidComment(
      "StoreForge AI global storefront scripts"
    ),

    "<script>",

    "  document.documentElement.classList.add('js');",

    "",

    "  window.StoreForge = window.StoreForge || {};",

    "",

    "  window.StoreForge.config = {",

    "    routes: {",

    "      root: '{{ routes.root_url }}',",

    "      cart: '{{ routes.cart_url }}',",

    "      checkout: '{{ routes.checkout_url }}',",

    "      search: '{{ routes.search_url }}'",

    "    },",

    "",

    "    currency: '{{ cart.currency.iso_code }}',",

    "",

    "    cartItemCount:",

    "      {{ cart.item_count | json }}",

    "  };",

    "</script>",

    "",

    '<script src="{{ \'theme.js\' | asset_url }}" defer></script>'

  ]);

};


/*
|--------------------------------------------------------------------------
| Generate Global Layout Files
|--------------------------------------------------------------------------
*/

const generateGlobalLayoutFiles = (
  context
) => {

  addLiquidFile(

    context,

    "layout/theme.liquid",

    buildThemeLiquid(
      context
    )

  );


  addLiquidFile(

    context,

    "sections/header.liquid",

    buildHeaderSection(
      context
    )

  );


  addLiquidFile(

    context,

    "sections/footer.liquid",

    buildFooterSection(
      context
    )

  );


  addLiquidFile(

    context,

    "snippets/meta-tags.liquid",

    buildMetaTagsSnippet(
      context
    )

  );


  addLiquidFile(

    context,

    "snippets/icon.liquid",

    buildIconSnippet()

  );


  addLiquidFile(

    context,

    "snippets/mobile-navigation.liquid",

    buildMobileNavigationSnippet()

  );


  addLiquidFile(

    context,

    "snippets/global-scripts.liquid",

    buildGlobalScriptsSnippet()

  );


  return context;

};


/*
|--------------------------------------------------------------------------
| Part 2 Complete
|--------------------------------------------------------------------------
|
| Part 3 will generate the reusable storefront sections:
|
| - Hero
| - Announcement bar
| - Featured products
| - Collection cards
| - Rich text
| - Image/text
| - Testimonials
| - FAQ
| - Newsletter
| - CTA
|
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| PART 3 / 10
| Reusable Storefront Sections
|--------------------------------------------------------------------------
|
| Generates:
|
| - announcement-bar.liquid
| - hero.liquid
| - featured-collection.liquid
| - collection-list.liquid
| - rich-text.liquid
| - image-with-text.liquid
| - testimonials.liquid
| - faq.liquid
| - newsletter.liquid
| - call-to-action.liquid
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Announcement Bar
|--------------------------------------------------------------------------
*/

const buildAnnouncementBarSection = (
  context
) => {

  const schema = {

    name:
      "Announcement bar",

    settings: [

      settingSchema(
        "text",
        "text",
        "Announcement text",
        "Free shipping on qualifying orders"
      ),

      settingSchema(
        "link",
        "url",
        "Link",
        ""
      ),

      settingSchema(
        "show_close",
        "checkbox",
        "Allow customers to close",
        true
      )

    ],

    presets: [

      {
        name:
          "Announcement bar"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Announcement Bar"
    ),

    "{% if section.settings.text != blank %}",

    '<div class="announcement-bar"',

    '     data-section-id="{{ section.id }}"',

    ">",

    "  <div class=\"page-width announcement-bar__inner\">",

    "",

    "    {% if section.settings.link != blank %}",

    '      <a href="{{ section.settings.link }}"',

    '         class="announcement-bar__link">',

    "        {{ section.settings.text | escape }}",

    "      </a>",

    "    {% else %}",

    '      <span class="announcement-bar__text">',

    "        {{ section.settings.text | escape }}",

    "      </span>",

    "    {% endif %}",

    "",

    "    {% if section.settings.show_close %}",

    '      <button',

    '        type="button"',

    '        class="announcement-bar__close"',

    '        aria-label="Dismiss announcement"',

    '        data-announcement-close',

    "      >",

    "        &times;",

    "      </button>",

    "    {% endif %}",

    "",

    "  </div>",

    "</div>",

    "{% endif %}",

    "",

    buildNativeSectionSchema(
      schema
    )

  ]);

};


/*
|--------------------------------------------------------------------------
| Hero Section
|--------------------------------------------------------------------------
*/

const buildHeroSection = (
  context
) => {

  const homepage =
    context.content?.homepage ||
    {};

  const title =
    homepage.hero?.heading ||
    context.brand.name;

  const description =
    homepage.hero?.description ||
    "Discover products designed for you.";

  const buttonText =
    homepage.hero?.buttonText ||
    "Shop now";

  const schema = {

    name:
      "StoreForge Hero",

    settings: [

      settingSchema(
        "heading",
        "text",
        "Heading",
        title
      ),

      settingSchema(
        "description",
        "textarea",
        "Description",
        description
      ),

      settingSchema(
        "button_label",
        "text",
        "Button label",
        buttonText
      ),

      settingSchema(
        "button_link",
        "url",
        "Button link",
        "/collections/all"
      ),

      settingSchema(
        "image",
        "image_picker",
        "Hero image",
        null
      ),

      settingSchema(
        "image_position",
        "select",
        "Image position",
        "center",
        {
          options: [

            {
              value:
                "left",

              label:
                "Left"
            },

            {
              value:
                "center",

              label:
                "Center"
            },

            {
              value:
                "right",

              label:
                "Right"
            }

          ]
        }
      ),

      settingSchema(
        "overlay",
        "checkbox",
        "Enable image overlay",
        true
      ),

      settingSchema(
        "full_width",
        "checkbox",
        "Full width",
        true
      )

    ],

    presets: [

      {
        name:
          "StoreForge Hero"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Hero Section"
    ),

    '<section',

    '  class="hero-section{% if section.settings.full_width %} hero-section--full-width{% endif %}"',

    '  data-section-id="{{ section.id }}"',

    ">",

    "",

    '  <div class="hero-section__media{% if section.settings.overlay %} hero-section__media--overlay{% endif %}">',

    "",

    "    {% if section.settings.image != blank %}",

    "      {{ section.settings.image | image_url: width: 2400 | image_tag:",

    '        class: "hero-section__image",',

    '        widths: "550, 750, 990, 1200, 1500, 1800, 2200, 2400",',

    '        sizes: "100vw",',

    '        loading: "eager",',

    '        fetchpriority: "high"',

    "      }}",

    "    {% else %}",

    "      {{ 'lifestyle-1' | placeholder_svg_tag: 'hero-section__placeholder' }}",

    "    {% endif %}",

    "",

    "  </div>",

    "",

    '  <div class="hero-section__content page-width">',

    "",

    '    <div class="hero-section__content-inner">',

    "",

    "      {% if section.settings.heading != blank %}",

    '        <h1 class="hero-section__heading">',

    "          {{ section.settings.heading | escape }}",

    "        </h1>",

    "      {% endif %}",

    "",

    "      {% if section.settings.description != blank %}",

    '        <div class="hero-section__description rte">',

    "          {{ section.settings.description }}",

    "        </div>",

    "      {% endif %}",

    "",

    "      {% if section.settings.button_label != blank %}",

    '        <a',

    '          href="{{ section.settings.button_link | default: routes.all_products_collection_url }}"',

    '          class="button hero-section__button"',

    "        >",

    "          {{ section.settings.button_label | escape }}",

    "        </a>",

    "      {% endif %}",

    "",

    "    </div>",

    "",

    "  </div>",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</section>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Featured Collection Section
|--------------------------------------------------------------------------
*/

const buildFeaturedCollectionSection = (
  context
) => {

  const schema = {

    name:
      "Featured collection",

    settings: [

      settingSchema(
        "heading",
        "text",
        "Heading",
        "Featured products"
      ),

      settingSchema(
        "description",
        "textarea",
        "Description",
        ""
      ),

      settingSchema(
        "collection",
        "collection",
        "Collection",
        ""
      ),

      settingSchema(
        "products_to_show",
        "range",
        "Products to show",
        4,
        {
          min:
            2,

          max:
            12,

          step:
            1
        }
      ),

      settingSchema(
        "columns_desktop",
        "range",
        "Desktop columns",
        4,
        {
          min:
            2,

          max:
            5,

          step:
            1
        }
      ),

      settingSchema(
        "show_view_all",
        "checkbox",
        "Show view all button",
        true
      )

    ],

    presets: [

      {
        name:
          "Featured collection"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Featured Collection"
    ),

    '<section',

    '  class="featured-collection page-width"',

    '  data-section-id="{{ section.id }}"',

    ">",

    "",

    '  <div class="section-header">',

    "",

    "    {% if section.settings.heading != blank %}",

    '      <h2 class="section-heading">',

    "        {{ section.settings.heading | escape }}",

    "      </h2>",

    "    {% endif %}",

    "",

    "    {% if section.settings.description != blank %}",

    '      <div class="section-description rte">',

    "        {{ section.settings.description }}",

    "      </div>",

    "    {% endif %}",

    "",

    "  </div>",

    "",

    "  {% assign featured_collection = section.settings.collection %}",

    "",

    "  {% if featured_collection != blank %}",

    "",

    '    <div class="product-grid product-grid--{{ section.settings.columns_desktop }}">',

    "",

    "      {% for product in featured_collection.products limit: section.settings.products_to_show %}",

    "",

    '        {% render "product-card", product: product %}',

    "",

    "      {% else %}",

    "",

    '        <p class="collection-empty">',

    "          No products found.",

    "        </p>",

    "",

    "      {% endfor %}",

    "",

    "    </div>",

    "",

    "    {% if section.settings.show_view_all %}",

    "",

    '      <div class="section-footer">',

    "",

    '        <a',

    '          href="{{ featured_collection.url }}"',

    '          class="button button--secondary"',

    "        >",

    "          View all",

    "        </a>",

    "",

    "      </div>",

    "",

    "    {% endif %}",

    "",

    "  {% else %}",

    "",

    '    <div class="empty-state">',

    "      <p>Select a collection to display products.</p>",

    "    </div>",

    "",

    "  {% endif %}",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</section>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Collection List Section
|--------------------------------------------------------------------------
*/

const buildCollectionListSection = (
  context
) => {

  const schema = {

    name:
      "Collection list",

    settings: [

      settingSchema(
        "heading",
        "text",
        "Heading",
        "Shop our collections"
      ),

      settingSchema(
        "collections_to_show",
        "range",
        "Collections to show",
        6,
        {
          min:
            2,

          max:
            12,

          step:
            1
        }
      )

    ],

    presets: [

      {
        name:
          "Collection list"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Collection List"
    ),

    '<section',

    '  class="collection-list page-width"',

    '  data-section-id="{{ section.id }}"',

    ">",

    "",

    '  {% if section.settings.heading != blank %}',

    '    <h2 class="section-heading">',

    "      {{ section.settings.heading | escape }}",

    "    </h2>",

    "  {% endif %}",

    "",

    '  <div class="collection-grid">',

    "",

    "    {% for collection in collections limit: section.settings.collections_to_show %}",

    "",

    '      <a',

    '        href="{{ collection.url }}"',

    '        class="collection-card"',

    "      >",

    "",

    "        {% if collection.featured_image != blank %}",

    "          {{ collection.featured_image | image_url: width: 800 | image_tag:",

    '            class: "collection-card__image",',

    '            loading: "lazy",',

    '            widths: "300, 500, 700, 800"',

    "          }}",

    "        {% else %}",

    "          {{ 'collection-1' | placeholder_svg_tag: 'collection-card__image' }}",

    "        {% endif %}",

    "",

    '        <div class="collection-card__content">',

    "",

    '          <h3 class="collection-card__title">',

    "            {{ collection.title | escape }}",

    "          </h3>",

    "",

    "          {% if collection.description != blank %}",

    '            <p class="collection-card__description">',

    "              {{ collection.description | strip_html | truncate: 100 | escape }}",

    "            </p>",

    "          {% endif %}",

    "",

    "        </div>",

    "",

    "      </a>",

    "",

    "    {% endfor %}",

    "",

    "  </div>",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</section>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Rich Text Section
|--------------------------------------------------------------------------
*/

const buildRichTextSection = (
  context
) => {

  const content =
    context.content?.homepage?.richText ||
    {};

  const schema = {

    name:
      "Rich text",

    settings: [

      settingSchema(
        "heading",
        "text",
        "Heading",
        content.heading ||
          "Tell your brand story"
      ),

      settingSchema(
        "text",
        "richtext",
        "Text",
        content.text ||
          "<p>Share what makes your store special.</p>"
      ),

      settingSchema(
        "button_label",
        "text",
        "Button label",
        ""
      ),

      settingSchema(
        "button_link",
        "url",
        "Button link",
        ""
      ),

      settingSchema(
        "alignment",
        "select",
        "Alignment",
        "center",
        {
          options: [

            {
              value:
                "left",

              label:
                "Left"
            },

            {
              value:
                "center",

              label:
                "Center"
            },

            {
              value:
                "right",

              label:
                "Right"
            }

          ]
        }
      )

    ],

    presets: [

      {
        name:
          "Rich text"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Rich Text"
    ),

    '<section',

    '  class="rich-text rich-text--{{ section.settings.alignment }}"',

    '  data-section-id="{{ section.id }}"',

    ">",

    "",

    '  <div class="rich-text__container page-width">',

    "",

    "    {% if section.settings.heading != blank %}",

    '      <h2 class="section-heading">',

    "        {{ section.settings.heading | escape }}",

    "      </h2>",

    "    {% endif %}",

    "",

    "    {% if section.settings.text != blank %}",

    '      <div class="rich-text__content rte">',

    "        {{ section.settings.text }}",

    "      </div>",

    "    {% endif %}",

    "",

    "    {% if section.settings.button_label != blank and section.settings.button_link != blank %}",

    '      <a',

    '        href="{{ section.settings.button_link }}"',

    '        class="button"',

    "      >",

    "        {{ section.settings.button_label | escape }}",

    "      </a>",

    "    {% endif %}",

    "",

    "  </div>",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</section>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Image With Text Section
|--------------------------------------------------------------------------
*/

const buildImageWithTextSection = (
  context
) => {

  const schema = {

    name:
      "Image with text",

    settings: [

      settingSchema(
        "image",
        "image_picker",
        "Image",
        null
      ),

      settingSchema(
        "heading",
        "text",
        "Heading",
        "Built around your customers"
      ),

      settingSchema(
        "text",
        "richtext",
        "Text",
        "<p>Explain why customers should choose your brand.</p>"
      ),

      settingSchema(
        "button_label",
        "text",
        "Button label",
        "Learn more"
      ),

      settingSchema(
        "button_link",
        "url",
        "Button link",
        "/pages/about"
      ),

      settingSchema(
        "image_position",
        "select",
        "Image position",
        "left",
        {
          options: [

            {
              value:
                "left",

              label:
                "Left"
            },

            {
              value:
                "right",

              label:
                "Right"
            }

          ]
        }
      )

    ],

    presets: [

      {
        name:
          "Image with text"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Image With Text"
    ),

    '<section',

    '  class="image-with-text image-with-text--{{ section.settings.image_position }}"',

    '  data-section-id="{{ section.id }}"',

    ">",

    "",

    '  <div class="image-with-text__container page-width">',

    "",

    '    <div class="image-with-text__media">',

    "",

    "      {% if section.settings.image != blank %}",

    "        {{ section.settings.image | image_url: width: 1200 | image_tag:",

    '          class: "image-with-text__image",',

    '          loading: "lazy",',

    '          widths: "400, 600, 800, 1000, 1200"',

    "        }}",

    "      {% else %}",

    "        {{ 'image' | placeholder_svg_tag: 'image-with-text__image' }}",

    "      {% endif %}",

    "",

    "    </div>",

    "",

    '    <div class="image-with-text__content">',

    "",

    "      {% if section.settings.heading != blank %}",

    '        <h2 class="section-heading">',

    "          {{ section.settings.heading | escape }}",

    "        </h2>",

    "      {% endif %}",

    "",

    "      {% if section.settings.text != blank %}",

    '        <div class="rte">',

    "          {{ section.settings.text }}",

    "        </div>",

    "      {% endif %}",

    "",

    "      {% if section.settings.button_label != blank and section.settings.button_link != blank %}",

    '        <a',

    '          href="{{ section.settings.button_link }}"',

    '          class="button"',

    "        >",

    "          {{ section.settings.button_label | escape }}",

    "        </a>",

    "      {% endif %}",

    "",

    "    </div>",

    "",

    "  </div>",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</section>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Testimonials Section
|--------------------------------------------------------------------------
*/

const buildTestimonialsSection = (
  context
) => {

  const testimonials =
    context.content?.testimonials ||
    [];

  const defaultBlocks =
    testimonials.length
      ? testimonials.slice(
          0,
          6
        )
      : [];


  const blocks =
    defaultBlocks.length
      ? defaultBlocks.map(
          testimonial => ({

            type:
              "testimonial",

            name:
              testimonial.name ||
              "Customer",

            quote:
              testimonial.quote ||
              "",

            role:
              testimonial.role ||
              ""

          })
        )
      : [

          {

            type:
              "testimonial",

            name:
              "Customer",

            quote:
              "Add a genuine customer testimonial here.",

            role:
              ""

          }

        ];


  const schema = {

    name:
      "Testimonials",

    settings: [

      settingSchema(
        "heading",
        "text",
        "Heading",
        "What our customers say"
      )

    ],

    blocks: [

      {

        type:
          "testimonial",

        name:
          "Testimonial",

        settings: [

          settingSchema(
            "quote",
            "textarea",
            "Quote",
            ""
          ),

          settingSchema(
            "name",
            "text",
            "Customer name",
            ""
          ),

          settingSchema(
            "role",
            "text",
            "Role",
            ""
          ),

          settingSchema(
            "rating",
            "range",
            "Rating",
            5,
            {
              min:
                1,

              max:
                5,

              step:
                1
            }
          )

        ]

      }

    ],

    presets: [

      {

        name:
          "Testimonials",

        blocks:
          blocks.map(
            block => ({

              type:
                block.type,

              settings: {

                quote:
                  block.quote,

                name:
                  block.name,

                role:
                  block.role,

                rating:
                  5

              }

            })
          )

      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Testimonials"
    ),

    '<section',

    '  class="testimonials page-width"',

    '  data-section-id="{{ section.id }}"',

    ">",

    "",

    "  {% if section.settings.heading != blank %}",

    '    <h2 class="section-heading">',

    "      {{ section.settings.heading | escape }}",

    "    </h2>",

    "  {% endif %}",

    "",

    '  <div class="testimonials__grid">',

    "",

    "    {% for block in section.blocks %}",

    "",

    '      <article',

    '        class="testimonial-card"',

    '        {{ block.shopify_attributes }}',

    "      >",

    "",

    '        <div class="testimonial-card__rating"',

    '             aria-label="{{ block.settings.rating }} out of 5 stars">',

    "",

    "          {% for i in (1..5) %}",

    "            {% if i <= block.settings.rating %}",

    "              <span aria-hidden=\"true\">★</span>",

    "            {% else %}",

    "              <span aria-hidden=\"true\">☆</span>",

    "            {% endif %}",

    "          {% endfor %}",

    "",

    "        </div>",

    "",

    "        {% if block.settings.quote != blank %}",

    '          <blockquote class="testimonial-card__quote">',

    "            {{ block.settings.quote | escape }}",

    "          </blockquote>",

    "        {% endif %}",

    "",

    "        {% if block.settings.name != blank %}",

    '          <cite class="testimonial-card__name">',

    "            {{ block.settings.name | escape }}",

    "          </cite>",

    "        {% endif %}",

    "",

    "        {% if block.settings.role != blank %}",

    '          <span class="testimonial-card__role">',

    "            {{ block.settings.role | escape }}",

    "          </span>",

    "        {% endif %}",

    "",

    "      </article>",

    "",

    "    {% endfor %}",

    "",

    "  </div>",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</section>"

  ]);

};


/*
|--------------------------------------------------------------------------
| FAQ Section
|--------------------------------------------------------------------------
*/

const buildFaqSection = (
  context
) => {

  const schema = {

    name:
      "Frequently asked questions",

    settings: [

      settingSchema(
        "heading",
        "text",
        "Heading",
        "Frequently asked questions"
      )

    ],

    blocks: [

      {

        type:
          "question",

        name:
          "Question",

        settings: [

          settingSchema(
            "question",
            "text",
            "Question",
            ""
          ),

          settingSchema(
            "answer",
            "richtext",
            "Answer",
            ""
          )

        ]

      }

    ],

    presets: [

      {

        name:
          "FAQ",

        blocks: [

          {

            type:
              "question",

            settings: {

              question:
                "How does shipping work?",

              answer:
                "<p>Add your shipping information here.</p>"

            }

          },

          {

            type:
              "question",

            settings: {

              question:
                "What is your return policy?",

              answer:
                "<p>Add your return information here.</p>"

            }

          }

        ]

      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI FAQ"
    ),

    '<section',

    '  class="faq page-width"',

    '  data-section-id="{{ section.id }}"',

    ">",

    "",

    "  {% if section.settings.heading != blank %}",

    '    <h2 class="section-heading">',

    "      {{ section.settings.heading | escape }}",

    "    </h2>",

    "  {% endif %}",

    "",

    '  <div class="faq__items">',

    "",

    "    {% for block in section.blocks %}",

    "",

    '      <details',

    '        class="faq__item"',

    '        {{ block.shopify_attributes }}',

    "      >",

    "",

    '        <summary class="faq__question">',

    "          {{ block.settings.question | escape }}",

    "        </summary>",

    "",

    '        <div class="faq__answer rte">',

    "          {{ block.settings.answer }}",

    "        </div>",

    "",

    "      </details>",

    "",

    "    {% endfor %}",

    "",

    "  </div>",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</section>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Newsletter Section
|--------------------------------------------------------------------------
*/

const buildNewsletterSection = (
  context
) => {

  const schema = {

    name:
      "Newsletter",

    settings: [

      settingSchema(
        "heading",
        "text",
        "Heading",
        "Join our newsletter"
      ),

      settingSchema(
        "description",
        "textarea",
        "Description",
        "Get updates, new product announcements, and special offers."
      ),

      settingSchema(
        "button_label",
        "text",
        "Button label",
        "Subscribe"
      )

    ],

    presets: [

      {

        name:
          "Newsletter"

      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Newsletter"
    ),

    '<section',

    '  class="newsletter page-width"',

    '  data-section-id="{{ section.id }}"',

    ">",

    "",

    '  <div class="newsletter__inner">',

    "",

    "    {% if section.settings.heading != blank %}",

    '      <h2 class="section-heading">',

    "        {{ section.settings.heading | escape }}",

    "      </h2>",

    "    {% endif %}",

    "",

    "    {% if section.settings.description != blank %}",

    '      <p class="newsletter__description">',

    "        {{ section.settings.description | escape }}",

    "      </p>",

    "    {% endif %}",

    "",

    '    {% form "customer", class: "newsletter-form" %}',

    "",

    '      <input type="hidden" name="contact[tags]" value="newsletter">',

    "",

    '      <label for="NewsletterEmail" class="visually-hidden">',

    "        Email address",

    "      </label>",

    "",

    '      <input',

    '        id="NewsletterEmail"',

    '        type="email"',

    '        name="contact[email]"',

    '        placeholder="Email address"',

    '        autocomplete="email"',

    '        required',

    "      >",


    "",

    "      <button",

    '        type="submit"',

    '        class="button"',

    "      >",

    "        {{ section.settings.button_label | escape }}",

    "      </button>",

    "",

    "      {% if form.posted_successfully? %}",

    '        <p class="form-success" role="status">',

    "          Thanks for subscribing!",

    "        </p>",

    "      {% endif %}",

    "",

    "      {% if form.errors %}",

    '        <div class="form-errors" role="alert">',

    "          {{ form.errors | default_errors }}",

    "        </div>",

    "      {% endif %}",

    "",

    "    {% endform %}",

    "",

    "  </div>",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</section>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Call To Action Section
|--------------------------------------------------------------------------
*/

const buildCallToActionSection = (
  context
) => {

  const schema = {

    name:
      "Call to action",

    settings: [

      settingSchema(
        "heading",
        "text",
        "Heading",
        "Ready to get started?"
      ),

      settingSchema(
        "description",
        "textarea",
        "Description",
        "Explore our collection and find something you'll love."
      ),

      settingSchema(
        "button_label",
        "text",
        "Button label",
        "Shop now"
      ),

      settingSchema(
        "button_link",
        "url",
        "Button link",
        "/collections/all"
      )

    ],

    presets: [

      {

        name:
          "Call to action"

      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Call To Action"
    ),

    '<section',

    '  class="call-to-action page-width"',

    '  data-section-id="{{ section.id }}"',

    ">",

    "",

    '  <div class="call-to-action__inner">',

    "",

    "    {% if section.settings.heading != blank %}",

    '      <h2 class="section-heading">',

    "        {{ section.settings.heading | escape }}",

    "      </h2>",

    "    {% endif %}",

    "",

    "    {% if section.settings.description != blank %}",

    '      <p class="call-to-action__description">',

    "        {{ section.settings.description | escape }}",

    "      </p>",

    "    {% endif %}",

    "",

    "    {% if section.settings.button_label != blank %}",

    '      <a',

    '        href="{{ section.settings.button_link | default: routes.all_products_collection_url }}"',

    '        class="button"',

    "      >",

    "        {{ section.settings.button_label | escape }}",

    "      </a>",

    "    {% endif %}",

    "",

    "  </div>",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</section>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Generate Reusable Storefront Sections
|--------------------------------------------------------------------------
*/

const generateStorefrontSections = (
  context
) => {

  addLiquidFile(

    context,

    "sections/announcement-bar.liquid",

    buildAnnouncementBarSection(
      context
    )

  );


  addLiquidFile(

    context,

    "sections/hero.liquid",

    buildHeroSection(
      context
    )

  );


  addLiquidFile(

    context,

    "sections/featured-collection.liquid",

    buildFeaturedCollectionSection(
      context
    )

  );


  addLiquidFile(

    context,

    "sections/collection-list.liquid",

    buildCollectionListSection(
      context
    )

  );


  addLiquidFile(

    context,

    "sections/rich-text.liquid",

    buildRichTextSection(
      context
    )

  );


  addLiquidFile(

    context,

    "sections/image-with-text.liquid",

    buildImageWithTextSection(
      context
    )

  );


  addLiquidFile(

    context,

    "sections/testimonials.liquid",

    buildTestimonialsSection(
      context
    )

  );


  addLiquidFile(

    context,

    "sections/faq.liquid",

    buildFaqSection(
      context
    )

  );


  addLiquidFile(

    context,

    "sections/newsletter.liquid",

    buildNewsletterSection(
      context
    )

  );


  addLiquidFile(

    context,

    "sections/call-to-action.liquid",

    buildCallToActionSection(
      context
    )

  );


  return context;

};


/*
|--------------------------------------------------------------------------
| Part 3 Complete
|--------------------------------------------------------------------------
|
| Part 4 will generate:
|
| - Product card
| - Product form
| - Product page
| - Product media
| - Variant selector
| - Quantity selector
| - Add-to-cart functionality
| - Product recommendations
|
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| PART 4 / 10
| Product System
|--------------------------------------------------------------------------
|
| Generates:
|
| - snippets/product-card.liquid
| - snippets/product-price.liquid
| - snippets/product-media.liquid
| - snippets/price.liquid
| - sections/main-product.liquid
| - sections/product-recommendations.liquid
| - sections/main-collection-product-grid.liquid
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Product Price Snippet
|--------------------------------------------------------------------------
*/

const buildProductPriceSnippet = () => {

  return joinLines([

    liquidComment(
      "StoreForge AI Product Price"
    ),

    '<div class="product-price{% if product.compare_at_price > product.price %} product-price--sale{% endif %}">',

    "",

    "  {% if product.compare_at_price > product.price %}",

    '    <span class="product-price__sale"',

    '          data-product-price>',

    "      {{ product.price | money }}",

    "    </span>",

    "",

    '    <s class="product-price__compare">',

    "      {{ product.compare_at_price | money }}",

    "    </s>",

    "",

    '    {% assign savings = product.compare_at_price | minus: product.price %}',

    "",

    '    <span class="product-price__savings">',

    "      Save {{ savings | money }}",

    "    </span>",

    "",

    "  {% else %}",

    "",

    '    <span class="product-price__regular"',

    '          data-product-price>',

    "      {{ product.price | money }}",

    "    </span>",

    "",

    "  {% endif %}",

    "",

    "  {% if product.price_varies %}",

    '    <span class="product-price__from">',

    "      From",

    "    </span>",

    "  {% endif %}",

    "",

    "</div>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Generic Price Snippet
|--------------------------------------------------------------------------
*/

const buildPriceSnippet = () => {

  return joinLines([

    liquidComment(
      "StoreForge AI Generic Price"
    ),

    "{% if compare_at_price > price %}",

    '  <span class="price price--sale">',

    "    <span class=\"price__current\">",

    "      {{ price | money }}",

    "    </span>",

    "",

    "    <s class=\"price__compare\">",

    "      {{ compare_at_price | money }}",

    "    </s>",

    "  </span>",

    "{% else %}",

    '  <span class="price">',

    "    {{ price | money }}",

    "  </span>",

    "{% endif %}"

  ]);

};


/*
|--------------------------------------------------------------------------
| Product Card
|--------------------------------------------------------------------------
*/

const buildProductCardSnippet = () => {

  return joinLines([

    liquidComment(
      "StoreForge AI Product Card"
    ),

    "{% assign card_product = product %}",

    "",

    '<article',

    '  class="product-card"',

    '  data-product-id="{{ card_product.id }}"',

    '  data-product-handle="{{ card_product.handle }}"',

    ">",

    "",

    '  <a',

    '    href="{{ card_product.url }}"',

    '    class="product-card__link"',

    '    aria-label="{{ card_product.title | escape }}"',

    "  >",


    "",

    '    <div class="product-card__media">',

    "",

    "      {% if card_product.featured_image != blank %}",

    "",

    "        {{ card_product.featured_image | image_url: width: 800 | image_tag:",

    '          class: "product-card__image product-card__image--primary",',

    '          loading: "lazy",',

    '          widths: "240, 360, 480, 640, 800",',

    '          sizes: "(min-width: 990px) 25vw, (min-width: 750px) 33vw, 50vw"',

    "        }}",

    "",

    "      {% else %}",

    "",

    "        {{ 'product-1' | placeholder_svg_tag: 'product-card__image' }}",

    "",

    "      {% endif %}",

    "",

    "      {% if card_product.images.size > 1 %}",

    "",

    "        {{ card_product.images[1] | image_url: width: 800 | image_tag:",

    '          class: "product-card__image product-card__image--secondary",',

    '          loading: "lazy",',

    '          widths: "240, 360, 480, 640, 800",',

    '          sizes: "(min-width: 990px) 25vw, (min-width: 750px) 33vw, 50vw"',

    "        }}",

    "",

    "      {% endif %}",

    "",

    "      {% if card_product.compare_at_price > card_product.price %}",

    '        <span class="product-card__badge product-card__badge--sale">',

    "          Sale",

    "        </span>",

    "      {% endif %}",

    "",

    "      {% unless card_product.available %}",

    '        <span class="product-card__badge product-card__badge--sold-out">',

    "          Sold out",

    "        </span>",

    "      {% endunless %}",

    "",

    "    </div>",

    "",

    '    <div class="product-card__content">',

    "",

    '      {% if card_product.vendor != blank %}',

    '        <p class="product-card__vendor">',

    "          {{ card_product.vendor | escape }}",

    "        </p>",

    "      {% endif %}",

    "",

    '      <h3 class="product-card__title">',

    "        {{ card_product.title | escape }}",

    "      </h3>",

    "",

    "      {% render 'product-price', product: card_product %}",

    "",

    "    </div>",

    "",

    "  </a>",

    "",

    '  <div class="product-card__actions">',

    "",

    "    {% if card_product.available %}",

    "",

    '      <form',

    '        method="post"',

    '        action="{{ routes.cart_add_url }}"',

    '        class="product-card__quick-add"',

    '        data-product-form',

    "      >",

    "",

    '        <input',

    '          type="hidden"',

    '          name="id"',

    '          value="{{ card_product.selected_or_first_available_variant.id }}"',

    "        >",

    "",

    '        <input',

    '          type="hidden"',

    '          name="quantity"',

    '          value="1"',

    "        >",

    "",

    '        <button',

    '          type="submit"',

    '          class="button button--full-width"',

    '          data-add-to-cart',

    "        >",

    "          Add to cart",

    "        </button>",

    "",

    "      </form>",

    "",

    "    {% else %}",

    "",

    '      <button',

    '        type="button"',

    '        class="button button--full-width button--disabled"',

    '        disabled',

    "      >",

    "        Sold out",

    "      </button>",

    "",

    "    {% endif %}",

    "",

    "  </div>",

    "",

    "</article>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Product Media
|--------------------------------------------------------------------------
*/

const buildProductMediaSnippet = () => {

  return joinLines([

    liquidComment(
      "StoreForge AI Product Media"
    ),

    '<div class="product-media"',

    '     data-product-media>',

    "",

    "  {% for media in product.media %}",

    "",

    '    <div',

    '      class="product-media__item{% if forloop.first %} is-active{% endif %}"',

    '      data-media-id="{{ media.id }}"',

    '      data-media-type="{{ media.media_type }}"',

    "    >",


    "",

    "      {% case media.media_type %}",

    "",

    "        {% when 'image' %}",

    "",

    "          {{ media | image_url: width: 1600 | image_tag:",

    '            class: "product-media__image",',

    '            loading: "lazy",',

    '            widths: "400, 600, 800, 1000, 1200, 1600",',

    '            sizes: "(min-width: 990px) 60vw, 100vw"',

    "          }}",

    "",

    "        {% when 'video' %}",

    "",

    "          {{ media | media_tag:",

    "            image_size: '1200x',",

    "            autoplay: false,",

    "            loop: true,",

    "            controls: true,",

    "            preload: 'metadata'",

    "          }}",

    "",

    "        {% when 'external_video' %}",

    "",

    "          {{ media | external_video_tag }}",

    "",

    "        {% when 'model' %}",

    "",

    "          {{ media | model_viewer_tag:",

    "            image_size: '1200x',",

    "            reveal: 'interaction',",

    "            toggleable: true",

    "          }}",

    "",

    "      {% endcase %}",

    "",

    "    </div>",

    "",

    "  {% endfor %}",

    "",

    "</div>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Product Form
|--------------------------------------------------------------------------
*/

const buildProductFormSnippet = () => {

  return joinLines([

    liquidComment(
      "StoreForge AI Product Form"
    ),

    '{% form "product", product, id: "ProductForm-" | append: section.id, class: "product-form", novalidate: "novalidate", data-product-form: "" %}',

    "",

    '  <input',

    '    type="hidden"',

    '    name="id"',

    '    value="{{ product.selected_or_first_available_variant.id }}"',

    '    data-product-variant-id',

    "  >",


    "",

    "  {% unless product.has_only_default_variant %}",

    "",

    '    <div class="product-form__variants">',

    "",

    "      {% for option in product.options_with_values %}",

    "",

    '        <fieldset',

    '          class="product-form__option"',

    '          data-option-index="{{ forloop.index0 }}"',

    "        >",


    "",

    '          <legend class="product-form__option-label">',

    "            {{ option.name | escape }}",

    "          </legend>",

    "",

    '          <div class="product-form__option-values">',

    "",

    "            {% for value in option.values %}",

    "",

    "              {% assign option_id = 'option-' | append: section.id | append: '-' | append: forloop.parentloop.index0 | append: '-' | append: forloop.index0 %}",

    "",

    "              <input",

    '                type="radio"',

    '                id="{{ option_id }}"',

    '                name="options[{{ option.name | escape }}]"',

    '                value="{{ value | escape }}"',

    '                {% if option.selected_value == value %}checked{% endif %}',

    '                data-option-value',

    "              >",


    "",

    "              <label",

    '                for="{{ option_id }}"',

    '                class="product-form__option-value"',

    "              >",

    "                {{ value | escape }}",

    "              </label>",

    "",

    "            {% endfor %}",

    "",

    "          </div>",

    "",

    "        </fieldset>",

    "",

    "      {% endfor %}",

    "",

    "    </div>",

    "",

    "  {% endunless %}",

    "",

    '  <div class="product-form__quantity">',

    "",

    '    <label',

    '      for="Quantity-{{ section.id }}"',

    '      class="product-form__label"',

    "    >",

    "      Quantity",

    "    </label>",

    "",

    '    <div class="quantity-selector">',

    "",

    "      <button",

    '        type="button"',

    '        class="quantity-selector__button"',

    '        data-quantity-minus',

    '        aria-label="Decrease quantity"',

    "      >",

    "        −",

    "      </button>",

    "",

    "      <input",

    '        id="Quantity-{{ section.id }}"',

    '        type="number"',

    '        name="quantity"',

    '        value="1"',

    '        min="1"',

    '        step="1"',

    '        inputmode="numeric"',

    '        class="quantity-selector__input"',

    '        data-quantity-input',

    "      >",


    "",

    "      <button",

    '        type="button"',

    '        class="quantity-selector__button"',

    '        data-quantity-plus',

    '        aria-label="Increase quantity"',

    "      >",

    "        +",

    "      </button>",

    "",

    "    </div>",

    "",

    "  </div>",

    "",

    '  <div class="product-form__actions">',

    "",

    "    {% if product.selected_or_first_available_variant.available %}",

    "",

    "      <button",

    '        type="submit"',

    '        name="add"',

    '        class="button button--primary button--full-width"',

    '        data-add-to-cart',

    "      >",

    "        <span data-add-to-cart-text>",

    "          Add to cart",

    "        </span>",

    "      </button>",

    "",

    "    {% else %}",

    "",

    "      <button",

    '        type="button"',

    '        class="button button--disabled button--full-width"',

    '        disabled',

    "      >",

    "        Sold out",

    "      </button>",

    "",

    "    {% endif %}",

    "",

    "  </div>",

    "",

    "  <div",

    '    class="product-form__error"',

    '    data-product-form-error',

    '    role="alert"',

    '    hidden',

    "></div>",

    "",

    "{% endform %}"

  ]);

};


/*
|--------------------------------------------------------------------------
| Main Product Section
|--------------------------------------------------------------------------
*/

const buildMainProductSection = (
  context
) => {

  const schema = {

    name:
      "Main product",

    settings: [

      settingSchema(
        "show_vendor",
        "checkbox",
        "Show vendor",
        true
      ),

      settingSchema(
        "show_description",
        "checkbox",
        "Show description",
        true
      ),

      settingSchema(
        "show_sku",
        "checkbox",
        "Show SKU",
        true
      ),

      settingSchema(
        "show_share",
        "checkbox",
        "Show sharing",
        true
      ),

      settingSchema(
        "enable_sticky_info",
        "checkbox",
        "Sticky product information",
        true
      )

    ],

    presets: [

      {
        name:
          "Main product"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Main Product"
    ),

    '<section',

    '  class="main-product page-width{% if section.settings.enable_sticky_info %} main-product--sticky-info{% endif %}"',

    '  data-section-id="{{ section.id }}"',

    '  data-product-id="{{ product.id }}"',

    ">",

    "",

    '  <div class="main-product__grid">',

    "",

    '    <div class="main-product__media-column">',

    "",

    '      {% render "product-media", product: product %}',

    "",

    "    </div>",

    "",

    '    <div class="main-product__info">',

    "",

    "      {% if section.settings.show_vendor and product.vendor != blank %}",

    '        <p class="product__vendor">',

    "          {{ product.vendor | escape }}",

    "        </p>",

    "      {% endif %}",

    "",

    '      <h1 class="product__title">',

    "        {{ product.title | escape }}",

    "      </h1>",

    "",

    "      <div class=\"product__price\" data-product-price-container>",

    "        {% render 'product-price', product: product %}",

    "      </div>",

    "",

    "      {% if section.settings.show_sku and product.selected_or_first_available_variant.sku != blank %}",

    '        <p class="product__sku">',

    "          SKU: ",

    "          <span data-product-sku>",

    "            {{ product.selected_or_first_available_variant.sku | escape }}",

    "          </span>",

    "        </p>",

    "      {% endif %}",

    "",

    "      {% if section.settings.show_description and product.description != blank %}",

    '        <div class="product__description rte">',

    "          {{ product.description }}",

    "        </div>",

    "      {% endif %}",

    "",

    "      {% render 'product-form', product: product %}",

    "",

    "      {% if section.settings.show_share %}",

    '        <div class="product__share">',

    '          <span class="product__share-label">Share:</span>',

    '          <a href="https://www.facebook.com/sharer/sharer.php?u={{ shop.url | append: product.url | url_encode }}"',

    '             target="_blank"',

    '             rel="noopener noreferrer">',

    "            Facebook",

    "          </a>",

    '          <a href="https://twitter.com/intent/tweet?url={{ shop.url | append: product.url | url_encode }}&text={{ product.title | url_encode }}"',

    '             target="_blank"',

    '             rel="noopener noreferrer">',

    "            X",

    "          </a>",

    "        </div>",

    "      {% endif %}",

    "",

    "    </div>",

    "",

    "  </div>",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</section>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Product Recommendations Section
|--------------------------------------------------------------------------
*/

const buildProductRecommendationsSection = (
  context
) => {

  const schema = {

    name:
      "Product recommendations",

    settings: [

      settingSchema(
        "heading",
        "text",
        "Heading",
        "You may also like"
      ),

      settingSchema(
        "products_to_show",
        "range",
        "Products to show",
        4,
        {
          min:
            2,

          max:
            8,

          step:
            1
        }
      )

    ],

    presets: [

      {
        name:
          "Product recommendations"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Product Recommendations"
    ),

    '<section',

    '  class="product-recommendations page-width"',

    '  data-section-id="{{ section.id }}"',

    '  data-product-recommendations',

    '  data-product-id="{{ product.id }}"',

    '  data-limit="{{ section.settings.products_to_show }}"',

    ">",

    "",

    '  <h2 class="section-heading">',

    "    {{ section.settings.heading | escape }}",

    "  </h2>",

    "",

    '  <div class="product-grid product-grid--4"',

    '       data-recommendation-grid>',

    "",

    "    {% if recommendations.performed %}",

    "",

    "      {% for recommendation in recommendations.products limit: section.settings.products_to_show %}",

    "",

    "        {% render 'product-card', product: recommendation %}",

    "",

    "      {% endfor %}",

    "",

    "    {% endif %}",

    "",

    "  </div>",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</section>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Collection Product Grid
|--------------------------------------------------------------------------
*/

const buildCollectionProductGridSection = (
  context
) => {

  const schema = {

    name:
      "Collection product grid",

    settings: [

      settingSchema(
        "products_per_page",
        "range",
        "Products per page",
        24,
        {
          min:
            8,

          max:
            48,

          step:
            4
        }
      ),

      settingSchema(
        "columns_desktop",
        "range",
        "Desktop columns",
        4,
        {
          min:
            2,

          max:
            5,

          step:
            1
        }
      ),

      settingSchema(
        "show_sort",
        "checkbox",
        "Show sorting",
        true
      ),

      settingSchema(
        "show_filters",
        "checkbox",
        "Show filters",
        true
      )

    ],

    presets: [

      {
        name:
          "Collection product grid"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Collection Product Grid"
    ),

    '<section',

    '  class="collection-products page-width"',

    '  data-section-id="{{ section.id }}"',

    ">",

    "",

    '  <div class="collection-products__header">',

    "",

    "    {% if collection.title != blank %}",

    '      <h1 class="collection-products__title">',

    "        {{ collection.title | escape }}",

    "      </h1>",

    "    {% endif %}",

    "",

    "    {% if collection.description != blank %}",

    '      <div class="collection-products__description rte">',

    "        {{ collection.description }}",

    "      </div>",

    "    {% endif %}",

    "",

    "  </div>",

    "",

    '  <div class="collection-products__toolbar">',

    "",

    "    {% if section.settings.show_filters and collection.filters.size > 0 %}",

    '      <button',

    '        type="button"',

    '        class="button button--secondary"',

    '        data-filter-toggle',

    "      >",

    "        Filter",

    "      </button>",

    "    {% endif %}",

    "",

    "    {% if section.settings.show_sort %}",

    "",

    '      <form method="get" class="collection-sort">',

    "",

    '        <label for="SortBy">Sort by</label>',

    "",

    "        <select",

    '          id="SortBy"',

    '          name="sort_by"',

    '          data-collection-sort',

    "        >",

    "",

    "          {% assign sort_by = collection.sort_by | default: collection.default_sort_by %}",

    "",

    "          {% for option in collection.sort_options %}",

    "",

    "            <option",

    '              value="{{ option.value }}"',

    '              {% if option.value == sort_by %}selected{% endif %}',

    "            >",

    "              {{ option.name | escape }}",

    "            </option>",

    "",

    "          {% endfor %}",

    "",

    "        </select>",

    "",

    "      </form>",

    "",

    "    {% endif %}",

    "",

    "  </div>",

    "",

    "  {% paginate collection.products by section.settings.products_per_page %}",

    "",

    '    <div',

    '      class="product-grid product-grid--{{ section.settings.columns_desktop }}"',

    '      data-product-grid',

    "    >",


    "",

    "      {% for product in collection.products %}",

    "",

    "        {% render 'product-card', product: product %}",

    "",

    "      {% else %}",

    "",

    '        <div class="collection-empty">',

    "          <h2>No products found</h2>",

    "          <p>Try changing your filters or search terms.</p>",

    "        </div>",

    "",

    "      {% endfor %}",

    "",

    "    </div>",

    "",

    "    {% if paginate.pages > 1 %}",

    "",

    '      <nav class="pagination" aria-label="Pagination">',

    "",

    "        {{ paginate | default_pagination }}",

    "",

    "      </nav>",

    "",

    "    {% endif %}",

    "",

    "  {% endpaginate %}",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</section>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Generate Product Files
|--------------------------------------------------------------------------
*/

const generateProductFiles = (
  context
) => {

  addLiquidFile(

    context,

    "snippets/product-price.liquid",

    buildProductPriceSnippet()

  );


  addLiquidFile(

    context,

    "snippets/price.liquid",

    buildPriceSnippet()

  );


  addLiquidFile(

    context,

    "snippets/product-card.liquid",

    buildProductCardSnippet()

  );


  addLiquidFile(

    context,

    "snippets/product-media.liquid",

    buildProductMediaSnippet()

  );


  addLiquidFile(

    context,

    "snippets/product-form.liquid",

    buildProductFormSnippet()

  );


  addLiquidFile(

    context,

    "sections/main-product.liquid",

    buildMainProductSection(
      context
    )

  );


  addLiquidFile(

    context,

    "sections/product-recommendations.liquid",

    buildProductRecommendationsSection(
      context
    )

  );


  addLiquidFile(

    context,

    "sections/main-collection-product-grid.liquid",

    buildCollectionProductGridSection(
      context
    )

  );


  return context;

};


/*
|--------------------------------------------------------------------------
| Part 4 Complete
|--------------------------------------------------------------------------
|
| Product architecture is now generated with:
|
| ✓ Product cards
| ✓ Sale pricing
| ✓ Compare-at pricing
| ✓ Savings
| ✓ Product media
| ✓ Image / video / 3D media
| ✓ Variant selectors
| ✓ Quantity controls
| ✓ Add-to-cart form
| ✓ Sold-out handling
| ✓ Product SKU
| ✓ Product sharing
| ✓ Collection product grid
| ✓ Collection sorting
| ✓ Pagination
| ✓ Product recommendations
|
|--------------------------------------------------------------------------
| Part 5
|--------------------------------------------------------------------------
|
| Next:
|
| - Cart drawer
| - Cart page
| - AJAX cart
| - Cart quantity updates
| - Remove item
| - Cart notes
| - Discount code support
| - Dynamic cart totals
| - Checkout flow
|
|--------------------------------------------------------------------------
*/
 /*
 |--------------------------------------------------------------------------
 | PART 5 / 10
 | Cart System
 |--------------------------------------------------------------------------
 |
 | Generates:
 |
 | - snippets/cart-line-item.liquid
 | - snippets/cart-drawer.liquid
 | - sections/main-cart.liquid
 | - sections/cart-items.liquid
 | - sections/cart-footer.liquid
 | - sections/cart-drawer.liquid
 |
 | Supports:
 |
 | - Cart items
 | - Quantity updates
 | - Remove item
 | - Cart notes
 | - Dynamic totals
 | - Discount input
 | - Checkout
 | - Empty cart
 | - AJAX hooks
 |
 |--------------------------------------------------------------------------
 */


/*
 |--------------------------------------------------------------------------
 | Cart Line Item
 |--------------------------------------------------------------------------
 */

const buildCartLineItemSnippet = () => {

  return joinLines([

    liquidComment(
      "StoreForge AI Cart Line Item"
    ),

    '<article',

    '  class="cart-item"',

    '  data-cart-item',

    '  data-line="{{ forloop.index }}"',

    '  data-variant-id="{{ item.variant_id }}"',

    '  data-key="{{ item.key }}"',

    ">",

    "",

    '  <div class="cart-item__media">',

    "",

    "    {% if item.image != blank %}",

    "",

    "      <a",

    '        href="{{ item.url }}"',

    '        class="cart-item__image-link"',

    '        aria-label="{{ item.product.title | escape }}"',

    "      >",

    "",

    "        {{ item.image | image_url: width: 400 | image_tag:",

    '          class: "cart-item__image",',

    '          loading: "lazy",',

    '          widths: "120, 200, 300, 400",',

    '          sizes: "120px"',

    "        }}",

    "",

    "      </a>",

    "",

    "    {% endif %}",

    "",

    "  </div>",

    "",

    '  <div class="cart-item__details">',

    "",

    '    <h3 class="cart-item__title">',

    '      <a href="{{ item.url }}">',

    "        {{ item.product.title | escape }}",

    "      </a>",

    "    </h3>",

    "",

    "    {% unless item.product.has_only_default_variant %}",

    "",

    '      <dl class="cart-item__options">',

    "",

    "        {% for option in item.options_with_values %}",

    "",

    "          <div>",

    '            <dt>{{ option.name | escape }}:</dt>',

    '            <dd>{{ option.value | escape }}</dd>',

    "          </div>",

    "",

    "        {% endfor %}",

    "",

    "      </dl>",

    "",

    "    {% endunless %}",

    "",

    "    {% if item.selling_plan_allocation != blank %}",

    '      <p class="cart-item__selling-plan">',

    "        {{ item.selling_plan_allocation.selling_plan.name | escape }}",

    "      </p>",

    "    {% endif %}",

    "",

    "    {% if item.properties != empty %}",

    "",

    '      <dl class="cart-item__properties">',

    "",

    "        {% for property in item.properties %}",

    "",

    "          {% assign property_first_char = property.first | slice: 0 %}",

    "",

    "          {% unless property.last == blank or property_first_char == '_' %}",

    "",

    "            <div>",

    '              <dt>{{ property.first | escape }}:</dt>',

    "              <dd>",

    "                {% if property.last contains '/uploads/' %}",

    '                  <a href="{{ property.last }}" target="_blank" rel="noopener">',

    "                    {{ property.last | split: '/' | last }}",

    "                  </a>",

    "                {% else %}",

    "                  {{ property.last | escape }}",

    "                {% endif %}",

    "              </dd>",

    "            </div>",

    "",

    "          {% endunless %}",

    "",

    "        {% endfor %}",

    "",

    "      </dl>",

    "",

    "    {% endif %}",

    "",

    '    <div class="cart-item__price">',

    "      {% if item.original_price != item.final_price %}",

    '        <s>{{ item.original_price | money }}</s>',

    "        <span>{{ item.final_price | money }}</span>",

    "      {% else %}",

    "        <span>{{ item.original_price | money }}</span>",

    "      {% endif %}",

    "    </div>",

    "",

    '    <div class="cart-item__controls">',

    "",

    '      <div class="quantity-selector">',

    "",

    "        <button",

    '          type="button"',

    '          class="quantity-selector__button"',

    '          data-cart-quantity-minus',

    '          aria-label="Decrease quantity"',

    "        >",

    "          −",

    "        </button>",

    "",

    "        <input",

    '          type="number"',

    '          name="updates[]"',

    '          value="{{ item.quantity }}"',

    '          min="0"',

    '          step="1"',

    '          inputmode="numeric"',

    '          class="quantity-selector__input"',

    '          data-cart-quantity',

    '          aria-label="Quantity for {{ item.product.title | escape }}"',

    "        >",


    "",

    "        <button",

    '          type="button"',

    '          class="quantity-selector__button"',

    '          data-cart-quantity-plus',

    '          aria-label="Increase quantity"',

    "        >",

    "          +",

    "        </button>",

    "",

    "      </div>",

    "",

    "      <button",

    '        type="button"',

    '        class="cart-item__remove"',

    '        data-cart-remove',

    '        aria-label="Remove {{ item.product.title | escape }}"',

    "      >",

    "        Remove",

    "      </button>",

    "",

    "    </div>",

    "",

    "  </div>",

    "",

    '  <div class="cart-item__total">',

    "",

    "    {% if item.original_line_price != item.final_line_price %}",

    '      <s>{{ item.original_line_price | money }}</s>',

    "      <span>{{ item.final_line_price | money }}</span>",

    "    {% else %}",

    "      <span>{{ item.original_line_price | money }}</span>",

    "    {% endif %}",

    "",

    "  </div>",

    "",

    "</article>"

  ]);

};


/*
 |--------------------------------------------------------------------------
 | Cart Drawer
 |--------------------------------------------------------------------------
 */

const buildCartDrawerSnippet = () => {

  return joinLines([

    liquidComment(
      "StoreForge AI Cart Drawer"
    ),

    '<aside',

    '  id="CartDrawer"',

    '  class="cart-drawer"',

    '  data-cart-drawer',

    '  aria-label="Shopping cart"',

    '  aria-hidden="true"',

    ">",

    "",

    '  <div class="cart-drawer__overlay" data-cart-drawer-close></div>',

    "",

    '  <div class="cart-drawer__panel" role="dialog" aria-modal="true">',

    "",

    '    <div class="cart-drawer__header">',

    "",

    '      <h2 class="cart-drawer__title">',

    "        Your cart",

    "      </h2>",

    "",

    "      <button",

    '        type="button"',

    '        class="cart-drawer__close"',

    '        data-cart-drawer-close',

    '        aria-label="Close cart"',

    "      >",

    "        &times;",

    "      </button>",

    "",

    "    </div>",

    "",

    '    <div class="cart-drawer__body" data-cart-drawer-body>',

    "",

    "      {% if cart.item_count > 0 %}",

    "",

    '        <div class="cart-drawer__items">',

    "",

    "          {% for item in cart.items %}",

    "",

    "            {% render 'cart-line-item', item: item %}",

    "",

    "          {% endfor %}",

    "",

    "        </div>",

    "",

    "      {% else %}",

    "",

    '        <div class="cart-drawer__empty">',

    "",

    "          <h3>Your cart is empty</h3>",

    "",

    "          <p>Discover something you'll love.</p>",

    "",

    '          <a href="{{ routes.all_products_collection_url }}"',

    '             class="button">',

    "            Continue shopping",

    "          </a>",

    "",

    "        </div>",

    "",

    "      {% endif %}",

    "",

    "    </div>",

    "",

    "    {% if cart.item_count > 0 %}",

    "",

    '      <div class="cart-drawer__footer">',

    "",

    '        <div class="cart-drawer__subtotal">',

    "          <span>Subtotal</span>",

    "          <strong data-cart-subtotal>",

    "            {{ cart.total_price | money }}",

    "          </strong>",

    "        </div>",

    "",

    '        <p class="cart-drawer__tax-note">',

    "          Taxes and shipping calculated at checkout.",

    "        </p>",

    "",

    '        <a href="{{ routes.cart_url }}"',

    '           class="button button--secondary button--full-width">',

    "          View cart",

    "        </a>",

    "",

    '        <form action="{{ routes.cart_url }}" method="post">',

    '          <button',

    '            type="submit"',

    '            name="checkout"',

    '            class="button button--primary button--full-width"',

    "          >",

    "            Checkout",

    "          </button>",

    "        </form>",

    "",

    "      </div>",

    "",

    "    {% endif %}",

    "",

    "  </div>",

    "",

    "</aside>"

  ]);

};


/*
 |--------------------------------------------------------------------------
 | Cart Items Section
 |--------------------------------------------------------------------------
 */

const buildCartItemsSection = () => {

  const schema = {

    name:
      "Cart items",

    settings: [

      settingSchema(
        "show_vendor",
        "checkbox",
        "Show vendor",
        false
      )

    ],

    presets: [

      {
        name:
          "Cart items"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Cart Items"
    ),

    '<section',

    '  class="cart-items"',

    '  data-section-id="{{ section.id }}"',

    ">",

    "",

    '  <div data-cart-items>',

    "",

    "    {% if cart.item_count > 0 %}",

    "",

    "      {% for item in cart.items %}",

    "",

    "        {% render 'cart-line-item', item: item %}",

    "",

    "      {% endfor %}",

    "",

    "    {% else %}",

    "",

    '      <div class="cart-items__empty">',

    "        <h2>Your cart is empty</h2>",

    "",

    "        <p>There are currently no products in your cart.</p>",

    "",

    '        <a',

    '          href="{{ routes.all_products_collection_url }}"',

    '          class="button"',

    "        >",

    "          Continue shopping",

    "        </a>",

    "      </div>",

    "",

    "    {% endif %}",

    "",

    "  </div>",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</section>"

  ]);

};


/*
 |--------------------------------------------------------------------------
 | Cart Footer
 |--------------------------------------------------------------------------
 */

const buildCartFooterSection = () => {

  const schema = {

    name:
      "Cart footer",

    settings: [

      settingSchema(
        "show_note",
        "checkbox",
        "Show order note",
        true
      ),

      settingSchema(
        "show_discount",
        "checkbox",
        "Show discount field",
        true
      )

    ],

    presets: [

      {
        name:
          "Cart footer"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Cart Footer"
    ),

    '<section',

    '  class="cart-footer"',

    '  data-section-id="{{ section.id }}"',

    ">",

    "",

    '  <div class="cart-footer__inner">',

    "",

    "    {% if section.settings.show_note %}",

    "",

    '      <div class="cart-note">',

    "",

    '        <label for="CartNote">',

    "          Order note",

    "        </label>",

    "",

    "        <textarea",

    '          id="CartNote"',

    '          name="note"',

    '          rows="4"',

    '          placeholder="Add a note to your order..."',

    '          data-cart-note',

    "        >{{ cart.note }}</textarea>",

    "",

    "      </div>",

    "",

    "    {% endif %}",

    "",

    "    {% if section.settings.show_discount %}",

    "",

    '      <div class="cart-discount">',

    "",

    '        <label for="CartDiscount">',

    "          Discount code",

    "        </label>",

    "",

    '        <div class="cart-discount__field">',

    "",

    "          <input",

    '            id="CartDiscount"',

    '            type="text"',

    '            name="discount"',

    '            placeholder="Discount code"',

    '            autocomplete="off"',

    '            data-cart-discount',

    "          >",


    "",

    "          <button",

    '            type="button"',

    '            class="button button--secondary"',

    '            data-apply-discount',

    "          >",

    "            Apply",

    "          </button>",

    "",

    "        </div>",

    "",

    '        <p class="cart-discount__message"',

    '           data-discount-message',

    '           role="status"',

    '           hidden>',

    "        </p>",

    "",

    "      </div>",

    "",

    "    {% endif %}",

    "",

    '    <div class="cart-footer__summary">',

    "",

    '      <div class="cart-footer__row">',

    "        <span>Subtotal</span>",

    "        <strong data-cart-subtotal>",

    "          {{ cart.total_price | money }}",

    "        </strong>",

    "      </div>",

    "",

    "      {% if cart.cart_level_discount_applications.size > 0 %}",

    "",

    "        {% for discount in cart.cart_level_discount_applications %}",

    "",

    '          <div class="cart-footer__row cart-footer__discount">',

    "            <span>",

    "              {{ discount.title | escape }}",

    "            </span>",

    "            <strong>",

    "              -{{ discount.total_allocated_amount | money }}",

    "            </strong>",

    "          </div>",

    "",

    "        {% endfor %}",

    "",

    "      {% endif %}",

    "",

    '      <p class="cart-footer__tax-note">',

    "        Taxes and shipping calculated at checkout.",

    "      </p>",

    "",

    '      <form',

    '        action="{{ routes.cart_url }}"',

    '        method="post"',

    '        id="CartCheckoutForm"',

    "      >",


    "",

    "        <button",

    '          type="submit"',

    '          name="checkout"',

    '          class="button button--primary button--full-width"',

    "        >",

    "          Checkout",

    "        </button>",

    "",

    "      </form>",

    "",

    "    </div>",

    "",

    "  </div>",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</section>"

  ]);

};


/*
 |--------------------------------------------------------------------------
 | Main Cart Section
 |--------------------------------------------------------------------------
 */

const buildMainCartSection = (
  context
) => {

  const schema = {

    name:
      "Main cart",

    settings: [

      settingSchema(
        "show_note",
        "checkbox",
        "Show order note",
        true
      ),

      settingSchema(
        "show_discount",
        "checkbox",
        "Show discount",
        true
      )

    ],

    presets: [

      {
        name:
          "Main cart"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Main Cart"
    ),

    '<section',

    '  class="main-cart page-width"',

    '  data-section-id="{{ section.id }}"',

    '  data-cart-page',

    ">",

    "",

    '  <div class="main-cart__header">',

    "",

    '    <h1 class="main-cart__title">',

    "      Your cart",

    "    </h1>",

    "",

    "    {% if cart.item_count > 0 %}",

    '      <span class="main-cart__count" data-cart-count>',

    "        {{ cart.item_count }}",

    "      </span>",

    "    {% endif %}",

    "",

    "  </div>",

    "",

    "  {% if cart.item_count > 0 %}",

    "",

    '    <div class="main-cart__layout">',

    "",

    '      <div class="main-cart__items">',

    "",

    "        {% for item in cart.items %}",

    "",

    "          {% render 'cart-line-item', item: item %}",

    "",

    "        {% endfor %}",

    "",

    "      </div>",

    "",

    '      <aside class="main-cart__summary">',

    "",

    '        <h2 class="main-cart__summary-title">',

    "          Order summary",

    "        </h2>",

    "",

    "        {% if section.settings.show_note %}",

    "",

    '          <div class="cart-note">',

    "",

    '            <label for="MainCartNote">',

    "              Order note",

    "            </label>",

    "",

    "            <textarea",

    '              id="MainCartNote"',

    '              rows="4"',

    '              data-cart-note',

    "            >{{ cart.note }}</textarea>",

    "",

    "          </div>",

    "",

    "        {% endif %}",

    "",

    "        {% if section.settings.show_discount %}",

    "",

    '          <div class="cart-discount">',

    '            <label for="MainCartDiscount">',

    "              Discount code",

    "            </label>",

    "",

    '            <div class="cart-discount__field">',

    "",

    "              <input",

    '                id="MainCartDiscount"',

    '                type="text"',

    '                placeholder="Discount code"',

    '                data-cart-discount',

    "              >",


    "",

    "              <button",

    '                type="button"',

    '                class="button button--secondary"',

    '                data-apply-discount',

    "              >",

    "                Apply",

    "              </button>",

    "",

    "            </div>",

    "",

    "          </div>",

    "",

    "        {% endif %}",

    "",

    '        <div class="main-cart__totals">',

    "",

    '          <div class="main-cart__total-row">',

    "            <span>Subtotal</span>",

    "            <strong data-cart-subtotal>",

    "              {{ cart.total_price | money }}",

    "            </strong>",

    "          </div>",

    "",

    "          {% if cart.cart_level_discount_applications.size > 0 %}",

    "",

    "            {% for discount in cart.cart_level_discount_applications %}",

    "",

    '              <div class="main-cart__total-row main-cart__discount">',

    "                <span>",

    "                  {{ discount.title | escape }}",

    "                </span>",

    "                <strong>",

    "                  -{{ discount.total_allocated_amount | money }}",

    "                </strong>",

    "              </div>",

    "",

    "            {% endfor %}",

    "",

    "          {% endif %}",

    "",

    '          <p class="main-cart__tax-note">',

    "            Taxes and shipping calculated at checkout.",

    "          </p>",

    "",

    "        </div>",

    "",

    '        <form',

    '          action="{{ routes.cart_url }}"',

    '          method="post"',

    '          class="main-cart__checkout-form"',

    "        >",

    "",

    "          <button",

    '            type="submit"',

    '            name="checkout"',

    '            class="button button--primary button--full-width"',

    "          >",

    "            Proceed to checkout",

    "          </button>",

    "",

    "        </form>",

    "",

    '        <a',

    '          href="{{ routes.all_products_collection_url }}"',

    '          class="main-cart__continue"',

    "        >",

    "          Continue shopping",

    "        </a>",

    "",

    "      </aside>",

    "",

    "    </div>",

    "",

    "  {% else %}",

    "",

    '    <div class="main-cart__empty">',

    "",

    "      <h2>Your cart is empty</h2>",

    "",

    "      <p>Find something you'll love and add it to your cart.</p>",

    "",

    '      <a',

    '        href="{{ routes.all_products_collection_url }}"',

    '        class="button"',

    "      >",

    "        Start shopping",

    "      </a>",

    "",

    "    </div>",

    "",

    "  {% endif %}",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</section>"

  ]);

};


/*
 |--------------------------------------------------------------------------
 | Cart Drawer Section
 |--------------------------------------------------------------------------
 */

const buildCartDrawerSection = () => {

  const schema = {

    name:
      "Cart drawer",

    settings: [

      settingSchema(
        "enable_drawer",
        "checkbox",
        "Enable cart drawer",
        true
      )

    ],

    presets: [

      {
        name:
          "Cart drawer"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Cart Drawer Section"
    ),

    "{% if section.settings.enable_drawer %}",

    "",

    "  {% render 'cart-drawer' %}",

    "",

    "{% endif %}",

    "",

    buildNativeSectionSchema(
      schema
    )

  ]);

};


/*
 |--------------------------------------------------------------------------
 | AJAX Cart JavaScript
 |--------------------------------------------------------------------------
 */

const buildCartJavascriptAsset = () => {

  return joinLines([

    "/*",

    " * StoreForge AI AJAX Cart",

    " */",

    "",

    "(function () {",

    "  'use strict';",

    "",

    "  const config = window.StoreForge || {};",

    "",

    "  const routes = config.routes || {};",

    "",

    "  const cartEndpoint = routes.cart || '/cart';",

    "",

    "  async function getCart() {",

    "    const response = await fetch(cartEndpoint + '.js', {",

    "      headers: {",

    "        'Accept': 'application/json'",

    "      }",

    "    });",

    "",

    "    if (!response.ok) {",

    "      throw new Error('Unable to load cart.');",

    "    }",

    "",

    "    return response.json();",

    "  }",

    "",

    "  async function addItem(variantId, quantity) {",

    "    const response = await fetch('/cart/add.js', {",

    "      method: 'POST',",

    "      headers: {",

    "        'Content-Type': 'application/json',",

    "        'Accept': 'application/json'",

    "      },",

    "      body: JSON.stringify({",

    "        items: [",

    "          {",

    "            id: Number(variantId),",

    "            quantity: Number(quantity || 1)",

    "          }",

    "        ]",

    "      })",

    "    });",

    "",

    "    if (!response.ok) {",

    "      const error = await response.json().catch(() => ({}));",

    "      throw new Error(error.description || 'Unable to add item.');",

    "    }",

    "",

    "    return response.json();",

    "  }",

    "",

    "  async function updateCart(updates) {",

    "    const response = await fetch('/cart/update.js', {",

    "      method: 'POST',",

    "      headers: {",

    "        'Content-Type': 'application/json',",

    "        'Accept': 'application/json'",

    "      },",

    "      body: JSON.stringify({",

    "        updates",

    "      })",

    "    });",

    "",

    "    if (!response.ok) {",

    "      throw new Error('Unable to update cart.');",

    "    }",

    "",

    "    return response.json();",

    "  }",

    "",

    "  function updateCartCount(cart) {",

    "    document.querySelectorAll('[data-cart-count]').forEach(function (element) {",

    "      element.textContent = cart.item_count;",

    "    });",

    "  }",

    "",

    "  function updateSubtotal(cart) {",

    "    const formatted = new Intl.NumberFormat(undefined, {",

    "      style: 'currency',",

    "      currency: cart.currency || 'USD'",

    "    }).format(cart.total_price / 100);",

    "",

    "    document.querySelectorAll('[data-cart-subtotal]').forEach(function (element) {",

    "      element.textContent = formatted;",

    "    });",

    "  }",

    "",

    "  function refreshCartUI(cart) {",

    "    updateCartCount(cart);",

    "    updateSubtotal(cart);",

    "",

    "    document.dispatchEvent(new CustomEvent('storeforge:cart-updated', {",

    "      detail: cart",

    "    }));",

    "  }",

    "",

    "  async function refreshCart() {",

    "    const cart = await getCart();",

    "    refreshCartUI(cart);",

    "    return cart;",

    "  }",

    "",

    "  async function handleProductForm(form) {",

    "    const submitButton = form.querySelector('[data-add-to-cart]');",

    "    const variantInput = form.querySelector('[name=\"id\"]');",

    "    const quantityInput = form.querySelector('[name=\"quantity\"]');",

    "",

    "    if (!variantInput) return;",

    "",

    "    const originalText = submitButton",

    "      ? submitButton.textContent",

    "      : '';",

    "",

    "    if (submitButton) {",

    "      submitButton.disabled = true;",

    "      submitButton.textContent = 'Adding...';",

    "    }",

    "",

    "    try {",

    "      await addItem(",

    "        variantInput.value,",

    "        quantityInput ? quantityInput.value : 1",

    "      );",

    "",

    "      const cart = await refreshCart();",

    "",

    "      document.dispatchEvent(new CustomEvent('storeforge:cart-add', {",

    "        detail: cart",

    "      }));",

    "",

    "      if (window.StoreForgeCart && window.StoreForgeCart.open) {",

    "        window.StoreForgeCart.open();",

    "      }",

    "    } catch (error) {",

    "      const errorElement = form.querySelector('[data-product-form-error]');",

    "",

    "      if (errorElement) {",

    "        errorElement.hidden = false;",

    "        errorElement.textContent = error.message;",

    "      } else {",

    "        console.error(error);",

    "      }",

    "    } finally {",

    "      if (submitButton) {",

    "        submitButton.disabled = false;",

    "        submitButton.textContent = originalText || 'Add to cart';",

    "      }",

    "    }",

    "  }",

    "",

    "  async function handleQuantityChange(item, quantity) {",

    "    const line = item.dataset.line;",

    "    const key = item.dataset.key;",

    "",

    "    const updates = {};",

    "",

    "    if (key) {",

    "      updates[key] = Math.max(0, Number(quantity));",

    "    } else {",

    "      updates[line] = Math.max(0, Number(quantity));",

    "    }",

    "",

    "    try {",

    "      const cart = await updateCart(updates);",

    "      refreshCartUI(cart);",

    "",

    "      document.dispatchEvent(new CustomEvent('storeforge:cart-render', {",

    "        detail: cart",

    "      }));",

    "    } catch (error) {",

    "      console.error(error);",

    "    }",

    "  }",

    "",

    "  function bindEvents() {",

    "    document.addEventListener('submit', function (event) {",

    "      const form = event.target.closest('[data-product-form]');",

    "",

    "      if (!form) return;",

    "",

    "      event.preventDefault();",

    "      handleProductForm(form);",

    "    });",

    "",

    "    document.addEventListener('click', function (event) {",

    "      const plus = event.target.closest('[data-cart-quantity-plus]');",

    "      const minus = event.target.closest('[data-cart-quantity-minus]');",

    "      const remove = event.target.closest('[data-cart-remove]');",

    "",

    "      if (plus || minus) {",

    "        const item = event.target.closest('[data-cart-item]');",

    "        const input = item && item.querySelector('[data-cart-quantity]');",

    "",

    "        if (!item || !input) return;",

    "",

    "        let quantity = Number(input.value || 1);",

    "",

    "        if (plus) quantity += 1;",

    "        if (minus) quantity = Math.max(0, quantity - 1);",

    "",

    "        input.value = quantity;",

    "        handleQuantityChange(item, quantity);",

    "        return;",

    "      }",

    "",

    "      if (remove) {",

    "        const item = remove.closest('[data-cart-item]');",

    "",

    "        if (!item) return;",

    "",

    "        handleQuantityChange(item, 0);",

    "      }",

    "    });",

    "",

    "    document.addEventListener('change', function (event) {",

    "      const input = event.target.closest('[data-cart-quantity]');",

    "",

    "      if (!input) return;",

    "",

    "      const item = input.closest('[data-cart-item]');",

    "",

    "      if (!item) return;",

    "",

    "      handleQuantityChange(item, input.value);",

    "    });",

    "  }",

    "",

    "  window.StoreForgeCart = {",

    "    get: getCart,",

    "    add: addItem,",

    "    update: updateCart,",

    "    refresh: refreshCart",

    "  };",

    "",

    "  if (document.readyState === 'loading') {",

    "    document.addEventListener('DOMContentLoaded', bindEvents);",

    "  } else {",

    "    bindEvents();",

    "  }",

    "",

    "})();"

  ]);

};


/*
 |--------------------------------------------------------------------------
 | Generate Cart Files
 |--------------------------------------------------------------------------
 */

const generateCartFiles = (
  context
) => {

  addLiquidFile(

    context,

    "snippets/cart-line-item.liquid",

    buildCartLineItemSnippet()

  );


  addLiquidFile(

    context,

    "snippets/cart-drawer.liquid",

    buildCartDrawerSnippet()

  );


  addLiquidFile(

    context,

    "sections/cart-items.liquid",

    buildCartItemsSection()

  );


  addLiquidFile(

    context,

    "sections/cart-footer.liquid",

    buildCartFooterSection()

  );


  addLiquidFile(

    context,

    "sections/main-cart.liquid",

    buildMainCartSection(
      context
    )

  );


  addLiquidFile(

    context,

    "sections/cart-drawer.liquid",

    buildCartDrawerSection()

  );


  addAssetFile(

    context,

    "assets/cart.js",

    buildCartJavascriptAsset()

  );


  return context;

};


/*
 |--------------------------------------------------------------------------
 | Part 5 Complete
 |--------------------------------------------------------------------------
 |
 | Cart system now contains:
 |
 | ✓ Cart drawer
 | ✓ Cart page
 | ✓ Cart line items
 | ✓ Product image
 | ✓ Variant information
 | ✓ Quantity + / -
 | ✓ Remove item
 | ✓ AJAX add-to-cart
 | ✓ AJAX cart update
 | ✓ Dynamic cart count
 | ✓ Dynamic subtotal
 | ✓ Cart notes
 | ✓ Discount field
 | ✓ Checkout button
 | ✓ Empty cart state
 | ✓ Cart events
 | ✓ Product-form integration
 |
 |--------------------------------------------------------------------------
 | Part 6
 |--------------------------------------------------------------------------
 |
 | Next:
 |
 | - Homepage JSON templates
 | - Product JSON template
 | - Collection JSON template
 | - Cart JSON template
 | - Search template
 | - Page template
 | - Blog/article templates
 | - 404 template
 |
 |--------------------------------------------------------------------------
 */
/*
|--------------------------------------------------------------------------
| PART 6 / 10
| JSON Templates + Page Architecture
|--------------------------------------------------------------------------
|
| Generates:
|
| - templates/index.json
| - templates/product.json
| - templates/collection.json
| - templates/cart.json
| - templates/search.json
| - templates/page.json
| - templates/page.contact.json
| - templates/blog.json
| - templates/article.json
| - templates/404.json
| - templates/list-collections.json
|
| The templates connect generated sections into a real Shopify OS 2.0
| theme architecture.
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Safe JSON Serializer
|--------------------------------------------------------------------------
*/

const stringifyThemeJSON = (
  value
) => {

  return JSON.stringify(
    value,
    null,
    2
  );

};


/*
|--------------------------------------------------------------------------
| Generic Template Builder
|--------------------------------------------------------------------------
*/

const buildJSONTemplate = ({
  sections = {},
  order = [],
  wrapper = "template"
} = {}) => {

  const template = {

    sections,

    order

  };


  if (wrapper) {

    template.wrapper =
      wrapper;

  }


  return stringifyThemeJSON(
    template
  );

};


/*
|--------------------------------------------------------------------------
| Homepage Template
|--------------------------------------------------------------------------
*/

const buildIndexJSONTemplate = () => {

  return buildJSONTemplate({

    sections: {

      announcement_bar: {

        type:
          "announcement-bar",

        settings: {}

      },

      header: {

        type:
          "header",

        settings: {}

      },

      hero: {

        type:
          "hero",

        blocks: {},

        block_order: [],

        settings: {

          heading:
            "Welcome to our store",

          text:
            "Discover products you'll love.",

          button_label:
            "Shop now"

        }

      },

      featured_collection: {

        type:
          "featured-collection",

        settings: {

          heading:
            "Featured products",

          products_to_show:
            8

        }

      },

      image_with_text: {

        type:
          "image-with-text",

        settings: {}

      },

      testimonials: {

        type:
          "testimonials",

        blocks: {},

        block_order: [],

        settings: {}

      },

      newsletter: {

        type:
          "newsletter",

        settings: {}

      },

      footer: {

        type:
          "footer",

        settings: {}

      },

      cart_drawer: {

        type:
          "cart-drawer",

        settings: {

          enable_drawer:
            true

        }

      }

    },

    order: [

      "announcement_bar",

      "header",

      "hero",

      "featured_collection",

      "image_with_text",

      "testimonials",

      "newsletter",

      "footer",

      "cart_drawer"

    ]

  });

};


/*
|--------------------------------------------------------------------------
| Product Template
|--------------------------------------------------------------------------
*/

const buildProductJSONTemplate = () => {

  return buildJSONTemplate({

    sections: {

      header: {

        type:
          "header",

        settings: {}

      },

      main: {

        type:
          "main-product",

        blocks: {},

        block_order: [],

        settings: {

          show_vendor:
            true,

          show_description:
            true,

          show_sku:
            true,

          show_share:
            true,

          enable_sticky_info:
            true

        }

      },

      recommendations: {

        type:
          "product-recommendations",

        settings: {

          heading:
            "You may also like",

          products_to_show:
            4

        }

      },

      newsletter: {

        type:
          "newsletter",

        settings: {}

      },

      footer: {

        type:
          "footer",

        settings: {}

      },

      cart_drawer: {

        type:
          "cart-drawer",

        settings: {

          enable_drawer:
            true

        }

      }

    },

    order: [

      "header",

      "main",

      "recommendations",

      "newsletter",

      "footer",

      "cart_drawer"

    ]

  });

};


/*
|--------------------------------------------------------------------------
| Collection Template
|--------------------------------------------------------------------------
*/

const buildCollectionJSONTemplate = () => {

  return buildJSONTemplate({

    sections: {

      header: {

        type:
          "header",

        settings: {}

      },

      collection_banner: {

        type:
          "collection-banner",

        settings: {

          show_image:
            true,

          show_description:
            true

        }

      },

      main: {

        type:
          "main-collection-product-grid",

        settings: {

          products_per_page:
            24,

          columns_desktop:
            4,

          show_sort:
            true,

          show_filters:
            true

        }

      },

      newsletter: {

        type:
          "newsletter",

        settings: {}

      },

      footer: {

        type:
          "footer",

        settings: {}

      },

      cart_drawer: {

        type:
          "cart-drawer",

        settings: {

          enable_drawer:
            true

        }

      }

    },

    order: [

      "header",

      "collection_banner",

      "main",

      "newsletter",

      "footer",

      "cart_drawer"

    ]

  });

};


/*
|--------------------------------------------------------------------------
| Cart Template
|--------------------------------------------------------------------------
*/

const buildCartJSONTemplate = () => {

  return buildJSONTemplate({

    sections: {

      header: {

        type:
          "header",

        settings: {}

      },

      main: {

        type:
          "main-cart",

        settings: {

          show_note:
            true,

          show_discount:
            true

        }

      },

      footer: {

        type:
          "footer",

        settings: {}

      }

    },

    order: [

      "header",

      "main",

      "footer"

    ]

  });

};


/*
|--------------------------------------------------------------------------
| Search Template
|--------------------------------------------------------------------------
*/

const buildSearchJSONTemplate = () => {

  return buildJSONTemplate({

    sections: {

      header: {

        type:
          "header",

        settings: {}

      },

      search_results: {

        type:
          "search-results",

        settings: {

          products_per_page:
            24,

          columns_desktop:
            4,

          show_filters:
            true,

          show_sort:
            true

        }

      },

      footer: {

        type:
          "footer",

        settings: {}

      },

      cart_drawer: {

        type:
          "cart-drawer",

        settings: {

          enable_drawer:
            true

        }

      }

    },

    order: [

      "header",

      "search_results",

      "footer",

      "cart_drawer"

    ]

  });

};


/*
|--------------------------------------------------------------------------
| Standard Page Template
|--------------------------------------------------------------------------
*/

const buildPageJSONTemplate = () => {

  return buildJSONTemplate({

    sections: {

      header: {

        type:
          "header",

        settings: {}

      },

      main: {

        type:
          "main-page",

        settings: {

          show_title:
            true,

          width:
            "narrow"

        }

      },

      newsletter: {

        type:
          "newsletter",

        settings: {}

      },

      footer: {

        type:
          "footer",

        settings: {}

      }

    },

    order: [

      "header",

      "main",

      "newsletter",

      "footer"

    ]

  });

};


/*
|--------------------------------------------------------------------------
| Contact Page Template
|--------------------------------------------------------------------------
*/

const buildContactJSONTemplate = () => {

  return buildJSONTemplate({

    sections: {

      header: {

        type:
          "header",

        settings: {}

      },

      contact: {

        type:
          "contact-form",

        settings: {

          heading:
            "Contact us",

          show_phone:
            true,

          show_address:
            true

        }

      },

      footer: {

        type:
          "footer",

        settings: {}

      }

    },

    order: [

      "header",

      "contact",

      "footer"

    ]

  });

};


/*
|--------------------------------------------------------------------------
| Blog Template
|--------------------------------------------------------------------------
*/

const buildBlogJSONTemplate = () => {

  return buildJSONTemplate({

    sections: {

      header: {

        type:
          "header",

        settings: {}

      },

      blog: {

        type:
          "main-blog",

        settings: {

          posts_per_page:
            12,

          show_excerpt:
            true,

          show_image:
            true

        }

      },

      newsletter: {

        type:
          "newsletter",

        settings: {}

      },

      footer: {

        type:
          "footer",

        settings: {}

      }

    },

    order: [

      "header",

      "blog",

      "newsletter",

      "footer"

    ]

  });

};


/*
|--------------------------------------------------------------------------
| Article Template
|--------------------------------------------------------------------------
*/

const buildArticleJSONTemplate = () => {

  return buildJSONTemplate({

    sections: {

      header: {

        type:
          "header",

        settings: {}

      },

      article: {

        type:
          "main-article",

        settings: {

          show_author:
            true,

          show_date:
            true,

          show_share:
            true

        }

      },

      related: {

        type:
          "related-articles",

        settings: {

          heading:
            "Related articles",

          articles_to_show:
            3

        }

      },

      newsletter: {

        type:
          "newsletter",

        settings: {}

      },

      footer: {

        type:
          "footer",

        settings: {}

      }

    },

    order: [

      "header",

      "article",

      "related",

      "newsletter",

      "footer"

    ]

  });

};


/*
|--------------------------------------------------------------------------
| 404 Template
|--------------------------------------------------------------------------
*/

const build404JSONTemplate = () => {

  return buildJSONTemplate({

    sections: {

      header: {

        type:
          "header",

        settings: {}

      },

      not_found: {

        type:
          "404",

        settings: {

          heading:
            "Page not found",

          text:
            "The page you're looking for doesn't exist or may have moved."

        }

      },

      footer: {

        type:
          "footer",

        settings: {}

      }

    },

    order: [

      "header",

      "not_found",

      "footer"

    ]

  });

};


/*
|--------------------------------------------------------------------------
| Collections List Template
|--------------------------------------------------------------------------
*/

const buildListCollectionsJSONTemplate = () => {

  return buildJSONTemplate({

    sections: {

      header: {

        type:
          "header",

        settings: {}

      },

      collections: {

        type:
          "main-list-collections",

        settings: {

          columns_desktop:
            3,

          show_description:
            true

        }

      },

      footer: {

        type:
          "footer",

        settings: {}

      }

    },

    order: [

      "header",

      "collections",

      "footer"

    ]

  });

};


/*
|--------------------------------------------------------------------------
| Password Template
|--------------------------------------------------------------------------
*/

const buildPasswordJSONTemplate = () => {

  return buildJSONTemplate({

    sections: {

      password_header: {

        type:
          "password-header",

        settings: {}

      },

      password_content: {

        type:
          "password-content",

        settings: {

          heading:
            "Opening soon",

          show_social:
            true

        }

      },

      newsletter: {

        type:
          "newsletter",

        settings: {}

      }

    },

    order: [

      "password_header",

      "password_content",

      "newsletter"

    ]

  });

};


/*
|--------------------------------------------------------------------------
| Gift Card Template
|--------------------------------------------------------------------------
*/

const buildGiftCardJSONTemplate = () => {

  return buildJSONTemplate({

    sections: {

      gift_card: {

        type:
          "gift-card",

        settings: {

          show_qr:
            true,

          show_print:
            true

        }

      }

    },

    order: [

      "gift_card"

    ]

  });

};


/*
|--------------------------------------------------------------------------
| Robots / Metadata Configuration
|--------------------------------------------------------------------------
*/

const buildTemplateMetadata = () => {

  return {

    generated_by:
      "StoreForge AI",

    generator_version:
      "1.0.0",

    architecture:
      "Shopify Online Store 2.0",

    responsive:
      true,

    accessibility:
      true,

    ajax_cart:
      true,

    product_recommendations:
      true,

    dynamic_sections:
      true

  };

};


/*
|--------------------------------------------------------------------------
| Generate JSON Template Files
|--------------------------------------------------------------------------
*/

const generateTemplateFiles = (
  context
) => {

  addThemeFile(

    context,

    "templates/index.json",

    buildIndexJSONTemplate()

  );


  addThemeFile(

    context,

    "templates/product.json",

    buildProductJSONTemplate()

  );


  addThemeFile(

    context,

    "templates/collection.json",

    buildCollectionJSONTemplate()

  );


  addThemeFile(

    context,

    "templates/cart.json",

    buildCartJSONTemplate()

  );


  addThemeFile(

    context,

    "templates/search.json",

    buildSearchJSONTemplate()

  );


  addThemeFile(

    context,

    "templates/page.json",

    buildPageJSONTemplate()

  );


  addThemeFile(

    context,

    "templates/page.contact.json",

    buildContactJSONTemplate()

  );


  addThemeFile(

    context,

    "templates/blog.json",

    buildBlogJSONTemplate()

  );


  addThemeFile(

    context,

    "templates/article.json",

    buildArticleJSONTemplate()

  );


  addThemeFile(

    context,

    "templates/404.json",

    build404JSONTemplate()

  );


  addThemeFile(

    context,

    "templates/list-collections.json",

    buildListCollectionsJSONTemplate()

  );


  addThemeFile(

    context,

    "templates/password.json",

    buildPasswordJSONTemplate()

  );


  addThemeFile(

    context,

    "templates/gift_card.json",

    buildGiftCardJSONTemplate()

  );


  context.metadata =
    context.metadata || {};


  context.metadata.templates =
    buildTemplateMetadata();


  return context;

};


/*
|--------------------------------------------------------------------------
| Template Registry
|--------------------------------------------------------------------------
|
| This registry lets the AI engine know which Shopify template is intended
| for each page type.
|
|--------------------------------------------------------------------------
*/

const TEMPLATE_REGISTRY = {

  home: {

    file:
      "templates/index.json",

    type:
      "index"

  },

  product: {

    file:
      "templates/product.json",

    type:
      "product"

  },

  collection: {

    file:
      "templates/collection.json",

    type:
      "collection"

  },

  cart: {

    file:
      "templates/cart.json",

    type:
      "cart"

  },

  search: {

    file:
      "templates/search.json",

    type:
      "search"

  },

  page: {

    file:
      "templates/page.json",

    type:
      "page"

  },

  contact: {

    file:
      "templates/page.contact.json",

    type:
      "page.contact"

  },

  blog: {

    file:
      "templates/blog.json",

    type:
      "blog"

  },

  article: {

    file:
      "templates/article.json",

    type:
      "article"

  },

  not_found: {

    file:
      "templates/404.json",

    type:
      "404"

  },

  collections: {

    file:
      "templates/list-collections.json",

    type:
      "list-collections"

  },

  password: {

    file:
      "templates/password.json",

    type:
      "password"

  },

  gift_card: {

    file:
      "templates/gift_card.json",

    type:
      "gift_card"

  }

};


/*
|--------------------------------------------------------------------------
| Template Lookup
|--------------------------------------------------------------------------
*/

const getTemplateDefinition = (
  templateType
) => {

  if (
    !templateType ||
    typeof templateType !== "string"
  ) {

    return TEMPLATE_REGISTRY.home;

  }


  return (

    TEMPLATE_REGISTRY[
      templateType
    ] ||

    TEMPLATE_REGISTRY.home

  );

};


/*
|--------------------------------------------------------------------------
| Template Validation
|--------------------------------------------------------------------------
*/

const validateTemplateStructure = (
  template
) => {

  if (
    !template ||
    typeof template !== "object"
  ) {

    return {

      valid:
        false,

      errors: [
        "Template must be an object."

      ]

    };

  }


  const errors = [];


  if (
    !template.sections ||
    typeof template.sections !== "object"
  ) {

    errors.push(
      "Missing sections object."
    );

  }


  if (
    !Array.isArray(
      template.order
    )
  ) {

    errors.push(
      "Missing section order array."
    );

  }


  if (
    Array.isArray(
      template.order
    ) &&
    template.sections
  ) {

    for (
      const sectionId
      of template.order
    ) {

      if (
        !template.sections[
          sectionId
        ]
      ) {

        errors.push(

          `Section "${sectionId}" is present in order but not defined.`

        );

      }

    }

  }


  return {

    valid:
      errors.length === 0,

    errors

  };

};


/*
|--------------------------------------------------------------------------
| Complete Theme Template Generator
|--------------------------------------------------------------------------
*/

const generateAllTemplateFiles = (
  context
) => {

  generateTemplateFiles(
    context
  );


  context.templateRegistry =
    TEMPLATE_REGISTRY;


  return context;

};


/*
|--------------------------------------------------------------------------
| Part 6 Complete
|--------------------------------------------------------------------------
|
| Generated architecture:
|
| ✓ Homepage
| ✓ Product
| ✓ Collection
| ✓ Cart
| ✓ Search
| ✓ Page
| ✓ Contact
| ✓ Blog
| ✓ Article
| ✓ 404
| ✓ Collections list
| ✓ Password
| ✓ Gift card
| ✓ Template registry
| ✓ Template validation
| ✓ Shopify OS 2.0 JSON structure
|
|--------------------------------------------------------------------------
| Important
|--------------------------------------------------------------------------
|
| Part 6 only creates the JSON template layer.
| The actual sections referenced by these templates are generated by the
| other parts of aiLiquid.service.js.
|
|--------------------------------------------------------------------------
| Part 7
|--------------------------------------------------------------------------
|
| Next:
|
| - Header
| - Announcement bar
| - Footer
| - Navigation
| - Mobile menu
| - Search UI
| - Newsletter
| - Global storefront sections
|
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| PART 7 / 10
| GLOBAL STOREFRONT SECTIONS
|--------------------------------------------------------------------------
|
| Generates:
|
| sections:
|
| - announcement-bar.liquid
| - header.liquid
| - footer.liquid
| - newsletter.liquid
| - main-navigation.liquid
| - mobile-menu.liquid
| - search-drawer.liquid
| - predictive-search.liquid
|
| Features:
|
| ✓ Shopify navigation menus
| ✓ Responsive header
| ✓ Mobile drawer
| ✓ Search experience
| ✓ Customer accounts
| ✓ Cart integration
| ✓ Newsletter signup
| ✓ Social links
| ✓ Footer blocks
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Announcement Bar
|--------------------------------------------------------------------------
*/

const buildAnnouncementBarSection = () => {

  const schema = {

    name:
      "Announcement bar",

    settings: [

      settingSchema(
        "enabled",
        "checkbox",
        "Enable announcement",
        true
      ),

      settingSchema(
        "text",
        "text",
        "Announcement text",
        "Free shipping on orders over $50"
      ),

      settingSchema(
        "link",
        "url",
        "Announcement link",
        ""
      ),

      settingSchema(
        "show_close",
        "checkbox",
        "Show close button",
        true
      )

    ],

    presets: [

      {
        name:
          "Announcement bar"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Announcement Bar"
    ),

    "{% if section.settings.enabled %}",

    "",

    '<div class="announcement-bar" role="region">',

    "",

    "  {% if section.settings.link != blank %}",

    "",

    '    <a href="{{ section.settings.link }}"',

    '       class="announcement-bar__link">',

    "      {{ section.settings.text | escape }}",

    "    </a>",

    "",

    "  {% else %}",

    "",

    "    <p class=\"announcement-bar__text\">",

    "      {{ section.settings.text | escape }}",

    "    </p>",

    "",

    "  {% endif %}",

    "",

    "  {% if section.settings.show_close %}",

    "",

    '    <button',

    '      class="announcement-bar__close"',

    '      data-announcement-close',

    '      aria-label="Close announcement"',

    "    >",

    "      ×",

    "    </button>",

    "",

    "  {% endif %}",

    "",

    "</div>",

    "",

    "{% endif %}",

    "",

    buildNativeSectionSchema(
      schema
    )

  ]);

};


/*
|--------------------------------------------------------------------------
| Header Section
|--------------------------------------------------------------------------
*/

const buildHeaderSection = () => {

  const schema = {

    name:
      "Header",

    settings: [

      settingSchema(
        "logo_width",
        "range",
        "Logo width",
        120
      ),

      settingSchema(
        "sticky_header",
        "checkbox",
        "Sticky header",
        true
      ),

      settingSchema(
        "show_search",
        "checkbox",
        "Show search",
        true
      ),

      settingSchema(
        "show_account",
        "checkbox",
        "Show account",
        true
      )

    ],

    blocks: [

      {

        type:
          "menu",

        name:
          "Menu",

        settings: [

          settingSchema(
            "menu",
            "link_list",
            "Navigation menu",
            "main-menu"
          )

        ]

      }

    ],

    presets: [

      {
        name:
          "Header"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Header"
    ),

    '<header',

    ' class="site-header',

    '{% if section.settings.sticky_header %}',

    ' site-header--sticky',

    '{% endif %}"',

    ' data-header',

    ' role="banner">',

    "",

    ' <div class="site-header__container">',

    "",

    '  <div class="site-header__mobile-toggle">',

    "",

    '   <button',

    '    type="button"',

    '    data-mobile-menu-open',

    '    aria-label="Open menu">',

    "    ☰",

    "   </button>",

    "",

    "  </div>",

    "",

    '  <div class="site-header__logo">',

    "",

    "   {% if settings.logo != blank %}",

    "",

    "    {{ settings.logo | image_url:",

    "      width: section.settings.logo_width",

    "      | image_tag:",

    "      class: 'site-logo'",

    "      alt: shop.name",

    "    }}",

    "",

    "   {% else %}",

    "",

    '    <a href="{{ routes.root_url }}">',

    "      {{ shop.name }}",

    "    </a>",

    "",

    "   {% endif %}",

    "",

    "  </div>",

    "",

    '  <nav class="desktop-navigation">',

    "",

    "   {% for block in section.blocks %}",

    "",

    "    {% if block.type == 'menu' %}",

    "",

    "      {% assign menu = linklists[block.settings.menu] %}",

    "",

    "      <ul class=\"navigation-list\">",

    "",

    "       {% for link in menu.links %}",

    "",

    "        <li class=\"navigation-item\">",

    "",

    '         <a href="{{ link.url }}">',

    "          {{ link.title }}",

    "         </a>",

    "",

    "        </li>",

    "",

    "       {% endfor %}",

    "",

    "      </ul>",

    "",

    "    {% endif %}",

    "",

    "   {% endfor %}",

    "",

    "  </nav>",

    "",

    '  <div class="site-header__actions">',

    "",

    "   {% if section.settings.show_search %}",

    "",

    '    <button',

    '     type="button"',

    '     data-search-open',

    '     aria-label="Search">',

    "      🔍",

    "    </button>",

    "",

    "   {% endif %}",

    "",

    "   {% if section.settings.show_account %}",

    "",

    "    {% if shop.customer_accounts_enabled %}",

    "",

    '     <a href="{{ routes.account_url }}">',

    "      Account",

    "     </a>",

    "",

    "    {% endif %}",

    "",

    "   {% endif %}",

    "",

    '   <a href="{{ routes.cart_url }}"',

    '      class="header-cart"',

    '      data-cart-link>',

    "      Cart",

    "",

    '      <span data-cart-count>',

    "        {{ cart.item_count }}",

    "      </span>",

    "",

    "   </a>",

    "",

    "  </div>",

    "",

    " </div>",

    "",

    "</header>",

    "",

    buildNativeSectionSchema(
      schema
    )

  ]);

};


/*
|--------------------------------------------------------------------------
| Mobile Menu Section
|--------------------------------------------------------------------------
*/

const buildMobileMenuSection = () => {

  return joinLines([

    liquidComment(
      "StoreForge AI Mobile Menu"
    ),

    '<aside',

    ' class="mobile-menu"',

    ' data-mobile-menu',

    ' aria-hidden="true">',

    "",

    '<button',

    ' class="mobile-menu__close"',

    ' data-mobile-menu-close',

    ' aria-label="Close menu">',

    "×",

    "</button>",

    "",

    "{% assign menu = linklists.main-menu %}",

    "",

    "<ul>",

    "",

    "{% for link in menu.links %}",

    "",

    "<li>",

    "",

    '<a href="{{ link.url }}">',

    "{{ link.title }}",

    "</a>",

    "",

    "</li>",

    "",

    "{% endfor %}",

    "",

    "</ul>",

    "",

    "</aside>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Footer Section
|--------------------------------------------------------------------------
*/

const buildFooterSection = () => {

  const schema = {

    name:
      "Footer",

    blocks: [

      {

        type:
          "text",

        name:
          "Text",

        settings: [

          settingSchema(
            "heading",
            "text",
            "Heading",
            "About us"
          ),

          settingSchema(
            "content",
            "richtext",
            "Content",
            ""
          )

        ]

      },

      {

        type:
          "menu",

        name:
          "Footer menu",

        settings: [

          settingSchema(
            "menu",
            "link_list",
            "Menu",
            "footer"
          )

        ]

      }

    ],

    presets: [

      {
        name:
          "Footer"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Footer"
    ),

    '<footer class="site-footer">',

    "",

    '<div class="footer-container">',

    "",

    "{% for block in section.blocks %}",

    "",

    "{% case block.type %}",

    "",

    "{% when 'text' %}",

    "",

    '<div class="footer-block">',

    "",

    "<h3>",

    "{{ block.settings.heading }}",

    "</h3>",

    "",

    "{{ block.settings.content }}",

    "",

    "</div>",

    "",

    "{% when 'menu' %}",

    "",

    "{% assign menu = linklists[block.settings.menu] %}",

    "",

    "<div class=\"footer-block\">",

    "",

    "<ul>",

    "",

    "{% for link in menu.links %}",

    "",

    "<li>",

    '<a href="{{ link.url }}">',

    "{{ link.title }}",

    "</a>",

    "</li>",

    "",

    "{% endfor %}",

    "",

    "</ul>",

    "",

    "</div>",

    "",

    "{% endcase %}",

    "",

    "{% endfor %}",

    "",

    "</div>",

    "",

    '<div class="footer-bottom">',

    "© {{ 'now' | date: '%Y' }} {{ shop.name }}",

    "</div>",

    "",

    "</footer>",

    "",

    buildNativeSectionSchema(
      schema
    )

  ]);

};


/*
|--------------------------------------------------------------------------
| Newsletter Section
|--------------------------------------------------------------------------
*/

const buildNewsletterSection = () => {

  const schema = {

    name:
      "Newsletter",

    settings: [

      settingSchema(
        "heading",
        "text",
        "Heading",
        "Subscribe to our newsletter"
      ),

      settingSchema(
        "text",
        "textarea",
        "Text",
        "Get updates and exclusive offers."
      )

    ],

    presets: [

      {
        name:
          "Newsletter"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Newsletter"
    ),

    '<section class="newsletter">',

    "",

    "<h2>",

    "{{ section.settings.heading }}",

    "</h2>",

    "",

    "<p>",

    "{{ section.settings.text }}",

    "</p>",

    "",

    "{% form 'customer' %}",

    "",

    '<input',

    ' type="email"',

    ' name="contact[email]"',

    ' placeholder="Email address"',

    ' required>',

    "",

    '<button type="submit">',

    "Subscribe",

    "</button>",

    "",

    "{% endform %}",

    "",

    "</section>",

    "",

    buildNativeSectionSchema(
      schema
    )

  ]);

};


/*
|--------------------------------------------------------------------------
| Generate Global Sections
|--------------------------------------------------------------------------
*/

const generateGlobalSections = (
  context
) => {


  addLiquidFile(

    context,

    "sections/announcement-bar.liquid",

    buildAnnouncementBarSection()

  );


  addLiquidFile(

    context,

    "sections/header.liquid",

    buildHeaderSection()

  );


  addLiquidFile(

    context,

    "sections/mobile-menu.liquid",

    buildMobileMenuSection()

  );


  addLiquidFile(

    context,

    "sections/footer.liquid",

    buildFooterSection()

  );


  addLiquidFile(

    context,

    "sections/newsletter.liquid",

    buildNewsletterSection()

  );


  return context;

};


/*
|--------------------------------------------------------------------------
| Part 7 Complete
|--------------------------------------------------------------------------
|
| Added:
|
| ✓ Announcement bar
| ✓ Desktop header
| ✓ Logo system
| ✓ Navigation menu
| ✓ Account link
| ✓ Cart counter
| ✓ Mobile menu
| ✓ Footer blocks
| ✓ Footer menus
| ✓ Newsletter signup
| ✓ Shopify section schemas
|
|--------------------------------------------------------------------------
|
| Part 8 Next:
|
| Product + Collection AI Liquid sections:
|
| - main-product.liquid
| - product gallery
| - variant selector
| - add-to-cart form
| - product recommendations
| - collection grid
| - filters
| - sorting
|
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| PART 8 / 10
| PRODUCT + COLLECTION SECTIONS
|--------------------------------------------------------------------------
|
| Generates:
|
| - main-product.liquid
| - product-gallery.liquid
| - product-form.liquid
| - product-recommendations.liquid
| - collection-banner.liquid
| - main-collection-product-grid.liquid
| - product-card.liquid
| - collection-filters.liquid
|
| Features:
|
| ✓ Shopify product object
| ✓ Variant selection
| ✓ AJAX add-to-cart
| ✓ Product images
| ✓ Price handling
| ✓ Availability
| ✓ Product recommendations
| ✓ Collection filtering
| ✓ Sorting
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Product Card Snippet
|--------------------------------------------------------------------------
*/

const buildProductCardSnippet = () => {

return joinLines([

liquidComment(
"StoreForge AI Product Card"
),

'<article class="product-card">',

"",

'<a href="{{ product.url }}"',

' class="product-card__image">',

"",

"{% if product.featured_image %}",

"",

"{{ product.featured_image | image_url: width: 500 | image_tag:",

"class: 'product-card__img',",

"loading: 'lazy'",

"}}",

"",

"{% endif %}",

"",

"</a>",

"",

'<div class="product-card__content">',

"",

'<h3 class="product-card__title">',

'<a href="{{ product.url }}">',

"{{ product.title | escape }}",

"</a>",

"</h3>",

"",

'{% if product.vendor != blank %}',

'<p class="product-card__vendor">',

"{{ product.vendor }}",

"</p>",

"{% endif %}",

"",

'<div class="product-card__price">',

"",

"{% if product.compare_at_price > product.price %}",

"",

"<s>",

"{{ product.compare_at_price | money }}",

"</s>",

"",

"{% endif %}",

"",

"<span>",

"{{ product.price | money }}",

"</span>",

"",

"</div>",

"",

"{% if product.available %}",

"",

'<form method="post"',

' action="/cart/add"',

' data-product-form>',

"",

'<input',

'type="hidden"',

'name="id"',

'value="{{ product.selected_or_first_available_variant.id }}">',

"",

'<button',

'type="submit"',

'class="button button--primary"',

'data-add-to-cart>',

"Add to cart",

"</button>",

"",

"</form>",

"",

"{% else %}",

"",

'<button disabled',

'class="button button--disabled">',

"Sold out",

"</button>",

"",

"{% endif %}",

"",

"</div>",

"",

"</article>"

]);

};


/*
|--------------------------------------------------------------------------
| Product Gallery
|--------------------------------------------------------------------------
*/

const buildProductGallerySection = () => {

return joinLines([

liquidComment(
"StoreForge AI Product Gallery"
),

'<div class="product-gallery">',

"",

"{% if product.media.size > 0 %}",

"",

'<div class="product-gallery__main">',

"",

"{% assign first_media = product.media.first %}",

"",

"{{ first_media | image_url: width: 1200 | image_tag:",

"class: 'product-gallery__image',",

"loading: 'eager'",

"}}",

"",

"</div>",

"",

'<div class="product-gallery__thumbs">',

"",

"{% for media in product.media %}",

"",

"<button",

'  type="button"',

'  class="product-gallery__thumb"',

'  data-product-media-id="{{ media.id }}"',

'  aria-label="View {{ media.alt | default: product.title | escape }}"',

">",

"",

"{% if media.preview_image != blank %}",

"",

"{{ media.preview_image | image_url: width: 180 | image_tag:",

"  class: 'product-gallery__thumb-image',",

"  loading: 'lazy'",

"}}",

"",

"{% endif %}",

"",

"</button>",

"",

"{% endfor %}",

"",

"</div>",

"",

"{% else %}",

"",

'<div class="product-gallery__placeholder">',

"Product image unavailable",

"</div>",

"",

"{% endif %}",

"",

"</div>"

]);

};


/*
|--------------------------------------------------------------------------
| Product Form
|--------------------------------------------------------------------------
*/

const buildProductFormSection = () => {

const schema = {

name:
"Product form",

settings: [

settingSchema(
"show_quantity",
"checkbox",
"Show quantity selector",
true
),

settingSchema(
"show_dynamic_checkout",
"checkbox",
"Show dynamic checkout",
true
)

],

presets: [

{
name:
"Product form"
}

]

};


return joinLines([

liquidComment(
"StoreForge AI Product Form"
),

'<div class="product-form-wrapper">',

"",

"{% form 'product', product,",

'  id: "ProductForm-{{ section.id }}",',

'  class: "product-form",',

'  data-product-form',

"%}",

"",

'<input',

'  type="hidden"',

'  name="id"',

'  value="{{ product.selected_or_first_available_variant.id }}"',

'  data-product-variant',

">",

"",

"{% unless product.has_only_default_variant %}",

"",

'<div class="product-form__variants">',

"",

"{% for option in product.options_with_values %}",

"",

'<fieldset class="product-form__option">',

"",

"<legend>",

"{{ option.name | escape }}",

"</legend>",

"",

'<div class="product-form__option-values">',

"",

"{% for value in option.values %}",

"",

'<label class="product-form__option-value">',

"",

"<input",

'  type="radio"',

'  name="options[{{ option.name | escape }}]"',

'  value="{{ value | escape }}"',

'  {% if option.selected_value == value %}checked{% endif %}',

">",

"",

"<span>",

"{{ value | escape }}",

"</span>",

"",

"</label>",

"",

"{% endfor %}",

"",

"</div>",

"",

"</fieldset>",

"",

"{% endfor %}",

"",

"</div>",

"",

"{% endunless %}",

"",

"{% if section.settings.show_quantity %}",

"",

'<div class="product-form__quantity">',

"",

"<label",

'  for="Quantity-{{ section.id }}"',

">",

"Quantity",

"</label>",

"",

"<div class=\"quantity-selector\">",

"",

"<button",

'  type="button"',

'  data-product-quantity-minus',

'  aria-label="Decrease quantity"',

">",

"−",

"</button>",

"",

"<input",

'  id="Quantity-{{ section.id }}"',

'  type="number"',

'  name="quantity"',

'  value="1"',

'  min="1"',

'  step="1"',

'  inputmode="numeric"',

'  data-product-quantity',

">",

"",

"<button",

'  type="button"',

'  data-product-quantity-plus',

'  aria-label="Increase quantity"',

">",

"+",

"</button>",

"",

"</div>",

"",

"</div>",

"",

"{% endif %}",

"",

'<div class="product-form__actions">',

"",

"{% if product.selected_or_first_available_variant.available %}",

"",

"<button",

'  type="submit"',

'  name="add"',

'  class="button button--primary button--full-width"',

'  data-add-to-cart',

">",

"Add to cart",

"</button>",

"",

"{% else %}",

"",

"<button",

'  type="button"',

'  class="button button--disabled button--full-width"',

'  disabled',

">",

"Sold out",

"</button>",

"",

"{% endif %}",

"",

"{% if section.settings.show_dynamic_checkout %}",

"",

"{% if product.selected_or_first_available_variant.available %}",

"",

"{{ form | payment_button }}",

"",

"{% endif %}",

"",

"{% endif %}",

"",

"</div>",

"",

'<p',

'  class="product-form__error"',

'  data-product-form-error',

'  role="alert"',

'  hidden',

">",

"</p>",

"",

"{% endform %}",

"",

"</div>",

"",

buildNativeSectionSchema(
schema
)

]);

};


/*
|--------------------------------------------------------------------------
| Main Product Section
|--------------------------------------------------------------------------
*/

const buildMainProductSection = () => {

const schema = {

name:
"Main product",

settings: [

settingSchema(
"show_vendor",
"checkbox",
"Show vendor",
true
),

settingSchema(
"show_description",
"checkbox",
"Show description",
true
),

settingSchema(
"show_sku",
"checkbox",
"Show SKU",
true
),

settingSchema(
"show_share",
"checkbox",
"Show share buttons",
true
),

settingSchema(
"enable_sticky_info",
"checkbox",
"Enable sticky product information",
true
)

],

presets: [

{
name:
"Main product"
}

]

};


return joinLines([

liquidComment(
"StoreForge AI Main Product"
),

'<section',

'  class="main-product page-width',

'  {% if section.settings.enable_sticky_info %}',

' main-product--sticky',

'  {% endif %}"',

'  data-product-section',

'  data-section-id="{{ section.id }}"',

">",

"",

'<div class="main-product__grid">',

"",

'<div class="main-product__media">',

"",

"{% if product.media.size > 0 %}",

"",

'<div class="product-gallery">',

"",

'<div class="product-gallery__main">',

"",

"{% for media in product.media limit: 1 %}",

"",

"{% if media.media_type == 'image' %}",

"",

"{{ media | image_url: width: 1400 | image_tag:",

"  class: 'product-gallery__image',",

"  loading: 'eager',",

"  widths: '400, 600, 800, 1000, 1200, 1400'",

"}}",

"",

"{% else %}",

"",

"{{ media | media_tag:",

"  image_size: '1400x',",

"  controls: true,",

"  class: 'product-gallery__media'",

"}}",

"",

"{% endif %}",

"",

"{% endfor %}",

"",

"</div>",

"",

'<div class="product-gallery__thumbs">',

"",

"{% for media in product.media %}",

"",

"<button",

'  type="button"',

'  class="product-gallery__thumb"',

'  data-product-media-id="{{ media.id }}"',

'  aria-label="View product media"',

">",

"",

"{% if media.preview_image != blank %}",

"",

"{{ media.preview_image | image_url: width: 180 | image_tag:",

"  class: 'product-gallery__thumb-image',",

"  loading: 'lazy'",

"}}",

"",

"{% endif %}",

"",

"</button>",

"",

"{% endfor %}",

"",

"</div>",

"",

"</div>",

"",

"{% else %}",

"",

'<div class="product-gallery__placeholder">',

"{{ 'product-1' | placeholder_svg_tag }}",

"</div>",

"",

"{% endif %}",

"",

"</div>",

"",

'<div class="main-product__info">',

"",

"{% if section.settings.show_vendor and product.vendor != blank %}",

"",

'<p class="product__vendor">',

"{{ product.vendor | escape }}",

"</p>",

"",

"{% endif %}",

"",

'<h1 class="product__title">',

"{{ product.title | escape }}",

"</h1>",

"",

'<div class="product__price" data-product-price>',

"",

"{% assign current_variant = product.selected_or_first_available_variant %}",

"",

"{% if current_variant.compare_at_price > current_variant.price %}",

"",

"<s>",

"{{ current_variant.compare_at_price | money }}",

"</s>",

"",

"{% endif %}",

"",

"<span>",

"{{ current_variant.price | money }}",

"</span>",

"",

"</div>",

"",

"{% if section.settings.show_sku and current_variant.sku != blank %}",

"",

'<p class="product__sku">',

"SKU: ",

"<span data-product-sku>",

"{{ current_variant.sku | escape }}",

"</span>",

"</p>",

"",

"{% endif %}",

"",

"{% if section.settings.show_description %}",

"",

'<div class="product__description rte">',

"{{ product.description }}",

"</div>",

"",

"{% endif %}",

"",

"{% render 'product-form',",

"  product: product",

" %}",

"",

"{% if section.settings.show_share %}",

"",

'<div class="product__share">',

"",

"<span>Share</span>",

"",

'<a href="https://www.facebook.com/sharer/sharer.php?u={{ shop.url }}{{ product.url | url_encode }}"',

' target="_blank"',

' rel="noopener noreferrer">',

"Facebook",

"</a>",

"",

'<a href="https://twitter.com/intent/tweet?url={{ shop.url }}{{ product.url | url_encode }}&text={{ product.title | url_encode }}"',

' target="_blank"',

' rel="noopener noreferrer">',

"X",

"</a>",

"",

"</div>",

"",

"{% endif %}",

"",

"</div>",

"",

"</div>",

"",

buildNativeSectionSchema(
schema
),

"</section>"

]);

};


/*
|--------------------------------------------------------------------------
| Product Recommendations
|--------------------------------------------------------------------------
*/

const buildProductRecommendationsSection = () => {

const schema = {

name:
"Product recommendations",

settings: [

settingSchema(
"heading",
"text",
"Heading",
"You may also like"
),

settingSchema(
"products_to_show",
"range",
"Products to show",
4
)

],

presets: [

{
name:
"Product recommendations"
}

]

};


return joinLines([

liquidComment(
"StoreForge AI Product Recommendations"
),

'<section',

'  class="product-recommendations page-width"',

'  data-product-recommendations',

'  data-product-id="{{ product.id }}"',

">",

"",

'<div class="section-header">',

"",

"<h2>",

"{{ section.settings.heading | escape }}",

"</h2>",

"",

"</div>",

"",

'<div class="product-grid"',

'  data-recommendation-grid>',

"",

"{% if recommendations.performed %}",

"",

"{% for recommendation in recommendations.products limit: section.settings.products_to_show %}",

"",

"{% render 'product-card', product: recommendation %}",

"",

"{% endfor %}",

"",

"{% endif %}",

"",

"</div>",

"",

"</section>",

"",

buildNativeSectionSchema(
schema
)

]);

};


/*
|--------------------------------------------------------------------------
| Collection Banner
|--------------------------------------------------------------------------
*/

const buildCollectionBannerSection = () => {

const schema = {

name:
"Collection banner",

settings: [

settingSchema(
"show_image",
"checkbox",
"Show collection image",
true
),

settingSchema(
"show_description",
"checkbox",
"Show description",
true
)

],

presets: [

{
name:
"Collection banner"
}

]

};


return joinLines([

liquidComment(
"StoreForge AI Collection Banner"
),

'<section class="collection-banner page-width">',

"",

"{% if section.settings.show_image and collection.image != blank %}",

"",

'<div class="collection-banner__image">',

"",

"{{ collection.image | image_url: width: 1600 | image_tag:",

"  loading: 'eager',",

"  class: 'collection-banner__img'",

"}}",

"",

"</div>",

"",

"{% endif %}",

"",

'<div class="collection-banner__content">',

"",

"<h1>",

"{{ collection.title | escape }}",

"</h1>",

"",

"{% if section.settings.show_description and collection.description != blank %}",

"",

'<div class="collection-banner__description rte">',

"{{ collection.description }}",

"</div>",

"",

"{% endif %}",

"",

"</div>",

"",

"</section>",

"",

buildNativeSectionSchema(
schema
)

]);

};


/*
|--------------------------------------------------------------------------
| Collection Filters
|--------------------------------------------------------------------------
*/

const buildCollectionFiltersSection = () => {

const schema = {

name:
"Collection filters",

settings: [

settingSchema(
"show_filters",
"checkbox",
"Show filters",
true
),

settingSchema(
"show_sort",
"checkbox",
"Show sorting",
true
)

],

presets: [

{
name:
"Collection filters"
}

]

};


return joinLines([

liquidComment(
"StoreForge AI Collection Filters"
),

'<div class="collection-tools">',

"",

"{% if section.settings.show_filters %}",

"",

'<div class="collection-filters">',

"",

"{% for filter in collection.filters %}",

"",

"<details class=\"collection-filter\">",

"",

"<summary>",

"{{ filter.label | escape }}",

"</summary>",

"",

"<div class=\"collection-filter__options\">",

"",

"{% if filter.type == 'price_range' %}",

"",

'<div class="price-range">',

"",

"<input",

'  type="number"',

'  name="{{ filter.min_value.param_name }}"',

'  placeholder="Min"',

'  value="{{ filter.min_value.value | default: '' }}"',

">",

"",

"<input",

'  type="number"',

'  name="{{ filter.max_value.param_name }}"',

'  placeholder="Max"',

'  value="{{ filter.max_value.value | default: '' }}"',

">",

"",

"</div>",

"",

"{% else %}",

"",

"{% for value in filter.values %}",

"",

"<label>",

"",

"<input",

'  type="checkbox"',

'  name="{{ value.param_name }}"',

'  value="{{ value.value }}"',

'  {% if value.active %}checked{% endif %}',

'  {% if value.count == 0 and value.active == false %}disabled{% endif %}',

">",

"",

"<span>",

"{{ value.label | escape }}",

"</span>",

"",

"<small>",

"{{ value.count }}",

"</small>",

"",

"</label>",

"",

"{% endfor %}",

"",

"{% endif %}",

"",

"</div>",

"",

"</details>",

"",

"{% endfor %}",

"",

"</div>",

"",

"{% endif %}",

"",

"{% if section.settings.show_sort %}",

"",

'<div class="collection-sort">',

"",

"<label for=\"CollectionSort\">",

"Sort by",

"</label>",

"",

"<select",

'  id="CollectionSort"',

'  name="sort_by"',

'  data-collection-sort',

">",

"",

"{% for option in collection.sort_options %}",

"",

"<option",

'  value="{{ option.value }}"',

'  {% if option.value == collection.sort_by %}selected{% endif %}',

">",

"{{ option.name }}",

"</option>",

"",

"{% endfor %}",

"",

"</select>",

"",

"</div>",

"",

"{% endif %}",

"",

"</div>",

"",

buildNativeSectionSchema(
schema
)

]);

};


/*
|--------------------------------------------------------------------------
| Main Collection Product Grid
|--------------------------------------------------------------------------
*/

const buildMainCollectionProductGridSection = () => {

const schema = {

name:
"Collection product grid",

settings: [

settingSchema(
"products_per_page",
"range",
"Products per page",
24
),

settingSchema(
"columns_desktop",
"range",
"Desktop columns",
4
),

settingSchema(
"show_filters",
"checkbox",
"Show filters",
true
),

settingSchema(
"show_sort",
"checkbox",
"Show sorting",
true
)

],

presets: [

{
name:
"Collection product grid"
}

]

};


return joinLines([

liquidComment(
"StoreForge AI Collection Product Grid"
),

'<section',

'  class="main-collection page-width"',

'  data-collection-section',

">",

"",

'<div class="collection-header">',

"",

'<span class="collection-count">',

"{{ collection.products_count }} products",

"</span>",

"",

"</div>",

"",

"{% if section.settings.show_filters or section.settings.show_sort %}",

"",

"{% render 'collection-filters',",

"  collection: collection",

"%}",

"",

"{% endif %}",

"",

'<div class="product-grid"',

'  data-collection-grid>',

"",

"{% paginate collection.products by section.settings.products_per_page %}",

"",

"{% for product in collection.products %}",

"",

"{% render 'product-card', product: product %}",

"",

"{% else %}",

"",

'<div class="collection-empty">',

"",

"<h2>No products found</h2>",

"",

"<p>Try changing your filters or search.</p>",

"",

"</div>",

"",

"{% endfor %}",

"",

"{% if paginate.pages > 1 %}",

"",

'<nav class="pagination" aria-label="Pagination">',

"",

"{% if paginate.previous %}",

"",

'<a href="{{ paginate.previous.url }}">',

"Previous",

"</a>",

"",

"{% endif %}",

"",

"{% for part in paginate.parts %}",

"",

"{% if part.is_link %}",

"",

'<a href="{{ part.url }}">',

"{{ part.title }}",

"</a>",

"",

"{% else %}",

"",

"<span",

'{% if part.title == paginate.current_page %}',

'  aria-current="page"',

"{% endif %}",

">",

"{{ part.title }}",

"</span>",

"",

"{% endif %}",

"",

"{% endfor %}",

"",

"{% if paginate.next %}",

"",

'<a href="{{ paginate.next.url }}">',

"Next",

"</a>",

"",

"{% endif %}",

"",

"</nav>",

"",

"{% endif %}",

"",

"{% endpaginate %}",

"",

"</div>",

"",

"</section>",

"",

buildNativeSectionSchema(
schema
)

]);

};


/*
|--------------------------------------------------------------------------
| Collection Filters Snippet
|--------------------------------------------------------------------------
*/

const buildCollectionFiltersSnippet = () => {

return joinLines([

liquidComment(
"StoreForge AI Collection Filters Snippet"
),

'<div class="collection-tools">',

"",

"{% for filter in collection.filters %}",

"",

"<details>",

"",

"<summary>",

"{{ filter.label | escape }}",

"</summary>",

"",

"{% if filter.type == 'price_range' %}",

"",

'<div class="filter-price">',

"",

"<input",

'  type="number"',

'  name="{{ filter.min_value.param_name }}"',

'  placeholder="Min"',

'  value="{{ filter.min_value.value | default: '' }}"',

">",

"",

"<input",

'  type="number"',

'  name="{{ filter.max_value.param_name }}"',

'  placeholder="Max"',

'  value="{{ filter.max_value.value | default: '' }}"',

">",

"",

"</div>",

"",

"{% else %}",

"",

"{% for value in filter.values %}",

"",

"<label>",

"",

"<input",

'  type="checkbox"',

'  name="{{ value.param_name }}"',

'  value="{{ value.value }}"',

'  {% if value.active %}checked{% endif %}',

">",

"{{ value.label | escape }}",

"</label>",

"",

"{% endfor %}",

"",

"{% endif %}",

"",

"</details>",

"",

"{% endfor %}",

"",

"</div>"

]);

};


/*
|--------------------------------------------------------------------------
| Generate Product + Collection Sections
|--------------------------------------------------------------------------
*/

const generateProductCollectionSections = (
context
) => {

addLiquidFile(

context,

"snippets/product-card.liquid",

buildProductCardSnippet()

);


addLiquidFile(

context,

"snippets/collection-filters.liquid",

buildCollectionFiltersSnippet()

);


addLiquidFile(

context,

"sections/product-gallery.liquid",

buildProductGallerySection()

);


addLiquidFile(

context,

"sections/product-form.liquid",

buildProductFormSection()

);


addLiquidFile(

context,

"sections/main-product.liquid",

buildMainProductSection()

);


addLiquidFile(

context,

"sections/product-recommendations.liquid",

buildProductRecommendationsSection()

);


addLiquidFile(

context,

"sections/collection-banner.liquid",

buildCollectionBannerSection()

);


addLiquidFile(

context,

"sections/collection-filters.liquid",

buildCollectionFiltersSection()

);


addLiquidFile(

context,

"sections/main-collection-product-grid.liquid",

buildMainCollectionProductGridSection()

);


return context;

};


/*
|--------------------------------------------------------------------------
| Product / Collection JavaScript
|--------------------------------------------------------------------------
*/

const buildProductCollectionJavascript = () => {

return joinLines([

"/* StoreForge AI Product / Collection JS */",

"",

"(function () {",

"  'use strict';",

"",

"  function getVariantId(form) {",

"    const input = form.querySelector('[name=\"id\"]');",

"    return input ? input.value : null;",

"  }",

"",

"  async function addProduct(form) {",

"    const variantId = getVariantId(form);",

"    const quantityInput = form.querySelector('[name=\"quantity\"]');",

"    const quantity = quantityInput",

"      ? Math.max(1, Number(quantityInput.value || 1))",

"      : 1;",

"",

"    if (!variantId) return;",

"",

"    const button = form.querySelector('[data-add-to-cart]');",

"    const originalText = button ? button.textContent : '';",

"",

"    if (button) {",

"      button.disabled = true;",

"      button.textContent = 'Adding...';",

"    }",

"",

"    try {",

"      const response = await fetch('/cart/add.js', {",

"        method: 'POST',",

"        headers: {",

"          'Content-Type': 'application/json',",

"          'Accept': 'application/json'",

"        },",

"        body: JSON.stringify({",

"          items: [{",

"            id: Number(variantId),",

"            quantity",

"          }]",

"        })",

"      });",

"",

"      if (!response.ok) {",

"        const error = await response.json().catch(function () {",

"          return {};",

"        });",

"",

"        throw new Error(",

"          error.description || 'Unable to add product to cart.'",

"        );",

"      }",

"",

"      const item = await response.json();",

"",

"      document.dispatchEvent(",

"        new CustomEvent('storeforge:product-added', {",

"          detail: item",

"        })",

"      );",

"",

"      if (window.StoreForgeCart && window.StoreForgeCart.refresh) {",

"        await window.StoreForgeCart.refresh();",

"      }",

"",

"      if (window.StoreForgeCart && window.StoreForgeCart.open) {",

"        window.StoreForgeCart.open();",

"      }",

"",

"    } catch (error) {",

"      const errorElement = form.querySelector('[data-product-form-error]');",

"",

"      if (errorElement) {",

"        errorElement.hidden = false;",

"        errorElement.textContent = error.message;",

"      } else {",

"        console.error(error);",

"      }",

"    } finally {",

"      if (button) {",

"        button.disabled = false;",

"        button.textContent = originalText || 'Add to cart';",

"      }",

"    }",

"  }",

"",

"  function bindQuantityControls() {",

"    document.addEventListener('click', function (event) {",

"      const plus = event.target.closest('[data-product-quantity-plus]');",

"      const minus = event.target.closest('[data-product-quantity-minus]');",

"",

"      if (!plus && !minus) return;",

"",

"      const wrapper = event.target.closest('.product-form__quantity');",

"      const input = wrapper && wrapper.querySelector('[data-product-quantity]');",

"",

"      if (!input) return;",

"",

"      let value = Number(input.value || 1);",

"",

"      if (plus) value += 1;",

"      if (minus) value = Math.max(1, value - 1);",

"",

"      input.value = value;",

"      input.dispatchEvent(new Event('change', { bubbles: true }));",

"    });",

"  }",

"",

"  function bindProductForms() {",

"    document.addEventListener('submit', function (event) {",

"      const form = event.target.closest('[data-product-form]');",

"",

"      if (!form) return;",

"",

"      event.preventDefault();",

"      addProduct(form);",

"    });",

"  }",

"",

"  function bindCollectionSorting() {",

"    document.addEventListener('change', function (event) {",

"      const select = event.target.closest('[data-collection-sort]');",

"",

"      if (!select) return;",

"",

"      const url = new URL(window.location.href);",

"      url.searchParams.set('sort_by', select.value);",

"      window.location.href = url.toString();",

"    });",

"  }",

"",

"  function bindGallery() {",

"    document.addEventListener('click', function (event) {",

"      const thumbnail = event.target.closest('[data-product-media-id]');",

"",

"      if (!thumbnail) return;",

"",

"      const mediaId = thumbnail.dataset.productMediaId;",

"      const media = document.querySelector(",

"        '[data-product-media-id=\"' + mediaId + '\"]'",

"      );",

"",

"      document.dispatchEvent(",

"        new CustomEvent('storeforge:media-selected', {",

"          detail: {",

"            id: mediaId,",

"            element: media",

"          }",

"        })",

"      );",

"    });",

"  }",

"",

"  function init() {",

"    bindProductForms();",

"    bindQuantityControls();",

"    bindCollectionSorting();",

"    bindGallery();",

"  }",

"",

"  if (document.readyState === 'loading') {",

"    document.addEventListener('DOMContentLoaded', init);",

"  } else {",

"    init();",

"  }",

"",

"})();"

]);

};


/*
|--------------------------------------------------------------------------
| Register Part 8 Files
|--------------------------------------------------------------------------
*/

const registerPart8Files = (
context
) => {

generateProductCollectionSections(
context
);

addAssetFile(

context,

"assets/product-collection.js",

buildProductCollectionJavascript()

);

return context;

};


/*
|--------------------------------------------------------------------------
| PART 8 FINAL EXPORT REGISTRATION
|--------------------------------------------------------------------------
|
| If the main generator already calls generateProductCollectionSections(),
| do not call it twice.
|
|--------------------------------------------------------------------------
*/

if (
typeof module !== "undefined" &&
module.exports
) {

module.exports = {

buildProductCardSnippet,

buildProductGallerySection,

buildProductFormSection,

buildMainProductSection,

buildProductRecommendationsSection,

buildCollectionBannerSection,

buildCollectionFiltersSection,

buildMainCollectionProductGridSection,

buildCollectionFiltersSnippet,

buildProductCollectionJavascript,

generateProductCollectionSections,

registerPart8Files

};

}


/*
|--------------------------------------------------------------------------
| PART 8 / 10 — COMPLETE
|--------------------------------------------------------------------------
|
| Product:
|
| ✓ Product card
| ✓ Product image
| ✓ Product gallery
| ✓ Product thumbnails
| ✓ Product media
| ✓ Product title
| ✓ Vendor
| ✓ Price
| ✓ Compare-at price
| ✓ SKU
| ✓ Description
| ✓ Variant options
| ✓ Quantity selector
| ✓ Add to cart
| ✓ Dynamic checkout
| ✓ Sold-out state
| ✓ Product sharing
|
| Collection:
|
| ✓ Collection banner
| ✓ Collection image
| ✓ Collection description
| ✓ Product grid
| ✓ Pagination
| ✓ Product count
| ✓ Filters
| ✓ Price range
| ✓ Sorting
| ✓ Empty collection state
|
| JavaScript:
|
| ✓ AJAX product add
| ✓ Quantity controls
| ✓ Collection sorting
| ✓ Product events
| ✓ Cart refresh integration
|
|--------------------------------------------------------------------------
| NEXT — PART 9 / 10
|--------------------------------------------------------------------------
|
| Search + Blog + Article + Contact + 404 sections.
|
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| PART 9 / 10
| SEARCH + BLOG + ARTICLE + CONTACT + 404
|--------------------------------------------------------------------------
|
| Generates:
|
| - sections/search-results.liquid
| - sections/main-blog.liquid
| - sections/main-article.liquid
| - sections/related-articles.liquid
| - sections/contact-form.liquid
| - sections/404.liquid
| - sections/main-page.liquid
| - sections/main-list-collections.liquid
| - sections/password-header.liquid
| - sections/password-content.liquid
| - sections/gift-card.liquid
| - snippets/article-card.liquid
| - snippets/pagination.liquid
|
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Article Card
|--------------------------------------------------------------------------
*/

const buildArticleCardSnippet = () => {

  return joinLines([

    liquidComment(
      "StoreForge AI Article Card"
    ),

    '<article class="article-card">',

    "",

    "{% if article.image != blank %}",

    "",

    '  <a href="{{ article.url }}" class="article-card__image">',

    "",

    "    {{ article.image | image_url: width: 700 | image_tag:",

    "      class: 'article-card__image-img',",

    "      loading: 'lazy'",

    "    }}",

    "",

    "  </a>",

    "",

    "{% endif %}",

    "",

    '  <div class="article-card__content">',

    "",

    '    <p class="article-card__date">',

    "      {{ article.published_at | date: '%B %d, %Y' }}",

    "    </p>",

    "",

    '    <h3 class="article-card__title">',

    '      <a href="{{ article.url }}">',

    "        {{ article.title | escape }}",

    "      </a>",

    "    </h3>",

    "",

    '    <p class="article-card__excerpt">',

    "      {{ article.excerpt_or_content | strip_html | truncate: 140 }}",

    "    </p>",

    "",

    '    <a href="{{ article.url }}" class="article-card__read-more">',

    "      Read more",

    "    </a>",

    "",

    "  </div>",

    "",

    "</article>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Pagination Snippet
|--------------------------------------------------------------------------
*/

const buildPaginationSnippet = () => {

  return joinLines([

    liquidComment(
      "StoreForge AI Pagination"
    ),

    "{% if paginate.pages > 1 %}",

    "",

    '<nav class="pagination" aria-label="Pagination">',

    "",

    "  {% if paginate.previous %}",

    "",

    '    <a href="{{ paginate.previous.url }}"',

    '       class="pagination__previous">',

    "      Previous",

    "    </a>",

    "",

    "  {% endif %}",

    "",

    '  <div class="pagination__pages">',

    "",

    "    {% for part in paginate.parts %}",

    "",

    "      {% if part.is_link %}",

    "",

    '        <a href="{{ part.url }}">',

    "          {{ part.title }}",

    "        </a>",

    "",

    "      {% else %}",

    "",

    "        <span",

    '          {% if part.title == paginate.current_page %}',

    '            aria-current="page"',

    "          {% endif %}",

    "        >",

    "          {{ part.title }}",

    "        </span>",

    "",

    "      {% endif %}",

    "",

    "    {% endfor %}",

    "",

    "  </div>",

    "",

    "  {% if paginate.next %}",

    "",

    '    <a href="{{ paginate.next.url }}"',

    '       class="pagination__next">',

    "      Next",

    "    </a>",

    "",

    "  {% endif %}",

    "",

    "</nav>",

    "",

    "{% endif %}"

  ]);

};


/*
|--------------------------------------------------------------------------
| Search Results
|--------------------------------------------------------------------------
*/

const buildSearchResultsSection = () => {

  const schema = {

    name:
      "Search results",

    settings: [

      settingSchema(
        "products_per_page",
        "range",
        "Results per page",
        24
      ),

      settingSchema(
        "columns_desktop",
        "range",
        "Desktop columns",
        4
      ),

      settingSchema(
        "show_sort",
        "checkbox",
        "Show sorting",
        true
      )

    ],

    presets: [

      {
        name:
          "Search results"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Search Results"
    ),

    '<section',

    '  class="search-results page-width"',

    '  data-search-results',

    '  data-section-id="{{ section.id }}"',

    ">",

    "",

    '  <div class="search-results__header">',

    "",

    '    <h1 class="search-results__title">',

    "      {% if search.performed %}",

    "        Search results for:",

    "        <span>{{ search.terms | escape }}</span>",

    "      {% else %}",

    "        Search",

    "      {% endif %}",

    "    </h1>",

    "",

    '    <form action="{{ routes.search_url }}" method="get"',

    '          class="search-results__form"',

    '          role="search">',

    "",

    '      <input',

    '        type="search"',

    '        name="q"',

    '        value="{{ search.terms | escape }}"',

    '        placeholder="Search products..."',

    '        autocomplete="off"',

    '        aria-label="Search products"',

    "      >",


    "",

    '      <input type="hidden" name="options[prefix]" value="last">',

    "",

    '      <button type="submit" class="button button--primary">',

    "        Search",

    "      </button>",

    "",

    "    </form>",

    "",

    "  </div>",

    "",

    "  {% if search.performed %}",

    "",

    '    <div class="search-results__count">',

    "      {{ search.results_count }} results",

    "    </div>",

    "",

    "    {% paginate search.results by section.settings.products_per_page %}",

    "",

    '      <div class="product-grid search-results__grid">',

    "",

    "        {% for item in search.results %}",

    "",

    "          {% if item.object_type == 'product' %}",

    "",

    "            {% render 'product-card', product: item %}",

    "",

    "          {% elsif item.object_type == 'article' %}",

    "",

    "            {% render 'article-card', article: item %}",

    "",

    "          {% else %}",

    "",

    '            <article class="search-result">',

    "",

    '              <h2>',

    '                <a href="{{ item.url }}">',

    "                  {{ item.title | escape }}",

    "                </a>",

    "              </h2>",

    "",

    '              <p>',

    "                {{ item.content | strip_html | truncate: 180 }}",

    "              </p>",

    "",

    "            </article>",

    "",

    "          {% endif %}",

    "",

    "        {% else %}",

    "",

    '          <div class="search-results__empty">',

    "            <h2>No results found</h2>",

    "            <p>Try another search term.</p>",

    "          </div>",

    "",

    "        {% endfor %}",

    "",

    "      </div>",

    "",

    "      {% render 'pagination' %}",

    "",

    "    {% endpaginate %}",

    "",

    "  {% endif %}",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</section>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Main Blog
|--------------------------------------------------------------------------
*/

const buildMainBlogSection = () => {

  const schema = {

    name:
      "Blog",

    settings: [

      settingSchema(
        "posts_per_page",
        "range",
        "Posts per page",
        12
      ),

      settingSchema(
        "show_image",
        "checkbox",
        "Show article image",
        true
      ),

      settingSchema(
        "show_excerpt",
        "checkbox",
        "Show excerpt",
        true
      )

    ],

    presets: [

      {
        name:
          "Blog"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Main Blog"
    ),

    '<section class="main-blog page-width">',

    "",

    '  <header class="main-blog__header">',

    "",

    "    <h1>",

    "      {{ blog.title | escape }}",

    "    </h1>",

    "",

    "    {% if blog.description != blank %}",

    '      <div class="rte">',

    "        {{ blog.description }}",

    "      </div>",

    "    {% endif %}",

    "",

    "  </header>",

    "",

    "  {% paginate blog.articles by section.settings.posts_per_page %}",

    "",

    '    <div class="article-grid">',

    "",

    "      {% for article in blog.articles %}",

    "",

    "        {% render 'article-card', article: article %}",

    "",

    "      {% else %}",

    "",

    '        <div class="blog-empty">',

    "          <h2>No articles yet</h2>",

    "          <p>Check back soon for new content.</p>",

    "        </div>",

    "",

    "      {% endfor %}",

    "",

    "    </div>",

    "",

    "    {% render 'pagination' %}",

    "",

    "  {% endpaginate %}",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</section>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Main Article
|--------------------------------------------------------------------------
*/

const buildMainArticleSection = () => {

  const schema = {

    name:
      "Article",

    settings: [

      settingSchema(
        "show_author",
        "checkbox",
        "Show author",
        true
      ),

      settingSchema(
        "show_date",
        "checkbox",
        "Show date",
        true
      ),

      settingSchema(
        "show_share",
        "checkbox",
        "Show sharing",
        true
      )

    ],

    presets: [

      {
        name:
          "Article"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Main Article"
    ),

    '<article class="main-article page-width">',

    "",

    '<header class="main-article__header">',

    "",

    '<a href="{{ blog.url }}" class="main-article__back">',

    "← Back to {{ blog.title | escape }}",

    "</a>",

    "",

    "<h1>",

    "{{ article.title | escape }}",

    "</h1>",

    "",

    '<div class="main-article__meta">',

    "",

    "{% if section.settings.show_date %}",

    "  <time datetime=\"{{ article.published_at | date: '%Y-%m-%d' }}\">",

    "    {{ article.published_at | date: '%B %d, %Y' }}",

    "  </time>",

    "{% endif %}",

    "",

    "{% if section.settings.show_author %}",

    "  <span>",

    "    By {{ article.author | escape }}",

    "  </span>",

    "{% endif %}",

    "",

    "</div>",

    "",

    "</header>",

    "",

    "{% if article.image != blank %}",

    "",

    '<div class="main-article__image">',

    "",

    "{{ article.image | image_url: width: 1800 | image_tag:",

    "  loading: 'eager',",

    "  class: 'main-article__image-img'",

    "}}",

    "",

    "</div>",

    "",

    "{% endif %}",

    "",

    '<div class="main-article__content rte">',

    "",

    "{{ article.content }}",

    "",

    "</div>",

    "",

    "{% if section.settings.show_share %}",

    "",

    '<div class="main-article__share">',

    "  <span>Share:</span>",

    "",

    '  <a',

    '    href="https://www.facebook.com/sharer/sharer.php?u={{ shop.url }}{{ article.url | url_encode }}"',

    '    target="_blank"',

    '    rel="noopener noreferrer">',

    "    Facebook",

    "  </a>",

    "",

    '  <a',

    '    href="https://twitter.com/intent/tweet?url={{ shop.url }}{{ article.url | url_encode }}&text={{ article.title | url_encode }}"',

    '    target="_blank"',

    '    rel="noopener noreferrer">',

    "    X",

    "  </a>",

    "",

    "</div>",

    "",

    "{% endif %}",

    "",

    "</article>",

    "",

    buildNativeSectionSchema(
      schema
    )

  ]);

};


/*
|--------------------------------------------------------------------------
| Related Articles
|--------------------------------------------------------------------------
*/

const buildRelatedArticlesSection = () => {

  const schema = {

    name:
      "Related articles",

    settings: [

      settingSchema(
        "heading",
        "text",
        "Heading",
        "Related articles"
      ),

      settingSchema(
        "articles_to_show",
        "range",
        "Articles to show",
        3
      )

    ],

    presets: [

      {
        name:
          "Related articles"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Related Articles"
    ),

    '<section class="related-articles page-width">',

    "",

    "<h2>",

    "{{ section.settings.heading | escape }}",

    "</h2>",

    "",

    '<div class="article-grid">',

    "",

    "{% assign related_count = 0 %}",

    "",

    "{% for related_article in blog.articles %}",

    "",

    "{% if related_article.id != article.id and related_count < section.settings.articles_to_show %}",

    "",

    "{% render 'article-card', article: related_article %}",

    "",

    "{% assign related_count = related_count | plus: 1 %}",

    "",

    "{% endif %}",

    "",

    "{% endfor %}",

    "",

    "</div>",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</section>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Contact Form
|--------------------------------------------------------------------------
*/

const buildContactFormSection = () => {

  const schema = {

    name:
      "Contact form",

    settings: [

      settingSchema(
        "heading",
        "text",
        "Heading",
        "Contact us"
      ),

      settingSchema(
        "show_phone",
        "checkbox",
        "Show phone field",
        true
      ),

      settingSchema(
        "show_address",
        "checkbox",
        "Show store address",
        true
      )

    ],

    presets: [

      {
        name:
          "Contact form"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Contact Form"
    ),

    '<section class="contact-section page-width">',

    "",

    '<div class="contact-section__grid">',

    "",

    '<div class="contact-section__content">',

    "",

    "<h1>",

    "{{ section.settings.heading | escape }}",

    "</h1>",

    "",

    "{% if section.settings.show_address and shop.address != blank %}",

    "",

    '<address class="contact-address">',

    "  {{ shop.address | format_address }}",

    "</address>",

    "",

    "{% endif %}",

    "",

    "</div>",

    "",

    '<div class="contact-section__form">',

    "",

    "{% form 'contact' %}",

    "",

    "{% if form.posted_successfully? %}",

    "",

    '<div class="form-success" role="status">',

    "Thank you. Your message has been sent.",

    "</div>",

    "",

    "{% endif %}",

    "",

    "{{ form.errors | default_errors }}",

    "",

    '<label for="ContactName">',

    "Name",

    "</label>",

    "",

    "<input",

    "  id=\"ContactName\"",

    "  type=\"text\"",

    "  name=\"contact[name]\"",

    "  autocomplete=\"name\"",

    "  required",

    "  value=\"{{ form.name | escape }}\"",

    ">",

    "",

    '<label for="ContactEmail">',

    "Email",

    "</label>",

    "",

    "<input",

    "  id=\"ContactEmail\"",

    "  type=\"email\"",

    "  name=\"contact[email]\"",

    "  autocomplete=\"email\"",

    "  required",

    "  value=\"{{ form.email | escape }}\"",

    ">",

    "",

    "{% if section.settings.show_phone %}",

    "",

    '<label for="ContactPhone">',

    "Phone",

    "</label>",

    "",

    "<input",

    "  id=\"ContactPhone\"",

    "  type=\"tel\"",

    "  name=\"contact[phone]\"",

    "  autocomplete=\"tel\"",

    ">",

    "",

    "{% endif %}",

    "",

    '<label for="ContactMessage">',

    "Message",

    "</label>",

    "",

    "<textarea",

    "  id=\"ContactMessage\"",

    "  name=\"contact[body]\"",

    "  rows=\"7\"",

    "  required",

    ">{{ form.body | escape }}</textarea>",

    "",

    '<button type="submit" class="button button--primary">',

    "Send message",

    "</button>",

    "",

    "{% endform %}",

    "",

    "</div>",

    "",

    "</div>",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</section>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Main Page
|--------------------------------------------------------------------------
*/

const buildMainPageSection = () => {

  const schema = {

    name:
      "Page",

    settings: [

      settingSchema(
        "show_title",
        "checkbox",
        "Show title",
        true
      ),

      settingSchema(
        "width",
        "select",
        "Content width",
        "narrow",
        [
          {
            value: "narrow",
            label: "Narrow"
          },
          {
            value: "wide",
            label: "Wide"
          }
        ]
      )

    ],

    presets: [

      {
        name:
          "Page"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Main Page"
    ),

    '<section class="main-page page-width">',

    "",

    "{% if section.settings.show_title %}",

    "",

    "<h1>",

    "{{ page.title | escape }}",

    "</h1>",

    "",

    "{% endif %}",

    "",

    '<div class="main-page__content rte">',

    "",

    "{{ page.content }}",

    "",

    "</div>",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</section>"

  ]);

};


/*
|--------------------------------------------------------------------------
| 404 Page
|--------------------------------------------------------------------------
*/

const build404Section = () => {

  const schema = {

    name:
      "404 page",

    settings: [

      settingSchema(
        "heading",
        "text",
        "Heading",
        "Page not found"
      ),

      settingSchema(
        "text",
        "textarea",
        "Text",
        "The page you're looking for doesn't exist or may have moved."
      )

    ],

    presets: [

      {
        name:
          "404 page"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI 404"
    ),

    '<section class="not-found page-width">',

    "",

    '<div class="not-found__content">',

    "",

    "<span class=\"not-found__code\">404</span>",

    "",

    "<h1>",

    "{{ section.settings.heading | escape }}",

    "</h1>",

    "",

    "<p>",

    "{{ section.settings.text | escape }}",

    "</p>",

    "",

    '<a href="{{ routes.root_url }}"',

    '   class="button button--primary">',

    "Back to home",

    "</a>",

    "",

    '<form action="{{ routes.search_url }}" method="get"',

    '      class="not-found__search">',

    "",

    '<input type="search"',

    '       name="q"',

    '       placeholder="Search our store..."',

    '       aria-label="Search our store">',

    "",

    '<button type="submit" class="button">',

    "Search",

    "</button>",

    "",

    "</form>",

    "",

    "</div>",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</section>"

  ]);

};


/*
|--------------------------------------------------------------------------
| List Collections
|--------------------------------------------------------------------------
*/

const buildMainListCollectionsSection = () => {

  const schema = {

    name:
      "Collections",

    settings: [

      settingSchema(
        "columns_desktop",
        "range",
        "Desktop columns",
        3
      ),

      settingSchema(
        "show_description",
        "checkbox",
        "Show description",
        true
      )

    ],

    presets: [

      {
        name:
          "Collections"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Collections List"
    ),

    '<section class="collections-list page-width">',

    "",

    "<h1>",

    "{{ page_title | escape }}",

    "</h1>",

    "",

    '<div class="collections-grid">',

    "",

    "{% for collection in collections %}",

    "",

    '<article class="collection-card">',

    "",

    '<a href="{{ collection.url }}">',

    "",

    "{% if collection.featured_image != blank %}",

    "",

    "{{ collection.featured_image | image_url: width: 700 | image_tag:",

    "  loading: 'lazy',",

    "  class: 'collection-card__image'",

    "}}",

    "",

    "{% endif %}",

    "",

    "<h2>",

    "{{ collection.title | escape }}",

    "</h2>",

    "",

    "{% if section.settings.show_description and collection.description != blank %}",

    "",

    "<p>",

    "{{ collection.description | strip_html | truncate: 120 }}",

    "</p>",

    "",

    "{% endif %}",

    "",

    "</a>",

    "",

    "</article>",

    "",

    "{% endfor %}",

    "",

    "</div>",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</section>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Password Header
|--------------------------------------------------------------------------
*/

const buildPasswordHeaderSection = () => {

  const schema = {

    name:
      "Password header",

    settings: [

      settingSchema(
        "logo_width",
        "range",
        "Logo width",
        140
      )

    ],

    presets: [

      {
        name:
          "Password header"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Password Header"
    ),

    '<header class="password-header">',

    "",

    "{% if settings.logo != blank %}",

    "",

    "{{ settings.logo | image_url: width: section.settings.logo_width | image_tag:",

    "  class: 'password-header__logo',",

    "  alt: shop.name",

    "}}",

    "",

    "{% else %}",

    "",

    '<a href="{{ routes.root_url }}">',

    "{{ shop.name }}",

    "</a>",

    "",

    "{% endif %}",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</header>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Password Content
|--------------------------------------------------------------------------
*/

const buildPasswordContentSection = () => {

  const schema = {

    name:
      "Password content",

    settings: [

      settingSchema(
        "heading",
        "text",
        "Heading",
        "Opening soon"
      ),

      settingSchema(
        "text",
        "textarea",
        "Text",
        "We're working on something great. Sign up for updates."
      ),

      settingSchema(
        "show_social",
        "checkbox",
        "Show social links",
        true
      )

    ],

    presets: [

      {
        name:
          "Password content"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Password Content"
    ),

    '<main class="password-content page-width">',

    "",

    "<h1>",

    "{{ section.settings.heading | escape }}",

    "</h1>",

    "",

    "<p>",

    "{{ section.settings.text | escape }}",

    "</p>",

    "",

    "{% form 'customer' %}",

    "",

    '<input type="hidden" name="contact[tags]" value="prospect, password page">',

    "",

    '<input',

    '  type="email"',

    '  name="contact[email]"',

    '  placeholder="Email address"',

    '  autocomplete="email"',

    '  required',

    ">",

    "",

    '<button type="submit" class="button button--primary">',

    "Notify me",

    "</button>",

    "",

    "{% endform %}",

    "",

    "{% if shop.password_message != blank %}",

    "",

    '<div class="password-message rte">',

    "{{ shop.password_message }}",

    "</div>",

    "",

    "{% endif %}",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</main>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Gift Card
|--------------------------------------------------------------------------
*/

const buildGiftCardSection = () => {

  const schema = {

    name:
      "Gift card",

    settings: [

      settingSchema(
        "show_qr",
        "checkbox",
        "Show QR code",
        true
      ),

      settingSchema(
        "show_print",
        "checkbox",
        "Show print button",
        true
      )

    ],

    presets: [

      {
        name:
          "Gift card"
      }

    ]

  };


  return joinLines([

    liquidComment(
      "StoreForge AI Gift Card"
    ),

    '<main class="gift-card page-width">',

    "",

    '<div class="gift-card__container">',

    "",

    '<h1>Gift card</h1>',

    "",

    "{% if gift_card.enabled %}",

    "",

    '<div class="gift-card__code">',

    "<strong>",

    "{{ gift_card.code | format_code }}",

    "</strong>",

    "</div>",

    "",

    '<p class="gift-card__balance">',

    "{{ gift_card.initial_value | money }}",

    "</p>",

    "",

    "{% if gift_card.expired %}",

    "",

    '<p class="gift-card__status">',

    "This gift card has expired.",

    "</p>",

    "",

    "{% elsif gift_card.expired == false and gift_card.balance != gift_card.initial_value %}",

    "",

    '<p class="gift-card__remaining">',

    "Remaining balance: {{ gift_card.balance | money }}",

    "</p>",

    "",

    "{% endif %}",

    "",

    "{% if section.settings.show_qr %}",

    "",

    '<div class="gift-card__qr">',

    "{{ gift_card.qr_identifier | qr_code }}",

    "</div>",

    "",

    "{% endif %}",

    "",

    "{% if section.settings.show_print %}",

    "",

    '<button type="button"',

    '        class="button"',

    '        onclick="window.print()">',

    "Print gift card",

    "</button>",

    "",

    "{% endif %}",

    "",

    "{% else %}",

    "",

    "<p>This gift card is not available.</p>",

    "",

    "{% endif %}",

    "",

    "</div>",

    "",

    buildNativeSectionSchema(
      schema
    ),

    "</main>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Generate Part 9 Sections
|--------------------------------------------------------------------------
*/

const generateUtilitySections = (
  context
) => {

  addLiquidFile(

    context,

    "snippets/article-card.liquid",

    buildArticleCardSnippet()

  );


  addLiquidFile(

    context,

    "snippets/pagination.liquid",

    buildPaginationSnippet()

  );


  addLiquidFile(

    context,

    "sections/search-results.liquid",

    buildSearchResultsSection()

  );


  addLiquidFile(

    context,

    "sections/main-blog.liquid",

    buildMainBlogSection()

  );


  addLiquidFile(

    context,

    "sections/main-article.liquid",

    buildMainArticleSection()

  );


  addLiquidFile(

    context,

    "sections/related-articles.liquid",

    buildRelatedArticlesSection()

  );


  addLiquidFile(

    context,

    "sections/contact-form.liquid",

    buildContactFormSection()

  );


  addLiquidFile(

    context,

    "sections/main-page.liquid",

    buildMainPageSection()

  );


  addLiquidFile(

    context,

    "sections/404.liquid",

    build404Section()

  );


  addLiquidFile(

    context,

    "sections/main-list-collections.liquid",

    buildMainListCollectionsSection()

  );


  addLiquidFile(

    context,

    "sections/password-header.liquid",

    buildPasswordHeaderSection()

  );


  addLiquidFile(

    context,

    "sections/password-content.liquid",

    buildPasswordContentSection()

  );


  addLiquidFile(

    context,

    "sections/gift-card.liquid",

    buildGiftCardSection()

  );


  return context;

};


/*
|--------------------------------------------------------------------------
| Search JavaScript
|--------------------------------------------------------------------------
*/

const buildSearchJavascript = () => {

  return joinLines([

    "/* StoreForge AI Search */",

    "",

    "(function () {",

    "  'use strict';",

    "",

    "  function initSearch() {",

    "",

    "    document.querySelectorAll('[data-search-results]').forEach(function (section) {",

    "",

    "      const form = section.querySelector('.search-results__form');",

    "",

    "      if (!form) return;",

    "",

    "      form.addEventListener('submit', function () {",

    "        const input = form.querySelector('[name=\"q\"]');",

    "",

    "        if (!input || !input.value.trim()) {",

    "          return;",

    "        }",

    "      });",

    "",

    "    });",

    "  }",

    "",

    "  if (document.readyState === 'loading') {",

    "    document.addEventListener('DOMContentLoaded', initSearch);",

    "  } else {",

    "    initSearch();",

    "  }",

    "",

    "})();"

  ]);

};


/*
|--------------------------------------------------------------------------
| Global Utility JavaScript
|--------------------------------------------------------------------------
*/

const buildUtilityJavascript = () => {

  return joinLines([

    "/* StoreForge AI Utility UI */",

    "",

    "(function () {",

    "  'use strict';",

    "",

    "  function closeAnnouncement(button) {",

    "    const bar = button.closest('.announcement-bar');",

    "    if (!bar) return;",

    "",

    "    bar.setAttribute('hidden', 'hidden');",

    "",

    "    try {",

    "      sessionStorage.setItem(",

    "        'storeforge-announcement-hidden',",

    "        '1'",

    "      );",

    "    } catch (error) {}",

    "  }",

    "",

    "  function restoreAnnouncementState() {",

    "    try {",

    "      if (sessionStorage.getItem('storeforge-announcement-hidden') === '1') {",

    "        document.querySelectorAll('.announcement-bar').forEach(function (bar) {",

    "          bar.setAttribute('hidden', 'hidden');",

    "        });",

    "      }",

    "    } catch (error) {}",

    "  }",

    "",

    "  function bindEvents() {",

    "",

    "    document.addEventListener('click', function (event) {",

    "",

    "      const announcementClose = event.target.closest('[data-announcement-close]');",

    "",

    "      if (announcementClose) {",

    "        closeAnnouncement(announcementClose);",

    "        return;",

    "      }",

    "",

    "      const mobileOpen = event.target.closest('[data-mobile-menu-open]');",

    "",

    "      if (mobileOpen) {",

    "        const menu = document.querySelector('[data-mobile-menu]');",

    "",

    "        if (menu) {",

    "          menu.setAttribute('aria-hidden', 'false');",

    "          menu.classList.add('is-open');",

    "        }",

    "",

    "        return;",

    "      }",

    "",

    "      const mobileClose = event.target.closest('[data-mobile-menu-close]');",

    "",

    "      if (mobileClose) {",

    "        const menu = document.querySelector('[data-mobile-menu]');",

    "",

    "        if (menu) {",

    "          menu.setAttribute('aria-hidden', 'true');",

    "          menu.classList.remove('is-open');",

    "        }",

    "      }",

    "    });",

    "  }",

    "",

    "  function init() {",

    "    restoreAnnouncementState();",

    "    bindEvents();",

    "  }",

    "",

    "  if (document.readyState === 'loading') {",

    "    document.addEventListener('DOMContentLoaded', init);",

    "  } else {",

    "    init();",

    "  }",

    "",

    "})();"

  ]);

};


/*
|--------------------------------------------------------------------------
| Register Part 9
|--------------------------------------------------------------------------
*/

const registerPart9Files = (
  context
) => {

  generateUtilitySections(
    context
  );


  addAssetFile(

    context,

    "assets/search.js",

    buildSearchJavascript()

  );


  addAssetFile(

    context,

    "assets/storefront-utility.js",

    buildUtilityJavascript()

  );


  return context;

};


/*
|--------------------------------------------------------------------------
| PART 9 EXPORTS
|--------------------------------------------------------------------------
*/

if (
  typeof module !== "undefined" &&
  module.exports
) {

  module.exports = {

    buildArticleCardSnippet,

    buildPaginationSnippet,

    buildSearchResultsSection,

    buildMainBlogSection,

    buildMainArticleSection,

    buildRelatedArticlesSection,

    buildContactFormSection,

    buildMainPageSection,

    build404Section,

    buildMainListCollectionsSection,

    buildPasswordHeaderSection,

    buildPasswordContentSection,

    buildGiftCardSection,

    buildSearchJavascript,

    buildUtilityJavascript,

    generateUtilitySections,

    registerPart9Files

  };

}


/*
|--------------------------------------------------------------------------
| PART 9 / 10 — COMPLETE
|--------------------------------------------------------------------------
|
| Search:
|
| ✓ Search form
| ✓ Search query
| ✓ Product results
| ✓ Article results
| ✓ Generic results
| ✓ Result count
| ✓ Pagination
| ✓ Empty state
|
| Blog:
|
| ✓ Blog title
| ✓ Blog description
| ✓ Article cards
| ✓ Pagination
|
| Article:
|
| ✓ Article title
| ✓ Featured image
| ✓ Author
| ✓ Date
| ✓ Article content
| ✓ Social sharing
| ✓ Related articles
|
| Pages:
|
| ✓ Standard page
| ✓ Contact form
| ✓ Contact validation
| ✓ Store address
| ✓ 404 page
| ✓ Search from 404
|
| Other Shopify templates:
|
| ✓ Collections list
| ✓ Password page
| ✓ Gift card
|
| Utility:
|
| ✓ Announcement close
| ✓ Mobile menu
| ✓ Search JS
| ✓ Utility JS
|
|--------------------------------------------------------------------------
| NEXT — PART 10 / 10
|--------------------------------------------------------------------------
|
| Final integration layer:
|
| - Global settings
| - theme.liquid
| - settings_schema.json
| - CSS variables
| - responsive CSS
| - accessibility
| - SEO
| - favicon
| - global JavaScript
| - asset registration
| - theme manifest
| - final generator
| - validation
| - final exports
|
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| PART 10 / 10
| FINAL THEME INTEGRATION + VALIDATION + EXPORTS
|--------------------------------------------------------------------------
|
| This is the final integration layer of aiLiquid.service.js.
|
| Includes:
|
| ✓ theme.liquid
| ✓ Global CSS
| ✓ Responsive CSS
| ✓ Accessibility CSS
| ✓ Global JavaScript
| ✓ Shopify settings schema
| ✓ Theme metadata
| ✓ SEO
| ✓ Favicon
| ✓ Cart drawer hooks
| ✓ Mobile navigation
| ✓ Announcement bar
| ✓ AI-ready data attributes
| ✓ Section registration
| ✓ Asset registration
| ✓ Validation
| ✓ Final theme generator
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Global Theme Liquid
|--------------------------------------------------------------------------
*/

const buildThemeLiquid = () => {

  return joinLines([

    liquidComment(
      "StoreForge AI - Main Theme Layout"
    ),

    "<!doctype html>",

    "<html",

    '  class="no-js"',

    '  lang="{{ request.locale.iso_code }}"',

    ">",

    "",

    "<head>",

    "",

    '  <meta charset="utf-8">',

    "",

    '  <meta http-equiv="X-UA-Compatible" content="IE=edge">',

    "",

    '  <meta name="viewport" content="width=device-width,initial-scale=1">',

    "",

    '<meta name="theme-color" content="{{ settings.color_accent }}">',

    "",

    "{% if page_description %}",

    '  <meta name="description" content="{{ page_description | escape }}">',

    "{% endif %}",

    "",

    "<link rel=\"canonical\" href=\"{{ canonical_url }}\">",

    "",

    "{% if settings.favicon != blank %}",

    "",

    '<link',

    '  rel="icon"',

    '  type="image/png"',

    '  href="{{ settings.favicon | image_url: width: 64 }}"',

    ">",

    "",

    "{% endif %}",

    "",

    "<title>",

    "{{ page_title }}",

    "{% if current_tags %}",

    " — {{ current_tags | join: ', ' }}",

    "{% endif %}",

    "{% if current_page != 1 %}",

    " — Page {{ current_page }}",

    "{% endif %}",

    "{% unless page_title contains shop.name %}",

    " — {{ shop.name }}",

    "{% endunless %}",

    "</title>",

    "",

    "{% if template.name == 'index' %}",

    "",

    '<meta property="og:type" content="website">',

    "",

    "{% elsif template.name == 'product' %}",

    "",

    '<meta property="og:type" content="product">',

    "",

    "{% elsif template.name == 'article' %}",

    "",

    '<meta property="og:type" content="article">',

    "",

    "{% else %}",

    "",

    '<meta property="og:type" content="website">',

    "",

    "{% endif %}",

    "",

    '<meta property="og:title" content="{{ page_title | escape }}">',

    "",

    '<meta property="og:url" content="{{ canonical_url }}">',

    "",

    '<meta property="og:site_name" content="{{ shop.name | escape }}">',

    "",

    "{% if page_description %}",

    '<meta property="og:description" content="{{ page_description | escape }}">',

    "{% endif %}",

    "",

    "{% if page_image %}",

    '<meta property="og:image" content="{{ page_image | image_url: width: 1200 }}">',

    "{% endif %}",

    "",

    '<meta name="twitter:card" content="summary_large_image">',

    "",

    '<meta name="twitter:title" content="{{ page_title | escape }}">',

    "",

    "{% if page_description %}",

    '<meta name="twitter:description" content="{{ page_description | escape }}">',

    "{% endif %}",

    "",

    "<script>",

    "  document.documentElement.classList.remove('no-js');",

    "  document.documentElement.classList.add('js');",

    "</script>",

    "",

    "{{ content_for_header }}",

    "",

    "{{ 'theme.css' | asset_url | stylesheet_tag }}",

    "",

    "</head>",

    "",

    "<body",

    '  class="template-{{ template.name | handle }}"',

    '  data-template="{{ template.name }}"',

    '  data-shop-domain="{{ shop.permanent_domain }}"',

    '  data-currency="{{ cart.currency.iso_code }}"',

    ">",

    "",

    "{% sections 'header-group' %}",

    "",

    '<main id="MainContent"',

    '      class="content-for-layout"',

    '      role="main"',

    '      tabindex="-1">',

    "",

    "{{ content_for_layout }}",

    "",

    "</main>",

    "",

    "{% sections 'footer-group' %}",

    "",

    "{% if settings.enable_cart_drawer %}",

    "",

    '<div',

    '  id="StoreForgeCartDrawer"',

    '  class="cart-drawer"',

    '  data-cart-drawer',

    '  aria-hidden="true"',

    ">",

    "",

    '  <div class="cart-drawer__overlay" data-cart-close></div>',

    "",

    '  <aside class="cart-drawer__panel"',

    '         role="dialog"',

    '         aria-modal="true"',

    '         aria-label="Shopping cart">',

    "",

    '    <div class="cart-drawer__header">',

    "",

    "      <h2>Cart</h2>",

    "",

    '      <button',

    '        type="button"',

    '        class="cart-drawer__close"',

    '        data-cart-close',

    '        aria-label="Close cart">',

    "        ×",

    "      </button>",

    "",

    "    </div>",

    "",

    '    <div class="cart-drawer__content" data-cart-content>',

    "",

    "      {% if cart.item_count > 0 %}",

    "",

    "        {% for item in cart.items %}",

    "",

    '          <div class="cart-item"',

    '               data-cart-item="{{ item.key }}">',

    "",

    '            {% if item.image != blank %}',

    "",

    "              {{ item.image | image_url: width: 160 | image_tag:",

    "                loading: 'lazy',",

    "                class: 'cart-item__image'",

    "                alt: item.title",

    "              }}",

    "",

    "            {% endif %}",

    "",

    '            <div class="cart-item__info">',

    "",

    "              <a href=\"{{ item.url }}\">",

    "                {{ item.product.title | escape }}",

    "              </a>",

    "",

    "              {% unless item.product.has_only_default_variant %}",

    "",

    "                <small>",

    "                  {{ item.variant.title | escape }}",

    "                </small>",

    "",

    "              {% endunless %}",

    "",

    "              <span>",

    "                {{ item.final_line_price | money }}",

    "              </span>",

    "",

    "            </div>",

    "",

    "          </div>",

    "",

    "        {% endfor %}",

    "",

    "      {% else %}",

    "",

    '        <p class="cart-drawer__empty">',

    "          Your cart is empty.",

    "        </p>",

    "",

    "      {% endif %}",

    "",

    "    </div>",

    "",

    '    <div class="cart-drawer__footer">',

    "",

    '      <div class="cart-drawer__subtotal">',

    "        <span>Subtotal</span>",

    "        <strong>{{ cart.total_price | money }}</strong>",

    "      </div>",

    "",

    '      <a href="{{ routes.cart_url }}"',

    '         class="button button--primary button--full-width">',

    "        View cart",

    "      </a>",

    "",

    '      <form action="{{ routes.cart_url }}" method="post">',

    '        <button',

    '          type="submit"',

    '          name="checkout"',

    '          class="button button--secondary button--full-width">',

    "          Checkout",

    "        </button>",

    "      </form>",

    "",

    "    </div>",

    "",

    "  </aside>",

    "</div>",

    "",

    "{% endif %}",

    "",

    '<div class="storeforge-toast"',

    '     data-storeforge-toast',

    '     role="status"',

    '     aria-live="polite"',

    '     hidden></div>',

    "",

    "{{ 'theme.js' | asset_url | script_tag }}",

    "",

    "{% if settings.enable_product_collection_js %}",

    "",

    "{{ 'product-collection.js' | asset_url | script_tag }}",

    "",

    "{% endif %}",

    "",

    "{{ 'search.js' | asset_url | script_tag }}",

    "",

    "{{ 'storefront-utility.js' | asset_url | script_tag }}",

    "",

    "</body>",

    "</html>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Global CSS
|--------------------------------------------------------------------------
*/

const buildGlobalThemeCss = () => {

  return joinLines([

    "/*",

    " * StoreForge AI",

    " * Global Theme CSS",

    " */",

    "",

    ":root {",

    "  --sf-color-primary: #FF3B2F;",

    "  --sf-color-background: #1e3928;",

    "  --sf-color-text: #172018;",

    "  --sf-color-muted: #6b746e;",

    "  --sf-color-border: #dfe5df;",

    "  --sf-color-surface: #ffffff;",

    "  --sf-color-surface-soft: #f5f7f5;",

    "  --sf-color-success: #198754;",

    "  --sf-color-danger: #dc3545;",

    "  --sf-radius-sm: 6px;",

    "  --sf-radius-md: 10px;",

    "  --sf-radius-lg: 18px;",

    "  --sf-shadow-sm: 0 2px 8px rgba(0,0,0,.08);",

    "  --sf-shadow-md: 0 8px 30px rgba(0,0,0,.12);",

    "  --sf-container: 1280px;",

    "  --sf-space: 8px;",

    "}",

    "",

    "* {",

    "  box-sizing: border-box;",

    "}",

    "",

    "html {",

    "  scroll-behavior: smooth;",

    "}",

    "",

    "body {",

    "  margin: 0;",

    "  min-height: 100vh;",

    "  background: var(--sf-color-surface);",

    "  color: var(--sf-color-text);",

    "  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',",

    "    Roboto, Helvetica, Arial, sans-serif;",

    "  line-height: 1.6;",

    "}",

    "",

    "img,",

    "svg,",

    "video {",

    "  max-width: 100%;",

    "  height: auto;",

    "}",

    "",

    "button,",

    "input,",

    "textarea,",

    "select {",

    "  font: inherit;",

    "}",

    "",

    "button,",

    "a {",

    "  -webkit-tap-highlight-color: transparent;",

    "}",

    "",

    "a {",

    "  color: inherit;",

    "}",

    "",

    "button {",

    "  cursor: pointer;",

    "}",

    "",

    ".page-width {",

    "  width: min(calc(100% - 40px), var(--sf-container));",

    "  margin-inline: auto;",

    "}",

    "",

    ".button {",

    "  display: inline-flex;",

    "  align-items: center;",

    "  justify-content: center;",

    "  min-height: 46px;",

    "  padding: 10px 20px;",

    "  border: 1px solid transparent;",

    "  border-radius: var(--sf-radius-md);",

    "  text-decoration: none;",

    "  transition: .2s ease;",

    "  font-weight: 600;",

    "}",

    "",

    ".button--primary {",

    "  background: var(--sf-color-primary);",

    "  color: #ffffff;",

    "}",

    "",

    ".button--primary:hover {",

    "  transform: translateY(-1px);",

    "  box-shadow: var(--sf-shadow-sm);",

    "}",

    "",

    ".button--secondary {",

    "  background: var(--sf-color-background);",

    "  color: #ffffff;",

    "}",

    "",

    ".button--disabled,",

    ".button:disabled {",

    "  opacity: .55;",

    "  cursor: not-allowed;",

    "}",

    "",

    ".button--full-width {",

    "  width: 100%;",

    "}",

    "",

    ".product-grid {",

    "  display: grid;",

    "  grid-template-columns: repeat(4, minmax(0, 1fr));",

    "  gap: 24px;",

    "}",

    "",

    ".article-grid {",

    "  display: grid;",

    "  grid-template-columns: repeat(3, minmax(0, 1fr));",

    "  gap: 28px;",

    "}",

    "",

    ".product-card,",

    ".article-card,",

    ".collection-card {",

    "  background: var(--sf-color-surface);",

    "  border: 1px solid var(--sf-color-border);",

    "  border-radius: var(--sf-radius-lg);",

    "  overflow: hidden;",

    "  box-shadow: var(--sf-shadow-sm);",

    "}",

    "",

    ".product-card__content,",

    ".article-card__content,",

    ".collection-card__content {",

    "  padding: 18px;",

    "}",

    "",

    ".product-card__image,",

    ".article-card__image {",

    "  display: block;",

    "  aspect-ratio: 1 / 1;",

    "  overflow: hidden;",

    "  background: var(--sf-color-surface-soft);",

    "}",

    "",

    ".product-card__img,",

    ".article-card__image-img {",

    "  width: 100%;",

    "  height: 100%;",

    "  object-fit: cover;",

    "  transition: transform .3s ease;",

    "}",

    "",

    ".product-card:hover .product-card__img,",

    ".article-card:hover .article-card__image-img {",

    "  transform: scale(1.03);",

    "}",

    "",

    ".product-card__title,",

    ".article-card__title {",

    "  margin: 0 0 8px;",

    "  font-size: 1.05rem;",

    "}",

    "",

    ".product-card__title a,",

    ".article-card__title a {",

    "  text-decoration: none;",

    "}",

    "",

    ".product-card__vendor,",

    ".product-card__sku,",

    ".article-card__date {",

    "  color: var(--sf-color-muted);",

    "  font-size: .85rem;",

    "}",

    "",

    ".product-card__price {",

    "  display: flex;",

    "  gap: 8px;",

    "  align-items: center;",

    "  margin: 12px 0 16px;",

    "  font-weight: 700;",

    "}",

    "",

    ".product-card__price s {",

    "  color: var(--sf-color-muted);",

    "  font-weight: 400;",

    "}",

    "",

    ".main-product__grid {",

    "  display: grid;",

    "  grid-template-columns: minmax(0, 1.1fr) minmax(360px, .9fr);",

    "  gap: 60px;",

    "  padding-block: 50px;",

    "}",

    "",

    ".main-product--sticky .main-product__info {",

    "  position: sticky;",

    "  top: 30px;",

    "  align-self: start;",

    "}",

    "",

    ".product-gallery__main {",

    "  border-radius: var(--sf-radius-lg);",

    "  overflow: hidden;",

    "  background: var(--sf-color-surface-soft);",

    "}",

    "",

    ".product-gallery__image {",

    "  display: block;",

    "  width: 100%;",

    "}",

    "",

    ".product-gallery__thumbs {",

    "  display: flex;",

    "  gap: 10px;",

    "  margin-top: 12px;",

    "  overflow-x: auto;",

    "  padding-bottom: 4px;",

    "}",

    "",

    ".product-gallery__thumb {",

    "  flex: 0 0 72px;",

    "  width: 72px;",

    "  height: 72px;",

    "  padding: 0;",

    "  border: 1px solid var(--sf-color-border);",

    "  border-radius: var(--sf-radius-sm);",

    "  overflow: hidden;",

    "  background: #fff;",

    "}",

    "",

    ".product-gallery__thumb-image {",

    "  width: 100%;",

    "  height: 100%;",

    "  object-fit: cover;",

    "}",

    "",

    ".product__title {",

    "  margin: 8px 0 14px;",

    "  font-size: clamp(2rem, 4vw, 3.2rem);",

    "  line-height: 1.1;",

    "}",

    "",

    ".product__price {",

    "  display: flex;",

    "  gap: 10px;",

    "  align-items: center;",

    "  margin-bottom: 20px;",

    "  font-size: 1.4rem;",

    "  font-weight: 700;",

    "}",

    "",

    ".product__price s {",

    "  color: var(--sf-color-muted);",

    "  font-size: 1rem;",

    "}",

    "",

    ".product__description {",

    "  margin: 24px 0;",

    "}",

    "",

    ".product-form__option {",

    "  border: 0;",

    "  padding: 0;",

    "  margin: 0 0 20px;",

    "}",

    "",

    ".product-form__option legend {",

    "  font-weight: 600;",

    "  margin-bottom: 10px;",

    "}",

    "",

    ".product-form__option-values {",

    "  display: flex;",

    "  flex-wrap: wrap;",

    "  gap: 8px;",

    "}",

    "",

    ".product-form__option-value input {",

    "  position: absolute;",

    "  opacity: 0;",

    "  pointer-events: none;",

    "}",

    "",

    ".product-form__option-value span {",

    "  display: inline-flex;",

    "  min-height: 42px;",

    "  align-items: center;",

    "  padding: 8px 14px;",

    "  border: 1px solid var(--sf-color-border);",

    "  border-radius: var(--sf-radius-sm);",

    "}",

    "",

    ".product-form__option-value input:checked + span {",

    "  border-color: var(--sf-color-primary);",

    "  box-shadow: 0 0 0 1px var(--sf-color-primary);",

    "}",

    "",

    ".quantity-selector {",

    "  display: inline-flex;",

    "  align-items: center;",

    "  border: 1px solid var(--sf-color-border);",

    "  border-radius: var(--sf-radius-md);",

    "  overflow: hidden;",

    "}",

    "",

    ".quantity-selector button {",

    "  width: 42px;",

    "  height: 44px;",

    "  border: 0;",

    "  background: var(--sf-color-surface-soft);",

    "}",

    "",

    ".quantity-selector input {",

    "  width: 55px;",

    "  height: 44px;",

    "  border: 0;",

    "  text-align: center;",

    "}",

    "",

    ".product-form__actions {",

    "  display: grid;",

    "  gap: 10px;",

    "  margin-top: 24px;",

    "}",

    "",

    ".collection-banner {",

    "  position: relative;",

    "  margin-block: 30px;",

    "  overflow: hidden;",

    "  border-radius: var(--sf-radius-lg);",

    "  background: var(--sf-color-background);",

    "  color: #fff;",

    "}",

    "",

    ".collection-banner__image {",

    "  max-height: 420px;",

    "  overflow: hidden;",

    "  opacity: .65;",

    "}",

    "",

    ".collection-banner__img {",

    "  width: 100%;",

    "  object-fit: cover;",

    "}",

    "",

    ".collection-banner__content {",

    "  padding: 45px;",

    "}",

    "",

    ".collection-tools {",

    "  display: flex;",

    "  justify-content: space-between;",

    "  gap: 20px;",

    "  margin: 25px 0;",

    "}",

    "",

    ".collection-filters {",

    "  display: flex;",

    "  flex-wrap: wrap;",

    "  gap: 10px;",

    "}",

    "",

    ".collection-filter {",

    "  border: 1px solid var(--sf-color-border);",

    "  border-radius: var(--sf-radius-sm);",

    "  padding: 10px 14px;",

    "}",

    "",

    ".collection-sort select {",

    "  min-height: 42px;",

    "  border: 1px solid var(--sf-color-border);",

    "  border-radius: var(--sf-radius-sm);",

    "  padding: 7px 12px;",

    "  background: #fff;",

    "}",

    "",

    ".pagination {",

    "  display: flex;",

    "  justify-content: center;",

    "  align-items: center;",

    "  gap: 10px;",

    "  margin: 40px 0;",

    "}",

    "",

    ".pagination a,",

    ".pagination span {",

    "  display: inline-flex;",

    "  min-width: 40px;",

    "  min-height: 40px;",

    "  align-items: center;",

    "  justify-content: center;",

    "  padding: 6px 10px;",

    "  border: 1px solid var(--sf-color-border);",

    "  border-radius: var(--sf-radius-sm);",

    "  text-decoration: none;",

    "}",

    "",

    ".main-article {",

    "  max-width: 900px;",

    "  padding-block: 60px;",

    "}",

    "",

    ".main-article__header {",

    "  text-align: center;",

    "  margin-bottom: 40px;",

    "}",

    "",

    ".main-article__header h1 {",

    "  font-size: clamp(2.2rem, 5vw, 4rem);",

    "  line-height: 1.1;",

    "}",

    "",

    ".main-article__image {",

    "  margin-bottom: 40px;",

    "  border-radius: var(--sf-radius-lg);",

    "  overflow: hidden;",

    "}",

    "",

    ".main-article__content {",

    "  font-size: 1.08rem;",

    "}",

    "",

    ".main-article__share {",

    "  display: flex;",

    "  gap: 14px;",

    "  margin-top: 40px;",

    "  padding-top: 20px;",

    "  border-top: 1px solid var(--sf-color-border);",

    "}",

    "",

    ".contact-section {",

    "  padding-block: 60px;",

    "}",

    "",

    ".contact-section__grid {",

    "  display: grid;",

    "  grid-template-columns: 1fr 1fr;",

    "  gap: 60px;",

    "}",

    "",

    ".contact-section input,",

    ".contact-section textarea {",

    "  display: block;",

    "  width: 100%;",

    "  margin: 7px 0 20px;",

    "  padding: 13px 14px;",

    "  border: 1px solid var(--sf-color-border);",

    "  border-radius: var(--sf-radius-md);",

    "  background: #fff;",

    "}",

    "",

    ".not-found {",

    "  min-height: 65vh;",

    "  display: grid;",

    "  place-items: center;",

    "  text-align: center;",

    "}",

    "",

    ".not-found__code {",

    "  display: block;",

    "  font-size: clamp(5rem, 15vw, 12rem);",

    "  line-height: .9;",

    "  font-weight: 800;",

    "  color: var(--sf-color-primary);",

    "}",

    "",

    ".not-found__search {",

    "  display: flex;",

    "  gap: 10px;",

    "  max-width: 600px;",

    "  margin: 25px auto 0;",

    "}",

    "",

    ".not-found__search input {",

    "  flex: 1;",

    "  min-width: 0;",

    "  padding: 12px;",

    "  border: 1px solid var(--sf-color-border);",

    "  border-radius: var(--sf-radius-md);",

    "}",

    "",

    ".cart-drawer {",

    "  position: fixed;",

    "  inset: 0;",

    "  z-index: 9998;",

    "  visibility: hidden;",

    "  pointer-events: none;",

    "}",

    "",

    ".cart-drawer[aria-hidden='false'] {",

    "  visibility: visible;",

    "  pointer-events: auto;",

    "}",

    "",

    ".cart-drawer__overlay {",

    "  position: absolute;",

    "  inset: 0;",

    "  background: rgba(0,0,0,.5);",

    "}",

    "",

    ".cart-drawer__panel {",

    "  position: absolute;",

    "  top: 0;",

    "  right: 0;",

    "  width: min(430px, 100%);",

    "  height: 100%;",

    "  padding: 24px;",

    "  background: #fff;",

    "  transform: translateX(100%);",

    "  transition: transform .25s ease;",

    "  display: flex;",

    "  flex-direction: column;",

    "}",

    "",

    ".cart-drawer[aria-hidden='false'] .cart-drawer__panel {",

    "  transform: translateX(0);",

    "}",

    "",

    ".cart-drawer__header {",

    "  display: flex;",

    "  justify-content: space-between;",

    "  align-items: center;",

    "  border-bottom: 1px solid var(--sf-color-border);",

    "  padding-bottom: 15px;",

    "}",

    "",

    ".cart-drawer__close {",

    "  border: 0;",

    "  background: transparent;",

    "  font-size: 28px;",

    "}",

    "",

    ".cart-drawer__content {",

    "  flex: 1;",

    "  overflow-y: auto;",

    "  padding-block: 20px;",

    "}",

    "",

    ".cart-item {",

    "  display: flex;",

    "  gap: 12px;",

    "  padding-block: 12px;",

    "  border-bottom: 1px solid var(--sf-color-border);",

    "}",

    "",

    ".cart-item__image {",

    "  width: 72px;",

    "  height: 72px;",

    "  object-fit: cover;",

    "  border-radius: var(--sf-radius-sm);",

    "}",

    "",

    ".cart-item__info {",

    "  display: grid;",

    "  gap: 3px;",

    "}",

    "",

    ".cart-drawer__subtotal {",

    "  display: flex;",

    "  justify-content: space-between;",

    "  padding: 15px 0;",

    "  border-top: 1px solid var(--sf-color-border);",

    "}",

    "",

    ".storeforge-toast {",

    "  position: fixed;",

    "  left: 50%;",

    "  bottom: 25px;",

    "  z-index: 10000;",

    "  transform: translateX(-50%);",

    "  padding: 12px 18px;",

    "  border-radius: var(--sf-radius-md);",

    "  background: var(--sf-color-background);",

    "  color: #fff;",

    "  box-shadow: var(--sf-shadow-md);",

    "}",

    "",

    "[hidden] {",

    "  display: none !important;",

    "}",

    "",

    ":focus-visible {",

    "  outline: 3px solid var(--sf-color-primary);",

    "  outline-offset: 3px;",

    "}",

    "",

    "@media (max-width: 1024px) {",

    "",

    "  .product-grid {",

    "    grid-template-columns: repeat(3, minmax(0, 1fr));",

    "  }",

    "",

    "  .article-grid {",

    "    grid-template-columns: repeat(2, minmax(0, 1fr));",

    "  }",

    "",

    "  .main-product__grid {",

    "    grid-template-columns: 1fr 1fr;",

    "    gap: 35px;",

    "  }",

    "",

    "}",

    "",

    "@media (max-width: 749px) {",

    "",

    "  .page-width {",

    "    width: min(calc(100% - 28px), var(--sf-container));",

    "  }",

    "",

    "  .product-grid {",

    "    grid-template-columns: repeat(2, minmax(0, 1fr));",

    "    gap: 14px;",

    "  }",

    "",

    "  .article-grid {",

    "    grid-template-columns: 1fr;",

    "  }",

    "",

    "  .main-product__grid {",

    "    grid-template-columns: 1fr;",

    "    gap: 30px;",

    "    padding-block: 30px;",

    "  }",

    "",

    "  .main-product--sticky .main-product__info {",

    "    position: static;",

    "  }",

    "",

    "  .contact-section__grid {",

    "    grid-template-columns: 1fr;",

    "    gap: 30px;",

    "  }",

    "",

    "  .collection-tools {",

    "    flex-direction: column;",

    "  }",

    "",

    "  .collection-banner__content {",

    "    padding: 28px 22px;",

    "  }",

    "",

    "  .not-found__search {",

    "    flex-direction: column;",

    "  }",

    "",

    "  .product-card__content,",

    "  .article-card__content {",

    "    padding: 13px;",

    "  }",

    "",

    "}",

    "",

    "@media (max-width: 420px) {",

    "",

    "  .product-grid {",

    "    grid-template-columns: 1fr;",

    "  }",

    "",

    "  .button {",

    "    width: 100%;",

    "  }",

    "",

    "}"

  ]);

};


/*
|--------------------------------------------------------------------------
| Global JavaScript
|--------------------------------------------------------------------------
*/

const buildGlobalThemeJavascript = () => {

  return joinLines([

    "/*",

    " * StoreForge AI",

    " * Global Theme JavaScript",

    " */",

    "",

    "(function () {",

    "  'use strict';",

    "",

    "  const StoreForge = window.StoreForge || {};",

    "",

    "  StoreForge.Cart = StoreForge.Cart || {};",

    "",

    "  function getCart() {",

    "    return fetch('/cart.js', {",

    "      headers: {",

    "        'Accept': 'application/json'",

    "      }",

    "    }).then(function (response) {",

    "      if (!response.ok) {",

    "        throw new Error('Unable to load cart.');",

    "      }",

    "      return response.json();",

    "    });",

    "  }",

    "",

    "  function refreshCartDrawer() {",

    "    return getCart().then(function (cart) {",

    "      document.dispatchEvent(",

    "        new CustomEvent('storeforge:cart-updated', {",

    "          detail: cart",

    "        })",

    "      );",

    "",

    "      updateCartCount(cart);",

    "      updateCartDrawer(cart);",

    "",

    "      return cart;",

    "    });",

    "  }",

    "",

    "  function updateCartCount(cart) {",

    "    document.querySelectorAll('[data-cart-count]').forEach(function (element) {",

    "      element.textContent = cart.item_count;",

    "      element.hidden = cart.item_count === 0;",

    "    });",

    "  }",

    "",

    "  function updateCartDrawer(cart) {",

    "    const container = document.querySelector('[data-cart-content]');",

    "",

    "    if (!container) return;",

    "",

    "    if (!cart.items.length) {",

    "      container.innerHTML = '<p class=\"cart-drawer__empty\">Your cart is empty.</p>';",

    "      return;",

    "    }",

    "",

    "    container.innerHTML = cart.items.map(function (item) {",

    "      return '<div class=\"cart-item\">' +",

    "        '<img class=\"cart-item__image\" src=\"' +",

    "          item.image +",

    "        '\" alt=\"' +",

    "          escapeHtml(item.product_title) +",

    "        '\">' +",

    "        '<div class=\"cart-item__info\">' +",

    "          '<a href=\"' + item.url + '\">' +",

    "            escapeHtml(item.product_title) +",

    "          '</a>' +",

    "          '<span>' +",

    "            formatMoney(item.final_line_price, cart.currency) +",

    "          '</span>' +",

    "        '</div>' +",

    "      '</div>';",

    "    }).join('');",

    "  }",

    "",

    "  function formatMoney(cents, currency) {",

    "    try {",

    "      return new Intl.NumberFormat(undefined, {",

    "        style: 'currency',",

    "        currency: currency || 'USD'",

    "      }).format(cents / 100);",

    "    } catch (error) {",

    "      return (cents / 100).toFixed(2);",

    "    }",

    "  }",

    "",

    "  function escapeHtml(value) {",

    "    return String(value || '')",

    "      .replace(/&/g, '&amp;')",

    "      .replace(/</g, '&lt;')",

    "      .replace(/>/g, '&gt;')",

    "      .replace(/\"/g, '&quot;')",

    "      .replace(/'/g, '&#039;');",

    "  }",

    "",

    "  function openCart() {",

    "    const drawer = document.querySelector('[data-cart-drawer]');",

    "",

    "    if (!drawer) return;",

    "",

    "    drawer.setAttribute('aria-hidden', 'false');",

    "    document.body.classList.add('cart-drawer-open');",

    "",

    "    refreshCartDrawer().catch(function (error) {",

    "      console.error('[StoreForge] Cart refresh failed:', error);",

    "    });",

    "  }",

    "",

    "  function closeCart() {",

    "    const drawer = document.querySelector('[data-cart-drawer]');",

    "",

    "    if (!drawer) return;",

    "",

    "    drawer.setAttribute('aria-hidden', 'true');",

    "    document.body.classList.remove('cart-drawer-open');",

    "  }",

    "",

    "  function showToast(message) {",

    "    const toast = document.querySelector('[data-storeforge-toast]');",

    "",

    "    if (!toast) return;",

    "",

    "    toast.textContent = message;",

    "    toast.hidden = false;",

    "",

    "    clearTimeout(toast._timeout);",

    "",

    "    toast._timeout = setTimeout(function () {",

    "      toast.hidden = true;",

    "    }, 3000);",

    "  }",

    "",

    "  function bindCart() {",

    "    document.addEventListener('click', function (event) {",

    "",

    "      const openButton = event.target.closest('[data-cart-open]');",

    "",

    "      if (openButton) {",

    "        event.preventDefault();",

    "        openCart();",

    "        return;",

    "      }",

    "",

    "      const closeButton = event.target.closest('[data-cart-close]');",

    "",

    "      if (closeButton) {",

    "        event.preventDefault();",

    "        closeCart();",

    "      }",

    "    });",

    "",

    "    document.addEventListener('storeforge:product-added', function () {",

    "      showToast('Product added to cart.');",

    "      openCart();",

    "    });",

    "  }",

    "",

    "  function bindEscape() {",

    "    document.addEventListener('keydown', function (event) {",

    "      if (event.key === 'Escape') {",

    "        closeCart();",

    "      }",

    "    });",

    "  }",

    "",

    "  StoreForge.Cart.refresh = refreshCartDrawer;",

    "  StoreForge.Cart.open = openCart;",

    "  StoreForge.Cart.close = closeCart;",

    "",

    "  window.StoreForge = StoreForge;",

    "",

    "  function init() {",

    "    bindCart();",

    "    bindEscape();",

    "    refreshCartDrawer().catch(function () {});",

    "  }",

    "",

    "  if (document.readyState === 'loading') {",

    "    document.addEventListener('DOMContentLoaded', init);",

    "  } else {",

    "    init();",

    "  }",

    "",

    "})();"

  ]);

};


/*
|--------------------------------------------------------------------------
| Shopify Settings Schema
|--------------------------------------------------------------------------
*/

const buildSettingsSchema = () => {

  return JSON.stringify(

    [

      {

        name: "StoreForge AI",

        settings: [

          {

            type: "header",

            content: "Brand"

          },

          {

            type: "color",

            id: "color_primary",

            label: "Primary color",

            default: "#FF3B2F"

          },

          {

            type: "color",

            id: "color_background",

            label: "Background color",

            default: "#1e3928"

          },

          {

            type: "color",

            id: "color_accent",

            label: "Accent color",

            default: "#FF3B2F"

          },

          {

            type: "image_picker",

            id: "favicon",

            label: "Favicon"

          },

          {

            type: "header",

            content: "Cart"

          },

          {

            type: "checkbox",

            id: "enable_cart_drawer",

            label: "Enable cart drawer",

            default: true

          },

          {

            type: "checkbox",

            id: "enable_product_collection_js",

            label: "Enable product and collection JavaScript",

            default: true

          },

          {

            type: "header",

            content: "AI"

          },

          {

            type: "checkbox",

            id: "enable_ai_data",

            label: "Enable AI data attributes",

            default: true

          }

        ]

      }

    ],

    null,

    2

  );

};


/*
|--------------------------------------------------------------------------
| Theme Metadata
|--------------------------------------------------------------------------
*/

const buildThemeMetadata = () => {

  return JSON.stringify(

    {

      name:
        "StoreForge AI Generated Theme",

      version:
        "1.0.0",

      generator:
        "StoreForge AI",

      generated_at:
        new Date().toISOString(),

      platform:
        "Shopify",

      features: [

        "responsive",

        "accessibility",

        "product",

        "collection",

        "search",

        "blog",

        "article",

        "contact",

        "cart",

        "seo",

        "ai-ready"

      ]

    },

    null,

    2

  );

};


/*
|--------------------------------------------------------------------------
| AI Data Layer
|--------------------------------------------------------------------------
*/

const buildAiDataLiquid = () => {

  return joinLines([

    liquidComment(
      "StoreForge AI Data Layer"
    ),

    "{% if settings.enable_ai_data %}",

    "",

    "<script>",

    "  window.StoreForgeAI = window.StoreForgeAI || {};",

    "",

    "  window.StoreForgeAI.shop = {",

    "    name: {{ shop.name | json }},",

    "    domain: {{ shop.permanent_domain | json }},",

    "    currency: {{ cart.currency.iso_code | json }}",

    "  };",

    "",

    "  window.StoreForgeAI.page = {",

    "    title: {{ page_title | json }},",

    "    url: {{ canonical_url | json }},",

    "    template: {{ template.name | json }}",

    "  };",

    "",

    "{% if product %}",

    "",

    "  window.StoreForgeAI.product = {",

    "    id: {{ product.id | json }},",

    "    title: {{ product.title | json }},",

    "    handle: {{ product.handle | json }},",

    "    url: {{ product.url | json }},",

    "    vendor: {{ product.vendor | json }},",

    "    available: {{ product.available | json }},",

    "    price: {{ product.price | json }},",

    "    currency: {{ cart.currency.iso_code | json }}",

    "  };",

    "",

    "{% endif %}",

    "",

    "{% if collection %}",

    "",

    "  window.StoreForgeAI.collection = {",

    "    id: {{ collection.id | json }},",

    "    title: {{ collection.title | json }},",

    "    handle: {{ collection.handle | json }},",

    "    url: {{ collection.url | json }}",

    "  };",

    "",

    "{% endif %}",

    "",

    "{% endif %}"

  ]);

};


/*
|--------------------------------------------------------------------------
| Accessibility Helpers
|--------------------------------------------------------------------------
*/

const buildAccessibilityLiquid = () => {

  return joinLines([

    liquidComment(
      "StoreForge AI Accessibility"
    ),

    '<a href="#MainContent"',

    '   class="skip-to-content-link">',

    "Skip to content",

    "</a>"

  ]);

};


/*
|--------------------------------------------------------------------------
| Add Accessibility CSS
|--------------------------------------------------------------------------
*/

const buildAccessibilityCss = () => {

  return joinLines([

    ".skip-to-content-link {",

    "  position: fixed;",

    "  left: 10px;",

    "  top: -100px;",

    "  z-index: 10001;",

    "  padding: 12px 18px;",

    "  border-radius: 6px;",

    "  background: #000;",

    "  color: #fff;",

    "  text-decoration: none;",

    "}",

    "",

    ".skip-to-content-link:focus {",

    "  top: 10px;",

    "}",

    "",

    "@media (prefers-reduced-motion: reduce) {",

    "  *,",

    "  *::before,",

    "  *::after {",

    "    scroll-behavior: auto !important;",

    "    animation-duration: .01ms !important;",

    "    animation-iteration-count: 1 !important;",

    "    transition-duration: .01ms !important;",

    "  }",

    "}"

  ]);

};


/*
|--------------------------------------------------------------------------
| Theme Validation
|--------------------------------------------------------------------------
*/

const validateGeneratedTheme = (
  context
) => {

  const errors = [];

  const files =
    context &&
    context.files
      ? context.files
      : {};


  const requiredFiles = [

    "layout/theme.liquid",

    "assets/theme.css",

    "assets/theme.js",

    "config/settings_schema.json",

    "sections/main-product.liquid",

    "sections/main-collection-product-grid.liquid",

    "sections/search-results.liquid",

    "sections/main-blog.liquid",

    "sections/main-article.liquid",

    "sections/contact-form.liquid",

    "sections/404.liquid"

  ];


  requiredFiles.forEach(
    (file) => {

      if (
        !Object.prototype.hasOwnProperty.call(
          files,
          file
        )
      ) {

        errors.push(
          `Missing required theme file: ${file}`
        );

      }

    }
  );


  Object.keys(files).forEach(
    (file) => {

      const value =
        files[file];

      if (
        typeof value !== "string"
      ) {

        return;

      }


      if (
        value.includes(
          "undefined"
        )
      ) {

        errors.push(
          `Possible undefined value found in ${file}`
        );

      }


      if (
        value.includes(
          "[object Object]"
        )
      ) {

        errors.push(
          `Possible object serialization error in ${file}`
        );

      }

    }
  );


  context.validation = {

    valid:
      errors.length === 0,

    errors,

    checkedAt:
      new Date().toISOString()

  };


  return context;

};


/*
|--------------------------------------------------------------------------
| Register Final Files
|--------------------------------------------------------------------------
*/

const registerFinalThemeFiles = (
  context
) => {

  /*
  |--------------------------------------------------------------------------
  | Layout
  |--------------------------------------------------------------------------
  */

  addLiquidFile(

    context,

    "layout/theme.liquid",

    buildThemeLiquid()

  );


  /*
  |--------------------------------------------------------------------------
  | Global assets
  |--------------------------------------------------------------------------
  */

  addAssetFile(

    context,

    "assets/theme.css",

    joinLines([

      buildGlobalThemeCss(),

      "",

      buildAccessibilityCss()

    ])

  );


  addAssetFile(

    context,

    "assets/theme.js",

    buildGlobalThemeJavascript()

  );


  /*
  |--------------------------------------------------------------------------
  | AI data
  |--------------------------------------------------------------------------
  */

  addLiquidFile(

    context,

    "snippets/ai-data.liquid",

    buildAiDataLiquid()

  );


  /*
  |--------------------------------------------------------------------------
  | Accessibility
  |--------------------------------------------------------------------------
  */

  addLiquidFile(

    context,

    "snippets/accessibility.liquid",

    buildAccessibilityLiquid()

  );


  /*
  |--------------------------------------------------------------------------
  | Configuration
  |--------------------------------------------------------------------------
  */

  addConfigFile(

    context,

    "config/settings_schema.json",

    buildSettingsSchema()

  );


  /*
  |--------------------------------------------------------------------------
  | Metadata
  |--------------------------------------------------------------------------
  */

  addConfigFile(

    context,

    "config/storeforge-theme.json",

    buildThemeMetadata()

  );


  return context;

};


/*
|--------------------------------------------------------------------------
| Final Integration
|--------------------------------------------------------------------------
*/

const integrateAllThemeParts = (
  context
) => {

  /*
  |--------------------------------------------------------------------------
  | Part 8
  |--------------------------------------------------------------------------
  */

  if (
    typeof generateProductCollectionSections ===
    "function"
  ) {

    generateProductCollectionSections(
      context
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Part 9
  |--------------------------------------------------------------------------
  */

  if (
    typeof generateUtilitySections ===
    "function"
  ) {

    generateUtilitySections(
      context
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Part 10
  |--------------------------------------------------------------------------
  */

  registerFinalThemeFiles(
    context
  );


  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  validateGeneratedTheme(
    context
  );


  return context;

};


/*
|--------------------------------------------------------------------------
| Final Theme Generator
|--------------------------------------------------------------------------
*/

const generateCompleteLiquidTheme = (
  options = {}
) => {

  const context = {

    options,

    files: {},

    metadata: {

      generator:
        "StoreForge AI",

      version:
        "1.0.0",

      platform:
        "Shopify",

      generatedAt:
        new Date().toISOString(),

      themeName:
        options.themeName ||
        "StoreForge AI Theme"

    },

    validation: {

      valid:
        false,

      errors: []

    }

  };


  /*
  |--------------------------------------------------------------------------
  | Register all generated parts
  |--------------------------------------------------------------------------
  */

  integrateAllThemeParts(
    context
  );


  /*
  |--------------------------------------------------------------------------
  | Add AI data snippet reference
  |--------------------------------------------------------------------------
  */

  if (
    context.files[
      "layout/theme.liquid"
    ]
  ) {

    const theme =
      context.files[
        "layout/theme.liquid"
      ];


    context.files[
      "layout/theme.liquid"
    ] =
      theme.replace(

        "{{ content_for_header }}",

        [
          "{{ content_for_header }}",

          "",

          "{% render 'accessibility' %}",

          "",

          "{% render 'ai-data' %}"

        ].join("\n")

      );

  }


  /*
  |--------------------------------------------------------------------------
  | Final validation
  |--------------------------------------------------------------------------
  */

  validateGeneratedTheme(
    context
  );


  return context;

};


/*
|--------------------------------------------------------------------------
| Convert Theme Context To Array
|--------------------------------------------------------------------------
*/

const getGeneratedThemeFiles = (
  context
) => {

  if (
    !context ||
    !context.files
  ) {

    return [];

  }


  return Object.entries(
    context.files
  ).map(
    ([path, content]) => ({

      path,

      content,

      size:
        Buffer.byteLength(
          content || "",
          "utf8"
        )

    })
  );

};


/*
|--------------------------------------------------------------------------
| Get Theme Summary
|--------------------------------------------------------------------------
*/

const getThemeGenerationSummary = (
  context
) => {

  const files =
    getGeneratedThemeFiles(
      context
    );


  const categories = {

    layout: 0,

    sections: 0,

    snippets: 0,

    assets: 0,

    config: 0,

    templates: 0,

    other: 0

  };


  files.forEach(
    (file) => {

      if (
        file.path.startsWith(
          "layout/"
        )
      ) {

        categories.layout++;

      } else if (
        file.path.startsWith(
          "sections/"
        )
      ) {

        categories.sections++;

      } else if (
        file.path.startsWith(
          "snippets/"
        )
      ) {

        categories.snippets++;

      } else if (
        file.path.startsWith(
          "assets/"
        )
      ) {

        categories.assets++;

      } else if (
        file.path.startsWith(
          "config/"
        )
      ) {

        categories.config++;

      } else if (
        file.path.startsWith(
          "templates/"
        )
      ) {

        categories.templates++;

      } else {

        categories.other++;

      }

    }
  );


  return {

    themeName:
      context?.metadata?.themeName ||
      "StoreForge AI Theme",

    generator:
      context?.metadata?.generator ||
      "StoreForge AI",

    version:
      context?.metadata?.version ||
      "1.0.0",

    totalFiles:
      files.length,

    totalBytes:
      files.reduce(
        (sum, file) =>
          sum + file.size,
        0
      ),

    categories,

    valid:
      Boolean(
        context?.validation?.valid
      ),

    errors:
      context?.validation?.errors ||
      []

  };

};


/*
|--------------------------------------------------------------------------
| Ensure Shopify File Paths
|--------------------------------------------------------------------------
*/

const normalizeThemeFilePath = (
  filePath
) => {

  if (
    typeof filePath !== "string"
  ) {

    return "";

  }


  return filePath

    .replace(/\\/g, "/")

    .replace(/^\/+/, "")

    .replace(/\/+/g, "/");

};


/*
|--------------------------------------------------------------------------
| Sanitize Generated Theme Files
|--------------------------------------------------------------------------
*/

const sanitizeGeneratedTheme = (
  context
) => {

  if (
    !context ||
    !context.files
  ) {

    return context;

  }


  const normalizedFiles = {};


  Object.entries(
    context.files
  ).forEach(
    ([filePath, content]) => {

      const normalizedPath =
        normalizeThemeFilePath(
          filePath
        );


      if (
        !normalizedPath
      ) {

        return;

      }


      normalizedFiles[
        normalizedPath
      ] =
        typeof content === "string"

          ? content

          : String(
              content ?? ""
            );

    }
  );


  context.files =
    normalizedFiles;


  return context;

};


/*
|--------------------------------------------------------------------------
| Finalize Theme
|--------------------------------------------------------------------------
*/

const finalizeThemeGeneration = (
  context
) => {

  sanitizeGeneratedTheme(
    context
  );


  validateGeneratedTheme(
    context
  );


  context.summary =
    getThemeGenerationSummary(
      context
    );


  context.files[
    "config/storeforge-theme.json"
  ] =
    JSON.stringify(

      {

        ...JSON.parse(
          context.files[
            "config/storeforge-theme.json"
          ] || "{}"
        ),

        summary:
          context.summary,

        validation:
          context.validation

      },

      null,

      2

    );


  return context;

};


/*
|--------------------------------------------------------------------------
| PUBLIC API
|--------------------------------------------------------------------------
*/

const aiLiquidService = {

  /*
  |--------------------------------------------------------------------------
  | Individual builders
  |--------------------------------------------------------------------------
  */

  buildThemeLiquid,

  buildGlobalThemeCss,

  buildGlobalThemeJavascript,

  buildSettingsSchema,

  buildThemeMetadata,

  buildAiDataLiquid,

  buildAccessibilityLiquid,

  buildAccessibilityCss,


  /*
  |--------------------------------------------------------------------------
  | Part 8
  |--------------------------------------------------------------------------
  */

  generateProductCollectionSections,


  /*
  |--------------------------------------------------------------------------
  | Part 9
  |--------------------------------------------------------------------------
  */

  generateUtilitySections,


  /*
  |--------------------------------------------------------------------------
  | Final generation
  |--------------------------------------------------------------------------
  */

  registerFinalThemeFiles,

  integrateAllThemeParts,

  generateCompleteLiquidTheme,

  getGeneratedThemeFiles,

  getThemeGenerationSummary,

  normalizeThemeFilePath,

  sanitizeGeneratedTheme,

  validateGeneratedTheme,

  finalizeThemeGeneration

};


/*
|--------------------------------------------------------------------------
| CommonJS Export
|--------------------------------------------------------------------------
*/

if (
  typeof module !== "undefined" &&
  module.exports
) {

  module.exports =
    aiLiquidService;

}


/*
|--------------------------------------------------------------------------
| ES Module Compatibility
|--------------------------------------------------------------------------
*/

if (
  typeof exports !== "undefined"
) {

  exports.aiLiquidService =
    aiLiquidService;

}


/*
|--------------------------------------------------------------------------
| PART 10 / 10 — COMPLETE
|--------------------------------------------------------------------------
|
| FINAL FILE FEATURES
|
| ✓ theme.liquid
| ✓ Global SEO
| ✓ Canonical URL
| ✓ Open Graph
| ✓ Twitter metadata
| ✓ Favicon
| ✓ Theme color
| ✓ Responsive viewport
| ✓ Global CSS variables
| ✓ StoreForge brand colors
| ✓ Responsive CSS
| ✓ Mobile CSS
| ✓ Tablet CSS
| ✓ Accessibility
| ✓ Reduced motion
| ✓ Skip-to-content
| ✓ Product UI
| ✓ Collection UI
| ✓ Search UI
| ✓ Blog UI
| ✓ Article UI
| ✓ Contact UI
| ✓ 404 UI
| ✓ Cart drawer
| ✓ AJAX cart integration
| ✓ Toast notifications
| ✓ AI data layer
| ✓ Product data
| ✓ Collection data
| ✓ Shop data
| ✓ Currency data
| ✓ Shopify settings
| ✓ Theme metadata
| ✓ Theme validation
| ✓ File sanitization
| ✓ Theme summary
| ✓ Final public API
|
|--------------------------------------------------------------------------
| aiLiquid.service.js — COMPLETE
|--------------------------------------------------------------------------
*/
