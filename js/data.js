/* =========================================================
   AL RAHEB — CONTENT / DATA

   IMPORTANT:

   PRODUCTS control your product information.

   IMAGE SYSTEM:

   Product 1 automatically searches:

   product-1-1.jpg
   product-1-2.jpg
   product-1-3.jpg
   product-1-4.jpg
   ...

   Product 2:

   product-2-1.jpg
   product-2-2.jpg
   product-2-3.jpg
   ...

   Product 3:

   product-3-1.jpg
   product-3-2.jpg
   ...

   Just put the images inside:

   assets/images/

   The JavaScript automatically finds them.

   You DO NOT edit index.html to add images.

   ========================================================= */


const SITE_CONFIG = {

    whatsappNumber: "919044039661",

    /* Hero slider speed */
    heroSlideDuration: 2000,

    /* Product card slider speed */
    productSlideDuration: 2500,

    /* Maximum images to search for each product */
    maxImagesPerProduct: 20

};


/* =========================================================
   TRUST ITEMS
   ========================================================= */

const TRUST_ITEMS = [

    {
        icon: "fa-boxes-stacked",
        title: "BULK ORDERS",
        description: "Scalable capacity for businesses"
    },

    {
        icon: "fa-shield-halved",
        title: "RELIABLE SUPPLY",
        description: "Consistent inventory flow"
    },

    {
        icon: "fa-medal",
        title: "QUALITY FOCUSED",
        description: "Strict grade verification"
    },

    {
        icon: "fa-bolt",
        title: "FAST RESPONSE",
        description: "Direct communication channel"
    },

    {
        icon: "fa-handshake",
        title: "B2B SUPPORT",
        description: "Dedicated account management"
    }

];


/* =========================================================
   PRODUCTS

   productNumber determines image names.

   Example:

   productNumber: 1

   automatically searches:

   assets/images/product-1-1.jpg
   assets/images/product-1-2.jpg
   assets/images/product-1-3.jpg
   ...

   ========================================================= */

const PRODUCTS = [

    {

        productNumber: 1,

        name: "Executive White Saudi Thobes (Bulk)",

        badge: "High Volume Available",

        description:
            "Premium traditional Saudi thobes featuring refined stitching, crisp white fabric, and an immaculate finish — ideal for wholesale distribution to retail chains and corporate uniform programs.",

        material:
            "Egyptian Cotton & Soft Twill",

        useCase:
            "Wholesale Retail & Boutiques",

        moq:
            "Customizable MOQ"

    },


    {

        productNumber: 2,

        name: "Emirati & Omani Tailored Jubbas",

        badge: "Custom Specs Available",

        description:
            "Authentic Omani and Emirati-inspired jubbas with structured tailoring, premium fabric blends, and elegant finishing — designed for menswear stores and regional distributors seeking traditional sophistication.",

        material:
            "Premium Fabric Blends",

        useCase:
            "Regional Distributors & Chains",

        moq:
            "Project-Based MOQ"

    },


    {

        productNumber: 3,

        name: "Luxury Designer Thobes & Festive Collections",

        badge: "Direct Sourcing",

        description:
            "High-end colored thobes crafted for seasonal demand, Eid celebrations, and special occasions. Breathable all-season fabrics with distinctive design details — perfect for importers and department stores.",

        material:
            "All-Season Breathable Fabrics",

        useCase:
            "Importers & Department Stores",

        moq:
            "Container / Bulk Scale"

    }

];


/* =========================================================
   BENEFITS
   ========================================================= */

const BENEFITS = [

    {

        icon: "fa-check-double",

        title: "Consistent Quality",

        description:
            "Products and services designed and verified to meet rigorous business requirements."

    },

    {

        icon: "fa-warehouse",

        title: "Bulk Supply Capacity",

        description:
            "Engineered for business-scale quantities, container lots and continuous wholesale requirements."

    },

    {

        icon: "fa-whatsapp",

        title: "Quick Communication",

        description:
            "Get stock updates, answers and quotations through a direct WhatsApp sales channel."

    },

    {

        icon: "fa-handshake-angle",

        title: "Reliable Partnership",

        description:
            "Focused on long-term B2B relationships built on transparency and dependable fulfillment."

    },

    {

        icon: "fa-sliders",

        title: "Flexible Requirements",

        description:
            "Discuss custom shipping, payment terms and specific product requirements with our trade team."

    },

    {

        icon: "fa-shield-halved",

        title: "Supplier Integrity",

        description:
            "Transparent trade practices with clear documentation, invoicing and order execution."

    }

];


/* =========================================================
   BUYING STEPS
   ========================================================= */

const BUYING_STEPS = [

    {

        number: "01",

        title: "Tell Us What You Need",

        description:
            "Send your product specifications or bulk requirements via WhatsApp or our quick form."

    },

    {

        number: "02",

        title: "Discuss Your Requirement",

        description:
            "Our procurement specialists verify availability, quantities and delivery timelines."

    },

    {

        number: "03",

        title: "Get Your Quote",

        description:
            "Receive a transparent commercial quotation with competitive wholesale pricing."

    },

    {

        number: "04",

        title: "Confirm Your Order",

        description:
            "Finalize terms, invoice approval and dispatch schedules with our sales desk."

    },

    {

        number: "05",

        title: "Receive Your Supply",

        description:
            "Secure logistics and timely delivery to your warehouse or distribution center."

    }

];


/* =========================================================
   FAQS
   ========================================================= */

const FAQS = [

    {

        question: "Do you accept bulk orders?",

        answer:
            "Yes, AL RAHEB specializes in bulk orders, container lots and continuous wholesale supply for business operations, distributors and corporate buyers."

    },

    {

        question: "What products and services do you provide?",

        answer:
            "We provide commercial-grade thobes, jubbas, traditional garments and customized wholesale procurement solutions for corporate clients and resellers."

    },

    {

        question: "Do you supply businesses and resellers?",

        answer:
            "Absolutely. Our primary clientele includes business owners, wholesalers, distributors, retail chains and corporate procurement managers."

    },

    {

        question: "What is the minimum order quantity (MOQ)?",

        answer:
            "MOQs vary by product line and commercial requirement. Contact us with your target quantity so we can provide a tailored wholesale rate."

    },

    {

        question: "How can I request a quotation?",

        answer:
            "Click any WhatsApp enquiry button or contact our sales desk. Your message will open directly in WhatsApp with the relevant requirement."

    },

    {

        question: "What areas do you serve?",

        answer:
            "We operate internationally, supplying corporate buyers, importers and regional distributors across global trade corridors."

    },

    {

        question: "How quickly do you respond?",

        answer:
            "Our WhatsApp sales desk responds promptly during business hours to help keep your procurement timeline moving."

    },

    {

        question: "Do you offer customized requirements?",

        answer:
            "Yes. We can discuss specialized specifications, customized packaging and unique commercial supply requirements."

    }

];