/**
 * ============================================================================
 * StoreForge AI
 * AI Service
 * ============================================================================
 *
 * File:
 * backend/src/modules/ai/ai.service.js
 *
 * PURPOSE
 * ----------------------------------------------------------------------------
 * Central AI service for StoreForge's GENERATOR platform.
 *
 * Used for:
 *   - AI product generation
 *   - Product descriptions
 *   - Product SEO
 *   - Product marketing copy
 *   - Store content
 *   - Theme/content generation
 *   - Future StoreForge AI generation features
 *
 * NOT USED FOR:
 *   - Shopify chatbot
 *   - AI sales agent
 *   - Customer conversations
 *   - Chatbot memory
 *   - Chatbot recommendations
 *   - Cart recovery
 *   - Customer support
 *
 * ============================================================================
 */

'use strict';


// ============================================================================
// AI CONFIGURATION
// ============================================================================
//
// Uses the existing:
//
// backend/src/config/openai.js
//
// The OpenAI configuration is isolated in the config layer so API keys and
// provider configuration are not duplicated throughout the application.
//

let openAIConfig = null;

try {

  openAIConfig =
    require('../../config/openai');

} catch (error) {

  openAIConfig = null;

}


// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_MODEL =
  process.env.OPENAI_MODEL ||
  'gpt-4o-mini';

const DEFAULT_TEMPERATURE =
  Number(
    process.env.OPENAI_TEMPERATURE
  ) || 0.7;

const DEFAULT_MAX_TOKENS =
  Number(
    process.env.OPENAI_MAX_TOKENS
  ) || 4000;


// ============================================================================
// OPENAI CLIENT
// ============================================================================

let openAIClient = null;


// ----------------------------------------------------------------------------
// Resolve OpenAI client
// ----------------------------------------------------------------------------

const getOpenAIClient = () => {

  if (openAIClient) {
    return openAIClient;
  }


  // --------------------------------------------------------------------------
  // If config/openai.js exports a ready-made client
  // --------------------------------------------------------------------------

  if (
    openAIConfig &&
    openAIConfig.client
  ) {

    openAIClient =
      openAIConfig.client;

    return openAIClient;

  }


  if (
    openAIConfig &&
    openAIConfig.openai
  ) {

    openAIClient =
      openAIConfig.openai;

    return openAIClient;

  }


  // --------------------------------------------------------------------------
  // Otherwise create the client here
  // --------------------------------------------------------------------------

  let OpenAI;

  try {

    OpenAI =
      require('openai');

  } catch (error) {

    throw new Error(
      'OpenAI package is not installed. Run: npm install openai'
    );

  }


  const apiKey =
    process.env.OPENAI_API_KEY;


  if (!apiKey) {

    throw new Error(
      'OPENAI_API_KEY is not configured.'
    );

  }


  openAIClient =
    new OpenAI({
      apiKey
    });


  return openAIClient;

};


// ============================================================================
// HELPERS
// ============================================================================

const cleanJSONResponse = (
  content
) => {

  if (!content) {
    return null;
  }


  let text =
    String(content).trim();


  // Remove markdown code fences.

  if (
    text.startsWith('```')
  ) {

    text =
      text
        .replace(
          /^```(?:json)?/i,
          ''
        )
        .replace(
          /```$/i,
          ''
        )
        .trim();

  }


  try {

    return JSON.parse(text);

  } catch (error) {

    // --------------------------------------------------------------
    // Try to extract the first JSON object.
    // --------------------------------------------------------------

    const objectStart =
      text.indexOf('{');

    const objectEnd =
      text.lastIndexOf('}');


    if (
      objectStart !== -1 &&
      objectEnd !== -1 &&
      objectEnd > objectStart
    ) {

      try {

        return JSON.parse(
          text.slice(
            objectStart,
            objectEnd + 1
          )
        );

      } catch (nestedError) {

        return null;

      }

    }


    return null;

  }

};


