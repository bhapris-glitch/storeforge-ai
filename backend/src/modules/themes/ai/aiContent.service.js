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
/*
|--------------------------------------------------------------------------
| About Us Page
|--------------------------------------------------------------------------
*/

const buildAboutPage = (
  plan,
  content
) => {

  const category =
    capitalize(
      plan.category
    );

  const brandVoice =
    content.voice?.tone ||
    "Professional";

  return {

    title:
      `About Our ${category} Store`,

    headline:
      `Quality ${category} Products, Chosen With Purpose`,

    introduction:

      `We believe shopping for ${plan.category} products should be simple, inspiring, and enjoyable. Our store carefully curates products that combine quality, thoughtful design, and excellent value.`,

    story:

      `Our journey began with a simple goal: to create a trusted destination for people looking for exceptional ${plan.category} products. Every product and collection is selected with our customers in mind.`,

    mission:

      `Our mission is to make high-quality ${plan.category} products accessible while delivering a seamless shopping experience from discovery to delivery.`,

    values: [

      "Quality",

      "Customer First",

      "Trust",

      "Innovation",

      "Continuous Improvement"

    ],

    brandVoice,

    cta: {

      text:
        "Explore Our Collection",

      url:
        "/collections/all"

    },

    seo: {

      title:
        `About Us | ${category} Store`,

      description:

        `Learn about our mission, values, and commitment to providing quality ${plan.category} products.`

    }

  };

};

/*
|--------------------------------------------------------------------------
| Contact Page
|--------------------------------------------------------------------------
*/

const buildContactPage = (
  plan
) => {

  return {

    title:
      "Contact Us",

    headline:
      "We're Here to Help",

    description:

      `Have a question about our ${plan.category} products, your order, shipping, or returns? Our support team is ready to help.`,

    form: {

      fields: [

        {
          name: "name",
          type: "text",
          required: true
        },

        {
          name: "email",
          type: "email",
          required: true
        },

        {
          name: "orderNumber",
          type: "text",
          required: false
        },

        {
          name: "subject",
          type: "text",
          required: true
        },

        {
          name: "message",
          type: "textarea",
          required: true
        }

      ],

      submitText:
        "Send Message"

    },

    support: {

      responseTime:
        "Within 1 business day",

      email:
        "support@example.com",

      availability:
        "Monday–Friday"

    },

    seo: {

      title:
        "Contact Us",

      description:

        "Contact our customer support team for help with products, orders, shipping, and returns."

    }

  };

};

/*
|--------------------------------------------------------------------------
| FAQ Page
|--------------------------------------------------------------------------
*/

const buildFaqPage = (
  plan
) => {

  const category =
    plan.category;

  const faqs = [

    {

      question:
        "How do I place an order?",

      answer:

        "Browse our products, add your preferred items to the cart, and complete checkout using your preferred payment method."

    },

    {

      question:
        "What payment methods do you accept?",

      answer:

        "We accept the secure payment methods available at checkout. Available options may vary depending on your location."

    },

    {

      question:
        "How long does shipping take?",

      answer:

        "Orders are generally processed within 1–2 business days and delivered within 3–7 business days, depending on your location."

    },

    {

      question:
        "Do you offer returns?",

      answer:

        "Yes. Eligible products can generally be returned within 30 days, subject to our return policy."

    },

    {

      question:
        `How can I choose the right ${category} product?`,

      answer:

        `Review the product details, features, specifications, and customer reviews to choose the ${category} product that best matches your needs.`

    },

    {

      question:
        "How can I track my order?",

      answer:

        "Once your order has shipped, you will receive tracking information when available."

    },

    {

      question:
        "How can I contact customer support?",

      answer:

        "You can contact our support team through the Contact Us page. We aim to respond within one business day."

    }

  ];

  return {

    title:
      "Frequently Asked Questions",

    headline:
      "How Can We Help?",

    description:

      "Find answers to common questions about our products, orders, payments, shipping, and returns.",

    categories: [

      "Orders",

      "Payments",

      "Shipping",

      "Returns",

      "Products",

      "Support"

    ],

    faqs,

    searchable: true,

    seo: {

      title:
        "FAQ | Frequently Asked Questions",

      description:

        "Find answers to common questions about products, orders, payments, shipping, and returns."

    }

  };

};

/*
|--------------------------------------------------------------------------
| Privacy Policy
|--------------------------------------------------------------------------
*/

const buildPrivacyPolicy = (
  plan
) => {

  return {

    title:
      "Privacy Policy",

    lastUpdated:
      new Date().toISOString(),

    sections: [

      {

        heading:
          "Information We Collect",

        content:

          "We may collect information you provide when creating an account, placing an order, contacting support, or subscribing to communications."

      },

      {

        heading:
          "How We Use Information",

        content:

          "Information may be used to process orders, provide customer support, improve our services, communicate with customers, and maintain store security."

      },

      {

        heading:
          "Cookies",

        content:

          "We may use cookies and similar technologies to provide essential store functionality, understand usage, personalize experiences, and measure performance."

      },

      {

        heading:
          "Data Security",

        content:

          "We use reasonable technical and organizational measures designed to protect customer information from unauthorized access, loss, misuse, or disclosure."

      },

      {

        heading:
          "Your Rights",

        content:

          "Depending on your location, you may have rights concerning access, correction, deletion, portability, or restriction of your personal information."

      },

      {

        heading:
          "Contact",

        content:

          "For privacy-related questions or requests, contact the store owner or privacy representative using the contact information provided on this website."

      }

    ]

  };

};

/*
|--------------------------------------------------------------------------
| Shipping Policy
|--------------------------------------------------------------------------
*/

const buildShippingPolicy = (
  plan
) => {

  return {

    title:
      "Shipping Policy",

    processingTime:
      "1–2 business days",

    estimatedDelivery:
      "3–7 business days",

    sections: [

      {

        heading:
          "Order Processing",

        content:

          "Orders are typically processed within 1–2 business days. Processing times may be longer during holidays, promotions, or periods of unusually high demand."

      },

      {

        heading:
          "Delivery",

        content:

          "Estimated delivery times depend on the destination, shipping method, carrier, and product availability."

      },

      {

        heading:
          "Order Tracking",

        content:

          "Tracking information will be provided when available after your order has been shipped."

      },

      {

        heading:
          "International Shipping",

        content:

          "International shipping availability, delivery times, customs duties, and taxes may vary by destination."

      },

      {

        heading:
          "Delivery Delays",

        content:

          "Delivery estimates are not guaranteed. Delays may occur because of weather, carrier disruptions, customs processing, or other circumstances outside our control."

      }

    ]

  };

};

/*
|--------------------------------------------------------------------------
| Refund Policy
|--------------------------------------------------------------------------
*/

const buildRefundPolicy = (
  plan
) => {

  return {

    title:
      "Refund & Return Policy",

    returnWindow:
      30,

    sections: [

      {

        heading:
          "Return Window",

        content:

          "Eligible products may generally be returned within 30 days of delivery, provided they meet the applicable return conditions."

      },

      {

        heading:
          "Return Condition",

        content:

          "Products should be returned in their original condition and packaging where applicable. Certain products may be excluded from returns for legal, hygiene, or other reasons."

      },

      {

        heading:
          "Refund Processing",

        content:

          "Approved refunds are generally issued to the original payment method. Processing times may vary depending on the payment provider."

      },

      {

        heading:
          "Damaged or Incorrect Items",

        content:

          "If you receive a damaged, defective, or incorrect item, contact customer support as soon as possible with relevant order details and photographs where appropriate."

      },

      {

        heading:
          "Non-Returnable Items",

        content:

          "Certain customized, personalized, perishable, or hygiene-sensitive products may not be eligible for return unless required by applicable law."

      }

    ]

  };

};

/*
|--------------------------------------------------------------------------
| Terms & Conditions
|--------------------------------------------------------------------------
*/

const buildTermsPage = (
  plan
) => {

  return {

    title:
      "Terms & Conditions",

    sections: [

      {

        heading:
          "Use of Website",

        content:

          "By accessing or using this website, you agree to comply with these terms and all applicable laws and regulations."

      },

      {

        heading:
          "Products and Pricing",

        content:

          "Product descriptions, availability, and pricing may change without notice. We reserve the right to correct errors and cancel orders where necessary."

      },

      {

        heading:
          "Orders",

        content:

          "An order is subject to acceptance and availability. We may contact you if additional information is required to process your order."

      },

      {

        heading:
          "Intellectual Property",

        content:

          "Website content, branding, images, text, and other materials are protected by applicable intellectual property laws and may not be used without authorization."

      },

      {

        heading:
          "Limitation of Liability",

        content:

          "To the extent permitted by applicable law, the store is not responsible for indirect or consequential losses arising from the use of the website or products."

      },

      {

        heading:
          "Changes to Terms",

        content:

          "We may update these terms from time to time. Updated terms become effective when published on this website."

      }

    ]

  };

};

