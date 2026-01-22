/* ============================================
   RAKSHAK SOLUTIONS - INTERACTIVE SCRIPTS
   ============================================ */

// Global state
let loadingProgress = 0;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function () {
    initCursorGlow();
    initPreloader();
    initNavigation();
    initParticles();
    // initSmokeEffect(); Removed center blue lighting
    initScrollAnimations();
    initCounterAnimation();
    initFormHandling();
    initVideoModal();
    initFlowerDiagram();
    initContactFab();
});

/* ============================================
   PRELOADER
   ============================================ */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) {
        // We are on a subpage (like bioster.html), so we set the skip flag
        // for when the user navigates back to the home page.
        sessionStorage.setItem('skipPreloader', 'true');
        return;
    }

    const progressBar = document.querySelector('.loader-progress');
    const percentageText = document.querySelector('.loader-percentage');
    const statusText = document.querySelector('.loader-status');

    // Skip preloader ONLY if the flag is set (coming from a subpage)
    if (sessionStorage.getItem('skipPreloader')) {
        sessionStorage.removeItem('skipPreloader'); // Clear it so refresh shows preloader again
        preloader.style.display = 'none';
        preloader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        document.body.classList.add('loaded');
        animateHeroElements();
        return;
    }

    const statuses = [
        "INITIALIZING CORE ENGINE",
        "ESTABLISHING SECURE CONNECTION",
        "BYPASSING FIREWALLS",
        "DECRYPTING ASSETS",
        "SYNCING ATMOSPHERE"
    ];

    const interval = setInterval(() => {
        loadingProgress += Math.random() * 3; // Slightly faster for better UX
        if (loadingProgress > 100) {
            loadingProgress = 100;
            clearInterval(interval);
            finishLoading();
        }

        if (progressBar) progressBar.style.width = `${loadingProgress}%`;
        if (percentageText) percentageText.textContent = `${Math.floor(loadingProgress)}%`;

        // Update status text randomly
        if (statusText && Math.random() < 0.1) {
            statusText.textContent = statuses[Math.floor(Math.random() * statuses.length)];
        }
    }, 40);

    function finishLoading() {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'auto';
            document.body.classList.add('loaded');
            animateHeroElements();
            // Completely remove from DOM after fade out to ensure no interaction issues
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 800);
    }
}

function animateHeroElements() {
    // Smooth scroll to hash if present after preloader
    handleInitialHash();
}

function handleInitialHash() {
    if (window.location.hash) {
        const targetId = window.location.hash;
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            setTimeout(() => {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
}

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    let lastScroll = 0;

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function () {
        let current = '';
        const scrollPosition = window.pageYOffset + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}` || href === `index.html#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll & close mobile menu
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Only prevent default if it's an internal hash on the CURRENT page
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }

                // Close mobile menu
                if (navToggle) navToggle.classList.remove('active');
                if (navMenu) navMenu.classList.remove('active');
            }
        });
    });
}


/* ============================================
   PARTICLE SYSTEM
   ============================================ */
