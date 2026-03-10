/**
 * Main JavaScript file for Pentariver website
 * Contains initialization functions and event handlers for various website features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all main functionality when DOM is fully loaded
    initNavigation();
    initScrollEffects();
    initContactForm();
    initAnimations();
});

/**
 * Initialize navigation functionality
 * Handles mobile menu toggle, click outside menu closing, and active link highlighting
 */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
    
    // Set up mobile menu toggle functionality
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close menu when clicking outside navigation area
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navToggle.contains(event.target) || navList.contains(event.target);
        if (!isClickInsideNav && navList.classList.contains('active')) {
            navList.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
    
    // Highlight active navigation link based on current page
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPath = link.getAttribute('href');
        if (currentLocation.includes(linkPath) && linkPath !== '/') {
            link.classList.add('active');
        } else if (currentLocation === '/' && linkPath === '/') {
            link.classList.add('active');
        } else if ((currentLocation === '/' || currentLocation.endsWith('index.html')) && (linkPath === 'index.html' || linkPath.endsWith('/index.html'))) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize scroll-related effects
 * Handles header styling on scroll and smooth scrolling to page sections
 */
function initScrollEffects() {
    const header = document.querySelector('.header');
    
    // Add scrolled class to header when page is scrolled down
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Set up smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu after clicking a link
                const navList = document.querySelector('.nav-list');
                const navToggle = document.querySelector('.nav-toggle');
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    });
}

/**
 * Initialize contact form functionality
 * Handles form validation and submission
 */
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = new FormData(contactForm);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Validate form fields
            let isValid = true;
            const nameInput = contactForm.querySelector('[name="name"]');
            const emailInput = contactForm.querySelector('[name="email"]');
            const messageInput = contactForm.querySelector('[name="message"]');
            
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Please enter your name');
                isValid = false;
            } else {
                removeError(nameInput);
            }
            
            if (!emailInput.value.trim()) {
                showError(emailInput, 'Please enter your email');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email');
                isValid = false;
            } else {
                removeError(emailInput);
            }
            
            if (!messageInput.value.trim()) {
                showError(messageInput, 'Please enter your message');
                isValid = false;
            } else {
                removeError(messageInput);
            }
            
            // Submit form if valid
            if (isValid) {
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.textContent;
                
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                
                // Simulate form submission (replace with actual API call)
                setTimeout(() => {
                    contactForm.reset();
                    showFormMessage(contactForm, 'Your message has been sent successfully!', 'success');
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                }, 1500);
            }
        });
    }
}

/**
 * Validate email format using regex
 * @param {string} email - Email address to validate
 * @return {boolean} - True if email format is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Display error message for form input
 * @param {HTMLElement} input - Form input element
 * @param {string} message - Error message to display
 */
function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
    
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(errorElement);
    }
    
    input.classList.add('error');
}

/**
 * Remove error message from form input
 * @param {HTMLElement} input - Form input element
 */
function removeError(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
        formGroup.removeChild(errorElement);
    }
    
    input.classList.remove('error');
}

/**
 * Display form message (success/error)
 * @param {HTMLElement} form - Form element
 * @param {string} message - Message to display
 * @param {string} type - Message type (success/error)
 */
function showFormMessage(form, message, type) {
    const messageElement = form.querySelector('.form-message') || document.createElement('div');
    
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    if (!form.querySelector('.form-message')) {
        form.prepend(messageElement);
    }
    
    // Remove message after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode === form) {
            form.removeChild(messageElement);
        }
    }, 5000);
}

/**
 * Initialize animations using Intersection Observer
 * Adds 'animated' class to elements when they enter viewport
 */
function initAnimations() {
    if ('IntersectionObserver' in window) {
        const animatedElements = document.querySelectorAll('.animate');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {threshold: 0.1});
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        document.querySelectorAll('.animate').forEach(element => {
            element.classList.add('animated');
        });
    }
}

/**
 * Initialize testimonial slider functionality
 * Handles manual navigation and automatic rotation
 */