/*
|--------------------------------------------------------------------------
| 404 Page
|--------------------------------------------------------------------------
*/

const build404Page = () => {

  return {

    title:
      "Page Not Found",

    headline:
      "Oops! We Can't Find That Page.",

    description:

      "The page you are looking for may have moved, been removed, or no longer exists.",

    primaryButton: {

      text:
        "Back to Home",

      url:
        "/"

    },

    secondaryButton: {

      text:
        "Continue Shopping",

      url:
        "/collections/all"

    }

  };

};

/*
|--------------------------------------------------------------------------
| Thank You Page
|--------------------------------------------------------------------------
*/

const buildThankYouPage = () => {

  return {

    title:
      "Thank You for Your Order",

    headline:
      "Your Order Has Been Received!",

    description:

      "Thank you for shopping with us. We are preparing your order and will send tracking information when it becomes available.",

    primaryButton: {

      text:
        "Continue Shopping",

      url:
        "/collections/all"

    }

  };

};

/*
|--------------------------------------------------------------------------
| Customer Service Page
|--------------------------------------------------------------------------
*/

const buildCustomerServicePage = (
  plan
) => {

  return {

    title:
      "Customer Service",

    headline:
      "We're Here to Help",

    description:

      `Our customer service team is available to help with your ${plan.category} shopping experience.`,

    supportOptions: [

      {

        title:
          "Order Support",

        description:
          "Get help with an existing order."

      },

      {

        title:
          "Product Questions",

        description:
          "Ask questions about products and specifications."

      },

      {

        title:
          "Shipping Support",

        description:
          "Get assistance with delivery and tracking."

      },

      {

        title:
          "Returns & Refunds",

        description:
          "Learn about returns, exchanges, and refunds."

      }

    ],

    cta: {

      text:
        "Contact Support",

      url:
        "/pages/contact"

    }

  };

};

/*
|--------------------------------------------------------------------------
| Static Pages Builder
|--------------------------------------------------------------------------
*/

const buildStaticPages = (
  plan,
  content
) => {

  content.pages = {

    about:
      buildAboutPage(
        plan,
        content
      ),

    contact:
      buildContactPage(
        plan
      ),

    faq:
      buildFaqPage(
        plan
      ),

    privacy:
      buildPrivacyPolicy(
        plan
      ),

    shipping:
      buildShippingPolicy(
        plan
      ),

    refund:
      buildRefundPolicy(
        plan
      ),

    terms:
      buildTermsPage(
        plan
      ),

    notFound:
      build404Page(),

    thankYou:
      buildThankYouPage(),

    customerService:
      buildCustomerServicePage(
        plan
      )

  };

  return content;

};

/*
|--------------------------------------------------------------------------
| Static Pages Content Engine
|--------------------------------------------------------------------------
|
| Continued in Part 6...
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Email Content Engine
|--------------------------------------------------------------------------
|
| Generates structured transactional and marketing email content.
| These templates are provider-agnostic and can later be connected to:
|
| - Shopify Email
| - Klaviyo
| - Mailchimp
| - SendGrid
| - Resend
| - Custom SMTP
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Email Brand Header
|--------------------------------------------------------------------------
*/

const buildEmailBrandHeader = (
  plan,
  content
) => {

  return {

    brandName:
      plan.brandName ||
      "Your Store",

    brandVoice:
      content.voice?.tone ||
      "Professional",

    greeting:
      "Hello {{customer.first_name}}",

    logoVariable:
      "{{brand.logo_url}}"

  };

};


/*
|--------------------------------------------------------------------------
| Welcome Email
|--------------------------------------------------------------------------
*/

const buildWelcomeEmail = (
  plan,
  content
) => {

  const category =
    capitalize(
      plan.category
    );

  return {

    id:
      "welcome-email",

    type:
      "welcome",

    enabled:
      true,

    trigger:
      "customer_signup",

    subject:
      `Welcome to our ${category} store!`,

    preheader:
      `Discover premium ${plan.category} products curated for you.`,

    content: {

      headline:
        "Welcome to the Family!",

      greeting:
        "We're so glad you're here.",

      body:

        `Thank you for joining us. Discover our carefully selected ${plan.category} products and find something you'll love.`,

      primaryCta: {

        text:
          "Start Shopping",

        url:
          "/collections/all"

      },

      secondaryCta: {

        text:
          "Learn About Us",

        url:
          "/pages/about"

      },

      closing:
        "Thank you for choosing us."

    },

    variables: [

      "customer.first_name",

      "brand.logo_url"

    ]

  };

};


/*
|--------------------------------------------------------------------------
| Order Confirmation Email
|--------------------------------------------------------------------------
*/

const buildOrderConfirmationEmail = (
  plan
) => {

  return {

    id:
      "order-confirmation-email",

    type:
      "transactional",

    enabled:
      true,

    trigger:
      "order_created",

    subject:
      "We've received your order {{order.name}}",

    preheader:
      "Your order has been successfully placed.",

    content: {

      headline:
        "Thank You for Your Order!",

      body:

        "We've received your order and are getting everything ready for you.",

      orderSummary: {

        enabled:
          true,

        showProductImage:
          true,

        showQuantity:
          true,

        showPrice:
          true,

        showSubtotal:
          true,

        showShipping:
          true,

        showTax:
          true,

        showTotal:
          true

      },

      primaryCta: {

        text:
          "View Your Order",

        url:
          "{{order.status_url}}"

      },

      supportText:

        "If you have any questions about your order, our support team is here to help."

    },

    variables: [

      "order.name",

      "order.status_url",

      "order.items",

      "order.total",

      "customer.first_name"

    ]

  };

};


/*
|--------------------------------------------------------------------------
| Shipping Confirmation Email
|--------------------------------------------------------------------------
*/

const buildShippingConfirmationEmail = (
  plan
) => {

  return {

    id:
      "shipping-confirmation-email",

    type:
      "transactional",

    enabled:
      true,

    trigger:
      "order_fulfilled",

    subject:
      "Your order is on the way! 🚚",

    preheader:
      "Track your package and see when it will arrive.",

    content: {

      headline:
        "Your Order Has Shipped!",

      body:

        "Great news! Your order is on its way and should be arriving soon.",

      tracking: {

        enabled:
          true,

        carrier:
          "{{fulfillment.tracking_company}}",

        trackingNumber:
          "{{fulfillment.tracking_number}}",

        trackingUrl:
          "{{fulfillment.tracking_url}}"

      },

      primaryCta: {

        text:
          "Track Your Order",

        url:
          "{{fulfillment.tracking_url}}"

      }

    },

    variables: [

      "fulfillment.tracking_company",

      "fulfillment.tracking_number",

      "fulfillment.tracking_url"

    ]

  };

};


/*
|--------------------------------------------------------------------------
| Abandoned Cart Email
|--------------------------------------------------------------------------
*/

const buildAbandonedCartEmail = (
  plan,
  content
) => {

  const category =
    plan.category;

  return {

    id:
      "abandoned-cart-email",

    type:
      "recovery",

    enabled:
      true,

    trigger:
      "checkout_abandoned",

    delay:
      "1_hour",

    subject:
      "Did you forget something?",

    preheader:

      `Your ${category} favorites are still waiting for you.`,

    content: {

      headline:
        "Your Cart Is Waiting",

      body:

        `You were so close! The ${category} products you selected are still waiting in your cart.`,

      urgency:

        "Complete your purchase before your favorite items are gone.",

      cartItems: {

        enabled:
          true,

        showImages:
          true,

        showPrices:
          true

      },

      primaryCta: {

        text:
          "Complete Your Purchase",

        url:
          "{{checkout.url}}"

      },

      secondaryCta: {

        text:
          "Continue Shopping",

        url:
          "/collections/all"

      },

      incentive: {

        enabled:
          false,

        type:
          "percentage",

        value:
          10,

        code:
          "{{discount.code}}"

      }

    },

    variables: [

      "checkout.url",

      "cart.items",

      "discount.code"

    ]

  };

};


/*
|--------------------------------------------------------------------------
| Review Request Email
|--------------------------------------------------------------------------
*/