function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 80;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulsePhase = Math.random() * Math.PI * 2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.pulsePhase += this.pulseSpeed;

            // Wrap around screen
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * pulse, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(79, 195, 247, ${this.opacity * pulse})`;
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Draw connecting lines
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(79, 195, 247, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        drawConnections();
        requestAnimationFrame(animate);
    }

    animate();
}

/* ============================================
   SMOKE/ENERGY EFFECT
   ============================================ */
function initSmokeEffect() {
    const canvas = document.getElementById('smoke');
    const ctx = canvas.getContext('2d');

    let smokeParticles = [];
    const maxParticles = 50;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class SmokeParticle {
        constructor() {
            this.reset();
        }

        reset() {
            // Start from center
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            this.x = centerX + (Math.random() - 0.5) * 200;
            this.y = centerY + (Math.random() - 0.5) * 200;
            this.size = Math.random() * 100 + 50;
            this.speedX = (Math.random() - 0.5) * 2;
            this.speedY = (Math.random() - 0.5) * 2;
            this.opacity = 0;
            this.maxOpacity = Math.random() * 0.15 + 0.05;
            this.fadeIn = true;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
            this.life = 0;
            this.maxLife = Math.random() * 200 + 100;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            this.size += 0.5;
            this.life++;

            // Fade in/out
            if (this.fadeIn) {
                this.opacity += 0.005;
                if (this.opacity >= this.maxOpacity) {
                    this.fadeIn = false;
                }
            } else {
                this.opacity -= 0.002;
            }

            // Reset when faded out or too old
            if (this.opacity <= 0 || this.life > this.maxLife) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);

            // Create smoke gradient
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
            gradient.addColorStop(0, `rgba(79, 195, 247, ${this.opacity * 0.5})`);
            gradient.addColorStop(0.5, `rgba(41, 182, 246, ${this.opacity * 0.3})`);
            gradient.addColorStop(1, 'rgba(79, 195, 247, 0)');

            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.restore();
        }
    }

    // Initialize smoke particles
    for (let i = 0; i < maxParticles; i++) {
        const particle = new SmokeParticle();
        particle.life = Math.random() * 100; // Stagger initial states
        smokeParticles.push(particle);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        smokeParticles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Add orange sparks occasionally
        if (Math.random() < 0.1) {
            drawSpark();
        }

        requestAnimationFrame(animate);
    }

    // Occasional orange spark effect
    function drawSpark() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const x = centerX + (Math.random() - 0.5) * 400;
        const y = centerY + (Math.random() - 0.5) * 300;
        const size = Math.random() * 3 + 1;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, ${Math.random() * 100 + 100}, 50, ${Math.random() * 0.5 + 0.3})`;
        ctx.fill();
    }

    animate();
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    // Add reveal classes to elements
    const revealElements = [
        { selector: '.section-header', class: 'reveal' },
        { selector: '.about-visual', class: 'reveal-left' },
        { selector: '.about-text', class: 'reveal-right' },
        { selector: '.product-card', class: 'reveal' },
        { selector: '.cert-card', class: 'reveal' },
        { selector: '.client-logo-item', class: 'reveal' },
        { selector: '.team-card', class: 'reveal' },
        { selector: '.contact-info', class: 'reveal-left' },
        { selector: '.contact-form-container', class: 'reveal-right' }
    ];

    revealElements.forEach(item => {
        document.querySelectorAll(item.selector).forEach((el, index) => {
            el.classList.add(item.class);
            el.style.transitionDelay = `${index * 0.1}s`;
        });
    });

    // Intersection Observer for scroll reveal
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        observer.observe(el);
    });
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 60;
    const duration = 2000;
    const stepTime = duration / 60;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, stepTime);
}

/* ============================================
   FORM HANDLING
   ============================================ */
function initFormHandling() {
    const form = document.getElementById('contactForm');

    if (form) {
        const serviceSelect = document.getElementById('service');
        const messageTextarea = document.getElementById('message');

        // Pre-fill message based on service selection
        if (serviceSelect && messageTextarea) {
            serviceSelect.addEventListener('change', function() {
                const service = this.value;
                let defaultMessage = "";

                if (service === 'demo') {
                    defaultMessage = "Hello! I am interested in experiencing your product. Can you tell me more?";
                } else if (service === 'reseller') {
                    defaultMessage = "Hello! I am interested in becoming a reseller of your products. Can you tell me more?";
                }

                // If user hasn't typed anything custom or the field matches another default, update it
                const currentVal = messageTextarea.value.trim();
                const defaults = [
                    "Hello! I am interested in experiencing your product. Can you tell me more?",
                    "Hello! I am interested in becoming a reseller of your products. Can you tell me more?",
                    ""
                ];
                
                if (defaults.includes(currentVal) || currentVal === "") {
                    messageTextarea.value = defaultMessage;
                    // Trigger focus animation if needed or just handle via CSS
                    if (defaultMessage) {
                        messageTextarea.parentElement.classList.add('focused');
                    } else {
                        messageTextarea.parentElement.classList.remove('focused');
                    }
                }
            });
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Simulate form submission
            const submitBtn = form.querySelector('.form-submit');
            const originalText = submitBtn.querySelector('.btn-text').textContent;

            submitBtn.querySelector('.btn-text').textContent = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Map service values to readable labels
                const serviceLabels = {
                    'demo': 'Product Demo',
                    'reseller': 'Reseller Partnership',
                    'general': 'General Inquiry'
                };
                const serviceDisplay = serviceLabels[data.service] || data.service;

                // Construct WhatsApp Message
                // We use the textarea content directly as the user sees it
                const userMessage = data.message || 'No additional message';

                const message = `${userMessage}%0A%0A` +
                    `*-- User Details --*%0A` +
                    `*Name:* ${data.firstName} ${data.lastName}%0A` +
                    `*Email:* ${data.email}%0A` +
                    `*Phone:* ${data.phone || 'Not provided'}%0A` +
                    `*Inquiry Type:* ${serviceDisplay}`;

                const whatsappUrl = `https://wa.me/918886234101?text=${message}`;

                submitBtn.querySelector('.btn-text').textContent = 'Redirecting to WhatsApp...';
                submitBtn.style.background = 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)';

                // Open WhatsApp in a new tab
                window.open(whatsappUrl, '_blank');

                // Reset form
                form.reset();
                messageTextarea.parentElement.classList.remove('focused');

                setTimeout(() => {
                    submitBtn.querySelector('.btn-text').textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1000);
        });

        // Input focus animations
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function () {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function () {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            // Check initial state
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });
    }
}

