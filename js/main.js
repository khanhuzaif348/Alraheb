/* =========================================================
   AL RAHEB — APPLICATION LOGIC
   ========================================================= */


/* =========================================================
   START APPLICATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeWhatsAppLinks();

    initializeMobileMenu();

    renderTrustItems();

    /*
       Render products immediately.

       IMPORTANT:
       We no longer wait for image-existence checks.
       This makes the page much faster.
    */
    renderProducts();

    initializeHeroSlider();

    renderBenefits();

    renderBuyingSteps();

    renderFaqs();

    initializeScrollEffects();

    initializeCustomCursor();

    const yearElement =
        document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent =
            new Date().getFullYear();
    }

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
   IMAGE HELPER
   ========================================================= */

/*
   We no longer search the server for images.

   Images are already specified inside data.js.

   This function simply returns the images for a product.
*/

function getProductImages(product) {

    if (
        !product ||
        !Array.isArray(product.images)
    ) {
        return [];
    }

    return product.images.filter(
        image => typeof image === "string" && image.trim() !== ""
    );

}


/* =========================================================
   HERO SLIDER
   ========================================================= */

function initializeHeroSlider() {

    const container =
        document.getElementById("hero-product-slider");

    if (!container) return;


    /* =====================================================
       COLLECT HERO IMAGES
       ===================================================== */

    const heroImages = [];


    PRODUCTS.forEach(product => {

        const images =
            getProductImages(product);

        images.forEach(image => {

            heroImages.push({

                image: image,

                name: product.name

            });

        });

    });


    /* =====================================================
       NOTHING FOUND
       ===================================================== */

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
       ===================================================== */

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
                        fetchpriority="${index === 0 ? "high" : "auto"}"
                        decoding="async"
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


    /* =====================================================
       PRELOAD HERO IMAGE
       ===================================================== */

    function preloadImage(index) {

        if (!heroImages[index]) return;

        const image =
            new Image();

        image.src =
            heroImages[index].image;

    }


    /*
       Load the second image in the background.

       This does NOT block the initial page load.
    */

    if (heroImages.length > 1) {

        window.setTimeout(() => {

            preloadImage(1);

        }, 800);

    }


    /* =====================================================
       SHOW SLIDE
       ===================================================== */

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


        /*
           Preload the next image after the current
           image is displayed.

           This makes the slider smoother without
           downloading everything at once.
        */

        const nextIndex =
            (currentIndex + 1) %
            heroImages.length;

        preloadImage(nextIndex);

    }


    /* =====================================================
       NEXT / PREVIOUS
       ===================================================== */

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


    /* =====================================================
       AUTO SLIDE
       ===================================================== */

    function startAutoSlide() {

        clearInterval(autoSlide);

        autoSlide =
            setInterval(
                nextSlide,
                SITE_CONFIG.heroSlideDuration
            );

    }


    /* =====================================================
       CONTROLS
       ===================================================== */

    const nextButton =
        document.getElementById("hero-next");

    const previousButton =
        document.getElementById("hero-prev");


    nextButton?.addEventListener(
        "click",
        () => {

            nextSlide();

            startAutoSlide();

        }
    );


    previousButton?.addEventListener(
        "click",
        () => {

            previousSlide();

            startAutoSlide();

        }
    );


    /* =====================================================
       DOTS
       ===================================================== */

    dots.forEach(dot => {

        dot.addEventListener(
            "click",
            () => {

                const index =
                    Number(
                        dot.dataset.heroDot
                    );

                showSlide(index);

                startAutoSlide();

            }
        );

    });


    /* =====================================================
       PAUSE ON HOVER
       ===================================================== */

    container.addEventListener(
        "mouseenter",
        () => clearInterval(autoSlide)
    );


    container.addEventListener(
        "mouseleave",
        startAutoSlide
    );


    /* =====================================================
       START
       ===================================================== */

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