const buildReviewRequestEmail = (
  plan
) => {

  return {

    id:
      "review-request-email",

    type:
      "post_purchase",

    enabled:
      true,

    trigger:
      "order_delivered",

    delay:
      "7_days",

    subject:
      "How did you like your purchase?",

    preheader:
      "Your feedback helps us improve.",

    content: {

      headline:
        "We'd Love to Hear From You!",

      body:

        "We hope you're enjoying your purchase. Would you take a moment to share your experience?",

      productReview: {

        enabled:
          true,

        showProductImage:
          true,

        ratingScale:
          5

      },

      primaryCta: {

        text:
          "Leave a Review",

        url:
          "{{review.url}}"

      },

      secondaryCta: {

        text:
          "Shop Again",

        url:
          "/collections/all"

      }

    },

    variables: [

      "customer.first_name",

      "order.items",

      "review.url"

    ]

  };

};


/*
|--------------------------------------------------------------------------
| Loyalty Email
|--------------------------------------------------------------------------
*/

const buildLoyaltyEmail = (
  plan,
  content
) => {

  return {

    id:
      "loyalty-email",

    type:
      "loyalty",

    enabled:
      true,

    trigger:
      "loyalty_milestone",

    subject:
      "You've earned a reward! 🎉",

    preheader:
      "Thank you for being a valued customer.",

    content: {

      headline:
        "You're Part of Something Special",

      body:

        "Thank you for being a loyal customer. We've added a special reward to your account.",

      reward: {

        enabled:
          true,

        title:
          "Your Exclusive Reward",

        value:
          "{{loyalty.reward}}",

        code:
          "{{loyalty.code}}",

        expiry:
          "{{loyalty.expiry}}"

      },

      primaryCta: {

        text:
          "Redeem Your Reward",

        url:
          "/collections/all"

      }

    },

    variables: [

      "customer.first_name",

      "loyalty.reward",

      "loyalty.code",

      "loyalty.expiry"

    ]

  };

};


/*
|--------------------------------------------------------------------------
| Newsletter Email
|--------------------------------------------------------------------------
*/

const buildNewsletterEmail = (
  plan,
  content
) => {

  const category =
    capitalize(
      plan.category
    );

  return {

    id:
      "newsletter-email",

    type:
      "marketing",

    enabled:
      true,

    trigger:
      "newsletter_campaign",

    subject:
      `New ${category} arrivals you'll love`,

    preheader:
      "Discover what's new in our store.",

    content: {

      headline:
        "What's New This Month?",

      body:

        `Discover the latest ${plan.category} products, customer favorites, and special offers from our store.`,

      featuredProducts: {

        enabled:
          true,

        limit:
          4

      },

      primaryCta: {

        text:
          "Explore New Arrivals",

        url:
          "/collections/new-arrivals"

      },

      secondaryCta: {

        text:
          "Shop Best Sellers",

        url:
          "/collections/best-sellers"

      }

    }

  };

};


/*
|--------------------------------------------------------------------------
| Promotional Email
|--------------------------------------------------------------------------
*/

const buildPromotionalEmail = (
  plan
) => {

  return {

    id:
      "promotional-email",

    type:
      "marketing",

    enabled:
      true,

    trigger:
      "campaign",

    subject:
      "Something special is waiting for you",

    preheader:
      "Discover our latest offer.",

    content: {

      headline:
        "A Special Offer Just for You",

      body:

        "For a limited time, enjoy an exclusive offer on selected products.",

      promotion: {

        type:
          "percentage",

        value:
          10,

        code:
          "WELCOME10",

        expiry:
          "{{campaign.expiry}}"

      },

      primaryCta: {

        text:
          "Shop the Offer",

        url:
          "/collections/all"

      },

      urgency:
        "Offer available for a limited time."

    },

    variables: [

      "campaign.expiry"

    ]

  };

};


/*
|--------------------------------------------------------------------------
| Email Footer
|--------------------------------------------------------------------------
*/

const buildEmailFooter = () => {

  return {

    companyName:
      "{{brand.name}}",

    address:
      "{{brand.address}}",

    supportEmail:
      "{{brand.support_email}}",

    socialLinks: {

      instagram:
        "{{social.instagram}}",

      facebook:
        "{{social.facebook}}",

      twitter:
        "{{social.twitter}}",

      youtube:
        "{{social.youtube}}"

    },

    links: [

      {

        text:
          "Shop",

        url:
          "/collections/all"

      },

      {

        text:
          "About Us",

        url:
          "/pages/about"

      },

      {

        text:
          "Contact",

        url:
          "/pages/contact"

      },

      {

        text:
          "Privacy Policy",

        url:
          "/policies/privacy-policy"

      },

      {

        text:
          "Unsubscribe",

        url:
          "{{unsubscribe.url}}"

      }

    ]

  };

};


/*
|--------------------------------------------------------------------------
| Email Builder
|--------------------------------------------------------------------------
*/

const buildEmailContent = (
  plan,
  content
) => {

  content.emails = {

    brand:
      buildEmailBrandHeader(
        plan,
        content
      ),

    welcome:
      buildWelcomeEmail(
        plan,
        content
      ),

    orderConfirmation:
      buildOrderConfirmationEmail(
        plan
      ),

    shippingConfirmation:
      buildShippingConfirmationEmail(
        plan
      ),

    abandonedCart:
      buildAbandonedCartEmail(
        plan,
        content
      ),

    reviewRequest:
      buildReviewRequestEmail(
        plan
      ),

    loyalty:
      buildLoyaltyEmail(
        plan,
        content
      ),

    newsletter:
      buildNewsletterEmail(
        plan,
        content
      ),

    promotional:
      buildPromotionalEmail(
        plan
      ),

    footer:
      buildEmailFooter()

  };

  return content;

};


/*
|--------------------------------------------------------------------------
| Email Validation
|--------------------------------------------------------------------------
*/

const validateEmailContent = (
  emails
) => {

  const errors = [];

  if (!emails)
    errors.push(
      "Email content is missing."
    );

  if (
    !emails.welcome
  )
    errors.push(
      "Welcome email is missing."
    );

  if (
    !emails.orderConfirmation
  )
    errors.push(
      "Order confirmation email is missing."
    );

  if (
    !emails.shippingConfirmation
  )
    errors.push(
      "Shipping confirmation email is missing."
    );

  if (
    !emails.abandonedCart
  )
    errors.push(
      "Abandoned cart email is missing."
    );

  if (
    !emails.reviewRequest
  )
    errors.push(
      "Review request email is missing."
    );

  return {

    valid:
      errors.length === 0,

    errors

  };

};


/*
|--------------------------------------------------------------------------
| Marketing Content Engine
|--------------------------------------------------------------------------
|
| Continued in Part 7...
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| SEO Content Engine
|--------------------------------------------------------------------------
|
| Generates structured SEO metadata for:
|
| - Homepage
| - Products
| - Collections
| - Pages
| - Blog posts
| - Open Graph
| - Twitter Cards
| - JSON-LD structured data
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| SEO Configuration
|--------------------------------------------------------------------------
*/

const buildSeoConfig = (
  plan,
  content
) => {

  return {

    siteName:
      plan.brandName ||
      "Your Store",

    defaultLanguage:
      plan.language ||
      content.language ||
      "en",

    defaultLocale:
      plan.locale ||
      "en-US",

    baseUrl:
      plan.storeUrl ||
      "{{shop.url}}",

    robots:
      "index,follow",

    maxTitleLength:
      60,

    maxDescriptionLength:
      160

  };

};


/*
|--------------------------------------------------------------------------
| Clean SEO Text
|--------------------------------------------------------------------------
*/

const cleanSeoText = (
  value = ""
) => {

  return value

    .replace(
      /\s+/g,
      " "
    )

    .trim();

};


/*
|--------------------------------------------------------------------------
| Limit SEO Text Length
|--------------------------------------------------------------------------
*/

const limitSeoText = (
  value = "",
  maxLength = 160
) => {

  const text =
    cleanSeoText(
      value
    );

  if (
    text.length <=
    maxLength
  ) {

    return text;

  }

  return (

    text
      .substring(
        0,
        maxLength - 3
      )
      .trim() +
    "..."

  );

};


/*
|--------------------------------------------------------------------------
| Generate SEO Title
|--------------------------------------------------------------------------
*/

const generateSeoTitle = (
  title,
  plan
) => {

  const brandName =
    plan.brandName ||
    "Your Store";

  const baseTitle =
    cleanSeoText(
      title
    );

  const fullTitle =
    `${baseTitle} | ${brandName}`;

  return limitSeoText(
    fullTitle,
    60
  );

};


