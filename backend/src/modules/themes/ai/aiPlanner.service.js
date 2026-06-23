// ===================================================≠
// /backend/src/modules/themes/ai/aiPlanner.service.js
// Layboka AI
// part 1
// =======================================================

const crypto = require("crypto");

const {
  getTemplate
} = require("../template.service");

const {
  AI_PROMPTS,
  THEME_CATEGORIES,
  THEME_LAYOUTS
} = require("../constants");

/*
|--------------------------------------------------------------------------
| Industry Keywords
|--------------------------------------------------------------------------
|
| Used to detect store niche from AI prompt.
|
*/

const INDUSTRY_KEYWORDS = {

  fashion: [
    "fashion",
    "clothing",
    "hoodie",
    "shirt",
    "tshirt",
    "jeans",
    "dress",
    "apparel",
    "boutique",
    "streetwear"
  ],

  beauty: [
    "beauty",
    "cosmetics",
    "makeup",
    "lipstick",
    "skincare",
    "perfume",
    "hair",
    "salon"
  ],

  electronics: [
    "electronics",
    "mobile",
    "phone",
    "laptop",
    "computer",
    "camera",
    "gaming",
    "headphones",
    "speaker"
  ],

  furniture: [
    "furniture",
    "chair",
    "table",
    "bed",
    "sofa",
    "interior",
    "home decor",
    "office furniture"
  ],

  jewelry: [
    "jewelry",
    "ring",
    "necklace",
    "diamond",
    "gold",
    "silver",
    "bracelet",
    "earrings"
  ],

  restaurant: [
    "restaurant",
    "pizza",
    "food",
    "burger",
    "cafe",
    "coffee",
    "bakery",
    "kitchen"
  ],

  pets: [
    "pet",
    "dog",
    "cat",
    "puppy",
    "bird",
    "aquarium",
    "pet food"
  ],

  sports: [
    "sports",
    "fitness",
    "gym",
    "exercise",
    "running",
    "football",
    "cricket",
    "basketball"
  ],

  automotive: [
    "car",
    "bike",
    "automotive",
    "vehicle",
    "garage",
    "engine",
    "parts"
  ]

};

/*
|--------------------------------------------------------------------------
| Generate AI Session ID
|--------------------------------------------------------------------------
*/

const generateSessionId = () => {

  return crypto
    .randomBytes(16)
    .toString("hex");

};

/*
|--------------------------------------------------------------------------
| Normalize Prompt
|--------------------------------------------------------------------------
*/

const normalizePrompt = (
  prompt = ""
) => {

  return prompt
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

};

/*
|--------------------------------------------------------------------------
| Score Industry
|--------------------------------------------------------------------------
*/

const scoreIndustry = (
  prompt,
  keywords
) => {

  let score = 0;

  for (const keyword of keywords) {

    if (
      prompt.includes(
        keyword.toLowerCase()
      )
    ) {

      score++;

    }

  }

  return score;

};

/*
|--------------------------------------------------------------------------
| Detect Industry
|--------------------------------------------------------------------------
*/

const detectIndustry = (
  prompt
) => {

  const normalized =
    normalizePrompt(
      prompt
    );

  let bestCategory =
    "custom";

  let highestScore = 0;

  for (const category of Object.keys(
    INDUSTRY_KEYWORDS
  )) {

    const score =
      scoreIndustry(
        normalized,
        INDUSTRY_KEYWORDS[
          category
        ]
      );

    if (
      score >
      highestScore
    ) {

      highestScore =
        score;

      bestCategory =
        category;

    }

  }

  return {

    category:
      bestCategory,

    confidence:
      highestScore

  };

};

/*
|--------------------------------------------------------------------------
| Build Initial Plan
|--------------------------------------------------------------------------
|
| Continued in Part 2...
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Detect Theme Layout
|--------------------------------------------------------------------------
*/

