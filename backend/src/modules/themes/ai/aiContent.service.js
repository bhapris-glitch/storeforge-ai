// storeforge-ai/backend/src/modules/themes/ai/aiContent.service.js
// Layboka AI 
// Part 1
// ====================================================================
const crypto = require("crypto");

/*
|--------------------------------------------------------------------------
| Content Categories
|--------------------------------------------------------------------------
*/

const CONTENT_CATEGORIES = [

  "homepage",

  "products",

  "collections",

  "pages",

  "blog",

  "emails",

  "marketing",

  "seo"

];

/*
|--------------------------------------------------------------------------
| Supported Languages
|--------------------------------------------------------------------------
*/

const SUPPORTED_LANGUAGES = [

  "en",

  "es",

  "fr",

  "de",

  "it",

  "pt",

  "ar",

  "hi",

  "ja"

];

/*
|--------------------------------------------------------------------------
| Brand Voice Library
|--------------------------------------------------------------------------
*/

const BRAND_VOICES = {

  luxury: {

    tone: "Elegant",

    style: "Premium",

    vocabulary: [
      "exclusive",
      "crafted",
      "luxury",
      "timeless",
      "premium"
    ]

  },

  modern: {

    tone: "Confident",

    style: "Minimal",

    vocabulary: [
      "smart",
      "modern",
      "clean",
      "simple",
      "innovative"
    ]

  },

  friendly: {

    tone: "Warm",

    style: "Conversational",

    vocabulary: [
      "welcome",
      "discover",
      "enjoy",
      "love",
      "happy"
    ]

  },

  professional: {

    tone: "Trustworthy",

    style: "Business",

    vocabulary: [
      "quality",
      "reliable",
      "expert",
      "trusted",
      "proven"
    ]

  },

  energetic: {

    tone: "Bold",

    style: "Motivational",

    vocabulary: [
      "power",
      "perform",
      "strong",
      "active",
      "achieve"
    ]

  }

};

/*
|--------------------------------------------------------------------------
| Category Content Profiles
|--------------------------------------------------------------------------
*/

const CATEGORY_PROFILES = {

  fashion: {

    voice: "luxury",

    keywords: [
      "style",
      "fashion",
      "trend",
      "collection"
    ]

  },

  beauty: {

    voice: "friendly",

    keywords: [
      "beauty",
      "skincare",
      "glow",
      "care"
    ]

  },

  electronics: {

    voice: "professional",

    keywords: [
      "technology",
      "innovation",
      "performance",
      "smart"
    ]

  },

  furniture: {

    voice: "luxury",

    keywords: [
      "comfort",
      "design",
      "home",
      "quality"
    ]

  },

  restaurant: {

    voice: "friendly",

    keywords: [
      "fresh",
      "delicious",
      "taste",
      "menu"
    ]

  },

  sports: {

    voice: "energetic",

    keywords: [
      "performance",
      "fitness",
      "training",
      "strength"
    ]

  }

};

/*
|--------------------------------------------------------------------------
| Generate Content ID
|--------------------------------------------------------------------------
*/

const generateContentId = () => {

  return crypto
    .randomBytes(12)
    .toString("hex");

};

/*
|--------------------------------------------------------------------------
| Detect Brand Voice
|--------------------------------------------------------------------------
*/

const detectBrandVoice = (
  plan
) => {

  if (
    CATEGORY_PROFILES[
      plan.category
    ]
  ) {

    return CATEGORY_PROFILES[
      plan.category
    ].voice;

  }

  return "professional";

};

/*
|--------------------------------------------------------------------------
| Get Brand Voice
|--------------------------------------------------------------------------
*/

const getBrandVoice = (
  voice
) => {

  return (

    BRAND_VOICES[
      voice
    ] ||

    BRAND_VOICES.professional

  );

};

/*
|--------------------------------------------------------------------------
| Get Category Keywords
|--------------------------------------------------------------------------
*/

const getCategoryKeywords = (
  category
) => {

  return (

    CATEGORY_PROFILES[
      category
    ]?.keywords ||

    []

  );

};

/*
|--------------------------------------------------------------------------
| Build Initial Content Object
|--------------------------------------------------------------------------
*/