/*
|--------------------------------------------------------------------------
| Generate SEO Description
|--------------------------------------------------------------------------
*/

const generateSeoDescription = (
  description
) => {

  return limitSeoText(
    description,
    160
  );

};


/*
|--------------------------------------------------------------------------
| Homepage SEO
|--------------------------------------------------------------------------
*/

const buildHomepageSeoData = (
  plan,
  content
) => {

  const category =
    capitalize(
      plan.category
    );

  const title =
    `${category} Store | Premium ${category} Products`;

  const description =

    `Discover premium ${plan.category} products with quality, secure checkout, fast delivery, and exceptional customer service.`;

  return {

    title:
      generateSeoTitle(
        title,
        plan
      ),

    description:
      generateSeoDescription(
        description
      ),

    canonical:
      "{{shop.url}}",

    robots:
      "index,follow",

    keywords: [

      ...getCategoryKeywords(
        plan.category
      ),

      `${plan.category} store`,

      `buy ${plan.category} online`,

      `premium ${plan.category}`,

      "online shopping"

    ]

  };

};


/*
|--------------------------------------------------------------------------
| Product SEO Generator
|--------------------------------------------------------------------------
*/

const buildProductSeoData = (
  product,
  plan
) => {

  const title =
    product.title ||
    `Premium ${capitalize(plan.category)} Product`;

  const description =

    product.shortDescription ||

    `Discover this premium ${plan.category} product, carefully selected for quality and exceptional value.`;

  return {

    title:
      generateSeoTitle(
        title,
        plan
      ),

    description:
      generateSeoDescription(
        description
      ),

    canonical:
      `{{shop.url}}/products/${product.seo?.slug || slugify(title)}`,

    robots:
      "index,follow",

    keywords: [

      ...getCategoryKeywords(
        plan.category
      ),

      title,

      `buy ${plan.category}`,

      "shop online"

    ]

  };

};


/*
|--------------------------------------------------------------------------
| Collection SEO Generator
|--------------------------------------------------------------------------
*/

const buildCollectionSeoData = (
  collection,
  plan
) => {

  const title =
    collection.name ||
    "Featured Collection";

  const description =

    collection.description ||

    `Explore our ${plan.category} collection featuring carefully selected products.`;

  return {

    title:
      generateSeoTitle(
        title,
        plan
      ),

    description:
      generateSeoDescription(
        description
      ),

    canonical:
      `{{shop.url}}/collections/${collection.slug}`,

    robots:
      "index,follow",

    keywords: [

      collection.name,

      plan.category,

      ...getCategoryKeywords(
        plan.category
      )

    ]

  };

};


/*
|--------------------------------------------------------------------------
| Page SEO Generator
|--------------------------------------------------------------------------
*/

const buildPageSeoData = (
  page,
  plan
) => {

  const title =
    page.title ||
    "Page";

  const description =

    page.description ||

    page.introduction ||

    `Learn more about our ${plan.category} store and services.`;

  return {

    title:
      generateSeoTitle(
        title,
        plan
      ),

    description:
      generateSeoDescription(
        description
      ),

    canonical:
      `{{shop.url}}/pages/${slugify(title)}`,

    robots:
      "index,follow"

  };

};


/*
|--------------------------------------------------------------------------
| Blog SEO Generator
|--------------------------------------------------------------------------
*/

const buildBlogSeoData = (
  post,
  plan
) => {

  const title =
    post.title ||
    "Latest News";

  const description =

    post.excerpt ||

    `Read our latest insights, guides, and news about ${plan.category}.`;

  return {

    title:
      generateSeoTitle(
        title,
        plan
      ),

    description:
      generateSeoDescription(
        description
      ),

    canonical:
      `{{shop.url}}/blogs/news/${post.slug}`,

    robots:
      "index,follow",

    keywords:

      post.tags ||

      [

        plan.category,

        "guide",

        "tips"

      ]

  };

};


/*
|--------------------------------------------------------------------------
| Open Graph Metadata
|--------------------------------------------------------------------------
*/

const buildOpenGraph = (
  seo,
  plan
) => {

  return {

    enabled:
      true,

    type:
      "website",

    title:
      seo.title,

    description:
      seo.description,

    url:
      seo.canonical,

    siteName:
      plan.brandName ||
      "Your Store",

    image:
      "{{shop.meta_image | image_url: width: 1200}}",

    imageWidth:
      1200,

    imageHeight:
      630

  };

};


/*
|--------------------------------------------------------------------------
| Product Open Graph
|--------------------------------------------------------------------------
*/

const buildProductOpenGraph = (
  product,
  seo,
  plan
) => {

  return {

    ...buildOpenGraph(
      seo,
      plan
    ),

    type:
      "product",

    title:
      product.title,

    description:
      seo.description,

    image:
      product.featuredImage ||

      "{{product.featured_image | image_url: width: 1200}}"

  };

};


/*
|--------------------------------------------------------------------------
| Twitter Card
|--------------------------------------------------------------------------
*/

const buildTwitterCard = (
  seo
) => {

  return {

    card:
      "summary_large_image",

    title:
      seo.title,

    description:
      seo.description,

    image:
      "{{shop.meta_image | image_url: width: 1200}}"

  };

};


/*
|--------------------------------------------------------------------------
| Organization Schema
|--------------------------------------------------------------------------
*/

const buildOrganizationSchema = (
  plan
) => {

  return {

    "@context":
      "https://schema.org",

    "@type":
      "Organization",

    name:
      plan.brandName ||
      "Your Store",

    url:
      "{{shop.url}}",

    logo:
      "{{shop.brand.logo | image_url}}",

    sameAs: [

      "{{social.instagram}}",

      "{{social.facebook}}",

      "{{social.youtube}}"

    ]

  };

};


/*
|--------------------------------------------------------------------------
| WebSite Schema
|--------------------------------------------------------------------------
*/

const buildWebsiteSchema = (
  plan
) => {

  return {

    "@context":
      "https://schema.org",

    "@type":
      "WebSite",

    name:
      plan.brandName ||
      "Your Store",

    url:
      "{{shop.url}}",

    potentialAction: {

      "@type":
        "SearchAction",

      target:
        "{{shop.url}}/search?q={search_term_string}",

      "query-input":
        "required name=search_term_string"

    }

  };

};


/*
|--------------------------------------------------------------------------
| Product Schema
|--------------------------------------------------------------------------
*/

const buildProductSchema = (
  product,
  plan
) => {

  return {

    "@context":
      "https://schema.org",

    "@type":
      "Product",

    name:
      product.title,

    description:
      product.description,

    brand: {

      "@type":
        "Brand",

      name:
        plan.brandName ||
        "Your Store"

    },

    image:

      product.featuredImage ||

      "{{product.featured_image | image_url}}",

    sku:
      "{{product.selected_or_first_available_variant.sku}}",

    offers: {

      "@type":
        "Offer",

      url:
        "{{product.url}}",

      priceCurrency:
        "{{cart.currency.iso_code}}",

      price:
        "{{product.price | money_without_currency}}",

      availability:

        "{{product.available}}"

          ? "https://schema.org/InStock"

          : "https://schema.org/OutOfStock"

    }

  };

};


/*
|--------------------------------------------------------------------------
| Article Schema
|--------------------------------------------------------------------------
*/

const buildArticleSchema = (
  post,
  plan
) => {

  return {

    "@context":
      "https://schema.org",

    "@type":
      "Article",

    headline:
      post.title,

    description:
      post.excerpt,

    url:
      `{{shop.url}}/blogs/news/${post.slug}`,

    author: {

      "@type":
        "Organization",

      name:
        plan.brandName ||
        "Your Store"

    },

    publisher: {

      "@type":
        "Organization",

      name:
        plan.brandName ||
        "Your Store"

    },

    datePublished:
      "{{article.published_at}}",

    dateModified:
      "{{article.updated_at}}"

  };

};


/*
|--------------------------------------------------------------------------
| FAQ Schema
|--------------------------------------------------------------------------
*/

const buildFaqSchema = (
  faqPage
) => {

  if (
    !faqPage?.faqs?.length
  ) {

    return null;

  }

  return {

    "@context":
      "https://schema.org",

    "@type":
      "FAQPage",

    mainEntity:

      faqPage.faqs.map(
        faq => ({

          "@type":
            "Question",

          name:
            faq.question,

          acceptedAnswer: {

            "@type":
              "Answer",

            text:
              faq.answer

          }

        })
      )

  };

};


/*
|--------------------------------------------------------------------------
| SEO Sitemap Data
|--------------------------------------------------------------------------
*/