const detectLayout = (
  prompt = "",
  category = "custom"
) => {

  const text =
    normalizePrompt(prompt);

  if (
    text.includes("luxury") ||
    text.includes("premium") ||
    text.includes("elite")
  ) {
    return "premium";
  }

  if (
    text.includes("minimal") ||
    text.includes("simple") ||
    text.includes("clean")
  ) {
    return "minimal";
  }

  if (
    text.includes("modern") ||
    text.includes("startup") ||
    text.includes("technology")
  ) {
    return "modern";
  }

  const defaults = {

    fashion: "modern",

    beauty: "minimal",

    electronics: "modern",

    furniture: "premium",

    jewelry: "premium",

    restaurant: "classic",

    pets: "modern",

    sports: "modern",

    automotive: "classic",

    custom: "modern"

  };

  return defaults[
    category
  ] || "modern";

};

/*
|--------------------------------------------------------------------------
| Detect Store Size
|--------------------------------------------------------------------------
*/

const detectStoreSize =
(
  prompt = ""
) => {

  const text =
    normalizePrompt(
      prompt
    );

  if (
    text.includes("enterprise")
  ) {

    return "enterprise";

  }

  if (
    text.includes("large")
  ) {

    return "large";

  }

  if (
    text.includes("medium")
  ) {

    return "medium";

  }

  if (
    text.includes("small")
  ) {

    return "small";

  }

  return "medium";

};

/*
|--------------------------------------------------------------------------
| Detect Target Audience
|--------------------------------------------------------------------------
*/

const detectAudience =
(
  prompt = ""
) => {

  const text =
    normalizePrompt(
      prompt
    );

  if (
    text.includes("women") ||
    text.includes("female")
  ) {

    return "women";

  }

  if (
    text.includes("men") ||
    text.includes("male")
  ) {

    return "men";

  }

  if (
    text.includes("kids") ||
    text.includes("children")
  ) {

    return "kids";

  }

  if (
    text.includes("family")
  ) {

    return "family";

  }

  if (
    text.includes("luxury")
  ) {

    return "premium";

  }

  return "general";

};

/*
|--------------------------------------------------------------------------
| Detect Language
|--------------------------------------------------------------------------
*/

const detectLanguage =
(
  prompt = ""
) => {

  const text =
    normalizePrompt(
      prompt
    );

  if (
    text.includes("hindi")
  ) {

    return "hi";

  }

  if (
    text.includes("arabic")
  ) {

    return "ar";

  }

  if (
    text.includes("spanish")
  ) {

    return "es";

  }

  if (
    text.includes("french")
  ) {

    return "fr";

  }

  return "en";

};

/*
|--------------------------------------------------------------------------
| Build Initial AI Plan
|--------------------------------------------------------------------------
*/

const buildInitialPlan =
(
  prompt
) => {

  const sessionId =
    generateSessionId();

  const industry =
    detectIndustry(
      prompt
    );

  const layout =
    detectLayout(
      prompt,
      industry.category
    );

  const template =
    getTemplate(
      industry.category
    );

  return {

    sessionId,

    prompt,

    category:
      industry.category,

    confidence:
      industry.confidence,

    layout,

    template,

    audience:
      detectAudience(
        prompt
      ),

    language:
      detectLanguage(
        prompt
      ),

    storeSize:
      detectStoreSize(
        prompt
      ),

    createdAt:
      new Date()

  };

};

/*
|--------------------------------------------------------------------------
| AI Planning Engine
|--------------------------------------------------------------------------
|
| Continued in Part 3...
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Business Goal Detection
|--------------------------------------------------------------------------
*/

const detectBusinessGoal = (
  prompt = ""
) => {

  const text =
    normalizePrompt(prompt);

  if (
    text.includes("dropshipping")
  ) {

    return "dropshipping";

  }

  if (
    text.includes("brand") ||
    text.includes("branding")
  ) {

    return "brand-building";

  }

  if (
    text.includes("subscription")
  ) {

    return "subscription";

  }

  if (
    text.includes("wholesale")
  ) {

    return "wholesale";

  }

  if (
    text.includes("b2b")
  ) {

    return "b2b";

  }

  return "direct-to-consumer";

};

