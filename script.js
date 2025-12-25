document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Swiper
    new Swiper(".mySwiper", { 
        slidesPerView: 3, centeredSlides: true, spaceBetween: 10, loop: true,
        autoplay: { delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: false },
        speed: 800, grabCursor: true, allowTouchMove: true
    });

    // 2. Theme
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    let theme = localStorage.getItem('theme') || 'dark';
    function updateTheme(t) {
        body.setAttribute('data-theme', t);
        icon.className = t === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        localStorage.setItem('theme', t);
    }
    updateTheme(theme);
    window.toggleTheme = () => updateTheme(body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');

    // 3. Reviews Logic (NEW)
    window.toggleReview = (el) => {
        // Закриваємо всі інші відкриті
        document.querySelectorAll('.review-item.active').forEach(item => {
            if(item !== el) item.classList.remove('active');
        });
        // Відкриваємо поточний
        el.classList.toggle('active');
    };
    // Закрити відгук, якщо клікнули деінде
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.review-item')) {
            document.querySelectorAll('.review-item.active').forEach(item => item.classList.remove('active'));
        }
    });

    // 4. Accordion
    window.toggleAccordion = (card) => {
        document.querySelectorAll('.card-link.open').forEach(c => {
            if(c !== card) { 
                c.classList.remove('open'); 
                c.querySelector('.accordion-body').style.maxHeight = null; 
            }
        });
        card.classList.toggle('open');
        const content = card.querySelector('.accordion-body');
        if (card.classList.contains('open')) {
            content.style.maxHeight = content.scrollHeight + "px";
        } else {
            content.style.maxHeight = null;
        }
    };

    // 5. Lightbox
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img');
    const closeBtn = document.querySelector('.lb-close');
    window.openLB = (el) => {
        const imgEl = el.querySelector('img');
        if (imgEl && imgEl.naturalWidth > 0) {
            lbImg.src = imgEl.src;
            lightbox.classList.add('active');
        }
    };
    function closeLB() { lightbox.classList.remove('active'); }
    lightbox.addEventListener('click', (e) => { if (e.target !== lbImg) closeLB(); });
    closeBtn.addEventListener('click', closeLB);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLB(); });

    // 6. Scroll Animations
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-scale');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                if (entry.target.classList.contains('trust-section')) {
                    const counter = entry.target.querySelector('.counter');
                    if (counter) {
                        const target = +counter.getAttribute('data-target'); 
                        let current = 0;
                        const timer = setInterval(() => {
                            current += 7; 
                            if (current >= target) { current = target; clearInterval(timer); }
                            counter.innerText = current;
                        }, 10);
                    }
                }
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealElements.forEach(el => observer.observe(el));
});