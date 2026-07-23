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
    // ===================== FRESH ARCHITECTURAL CAD BLUEPRINT PRELOADER =====================
    const preloader = document.getElementById('preloader');
    const preloaderCanvas = document.getElementById('preloaderCanvas');
    const preloaderInner = document.getElementById('preloaderInner');
    const hudCoords = document.getElementById('hudCoords');
    const loaderPercent = document.getElementById('loaderPercent');
    const loaderBar = document.getElementById('loaderBar');
    const loaderStatus = document.getElementById('loaderStatus');

    if (preloaderCanvas && preloader) {
        const ctx = preloaderCanvas.getContext('2d');
        let width = preloaderCanvas.width = window.innerWidth;
        let height = preloaderCanvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            if (!preloader.classList.contains('loaded')) {
                width = preloaderCanvas.width = window.innerWidth;
                height = preloaderCanvas.height = window.innerHeight;
            }
        });

        // 3D Architectural Wireframe Structure Definition
        const vertices = [
            // Outer Prism
            {x: -1, y: -1, z: -1}, {x: 1, y: -1, z: -1},
            {x: 1, y: 1, z: -1},  {x: -1, y: 1, z: -1},
            {x: -1, y: -1, z: 1},  {x: 1, y: -1, z: 1},
            {x: 1, y: 1, z: 1},   {x: -1, y: 1, z: 1},
            // Inner Core
            {x: -0.5, y: -0.5, z: -0.5}, {x: 0.5, y: -0.5, z: -0.5},
            {x: 0.5, y: 0.5, z: -0.5},  {x: -0.5, y: 0.5, z: -0.5},
            {x: -0.5, y: -0.5, z: 0.5},  {x: 0.5, y: -0.5, z: 0.5},
            {x: 0.5, y: 0.5, z: 0.5},   {x: -0.5, y: 0.5, z: 0.5}
        ];

        const edges = [
            // Outer Box Edges
            [0,1], [1,2], [2,3], [3,0],
            [4,5], [5,6], [6,7], [7,4],
            [0,4], [1,5], [2,6], [3,7],
            // Inner Box Edges
            [8,9], [9,10], [10,11], [11,8],
            [12,13], [13,14], [14,15], [15,12],
            [8,12], [9,13], [10,14], [11,15],
            // Connecting Struts
            [0,8], [1,9], [2,10], [3,11],
            [4,12], [5,13], [6,14], [7,15]
        ];

        let rotX = 0.4, rotY = 0.6;
        let targetRotX = 0.4, targetRotY = 0.6;
        const cadPulses = [];
        const mouse = { x: width / 2, y: height / 2 };

        // Mouse interactions
        preloader.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;

            // HUD Coordinate Readout
            if (hudCoords) {
                hudCoords.textContent = `CURSOR: X: ${String(Math.round(e.clientX)).padStart(3, '0')} | Y: ${String(Math.round(e.clientY)).padStart(3, '0')}`;
            }

            // Tilt 3D Wireframe based on cursor
            targetRotY = 0.6 + (e.clientX / width - 0.5) * 1.5;
            targetRotX = 0.4 + (e.clientY / height - 0.5) * 1.5;

            // Subtle 3D Tilt on Inner Container
            if (preloaderInner) {
                const tiltX = (e.clientY / height - 0.5) * -10;
                const tiltY = (e.clientX / width - 0.5) * 10;
                preloaderInner.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            }
        });

        // Click Ripple Pulse
        preloader.addEventListener('click', (e) => {
            cadPulses.push({
                x: e.clientX,
                y: e.clientY,
                r: 0,
                maxR: Math.max(width, height) * 0.4,
                alpha: 1
            });
        });

        // 3D Point Projection Helper
        function project3D(x, y, z) {
            // Apply rotations
            const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
            const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

            // Y rotation
            let x1 = x * cosY - z * sinY;
            let z1 = z * cosY + x * sinY;
            let y1 = y;

            // X rotation
            let y2 = y1 * cosX - z1 * sinX;
            let z2 = z1 * cosX + y1 * sinX;

            const fov = 350;
            const distance = 4;
            const scale = fov / (distance + z2);

            return {
                x: width / 2 + x1 * scale * 1.6,
                y: height / 2 + y2 * scale * 1.6
            };
        }

        let animId;
        function renderCADCanvas() {
            if (preloader.classList.contains('loaded')) {
                cancelAnimationFrame(animId);
                return;
            }

            ctx.clearRect(0, 0, width, height);

            // Smooth 3D Rotation damping
            rotX += (targetRotX - rotX) * 0.05;
            rotY += (targetRotY - rotY) * 0.05;
            rotY += 0.005; // gentle continuous rotation

            // 1. Draw Architectural Blueprint CAD Grid
            const gridSize = 40;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.lineWidth = 1;
            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // 2. Draw Interactive CAD Mouse Crosshairs
            if (mouse.x !== null) {
                ctx.strokeStyle = 'rgba(201, 169, 110, 0.15)';
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(mouse.x, 0);
                ctx.lineTo(mouse.x, height);
                ctx.moveTo(0, mouse.y);
                ctx.lineTo(width, mouse.y);
                ctx.stroke();
                ctx.setLineDash([]);
            }

            // 3. Draw Click Pulse Rings
            for (let i = cadPulses.length - 1; i >= 0; i--) {
                const pulse = cadPulses[i];
                pulse.r += 6;
                pulse.alpha = Math.max(0, 1 - pulse.r / pulse.maxR);

                ctx.beginPath();
                ctx.arc(pulse.x, pulse.y, pulse.r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(201, 169, 110, ${pulse.alpha * 0.5})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                if (pulse.alpha <= 0) cadPulses.splice(i, 1);
            }

            // 4. Project & Render 3D Architectural Wireframe Structure
            const projected = vertices.map(v => project3D(v.x, v.y, v.z));

            // Render Edges
            ctx.lineWidth = 1.5;
            edges.forEach(([i1, i2]) => {
                const p1 = projected[i1];
                const p2 = projected[i2];

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = 'rgba(201, 169, 110, 0.4)';
                ctx.stroke();
            });

            // Render Node Points
            projected.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = '#c9a96e';
                ctx.shadowColor = '#c9a96e';
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            animId = requestAnimationFrame(renderCADCanvas);
        }

        renderCADCanvas();
    }

    // Dismiss Preloader Helper
    function dismissPreloader() {
        if (!preloader.classList.contains('loaded')) {
            preloader.classList.add('loaded');
            document.body.classList.add('loaded');
            initAnimations();
        }
    }

    // Smooth Architectural Progress Simulation (0% -> 100%)
    let progress = 0;
    const progressStartTime = performance.now();
    const duration = 2400; // 2.4 seconds smooth loading

    const statusSteps = [
        { pct: 0, text: 'INITIALIZING CAD WORKSPACE...' },
        { pct: 30, text: 'COMPILING BIM MODELS & SCHEMATICS...' },
        { pct: 65, text: 'RENDERING PHOTOREALISTIC ENVIRONMENTS...' },
        { pct: 90, text: 'FINALIZING DESIGN SYSTEM...' },
        { pct: 100, text: 'SYSTEM READY • WELCOME' }
    ];

    function updatePreloaderProgress(time) {
        const elapsed = time - progressStartTime;
        const rawProgress = Math.min(1, elapsed / duration);
        // Easing cubic out
        const eased = 1 - Math.pow(1 - rawProgress, 3);
        progress = Math.round(eased * 100);

        if (loaderPercent) loaderPercent.textContent = String(progress).padStart(2, '0');
        if (loaderBar) loaderBar.style.width = progress + '%';

        // Update status text
        if (loaderStatus) {
            for (let i = statusSteps.length - 1; i >= 0; i--) {
                if (progress >= statusSteps[i].pct) {
                    loaderStatus.textContent = statusSteps[i].text;
                    break;
                }
            }
        }

        if (rawProgress < 1) {
            requestAnimationFrame(updatePreloaderProgress);
        } else {
            setTimeout(dismissPreloader, 300);
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

    // Smooth scroll with page transition
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            // Close mobile menu
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');

            // Trigger page transition
            triggerPageTransition(() => {
                targetSection.scrollIntoView({ behavior: 'auto' });
            });
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
