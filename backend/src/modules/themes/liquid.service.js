// ======================================================
// Layboka AI 
// storeforge-ai/backend/src/modules/themes/liquid.service.js
// ==============================================================
const {
  uploadLiquid
} = require("./asset.service");

/*
|--------------------------------------------------------------------------
| Liquid Layout Generator
|--------------------------------------------------------------------------
*/

const generateThemeLayout = ({
  title = "{{ page_title }}",
  description = "{{ page_description }}",
  bodyClass = ""
} = {}) => {
  return `<!doctype html>
<html lang="{{ request.locale.iso_code }}">
<head>

<meta charset="utf-8">

<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
/>

<title>${title}</title>

<meta
  name="description"
  content="${description}"
>

{{ content_for_header }}

{{ 'base.css' | asset_url | stylesheet_tag }}
{{ 'storeforge.css' | asset_url | stylesheet_tag }}

</head>

<body class="${bodyClass}">

{% sections 'header-group' %}

<main id="MainContent">
{{ content_for_layout }}
</main>

{% sections 'footer-group' %}

{{ 'storeforge.js' | asset_url | script_tag }}

</body>

</html>`;
};

/*
|--------------------------------------------------------------------------
| Product Template
|--------------------------------------------------------------------------
*/

const generateProductTemplate =
() => {

return `
{% section 'main-product' %}
{% section 'related-products' %}
`;

};

/*
|--------------------------------------------------------------------------
| Collection Template
|--------------------------------------------------------------------------
*/

const generateCollectionTemplate =
() => {

return `
{% section 'main-collection-product-grid' %}
`;

};

/*
|--------------------------------------------------------------------------
| Cart Template
|--------------------------------------------------------------------------
*/

const generateCartTemplate =
() => {

return `
{% section 'main-cart' %}
`;

};

/*
|--------------------------------------------------------------------------
| Index Template
|--------------------------------------------------------------------------
*/

const generateHomeTemplate =
() => {

return `
{% sections 'header-group' %}

{% section 'hero' %}

{% section 'featured-collection' %}

{% section 'featured-products' %}

{% section 'image-banner' %}

{% section 'testimonials' %}

{% section 'newsletter' %}

{% sections 'footer-group' %}
`;

};

/*
|--------------------------------------------------------------------------
| Search Template
|--------------------------------------------------------------------------
*/

const generateSearchTemplate =
() => {

return `
{% section 'main-search' %}
`;

};

/*
|--------------------------------------------------------------------------
| 404 Template
|--------------------------------------------------------------------------
*/

const generate404Template =
() => {

return `
{% section '404' %}
`;

};

/*
|--------------------------------------------------------------------------
| Password Template
|--------------------------------------------------------------------------
*/

const generatePasswordTemplate =
() => {

return `
{% section 'main-password-header' %}

{% section 'main-password-content' %}

{% section 'main-password-footer' %}
`;

};

/*
|--------------------------------------------------------------------------
| Blog Template
|--------------------------------------------------------------------------
*/

const generateBlogTemplate =
() => {

return `
{% section 'main-blog' %}
`;

};

/*
|--------------------------------------------------------------------------
| Article Template
|--------------------------------------------------------------------------
*/

const generateArticleTemplate =
() => {

return `
{% section 'main-article' %}
`;

};

/*
|--------------------------------------------------------------------------
| Upload Theme Layout
|--------------------------------------------------------------------------
*/

const uploadThemeLayout =
async (
themeId,
userId
) => {

const liquid =
generateThemeLayout();

return uploadLiquid({

themeId,

userId,

filename:
"layout/theme.liquid",

liquid

});

};

/*
|--------------------------------------------------------------------------
| Upload Default Templates
|--------------------------------------------------------------------------
*/

const uploadDefaultTemplates =
async (
themeId,
userId
) => {

await uploadLiquid({

themeId,

userId,

filename:
"templates/index.json",

liquid:
JSON.stringify({
sections: {},
order: []
})

});

await uploadLiquid({

themeId,

userId,

filename:
"templates/product.json",

liquid:
JSON.stringify({
sections: {},
order: []
})

});

await uploadLiquid({

themeId,

userId,

filename:
"templates/collection.json",

liquid:
JSON.stringify({
sections: {},
order: []
})

});

await uploadLiquid({

themeId,

userId,

filename:
"templates/cart.json",

liquid:
JSON.stringify({
sections: {},
order: []
})

});

await uploadLiquid({

themeId,

userId,

filename:
"templates/search.json",

liquid:
JSON.stringify({
sections: {},
order: []
})

});

await uploadLiquid({

themeId,

userId,

filename:
"templates/404.json",

liquid:
JSON.stringify({
sections: {},
order: []
})

});

return true;

};

/*
|--------------------------------------------------------------------------
| Generate Complete Theme
|--------------------------------------------------------------------------
*/

const generateThemeFiles =
async (
themeId,
userId
) => {

await uploadThemeLayout(
themeId,
userId
);

await uploadDefaultTemplates(
themeId,
userId
);

return {

success: true,

message:
"Liquid theme files generated successfully."

};

};

module.exports = {

generateThemeLayout,

generateHomeTemplate,

generateProductTemplate,

generateCollectionTemplate,

generateCartTemplate,

generateSearchTemplate,

generate404Template,

generatePasswordTemplate,

generateBlogTemplate,

generateArticleTemplate,

uploadThemeLayout,

uploadDefaultTemplates,

generateThemeFiles

};
