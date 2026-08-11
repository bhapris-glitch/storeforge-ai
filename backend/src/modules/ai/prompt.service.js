/**
 * ============================================================================
 * StoreForge AI
 * Prompt Service
 * ============================================================================
 *
 * File:
 * backend/src/modules/ai/prompt.service.js
 *
 * Purpose:
 * Central location for StoreForge AI generation prompts.
 *
 * NOT FOR:
 * - Chatbot
 * - Sales assistant
 * - Customer support
 * - Conversation memory
 *
 * ============================================================================
 */

'use strict';


// ============================================================================
// BASE SYSTEM PROMPT
// ============================================================================

const STORE_FORGE_SYSTEM_PROMPT = `

You are StoreForge AI.

You are an AI ecommerce store creation engine.

Your responsibilities:

- Generate ecommerce store content
- Generate product information
- Generate SEO content
- Assist store design generation
- Create professional ecommerce copy

You are NOT:
- a chatbot
- a customer support agent
- a sales representative
- a conversational assistant

Rules:

1. Create useful ecommerce content.
2. Do not invent fake information.
3. Do not create fake reviews.
4. Do not create unsupported claims.
5. Do not create medical/legal guarantees.
6. Keep content professional and conversion focused.

`;


// ============================================================================
// PRODUCT GENERATION PROMPT
// ============================================================================

const productGenerationPrompt = ({
    productIdea = '',
    niche = '',
    targetMarket = '',
    tone = 'professional',
    language = 'en'
}) => {

    return {

        system: STORE_FORGE_SYSTEM_PROMPT + `

You specialize in ecommerce product generation.

Generate complete product information.

Return JSON only.

`,

        user: `

Create an ecommerce product.

Product idea:
${productIdea}

Niche:
${niche}

Target market:
${targetMarket}

Tone:
${tone}

Language:
${language}

Generate:

- Product title
- Product description
- Short description
- Features
- Benefits
- Selling points
- Tags
- SEO information
- Product handle

Return valid JSON only.

`

    };

};


// ============================================================================
// PRODUCT SEO PROMPT
// ============================================================================

const productSEOPrompt = ({
    title = '',
    description = '',
    language = 'en'
}) => {

    return {

        system: STORE_FORGE_SYSTEM_PROMPT + `

You are an ecommerce SEO specialist.

Generate SEO content for Shopify products.

Return JSON only.

`,

        user: `

Product title:

${title}


Description:

${description}


Language:

${language}


Generate:

- SEO title
- SEO description
- SEO keywords
- URL handle


Return valid JSON only.

`

    };

};


// ============================================================================
// STORE CONTENT PROMPT
// ============================================================================

const storeContentPrompt = ({
    storeName = '',
    businessType = '',
    niche = '',
    audience = '',
    tone = 'premium'
}) => {

    return {

        system: STORE_FORGE_SYSTEM_PROMPT + `

You create complete ecommerce storefront content.

`,

        user: `

Create website content.

Store name:

${storeName}


Business type:

${businessType}


Niche:

${niche}


Target audience:

${audience}


Brand tone:

${tone}


Generate:

- Hero heading
- Hero subtitle
- About section
- Brand message
- Benefits
- Call to action
- Footer description


Return JSON only.

`

    };

};


// ============================================================================
// THEME SECTION CONTENT PROMPT
// ============================================================================

const themeSectionPrompt = ({
    storeName = '',
    niche = '',
    sections = []
}) => {

    return {

        system: STORE_FORGE_SYSTEM_PROMPT + `

You create content for Shopify theme sections.

Do not generate code.

Only generate section content.

`,

        user: `

Store:

${storeName}


Business niche:

${niche}


Required sections:

${JSON.stringify(sections)}


Generate:

- Section headings
- Section descriptions
- Feature lists
- Marketing text


Return JSON only.

`

    };

};


// ============================================================================
// BRANDING PROMPT
// ============================================================================

const brandingPrompt = ({
    businessName = '',
    niche = '',
    audience = ''
}) => {

    return {

        system: STORE_FORGE_SYSTEM_PROMPT + `

You are a brand strategist for ecommerce businesses.

`,

        user: `

Create ecommerce branding suggestions.

Business name:

${businessName}


Niche:

${niche}


Audience:

${audience}


Generate:

- Brand personality
- Brand voice
- Color direction
- Typography direction
- Visual style


Return JSON only.

`

    };

};


// ============================================================================
// LIQUID THEME ASSIST PROMPT
// ============================================================================
//
// Only helps theme generation module.
// It does not create chatbot code.
//

const liquidGenerationPrompt = ({
    sectionName = '',
    requirements = ''
}) => {

    return {

        system: STORE_FORGE_SYSTEM_PROMPT + `

You are a Shopify Liquid theme developer.

Generate clean Shopify Liquid code.

Follow Shopify theme standards.

`,

        user: `

Create Liquid code.

Section:

${sectionName}


Requirements:

${requirements}


Return only Liquid code.

`

    };

};


// ============================================================================
// GENERAL AI PROMPT BUILDER
// ============================================================================

const buildPrompt = ({
    task,
    context = {}
}) => {


    switch(task) {


        case 'product':

            return productGenerationPrompt(
                context
            );


        case 'seo':

            return productSEOPrompt(
                context
            );


        case 'store':

            return storeContentPrompt(
                context
            );


        case 'theme':

            return themeSectionPrompt(
                context
            );


        case 'branding':

            return brandingPrompt(
                context
            );


        case 'liquid':

            return liquidGenerationPrompt(
                context
            );


        default:

            throw new Error(
                `Unknown AI prompt task: ${task}`
            );

    }

};


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {

    STORE_FORGE_SYSTEM_PROMPT,

    productGenerationPrompt,

    productSEOPrompt,

    storeContentPrompt,

    themeSectionPrompt,

    brandingPrompt,

    liquidGenerationPrompt,

    buildPrompt

};