/*
|--------------------------------------------------------------------------
| Revenue Model
|--------------------------------------------------------------------------
*/

const detectRevenueModel =
(
  prompt = ""
) => {

  const text =
    normalizePrompt(prompt);

  if (
    text.includes("subscription")
  ) {

    return "subscription";

  }

  if (
    text.includes("booking")
  ) {

    return "booking";

  }

  if (
    text.includes("digital")
  ) {

    return "digital-products";

  }

  if (
    text.includes("marketplace")
  ) {

    return "marketplace";

  }

  return "physical-products";

};

/*
|--------------------------------------------------------------------------
| Brand Positioning
|--------------------------------------------------------------------------
*/

const detectBrandPosition =
(
  prompt = ""
) => {

  const text =
    normalizePrompt(prompt);

  if (
    text.includes("luxury") ||
    text.includes("premium")
  ) {

    return "luxury";

  }

  if (
    text.includes("budget") ||
    text.includes("cheap")
  ) {

    return "budget";

  }

  if (
    text.includes("eco") ||
    text.includes("organic") ||
    text.includes("sustainable")
  ) {

    return "eco-friendly";

  }

  if (
    text.includes("modern")
  ) {

    return "modern";

  }

  return "professional";

};

/*
|--------------------------------------------------------------------------
| Product Catalog Size
|--------------------------------------------------------------------------
*/

const detectCatalogSize =
(
  prompt = ""
) => {

  const text =
    normalizePrompt(prompt);

  if (
    text.includes("10000") ||
    text.includes("ten thousand")
  ) {

    return "enterprise";

  }

  if (
    text.includes("1000")
  ) {

    return "large";

  }

  if (
    text.includes("100")
  ) {

    return "medium";

  }

  return "small";

};

/*
|--------------------------------------------------------------------------
| Required Shopify Features
|--------------------------------------------------------------------------
*/

const detectRequiredFeatures =
(
  prompt = ""
) => {

  const text =
    normalizePrompt(prompt);

  const features = [

    "responsive-design",

    "seo",

    "performance",

    "analytics"

  ];

  if (
    text.includes("wishlist")
  ) {

    features.push(
      "wishlist"
    );

  }

  if (
    text.includes("review")
  ) {

    features.push(
      "reviews"
    );

  }

  if (
    text.includes("subscription")
  ) {

    features.push(
      "subscriptions"
    );

  }

  if (
    text.includes("multi language")
  ) {

    features.push(
      "multi-language"
    );

  }

  if (
    text.includes("currency")
  ) {

    features.push(
      "multi-currency"
    );

  }

  if (
    text.includes("b2b")
  ) {

    features.push(
      "b2b-pricing"
    );

  }

  return [
    ...new Set(features)
  ];

};

/*
|--------------------------------------------------------------------------
| Homepage Strategy
|--------------------------------------------------------------------------
*/

const buildHomepageStrategy =
(
  template
) => {

  return {

    sections:
      template.homepage,

    hero:
      true,

    featuredProducts:
      true,

    testimonials:
      template.homepage.includes(
        "testimonials"
      ),

    newsletter:
      template.homepage.includes(
        "newsletter"
      ),

    footer:
      true

  };

};

/*
|--------------------------------------------------------------------------
| Enrich AI Plan
|--------------------------------------------------------------------------
*/

const enrichPlan =
(
  plan
) => {

  plan.businessGoal =
    detectBusinessGoal(
      plan.prompt
    );

  plan.revenueModel =
    detectRevenueModel(
      plan.prompt
    );

  plan.brandPosition =
    detectBrandPosition(
      plan.prompt
    );

  plan.catalogSize =
    detectCatalogSize(
      plan.prompt
    );

  plan.features =
    detectRequiredFeatures(
      plan.prompt
    );

  plan.homepage =
    buildHomepageStrategy(
      plan.template
    );

  return plan;

};