const buildInitialContent = (
  plan
) => {

  const voiceName =
    detectBrandVoice(
      plan
    );

  return {

    contentId:
      generateContentId(),

    category:
      plan.category,

    layout:
      plan.layout,

    language:
      plan.language || "en",

    brandVoice:
      voiceName,

    voice:
      getBrandVoice(
        voiceName
      ),

    keywords:
      getCategoryKeywords(
        plan.category
      ),

    homepage: {},

    products: [],

    collections: [],

    pages: {},

    blog: {},

    emails: {},

    marketing: {},

    seo: {}

  };

};

/*
|--------------------------------------------------------------------------
| Utilities
|--------------------------------------------------------------------------
*/

const capitalize = (
  value = ""
) => {

  if (!value.length) {

    return "";

  }

  return (
    value.charAt(0)
      .toUpperCase() +
    value.slice(1)
  );

};

const slugify = (
  value = ""
) => {

  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

};

/*
|--------------------------------------------------------------------------
| AI Homepage Content Generator
|--------------------------------------------------------------------------
|
| Continued in Part 2...
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| Announcement Bar
|--------------------------------------------------------------------------
*/

const buildAnnouncementBar = (
  plan
) => {

  const messages = {

    fashion:
      "✨ New arrivals are here. Shop the latest collection today.",

    beauty:
      "🌿 Discover premium beauty products with exclusive offers.",

    electronics:
      "🚀 Upgrade your technology with our newest innovations.",

    furniture:
      "🏡 Transform your home with timeless furniture.",

    jewelry:
      "💎 Luxury craftsmanship for every occasion.",

    restaurant:
      "🍽️ Freshly prepared meals delivered to your doorstep.",

    sports:
      "💪 Train harder with premium performance gear."

  };

  return {

    enabled: true,

    message:
      messages[
        plan.category
      ] ||

      "Welcome to our store.",

    linkText:
      "Shop Now",

    dismissible: true

  };

};

/*
|--------------------------------------------------------------------------
| Hero Content
|--------------------------------------------------------------------------
*/

const buildHeroContent = (
  plan,
  content
) => {

  const category =
    capitalize(
      plan.category
    );

  return {

    headline:

      `Discover Premium ${category} Products`,

    subheadline:

      `Carefully selected ${plan.category} products designed to deliver exceptional quality and value.`,

    primaryButton: {

      text: "Shop Now",

      url: "/collections/all"

    },

    secondaryButton: {

      text: "Learn More",

      url: "/pages/about"

    },

    alignment: "left"

  };

};

/*
|--------------------------------------------------------------------------
| Trust Badges
|--------------------------------------------------------------------------
*/

const buildTrustBadges = () => {

  return [

    {

      icon: "shield-check",

      title: "Secure Checkout",

      description:
        "100% secure payment"

    },

    {

      icon: "truck",

      title: "Fast Shipping",

      description:
        "Quick worldwide delivery"

    },

    {

      icon: "refresh-cw",

      title: "Easy Returns",

      description:
        "Hassle-free return policy"

    },

    {

      icon: "star",

      title: "Premium Quality",

      description:
        "Trusted by thousands"

    }

  ];

};

/*
|--------------------------------------------------------------------------
| Store Highlights
|--------------------------------------------------------------------------
*/

const buildHighlights = (
  plan
) => {

  return [

    `Premium ${plan.category} products`,

    "Secure online payments",

    "Excellent customer support",

    "Carefully curated collections"

  ];

};

/*
|--------------------------------------------------------------------------
| Homepage Introduction
|--------------------------------------------------------------------------
*/

const buildHomepageIntro = (
  plan,
  content
) => {

  return {

    title:
      `Welcome to Your ${capitalize(plan.category)} Destination`,

    description:

      `Browse our carefully curated collection of premium ${plan.category} products. We combine quality, exceptional service, and an enjoyable shopping experience to help you find exactly what you need.`

  };

};

/*
|--------------------------------------------------------------------------
| Newsletter Section
|--------------------------------------------------------------------------
*/

const buildNewsletterContent = () => {

  return {

    title:
      "Stay Updated",

    description:
      "Subscribe to receive exclusive offers, new arrivals, and product updates.",

    placeholder:
      "Enter your email",

    button:
      "Subscribe"

  };

};

/*
|--------------------------------------------------------------------------
| Homepage SEO
|--------------------------------------------------------------------------
*/