function renderProducts() {

    const container =
        document.getElementById("products-grid");

    if (!container) return;


    container.innerHTML = "";


    const productHTML = [];


    PRODUCTS.forEach(product => {

        const images =
            getProductImages(product);


        /*
           If the product has no images,
           show the placeholder.
        */

        const finalImages =
            images.length > 0
                ? images
                : ["assets/images/placeholder.svg"];


        const multipleImages =
            finalImages.length > 1;


        /* =================================================
           PRODUCT SLIDES
           ================================================= */

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
                            decoding="async"
                        >

                    </div>

                `)
                .join("");


        /* =================================================
           ARROWS
           ================================================= */

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


        /* =================================================
           DOTS
           ================================================= */

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


        /* =================================================
           PRODUCT CARD
           ================================================= */

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

    });


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


        /* =================================================
           SHOW SLIDE
           ================================================= */

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


        /* =================================================
           NEXT / PREVIOUS
           ================================================= */

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


        /* =================================================
           AUTO PLAY
           ================================================= */

        function start() {

            clearInterval(interval);

            interval =
                setInterval(
                    nextSlide,
                    SITE_CONFIG.productSlideDuration
                );

        }


        /* =================================================
           BUTTONS
           ================================================= */

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


        /* =================================================
           DOTS
           ================================================= */

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


        /* =================================================
           START
           ================================================= */

        start();


        /* =================================================
           PAUSE ON HOVER
           ================================================= */

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


/* =========================================================
   CUSTOM LUXURY CURSOR
   ========================================================= */

/*
   IMPORTANT:

   Your old main.js contained TWO cursor systems.

   It also tried to access #custom-cursor even when
   that element did not exist.

   That could create JavaScript errors.

   This version safely initializes the cursor only
   when the required HTML exists.
*/

function initializeCustomCursor() {

    /*
       Don't run on touch devices.
    */

    if (
        "ontouchstart" in window ||
        window.innerWidth < 768
    ) {
        return;
    }


    const cursor =
        document.getElementById("custom-cursor");

    if (!cursor) {
        return;
    }


    const dot =
        cursor.querySelector(".cursor-dot");

    if (!dot) {
        return;
    }


    let mouseX = 0;

    let mouseY = 0;

    let cursorX = 0;

    let cursorY = 0;


    /* =====================================================
       MOUSE MOVEMENT
       ===================================================== */

    document.addEventListener(
        "mousemove",
        (event) => {

            mouseX =
                event.clientX;

            mouseY =
                event.clientY;

        }
    );


    /* =====================================================
       CURSOR ANIMATION
       ===================================================== */

    function animateCursor() {

        cursorX +=
            (mouseX - cursorX) * 0.12;

        cursorY +=
            (mouseY - cursorY) * 0.12;


        dot.style.left =
            cursorX + "px";

        dot.style.top =
            cursorY + "px";


        requestAnimationFrame(
            animateCursor
        );

    }


    animateCursor();


    /* =====================================================
       HOVER EFFECT
       ===================================================== */

    const interactiveElements =
        document.querySelectorAll(
            "a, button, .nav-link, .whatsapp-button, .hero-whatsapp, .cta-whatsapp, .contact-whatsapp, .hero-products-button, .product-card, .product-whatsapp, .slider-control, .faq-button, .floating-whatsapp, .mobile-link, .mobile-whatsapp"
        );


    interactiveElements.forEach(element => {

        element.addEventListener(
            "mouseenter",
            () => {

                dot.classList.add("hover");

            }
        );


        element.addEventListener(
            "mouseleave",
            () => {

                dot.classList.remove("hover");

            }
        );

    });


    /* =====================================================
       CLICK EFFECT
       ===================================================== */

    document.addEventListener(
        "mousedown",
        () => {

            dot.classList.add("click");

        }
    );


    document.addEventListener(
        "mouseup",
        () => {

            dot.classList.remove("click");

        }
    );

}