const buildSitemapData = (
  content
) => {

  const urls = [

    "/",

    "/collections/all",

    "/pages/about",

    "/pages/contact",

    "/pages/faq"

  ];

  content.collections
    ?.forEach(
      collection => {

        urls.push(

          `/collections/${collection.slug}`

        );

      }
    );

  content.products
    ?.forEach(
      product => {

        urls.push(

          `/products/${product.seo.slug}`

        );

      }
    );

  content.blog?.posts
    ?.forEach(
      post => {

        urls.push(

          `/blogs/news/${post.slug}`

        );

      }
    );

  return urls;

};


/*
|--------------------------------------------------------------------------
| Build Complete SEO Engine
|--------------------------------------------------------------------------
*/

const buildSeoContent = (
  plan,
  content
) => {

  const seoConfig =
    buildSeoConfig(
      plan,
      content
    );

  const homepageSeo =
    buildHomepageSeoData(
      plan,
      content
    );

  const productSeo =

    content.products.map(
      product => ({

        productId:
          product.id,

        seo:
          buildProductSeoData(
            product,
            plan
          ),

        openGraph:
          buildProductOpenGraph(
            product,
            buildProductSeoData(
              product,
              plan
            ),
            plan
          )

      })
    );

  const collectionSeo =

    content.collections.map(
      collection => ({

        collectionId:
          collection.id,

        seo:
          buildCollectionSeoData(
            collection,
            plan
          )

      })
    );

  const pageSeo = {};

  Object.entries(
    content.pages
  ).forEach(
    (
      [key, page]
    ) => {

      pageSeo[key] =
        buildPageSeoData(
          page,
          plan
        );

    }
  );

  const blogSeo =

    content.blog.posts.map(
      post => ({

        postId:
          post.id,

        seo:
          buildBlogSeoData(
            post,
            plan
          )

      })
    );

  const faqSchema =
    buildFaqSchema(
      content.pages.faq
    );

  content.seo = {

    config:
      seoConfig,

    homepage: {

      seo:
        homepageSeo,

      openGraph:
        buildOpenGraph(
          homepageSeo,
          plan
        ),

      twitter:
        buildTwitterCard(
          homepageSeo
        )

    },

    products:
      productSeo,

    collections:
      collectionSeo,

    pages:
      pageSeo,

    blog:
      blogSeo,

    structuredData: {

      organization:
        buildOrganizationSchema(
          plan
        ),

      website:
        buildWebsiteSchema(
          plan
        ),

      faq:
        faqSchema

    },

    sitemap:
      buildSitemapData(
        content
      )

  };

  return content;

};


/*
|--------------------------------------------------------------------------
| SEO Content Engine
|--------------------------------------------------------------------------
|
| Continued in Part 8...
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Content Validation & Quality Engine
|--------------------------------------------------------------------------
|
| Validates the complete AI-generated content package before it is passed
| to the next StoreForge AI theme-generation services.
|
| Responsibilities:
|
| - Validate required content sections
| - Validate homepage
| - Validate products
| - Validate collections
| - Validate static pages
| - Validate emails
| - Validate SEO
| - Detect placeholder content
| - Detect missing content
| - Check brand consistency
| - Check accessibility basics
| - Generate quality score
| - Generate recommendations
| - Build AI provider payload
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Required Content Sections
|--------------------------------------------------------------------------
*/