/*
|--------------------------------------------------------------------------
| AI Store Strategy Engine
|--------------------------------------------------------------------------
|
| Continued in Part 4...
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Navigation Planner
|--------------------------------------------------------------------------
*/

const buildNavigation = (
  category,
  plan
) => {

  const menu = [
    "Home",
    "Shop",
    "Collections",
    "About",
    "Contact"
  ];

  switch (category) {

    case "fashion":

      menu.splice(
        2,
        0,
        "Men",
        "Women",
        "New Arrivals"
      );

      break;

    case "beauty":

      menu.splice(
        2,
        0,
        "Skincare",
        "Makeup",
        "Best Sellers"
      );

      break;

    case "electronics":

      menu.splice(
        2,
        0,
        "Phones",
        "Laptops",
        "Accessories"
      );

      break;

    case "furniture":

      menu.splice(
        2,
        0,
        "Living Room",
        "Bedroom",
        "Office"
      );

      break;

    case "restaurant":

      menu.splice(
        2,
        0,
        "Menu",
        "Reservations",
        "Offers"
      );

      break;

  }

  if (
    plan.features.includes(
      "wishlist"
    )
  ) {

    menu.push("Wishlist");

  }

  return menu;

};

/*
|--------------------------------------------------------------------------
| Collection Planner
|--------------------------------------------------------------------------
*/

const buildCollections = (
  category
) => {

  const collections = {

    fashion: [
      "New Arrivals",
      "Men",
      "Women",
      "Sale"
    ],

    beauty: [
      "Skincare",
      "Makeup",
      "Hair Care",
      "Best Sellers"
    ],

    electronics: [
      "Mobiles",
      "Laptops",
      "Gaming",
      "Accessories"
    ],

    furniture: [
      "Living Room",
      "Bedroom",
      "Dining",
      "Office"
    ],

    jewelry: [
      "Rings",
      "Necklaces",
      "Bracelets",
      "Luxury"
    ],

    restaurant: [
      "Pizza",
      "Burgers",
      "Drinks",
      "Desserts"
    ]

  };

  return (
    collections[
      category
    ] || []
  );

};

/*
|--------------------------------------------------------------------------
| Required Pages
|--------------------------------------------------------------------------
*/

const buildPages = (
  plan
) => {

  const pages = [

    "Home",

    "Shop",

    "Collections",

    "About",

    "Contact",

    "FAQ",

    "Privacy Policy",

    "Terms & Conditions",

    "Refund Policy"

  ];

  if (
    plan.businessGoal ===
    "subscription"
  ) {

    pages.push(
      "Subscription"
    );

  }

  if (
    plan.category ===
    "restaurant"
  ) {

    pages.push(
      "Reservations"
    );

  }

  return pages;

};

/*
|--------------------------------------------------------------------------
| Blog Strategy
|--------------------------------------------------------------------------
*/

const buildBlogStrategy =
(
  category
) => {

  const blogTopics = {

    fashion: [
      "Fashion Trends",
      "Style Guide",
      "Season Collection"
    ],

    beauty: [
      "Skin Care Tips",
      "Beauty Guide",
      "Makeup Tutorials"
    ],

    electronics: [
      "Buying Guide",
      "Product Reviews",
      "Latest Technology"
    ],

    furniture: [
      "Interior Design",
      "Home Decoration",
      "Furniture Guide"
    ],

    restaurant: [
      "Recipes",
      "Chef Stories",
      "Food Tips"
    ]

  };

  return {

    enabled: true,

    topics:
      blogTopics[
        category
      ] || []

  };

};

/*
|--------------------------------------------------------------------------
| Store Architecture
|--------------------------------------------------------------------------
*/

const buildStoreArchitecture =
(
  plan
) => {

  plan.navigation =
    buildNavigation(
      plan.category,
      plan
    );

  plan.collections =
    buildCollections(
      plan.category
    );

  plan.pages =
    buildPages(
      plan
    );

  plan.blog =
    buildBlogStrategy(
      plan.category
    );

  return plan;

};

