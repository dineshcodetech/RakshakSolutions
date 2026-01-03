/* ============================================
   RAKSHAK SOLUTIONS - INTERACTIVE SCRIPTS
   ============================================ */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function () {
    initPreloader();
    initNavigation();
    initParticles();
    initSmokeEffect();
    initScrollAnimations();
    initCounterAnimation();
    initFormHandling();
});

/* ============================================
   PRELOADER
   ============================================ */
function initPreloader() {
    const preloader = document.getElementById('preloader');

    window.addEventListener('load', function () {
        // Increased delay to allow the cinematic animation to complete
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'auto';
            document.body.classList.add('loaded');

            // Start hero animations after preloader
            animateHeroElements();
        }, 5000);
    });
}

function animateHeroElements() {
    // Elements will animate via CSS with animation-delay
    // This function can trigger additional JS animations if needed
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
    navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

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
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll & close mobile menu
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            // Close mobile menu
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
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
        { selector: '.service-card', class: 'reveal' },
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
                submitBtn.querySelector('.btn-text').textContent = 'Message Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)';

                // Reset form
                form.reset();

                setTimeout(() => {
                    submitBtn.querySelector('.btn-text').textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });

        // Input focus animations
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function () {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function () {
                this.parentElement.classList.remove('focused');
            });
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

    const rings = document.querySelectorAll('.energy-ring');
    rings.forEach((ring, index) => {
        const factor = (index + 1) * 0.3;
        ring.style.transform = `translate(calc(-50% + ${x * factor}px), calc(-50% + ${y * factor}px))`;
    });

    const shield = document.querySelector('.inline-shield');
    if (shield) {
        shield.style.transform = `translateY(${Math.sin(Date.now() / 500) * 10}px) rotateY(${x * 0.5}deg) rotateX(${-y * 0.5}deg)`;
    }
});

/* ============================================
   LENS FLARE EFFECT
   ============================================ */
function createLensFlare() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const flare = document.createElement('div');
    flare.className = 'lens-flare';
    flare.style.cssText = `
        position: absolute;
        width: 200px;
        height: 4px;
        background: linear-gradient(90deg, transparent, rgba(79, 195, 247, 0.3), rgba(79, 195, 247, 0.8), rgba(79, 195, 247, 0.3), transparent);
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        animation: flareMove 8s ease-in-out infinite;
    `;

    hero.appendChild(flare);

    // Add CSS animation dynamically
    if (!document.querySelector('#flare-style')) {
        const style = document.createElement('style');
        style.id = 'flare-style';
        style.textContent = `
            @keyframes flareMove {
                0%, 100% { transform: translate(-50%, -50%) rotate(0deg) scale(0.5); opacity: 0; }
                25% { transform: translate(-50%, -50%) rotate(15deg) scale(1); opacity: 1; }
                50% { transform: translate(-50%, -50%) rotate(-10deg) scale(0.8); opacity: 0.5; }
                75% { transform: translate(-50%, -50%) rotate(5deg) scale(1.2); opacity: 0.8; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize lens flare after page load
window.addEventListener('load', () => {
    setTimeout(createLensFlare, 3000);
});

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

