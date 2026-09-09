// cursor.js – Golden Luxury Bubble Cursor
(function() {
    'use strict';

    // ─── CONFIGURATION – tweak these values to your liking ──────────
    const CONFIG = {
        mainSize: 32,           // diameter of the main bubble (px)
        mainColor1: '#f5d742',  // light gold
        mainColor2: '#d4a017',  // deeper gold
        glowColor: 'rgba(255, 215, 0, 0.35)',
        glowBlur: 40,
        trailCount: 10,         // number of trailing bubbles
        trailMinSize: 4,
        trailMaxSize: 14,
        trailOpacity: 0.6,
        trailFade: 0.08,
        easing: 0.12,           // lower = smoother, more lag
        hoverScale: 2.0,        // how much it grows on hover
        hoverTransition: 0.15,
        zIndex: 99999,
    };

    // ─── Find the container where the cursor will live ──────────────
    const container = document.getElementById('golden-cursor-container');
    if (!container) {
        console.warn('Golden Cursor: container #golden-cursor-container not found.');
        return;
    }

    // ─── State ──────────────────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const cursor = { x: 0, y: 0 };
    let isHovering = false;
    let targetScale = 1;
    let currentScale = 1;

    // ─── Create the main cursor element ────────────────────────────
    const mainEl = document.createElement('div');
    mainEl.className = 'golden-cursor-main';
    Object.assign(mainEl.style, {
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: CONFIG.zIndex,
        width: CONFIG.mainSize + 'px',
        height: CONFIG.mainSize + 'px',
        borderRadius: '50%',
        background: `radial-gradient(circle at 35% 30%, ${CONFIG.mainColor1}, ${CONFIG.mainColor2} 80%)`,
        boxShadow: `
            0 0 ${CONFIG.glowBlur}px ${CONFIG.glowColor},
            inset 0 -4px 12px rgba(0,0,0,0.25),
            inset 0 4px 20px rgba(255,255,220,0.4)
        `,
        transform: 'translate(-50%, -50%) scale(1)',
        willChange: 'transform, left, top',
        transition: `transform ${CONFIG.hoverTransition}s cubic-bezier(0.34, 1.56, 0.64, 1)`,
        filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.15))',
        border: '1px solid rgba(255,215,0,0.15)',
    });
    container.appendChild(mainEl);

    // ─── Create trail particles ────────────────────────────────────
    const trails = [];
    for (let i = 0; i < CONFIG.trailCount; i++) {
        const el = document.createElement('div');
        const size = CONFIG.trailMinSize + (CONFIG.trailMaxSize - CONFIG.trailMinSize) * (i / CONFIG.trailCount);
        const opacity = CONFIG.trailOpacity * (1 - i / CONFIG.trailCount) * 0.8;

        Object.assign(el.style, {
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: CONFIG.zIndex - 1 - i,
            width: size + 'px',
            height: size + 'px',
            borderRadius: '50%',
            background: `radial-gradient(circle at 40% 35%, ${CONFIG.mainColor1}, ${CONFIG.mainColor2} 90%)`,
            boxShadow: `0 0 ${10 + i * 2}px rgba(255,215,0,${0.08 + (1 - i / CONFIG.trailCount) * 0.12})`,
            opacity: opacity,
            transform: 'translate(-50%, -50%) scale(0.6)',
            willChange: 'transform, left, top, opacity',
            border: '1px solid rgba(255,215,0,0.05)',
            filter: 'blur(0.5px)',
        });
        container.appendChild(el);
        trails.push({
            el: el,
            x: 0,
            y: 0,
            size: size,
            opacity: opacity,
        });
    }

    // ─── Mouse move – detect interactive elements ──────────────────
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        // Check if the cursor is over a clickable element
        const target = e.target;
        const isInteractive = target.closest &&
            (target.closest('a, button, input, select, textarea, [role="button"]') ||
             target.closest('[data-cursor]'));

        if (isInteractive) {
            if (!isHovering) {
                isHovering = true;
                targetScale = CONFIG.hoverScale;
            }
        } else {
            if (isHovering) {
                isHovering = false;
                targetScale = 1;
            }
        }
    });

    // ─── Animation loop ─────────────────────────────────────────────
    function animate() {
        // Smooth follow
        cursor.x += (mouse.x - cursor.x) * CONFIG.easing;
        cursor.y += (mouse.y - cursor.y) * CONFIG.easing;

        // Scale with smooth transition
        currentScale += (targetScale - currentScale) * 0.18;

        // Update main cursor
        mainEl.style.left = cursor.x + 'px';
        mainEl.style.top = cursor.y + 'px';
        mainEl.style.transform = `translate(-50%, -50%) scale(${currentScale})`;

        // Update trails – each trail follows the one before it
        for (let i = 0; i < trails.length; i++) {
            const t = trails[i];
            const targetX = (i === 0) ? cursor.x : trails[i - 1].x;
            const targetY = (i === 0) ? cursor.y : trails[i - 1].y;

            t.x += (targetX - t.x) * (0.18 - i * 0.006);
            t.y += (targetY - t.y) * (0.18 - i * 0.006);

            t.el.style.left = t.x + 'px';
            t.el.style.top = t.y + 'px';

            // Scale and fade based on distance from main cursor
            const dx = t.x - cursor.x;
            const dy = t.y - cursor.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 120;
            const scaleFactor = 0.5 + (1 - Math.min(dist / maxDist, 1)) * 0.5;
            const sizeScale = 0.6 + (1 - i / trails.length) * 0.6;
            t.el.style.transform = `translate(-50%, -50%) scale(${scaleFactor * sizeScale})`;
            const opacityFactor = 1 - Math.min(dist / maxDist, 1) * 0.7;
            t.el.style.opacity = t.opacity * opacityFactor;
        }

        requestAnimationFrame(animate);
    }

    // ─── Initialise positions ──────────────────────────────────────
    cursor.x = window.innerWidth / 2;
    cursor.y = window.innerHeight / 2;
    mouse.x = cursor.x;
    mouse.y = cursor.y;

    for (let i = 0; i < trails.length; i++) {
        trails[i].x = cursor.x;
        trails[i].y = cursor.y;
        trails[i].el.style.left = cursor.x + 'px';
        trails[i].el.style.top = cursor.y + 'px';
    }

    animate();
    console.log('✦ Golden Luxury Cursor initialised');
})();