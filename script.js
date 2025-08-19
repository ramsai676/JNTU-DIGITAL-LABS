// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then((registration) => {
                console.log('✅ Service Worker registered successfully:', registration.scope);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content is available
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch((error) => {
                console.error('❌ Service Worker registration failed:', error);
            });
    });
}

// Show update notification
function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <div class="update-content">
            <span>🔄 New version available!</span>
            <button onclick="location.reload()">Update Now</button>
            <button onclick="this.parentElement.parentElement.remove()">Later</button>
        </div>
    `;
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 10000);
}

// PWA Install Prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallPrompt();
});

function showInstallPrompt() {
    const installButton = document.createElement('div');
    installButton.className = 'install-prompt';
    installButton.innerHTML = `
        <div class="install-content">
            <span>📱 Install JNTU Digital Labs</span>
            <button onclick="installApp()">Install</button>
            <button onclick="this.parentElement.parentElement.remove()">Not Now</button>
        </div>
    `;
    document.body.appendChild(installButton);
    
    // Auto-remove after 15 seconds
    setTimeout(() => {
        if (installButton.parentElement) {
            installButton.remove();
        }
    }, 15000);
}

function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('✅ User accepted the install prompt');
            } else {
                console.log('❌ User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 JNTU Digital Labs - Enhanced JavaScript Loading...');

    // --- PART 1: DYNAMIC LAB CARD INJECTION (Homepage only) ---
    const labGrid = document.querySelector('.lab-grid');
    const fallbackContent = document.querySelector('.lab-grid-fallback');
    
    if (labGrid) {
        // Show fallback content initially
        if (fallbackContent) {
            fallbackContent.style.display = 'block';
        }
        
        const labs = [
            { 
                name: 'Applied Physics Laboratory', 
                desc: 'Explore wave optics, mechanics, and electromagnetism experiments with interactive simulations.', 
                url: 'physics-lab.html', 
                icon: '🔬',
                color: '#6366f1'
            },
            { 
                name: 'Engineering Chemistry Laboratory', 
                desc: 'Practice with virtual titrations, reactions, and molecular structures in a safe environment.', 
                url: 'chemistry-lab.html', 
                icon: '🧪',
                color: '#8b5cf6'
            },
            { 
                name: 'Basic Electrical Engineering Lab', 
                desc: "Verify circuit laws and theorems like KVL, KCL, and Thevenin's with virtual components.", 
                url: 'bee-lab.html', 
                icon: '⚡',
                color: '#3b82f6'
            },
            { 
                name: 'Problem Solving Lab (PPS)', 
                desc: 'Write, compile, and test your C programs in a powerful online IDE with real-time feedback.', 
                url: 'pps-lab.html', 
                icon: '💻',
                color: '#06b6d4'
            },
            { 
                name: 'Python Programming Laboratory', 
                desc: 'Practice with data types, control flow, functions, and file operations in Python.', 
                url: 'python-lab.html', 
                icon: '🐍',
                color: '#f59e0b'
            },
            { 
                name: 'IT Workshop', 
                desc: 'Explore essential IT tools, hardware, and networking concepts with hands-on simulations.', 
                url: 'it-workshop.html', 
                icon: '🖥️',
                color: '#10b981'
            },
            { 
                name: 'ELCS Laboratory', 
                desc: 'Improve communication with phonetics, JAM sessions, and group discussions.', 
                url: 'elcs-lab.html', 
                icon: '🎤',
                color: '#ef4444'
            }
        ];
        
        labs.forEach((lab, index) => {
            const card = document.createElement('a');
            card.href = lab.url;
            card.className = 'card animate-fade-in';
            card.style.transitionDelay = `${index * 150}ms`;
            card.style.setProperty('--card-color', lab.color);
            card.innerHTML = `
                <div class="card-icon" style="color: ${lab.color}">${lab.icon}</div>
                <h2 class="card-title">${lab.name}</h2>
                <p class="card-description">${lab.desc}</p>
                <div class="card-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </div>
            `;
            labGrid.appendChild(card);
        });
        
        // Hide fallback content after cards are loaded
        if (fallbackContent) {
            fallbackContent.style.display = 'none';
        }
    } else if (fallbackContent) {
        // If labGrid doesn't exist, show fallback content
        fallbackContent.style.display = 'block';
    }
    
    // Fallback timeout - if cards don't load within 3 seconds, show fallback
    setTimeout(() => {
        if (labGrid && labGrid.children.length === 0 && fallbackContent) {
            fallbackContent.style.display = 'block';
        }
    }, 3000);

    // --- PART 2: VANTA.JS ANIMATED BACKGROUND (Homepage only) ---
    const vantaElement = document.getElementById('vanta-background');
    if (vantaElement) {
        // Set fallback background first
        vantaElement.style.background = 'var(--bg-gradient)';
        
        // Try to initialize Vanta.js after a short delay to ensure it's loaded
        setTimeout(() => {
            if (typeof VANTA !== 'undefined' && VANTA.WAVES) {
                try {
                    VANTA.WAVES({
                        el: "#vanta-background",
                        mouseControls: true,
                        touchControls: true,
                        gyroControls: false,
                        minHeight: 200.00,
                        minWidth: 200.00,
                        scale: 1.00,
                        scaleMobile: 1.00,
                        color: 0x6366f1,
                        shininess: 35.00,
                        waveHeight: 20.00,
                        waveSpeed: 0.85,
                        zoom: 0.9
                    });
                } catch (error) {
                    console.log('Vanta.js background failed to load, using fallback');
                    vantaElement.style.background = 'var(--bg-gradient)';
                }
            } else {
                console.log('Vanta.js not available, using fallback background');
                vantaElement.style.background = 'var(--bg-gradient)';
            }
        }, 500);
    }

    // --- PART 3: MOBILE MENU FUNCTIONALITY ---
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // --- PART 4: NAVBAR SCROLL EFFECT ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll (but not on mobile when menu is open)
            if (!navMenu || !navMenu.classList.contains('active')) {
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            }
            
            lastScrollY = currentScrollY;
        });
    }

    // --- PART 5: SCROLL REVEAL ANIMATIONS ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with animate-fade-in class
    document.querySelectorAll('.animate-fade-in').forEach(el => {
        observer.observe(el);
    });

    // --- PART 6: SMOOTH PAGE TRANSITIONS ---
    const pageLinks = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="http"]):not([href^="mailto:"]):not([href^="tel:"])');
    pageLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const url = this.href;
            if (url && !url.endsWith('#') && url !== window.location.href && !url.includes('#')) {
                e.preventDefault();
                
                // Add loading animation
                const loadingOverlay = document.createElement('div');
                loadingOverlay.className = 'loading-overlay';
                loadingOverlay.innerHTML = `
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <p>Loading...</p>
                    </div>
                `;
                document.body.appendChild(loadingOverlay);
                
                // Fade out current page
                document.body.style.opacity = '0';
                
                setTimeout(() => {
                    window.location.href = url;
                }, 300);
            }
        });
    });

    // --- PART 7: CARD HOVER EFFECTS ---
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // --- PART 8: PARALLAX EFFECT FOR HERO SECTION ---
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    // --- PART 9: TYPING ANIMATION FOR HERO TITLE ---
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && !heroTitle.dataset.animated) {
        heroTitle.dataset.animated = 'true';
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.opacity = '1';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 500);
    }

    // --- PART 10: EXPERIMENT LIST ENHANCEMENTS (Lab pages) ---
    const experimentLinks = document.querySelectorAll('.experiment-list a');
    experimentLinks.forEach((link, index) => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.03)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click feedback
        link.addEventListener('click', function(e) {
            if (this.getAttribute('target') === '_blank') {
                // Create ripple effect
                const ripple = document.createElement('div');
                ripple.className = 'ripple';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            }
        });
    });

    // --- PART 11: PERFORMANCE OPTIMIZATIONS ---
    // Lazy load images if any
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // --- PART 12: ACCESSIBILITY ENHANCEMENTS ---
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // --- PART 13: ERROR HANDLING ---
    window.addEventListener('error', (e) => {
        console.error('Page error:', e.error);
    });

    // --- PART 14: ANALYTICS READY (if needed) ---
    const trackEvent = (eventName, data = {}) => {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
        // Fallback to console for development
        console.log('Event tracked:', eventName, data);
    };

    // Track lab card clicks
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const labName = card.querySelector('.card-title').textContent;
            trackEvent('lab_card_click', { lab_name: labName });
        });
    });

    // Track experiment clicks
    experimentLinks.forEach(link => {
        link.addEventListener('click', () => {
            const experimentName = link.querySelector('h3')?.textContent || 'Unknown';
            trackEvent('experiment_click', { experiment_name: experimentName });
        });
    });

    // --- PART 15: BODY LOADING ANIMATION ---
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        // Hide loading indicator after a short delay
        setTimeout(() => {
            loadingIndicator.style.opacity = '0';
            setTimeout(() => {
                loadingIndicator.style.display = 'none';
            }, 500);
        }, 1000);
    }
    
    // Add loaded class to body after everything is ready
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // --- PART 16: ENHANCED BUTTON FUNCTIONALITY ---
    // Ensure smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Add active state to navigation
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    // Add click tracking for CTA buttons
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.querySelector('span')?.textContent || 'Unknown';
            trackEvent('cta_button_click', { button_text: buttonText });
        });
    });

    // Logo click to scroll to top
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Remove active states
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
        });
    }

    // Scroll-based navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
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
    }

    // --- PART 17: OFFLINE/ONLINE DETECTION ---
    function updateOnlineStatus() {
        if (navigator.onLine) {
            const offlineIndicator = document.querySelector('.offline-indicator');
            if (offlineIndicator) {
                offlineIndicator.remove();
            }
        } else {
            if (!document.querySelector('.offline-indicator')) {
                const offlineIndicator = document.createElement('div');
                offlineIndicator.className = 'offline-indicator';
                offlineIndicator.innerHTML = '📡 You are currently offline. Some features may be limited.';
                document.body.appendChild(offlineIndicator);
            }
        }
    }

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Check initial status
    updateOnlineStatus();

    // --- PART 18: PERFORMANCE MONITORING ---
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                console.log(`📊 Page load time: ${loadTime}ms`);
                
                // Track Core Web Vitals if available
                if ('web-vital' in window) {
                    // Core Web Vitals tracking
                    console.log('📊 Core Web Vitals tracking enabled');
                }
            }, 0);
        });
    }

    // --- PART 19: ERROR BOUNDARY ---
    window.addEventListener('error', (event) => {
        console.error('❌ Global error caught:', event.error);
        // You could send this to an analytics service
    });

    window.addEventListener('unhandledrejection', (event) => {
        console.error('❌ Unhandled promise rejection:', event.reason);
        // You could send this to an analytics service
    });

    console.log('🚀 JNTU Digital Labs - Enhanced JavaScript Loaded Successfully!');
    console.log('🔧 Version: 2.0 | PWA: Enabled | Service Worker: Active');
});

// --- ADDITIONAL STYLES FOR NEW FEATURES ---
const additionalStyles = `
    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(10, 10, 26, 0.95);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease-out;
    }

    .loading-spinner {
        text-align: center;
        color: var(--text-primary);
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(99, 102, 241, 0.3);
        border-top: 3px solid var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }

    .card-arrow {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        color: var(--text-secondary);
        transition: var(--transition);
        opacity: 0;
    }

    .card:hover .card-arrow {
        opacity: 1;
        transform: translateX(5px);
        color: var(--primary-color);
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(99, 102, 241, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }

    .keyboard-navigation *:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
    }

    /* PWA Update Notification */
    .update-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(99, 102, 241, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        padding: 1rem;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .update-content {
        display: flex;
        align-items: center;
        gap: 1rem;
        color: white;
        font-weight: 500;
    }

    .update-content button {
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: var(--transition);
        font-size: 0.9rem;
    }

    .update-content button:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-1px);
    }

    /* PWA Install Prompt */
    .install-prompt {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(10, 10, 26, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(99, 102, 241, 0.3);
        border-radius: 12px;
        padding: 1rem;
        z-index: 10000;
        animation: slideInUp 0.3s ease-out;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }

    .install-content {
        display: flex;
        align-items: center;
        gap: 1rem;
        color: white;
        font-weight: 500;
    }

    .install-content button {
        background: var(--primary-gradient);
        border: none;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: var(--transition);
        font-size: 0.9rem;
        font-weight: 600;
    }

    .install-content button:last-child {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .install-content button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    /* Offline Indicator */
    .offline-indicator {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #ef4444;
        color: white;
        text-align: center;
        padding: 0.5rem;
        z-index: 10001;
        font-weight: 500;
        animation: slideInDown 0.3s ease-out;
    }

    /* Animations */
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideInUp {
        from {
            transform: translateX(-50%) translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }

    @keyframes slideInDown {
        from {
            transform: translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .navbar {
        transition: var(--transition), transform 0.3s ease;
    }

    /* Responsive PWA notifications */
    @media (max-width: 768px) {
        .update-notification {
            top: 10px;
            right: 10px;
            left: 10px;
            transform: none;
        }

        .update-content {
            flex-direction: column;
            gap: 0.5rem;
        }

        .install-prompt {
            bottom: 10px;
            left: 10px;
            right: 10px;
            transform: none;
        }

        .install-content {
            flex-direction: column;
            gap: 0.5rem;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