// ============================================================================
// CHAT COMPLETION
// ============================================================================
//
// This is a GENERATION utility.
//
// It is intentionally generic and does NOT contain chatbot logic.
//

const callAI = async ({
  system,
  user,
  model = DEFAULT_MODEL,
  temperature = DEFAULT_TEMPERATURE,
  maxTokens = DEFAULT_MAX_TOKENS,
  json = false
}) => {

  if (!system) {

    throw new Error(
      'AI system instruction is required.'
    );

  }


  if (!user) {

    throw new Error(
      'AI user instruction is required.'
    );

  }


  const client =
    getOpenAIClient();


  const request = {

    model,

    temperature,

    max_tokens:
      maxTokens,

    messages: [

      {
        role: 'system',

        content:
          system

      },

      {
        role: 'user',

        content:
          user

      }

    ]

  };


  // --------------------------------------------------------------------------
  // Request structured JSON when required.
  // --------------------------------------------------------------------------

  if (json) {

    request.response_format = {

      type: 'json_object'

    };

  }


  const startedAt =
    Date.now();


  const response =
    await client.chat.completions.create(
      request
    );


  const generationTimeMs =
    Date.now() - startedAt;


  const choice =
    response?.choices?.[0];


  const content =
    choice?.message?.content ||
    '';


  if (!content) {

    throw new Error(
      'AI returned an empty response.'
    );

  }


  return {

    content,

    parsed:
      json
        ? cleanJSONResponse(content)
        : null,

    model:
      response?.model ||
      model,

    provider:
      'openai',

    generationId:
      response?.id,

    usage: {

      promptTokens:
        response?.usage?.prompt_tokens || 0,

      completionTokens:
        response?.usage?.completion_tokens || 0,

      totalTokens:
        response?.usage?.total_tokens || 0

    },

    generationTimeMs

  };

};


// ============================================================================
// PRODUCT GENERATION PROMPT
// ============================================================================

const buildProductGenerationPrompt = (
  context = {}
) => {

  const productIdea =
    context.productIdea || '';

  const targetMarket =
    context.targetMarket || '';

  const niche =
    context.niche || '';

  const tone =
    context.tone || 'professional';

  const language =
    context.language || 'en';

  const storeName =
    context.storeName || '';


  return {

    system: `
You are StoreForge AI, an AI-powered ecommerce store generator.

Your job is to create high-quality product information for an ecommerce
store.

You are NOT a chatbot.
You are NOT a sales representative.
You are NOT responding to customers.

Your output will be used by StoreForge to create or prepare ecommerce
products.

Generate commercially useful, accurate, clear and conversion-oriented
product content.

Do not invent certifications, medical claims, guarantees, awards,
testimonials, statistics, or factual specifications that were not provided.

If information is unknown, use reasonable neutral wording rather than
inventing specific factual claims.

Return ONLY valid JSON.

Required JSON structure:

{
  "title": "",
  "productType": "",
  "category": "",
  "subcategory": "",
  "vendor": "",
  "description": "",
  "tags": [],
  "pricing": {
    "pricingStrategy": ""
  },
  "marketing": {
    "shortDescription": "",
    "sellingPoints": [],
    "benefits": [],
    "features": [],
    "useCases": [],
    "targetAudience": "",
    "callToAction": ""
  },
  "seo": {
    "title": "",
    "description": "",
    "keywords": [],
    "handle": ""
  },
  "materials": [],
  "colors": [],
  "sizes": [],
  "specifications": {}
}

Language:
${language}

Writing tone:
${tone}
`,

    user: `
Create a complete ecommerce product for the following request.

Store name:
${storeName}

Product idea:
${productIdea}

Target market:
${targetMarket}

Niche:
${niche}

Requirements:

1. Create a clear product title.
2. Write a useful product description.
3. Create relevant ecommerce tags.
4. Create a concise short description.
5. Create selling points.
6. Create customer benefits.
7. Create product features.
8. Create realistic use cases based only on the provided concept.
9. Define the likely target audience.
10. Create a suitable call to action.
11. Generate SEO title.
12. Generate SEO meta description.
13. Generate SEO keywords.
14. Generate a clean URL handle.
15. Identify materials, colors and sizes only when reasonably inferable.
16. Do not invent precise technical specifications.
17. Do not make medical or unsupported performance claims.
18. Do not create fake reviews or testimonials.

Return valid JSON only.
`

  };

};


