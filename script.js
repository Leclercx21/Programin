document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. MENÚ MÓVIL Y EFECTO SCROLL NAVBAR --- */
    const navbar = document.getElementById('navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Cambiar fondo del menú al hacer scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Abrir/Cerrar menú móvil
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
        });
    });


    /* --- 2. ANIMACIONES ON-SCROLL (Intersection Observer) --- */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // Dejar de observar una vez animado
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => observer.observe(el));


    /* --- 3. PREVENIR ENVÍO DE FORMULARIO DEFAULT --- */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Enviado <i class="fas fa-check"></i>';
            btn.style.backgroundColor = '#10b981'; // Verde de éxito
            
            setTimeout(() => {
                contactForm.reset();
                btn.innerHTML = originalText;
                btn.style.backgroundColor = '';
            }, 3000);
        });
    }

    /* --- 4. EASTER EGG (SECRETO) --- */
    // Método 1: Para usuarios de PC. Si escriben "nexus" en el teclado de corrido.
    const secretCode = ['n', 'e', 'x', 'u', 's'];
    let codePosition = 0;
    
    const modal = document.getElementById('easter-egg-modal');
    const closeEggBtn = document.getElementById('close-egg');

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === secretCode[codePosition]) {
            codePosition++;
            if (codePosition === secretCode.length) {
                activateEasterEgg();
                codePosition = 0; // Reiniciar contador
            }
        } else {
            codePosition = 0; // Resetear si se equivoca
        }
    });

    // Método 2: Para usuarios móviles. Si tocan el pequeño punto invisible en el footer.
    const secretTrigger = document.getElementById('secret-trigger');
    if(secretTrigger) {
        secretTrigger.addEventListener('click', () => {
            activateEasterEgg();
        });
    }

    // Lógica de activación del Easter Egg
    function activateEasterEgg() {
        modal.classList.add('active');
        document.body.classList.add('matrix-mode');
        
        // Sonido de sistema (opcional y simulado mediante un beep corto web api)
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // 440 Hz
            oscillator.connect(audioCtx.destination);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.1);
        } catch(e) {
            console.log('AudioContext no soportado');
        }
    }

    // Botón de cerrar Easter Egg
    closeEggBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.classList.remove('matrix-mode');
    });

});