const REQUIRED_CONTENT_SECTIONS = [

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
| Required Static Pages
|--------------------------------------------------------------------------
*/

const REQUIRED_STATIC_PAGES = [

  "about",

  "contact",

  "faq",

  "privacy",

  "shipping",

  "refund",

  "terms",

  "notFound",

  "thankYou",

  "customerService"

];


/*
|--------------------------------------------------------------------------
| Required Email Templates
|--------------------------------------------------------------------------
*/

const REQUIRED_EMAILS = [

  "welcome",

  "orderConfirmation",

  "shippingConfirmation",

  "abandonedCart",

  "reviewRequest",

  "loyalty",

  "newsletter",

  "promotional"

];


/*
|--------------------------------------------------------------------------
| Placeholder Detection
|--------------------------------------------------------------------------
*/

const PLACEHOLDER_PATTERNS = [

  "lorem ipsum",

  "example.com",

  "your store",

  "your brand",

  "insert text",

  "replace this",

  "sample text",

  "placeholder",

  "todo",

  "coming soon"

];


/*
|--------------------------------------------------------------------------
| Generic Content Detection
|--------------------------------------------------------------------------
*/

const GENERIC_CONTENT_PATTERNS = [

  "product 1",

  "product 2",

  "product 3",

  "collection 1",

  "collection 2",

  "blog post 1",

  "blog post 2"

];


/*
|--------------------------------------------------------------------------
| Validate Basic Value
|--------------------------------------------------------------------------
*/

const isValidValue = (
  value
) => {

  if (
    value === null ||
    value === undefined
  ) {

    return false;

  }

  if (
    typeof value === "string"
  ) {

    return (
      value.trim().length > 0
    );

  }

  if (
    Array.isArray(value)
  ) {

    return (
      value.length > 0
    );

  }

  if (
    typeof value === "object"
  ) {

    return (
      Object.keys(value).length > 0
    );

  }

  return true;

};


/*
|--------------------------------------------------------------------------
| Validate Required Sections
|--------------------------------------------------------------------------
*/

const validateRequiredSections = (
  content
) => {

  const errors = [];

  REQUIRED_CONTENT_SECTIONS
    .forEach(
      section => {

        if (
          !isValidValue(
            content[
              section
            ]
          )
        ) {

          errors.push(

            `Missing required content section: ${section}`

          );

        }

      }
    );

  return errors;

};


/*
|--------------------------------------------------------------------------
| Validate Homepage
|--------------------------------------------------------------------------
*/

const validateHomepageContent = (
  homepage
) => {

  const errors = [];

  if (
    !homepage
  ) {

    return [

      "Homepage content is missing."

    ];

  }

  if (
    !homepage.hero
  ) {

    errors.push(
      "Homepage hero section is missing."
    );

  }

  if (
    !homepage.hero?.headline
  ) {

    errors.push(
      "Homepage hero headline is missing."
    );

  }

  if (
    !homepage.hero?.subheadline
  ) {

    errors.push(
      "Homepage hero subheadline is missing."
    );

  }

  if (
    !homepage.hero?.primaryButton
  ) {

    errors.push(
      "Homepage primary CTA is missing."
    );

  }

  if (
    !homepage.trustBadges ||
    homepage.trustBadges.length === 0
  ) {

    errors.push(
      "Homepage trust badges are missing."
    );

  }

  if (
    !homepage.newsletter
  ) {

    errors.push(
      "Homepage newsletter content is missing."
    );

  }

  return errors;

};


/*
|--------------------------------------------------------------------------
| Validate Product Content
|--------------------------------------------------------------------------
*/

const validateProductContent = (
  products
) => {

  const errors = [];

  if (
    !Array.isArray(
      products
    ) ||
    products.length === 0
  ) {

    return [

      "Product catalog is empty."

    ];

  }

  products.forEach(
    (
      product,
      index
    ) => {

      const position =
        `Product ${index + 1}`;

      if (
        !product.title
      ) {

        errors.push(
          `${position} is missing a title.`
        );

      }

      if (
        !product.description
      ) {

        errors.push(
          `${position} is missing a description.`
        );

      }

      if (
        !product.features ||
        product.features.length === 0
      ) {

        errors.push(
          `${position} is missing features.`
        );

      }

      if (
        !product.benefits ||
        product.benefits.length === 0
      ) {

        errors.push(
          `${position} is missing benefits.`
        );

      }

      if (
        !product.seo
      ) {

        errors.push(
          `${position} is missing SEO data.`
        );

      }

    }
  );

  return errors;

};


/*
|--------------------------------------------------------------------------
| Validate Collection Content
|--------------------------------------------------------------------------
*/

const validateCollectionContent = (
  collections
) => {

  const errors = [];

  if (
    !Array.isArray(
      collections
    ) ||
    collections.length === 0
  ) {

    return [

      "Collection catalog is empty."

    ];

  }

  collections.forEach(
    (
      collection,
      index
    ) => {

      const position =
        `Collection ${index + 1}`;

      if (
        !collection.name
      ) {

        errors.push(
          `${position} is missing a name.`
        );

      }

      if (
        !collection.slug
      ) {

        errors.push(
          `${position} is missing a slug.`
        );

      }

      if (
        !collection.description
      ) {

        errors.push(
          `${position} is missing a description.`
        );

      }

      if (
        !collection.seo
      ) {

        errors.push(
          `${position} is missing SEO data.`
        );

      }

    }
  );

  return errors;

};


/*
|--------------------------------------------------------------------------
| Validate Static Pages
|--------------------------------------------------------------------------
*/

const validateStaticPages = (
  pages
) => {

  const errors = [];

  if (
    !pages
  ) {

    return [

      "Static pages content is missing."

    ];

  }

  REQUIRED_STATIC_PAGES
    .forEach(
      page => {

        if (
          !pages[
            page
          ]
        ) {

          errors.push(

            `Static page is missing: ${page}`

          );

        }

      }
    );

  return errors;

};


/*
|--------------------------------------------------------------------------
| Validate Email Content
|--------------------------------------------------------------------------
*/

const validateRequiredEmails = (
  emails
) => {

  const errors = [];

  if (
    !emails
  ) {

    return [

      "Email content is missing."

    ];

  }

  REQUIRED_EMAILS
    .forEach(
      email => {

        if (
          !emails[
            email
          ]
        ) {

          errors.push(

            `Email template is missing: ${email}`

          );

        }

      }
    );

  return errors;

};


/*
|--------------------------------------------------------------------------
| Validate SEO Content
|--------------------------------------------------------------------------
*/

const validateSeoContent = (
  seo
) => {

  const errors = [];

  if (
    !seo
  ) {

    return [

      "SEO content is missing."

    ];

  }

  if (
    !seo.homepage
  ) {

    errors.push(
      "Homepage SEO is missing."
    );

  }

  if (
    !seo.products
  ) {

    errors.push(
      "Product SEO is missing."
    );

  }

  if (
    !seo.collections
  ) {

    errors.push(
      "Collection SEO is missing."
    );

  }

  if (
    !seo.structuredData
  ) {

    errors.push(
      "Structured data is missing."
    );

  }

  return errors;

};


/*
|--------------------------------------------------------------------------
| Detect Placeholder Content
|--------------------------------------------------------------------------
*/

const detectPlaceholders = (
  content
) => {

  const matches = [];

  const serialized =
    JSON.stringify(
      content
    ).toLowerCase();

  PLACEHOLDER_PATTERNS
    .forEach(
      pattern => {

        if (
          serialized.includes(
            pattern
          )
        ) {

          matches.push(
            pattern
          );

        }

      }
    );

  return [

    ...new Set(
      matches
    )

  ];

};


/*
|--------------------------------------------------------------------------
| Detect Generic Content
|--------------------------------------------------------------------------
*/

const detectGenericContent = (
  content
) => {

  const matches = [];

  const serialized =
    JSON.stringify(
      content
    ).toLowerCase();

  GENERIC_CONTENT_PATTERNS
    .forEach(
      pattern => {

        if (
          serialized.includes(
            pattern
          )
        ) {

          matches.push(
            pattern
          );

        }

      }
    );

  return [

    ...new Set(
      matches
    )

  ];

};


/*
|--------------------------------------------------------------------------
| Brand Consistency Check
|--------------------------------------------------------------------------
*/

const validateBrandConsistency = (
  plan,
  content
) => {

  const warnings = [];

  const brandName =
    plan.brandName;

  if (
    !brandName
  ) {

    warnings.push(

      "Brand name is not defined."

    );

  }

  if (
    !content.brandVoice
  ) {

    warnings.push(

      "Brand voice is not defined."

    );

  }

  if (
    !content.voice
  ) {

    warnings.push(

      "Brand voice configuration is missing."

    );

  }

  if (
    !content.language
  ) {

    warnings.push(

      "Content language is not defined."

    );

  }

  return warnings;

};


/*
|--------------------------------------------------------------------------
| Accessibility Content Check
|--------------------------------------------------------------------------
*/

const validateAccessibilityContent = (
  content
) => {

  const warnings = [];

  if (
    content.homepage?.hero
  ) {

    if (
      !content.homepage.hero
        .headline
    ) {

      warnings.push(

        "Hero section should include a descriptive heading."

      );

    }

  }

  if (
    content.products
  ) {

    content.products
      .forEach(
        (
          product,
          index
        ) => {

          if (
            !product.title
          ) {

            warnings.push(

              `Product ${index + 1} requires descriptive text for accessibility.`

            );

          }

        }
      );

  }

  return warnings;

};


/*
|--------------------------------------------------------------------------
| Content Quality Score
|--------------------------------------------------------------------------
*/

const calculateContentQualityScore = (
  validation
) => {

  let score = 100;

  const errorPenalty =
    validation.errors.length *
    5;

  const warningPenalty =
    validation.warnings.length *
    2;

  const placeholderPenalty =
    validation.placeholders.length *
    4;

  const genericPenalty =
    validation.genericContent.length *
    3;

  score -=
    errorPenalty;

  score -=
    warningPenalty;

  score -=
    placeholderPenalty;

  score -=
    genericPenalty;

  if (
    score < 0
  ) {

    score = 0;

  }

  return score;

};


/*
|--------------------------------------------------------------------------
| Generate Content Recommendations
|--------------------------------------------------------------------------
*/

const generateContentRecommendations = (
  validation,
  plan
) => {

  const recommendations = [];

  if (
    validation.errors.length > 0
  ) {

    recommendations.push(

      "Fix all required content errors before publishing the generated theme."

    );

  }

  if (
    validation.placeholders.length > 0
  ) {

    recommendations.push(

      "Replace placeholder content with merchant-specific AI-generated content."

    );

  }

  if (
    validation.genericContent.length > 0
  ) {

    recommendations.push(

      "Improve generic product and collection names using the merchant's actual product catalog."

    );

  }

  if (
    validation.warnings.length > 0
  ) {

    recommendations.push(

      "Review accessibility and brand consistency warnings before publishing."

    );

  }

  if (
    !plan.brandName
  ) {

    recommendations.push(

      "Provide a brand name to improve SEO titles, emails, and storefront consistency."

    );

  }

  if (
    !plan.storeUrl
  ) {

    recommendations.push(

      "Provide the Shopify store URL before final SEO and canonical URL generation."

    );

  }

  recommendations.push(

    "Review AI-generated legal policies before publishing."

  );

  recommendations.push(

    "Verify product claims, specifications, pricing, shipping times, and warranty information against real merchant data."

  );

  return [

    ...new Set(
      recommendations
    )

  ];

};


/*
|--------------------------------------------------------------------------
| Full Content Validation
|--------------------------------------------------------------------------
*/

const validateContent = (
  plan,
  content
) => {

  const errors = [];

  const warnings = [];

  const requiredErrors =
    validateRequiredSections(
      content
    );

  errors.push(
    ...requiredErrors
  );

  errors.push(

    ...validateHomepageContent(
      content.homepage
    )

  );

  errors.push(

    ...validateProductContent(
      content.products
    )

  );

  errors.push(

    ...validateCollectionContent(
      content.collections
    )

  );

  errors.push(

    ...validateStaticPages(
      content.pages
    )

  );

  errors.push(

    ...validateRequiredEmails(
      content.emails
    )

  );

  errors.push(

    ...validateSeoContent(
      content.seo
    )

  );

  warnings.push(

    ...validateBrandConsistency(
      plan,
      content
    )

  );

  warnings.push(

    ...validateAccessibilityContent(
      content
    )

  );

  const placeholders =
    detectPlaceholders(
      content
    );

  const genericContent =
    detectGenericContent(
      content
    );

  const validation = {

    valid:
      errors.length === 0,

    errors,

    warnings,

    placeholders,

    genericContent,

    qualityScore:
      0

  };

  validation.qualityScore =
    calculateContentQualityScore(
      validation
    );

  validation.recommendations =
    generateContentRecommendations(
      validation,
      plan
    );

  return validation;

};


/*
|--------------------------------------------------------------------------
| Content Summary
|--------------------------------------------------------------------------
*/

const buildContentSummary = (
  content
) => {

  return {

    contentId:
      content.contentId,

    language:
      content.language,

    brandVoice:
      content.brandVoice,

    homepage:
      Boolean(
        content.homepage
      ),

    products:
      content.products?.length ||
      0,

    collections:
      content.collections?.length ||
      0,

    blogPosts:
      content.blog?.posts?.length ||
      0,

    blogCategories:
      content.blog?.categories?.length ||
      0,

    staticPages:
      Object.keys(
        content.pages || {}
      ).length,

    emailTemplates:
      Object.keys(
        content.emails || {}
      ).length,

    seoPages:
      Object.keys(
        content.seo || {}
      ).length,

    searchKeywords:
      content.searchKeywords?.length ||
      0

  };

};


/*
|--------------------------------------------------------------------------
| AI Provider Payload
|--------------------------------------------------------------------------
|
| This creates a clean payload that can be passed to the AI provider
| service. The provider itself should be implemented separately.
|
|--------------------------------------------------------------------------
*/

const buildAIProviderPayload = (
  plan,
  content,
  validation
) => {

  return {

    requestId:
      crypto.randomUUID(),

    contentId:
      content.contentId,

    task:
      "storefront_content_generation",

    language:
      content.language,

    category:
      plan.category,

    brand: {

      name:
        plan.brandName ||
        null,

      voice:
        content.brandVoice,

      voiceProfile:
        content.voice

    },

    requirements: {

      generateUniqueContent:
        true,

      avoidPlaceholders:
        true,

      avoidGenericContent:
        true,

      optimizeForSEO:
        true,

      optimizeForConversion:
        true,

      accessibilityAware:
        true

    },

    currentContent:
      content,

    validation: {

      qualityScore:
        validation.qualityScore,

      errors:
        validation.errors,

      warnings:
        validation.warnings

    }

  };

};


/*
|--------------------------------------------------------------------------
| Prepare Content For Theme Generation
|--------------------------------------------------------------------------
*/

const prepareContentForThemeGeneration = (
  plan,
  content
) => {

  const validation =
    validateContent(
      plan,
      content
    );

  const summary =
    buildContentSummary(
      content
    );

  const aiPayload =
    buildAIProviderPayload(
      plan,
      content,
      validation
    );

  return {

    content,

    validation,

    summary,

    aiPayload

  };

};


/*
|--------------------------------------------------------------------------
| Content Quality Gate
|--------------------------------------------------------------------------
*/

const contentQualityGate = (
  validation,
  minimumScore = 70
) => {

  return {

    passed:

      validation.valid &&

      validation.qualityScore >=
        minimumScore,

    score:
      validation.qualityScore,

    minimumScore,

    errors:
      validation.errors,

    warnings:
      validation.warnings,

    recommendations:
      validation.recommendations

  };

};


/*
|--------------------------------------------------------------------------
| AI Content Regeneration Targets
|--------------------------------------------------------------------------
|
| Returns only the sections that require regeneration.
|
|--------------------------------------------------------------
*/
const getContentRegenerationTargets = (
  validation
) => {

  const targets = [];

  if (
    validation.errors.some(
      error =>
        error
          .toLowerCase()
          .includes(
            "homepage"
          )
    )
  ) {

    targets.push(
      "homepage"
    );

  }

  if (
    validation.errors.some(
  error =>
    error
      .toLowerCase()
      .includes("product")
)
    )
  ) {

    targets.push(
      "products"
    );

  }

  if (
  validation.errors.some(
    error =>
      error
        .toLowerCase()
        .includes(
          "collection"
        )
  )
) {
  targets.push(
    "collections"
  );
}

  if (
    validation.errors.some(
      error =>
        error
          .toLowerCase()
          .includes(
            "static page"
          )
    )
  ) {

    targets.push(
      "pages"
    );

  }

  if (
    validation.errors.some(
      error =>
        error
          .toLowerCase()
        .includes(
               "email"
          )
    )
  ) {

    targets.push(
      "emails"
    );

  }

  if (
    validation.errors.some(
      error =>
        error
          .toLowerCase()
          .includes(
            "seo"
          )
    )
  ) {

    targets.push(
      "seo"
    );
    }

  return [

    ...new Set(
      targets
    )

  ];

};


