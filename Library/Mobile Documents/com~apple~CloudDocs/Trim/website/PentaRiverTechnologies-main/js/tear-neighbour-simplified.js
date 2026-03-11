/**
 * Interactive Lighting Preview – Scene Gallery
 * Curated 26 patterns: 7 Architecture · 7 Weekend · 12 Holidays (one per month)
 * Images sourced from TearNeighbour folder (files 6–52)
 */

const BASE = '../images/trimlight/TearNeighbour/240820 3141 WOODLAND PK CV S JORDAN UT-';

const tearImages = [

    /* ── Architecture  (7) ───────────────────────────────────── */
    { id: 'a1', cat: 'daily', title: 'Cool White Modern', src: BASE + '13.jpg' },
    { id: 'a2', cat: 'daily', title: 'Warm Amber Glow', src: BASE + '18.jpg' },
    { id: 'a3', cat: 'daily', title: 'Bright White Accent', src: BASE + '45.jpg' },
    { id: 'a4', cat: 'daily', title: 'Soft Moonlight', src: BASE + '46.jpg' },
    { id: 'a5', cat: 'daily', title: 'Estate Elegance', src: BASE + '48.jpg' },
    { id: 'a6', cat: 'daily', title: 'Warm White Classic', src: BASE + '50.jpg' },
    { id: 'a7', cat: 'daily', title: 'Clean Minimalist', src: BASE + '52.jpg' },

    /* ── Weekend / Party  (7) ────────────────────────────────── */
    { id: 'w1', cat: 'weekend', title: 'Rainbow Party', src: BASE + '7.jpg' },
    { id: 'w2', cat: 'weekend', title: 'Ocean Teal & Blue', src: BASE + '8.jpg' },
    { id: 'w3', cat: 'weekend', title: 'Neon Vibes', src: BASE + '25.jpg' },
    { id: 'w4', cat: 'weekend', title: 'Deep Blue Chill', src: BASE + '30.jpg' },
    { id: 'w5', cat: 'weekend', title: 'Game Day Spirit', src: BASE + '37.jpg' },
    { id: 'w6', cat: 'weekend', title: 'Electric Purple Mix', src: BASE + '40.jpg' },
    { id: 'w7', cat: 'weekend', title: 'Summer Night', src: BASE + '42.jpg' },

    /* ── Holidays – one per month  (12) ──────────────────────── */
    { id: 'h01', cat: 'holiday', title: 'Jan – New Year\'s Gold', src: BASE + '24.jpg' },
    { id: 'h02', cat: 'holiday', title: 'Feb – Valentine Romance', src: BASE + '26.jpg' },
    { id: 'h03', cat: 'holiday', title: 'Mar – St. Patrick\'s Day', src: BASE + '34.jpg' },
    { id: 'h04', cat: 'holiday', title: 'Apr – Easter Pastel', src: BASE + '33.jpg' },
    { id: 'h05', cat: 'holiday', title: 'May – Mother\'s Day Bloom', src: BASE + '21.jpg' },
    { id: 'h06', cat: 'holiday', title: 'Jun – Father\'s Day Blue', src: BASE + '17.jpg' },
    { id: 'h07', cat: 'holiday', title: 'Jul – Canada Day', src: BASE + '20.jpg' },
    { id: 'h08', cat: 'holiday', title: 'Aug – Summer Festival', src: BASE + '41.jpg' },
    { id: 'h09', cat: 'holiday', title: 'Sep – Back to School', src: BASE + '9.jpg' },
    { id: 'h10', cat: 'holiday', title: 'Oct – Halloween Spooky', src: BASE + '28.jpg' },
    { id: 'h11', cat: 'holiday', title: 'Nov – Remembrance Day', src: BASE + '43.jpg' },
    { id: 'h12', cat: 'holiday', title: 'Dec – Classic Christmas', src: BASE + '6.jpg' },
];