/*
|--------------------------------------------------------------------------
| Store Experience Engine
|--------------------------------------------------------------------------
|
| Continued in Part 5...
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Conversion Funnel
|--------------------------------------------------------------------------
*/

const buildConversionFunnel = (
  plan
) => {

  return {

    awareness: [
      "hero-banner",
      "announcement-bar",
      "featured-collections"
    ],

    consideration: [
      "product-grid",
      "reviews",
      "comparison-table"
    ],

    conversion: [
      "add-to-cart",
      "trust-badges",
      "secure-checkout",
      "upsell"
    ],

    retention: [
      "newsletter",
      "loyalty-program",
      "email-marketing"
    ]

  };

};

/*
|--------------------------------------------------------------------------
| Trust Builder
|--------------------------------------------------------------------------
*/

const buildTrustElements = (
  plan
) => {

  const trust = [

    "secure-payments",

    "fast-shipping",

    "money-back-guarantee",

    "customer-support"

  ];

  if (
    plan.brandPosition ===
    "luxury"
  ) {

    trust.push(
      "premium-quality"
    );

  }

  if (
    plan.businessGoal ===
    "dropshipping"
  ) {

    trust.push(
      "tracked-shipping"
    );

  }

  return trust;

};

/*
|--------------------------------------------------------------------------
| Marketing Strategy
|--------------------------------------------------------------------------
*/

const buildMarketingStrategy =
(
  plan
) => {

  return {

    emailMarketing: true,

    abandonedCart: true,

    discountPopup: true,

    welcomeSeries: true,

    seoOptimization: true,

    socialSharing: true,

    influencerProgram:
      plan.brandPosition ===
      "luxury",

    referralProgram: true

  };

};

/*
|--------------------------------------------------------------------------
| Upsell Strategy
|--------------------------------------------------------------------------
*/

const buildUpsellStrategy =
(
  plan
) => {

  return {

    relatedProducts: true,

    frequentlyBoughtTogether: true,

    recentlyViewed: true,

    cartUpsell: true,

    postPurchaseUpsell: true,

    bundleOffers:
      plan.catalogSize !==
      "small"

  };

};

/*
|--------------------------------------------------------------------------
| Loyalty Strategy
|--------------------------------------------------------------------------
*/

const buildLoyaltyStrategy =
(
  plan
) => {

  return {

    rewards: true,

    referralRewards: true,

    vipCustomers:
      plan.brandPosition ===
      "luxury",

    birthdayRewards: true,

    pointsSystem: true

  };

};

/*
|--------------------------------------------------------------------------
| Recommended Apps
|--------------------------------------------------------------------------
*/

const recommendApps =
(
  plan
) => {

  const apps = [

    "Judge.me Reviews",

    "Shopify Email",

    "Shopify Flow",

    "Shopify Search & Discovery"

  ];

  if (
    plan.features.includes(
      "wishlist"
    )
  ) {

    apps.push(
      "Wishlist Plus"
    );

  }

  if (
    plan.features.includes(
      "subscriptions"
    )
  ) {

    apps.push(
      "Recharge Subscriptions"
    );

  }

  if (
    plan.features.includes(
      "multi-currency"
    )
  ) {

    apps.push(
      "Shopify Markets"
    );

  }

  return apps;

};

/*
|--------------------------------------------------------------------------
| Performance Targets
|--------------------------------------------------------------------------
*/

const buildPerformanceGoals =
(
  plan
) => {

  return {

    lighthouse: 95,

    accessibility: 100,

    seo: 100,

    bestPractices: 100,

    firstContentfulPaint:
      "<1.5s",

    largestContentfulPaint:
      "<2.5s",

    cumulativeLayoutShift:
      "<0.1"

  };

};

/*
|--------------------------------------------------------------------------
| Conversion Engine
|--------------------------------------------------------------------------
*/