const buildHomepageSeo = (
  plan
) => {

  const category =
    capitalize(
      plan.category
    );

  return {

    title:
      `${category} Store | Premium ${category} Products`,

    description:

      `Shop premium ${plan.category} products with secure checkout, fast delivery, and excellent customer service.`,

    keywords: [

      ...getCategoryKeywords(
        plan.category
      ),

      plan.category,

      "online store",

      "shop",

      "premium"

    ]

  };

};

/*
|--------------------------------------------------------------------------
| Homepage Builder
|--------------------------------------------------------------------------
*/

const buildHomepageContent = (
  plan,
  content
) => {

  content.homepage = {

    announcement:
      buildAnnouncementBar(
        plan
      ),

    hero:
      buildHeroContent(
        plan,
        content
      ),

    trustBadges:
      buildTrustBadges(),

    highlights:
      buildHighlights(
        plan
      ),

    introduction:
      buildHomepageIntro(
        plan,
        content
      ),

    newsletter:
      buildNewsletterContent(),

    seo:
      buildHomepageSeo(
        plan
      )

  };

  return content;

};

/*
|--------------------------------------------------------------------------
| Product Content Generator
|--------------------------------------------------------------------------
|
| Continued in Part 3...
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| Product Title
|--------------------------------------------------------------------------
*/

const buildProductTitle = (
  plan,
  index = 1
) => {

  const prefixes = {

    fashion: "Signature",

    beauty: "Radiance",

    electronics: "Smart",

    furniture: "Heritage",

    jewelry: "Prestige",

    restaurant: "Chef's",

    sports: "Elite"

  };

  const prefix =
    prefixes[
      plan.category
    ] || "Premium";

  return `${prefix} ${capitalize(plan.category)} Product ${index}`;

};

/*
|--------------------------------------------------------------------------
| Product Short Description
|--------------------------------------------------------------------------
*/

const buildShortDescription = (
  plan
) => {

  return `Premium ${plan.category} product crafted for quality, performance and everyday satisfaction.`;

};

/*
|--------------------------------------------------------------------------
| Product Long Description
|--------------------------------------------------------------------------
*/

const buildLongDescription = (
  plan
) => {

  return `Experience premium ${plan.category} products designed with quality materials, exceptional craftsmanship and attention to detail. Every product is carefully selected to deliver reliability, durability and an outstanding customer experience.`;

};

/*
|--------------------------------------------------------------------------
| Product Features
|--------------------------------------------------------------------------
*/

const buildProductFeatures = (
  plan
) => {

  return [

    "Premium quality materials",

    "Excellent craftsmanship",

    "Modern design",

    "Reliable performance",

    "Customer satisfaction guaranteed"

  ];

};

/*
|--------------------------------------------------------------------------
| Product Benefits
|--------------------------------------------------------------------------
*/

const buildProductBenefits = () => {

  return [

    "Easy to use",

    "Long-lasting durability",

    "Premium finish",

    "Fast delivery",

    "Trusted quality"

  ];

};

/*
|--------------------------------------------------------------------------
| Product Specifications
|--------------------------------------------------------------------------
*/

const buildProductSpecifications = (
  plan
) => {

  return {

    category:
      capitalize(
        plan.category
      ),

    brand:
      "StoreForge AI",

    origin:
      "Global",

    warranty:
      "1 Year Limited Warranty",

    material:
      "Premium Materials"

  };

};

/*
|--------------------------------------------------------------------------
| Care Instructions
|--------------------------------------------------------------------------
*/

const buildCareInstructions = (
  plan
) => {

  const instructions = {

    fashion:
      "Machine wash cold. Do not bleach.",

    beauty:
      "Store in a cool, dry place away from sunlight.",

    electronics:
      "Keep away from moisture and extreme heat.",

    furniture:
      "Clean with a soft dry cloth.",

    jewelry:
      "Store in a jewelry box after use.",

    sports:
      "Clean after each use with a damp cloth."

  };

  return (

    instructions[
      plan.category
    ] ||

    "Follow the included care instructions."

  );

};

/*
|--------------------------------------------------------------------------
| Shipping Information
|--------------------------------------------------------------------------
*/

const buildShippingInfo = () => {

  return {

    processing:
      "1–2 business days",

    delivery:
      "3–7 business days",

    international: true,

    tracking: true

  };

};