/* ============================================
   MOUSE PARALLAX EFFECT (Hero Section)
   ============================================ */
document.addEventListener('mousemove', function (e) {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const rect = hero.getBoundingClientRect();
    if (e.clientY > rect.bottom) return;

    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;



    const shield = document.querySelector('.inline-shield');
    if (shield) {
        shield.style.transform = `translateY(${Math.sin(Date.now() / 500) * 10}px) rotateY(${x * 0.5}deg) rotateX(${-y * 0.5}deg)`;
    }
});

// Lens flare removed - migrating focus to reactive cursor follow

/* ============================================
   SMOOTH SCROLL POLYFILL FOR OLDER BROWSERS
   ============================================ */
if (!('scrollBehavior' in document.documentElement.style)) {
    // Simple smooth scroll fallback
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   SERVICE CARD HOVER EFFECTS
   ============================================ */
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function (e) {
        const glow = this.querySelector('.card-glow');
        if (glow) {
            glow.style.opacity = '1';
        }
    });

    card.addEventListener('mouseleave', function (e) {
        const glow = this.querySelector('.card-glow');
        if (glow) {
            glow.style.opacity = '0';
        }
    });

    card.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = '';
    });
});

/* ============================================
   TYPING EFFECT FOR HERO (Optional Enhancement)
   ============================================ */
function initTypingEffect() {
    const taglineWords = document.querySelectorAll('.tagline-word');

    taglineWords.forEach((word, index) => {
        word.style.opacity = '0';
        setTimeout(() => {
            word.style.opacity = '1';
            word.style.animation = 'taglineReveal 0.5s ease forwards';
        }, 1500 + (index * 300));
    });
}

// Call after preloader
setTimeout(initTypingEffect, 2500);

/* ============================================
   CURSOR GLOW & FOLLOW LOGIC (CRAZY PREMIUM)
   ============================================ */
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    const outer = document.getElementById('cursor-outer');

    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;
    let outerX = 0;
    let outerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        // Advanced Smooth lerp for glow (organic follow)
        // We use slightly different friction for X and Y to create a "floating" feel
        glowX += (mouseX - glowX) * 0.04;
        glowY += (mouseY - glowY) * 0.04;

        // Intensify based on velocity
        const dx = mouseX - glowX;
        const dy = mouseY - glowY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const scale = 1 + Math.min(dist / 500, 0.5);

        glow.style.transform = `translate(calc(-50% + ${glowX}px), calc(-50% + ${glowY}px)) scale(${scale})`;
        glow.style.opacity = loadingProgress >= 100 ? 1 : 0; // Only show after preloader

        // Faster lerp for outer ring
        outerX += (mouseX - outerX) * 0.12;
        outerY += (mouseY - outerY) * 0.12;
        outer.style.left = `${outerX}px`;
        outer.style.top = `${outerY}px`;

        requestAnimationFrame(animate);
    }

    animate();

    // Add pointer events for hover states
    const interactiveElements = document.querySelectorAll('a, button, .product-card, .nav-toggle');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });
}
/* ============================================
   VIDEO MODAL LOGIC (PERFORMANCE OPTIMIZED)
   ============================================ */
