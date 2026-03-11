/**
 * Modern UI functionality for Pentariver website
 * Handles various UI effects and animations for a modern user experience
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all modern UI features when DOM is fully loaded
    initCustomCursor();
    initParallax();
    initScrollProgress();
    initDarkMode();
    // initLoader(); // Disabled to prevent blocking issues
    init3DCards();
});

/**
 * Initialize parallax scrolling effect for background elements
 * Creates depth effect by moving background elements at different speeds
 */
function initParallax() {
    const parallaxContainers = document.querySelectorAll('.parallax-container');

    if (parallaxContainers.length > 0) {
        window.addEventListener('scroll', function () {
            parallaxContainers.forEach(container => {
                const parallaxBg = container.querySelector('.parallax-bg');
                const scrollPosition = window.pageYOffset;
                const containerOffset = container.offsetTop;
                const containerHeight = container.offsetHeight;

                // Only apply parallax effect when container is in viewport
                if (scrollPosition + window.innerHeight > containerOffset &&
                    scrollPosition < containerOffset + containerHeight) {
                    const speed = 0.5;
                    const yPos = (scrollPosition - containerOffset) * speed;
                    parallaxBg.style.transform = `translateY(${yPos}px)`;
                }
            });
        });
    }
}

/**
 * Initialize scroll progress indicator
 * Creates a progress bar at the top of the page that fills as user scrolls
 */
function initScrollProgress() {
    const scrollProgress = document.createElement('div');
    scrollProgress.classList.add('scroll-progress');
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', function () {
        const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (windowScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';
    });
}

/**
 * Initialize dark mode functionality
 * Placeholder function for future dark mode implementation
 */
function initDarkMode() {
    // Dark mode implementation to be added in future updates
}

/**
 * Initialize custom cursor
 * Placeholder function for future custom cursor implementation
 */
function initCustomCursor() {
    // Custom cursor implementation to be added in future updates
}

/**
 * Initialize page loader animation
 * Shows loading animation while page assets are loading
 */
function initLoader() {
    /*
    const loader = document.createElement('div');
    loader.classList.add('loader');
    loader.innerHTML = '<div class="loader-circle"></div>';
    document.body.appendChild(loader);
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.classList.add('hidden');
            setTimeout(function() {
                loader.remove();
            }, 500);
        }, 500);
    });
    */
}

/**
 * Initialize 3D card hover effects
 * Creates interactive 3D rotation effect on cards when hovering
 */
function init3DCards() {
    const cards = document.querySelectorAll('.card-3d');

    cards.forEach(card => {
        const cardInner = card.querySelector('.card-3d-inner');

        // Add mousemove event for 3D rotation effect
        card.addEventListener('mousemove', function (e) {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;

            // Calculate mouse position relative to card center
            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;

            // Calculate rotation angles based on mouse position
            const rotateY = (mouseX / (cardRect.width / 2)) * 10;
            const rotateX = -((mouseY / (cardRect.height / 2)) * 10);

            // Apply 3D rotation transform
            cardInner.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        });

        // Reset card rotation when mouse leaves
        card.addEventListener('mouseleave', function () {
            cardInner.style.transform = 'rotateY(0) rotateX(0)';
        });
    });
}

/**
 * Initialize scroll-triggered animations
 * Adds animation classes to elements when they enter the viewport
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Initialize modern form input effects
 * Adds focus and filled states to form inputs for better UX
 */
function initModernForms() {
    const modernInputs = document.querySelectorAll('.modern-input input, .modern-input textarea');

    modernInputs.forEach(input => {
        // Check if input already has value on page load
        if (input.value.trim() !== '') {
            input.classList.add('has-value');
        }

        // Add focus class to parent container when input is focused
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });

        // Remove focus class and check for value when input loses focus
        input.addEventListener('blur', function () {
            this.parentElement.classList.remove('focused');

            if (this.value.trim() !== '') {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });
}

/**
 * Initialize floating animation elements
 * Adds staggered animation delays to elements with floating class
 */
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating');

    floatingElements.forEach((element, index) => {
        // Add staggered animation delay based on element index
        element.style.animationDelay = (index * 0.2) + 's';
    });
}

// Initialize additional UI features on window load
window.addEventListener('load', function () {
    initScrollAnimations();
    initModernForms();
    initFloatingElements();

    // Set up smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