const buildConversionPlan =
(
  plan
) => {

  plan.funnel =
    buildConversionFunnel(
      plan
    );

  plan.trust =
    buildTrustElements(
      plan
    );

  plan.marketing =
    buildMarketingStrategy(
      plan
    );

  plan.upsells =
    buildUpsellStrategy(
      plan
    );

  plan.loyalty =
    buildLoyaltyStrategy(
      plan
    );

  plan.recommendedApps =
    recommendApps(
      plan
    );

  plan.performanceGoals =
    buildPerformanceGoals(
      plan
    );

  return plan;

};

/*
|--------------------------------------------------------------------------
| AI Experience Planner
|--------------------------------------------------------------------------
|
| Continued in Part 6...
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| SEO Strategy
|--------------------------------------------------------------------------
*/

const buildSEOPlan = (
  plan
) => {

  return {

    metaTitles: true,

    metaDescriptions: true,

    openGraph: true,

    twitterCards: true,

    canonicalUrls: true,

    structuredData: true,

    breadcrumbs: true,

    xmlSitemap: true,

    robotsTxt: true,

    imageOptimization: true,

    altTextGeneration: true,

    schema: [

      "Organization",

      "WebSite",

      "BreadcrumbList",

      "Product",

      "CollectionPage",

      "Article",

      "FAQPage"

    ]

  };

};

/*
|--------------------------------------------------------------------------
| Internationalization
|--------------------------------------------------------------------------
*/

const buildInternationalPlan =
(
  plan
) => {

  const multiLanguage =
    plan.features.includes(
      "multi-language"
    );

  const multiCurrency =
    plan.features.includes(
      "multi-currency"
    );

  return {

    enabled:
      multiLanguage ||
      multiCurrency,

    defaultLanguage:
      plan.language,

    supportedLanguages:
      multiLanguage
        ? [
            plan.language,
            "en",
            "es",
            "fr",
            "de",
            "ar"
          ]
        : [
            plan.language
          ],

    multiCurrency,

    defaultCurrency:
      "USD",

    currencies:
      multiCurrency
        ? [
            "USD",
            "EUR",
            "GBP",
            "CAD",
            "AUD",
            "INR"
          ]
        : [
            "USD"
          ],

    markets:
      multiCurrency
        ? [
            "North America",
            "Europe",
            "Asia"
          ]
        : []

  };

};

/*
|--------------------------------------------------------------------------
| Accessibility
|--------------------------------------------------------------------------
*/

const buildAccessibilityPlan =
(
  plan
) => {

  return {

    wcag: "2.2 AA",

    keyboardNavigation: true,

    screenReaderSupport: true,

    colorContrastValidation: true,

    focusIndicators: true,

    ariaLabels: true,

    skipLinks: true,

    semanticHtml: true

  };

};

/*
|--------------------------------------------------------------------------
| Security
|--------------------------------------------------------------------------
*/

const buildSecurityPlan =
(
  plan
) => {

  return {

    httpsOnly: true,

    csrfProtection: true,

    xssProtection: true,

    contentSecurityPolicy: true,

    rateLimiting: true,

    webhookVerification: true,

    encryptedTokens: true,

    auditLogging: true

  };

};

/*
|--------------------------------------------------------------------------
| Analytics
|--------------------------------------------------------------------------
*/

const buildAnalyticsPlan =
(
  plan
) => {

  return {

    googleAnalytics: true,

    googleTagManager: true,

    metaPixel: true,

    tiktokPixel: true,

    pinterestPixel: false,

    conversionTracking: true,

    ecommerceTracking: true,

    serverSideEvents: true

  };

};

/*
|--------------------------------------------------------------------------
| Compliance
|--------------------------------------------------------------------------
*/

const buildCompliancePlan =
(
  plan
) => {

  return {

    gdpr: true,

    cookieConsent: true,

    privacyPolicy: true,

    refundPolicy: true,

    termsOfService: true,

    shippingPolicy: true,

    accessibilityStatement: true

  };

};