function initTestimonialSlider() {
    const testimonialSlider = document.querySelector('.testimonial-slider');
    
    if (testimonialSlider) {
        const testimonials = testimonialSlider.querySelectorAll('.testimonial');
        const prevButton = testimonialSlider.querySelector('.slider-prev');
        const nextButton = testimonialSlider.querySelector('.slider-next');
        
        let currentIndex = 0;
        showTestimonial(currentIndex);
        
        // Previous button click handler
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
                showTestimonial(currentIndex);
            });
        }
        
        // Next button click handler
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % testimonials.length;
                showTestimonial(currentIndex);
            });
        }
        
        // Auto-rotate testimonials every 5 seconds
        setInterval(() => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(currentIndex);
        }, 5000);
        
        /**
         * Display testimonial at specified index
         * @param {number} index - Index of testimonial to show
         */
        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                if (i === index) {
                    testimonial.classList.add('active');
                } else {
                    testimonial.classList.remove('active');
                }
            });
        }
    }
}

/**
 * Initialize payment form functionality
 * Handles Stripe integration for payment processing
 */
function initPayment() {
    const paymentForm = document.querySelector('#payment-form');
    
    if (paymentForm && window.Stripe) {
        const stripe = Stripe('pk_test_your_publishable_key');
        const elements = stripe.elements();
        
        // Create card element with custom styling
        const cardElement = elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#32325d',
                    fontFamily: '"Open Sans", sans-serif',
                    '::placeholder': {
                        color: '#aab7c4'
                    }
                },
                invalid: {
                    color: '#fa755a',
                    iconColor: '#fa755a'
                }
            }
        });
        
        // Mount card element to DOM
        cardElement.mount('#card-element');
        
        // Handle real-time validation errors
        cardElement.addEventListener('change', function(event) {
            const displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
        
        // Handle form submission
        paymentForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const submitButton = paymentForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';
            
            // Create payment method and handle result
            stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value
                }
            }).then(function(result) {
                if (result.error) {
                    // Show error to customer
                    const errorElement = document.getElementById('card-errors');
                    errorElement.textContent = result.error.message;
                    submitButton.disabled = false;
                    submitButton.textContent = 'Pay Now';
                } else {
                    // Simulate successful payment (replace with actual payment confirmation)
                    setTimeout(() => {
                        const paymentContainer = document.querySelector('.payment-container');
                        const successMessage = document.createElement('div');
                        successMessage.className = 'payment-success';
                        successMessage.innerHTML = `
                            <h3>Payment Successful!</h3>
                            <p>Thank you for your payment. A confirmation has been sent to your email.</p>
                            <p>Transaction ID: ${generateTransactionId()}</p>
                        `;
                        paymentContainer.innerHTML = '';
                        paymentContainer.appendChild(successMessage);
                    }, 2000);
                }
            });
        });
    }
}

/**
 * Generate random transaction ID for payment confirmation
 * @return {string} - Random transaction ID
 */
function generateTransactionId() {
    return 'TRX' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Initialize testimonial slider and payment form on window load
window.addEventListener('load', function() {
    initTestimonialSlider();
    if (document.querySelector('#payment-form')) {
        initPayment();
    }
});



// Interactive Technician Section Logic
document.addEventListener('DOMContentLoaded', () => {
    const hotspots = document.querySelectorAll('.interactive-tech-section .hotspot');
    const infoBox = document.getElementById('info-box');
    const infoText = document.getElementById('info-text');
    const closeInfoButton = document.getElementById('close-info');

    if (hotspots.length > 0 && infoBox && infoText && closeInfoButton) {
        hotspots.forEach(hotspot => {
            hotspot.addEventListener('click', () => {
                const info = hotspot.getAttribute('data-info');
                if (info) {
                    infoText.textContent = info;
                    infoBox.classList.add('visible');
                }
            });
        });

        closeInfoButton.addEventListener('click', () => {
            infoBox.classList.remove('visible');
        });

        // Optional: Close info box if clicked outside
        document.addEventListener('click', (event) => {
            // Check if the click is outside the infoBox and not on a hotspot
            if (!infoBox.contains(event.target) && ![...hotspots].some(h => h.contains(event.target))) {
                if (infoBox.classList.contains('visible')) {
                    infoBox.classList.remove('visible');
                }
            }
        });
    }
});