function initVideoModal() {
    const modal = document.getElementById('videoModal');
    const triggers = document.querySelectorAll('.video-trigger');
    const closeBtn = document.querySelector('.modal-close');
    const overlay = document.querySelector('.modal-overlay');
    const video = document.getElementById('modalVideo');
    const videoSource = video.querySelector('source');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', function () {
            const videoUrl = this.getAttribute('data-video');

            // Set source and load only when requested (Performance)
            videoSource.src = videoUrl;
            video.load();

            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scroll

            // Auto play if possible
            video.play().catch(e => console.log("Auto-play blocked, waiting for user interaction"));
        });
    });

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        video.pause();
        videoSource.src = ''; // Clear source to free up memory
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}
/* ============================================
   BIOSTER FLOWER DIAGRAM INTERACTION
   ============================================ */
function initFlowerDiagram() {
    const diagram = document.getElementById('flower-diagram');
    if (!diagram) return;

    const petals = diagram.querySelectorAll('.petal');
    const label = document.getElementById('petal-label');
    const cards = document.querySelectorAll('.app-item');

    // Petal Interaction
    petals.forEach(petal => {
        petal.addEventListener('mouseenter', function () {
            const targetId = this.getAttribute('data-target');
            const labelText = this.getAttribute('data-label');
            const targetCard = document.getElementById(targetId);

            if (targetCard) targetCard.classList.add('highlight-active');
            if (label) {
                label.textContent = labelText;
                label.classList.add('active');
            }
        });

        petal.addEventListener('mouseleave', function () {
            const targetId = this.getAttribute('data-target');
            const targetCard = document.getElementById(targetId);

            if (targetCard) targetCard.classList.remove('highlight-active');
            if (label && !diagram.querySelector('.petal-persistent')) {
                label.classList.remove('active');
            }
        });

        petal.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const targetCard = document.getElementById(targetId);

            // Clear previous persistent states
            cards.forEach(c => c.classList.remove('highlight-persistent'));
            petals.forEach(p => p.classList.remove('petal-persistent'));

            // Set new persistent state
            if (targetCard) {
                targetCard.classList.add('highlight-persistent');
                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Add a temporary focal pulse
                targetCard.style.animation = 'none';
                targetCard.offsetHeight; // trigger reflow
                targetCard.style.animation = 'cardFocalPulse 1s ease-out';
            }
            this.classList.add('petal-persistent');
        });
    });

    // Card Interaction
    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            const cardId = this.getAttribute('id');
            const targetPetal = document.querySelector(`.petal[data-target="${cardId}"]`);
            if (targetPetal) targetPetal.classList.add('petal-highlight');
        });

        card.addEventListener('mouseleave', function () {
            const cardId = this.getAttribute('id');
            const targetPetal = document.querySelector(`.petal[data-target="${cardId}"]`);
            if (targetPetal) targetPetal.classList.remove('petal-highlight');
        });

        card.addEventListener('click', function () {
            const cardId = this.getAttribute('id');
            const targetPetal = document.querySelector(`.petal[data-target="${cardId}"]`);

            cards.forEach(c => c.classList.remove('highlight-persistent'));
            petals.forEach(p => p.classList.remove('petal-persistent'));

            this.classList.add('highlight-persistent');
            if (targetPetal) targetPetal.classList.add('petal-persistent');
        });
    });
}

/* ============================================
   FLOATING ACTION BUTTON (FAB) LOGIC
   ============================================ */
function initContactFab() {
    const fabContainer = document.getElementById('contactFab');
    const fabMain = document.getElementById('fabMain');
    
    if (!fabContainer || !fabMain) return;

    fabMain.addEventListener('click', (e) => {
        e.stopPropagation();
        fabContainer.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!fabContainer.contains(e.target)) {
            fabContainer.classList.remove('active');
        }
    });

    // Close menu on scroll
    window.addEventListener('scroll', () => {
        if (fabContainer.classList.contains('active')) {
            fabContainer.classList.remove('active');
        }
    }, { passive: true });
}