/*
|--------------------------------------------------------------------------
| Scalability
|--------------------------------------------------------------------------
*/

const buildScalabilityPlan =
(
  plan
) => {

  return {

    cdn: true,

    lazyLoading: true,

    imageOptimization: true,

    assetMinification: true,

    browserCaching: true,

    redisCaching: true,

    queueSystem: true,

    horizontalScaling: true

  };

};

/*
|--------------------------------------------------------------------------
| Enterprise Planner
|--------------------------------------------------------------------------
*/

const buildEnterprisePlan =
(
  plan
) => {

  plan.seo =
    buildSEOPlan(
      plan
    );

  plan.international =
    buildInternationalPlan(
      plan
    );

  plan.accessibility =
    buildAccessibilityPlan(
      plan
    );

  plan.security =
    buildSecurityPlan(
      plan
    );

  plan.analytics =
    buildAnalyticsPlan(
      plan
    );

  plan.compliance =
    buildCompliancePlan(
      plan
    );

  plan.scalability =
    buildScalabilityPlan(
      plan
    );

  return plan;

};

/*
|--------------------------------------------------------------------------
| Master AI Planner
|--------------------------------------------------------------------------
|
| Continued in Part 7...
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Validate AI Plan
|--------------------------------------------------------------------------
*/

const validatePlan = (
  plan
) => {

  const warnings = [];

  if (
    plan.confidence <= 0
  ) {

    warnings.push(
      "Industry could not be detected with confidence."
    );

  }

  if (
    !THEME_CATEGORIES.includes(
      plan.category
    ) &&
    plan.category !==
      "custom"
  ) {

    warnings.push(
      "Unsupported business category."
    );

  }

  if (
    !THEME_LAYOUTS.includes(
      plan.layout
    )
  ) {

    warnings.push(
      "Unknown layout selected."
    );

  }

  if (
    !plan.template
  ) {

    warnings.push(
      "No template found."
    );

  }

  return warnings;

};

/*
|--------------------------------------------------------------------------
| Calculate AI Confidence
|--------------------------------------------------------------------------
*/

const calculateConfidence =
(
  plan
) => {

  let score = 50;

  if (
    plan.confidence > 0
  ) score += 10;

  if (
    plan.businessGoal
  ) score += 5;

  if (
    plan.brandPosition
  ) score += 5;

  if (
    plan.revenueModel
  ) score += 5;

  if (
    plan.features.length
  ) score += 5;

  if (
    plan.navigation.length
  ) score += 5;

  if (
    plan.collections.length
  ) score += 5;

  if (
    score > 100
  ) {

    score = 100;

  }

  return score;

};

/*
|--------------------------------------------------------------------------
| Development Roadmap
|--------------------------------------------------------------------------
*/

const buildRoadmap = (
  plan
) => {

  return {

    create: {

      completed: [

        "Business analysis",

        "Industry detection",

        "Template selection",

        "Store architecture",

        "Homepage planning"

      ],

      next: [

        "Generate theme",

        "Generate sections",

        "Generate assets"

      ]

    },

    develop: {

      completed: [],

      next: [

        "Generate Liquid",

        "Generate CSS",

        "Generate JavaScript",

        "Generate settings_schema.json",

        "Generate templates",

        "Generate snippets"

      ]

    },

    advancedDevelopment: {

      completed: [],

      next: [

        "SEO optimization",

        "Accessibility optimization",

        "Performance optimization",

        "Image generation",

        "AI copywriting",

        "Deployment",

        "Preview generation",

        "Version snapshot"

      ]

    }

  };

};

/*
|--------------------------------------------------------------------------
| Recommendations
|--------------------------------------------------------------------------
*/

