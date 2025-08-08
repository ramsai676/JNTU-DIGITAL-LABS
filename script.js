document.addEventListener('DOMContentLoaded', () => {

    // --- PART 1: DYNAMIC LAB CARD INJECTION (Homepage only) ---
    const labGrid = document.querySelector('.lab-grid');
    if (labGrid) {
        const labs = [
            { name: 'Applied Physics Laboratory', desc: 'Explore wave optics, mechanics, and electromagnetism experiments.', url: 'physics-lab.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>' },
            { name: 'Engineering Chemistry Laboratory', desc: 'Practice with virtual titrations, reactions, and molecular structures.', url: 'chemistry-lab.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2L12 6.5 9.5 2"></path><path d="M12 13V6.5"></path><path d="M6.23 4.61a6.5 6.5 0 0 0 0 9.19"></path><path d="M17.77 4.61a6.5 6.5 0 0 1 0 9.19"></path><path d="M12 22a6.5 6.5 0 0 0 6.5-6.5H5.5A6.5 6.5 0 0 0 12 22z"></path></svg>' },
            { name: 'Basic Electrical Engineering Lab', desc: "Verify circuit laws and theorems like KVL, KCL, and Thevenin's.", url: 'bee-lab.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="M12 20v2"/><path d="M5 12H3"/><path d="M21 12h-2"/><path d="m18.36 5.64-.95.96"/><path d="m6.6 17.41-.96.95"/><path d="m18.36 18.36-.95-.95"/><path d="m6.6 6.6-.96-.95"/><circle cx="12" cy="12" r="4"/><path d="M12 16a4 4 0 0 1-4-4h8a4 4 0 0 1-4 4Z"/></svg>' },
            { name: 'Problem Solving Lab (PPS)', desc: 'Write, compile, and test your C programs in a powerful online IDE.', url: 'pps-lab.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>' },
            { name: 'Python Programming Laboratory', desc: 'Practice with data types, control flow, functions, and file operations.', url: 'python-lab.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 10.4V4.6a2 2 0 0 0-2.8-1.8L2 8.5a2 2 0 0 0-1 1.8v4.4a2 2 0 0 0 1 1.8l9.2 5.7a2 2 0 0 0 2.8-1.8v-5.8"/><path d="M10 13.6V9.4a2 2 0 0 1 2.8-1.8l9.2 5.7a2 2 0 0 1 1 1.8v4.4a2 2 0 0 1-1 1.8l-9.2 5.7a2 2 0 0 1-2.8-1.8v-5.8"/></svg>' },
            { name: 'IT Workshop', desc: 'Explore essential IT tools, hardware, and networking concepts.', url: 'it-workshop.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>' },
            { name: 'ELCS Laboratory', desc: 'Improve communication with phonetics, JAM sessions, and group discussions.', url: 'elcs-lab.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7h-4a3 3 0 0 1-3-3V2"/><path d="M16 2a4 4 0 0 1 4 4v2"/><path d="M12 22a7 7 0 0 1-7-7h4a3 3 0 0 0 3-3V2"/><path d="M8 2a4 4 0 0 0-4 4v2"/></svg>' }
        ];
        
        labs.forEach((lab, index) => {
            const card = document.createElement('a');
            card.href = lab.url;
            card.className = 'card animate-fade-in';
            card.style.transitionDelay = `${index * 100}ms`;
            card.innerHTML = `
                <div class="card-icon">${lab.icon}</div>
                <h2 class="card-title">${lab.name}</h2>
                <p class="card-description">${lab.desc}</p>
            `;
            labGrid.appendChild(card);
        });
    }

    // --- PART 2: VANTA.JS ANIMATED BACKGROUND (Homepage only) ---
    const vantaElement = document.getElementById('vanta-background');
    if (vantaElement) {
        VANTA.WAVES({
            el: "#vanta-background",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x0c0a18,
            shininess: 25.00,
            waveHeight: 15.00,
            waveSpeed: 0.75,
            zoom: 0.85
        });
    }

    // --- PART 3: NAVBAR SCROLL EFFECT (Homepage only) ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // --- PART 4: SCROLL-REVEAL ANIMATIONS ---
    const revealElements = document.querySelectorAll('.animate-fade-in');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // --- PART 5: SMOOTH PAGE TRANSITIONS ---
    document.body.classList.add('loaded'); // Fade in on load

    const pageLinks = document.querySelectorAll('a:not([target="_blank"])');
    pageLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const url = this.href;
            if (url && !url.endsWith('#') && url !== window.location.href) {
                e.preventDefault();
                document.body.style.opacity = '0';
                setTimeout(() => {
                    window.location.href = url;
                }, 400); // Match this duration with CSS transition
            }
        });
    });
});
