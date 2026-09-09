# AL RAHEB B2B Website

A scalable static website structure separated into HTML, CSS, JavaScript and image assets.

## Folder structure

```text
al-raheb-b2b/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── data.js
│   └── main.js
└── assets/
    └── images/
        ├── product-1.jpg
        ├── product-2.jpg
        ├── product-3.jpg
        └── placeholder.svg
```

## Add your images

Put your images here:

- `assets/images/product-1.jpg`
- `assets/images/product-2.jpg`
- `assets/images/product-3.jpg`

You can use PNG/WebP too, but then update the filename in `js/data.js`.

## Add another product

Open `js/data.js` and add another object inside `PRODUCTS`.

You do NOT need to change the HTML.

## Change WhatsApp number

Open `js/data.js`:

```js
const SITE_CONFIG = {
    whatsappNumber: "919044039661"
};
```

Replace the number with your WhatsApp number in international format without `+` or spaces.

## Add analytics later

Because JavaScript is separated into `js/main.js`, analytics/event tracking can later be added there without rebuilding the page structure.

Recommended future additions:

- Google Analytics 4
- Google Ads conversion tracking
- Meta Pixel
- WhatsApp click tracking
- Lead/conversion events
- Microsoft Clarity
- SEO schema
- Cookie/consent management

## Important

This version remains a static website and can be hosted directly on GitHub Pages, Netlify or Vercel.

For a larger project, the same data-driven structure can later be migrated to React/Next.js without redesigning the content model.