/*
|--------------------------------------------------------------------------
| Part 10
|--------------------------------------------------------------------------
|
| Master content generation pipeline and module exports.
|
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| PART 10 / 10
| Master Content Generation Pipeline
|--------------------------------------------------------------------------
|
| This is the final orchestration layer for aiContent.service.js.
|
| Pipeline:
|
| 1. Normalize AI generation plan
| 2. Build initial content structure
| 3. Generate homepage content
| 4. Generate product catalog
| 5. Generate collections
| 6. Generate blog content
| 7. Build search keywords
| 8. Generate static pages
| 9. Generate email content
| 10. Generate SEO content
| 11. Validate generated content
| 12. Calculate quality gate
| 13. Build summary
| 14. Prepare AI provider payload
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Default Generation Plan
|--------------------------------------------------------------------------
*/

const DEFAULT_CONTENT_PLAN = {

  brandName:
    "Your Store",

  category:
    "general",

  language:
    "en",

  locale:
    "en-US",

  layout:
    "modern",

  catalogSize:
    "small",

  storeUrl:
    null

};


/*
|--------------------------------------------------------------------------
| Normalize Content Plan
|--------------------------------------------------------------------------
*/

const normalizeContentPlan = (
  plan = {}
) => {

  const normalized = {

    ...DEFAULT_CONTENT_PLAN,

    ...plan

  };


  /*
  |--------------------------------------------------------------------------
  | Normalize Category
  |--------------------------------------------------------------------------
  */

  normalized.category = String(

    normalized.category ||

    DEFAULT_CONTENT_PLAN.category

  )

    .toLowerCase()

    .trim();


  /*
  |--------------------------------------------------------------------------
  | Normalize Language
  |--------------------------------------------------------------------------
  */

  normalized.language = String(

    normalized.language ||

    DEFAULT_CONTENT_PLAN.language

  )

    .toLowerCase()

    .trim();


  /*
  |--------------------------------------------------------------------------
  | Validate Language
  |--------------------------------------------------------------------------
  */

  if (
    !SUPPORTED_LANGUAGES.includes(
      normalized.language
    )
  ) {

    normalized.language =
      DEFAULT_CONTENT_PLAN.language;

  }


  /*
  |--------------------------------------------------------------------------
  | Normalize Catalog Size
  |--------------------------------------------------------------------------
  */

  const validCatalogSizes = [

    "small",

    "medium",

    "large",

    "enterprise"

  ];


  if (
    !validCatalogSizes.includes(
      normalized.catalogSize
    )
  ) {

    normalized.catalogSize =
      "small";

  }


  /*
  |--------------------------------------------------------------------------
  | Normalize Layout
  |--------------------------------------------------------------------------
  */

  normalized.layout = String(

    normalized.layout ||

    DEFAULT_CONTENT_PLAN.layout

  )

    .toLowerCase()

    .trim();


  /*
  |--------------------------------------------------------------------------
  | Normalize Brand Name
  |--------------------------------------------------------------------------
  */

  if (
    normalized.brandName
  ) {

    normalized.brandName = String(

      normalized.brandName

    ).trim();

  }


  return normalized;

};


/*
|--------------------------------------------------------------------------
| Generate Content ID
|--------------------------------------------------------------------------
*/

const generateGenerationId = () => {

  return crypto.randomUUID();

};


/*
|--------------------------------------------------------------------------
| Content Generation Metadata
|--------------------------------------------------------------------------
*/

const buildGenerationMetadata = (
  plan,
  generationId
) => {

  return {

    generationId,

    generatedAt:
      new Date().toISOString(),

    generator:
      "StoreForge AI Content Engine",

    version:
      "1.0.0",

    category:
      plan.category,

    language:
      plan.language,

    locale:
      plan.locale,

    layout:
      plan.layout,

    catalogSize:
      plan.catalogSize

  };

};


/*
|--------------------------------------------------------------------------
| Generate All Store Content
|--------------------------------------------------------------------------
|
| Main public generation function.
|
|--------------------------------------------------------------------------
*/

