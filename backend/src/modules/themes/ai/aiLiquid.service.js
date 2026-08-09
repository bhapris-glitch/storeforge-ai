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
