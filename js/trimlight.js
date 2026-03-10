/**
 * Trimlight Kamloops Page Scripts
 */

/**
 * Ensure Trimlight page always shows the top/hero section when landing.
 * Handles: direct load, navigation from other pages, back button, and scroll restoration.
 */
function scrollToTopOnLanding() {
    if (typeof history !== 'undefined' && history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
}

function scrollToHeroIfNeeded() {
    if (window.location.hash === '#trimlight-hero') {
        var hero = document.getElementById('trimlight-hero');
        if (hero) hero.scrollIntoView({ behavior: 'instant', block: 'start' });
        return;
    }
    scrollToTopOnLanding();
}

document.addEventListener('DOMContentLoaded', function () {
    scrollToTopOnLanding();
    initHeroSlider();
    initTrimlightVideo();
    init3WaySlider();
    initInteractiveTechHub();
    initComparisonSlider();
    initMobileCompacts();
});

// Re-scroll when hash changes (e.g. user clicks Trimlight link while already on page)
window.addEventListener('hashchange', scrollToHeroIfNeeded);

// When Trimlight nav/link is clicked while already on this page, scroll to top
document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a || !a.href) return;
    var path = a.getAttribute('href') || '';
    if ((path.indexOf('trimlight-kamloops') !== -1) && path.indexOf('#trimlight-hero') !== -1) {
        var pagePath = window.location.pathname || '';
        if (pagePath.indexOf('trimlight-kamloops') !== -1) {
            e.preventDefault();
            window.scrollTo(0, 0);
            if (window.history && window.history.replaceState) {
                window.history.replaceState(null, '', window.location.pathname + '#trimlight-hero');
            }
        }
    }
});

// Fallback after load (handles layout shift from images)
window.addEventListener('load', function () {
    // scrollToTopOnLanding();
});

function initTrimlightVideo() {
    var section = document.getElementById('trimlight-video');
    var video = document.getElementById('trimlightVideoNative');
    var overlay = document.getElementById('trimlightVideoUnmuteOverlay');
    var btn = document.getElementById('trimlightVideoUnmuteBtn');
    var wrap = section ? section.querySelector('.trimlight-video-wrap') : null;
    if (!section || !video) return;

    var directSrc = section.getAttribute('data-video-mp4');
    var hasStarted = false;

    function startVideoWhenInView() {
        if (hasStarted) return;
        hasStarted = true;
        if (!directSrc) return;
        video.src = directSrc;
        video.load();
        video.play().catch(function () {});
    }

    function setOverlayState() {
        if (!overlay) return;
        if (video.muted) {
            overlay.classList.remove('is-hidden');
            overlay.setAttribute('aria-hidden', 'false');
        } else {
            overlay.classList.add('is-hidden');
            overlay.setAttribute('aria-hidden', 'true');
        }
    }

    function toggleMute() {
        video.muted = !video.muted;
        video.play().catch(function () {});
        setOverlayState();
    }

    video.addEventListener('canplay', function () { video.play().catch(function () {}); });

    if (typeof IntersectionObserver !== 'undefined') {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) startVideoWhenInView();
                });
            },
            { rootMargin: '15% 0%', threshold: 0.15 }
        );
        observer.observe(section);
    } else {
        startVideoWhenInView();
    }

    // Entire video area toggles mute/unmute
    if (wrap) {
        wrap.addEventListener('click', function (e) {
            if (e.target === btn || (btn && btn.contains(e.target))) return;
            toggleMute();
        });
    }


    if (overlay && btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMute();
        });
    }

    setOverlayState();
}

function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    const slideInterval = 6000; // 6 seconds – calm, premium feel

    if (slides.length === 0) return;

    function showSlide(index) {
        slides.forEach(function (slide) { slide.classList.remove('active'); });
        dots.forEach(function (dot) {
            dot.classList.remove('active');
            dot.removeAttribute('aria-current');
        });

        slides[index].classList.add('active');
        if (dots[index]) {
            dots[index].classList.add('active');
            dots[index].setAttribute('aria-current', 'true');
        }

        currentSlide = index;
    }

    function nextSlide() {
        var nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    var slideTimer = setInterval(nextSlide, slideInterval);

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            clearInterval(slideTimer);
            showSlide(index);
            slideTimer = setInterval(nextSlide, slideInterval);
        });
    });
}