const generateContent = (
  inputPlan = {}
) => {

  /*
  |--------------------------------------------------------------------------
  | Step 1
  | Normalize Input
  |--------------------------------------------------------------------------
  */

  const plan =
    normalizeContentPlan(
      inputPlan
    );


  /*
  |--------------------------------------------------------------------------
  | Step 2
  | Create Generation ID
  |--------------------------------------------------------------------------
  */

  const generationId =
    generateGenerationId();


  /*
  |--------------------------------------------------------------------------
  | Step 3
  | Build Initial Content Object
  |--------------------------------------------------------------------------
  */

  let content =
    buildInitialContent(
      plan
    );


  /*
  |--------------------------------------------------------------------------
  | Step 4
  | Attach Generation Metadata
  |--------------------------------------------------------------------------
  */

  content.metadata =
    buildGenerationMetadata(
      plan,
      generationId
    );


  /*
  |--------------------------------------------------------------------------
  | Step 5
  | Generate Homepage
  |--------------------------------------------------------------------------
  */

  content =
    buildHomepageContent(
      plan,
      content
    );


  /*
  |--------------------------------------------------------------------------
  | Step 6
  | Generate Products
  |--------------------------------------------------------------------------
  */

  content =
    buildProductCatalog(
      plan,
      content
    );


  /*
  |--------------------------------------------------------------------------
  | Step 7
  | Generate Collections
  |--------------------------------------------------------------------------
  */

  content =
    buildCollections(
      plan,
      content
    );


  /*
  |--------------------------------------------------------------------------
  | Step 8
  | Generate Blog Content
  |--------------------------------------------------------------------------
  */

  content =
    buildBlogContent(
      plan,
      content
    );


  /*
  |--------------------------------------------------------------------------
  | Step 9
  | Generate Search Keywords
  |--------------------------------------------------------------------------
  */

  content =
    buildSearchKeywords(
      plan,
      content
    );


  /*
  |--------------------------------------------------------------------------
  | Step 10
  | Generate Static Pages
  |--------------------------------------------------------------------------
  */

  content =
    buildStaticPages(
      plan,
      content
    );


  /*
  |--------------------------------------------------------------------------
  | Step 11
  | Generate Email Content
  |--------------------------------------------------------------------------
  */

  content =
    buildEmailContent(
      plan,
      content
    );


  /*
  |--------------------------------------------------------------------------
  | Step 12
  | Generate SEO Content
  |--------------------------------------------------------------------------
  */

  content =
    buildSeoContent(
      plan,
      content
    );


  /*
  |--------------------------------------------------------------------------
  | Step 13
  | Validate Complete Content
  |--------------------------------------------------------------------------
  */

  const validation =
    validateContent(
      plan,
      content
    );


  /*
  |--------------------------------------------------------------------------
  | Step 14
  | Build Quality Gate
  |--------------------------------------------------------------------------
  */

  const qualityGate =
    contentQualityGate(
      validation
    );


  /*
  |--------------------------------------------------------------------------
  | Step 15
  | Build Summary
  |--------------------------------------------------------------------------
  */

  const summary =
    buildContentSummary(
      content
    );


  /*
  |--------------------------------------------------------------------------
  | Step 16
  | Prepare AI Provider Payload
  |--------------------------------------------------------------------------
  */

  const aiPayload =
    buildAIProviderPayload(
      plan,
      content,
      validation
    );


  /*
  |--------------------------------------------------------------------------
  | Step 17
  | Regeneration Targets
  |--------------------------------------------------------------------------
  */

  const regenerationTargets =
    getContentRegenerationTargets(
      validation
    );


  /*
  |--------------------------------------------------------------------------
  | Final Response
  |--------------------------------------------------------------------------
  */

  return {

    success:
      true,

    generationId,

    plan,

    content,

    validation,

    qualityGate,

    summary,

    aiPayload,

    regenerationTargets

  };

};


/*
|--------------------------------------------------------------------------
| Generate Content With Quality Requirement
|--------------------------------------------------------------------------
|
| Useful when downstream theme generation requires a minimum quality score.
|
|--------------------------------------------------------------------------
*/

const generateProductionContent = (
  inputPlan = {},
  minimumScore = 70
) => {

  const result =
    generateContent(
      inputPlan
    );


  const productionGate =
    contentQualityGate(

      result.validation,

      minimumScore

    );


  return {

    ...result,

    productionGate,

    readyForThemeGeneration:
      productionGate.passed

  };

};


/*
|--------------------------------------------------------------------------
| Validate Existing Content
|--------------------------------------------------------------------------
|
| Allows regenerated or manually edited content to be validated again
| without running the complete generation pipeline.
|
|--------------------------------------------------------------------------
*/

const validateExistingContent = (
  plan = {},
  content = {}
) => {

  const normalizedPlan =
    normalizeContentPlan(
      plan
    );


  const validation =
    validateContent(
      normalizedPlan,
      content
    );


  const qualityGate =
    contentQualityGate(
      validation
    );


  return {

    valid:
      validation.valid,

    validation,

    qualityGate,

    summary:
      buildContentSummary(
        content
      ),

    regenerationTargets:
      getContentRegenerationTargets(
        validation
      )

  };

};


/*
|--------------------------------------------------------------------------
| Regenerate Specific Sections
|--------------------------------------------------------------------------
|
| This function provides the orchestration contract for future AI-powered
| regeneration.
|
| The actual AI provider call should happen in the AI provider/service layer.
|
|--------------------------------------------------------------------------
*/

const getRegenerationPlan = (
  plan = {},
  content = {},
  validation = null
) => {

  const normalizedPlan =
    normalizeContentPlan(
      plan
    );


  const currentValidation =

    validation ||

    validateContent(
      normalizedPlan,
      content
    );


  const targets =
    getContentRegenerationTargets(
      currentValidation
    );


  return {

    generationId:
      crypto.randomUUID(),

    category:
      normalizedPlan.category,

    language:
      normalizedPlan.language,

    targets,

    instructions: {

      regenerateOnlyFailedSections:
        true,

      preserveValidContent:
        true,

      preserveContentIds:
        true,

      preserveBrandVoice:
        true,

      preserveLanguage:
        true,

      preserveSeoStructure:
        true

    },

    currentContent:
      content

  };

};


/*
|--------------------------------------------------------------------------
| Get Public Content Statistics
|--------------------------------------------------------------------------
*/

const getContentStatistics = (
  content = {}
) => {

  return {

    products:
      Array.isArray(
        content.products
      )
        ? content.products.length
        : 0,

    collections:
      Array.isArray(
        content.collections
      )
        ? content.collections.length
        : 0,

    blogPosts:

      Array.isArray(
        content.blog?.posts
      )
        ? content.blog.posts.length
        : 0,

    blogCategories:

      Array.isArray(
        content.blog?.categories
      )
        ? content.blog.categories.length
        : 0,

    staticPages:

      Object.keys(
        content.pages || {}
      ).length,

    emailTemplates:

      Object.keys(
        content.emails || {}
      ).length,

    seoEntities:

      Object.keys(
        content.seo || {}
      ).length,

    searchKeywords:

      Array.isArray(
        content.searchKeywords
      )
        ? content.searchKeywords.length
        : 0

  };

};


/*
|--------------------------------------------------------------------------
| Export Public API
|--------------------------------------------------------------------------
|
| Only expose functions that other modules need.
|
|--------------------------------------------------------------------------
*/

module.exports = {

  /*
  |--------------------------------------------------------------------------
  | Main Generation API
  |--------------------------------------------------------------------------
  */

  generateContent,

  generateProductionContent,


  /*
  |--------------------------------------------------------------------------
  | Validation API
  |--------------------------------------------------------------------------
  */

  validateContent,

  validateExistingContent,


  /*
  |--------------------------------------------------------------------------
  | Quality API
  |--------------------------------------------------------------------------
  */

  contentQualityGate,


  /*
  |--------------------------------------------------------------------------
  | Regeneration API
  |--------------------------------------------------------------------------
  */

  getRegenerationPlan,

  getContentRegenerationTargets,


  /*
  |--------------------------------------------------------------------------
  | Summary & Statistics API
  |--------------------------------------------------------------------------
  */

  buildContentSummary,

  getContentStatistics,


  /*
  |--------------------------------------------------------------------------
  | Individual Content Builders
  |--------------------------------------------------------------------------
  |
  | Exported for testing, targeted generation, and future AI regeneration.
  |
  |--------------------------------------------------------------------------
  */

  buildHomepageContent,

  buildProductCatalog,

  buildCollections,

  buildBlogContent,

  buildStaticPages,

  buildEmailContent,

  buildSeoContent,


  /*
  |--------------------------------------------------------------------------
  | Utility API
  |--------------------------------------------------------------------------
  */

  normalizeContentPlan,

  detectBrandVoice,

  getBrandVoice,

  getCategoryKeywords,

  slugify,

  capitalize

};


/*
|--------------------------------------------------------------------------
| END OF aiContent.service.js
|--------------------------------------------------------------------------
|
| StoreForge AI Content Engine
|
| Complete pipeline:
|
| Input Prompt
|      ↓
| Content Plan
|      ↓
| Homepage
|      ↓
| Products
|      ↓
| Collections
|      ↓
| Blog
|      ↓
| Static Pages
|      ↓
| Emails
|      ↓
| SEO
|      ↓
| Validation
|      ↓
| Quality Gate
|      ↓
| AI Provider Payload
|      ↓
| Theme Generation
|
|--------------------------------------------------------------------------
*/