// ============================================================================
// GENERATE PRODUCT
// ============================================================================

const generateProduct = async (
  context = {}
) => {

  const prompts =
    buildProductGenerationPrompt(
      context
    );


  const result =
    await callAI({

      system:
        prompts.system,

      user:
        prompts.user,

      model:
        context.model ||
        DEFAULT_MODEL,

      temperature:
        context.temperature ||
        DEFAULT_TEMPERATURE,

      maxTokens:
        context.maxTokens ||
        DEFAULT_MAX_TOKENS,

      json:
        true

    });


  if (
    !result.parsed
  ) {

    throw new Error(
      'AI failed to return valid product JSON.'
    );

  }


  return {

    product:
      result.parsed,

    model:
      result.model,

    provider:
      result.provider,

    generationId:
      result.generationId,

    tokensUsed:
      result.usage.totalTokens,

    usage:
      result.usage,

    generationTimeMs:
      result.generationTimeMs

  };

};


// ============================================================================
// GENERATE PRODUCT CONTENT
// ============================================================================
//
// Alias used by product.service.js.
//

const generateProductContent = async (
  context = {}
) => {

  return generateProduct(
    context
  );

};


// ============================================================================
// GENERATE PRODUCT DESCRIPTION
// ============================================================================

const generateProductDescription = async ({
  title,
  productType,
  features = [],
  targetAudience = '',
  tone = 'professional',
  language = 'en'
} = {}) => {

  const result =
    await callAI({

      system: `
You are StoreForge AI.

Generate ecommerce product descriptions.

You are not a chatbot and you are not a customer-support agent.

Return only valid JSON:

{
  "description": "",
  "shortDescription": "",
  "sellingPoints": [],
  "benefits": []
}

Language:
${language}

Tone:
${tone}
`,

      user: `
Product title:
${title || ''}

Product type:
${productType || ''}

Features:
${features.join(', ')}

Target audience:
${targetAudience}

Create useful ecommerce copy without inventing unsupported facts.
`,

      json:
        true

    });


  return {

    content:
      result.parsed,

    model:
      result.model,

    provider:
      result.provider,

    generationId:
      result.generationId,

    tokensUsed:
      result.usage.totalTokens,

    generationTimeMs:
      result.generationTimeMs

  };

};


// ============================================================================
// GENERATE PRODUCT SEO
// ============================================================================

const generateProductSEO = async ({
  title,
  description = '',
  productType = '',
  keywords = [],
  language = 'en'
} = {}) => {

  const result =
    await callAI({

      system: `
You are StoreForge AI SEO generator.

Create ecommerce SEO content.

Return ONLY valid JSON:

{
  "title": "",
  "description": "",
  "keywords": [],
  "handle": ""
}

Do not use misleading claims.
Do not keyword-stuff.
Keep the content natural and relevant.
`,

      user: `
Product title:
${title}

Product type:
${productType}

Description:
${description}

Existing keywords:
${keywords.join(', ')}

Language:
${language}

Generate optimized ecommerce SEO content.
`,

      json:
        true

    });


  return {

    seo:
      result.parsed,

    model:
      result.model,

    provider:
      result.provider,

    generationId:
      result.generationId,

    tokensUsed:
      result.usage.totalTokens,

    generationTimeMs:
      result.generationTimeMs

  };

};