function init3WaySlider() {
    const sliderControl = document.getElementById('trimlightSliderControl');
    const sliderHandle = document.getElementById('sliderHandle');
    const imageWhite = document.querySelector('.image-white');
    const imageRgb = document.querySelector('.image-rgb');

    if (!sliderControl || !imageWhite || !imageRgb) return;

    function updateSlider() {
        const value = parseInt(sliderControl.value);
        const max = parseInt(sliderControl.max);

        // Update Handle Position
        // value is 0-200. Percentage is value / 200 * 100
        const percentage = (value / max) * 100;
        if (sliderHandle) {
            sliderHandle.style.left = percentage + '%';
        }

        // Calculate opacity for White image (0 to 100)
        // 0 -> 0, 100 -> 1
        let whiteOpacity = 0;
        if (value <= 100) {
            whiteOpacity = value / 100;
        } else {
            whiteOpacity = 1; // Stay fully visible as RGB fades in on top
        }

        // Calculate opacity for RGB image (100 to 200)
        // 100 -> 0, 200 -> 1
        let rgbOpacity = 0;
        if (value > 100) {
            rgbOpacity = (value - 100) / 100;
        }

        imageWhite.style.opacity = whiteOpacity;
        imageRgb.style.opacity = rgbOpacity;
    }

    sliderControl.addEventListener('input', updateSlider);

    // Initialize
    updateSlider();
}

function initInteractiveTechHub() {
    const hotspots = document.querySelectorAll('.hotspot');
    const specCards = document.querySelectorAll('.glass-spec-card');

    hotspots.forEach(hotspot => {
        hotspot.addEventListener('mouseenter', () => activateCard(hotspot.dataset.target));
        hotspot.addEventListener('click', () => activateCard(hotspot.dataset.target));
    });

    function activateCard(targetId) {
        // Remove active class from all cards
        specCards.forEach(card => {
            card.classList.remove('active');
            card.style.display = 'none'; // Hide others
        });

        // Show and activate target card
        const targetCard = document.getElementById(targetId);
        if (targetCard) {
            targetCard.style.display = 'block';
            // Slight delay to allow display:block to apply before adding class for transition
            setTimeout(() => {
                targetCard.classList.add('active');
            }, 10);
        }
    }
}

function initComparisonSlider() {
    const container = document.querySelector('.comparison-slider-container');
    const beforeImage = document.querySelector('.comparison-image-wrapper.before');
    const handle = document.querySelector('.comparison-handle');

    if (!container || !beforeImage || !handle) return;

    let isDragging = false;

    const onMove = (e) => {
        if (!isDragging) return;

        const containerRect = container.getBoundingClientRect();
        let x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;

        // Calculate position relative to container
        let position = x - containerRect.left;

        // Clamp position
        if (position < 0) position = 0;
        if (position > containerRect.width) position = containerRect.width;

        // Update width of before image and handle position
        let percentage = (position / containerRect.width) * 100;

        beforeImage.style.width = percentage + '%';
        handle.style.left = percentage + '%';
    };

    const onStart = () => { isDragging = true; };
    const onEnd = () => { isDragging = false; };

    // Mouse events
    handle.addEventListener('mousedown', onStart);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);

    // Touch events
    handle.addEventListener('touchstart', onStart);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onEnd);
}

function initMobileCompacts() {
    var mapWrap = document.getElementById('serviceAreaMapCollapse');
    var mapToggle = document.getElementById('serviceAreaMapToggle');
    if (mapToggle && mapWrap) {
        mapToggle.addEventListener('click', function () {
            var collapsed = mapWrap.classList.toggle('mobile-map-collapsed');
            mapToggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
            var text = mapToggle.querySelector('.btn-toggle-text');
            if (text) text.textContent = collapsed ? 'View service area map' : 'Hide map';
        });
    }

    var listCollapse = document.getElementById('serviceListCollapse');
    var listToggle = document.getElementById('serviceListToggle');
    if (listToggle && listCollapse) {
        listToggle.addEventListener('click', function () {
            var expanded = listCollapse.classList.toggle('is-expanded');
            listToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            var text = listToggle.querySelector('.btn-toggle-text');
            if (text) text.textContent = expanded ? 'Hide communities' : 'View all communities (35)';
            var chevron = listToggle.querySelector('.btn-toggle-chevron');
            if (chevron) chevron.setAttribute('aria-hidden', 'true');
        });
    }

    var specCards = document.querySelectorAll('.spec-card-accordion');
    specCards.forEach(function (card) {
        var btn = card.querySelector('.spec-card-header');
        if (!btn) return;
        btn.addEventListener('click', function () {
            var isOpen = card.classList.toggle('is-open');
            btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            if (isOpen) {
                specCards.forEach(function (c) {
                    if (c !== card) {
                        c.classList.remove('is-open');
                        var b = c.querySelector('.spec-card-header');
                        if (b) b.setAttribute('aria-expanded', 'false');
                    }
                });
            }
        });
    });

    var benefitItems = document.querySelectorAll('.seo-benefit-item');
    benefitItems.forEach(function (item) {
        var trigger = item.querySelector('.benefit-accordion-trigger');
        if (!trigger) return;
        trigger.addEventListener('click', function () {
            var isOpen = item.classList.toggle('is-open');
            trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    });
}