const buildRecommendations =
(
  plan
) => {

  const recommendations = [];

  if (
    plan.brandPosition ===
    "luxury"
  ) {

    recommendations.push(
      "Use large premium imagery."
    );

    recommendations.push(
      "Use elegant typography."
    );

  }

  if (
    plan.businessGoal ===
    "dropshipping"
  ) {

    recommendations.push(
      "Enable delivery tracking."
    );

  }

  if (
    plan.features.includes(
      "subscriptions"
    )
  ) {

    recommendations.push(
      "Use recurring billing."
    );

  }

  if (
    plan.catalogSize ===
    "enterprise"
  ) {

    recommendations.push(
      "Enable advanced search and filtering."
    );

  }

  return recommendations;

};

/*
|--------------------------------------------------------------------------
| Generate Complete AI Plan
|--------------------------------------------------------------------------
*/

const generatePlan =
(
  prompt
) => {

  let plan =
    buildInitialPlan(
      prompt
    );

  plan =
    enrichPlan(plan);

  plan =
    buildStoreArchitecture(
      plan
    );

  plan =
    buildConversionPlan(
      plan
    );

  plan =
    buildEnterprisePlan(
      plan
    );

  plan.aiConfidence =
    calculateConfidence(
      plan
    );

  plan.warnings =
    validatePlan(
      plan
    );

  plan.recommendations =
    buildRecommendations(
      plan
    );

  plan.roadmap =
    buildRoadmap(
      plan
    );

  return plan;

};

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
|
| Continued in Part 8...
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Plan Summary
|--------------------------------------------------------------------------
|
| Returns a lightweight summary that can be shown in the UI before
| generating the complete Shopify theme.
|--------------------------------------------------------------------------
*/

const summarizePlan = (
  plan
) => {

  return {

    sessionId:
      plan.sessionId,

    category:
      plan.category,

    layout:
      plan.layout,

    audience:
      plan.audience,

    businessGoal:
      plan.businessGoal,

    revenueModel:
      plan.revenueModel,

    brandPosition:
      plan.brandPosition,

    storeSize:
      plan.storeSize,

    catalogSize:
      plan.catalogSize,

    aiConfidence:
      plan.aiConfidence,

    homepageSections:
      plan.homepage.sections,

    features:
      plan.features,

    recommendedApps:
      plan.recommendedApps,

    warnings:
      plan.warnings

  };

};

/*
|--------------------------------------------------------------------------
| Plan Health Score
|--------------------------------------------------------------------------
*/

const getPlanHealthScore =
(
  plan
) => {

  let score =
    plan.aiConfidence || 0;

  score -=
    (plan.warnings || [])
      .length * 5;

  if (score < 0) {
    score = 0;
  }

  if (score > 100) {
    score = 100;
  }

  return score;

};

/*
|--------------------------------------------------------------------------
| AI Provider Payload
|--------------------------------------------------------------------------
|
| This standardized payload allows StoreForge AI to work with different
| LLM providers (OpenAI, Anthropic, Gemini, etc.) without changing the
| planning logic.
|--------------------------------------------------------------------------
*/

const buildProviderPayload =
(
  plan
) => {

  return {

    sessionId:
      plan.sessionId,

    prompt:
      plan.prompt,

    category:
      plan.category,

    template:
      plan.template,

    roadmap:
      plan.roadmap,

    homepage:
      plan.homepage,

    navigation:
      plan.navigation,

    collections:
      plan.collections,

    pages:
      plan.pages,

    features:
      plan.features,

    seo:
      plan.seo,

    accessibility:
      plan.accessibility,

    analytics:
      plan.analytics

  };

};

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

module.exports = {

  generatePlan,

  summarizePlan,

  getPlanHealthScore,

  buildProviderPayload,

  detectIndustry,

  detectLayout,

  detectAudience,

  detectLanguage,

  detectBusinessGoal,

  detectRevenueModel,

  detectBrandPosition,

  detectCatalogSize,

  detectRequiredFeatures,

  buildInitialPlan,

  enrichPlan,

  buildStoreArchitecture,

  buildConversionPlan,

  buildEnterprisePlan

};
