/**
 * FAQ functionality for Pentariver website
 * Handles the accordion-style FAQ section with expand/collapse functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize FAQ functionality when DOM is fully loaded
    initFAQ();
});

/**
 * Initialize FAQ accordion functionality
 * Sets up click handlers for expanding/collapsing FAQ items and toggling icons
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                // Toggle active class on FAQ item
                item.classList.toggle('active');
                
                // Update icon if present (plus/minus toggle)
                const icon = question.querySelector('i');
                if (icon) {
                    if (item.classList.contains('active')) {
                        icon.classList.remove('fa-plus');
                        icon.classList.add('fa-minus');
                    } else {
                        icon.classList.remove('fa-minus');
                        icon.classList.add('fa-plus');
                    }
                }
            });
        }
    });
}