/* ── Initialise ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initLightingPreview();
});

function initLightingPreview() {
    const tabs = document.querySelectorAll('.preview-tab');
    const carousel = document.getElementById('tearScroll');
    const mainImg = document.getElementById('tearMainImg');
    const mainTitle = document.getElementById('tearMainTitle');
    const prevBtn = document.getElementById('tearPrevBtn');
    const nextBtn = document.getElementById('tearNextBtn');

    if (!carousel || !mainImg) return;

    let activeCategory = 'all';
    let activeImage = tearImages[0];
    let autoAdvanceTimer = null;
    const AUTO_ADVANCE_MS = 3000;

    const getActiveList = () => activeCategory === 'all'
        ? tearImages
        : tearImages.filter(i => i.cat === activeCategory);

    function advanceToNext() {
        const list = getActiveList();
        const curIdx = list.findIndex(i => i.id === activeImage.id);
        if (curIdx === -1) return;
        const nextIdx = (curIdx + 1) % list.length;
        selectImage(list[nextIdx]);
    }

    function startAutoAdvance() {
        clearInterval(autoAdvanceTimer);
        autoAdvanceTimer = setInterval(advanceToNext, AUTO_ADVANCE_MS);
    }

    function stopAutoAdvance() {
        clearInterval(autoAdvanceTimer);
        autoAdvanceTimer = null;
    }

    function updateNavState() {
        if (!prevBtn || !nextBtn) return;

        const list = getActiveList();
        const curIdx = list.findIndex(i => i.id === activeImage.id);
        prevBtn.disabled = curIdx <= 0;
        nextBtn.disabled = curIdx === -1 || curIdx >= list.length - 1;
    }

    function moveSelection(step) {
        const list = getActiveList();
        const curIdx = list.findIndex(i => i.id === activeImage.id);
        if (curIdx === -1) return;

        const nextIdx = curIdx + step;
        if (nextIdx < 0 || nextIdx >= list.length) return;
        selectImage(list[nextIdx]);
    }

    /* ── 1. Build scene bubble carousel ─────────────────────── */
    function renderBubbles() {
        carousel.innerHTML = '';

        const list = getActiveList();

        list.forEach(img => {
            const bubble = document.createElement('button');
            bubble.type = 'button';
            bubble.className = 'scene-bubble' + (img.id === activeImage.id ? ' active' : '');
            bubble.setAttribute('data-id', img.id);
            bubble.setAttribute('title', img.title);
            bubble.setAttribute('aria-label', `Show scene: ${img.title}`);
            bubble.textContent = img.title;
            bubble.addEventListener('click', () => selectImage(img));
            carousel.appendChild(bubble);
        });
    }

    /* ── 2. Select / preview an image ────────────────────────── */
    function selectImage(img) {
        activeImage = img;

        // highlight correct bubble
        carousel.querySelectorAll('.scene-bubble').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-id') === img.id);
        });

        // fade-swap the main preview
        mainImg.style.opacity = '0';
        setTimeout(() => {
            mainImg.onload = () => { mainImg.style.opacity = '1'; };
            mainImg.src = img.src;
            mainImg.alt = img.title;
            if (mainImg.complete) mainImg.style.opacity = '1';
            if (mainTitle) mainTitle.textContent = img.title;
        }, 250);

        // scroll the active bubble into view
        const activeBubble = carousel.querySelector('.scene-bubble.active');
        if (activeBubble) {
            activeBubble.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }

        updateNavState();
        startAutoAdvance();
    }

    /* ── 3. Tab filters ──────────────────────────────────────── */
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            activeCategory = tab.dataset.category;
            renderBubbles();

            // auto-select first pattern in the new filter
            const firstInCat = activeCategory === 'all'
                ? tearImages[0]
                : tearImages.find(i => i.cat === activeCategory);

            if (firstInCat) selectImage(firstInCat);
        });
    });

    /* ── 4. Keyboard nav (left / right arrows) ───────────────── */
    document.addEventListener('keydown', (e) => {
        const stage = document.querySelector('.preview-stage');
        if (!stage) return;
        const rect = stage.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) return;

        if (e.key === 'ArrowRight') {
            moveSelection(1);
        } else if (e.key === 'ArrowLeft') {
            moveSelection(-1);
        }
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', () => moveSelection(-1));
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => moveSelection(1));
    }

    /* ── 5. Bootstrap ────────────────────────────────────────── */
    renderBubbles();
    selectImage(tearImages[0]);
    startAutoAdvance();

    /* Optional: pause auto-advance when section is out of view to save resources */
    const stage = document.querySelector('.preview-stage');
    if (typeof IntersectionObserver !== 'undefined' && stage) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    startAutoAdvance();
                } else {
                    stopAutoAdvance();
                }
            });
        }, { threshold: 0.2 });
        observer.observe(stage);
    }
}
