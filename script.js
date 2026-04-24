document.addEventListener('DOMContentLoaded', () => {

    /* --- 0. CURSOR PERSONALIZADO --- */
    const cursor = document.getElementById('custom-cursor');
    
    document.addEventListener('mousemove', (e) => {
        // Usar requestAnimationFrame para movimiento ultra suave
        requestAnimationFrame(() => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
    });

    // Expandir cursor en elementos interactivos
    const interactables = document.querySelectorAll('a, button, input, textarea, .cell, .kuromi-easter-egg');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
    });


    /* --- 1. MENÚ MÓVIL Y EFECTO SCROLL NAVBAR --- */
    const navbar = document.getElementById('navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

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
                observer.unobserve(entry.target);
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
            btn.style.backgroundColor = '#10b981';
            
            setTimeout(() => {
                contactForm.reset();
                btn.innerHTML = originalText;
                btn.style.backgroundColor = '';
            }, 3000);
        });
    }


    /* --- 4. EASTER EGG (MATRIX) --- */
    const secretCode = ['n', 'e', 'x', 'u', 's'];
    let codePosition = 0;
    
    const modal = document.getElementById('easter-egg-modal');
    const closeEggBtn = document.getElementById('close-egg');

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === secretCode[codePosition]) {
            codePosition++;
            if (codePosition === secretCode.length) {
                activateEasterEgg();
                codePosition = 0; 
            }
        } else {
            codePosition = 0; 
        }
    });

    const secretTrigger = document.getElementById('secret-trigger');
    if(secretTrigger) {
        secretTrigger.addEventListener('click', () => {
            activateEasterEgg();
        });
    }

    function activateEasterEgg() {
        modal.classList.add('active');
        document.body.classList.add('matrix-mode');
        
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
            oscillator.connect(audioCtx.destination);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.1);
        } catch(e) {
            console.log('AudioContext no soportado');
        }
    }

    if (closeEggBtn) {
        closeEggBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.classList.remove('matrix-mode');
        });
    }


    /* --- 5. JUEGO GATO VS IA (MINIMAX) --- */
    const boardElement = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusText = document.getElementById('game-status');
    const resetBtn = document.getElementById('reset-game');
    
    let board = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    const player = 'X';
    const ai = 'O';

    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
        [0, 4, 8], [2, 4, 6]             // Diagonales
    ];

    cells.forEach(cell => {
        cell.addEventListener('click', () => handlePlayerMove(cell));
    });

    resetBtn.addEventListener('click', resetGame);

    function handlePlayerMove(cell) {
        const index = cell.getAttribute('data-index');
        
        if (board[index] === '' && gameActive) {
            board[index] = player;
            updateCell(cell, player);
            
            if (!checkGameOver(board, player)) {
                statusText.innerText = "IA procesando...";
                gameActive = false; // Bloquear tablero mientras piensa la IA
                
                // Pequeño delay para hacerlo más natural
                setTimeout(() => {
                    const bestMove = getBestMove(board);
                    if (bestMove !== null) {
                        board[bestMove] = ai;
                        updateCell(cells[bestMove], ai);
                        checkGameOver(board, ai);
                    }
                    if(gameActive) statusText.innerText = "Tu turno (X)";
                }, 500);
            }
        }
    }

    function updateCell(cell, currentClass) {
        cell.innerText = currentClass;
        cell.classList.add('occupied');
        cell.classList.add(currentClass === 'X' ? 'x-mark' : 'o-mark');
    }

    function checkWin(currentBoard) {
        for (let i = 0; i < winPatterns.length; i++) {
            const [a, b, c] = winPatterns[i];
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                return currentBoard[a];
            }
        }
        if (!currentBoard.includes('')) return 'tie';
        return null;
    }

    function checkGameOver(currentBoard, lastPlayer) {
        const result = checkWin(currentBoard);
        if (result !== null) {
            gameActive = false;
            if (result === 'tie') {
                statusText.innerText = "Empate Táctico";
                statusText.style.color = "#ffbd2e";
            } else if (result === player) {
                statusText.innerText = "¡SISTEMA HACKEADO! Has ganado";
                statusText.style.color = "#27c93f";
                triggerConfetti();
            } else {
                statusText.innerText = "SISTEMA INTACTO. IA Gana";
                statusText.style.color = "#ff5f56";
            }
            return true;
        }
        return false;
    }

    // ALGORITMO MINIMAX
    function minimax(newBoard, depth, isMaximizing) {
        const result = checkWin(newBoard);
        if (result === ai) return 10 - depth;
        if (result === player) return depth - 10;
        if (result === 'tie') return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < newBoard.length; i++) {
                if (newBoard[i] === '') {
                    newBoard[i] = ai;
                    let score = minimax(newBoard, depth + 1, false);
                    newBoard[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < newBoard.length; i++) {
                if (newBoard[i] === '') {
                    newBoard[i] = player;
                    let score = minimax(newBoard, depth + 1, true);
                    newBoard[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function getBestMove(currentBoard) {
        let bestScore = -Infinity;
        let move = null;
        for (let i = 0; i < currentBoard.length; i++) {
            if (currentBoard[i] === '') {
                currentBoard[i] = ai;
                let score = minimax(currentBoard, 0, false);
                currentBoard[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    }

    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        statusText.innerText = "Tu turno (X)";
        statusText.style.color = "var(--text-main)";
        cells.forEach(cell => {
            cell.innerText = '';
            cell.classList.remove('occupied', 'x-mark', 'o-mark');
        });
    }

    // --- ANIMACIÓN DE CONFETI (CSS Generado por JS) ---
    function triggerConfetti() {
        const container = document.getElementById('confetti-container');
        const colors = ['#00f0ff', '#ff3b3b', '#ffffff', '#27c93f'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti-piece');
            
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
            
            container.appendChild(confetti);
            
            // Eliminar del DOM tras la animación
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }

});
