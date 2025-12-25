document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Swiper (безпечна ініціалізація)
    if (typeof Swiper !== 'undefined' && document.querySelector('.mySwiper')) {
        new Swiper(".mySwiper", { 
            slidesPerView: 3, centeredSlides: true, spaceBetween: 10, loop: true,
            autoplay: { delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: false },
            speed: 800, grabCursor: true, allowTouchMove: true
        });
    }

    // 2. Theme
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    let theme = localStorage.getItem('theme') || 'dark';
    
    function updateTheme(t) {
        body.setAttribute('data-theme', t);
        if(icon) {
            icon.className = t === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
        localStorage.setItem('theme', t);
    }
    updateTheme(theme);
    
    window.toggleTheme = () => updateTheme(body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');

    // 3. Reviews Logic
    window.toggleReview = (el) => {
        document.querySelectorAll('.review-item.active').forEach(item => {
            if(item !== el) item.classList.remove('active');
        });
        el.classList.toggle('active');
    };
    
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
                const b = c.querySelector('.accordion-body');
                if(b) b.style.maxHeight = null; 
            }
        });
        card.classList.toggle('open');
        const content = card.querySelector('.accordion-body');
        if (content) {
            if (card.classList.contains('open')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        }
    };

    // 5. Lightbox
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img');
    const closeBtn = document.querySelector('.lb-close');
    
    if (lightbox && lbImg) {
        window.openLB = (el) => {
            const imgEl = el.querySelector('img');
            if (imgEl && imgEl.naturalWidth > 0) {
                lbImg.src = imgEl.src;
                lightbox.classList.add('active');
            }
        };
        function closeLB() { lightbox.classList.remove('active'); }
        lightbox.addEventListener('click', (e) => { if (e.target !== lbImg) closeLB(); });
        if(closeBtn) closeBtn.addEventListener('click', closeLB);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLB(); });
    }

    // 6. Scroll Animations
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-scale');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    if (entry.target.classList.contains('trust-section')) {
                        const counter = entry.target.querySelector('.counter');
                        if (counter) {
                            const target = +counter.getAttribute('data-target'); 
                            let current = 0;
                            // Пришвидшив анімацію, щоб не гальмувала
                            const step = Math.ceil(target / 100); 
                            const timer = setInterval(() => {
                                current += step; 
                                if (current >= target) { current = target; clearInterval(timer); }
                                counter.innerText = current;
                            }, 20);
                        }
                    }
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -20px 0px" });
        revealElements.forEach(el => observer.observe(el));
    }

    // Актуальний рік (З перевіркою!)
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Плаваюча кнопка (З перевіркою!)
    const stickyBtn = document.getElementById('stickyBtn');
    if (stickyBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                stickyBtn.classList.add('visible');
            } else {
                stickyBtn.classList.remove('visible');
            }
        });
    }

}); // <--- Кінець DOMContentLoaded

// --- ФУНКЦІЯ ВИНОСИТЬСЯ НАЗОВНІ ---
// Тепер браузер бачить її завжди, навіть якщо DOM ще вантажиться
function shareSite() {
    if (navigator.share) {
        navigator.share({
            title: 'GOSTRO.UZH',
            text: 'Професійна заточка ножів в Ужгороді. Рекомендую!',
            url: window.location.href
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
        // Фоллбек для ПК
        navigator.clipboard.writeText(window.location.href)
            .then(() => alert('Посилання скопійовано!'))
            .catch(err => console.error('Не вдалося скопіювати', err));
    }
}