/*
|--------------------------------------------------------------------------
| Return Policy
|--------------------------------------------------------------------------
*/

const buildReturnPolicy = () => {

  return {

    days: 30,

    freeReturns: true,

    exchangeAvailable: true

  };

};

/*
|--------------------------------------------------------------------------
| Product Badges
|--------------------------------------------------------------------------
*/

const buildProductBadges = () => {

  return [

    "Best Seller",

    "Premium",

    "Fast Shipping"

  ];

};

/*
|--------------------------------------------------------------------------
| Product SEO
|--------------------------------------------------------------------------
*/

const buildProductSeo = (
  product,
  plan
) => {

  return {

    title:
      product.title,

    description:
      product.shortDescription,

    slug:
      slugify(
        product.title
      ),

    keywords: [

      ...getCategoryKeywords(
        plan.category
      ),

      product.title,

      "buy online",

      "premium"

    ]

  };

};

/*
|--------------------------------------------------------------------------
| Build Product
|--------------------------------------------------------------------------
*/

const buildProduct = (
  plan,
  index
) => {

  const product = {

    id:
      crypto.randomUUID(),

    title:
      buildProductTitle(
        plan,
        index
      ),

    shortDescription:
      buildShortDescription(
        plan
      ),

    description:
      buildLongDescription(
        plan
      ),

    features:
      buildProductFeatures(
        plan
      ),

    benefits:
      buildProductBenefits(),

    specifications:
      buildProductSpecifications(
        plan
      ),

    care:
      buildCareInstructions(
        plan
      ),

    shipping:
      buildShippingInfo(),

    returns:
      buildReturnPolicy(),

    badges:
      buildProductBadges()

  };

  product.seo =
    buildProductSeo(
      product,
      plan
    );

  return product;

};

/*
|--------------------------------------------------------------------------
| Product Catalog Builder
|--------------------------------------------------------------------------
*/

const buildProductCatalog = (
  plan,
  content
) => {

  const count =

    plan.catalogSize === "enterprise"

      ? 20

      : plan.catalogSize === "large"

      ? 12

      : plan.catalogSize === "medium"

      ? 8

      : 4;

  content.products = [];

  for (
    let i = 1;
    i <= count;
    i++
  ) {

    content.products.push(

      buildProduct(
        plan,
        i
      )

    );

  }

  return content;

};

/*
|--------------------------------------------------------------------------
| Collection Content Generator
|--------------------------------------------------------------------------
|
| Continued in Part 4...
|--------------------------------------------------------------------------
/*
|--------------------------------------------------------------------------
| Collection Name
|--------------------------------------------------------------------------
*/

const buildCollectionName = (
  plan,
  index
) => {

  const libraries = {

    fashion: [
      "New Arrivals",
      "Best Sellers",
      "Summer Collection",
      "Premium Collection",
      "Limited Edition",
      "Accessories"
    ],

    beauty: [
      "Skincare",
      "Makeup",
      "Hair Care",
      "Best Sellers",
      "Gift Sets",
      "New Arrivals"
    ],

    electronics: [
      "Smart Devices",
      "Accessories",
      "Gaming",
      "Work From Home",
      "Latest Technology",
      "Best Sellers"
    ],

    furniture: [
      "Living Room",
      "Bedroom",
      "Dining",
      "Office",
      "Outdoor",
      "Best Sellers"
    ],

    jewelry: [
      "Rings",
      "Necklaces",
      "Bracelets",
      "Luxury",
      "Wedding",
      "New Arrivals"
    ],

    restaurant: [
      "Popular Meals",
      "Chef Specials",
      "Desserts",
      "Drinks",
      "Family Meals",
      "Seasonal"
    ],

    sports: [
      "Training",
      "Running",
      "Gym Essentials",
      "Outdoor",
      "Recovery",
      "Best Sellers"
    ]

  };

  const list =
    libraries[
      plan.category
    ] || [
      "Featured",
      "Best Sellers",
      "New Arrivals",
      "Premium"
    ];

  return list[
    (index - 1) % list.length
  ];

};

/*
|--------------------------------------------------------------------------
| Collection Builder
|--------------------------------------------------------------------------
*/

