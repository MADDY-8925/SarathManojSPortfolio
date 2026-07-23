// =====================================================
// SARATH M S — Portfolio JavaScript
// Premium Animations, Transitions & Interactions
// =====================================================

// Initialize theme before DOM renders to prevent flash
(function() {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

document.addEventListener('DOMContentLoaded', () => {
    // ===================== THEME TOGGLE =====================
    const themeToggle = document.getElementById('themeToggle');
    
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
    }

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
    });
    // ===================== ULTRA-ELEGANT LUXURY PRELOADER =====================
    const preloader = document.getElementById('preloader');
    const loaderBar = document.getElementById('loaderBar');
    const preloaderAmbient = document.getElementById('preloaderAmbient');

    // Soft subtle ambient glow following cursor
    if (preloader && preloaderAmbient) {
        preloader.addEventListener('mousemove', (e) => {
            const x = e.clientX - window.innerWidth / 2;
            const y = e.clientY - window.innerHeight / 2;
            preloaderAmbient.style.transform = `translate(calc(-50% + ${x * 0.15}px), calc(-50% + ${y * 0.15}px))`;
        });
    }

    // Dismiss Preloader Helper
    function dismissPreloader() {
        if (preloader && !preloader.classList.contains('loaded')) {
            preloader.classList.add('loaded');
            document.body.classList.add('loaded');
            initAnimations();
        }
    }

    // Smooth Hairline Progress (1.8s)
    let progressStartTime = performance.now();
    const duration = 1800;

    function updatePreloaderProgress(time) {
        const elapsed = time - progressStartTime;
        const rawProgress = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - rawProgress, 4); // smooth quart out

        if (loaderBar) loaderBar.style.width = (eased * 100) + '%';

        if (rawProgress < 1) {
            requestAnimationFrame(updatePreloaderProgress);
        } else {
            setTimeout(dismissPreloader, 200);
        }
    }

    requestAnimationFrame(updatePreloaderProgress);

    // ===================== CUSTOM CURSOR =====================
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    // Only enable custom cursor on non-touch devices
    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.transform = `translate(${mouseX - 5}px, ${mouseY - 5}px)`;
        });

        function animateFollower() {
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;
            follower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Cursor interactions
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .filter-btn, .expertise-tag, .nav-toggle, input, textarea');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                follower.classList.add('follower-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                follower.classList.remove('follower-hover');
            });
        });
    } else {
        cursor.style.display = 'none';
        follower.style.display = 'none';
    }

    // ===================== NAVIGATION =====================
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Nav background
        if (scrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Hide/show nav on scroll direction
        if (scrollY > lastScrollY && scrollY > 200) {
            nav.classList.add('nav-hidden');
        } else {
            nav.classList.remove('nav-hidden');
        }
        lastScrollY = scrollY;

        // Update section indicator
        updateSectionIndicator();
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Smooth scroll with page transition for hash anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);

                // Close mobile menu
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');

                if (targetSection) {
                    // Trigger page transition
                    triggerPageTransition(() => {
                        targetSection.scrollIntoView({ behavior: 'auto' });
                    });
                }
            }
        });
    });

    // ===================== PAGE TRANSITION =====================
    const pageTransition = document.getElementById('pageTransition');

    function triggerPageTransition(callback) {
        pageTransition.classList.add('active');

        setTimeout(() => {
            if (callback) callback();
        }, 600);

        setTimeout(() => {
            pageTransition.classList.remove('active');
        }, 1200);
    }

    // ===================== SECTION INDICATOR =====================
    const indicatorDots = document.querySelectorAll('.indicator-dot');
    const sections = document.querySelectorAll('.section');

    function updateSectionIndicator() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });

        indicatorDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.dataset.target === current) {
                dot.classList.add('active');
            }
        });
    }

    indicatorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const target = document.getElementById(dot.dataset.target);
            triggerPageTransition(() => {
                target.scrollIntoView({ behavior: 'auto' });
            });
        });
    });

    // ===================== SCROLL REVEAL ANIMATIONS =====================
    function initAnimations() {
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .section');

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = getComputedStyle(entry.target).getPropertyValue('--delay') || '0s';
                    const delayMs = parseFloat(delay) * 1000;

                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delayMs);

                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
    }

    // ===================== STAT COUNTER ANIMATION =====================
    function animateCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.target);
                    const duration = 2000;
                    const start = performance.now();

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - start;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        entry.target.textContent = Math.floor(eased * target);

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            entry.target.textContent = target;
                        }
                    }
                    requestAnimationFrame(updateCounter);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(num => counterObserver.observe(num));
    }
    animateCounters();

    // ===================== SKILLS CIRCLE ANIMATION =====================
    function animateSkillCircles() {
        const softwareItems = document.querySelectorAll('.software-item');
        const circleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const percent = parseInt(entry.target.dataset.percent);
                    const circle = entry.target.querySelector('.ring-fill');
                    const circumference = 2 * Math.PI * 52;
                    const offset = circumference - (percent / 100) * circumference;

                    circle.style.strokeDasharray = circumference;
                    circle.style.strokeDashoffset = circumference;

                    // Trigger animation
                    setTimeout(() => {
                        circle.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)';
                        circle.style.strokeDashoffset = offset;
                    }, 200);

                    circleObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        softwareItems.forEach(item => circleObserver.observe(item));
    }
    animateSkillCircles();

    // ===================== PROJECT FILTERS =====================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            projectCards.forEach((card, index) => {
                const category = card.dataset.category || '';
                if (filter === 'all' || category.includes(filter)) {
                    card.style.transitionDelay = `${index * 0.05}s`;
                    card.classList.remove('hidden');
                    card.classList.add('visible');
                } else {
                    card.style.transitionDelay = '0s';
                    card.classList.add('hidden');
                    card.classList.remove('visible');
                }
            });
        });
    });

    // ===================== CONTACT FORM =====================
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('formSubmit');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitBtn.classList.add('submitted');
        submitBtn.querySelector('.submit-text').textContent = 'Message Sent!';

        setTimeout(() => {
            submitBtn.classList.remove('submitted');
            submitBtn.querySelector('.submit-text').textContent = 'Send Message';
            contactForm.reset();
        }, 3000);
    });

    // ===================== PARALLAX EFFECT =====================
    const heroBg = document.querySelector('.hero-bg');
    window.addEventListener('scroll', () => {
        if (heroBg) {
            const scrollY = window.scrollY;
            const heroHeight = document.getElementById('hero').offsetHeight;
            if (scrollY < heroHeight) {
                heroBg.style.transform = `translateY(${scrollY * 0.4}px) scale(1.1)`;
            }
        }
    });

    // ===================== TIMELINE LINE DRAW =====================
    function animateTimeline() {
        const timelineLine = document.querySelector('.timeline-line');
        if (!timelineLine) return;

        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    timelineLine.classList.add('animate');
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        timelineObserver.observe(timelineLine);
    }
    animateTimeline();

    // ===================== MAGNETIC HOVER EFFECT =====================
    document.querySelectorAll('.social-link, .filter-btn').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });

    // ===================== TILT EFFECT ON PROJECT CARDS =====================
    document.querySelectorAll('.project-image-wrapper').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const tiltX = (y - 0.5) * 10;
            const tiltY = (x - 0.5) * -10;
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ===================== SMOOTH SCROLL FOR LOGO =====================
    document.querySelector('.nav-logo').addEventListener('click', (e) => {
        e.preventDefault();
        triggerPageTransition(() => {
            window.scrollTo({ top: 0, behavior: 'auto' });
        });
    });

    // ===================== SCROLL INDICATOR HIDE =====================
    const scrollIndicator = document.getElementById('scrollIndicator');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            scrollIndicator.classList.add('hidden');
        } else {
            scrollIndicator.classList.remove('hidden');
        }
    });

    // ===================== EXPERTISE TAG STAGGER =====================
    const expertiseTags = document.querySelectorAll('.expertise-tag');
    expertiseTags.forEach((tag, i) => {
        tag.style.setProperty('--delay', `${i * 0.08}s`);
    });

    // ===================== TEXT SCRAMBLE EFFECT ON HERO =====================
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }

        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }

        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.chars[Math.floor(Math.random() * this.chars.length)];
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble-char">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
    }

    // Apply scramble effect on hero subtitle roles
    setTimeout(() => {
        const roles = document.querySelectorAll('.subtitle-role');
        roles.forEach((role, i) => {
            const fx = new TextScramble(role);
            const originalText = role.textContent;
            setTimeout(() => {
                role.textContent = '';
                fx.setText(originalText);
            }, 1500 + i * 400);
        });
    }, 1000);

    // ===================== SMOOTH SCROLL BEHAVIOR =====================
    // Add smooth scroll behavior for hash links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Only prevent default if not already handled
            if (!this.classList.contains('nav-link') && !this.classList.contains('mobile-link') && !this.classList.contains('nav-logo')) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // ===================== FLOATING PARTICLES (decorative) =====================
    function createParticles() {
        const hero = document.getElementById('hero');
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particles';
        hero.appendChild(particleContainer);

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                animation-delay: ${Math.random() * 6}s;
                animation-duration: ${Math.random() * 8 + 6}s;
            `;
            particleContainer.appendChild(particle);
        }
    }
    createParticles();
});
