/* ============================================
   LITTLE FARM - Website JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.getElementById('navbar');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // ==========================================
    // MOBILE NAVIGATION TOGGLE
    // ==========================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        navMenu.classList.toggle('open');
        navToggle.classList.toggle('active');
    };

    navToggle.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            navToggle.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            navToggle.classList.remove('active');
        }
    });

    // ==========================================
    // TESTIMONIAL CAROUSEL
    // ==========================================
    const testimonials = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');
    let currentIndex = 0;
    let autoPlayInterval;

    // Create dots
    testimonials.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
        dot.addEventListener('click', () => goToTestimonial(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dot');

    const showTestimonial = (index) => {
        testimonials.forEach(t => t.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    };

    const goToTestimonial = (index) => {
        showTestimonial(index);
        resetAutoPlay();
    };

    const nextTestimonial = () => {
        const nextIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(nextIndex);
    };

    const prevTestimonial = () => {
        const prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(prevIndex);
    };

    const startAutoPlay = () => {
        autoPlayInterval = setInterval(nextTestimonial, 6000);
    };

    const resetAutoPlay = () => {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    };

    nextBtn.addEventListener('click', () => {
        nextTestimonial();
        resetAutoPlay();
    });

    prevBtn.addEventListener('click', () => {
        prevTestimonial();
        resetAutoPlay();
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    const carousel = document.querySelector('.testimonials-carousel');

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextTestimonial();
            } else {
                prevTestimonial();
            }
            resetAutoPlay();
        }
    }, { passive: true });

    startAutoPlay();

    // ==========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ==========================================
    // CONTACT FORM HANDLING
    // ==========================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            // Simple validation
            const name = contactForm.querySelector('#name').value.trim();
            const email = contactForm.querySelector('#email').value.trim();
            const service = contactForm.querySelector('#service').value;
            const message = contactForm.querySelector('#message').value.trim();

            if (!name || !email || !service || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate form submission
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // ==========================================
    // NOTIFICATION HELPER
    // ==========================================
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;

        // Styles
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            padding: '16px 24px',
            borderRadius: '12px',
            fontFamily: "'Nunito', sans-serif",
            fontSize: '0.95rem',
            fontWeight: '600',
            color: 'white',
            zIndex: '9999',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            animation: 'slideInUp 0.4s ease',
            maxWidth: '400px',
        });

        if (type === 'success') {
            notification.style.background = '#5B8C3E';
        } else if (type === 'error') {
            notification.style.background = '#E74C3C';
        } else {
            notification.style.background = '#2D3436';
        }

        const closeBtn = notification.querySelector('.notification-close');
        Object.assign(closeBtn.style, {
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.3rem',
            cursor: 'pointer',
            fontWeight: '700',
            padding: '0',
            lineHeight: '1',
        });

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(10px)';
                notification.style.transition = 'all 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Make showNotification available globally for inline onclick
    window.showNotification = showNotification;

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ==========================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ==========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections for scroll animation
    document.querySelectorAll(
        '.about-content, .about-image, .service-card, .facility-card, .contact-info, .contact-form-wrapper'
    ).forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add animate-in styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }
    `;
    document.head.appendChild(style);

});
