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
   PRODUCT MEDIA HELPER
   Supports:
   JPG
   JPEG
   PNG
   WEBP
   GIF
   MP4
   WEBM
   MOV
   ========================================================= */

function getProductImages(product) {

    if (
        !product ||
        !Array.isArray(product.images)
    ) {
        return [];
    }

    return product.images.filter(
        image =>
            typeof image === "string" &&
            image.trim() !== ""
    );

}


/* =========================================================
   CHECK VIDEO
   ========================================================= */

function isVideoFile(file) {

    return /\.(mp4|webm|mov)$/i.test(file);

}


/* =========================================================
   HERO SLIDER
   Supports images + videos
   ========================================================= */

function initializeHeroSlider() {

    const container =
        document.getElementById(
            "hero-product-slider"
        );

    if (!container) return;


    /* =====================================================
       COLLECT ALL PRODUCT MEDIA
       ===================================================== */

    const heroMedia = [];


    PRODUCTS.forEach(product => {

        const media =
            getProductImages(product);


        media.forEach(file => {

            heroMedia.push({

                file: file,

                name: product.name,

                isVideo: isVideoFile(file)

            });

        });

    });


    /* =====================================================
       NOTHING FOUND
       ===================================================== */

    if (heroMedia.length === 0) {

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
       CREATE HERO SLIDES
       ===================================================== */

    container.innerHTML = `

        ${heroMedia
            .map((item, index) => {

                /* =========================================
                   VIDEO
                   ========================================= */

                if (item.isVideo) {

                    return `

                        <div
                            class="hero-slide ${index === 0 ? "active" : ""}"
                            data-slide="${index}"
                        >

                            <video
                                class="hero-product-video"
                                src="${item.file}"
                                muted
                                playsinline
                                preload="metadata"
                            ></video>


                            <div class="hero-product-label">
                                ${item.name}
                            </div>

                        </div>

                    `;

                }


                /* =========================================
                   IMAGE
                   ========================================= */

                return `

                    <div
                        class="hero-slide ${index === 0 ? "active" : ""}"
                        data-slide="${index}"
                    >

                        <img
                            src="${item.file}"
                            alt="${item.name}"
                            loading="${index === 0 ? "eager" : "lazy"}"
                            fetchpriority="${index === 0 ? "high" : "auto"}"
                            decoding="async"
                        >

                        <div class="hero-product-label">
                            ${item.name}
                        </div>

                    </div>

                `;

            })
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

            ${heroMedia
                .map((item, index) => `

                    <button
                        type="button"
                        class="slider-dot ${index === 0 ? "active" : ""}"
                        data-hero-dot="${index}"
                        aria-label="${item.isVideo ? "Video" : "Image"} ${index + 1}"
                    ></button>

                `)
                .join("")}

        </div>

    `;


    /* =====================================================
       VARIABLES
       ===================================================== */

    let currentIndex = 0;

    let timer = null;

    let isPaused = false;


    const slides =
        Array.from(
            container.querySelectorAll(
                ".hero-slide"
            )
        );


    const dots =
        Array.from(
            container.querySelectorAll(
                ".slider-dot"
            )
        );


    /* =====================================================
       CLEAR TIMER
       ===================================================== */

    function clearSlideTimer() {

        if (timer !== null) {

            clearTimeout(timer);

            timer = null;

        }

    }


    /* =====================================================
       STOP ALL VIDEOS
       ===================================================== */

    function stopAllVideos() {

        slides.forEach(slide => {

            const video =
                slide.querySelector("video");

            if (!video) return;

            video.pause();

            video.onended = null;

        });

    }


    /* =====================================================
       SHOW SLIDE
       ===================================================== */

    function showSlide(index) {

        clearSlideTimer();

        stopAllVideos();


        currentIndex =
            (index + slides.length) %
            slides.length;


        /* =================================================
           ACTIVATE SLIDE
           ================================================= */

        slides.forEach((slide, i) => {

            slide.classList.toggle(
                "active",
                i === currentIndex
            );

        });


        /* =================================================
           ACTIVATE DOT
           ================================================= */

        dots.forEach((dot, i) => {

            dot.classList.toggle(
                "active",
                i === currentIndex
            );

        });


        const currentSlide =
            slides[currentIndex];


        const video =
            currentSlide.querySelector("video");


        /* =================================================
           VIDEO SLIDE
           ================================================= */

        if (video) {

            /*
               Video controls its own duration.

               THERE IS NO 2.5 SECOND TIMER HERE.
            */

            video.muted = true;

            video.playsInline = true;


            /*
               Start from beginning.
            */

            try {
                video.currentTime = 0;
            } catch (error) {}


            /*
               When video finishes,
               move to next slide.
            */

            video.onended = () => {

                if (!isPaused) {

                    showSlide(
                        currentIndex + 1
                    );

                }

            };


            /*
               Play video.
            */

            const playVideo = () => {

                if (isPaused) return;

                video.play().catch(() => {});

            };


            if (video.readyState >= 3) {

                playVideo();

            } else {

                video.addEventListener(
                    "canplay",
                    playVideo,
                    {
                        once: true
                    }
                );

            }


            return;

        }


        /* =================================================
           NORMAL IMAGE
           ================================================= */

        if (!isPaused) {

            timer =
                setTimeout(
                    () => {

                        showSlide(
                            currentIndex + 1
                        );

                    },
                    SITE_CONFIG.heroSlideDuration
                );

        }

    }


    /* =====================================================
       NEXT
       ===================================================== */

    const nextButton =
        document.getElementById(
            "hero-next"
        );


    nextButton?.addEventListener(
        "click",
        () => {

            isPaused = false;

            showSlide(
                currentIndex + 1
            );

        }
    );


    /* =====================================================
       PREVIOUS
       ================================================= */

    const previousButton =
        document.getElementById(
            "hero-prev"
        );


    previousButton?.addEventListener(
        "click",
        () => {

            isPaused = false;

            showSlide(
                currentIndex - 1
            );

        }
    );


    /* =====================================================
       DOTS
       ===================================================== */

    dots.forEach(dot => {

        dot.addEventListener(
            "click",
            () => {

                isPaused = false;

                const index =
                    Number(
                        dot.dataset.heroDot
                    );

                showSlide(index);

            }
        );

    });


    /* =====================================================
       PAUSE ON MOUSE ENTER
       ===================================================== */

    container.addEventListener(
        "mouseenter",
        () => {

            isPaused = true;

            clearSlideTimer();


            const video =
                slides[currentIndex]
                    .querySelector("video");


            if (video) {

                video.pause();

            }

        }
    );


    /* =====================================================
       RESUME ON MOUSE LEAVE
       ===================================================== */

    container.addEventListener(
        "mouseleave",
        () => {

            isPaused = false;


            const video =
                slides[currentIndex]
                    .querySelector("video");


            if (video) {

                video.play().catch(() => {});

            } else {

                timer =
                    setTimeout(
                        () => {

                            showSlide(
                                currentIndex + 1
                            );

                        },
                        SITE_CONFIG.heroSlideDuration
                    );

            }

        }
    );


    /* =====================================================
       START
       ===================================================== */

    showSlide(0);

}


/* =========================================================
   TRUST ITEMS
   ========================================================= */

function renderTrustItems() {

    const container =
        document.getElementById(
            "trust-grid"
        );

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
   Supports images + videos
   ========================================================= */

function renderProducts() {

    const container =
        document.getElementById(
            "products-grid"
        );

    if (!container) return;


    const productHTML = [];


    PRODUCTS.forEach(product => {

        const media =
            getProductImages(product);


        const finalMedia =
            media.length > 0
                ? media
                : [
                    "assets/images/placeholder.svg"
                ];


        const multipleMedia =
            finalMedia.length > 1;


        /* =================================================
           CREATE SLIDES
           ================================================= */

        const slides =
            finalMedia
                .map((file, index) => {

                    const video =
                        isVideoFile(file);


                    /* =====================================
                       VIDEO
                       ===================================== */

                    if (video) {

                        return `

                            <div
                                class="product-carousel-slide ${index === 0 ? "active" : ""}"
                                data-product-slide="${index}"
                            >

                                <video
                                    class="product-image product-video"
                                    src="${file}"
                                    muted
                                    playsinline
                                    preload="metadata"
                                ></video>

                            </div>

                        `;

                    }


                    /* =====================================
                       IMAGE
                       ===================================== */

                    return `

                        <div
                            class="product-carousel-slide ${index === 0 ? "active" : ""}"
                            data-product-slide="${index}"
                        >

                            <img
                                src="${file}"
                                alt="${product.name}"
                                class="product-image"
                                loading="${index === 0 ? "eager" : "lazy"}"
                                decoding="async"
                            >

                        </div>

                    `;

                })
                .join("");


        /* =================================================
           ARROWS
           ================================================= */

        const arrows =
            multipleMedia
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
            multipleMedia
                ? `

                    <div class="product-dots">

                        ${finalMedia
                            .map((file, index) => {

                                const video =
                                    isVideoFile(file);

                                return `

                                    <button
                                        type="button"
                                        class="product-dot ${index === 0 ? "active" : ""}"
                                        data-product-dot="${index}"
                                        aria-label="${video ? "Video" : "Image"} ${index + 1}"
                                    ></button>

                                `;

                            })
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

                <div class="product-image-container">

                    <div
                        class="product-carousel"
                        data-product-carousel
                    >

                        ${slides}

                    </div>


                    <div class="product-badge">
                        ${product.badge}
                    </div>


                    ${arrows}

                    ${dots}

                </div>


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
   =========================================================

   IMPORTANT:

   IMAGE:
   stays for productSlideDuration

   VIDEO:
   plays until the video ENDS

   No 2.5 second timer is used for videos.
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
            Array.from(
                carousel.querySelectorAll(
                    ".product-carousel-slide"
                )
            );


        const dots =
            Array.from(
                card.querySelectorAll(
                    ".product-dot"
                )
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

        let timer = null;

        let paused = false;


        /* =================================================
           CLEAR TIMER
           ================================================= */

        function clearTimer() {

            if (timer !== null) {

                clearTimeout(timer);

                timer = null;

            }

        }


        /* =================================================
           GET CURRENT VIDEO
           ================================================= */

        function getCurrentVideo() {

            const slide =
                slides[currentIndex];

            if (!slide) return null;

            return slide.querySelector(
                "video"
            );

        }


        /* =================================================
           STOP ALL VIDEOS
           ================================================= */

        function stopAllVideos() {

            slides.forEach((slide, index) => {

                const video =
                    slide.querySelector(
                        "video"
                    );

                if (!video) return;


                video.pause();


                /*
                   Reset videos that aren't
                   currently selected.
                */

                if (index !== currentIndex) {

                    try {

                        video.currentTime = 0;

                    } catch (error) {}

                }


                video.onended = null;

            });

        }


        /* =================================================
           SHOW SLIDE
           ================================================= */

        function showSlide(index) {

            /*
               Remove any old image timer.
            */

            clearTimer();


            /*
               Calculate new index.
            */

            currentIndex =
                (index + slides.length) %
                slides.length;


            /*
               Stop videos.
            */

            stopAllVideos();


            /* =================================================
               ACTIVATE SLIDE
               ================================================= */

            slides.forEach((slide, i) => {

                slide.classList.toggle(
                    "active",
                    i === currentIndex
                );

            });


            /* =================================================
               ACTIVATE DOT
               ================================================= */

            dots.forEach((dot, i) => {

                dot.classList.toggle(
                    "active",
                    i === currentIndex
                );

            });


            /* =================================================
               CURRENT VIDEO?
               ================================================= */

            const video =
                getCurrentVideo();


            /* =================================================
               VIDEO SLIDE
               ================================================= */

            if (video) {

                /*
                   VERY IMPORTANT:

                   There is NO setTimeout()
                   here.

                   Video controls when
                   the slide changes.
                */


                video.muted = true;

                video.playsInline = true;


                /*
                   Start from beginning.
                */

                try {

                    video.currentTime = 0;

                } catch (error) {}


                /*
                   When video finishes,
                   go to next slide.
                */

                video.onended = () => {

                    if (!paused) {

                        showSlide(
                            currentIndex + 1
                        );

                    }

                };


                /*
                   Play video.
                */

                const playVideo = () => {

                    if (paused) return;

                    video
                        .play()
                        .catch(() => {});

                };


                /*
                   Video already ready.
                */

                if (video.readyState >= 3) {

                    playVideo();

                } else {

                    /*
                       Wait until browser can play.
                    */

                    video.addEventListener(
                        "canplay",
                        playVideo,
                        {
                            once: true
                        }
                    );

                }


                /*
                   IMPORTANT:

                   RETURN HERE.

                   This prevents the image
                   timer from being created.
                */

                return;

            }


            /* =================================================
               NORMAL IMAGE
               ================================================= */

            if (!paused) {

                timer =
                    setTimeout(
                        () => {

                            showSlide(
                                currentIndex + 1
                            );

                        },
                        SITE_CONFIG.productSlideDuration
                    );

            }

        }


        /* =================================================
           NEXT BUTTON
           ================================================= */

        next?.addEventListener(
            "click",
            () => {

                paused = false;

                showSlide(
                    currentIndex + 1
                );

            }
        );


        /* =================================================
           PREVIOUS BUTTON
           ================================================= */

        prev?.addEventListener(
            "click",
            () => {

                paused = false;

                showSlide(
                    currentIndex - 1
                );

            }
        );


        /* =================================================
           DOTS
           ================================================= */

        dots.forEach(dot => {

            dot.addEventListener(
                "click",
                () => {

                    paused = false;


                    const index =
                        Number(
                            dot.dataset.productDot
                        );


                    showSlide(index);

                }
            );

        });


        /* =================================================
           MOUSE ENTER
           ================================================= */

        card.addEventListener(
            "mouseenter",
            () => {

                paused = true;

                clearTimer();


                const video =
                    getCurrentVideo();


                if (video) {

                    video.pause();

                }

            }
        );


        /* =================================================
           MOUSE LEAVE
           ================================================= */

        card.addEventListener(
            "mouseleave",
            () => {

                paused = false;


                const video =
                    getCurrentVideo();


                /* =============================================
                   VIDEO
                   ============================================= */

                if (video) {

                    video.play().catch(() => {});


                    video.onended = () => {

                        if (!paused) {

                            showSlide(
                                currentIndex + 1
                            );

                        }

                    };


                    return;

                }


                /* =============================================
                   IMAGE
                   ============================================= */

                clearTimer();


                timer =
                    setTimeout(
                        () => {

                            showSlide(
                                currentIndex + 1
                            );

                        },
                        SITE_CONFIG.productSlideDuration
                    );

            }
        );


        /* =================================================
           START
           ================================================= */

        showSlide(0);

    });

}


/* =========================================================
   BENEFITS
   ========================================================= */

function renderBenefits() {

    const container =
        document.getElementById(
            "benefits-grid"
        );

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
        document.getElementById(
            "steps-grid"
        );

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
        document.getElementById(
            "faq-list"
        );

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
                        button.querySelector(
                            "i"
                        );


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
        document.getElementById(
            "main-header"
        );

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
        document.getElementById(
            "custom-cursor"
        );

    if (!cursor) return;


    const dot =
        cursor.querySelector(
            ".cursor-dot"
        );

    if (!dot) return;


    let mouseX = 0;

    let mouseY = 0;

    let cursorX = 0;

    let cursorY = 0;


    /* =====================================================
       MOUSE MOVEMENT
       ===================================================== */

    document.addEventListener(
        "mousemove",
        event => {

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

                dot.classList.add(
                    "hover"
                );

            }
        );


        element.addEventListener(
            "mouseleave",
            () => {

                dot.classList.remove(
                    "hover"
                );

            }
        );

    });


    /* =====================================================
       CLICK EFFECT
       ===================================================== */

    document.addEventListener(
        "mousedown",
        () => {

            dot.classList.add(
                "click"
            );

        }
    );


    document.addEventListener(
        "mouseup",
        () => {

            dot.classList.remove(
                "click"
            );

        }
    );

}