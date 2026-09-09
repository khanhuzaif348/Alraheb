/* =========================================================
   AL RAHEB — APPLICATION LOGIC
   ========================================================= */


/* =========================================================
   START APPLICATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    initializeWhatsAppLinks();

    initializeMobileMenu();

    renderTrustItems();

    await renderProducts();

    await initializeHeroSlider();

    renderBenefits();

    renderBuyingSteps();

    renderFaqs();

    initializeScrollEffects();

    document.getElementById("current-year").textContent =
        new Date().getFullYear();

});


/* =========================================================
   WHATSAPP
   ========================================================= */

function createWhatsAppUrl(message) {

    return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;

}


function initializeWhatsAppLinks() {

    document
        .querySelectorAll("[data-wa-link]")
        .forEach(link => {

            const message =
                link.dataset.message ||
                "Hi AL RAHEB, I'd like to discuss a B2B requirement.";

            link.href =
                createWhatsAppUrl(message);

        });

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function initializeMobileMenu() {

    const button =
        document.getElementById("mobile-menu-btn");

    const menu =
        document.getElementById("mobile-menu");

    if (!button || !menu) return;


    button.addEventListener("click", () => {

        const isHidden =
            menu.classList.toggle("hidden");

        button.setAttribute(
            "aria-expanded",
            String(!isHidden)
        );

    });


    document
        .querySelectorAll(".mobile-link")
        .forEach(link => {

            link.addEventListener("click", () => {

                menu.classList.add("hidden");

                button.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

}


/* =========================================================
   IMAGE LOADER
   =========================================================

   This is what makes the website scalable.

   You don't have to manually write:

   image: "product-1-1.jpg"

   The function automatically checks:

   product-1-1.jpg
   product-1-2.jpg
   product-1-3.jpg
   ...

   ========================================================= */

function imageExists(path) {

    return new Promise(resolve => {

        const image =
            new Image();

        image.onload = () => resolve(true);

        image.onerror = () => resolve(false);

        image.src = path;

    });

}


async function getProductImages(productNumber) {

    const images = [];

    for (
        let number = 1;
        number <= SITE_CONFIG.maxImagesPerProduct;
        number++
    ) {

        const path =
            `assets/images/product-${productNumber}-${number}.jpg`;

        const exists =
            await imageExists(path);

        if (exists) {

            images.push(path);

        } else {

            /*
             Stop when the next numbered image
             does not exist.

             Example:

             1 exists
             2 exists
             3 exists
             4 doesn't exist

             Result:

             1, 2, 3
            */

            break;
        }

    }


    /*
       If no JPG images exist,
       also check PNG.

       This lets you use:

       product-1-1.png
       product-1-2.png

    */

    if (images.length === 0) {

        for (
            let number = 1;
            number <= SITE_CONFIG.maxImagesPerProduct;
            number++
        ) {

            const path =
                `assets/images/product-${productNumber}-${number}.png`;

            const exists =
                await imageExists(path);

            if (exists) {

                images.push(path);

            } else {

                break;

            }

        }

    }


    return images;

}


/* =========================================================
   HERO SLIDER
   ========================================================= */

async function initializeHeroSlider() {

    const container =
        document.getElementById("hero-product-slider");

    if (!container) return;


    /*
       Collect images from ALL products.

       Example:

       Product 1:
       product-1-1
       product-1-2
       product-1-3

       Product 2:
       product-2-1
       product-2-2

       Product 3:
       product-3-1
       product-3-2

       Hero will rotate through ALL of them.
    */

    const heroImages = [];


    for (const product of PRODUCTS) {

        const images =
            await getProductImages(
                product.productNumber
            );


        images.forEach(image => {

            heroImages.push({

                image: image,

                name: product.name

            });

        });

    }


    /* Nothing found */

    if (heroImages.length === 0) {

        container.innerHTML = `

            <div class="hero-empty-state">

                <i class="fa-regular fa-image"></i>

                <p>
                    Add product images to
                    assets/images/
                </p>

            </div>

        `;

        return;

    }


    /* =====================================================
       CREATE SLIDES
    ====================================================== */

    container.innerHTML = `

        ${heroImages
            .map((item, index) => `

                <div
                    class="hero-slide ${index === 0 ? "active" : ""}"
                    data-slide="${index}"
                >

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                        loading="${index === 0 ? "eager" : "lazy"}"
                    >

                    <div class="hero-product-label">
                        ${item.name}
                    </div>

                </div>

            `)
            .join("")}


        <div class="hero-slider-controls">

            <button
                type="button"
                class="slider-control"
                id="hero-prev"
                aria-label="Previous product"
            >
                <i class="fa-solid fa-chevron-left"></i>
            </button>

            <button
                type="button"
                class="slider-control"
                id="hero-next"
                aria-label="Next product"
            >
                <i class="fa-solid fa-chevron-right"></i>
            </button>

        </div>


        <div class="hero-slider-dots">

            ${heroImages
                .map((_, index) => `

                    <button
                        type="button"
                        class="slider-dot ${index === 0 ? "active" : ""}"
                        data-hero-dot="${index}"
                        aria-label="Go to product ${index + 1}"
                    ></button>

                `)
                .join("")}

        </div>

    `;


    let currentIndex = 0;

    let autoSlide;


    const slides =
        container.querySelectorAll(".hero-slide");

    const dots =
        container.querySelectorAll(".slider-dot");


    function showSlide(index) {

        currentIndex =
            (index + slides.length) %
            slides.length;


        slides.forEach((slide, i) => {

            slide.classList.toggle(
                "active",
                i === currentIndex
            );

        });


        dots.forEach((dot, i) => {

            dot.classList.toggle(
                "active",
                i === currentIndex
            );

        });

    }


    function nextSlide() {

        showSlide(currentIndex + 1);

    }


    function previousSlide() {

        showSlide(currentIndex - 1);

    }


    function startAutoSlide() {

        clearInterval(autoSlide);

        autoSlide =
            setInterval(
                nextSlide,
                SITE_CONFIG.heroSlideDuration
            );

    }


    document
        .getElementById("hero-next")
        .addEventListener("click", () => {

            nextSlide();

            startAutoSlide();

        });


    document
        .getElementById("hero-prev")
        .addEventListener("click", () => {

            previousSlide();

            startAutoSlide();

        });


    dots.forEach(dot => {

        dot.addEventListener("click", () => {

            const index =
                Number(
                    dot.dataset.heroDot
                );

            showSlide(index);

            startAutoSlide();

        });

    });


    /*
       Pause when user places mouse
       over the hero image.
    */

    container.addEventListener(
        "mouseenter",
        () => clearInterval(autoSlide)
    );


    container.addEventListener(
        "mouseleave",
        startAutoSlide
    );


    startAutoSlide();

}


/* =========================================================
   TRUST ITEMS
   ========================================================= */

function renderTrustItems() {

    const container =
        document.getElementById("trust-grid");

    if (!container) return;


    container.innerHTML =
        TRUST_ITEMS
            .map(item => `

                <div
                    class="flex flex-col items-center justify-center p-3 text-center"
                >

                    <div
                        class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#C5A059] mb-2 shadow-sm"
                    >

                        <i
                            class="fa-solid ${item.icon}"
                            aria-hidden="true"
                        ></i>

                    </div>


                    <h3
                        class="text-sm font-bold text-[#2B2625] tracking-wide"
                    >
                        ${item.title}
                    </h3>


                    <p
                        class="text-xs text-[#756D68] mt-1"
                    >
                        ${item.description}
                    </p>

                </div>

            `)
            .join("");

}


/* =========================================================
   PRODUCTS
   ========================================================= */

async function renderProducts() {

    const container =
        document.getElementById("products-grid");

    if (!container) return;


    container.innerHTML =
        `<div class="col-span-full text-center py-10 text-[#756D68]">
            Loading products...
        </div>`;


    const productHTML = [];


    /*
       Load every product's images.
    */

    for (const product of PRODUCTS) {

        const images =
            await getProductImages(
                product.productNumber
            );


        /*
           If image doesn't exist,
           use placeholder.
        */

        const finalImages =
            images.length > 0
                ? images
                : ["assets/images/placeholder.svg"];


        const multipleImages =
            finalImages.length > 1;


        const slides =
            finalImages
                .map((image, index) => `

                    <div
                        class="product-carousel-slide ${index === 0 ? "active" : ""}"
                        data-product-slide="${index}"
                    >

                        <img
                            src="${image}"
                            alt="${product.name}"
                            class="product-image"
                            loading="lazy"
                        >

                    </div>

                `)
                .join("");


        const arrows =
            multipleImages
                ? `

                    <button
                        type="button"
                        class="product-arrow product-arrow-left"
                        data-product-prev
                        aria-label="Previous image"
                    >
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>


                    <button
                        type="button"
                        class="product-arrow product-arrow-right"
                        data-product-next
                        aria-label="Next image"
                    >
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>

                `
                : "";


        const dots =
            multipleImages
                ? `

                    <div class="product-dots">

                        ${finalImages
                            .map((_, index) => `

                                <button
                                    type="button"
                                    class="product-dot ${index === 0 ? "active" : ""}"
                                    data-product-dot="${index}"
                                    aria-label="Image ${index + 1}"
                                ></button>

                            `)
                            .join("")}

                    </div>

                `
                : "";


        productHTML.push(`

            <article
                class="product-card"
                data-product-card
            >

                <!-- IMAGE FRAME -->

                <div class="product-image-container">

                    <div
                        class="product-carousel"
                        data-product-carousel
                    >

                        ${slides}

                    </div>


                    <!-- BADGE -->

                    <div class="product-badge">
                        ${product.badge}
                    </div>


                    ${arrows}

                    ${dots}

                </div>


                <!-- PRODUCT INFORMATION -->

                <div class="product-content">

                    <div>

                        <h3>
                            ${product.name}
                        </h3>


                        <p>
                            ${product.description}
                        </p>

                    </div>


                    <div class="product-specs">

                        <div class="product-spec-row">

                            <span class="product-spec-label">
                                Material Spec:
                            </span>

                            <span class="product-spec-value">
                                ${product.material}
                            </span>

                        </div>


                        <div class="product-spec-row">

                            <span class="product-spec-label">
                                Business Use:
                            </span>

                            <span class="product-spec-value">
                                ${product.useCase}
                            </span>

                        </div>


                        <div class="product-spec-row">

                            <span class="product-spec-label">
                                Minimum Order:
                            </span>

                            <span class="product-spec-value product-moq">
                                ${product.moq}
                            </span>

                        </div>

                    </div>


                    <a
                        href="${createWhatsAppUrl(
                            `Hi AL RAHEB, I'm interested in ${product.name}. Please share pricing and availability.`
                        )}"
                        target="_blank"
                        rel="noopener"
                        class="product-whatsapp"
                    >

                        <i class="fa-brands fa-whatsapp"></i>

                        <span>
                            Enquire on WhatsApp
                        </span>

                    </a>

                </div>

            </article>

        `);

    }


    container.innerHTML =
        productHTML.join("");


    initializeProductCarousels();

}


/* =========================================================
   PRODUCT CARD CAROUSELS
   ========================================================= */

function initializeProductCarousels() {

    const cards =
        document.querySelectorAll(
            "[data-product-card]"
        );


    cards.forEach(card => {

        const carousel =
            card.querySelector(
                "[data-product-carousel]"
            );

        if (!carousel) return;


        const slides =
            carousel.querySelectorAll(
                ".product-carousel-slide"
            );

        const dots =
            card.querySelectorAll(
                ".product-dot"
            );

        const prev =
            card.querySelector(
                "[data-product-prev]"
            );

        const next =
            card.querySelector(
                "[data-product-next]"
            );


        if (slides.length <= 1) return;


        let currentIndex = 0;

        let interval;


        function showSlide(index) {

            currentIndex =
                (index + slides.length) %
                slides.length;


            slides.forEach((slide, i) => {

                slide.classList.toggle(
                    "active",
                    i === currentIndex
                );

            });


            dots.forEach((dot, i) => {

                dot.classList.toggle(
                    "active",
                    i === currentIndex
                );

            });

        }


        function nextSlide() {

            showSlide(
                currentIndex + 1
            );

        }


        function previousSlide() {

            showSlide(
                currentIndex - 1
            );

        }


        function start() {

            clearInterval(interval);

            interval =
                setInterval(
                    nextSlide,
                    SITE_CONFIG.productSlideDuration
                );

        }


        next?.addEventListener(
            "click",
            () => {

                nextSlide();

                start();

            }
        );


        prev?.addEventListener(
            "click",
            () => {

                previousSlide();

                start();

            }
        );


        dots.forEach(dot => {

            dot.addEventListener(
                "click",
                () => {

                    showSlide(
                        Number(
                            dot.dataset.productDot
                        )
                    );

                    start();

                }
            );

        });


        /*
           Automatically change product images.
        */

        start();


        /*
           Pause while user is looking at it.
        */

        card.addEventListener(
            "mouseenter",
            () => clearInterval(interval)
        );


        card.addEventListener(
            "mouseleave",
            start
        );

    });

}


/* =========================================================
   BENEFITS
   ========================================================= */

function renderBenefits() {

    const container =
        document.getElementById("benefits-grid");

    if (!container) return;


    container.innerHTML =
        BENEFITS
            .map(item => `

                <article class="benefit-card">

                    <div class="benefit-icon">

                        <i
                            class="fa-solid ${item.icon}"
                            aria-hidden="true"
                        ></i>

                    </div>


                    <h3>
                        ${item.title}
                    </h3>


                    <p>
                        ${item.description}
                    </p>

                </article>

            `)
            .join("");

}


/* =========================================================
   BUYING STEPS
   ========================================================= */

function renderBuyingSteps() {

    const container =
        document.getElementById("steps-grid");

    if (!container) return;


    container.innerHTML =
        BUYING_STEPS
            .map(step => `

                <article class="step-card">

                    <div class="step-number">
                        ${step.number}
                    </div>


                    <div>

                        <h3>
                            ${step.title}
                        </h3>


                        <p>
                            ${step.description}
                        </p>

                    </div>

                </article>

            `)
            .join("");

}


/* =========================================================
   FAQ
   ========================================================= */

function renderFaqs() {

    const container =
        document.getElementById("faq-list");

    if (!container) return;


    container.innerHTML =
        FAQS
            .map((faq, index) => `

                <div class="faq-item">

                    <button
                        type="button"
                        class="faq-button"
                        aria-expanded="false"
                        aria-controls="faq-content-${index}"
                    >

                        <span>
                            ${faq.question}
                        </span>


                        <i
                            class="fa-solid fa-chevron-down transition-transform duration-300"
                            aria-hidden="true"
                        ></i>

                    </button>


                    <div
                        id="faq-content-${index}"
                        class="faq-content hidden"
                    >

                        ${faq.answer}

                    </div>

                </div>

            `)
            .join("");


    container
        .querySelectorAll(".faq-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const content =
                        document.getElementById(
                            button.getAttribute(
                                "aria-controls"
                            )
                        );

                    const icon =
                        button.querySelector("i");

                    const isOpen =
                        button.getAttribute(
                            "aria-expanded"
                        ) === "true";


                    button.setAttribute(
                        "aria-expanded",
                        String(!isOpen)
                    );


                    content.classList.toggle(
                        "hidden",
                        isOpen
                    );


                    icon.classList.toggle(
                        "rotate-180",
                        !isOpen
                    );

                }
            );

        });

}


/* =========================================================
   SCROLL EFFECTS
   ========================================================= */

function initializeScrollEffects() {

    const header =
        document.getElementById("main-header");

    if (!header) return;


    window.addEventListener(
        "scroll",
        () => {

            if (window.scrollY > 20) {

                header.style.boxShadow =
                    "0 10px 35px rgba(43,38,37,0.08)";

            } else {

                header.style.boxShadow =
                    "none";

            }

        },
        {
            passive: true
        }
    );

}


// Custom Cursor
const cursor = document.getElementById('custom-cursor');
const dot = cursor.querySelector('.cursor-dot');
// const trail = cursor.querySelector('.cursor-trail'); // Simple trail

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    
    dot.style.left = cursorX + 'px';
    dot.style.top = cursorY + 'px';
    // trail.style.left = cursorX + 'px';
    // trail.style.top = cursorY + 'px';

    requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effect for interactive elements
const interactiveElements = document.querySelectorAll('a, button, .nav-link, .whatsapp-button, .hero-products-button, .product-card');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('hover'));
    el.addEventListener('mouseleave', () => dot.classList.remove('hover'));
});

// Hide custom cursor on touch devices
if ('ontouchstart' in window) {
    document.getElementById('custom-cursor').style.display = 'none';
    document.body.style.cursor = 'auto';
}

const particles = [];
function createParticle(x, y) {
    const el = document.createElement('div');
    el.style.cssText = `
        position: fixed;
        top: ${y}px;
        left: ${x}px;
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, #E9D9B5, #C5A059);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        opacity: 1;
        transition: transform 0.8s ease, opacity 0.8s ease;
    `;
    document.body.appendChild(el);
    
    const angle = Math.random() * 2 * Math.PI;
    const dist = 30 + Math.random() * 50;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;

    requestAnimationFrame(() => {
        el.style.transform = `translate(${dx}px, ${dy}px) scale(0)`;
        el.style.opacity = '0';
    });

    setTimeout(() => el.remove(), 800);
}

// Inside mousemove
if (Math.random() > 0.7) {
    createParticle(e.clientX, e.clientY);
}

/* =========================================================
   CUSTOM LUXURY CURSOR — Gold Dust Trail & Interactive
   ========================================================= */

(function initCustomCursor() {

    // Check if it's a touch device
    if ('ontouchstart' in window || window.innerWidth < 768) {
        return;
    }

    const cursor = document.getElementById('custom-cursor');
    const dot = cursor.querySelector('.cursor-dot');

    let mouseX = 0,
        mouseY = 0;
    let cursorX = 0,
        cursorY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Spawn gold dust particles on movement
        if (Math.random() > 0.6) {
            createParticle(e.clientX, e.clientY);
        }
    });

    // Smooth animation loop
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.12;
        cursorY += (mouseY - cursorY) * 0.12;

        dot.style.left = cursorX + 'px';
        dot.style.top = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects — grow cursor on interactive elements
    const interactives = document.querySelectorAll(
        'a, button, .nav-link, .whatsapp-button, .hero-whatsapp, .cta-whatsapp, .contact-whatsapp, .hero-products-button, .product-card, .product-whatsapp, .slider-control, .faq-button, .floating-whatsapp, .mobile-link, .mobile-whatsapp'
    );

    interactives.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            dot.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            dot.classList.remove('hover');
        });
    });

    // Click effect — quick pulse
    document.addEventListener('mousedown', () => {
        dot.classList.add('click');
    });
    document.addEventListener('mouseup', () => {
        dot.classList.remove('click');
    });

    // =====================================================
    // GOLD DUST PARTICLE TRAIL
    // =====================================================

    const particleContainer = document.createElement('div');
    particleContainer.style.cssText = `
            pointer-events: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 99998;
            overflow: hidden;
        `;
    document.body.appendChild(particleContainer);

    function createParticle(x, y) {
        const particle = document.createElement('div');

        const size = 3 + Math.random() * 6;
        const angle = Math.random() * 2 * Math.PI;
        const distance = 20 + Math.random() * 60;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        particle.style.cssText = `
                position: absolute;
                top: ${y}px;
                left: ${x}px;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, #E9D9B5, #C5A059);
                border-radius: 50%;
                opacity: 1;
                box-shadow: 0 0 6px #C5A059;
                transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease;
                will-change: transform, opacity;
            `;

        particleContainer.appendChild(particle);

        // Animate particle outward and fade
        requestAnimationFrame(() => {
            particle.style.transform = `translate(${dx}px, ${dy}px) scale(0)`;
            particle.style.opacity = '0';
        });

        // Clean up
        setTimeout(() => {
            if (particle.parentNode) particle.remove();
        }, 700);
    }

})();