// ============================================================================
// GENERATE STORE CONTENT
// ============================================================================
//
// Used later by StoreForge's store-generation workflow.
//
// Examples:
// - Homepage headline
// - Homepage description
// - About section
// - Collection descriptions
// - Brand messaging
//

const generateStoreContent = async ({
  storeName = '',
  businessType = '',
  niche = '',
  targetAudience = '',
  tone = 'professional',
  language = 'en'
} = {}) => {

  const result =
    await callAI({

      system: `
You are StoreForge AI.

Generate content for an ecommerce storefront.

You are not a chatbot.

Return only valid JSON:

{
  "heroTitle": "",
  "heroSubtitle": "",
  "aboutTitle": "",
  "aboutText": "",
  "valuePropositions": [],
  "callToAction": "",
  "footerDescription": ""
}
`,

      user: `
Store name:
${storeName}

Business type:
${businessType}

Niche:
${niche}

Target audience:
${targetAudience}

Tone:
${tone}

Language:
${language}

Create polished ecommerce storefront content.
`,

      json:
        true

    });


  return {

    content:
      result.parsed,

    model:
      result.model,

    provider:
      result.provider,

    generationId:
      result.generationId,

    tokensUsed:
      result.usage.totalTokens,

    generationTimeMs:
      result.generationTimeMs

  };

};


// ============================================================================
// GENERATE THEME CONTENT
// ============================================================================
//
// This is intentionally content-only.
//
// Liquid/theme structure belongs to the Themes module.
// This service does NOT directly modify Shopify themes.
//

const generateThemeContent = async ({
  storeName = '',
  businessType = '',
  niche = '',
  brandTone = 'professional',
  sections = [],
  language = 'en'
} = {}) => {

  const result =
    await callAI({

      system: `
You are StoreForge AI.

Generate content for ecommerce website sections.

Do not generate Liquid code.
Do not generate JavaScript.
Do not generate CSS.

The theme system will handle implementation.

Return only valid JSON:

{
  "sections": []
}

Each section should contain:

{
  "type": "",
  "heading": "",
  "subheading": "",
  "body": "",
  "items": []
}
`,

      user: `
Store:
${storeName}

Business type:
${businessType}

Niche:
${niche}

Brand tone:
${brandTone}

Requested sections:
${JSON.stringify(sections)}

Language:
${language}

Generate suitable content for these storefront sections.
`,

      json:
        true

    });


  return {

    content:
      result.parsed,

    model:
      result.model,

    provider:
      result.provider,

    generationId:
      result.generationId,

    tokensUsed:
      result.usage.totalTokens,

    generationTimeMs:
      result.generationTimeMs

  };

};


// ============================================================================
// GENERIC GENERATION
// ============================================================================
//
// Useful for future StoreForge generator features.
//
// This should NOT be used for chatbot conversations.
//

const generate = async ({
  system,
  prompt,
  model,
  temperature,
  maxTokens,
  json = false
} = {}) => {

  return callAI({

    system,

    user:
      prompt,

    model:
      model ||
      DEFAULT_MODEL,

    temperature:
      temperature ||
      DEFAULT_TEMPERATURE,

    maxTokens:
      maxTokens ||
      DEFAULT_MAX_TOKENS,

    json

  });

};


// ============================================================================
// HEALTH CHECK
// ============================================================================

const healthCheck = async () => {

  try {

    const client =
      getOpenAIClient();


    if (!client) {

      return {

        healthy: false,

        provider:
          'openai'

      };

    }


    return {

      healthy: true,

      provider:
        'openai',

      model:
        DEFAULT_MODEL

    };

  } catch (error) {

    return {

      healthy: false,

      provider:
        'openai',

      error:
        error.message

    };

  }

};


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {

  callAI,

  generate,

  generateProduct,

  generateProductContent,

  generateProductDescription,

  generateProductSEO,

  generateStoreContent,

  generateThemeContent,

  healthCheck

};