const buildCollection = (
  plan,
  index
) => {

  const name =
    buildCollectionName(
      plan,
      index
    );

  return {

    id:
      crypto.randomUUID(),

    name,

    slug:
      slugify(name),

    description:

      `Explore our carefully selected ${name.toLowerCase()} for premium ${plan.category} products.`,

    heroTitle:
      name,

    heroDescription:

      `Discover quality ${plan.category} products in our ${name.toLowerCase()} collection.`,

    seo: {

      title:
        `${name} | ${capitalize(plan.category)} Collection`,

      description:

        `Shop ${name.toLowerCase()} with premium quality and fast delivery.`,

      keywords: [

        name,

        plan.category,

        ...getCategoryKeywords(
          plan.category
        )

      ]

    }

  };

};

/*
|--------------------------------------------------------------------------
| Collections Builder
|--------------------------------------------------------------------------
*/

const buildCollections = (
  plan,
  content
) => {

  const total =

    plan.catalogSize ===
    "enterprise"

      ? 8

      : plan.catalogSize ===
        "large"

      ? 6

      : 4;

  content.collections = [];

  for (
    let i = 1;
    i <= total;
    i++
  ) {

    content.collections.push(

      buildCollection(
        plan,
        i
      )

    );

  }

  return content;

};

/*
|--------------------------------------------------------------------------
| Blog Categories
|--------------------------------------------------------------------------
*/

const buildBlogCategories = (
  plan
) => {

  const categories = {

    fashion: [
      "Style Guide",
      "Fashion Trends",
      "Buying Guide"
    ],

    beauty: [
      "Beauty Tips",
      "Skincare",
      "Makeup"
    ],

    electronics: [
      "Technology",
      "Buying Guide",
      "Reviews"
    ],

    furniture: [
      "Interior Design",
      "Home Ideas",
      "Furniture Care"
    ],

    jewelry: [
      "Jewelry Care",
      "Luxury",
      "Gift Guide"
    ],

    restaurant: [
      "Recipes",
      "Chef Stories",
      "Food Tips"
    ],

    sports: [
      "Fitness",
      "Training",
      "Nutrition"
    ]

  };

  return (

    categories[
      plan.category
    ] ||

    [
      "News",
      "Guides",
      "Updates"
    ]

  );

};

/*
|--------------------------------------------------------------------------
| Blog Post Builder
|--------------------------------------------------------------------------
*/

const buildBlogPost = (
  plan,
  category,
  index
) => {

  const title =
    `${category}: ${capitalize(plan.category)} Guide ${index}`;

  return {

    id:
      crypto.randomUUID(),

    title,

    slug:
      slugify(title),

    excerpt:

      `Learn more about ${plan.category} with practical tips and expert insights.`,

    content:

      `This article explores ${category.toLowerCase()} for ${plan.category}. Expand this with AI-generated long-form content in future versions.`,

    tags: [

      category,

      plan.category,

      "guide"

    ],

    seo: {

      title,

      description:

        `Expert advice on ${category.toLowerCase()} for ${plan.category}.`

    }

  };

};

/*
|--------------------------------------------------------------------------
| Blog Builder
|--------------------------------------------------------------------------
*/

const buildBlogContent = (
  plan,
  content
) => {

  const categories =
    buildBlogCategories(
      plan
    );

  const posts = [];

  categories.forEach(
    (
      category,
      categoryIndex
    ) => {

      for (
        let i = 1;
        i <= 2;
        i++
      ) {

        posts.push(

          buildBlogPost(
            plan,
            category,
            (
              categoryIndex * 2
            ) + i
          )

        );

      }

    }
  );

  content.blog = {

    categories,

    posts

  };

  return content;

};

/*
|--------------------------------------------------------------------------
| Search Keywords
|--------------------------------------------------------------------------
*/

const buildSearchKeywords = (
  plan,
  content
) => {

  const keywords = new Set();

  getCategoryKeywords(
    plan.category
  ).forEach(

    keyword =>
      keywords.add(keyword)

  );

  content.collections.forEach(

    collection =>
      keywords.add(
        collection.name
      )

  );

  content.products.forEach(

    product =>
      keywords.add(
        product.title
      )

  );

  content.searchKeywords =
    Array.from(
      keywords
    );

  return content;

};

/*
|--------------------------------------------------------------------------
| Static Pages Generator
|--------------------------------------------------------------------------
|
| Continued in Part 5...
|--------------------------------------------------------------------------
