// rebuildGeometry()  this.player.radius modificar tamaño bola y huecos
//constructor() modificar variables de bola
const QUESTIONS_DB = [
    {
        "id": 1,
        "procentajeAprobacion": 80,
        "encabezado": "Curiosidades del Reino Animal - El mejor amigo del ser humano.",
        "pregunta": "¿Cuál de estos datos sobre la biología de los perros es científicamente cierto?",
        "opciones": [
            { "correcta": true, "text": "Su sentido del olfato es entre 10.000 y 100.000 veces más potente que el nuestro, gracias a sus más de 300 millones de receptores." },
            { "correcta": false, "text": "Ven el mundo completamente en blanco y negro, como si fuera una película o televisión antigua." },
            { "correcta": false, "text": "Sudan a través de la lengua, razón por la cual jadean constantemente cuando hacen mucho ejercicio o hace calor." }
        ],
        "feedbackPositivo": "¡Excelente instinto animal! Los perros tienen una nariz prodigiosa. Lo del blanco y negro es un mito (ven en tonos azules y amarillos) y, en realidad, regulan su temperatura jadeando y sudan principalmente por las almohadillas de sus patas.",
        "feedbackNegativo": "¡Ups, te dejaste llevar por un mito clásico! Los perros sí ven ciertos colores (tonos azules y amarillos) y sudan a través de las almohadillas de sus patas, no por la lengua. El jadeo es para regular la temperatura, pero no es sudor."
    },
    {
        "id": 2,
        "procentajeAprobacion": 80,
        "encabezado": "Misterios del Mundo - Monumentos y maravillas históricas.",
        "pregunta": "Si decidieras empacar tus maletas y visitar la Gran Muralla China, ¿qué dato curioso descubrirías al conocer su historia?",
        "opciones": [
            { "correcta": true, "text": "No es una sola muralla continua, sino una inmensa red de paredes, barreras naturales y fortificaciones construidas en distintas épocas." },
            { "correcta": false, "text": "Es la única estructura construida por el ser humano que se puede ver claramente a simple vista desde la Luna." },
            { "correcta": false, "text": "Fue construida en un tiempo récord de solo 50 años bajo las estrictas órdenes de un único emperador." }
        ],
        "feedbackPositivo": "¡Correcto! Tienes mucha cultura general. La Gran Muralla es en realidad un rompecabezas de fortificaciones discontinuas que se fueron uniendo a lo largo de más de 2000 años por diferentes dinastías.",
        "feedbackNegativo": "¡Casi, pero no! El cuento de que se ve desde la Luna es probablemente el mito espacial más famoso, pero es falso. Además, su construcción tomó siglos y el trabajo de múltiples dinastías, no de un solo emperador."
    },
    {
        "id": 3,
        "procentajeAprobacion": 80,
        "encabezado": "Eventos Globales - La historia oculta de los Juegos Olímpicos.",
        "pregunta": "Durante los primeros Juegos Olímpicos modernos celebrados en Atenas en 1896, ¿cuál fue el premio exacto que recibieron los ganadores del primer lugar?",
        "opciones": [
            { "correcta": true, "text": "Una medalla de plata, una rama de olivo y un diploma oficial." },
            { "correcta": false, "text": "Una medalla de oro macizo y una corona de laureles clásica." },
            { "correcta": false, "text": "Una estatuilla de bronce de la diosa Atenea y una suma de dinero en efectivo." }
        ],
        "feedbackPositivo": "¡Exacto, eres un campeón del deporte! En 1896 la tradición del oro aún no existía. A los ganadores se les daba plata, y los que quedaban en segundo lugar recibían bronce. La medalla de oro se introdujo recién en 1904.",
        "feedbackNegativo": "¡Te fuiste con la finta de la tradición actual! Sorprendentemente, las medallas de oro para los ganadores no existieron hasta los Juegos de San Luis en 1904. En los primeros juegos de Atenas, el gran campeón recibía plata."
    }
];

    // El camino es ancho y se introduce el numeral 7 (Checkpoint invisible detonador)
    // 0: Suelo libre
    // 1: Pared (Bloques sólidos)
    // 2: Agujero (Lanzador de Reinicio 1)
    // 3: Inicio de la bola
    // 4: Meta final (Portal Checkpoint)
    // 5: Agujero (Lanzador de Reinicio 2)
    // 6: Agujero (Lanzador de Reinicio 3)
    // 7: Checkpoint Invisible detonador del modal de la pregunta
    const LEVEL_MAP = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,3,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,4,1,1],
        [1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,7,0,0,0,2,1,7,0,0,6,1,1,1,1], 
        [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1],
        [1,0,1,0,0,0,0,5,1,0,0,0,0,0,0,0,1,1,1,1], 
        [1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1],
        [1,0,1,0,1,1,1,0,1,0,0,0,0,0,1,1,1,1,1,1],
        [1,0,1,0,1,1,1,7,1,1,1,1,0,0,1,1,1,1,1,1],
        [1,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    // --- CONFIGURACIÓN DE REINICIOS MANUALES (Coordenadas r = Fila, c = Columna) ---
    // Modifica estos números para cambiar dónde aparece la bola cuando se responde mal:
    const RESET_POSITIONS = {
        0: { r: 1, c: 8 },   // Pregunta 1 (Trigger en r:3, c:6). Reaparece 2 casillas a la derecha (antes de cruzar).
        1: { r: 5, c: 3 },   // Pregunta 2 (Trigger en r:8, c:7). Reaparece 1 casilla abajo (antes de subir).
        2: { r: 5, c: 13 }   // Pregunta 3 (Trigger en r:3, c:13). Reaparece 2 casillas a la izquierda (antes de cruzar).
    };

    class GameEngine {
        constructor() {
            this.canvas = document.getElementById('gameCanvas');
            this.ctx = this.canvas.getContext('2d');
            this.cols = LEVEL_MAP[0].length;
            this.rows = LEVEL_MAP.length;
            this.tileSize = 40; 
            
            this.controlMode = 'Desktop';
            this.tiltX = 0;
            this.tiltY = 0;
            
            this.correctAnswers = 0;
            this.totalQuestions = QUESTIONS_DB.length;
            this.isModalOpen = true; 
            this.lastActiveHoleIndex = null; 
            this.isFallingToRestart = false; 
            
            // Posiciones de reaparición
            this.startX = 0;
            this.startY = 0;
            this.lastSafeX = 0;
            this.lastSafeY = 0;
            
            this.disabledHoles = []; 
            
            // Entidad Jugador (variables que controla la bola)
            this.player = {
                x: 0,
                y: 0,
                radius: 8, 
                vx: 0,
                vy: 0,
                // --- VARIABLES DE FÍSICA QUE PUEDES MODIFICAR ---
                accel: 0.22, //más alto más rápido al presionar tecla
                friction: 0.99, //más alto tarda más en detenerse la bola
                maxSpeed: 4.5, //velocidad máxima mayor más rápido
                
                isFalling: false, 
                scale: 1
            };

            this.keys = {};
            this.walls = [];
            this.holes = []; 
            this.triggers = []; 
            this.goal = null;

            window.addEventListener('keydown', (e) => {
                this.keys[e.key] = true;
                if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight", " "].indexOf(e.key) > -1) {
                    e.preventDefault();
                }
            });
            window.addEventListener('keyup', (e) => this.keys[e.key] = false);
            window.addEventListener('resize', () => {
                this.checkOrientation();
                this.resizeCanvas();
            });
            window.addEventListener('orientationchange', () => {
                setTimeout(() => {
                    this.checkOrientation();
                    this.resizeCanvas();
                }, 200);
            });
            
            this.checkOrientation();
            this.detectDeviceMode();
            this.initSensors();
        }

        // Detecta si es dispositivo móvil y su orientación para forzar horizontal
        checkOrientation() {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (window.innerWidth < 1024 && ('ontouchstart' in window || navigator.maxTouchPoints > 0));
            const rotateOverlay = document.getElementById('rotate-overlay');
            const isPortrait = window.innerHeight > window.innerWidth;

            if (isMobile) {
                if (isPortrait) {
                    rotateOverlay.classList.remove('hidden');
                    this.isModalOpen = true; // Detener físicas e interacción
                   
                } else {
                    rotateOverlay.classList.add('hidden');
                    // Solo restaurar física si los modales UI generales están ocultos
                    const isAnyModalVisible = !document.getElementById('start-modal').classList.contains('hidden') || 
                                              !document.getElementById('question-modal').classList.contains('hidden') || 
                                              !document.getElementById('feedback-modal').classList.contains('hidden') || 
                                              !document.getElementById('end-modal').classList.contains('hidden');
                    this.isModalOpen = isAnyModalVisible;
                    
                }
                this.detectDeviceMode(); // Recalcular controles en base a la nueva orientación
            } else {
               
                rotateOverlay.classList.add('hidden');
            }
        }

        detectDeviceMode() {
            const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const isLandscape = window.innerWidth > window.innerHeight;
            
            const modeEl = document.getElementById('control-mode');
            const descEl = document.getElementById('start-control-desc');
            const hintEl = document.getElementById('device-hint');

            if (isTouch && (isMobile || isLandscape)) {
                this.controlMode = 'Mobile (Giroscopio)';
                modeEl.textContent = 'Móvil (Giroscopio)';
                descEl.innerHTML = 'Inclina tu dispositivo móvil suavemente hacia los lados para mover la bola.';
                hintEl.textContent = 'Inclina el móvil para guiar la esfera y esquivar los obstáculos.';
            } else {
                this.controlMode = 'Desktop';
                modeEl.textContent = 'Teclado (Desktop)';
                descEl.innerHTML = 'Usa las <strong>Flechas del Teclado</strong> para mover la bola sobre el tablero de madera y calcula su inercia.';
                hintEl.textContent = 'Usa las flechas de dirección de tu teclado para mover la esfera.';
            }
        }

        initSensors() {
            if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                window.addEventListener('click', () => {
                    DeviceOrientationEvent.requestPermission()
                        .then(response => {
                            if (response === 'granted') {
                                this.setupOrientationListener();
                            }
                        }).catch(console.error);
                }, { once: true });
            } else {
                this.setupOrientationListener();
            }
        }

        setupOrientationListener() {
            window.addEventListener('deviceorientation', (e) => {
                if (this.isModalOpen) return;
                
                const sensitivity = 0.05;
                if (e.gamma !== null && e.beta !== null) {
                    // En modo Landscape móvil, los ejes beta y gamma se intercambian.
                    // Adaptamos la dirección según la inclinación lateral del móvil acostado.
                    if (window.orientation === 90) {
                        this.tiltX = e.beta * sensitivity;
                        this.tiltY = -e.gamma * sensitivity;
                    } else if (window.orientation === -90) {
                        this.tiltX = -e.beta * sensitivity;
                        this.tiltY = e.gamma * sensitivity;
                    } else {
                        // Fallback genérico para landscape sin orientación API nativa de grados
                        this.tiltX = e.gamma * sensitivity; 
                        this.tiltY = (e.beta - 30) * sensitivity; 
                    }
                }
            });
        }

        resizeCanvas() {
            const container = this.canvas.parentElement;
            
            // Limitador dinámico optimizado ahora que se eliminaron los controles móviles de pantalla
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (window.innerWidth < 1024 && ('ontouchstart' in window || navigator.maxTouchPoints > 0));
            // Espacio de compensación vertical reducido al mínimo (75px) para maximizar visualización del laberinto en Landscape móvil
            const controlsOffset = (isMobile && window.innerWidth > window.innerHeight) ? 75 : 120;
            const maxAvailableHeight = Math.max(150, window.innerHeight - controlsOffset);
            const containerWidth = Math.max(200, container.clientWidth - 16); 

            // Escala del Tile buscando el balance perfecto de proporciones
            let calculatedTileSize = Math.floor(containerWidth / this.cols);
            if (calculatedTileSize * this.rows > maxAvailableHeight) {
                calculatedTileSize = Math.floor(maxAvailableHeight / this.rows);
            }

            const oldTileSize = this.tileSize;
            this.tileSize = Math.max(12, calculatedTileSize);
            
            this.canvas.width = this.cols * this.tileSize;
            this.canvas.height = this.rows * this.tileSize;
            
            if (oldTileSize && oldTileSize !== this.tileSize) {
                const ratio = this.tileSize / oldTileSize;
                this.player.x *= ratio;
                this.player.y *= ratio;
                this.startX *= ratio;
                this.startY *= ratio;
                this.lastSafeX *= ratio;
                this.lastSafeY *= ratio;
            }

            this.rebuildGeometry();
        }

        rebuildGeometry() {
            this.walls = [];
            this.holes = [];
            this.triggers = [];
            this.goal = null;

            // Tamaño de la esfera (Jugador)
            this.player.radius = Math.max(4, this.tileSize * 0.24);
            // Tamaño de los agujeros
            const holeRadius = Math.max(4, this.tileSize * 0.26);
            // Tamaño del portal final (Meta)
            const goalRadius = Math.max(6, this.tileSize * 0.35);

            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    const type = LEVEL_MAP[r][c];
                    const cx = c * this.tileSize + this.tileSize / 2;
                    const cy = r * this.tileSize + this.tileSize / 2;
                    const x = c * this.tileSize;
                    const y = r * this.tileSize;

                    if (type === 1) { 
                        this.walls.push({ x, y, w: this.tileSize, h: this.tileSize });
                    } else if (type === 2 || type === 5 || type === 6) { 
                        let qIndex = 0;
                        if (type === 5) qIndex = 1;
                        if (type === 6) qIndex = 2;

                        const isSuperado = this.disabledHoles.includes(qIndex);
                        this.holes.push({
                            x: cx,
                            y: cy,
                            r: holeRadius, 
                            qIndex: qIndex,
                            disabled: isSuperado
                        });
                    } else if (type === 4) { 
                        this.goal = { x: cx, y: cy, r: goalRadius };
                    } else if (type === 7) { 
                        let qIndex = 0;
                         if (r === 3 && c === 6) qIndex = 0;   // Primer detonador (Pregunta 1)
                        if (r === 8 && c === 7) qIndex = 1;   // Segundo detonador (Pregunta 2)
                        if (r === 3 && c === 12) qIndex = 2;  // Tercer detonador (Pregunta 3)

                        const isSuperado = this.disabledHoles.includes(qIndex);
                        this.triggers.push({
                            x: cx,
                            y: cy,
                            r: this.tileSize * 0.45, 
                            qIndex: qIndex,
                            disabled: isSuperado
                        });
                    }
                }
            }
        }

        loadLevel() {
            this.resizeCanvas();
            this.player.vx = 0;
            this.player.vy = 0;
            this.player.isFalling = false;
            this.player.scale = 1;

            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    if (LEVEL_MAP[r][c] === 3) {
                        this.player.x = c * this.tileSize + this.tileSize / 2;
                        this.player.y = r * this.tileSize + this.tileSize / 2;
                        this.startX = this.player.x;
                        this.startY = this.player.y;
                        this.lastSafeX = this.player.x;
                        this.lastSafeY = this.player.y;
                    }
                }
            }
            this.rebuildGeometry();
        }

        update() {
            if (this.isModalOpen) return;

            if (this.player.isFalling) {
                this.player.scale -= 0.08;
                if (this.player.scale <= 0) {
                    if (this.isFallingToRestart) {
                        this.resetToStart();
                    } else {
                        this.triggerQuestionChallenge();
                    }
                }
                return;
            }

            const currentTileX = Math.floor(this.player.x / this.tileSize);
            const currentTileY = Math.floor(this.player.y / this.tileSize);
            if (LEVEL_MAP[currentTileY] && LEVEL_MAP[currentTileY][currentTileX] === 0) {
                this.lastSafeX = this.player.x;
                this.lastSafeY = this.player.y;
            }

            if (this.controlMode === 'Desktop') {
                if (this.keys['ArrowUp'] || this.keys['w']) this.player.vy -= this.player.accel;
                if (this.keys['ArrowDown'] || this.keys['s']) this.player.vy += this.player.accel;
                if (this.keys['ArrowLeft'] || this.keys['a']) this.player.vx -= this.player.accel;
                if (this.keys['ArrowRight'] || this.keys['d']) this.player.vx += this.player.accel;
            } else {
                this.player.vx += this.tiltX * 0.4;
                this.player.vy += this.tiltY * 0.4;
            }

            this.player.vx *= this.player.friction;
            this.player.vy *= this.player.friction;

            const speed = Math.sqrt(this.player.vx**2 + this.player.vy**2);
            if (speed > this.player.maxSpeed) {
                const ratio = this.player.maxSpeed / speed;
                this.player.vx *= ratio;
                this.player.vy *= ratio;
            }

            let nextX = this.player.x + this.player.vx;
            if (this.checkWallCollision(nextX, this.player.y)) {
                this.player.vx *= -0.35; 
                nextX = this.player.x; 
            }
            this.player.x = nextX;

            let nextY = this.player.y + this.player.vy;
            if (this.checkWallCollision(this.player.x, nextY)) {
                this.player.vy *= -0.35; 
                nextY = this.player.y;
            }
            this.player.y = nextY;

            if (this.player.x < this.player.radius) { this.player.x = this.player.radius; this.player.vx *= -0.5; }
            if (this.player.x > this.canvas.width - this.player.radius) { this.player.x = this.canvas.width - this.player.radius; this.player.vx *= -0.5; }
            if (this.player.y < this.player.radius) { this.player.y = this.player.radius; this.player.vy *= -0.5; }
            if (this.player.y > this.canvas.height - this.player.radius) { this.player.y = this.canvas.height - this.player.radius; this.player.vy *= -0.5; }

            this.checkHoles();
            this.checkTriggers();
            this.checkGoal();
        }

        checkWallCollision(px, py) {
            const size = this.player.radius; 
            const pLeft = px - size;
            const pRight = px + size;
            const pTop = py - size;
            const pBottom = py + size;

            for (let w of this.walls) {
                if (pRight > w.x && pLeft < w.x + w.w &&
                    pBottom > w.y && pTop < w.y + w.h) {
                    return true;
                }
            }
            return false;
        }

        checkHoles() {
            for (let h of this.holes) {
                if (h.disabled) continue; 

                const dx = this.player.x - h.x;
                const dy = this.player.y - h.y;
                const distance = Math.sqrt(dx*dx + dy*dy);
                
                if (distance < (this.player.radius * 0.5 + h.r * 0.5)) { 
                    this.player.isFalling = true;
                    this.player.vx = 0;
                    this.player.vy = 0;
                    this.player.x = h.x;
                    this.player.y = h.y;
                    this.lastActiveHoleIndex = h.qIndex; 
                    this.isFallingToRestart = true; 
                    break;
                }
            }
        }

        checkTriggers() {
            for (let t of this.triggers) {
                if (t.disabled) continue;

                const dx = this.player.x - t.x;
                const dy = this.player.y - t.y;
                const distance = Math.sqrt(dx*dx + dy*dy);

                if (distance < (this.player.radius + t.r)) {
                    this.lastActiveHoleIndex = t.qIndex;
                    this.isFallingToRestart = false; 
                    this.triggerQuestionChallenge();
                    break;
                }
            }
        }

        checkGoal() {
            if (!this.goal) return;
            const dx = this.player.x - this.goal.x;
            const dy = this.player.y - this.goal.y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < (this.player.radius + this.goal.r)) {
                this.isModalOpen = true;
                this.showFinalScreen();
            }
        }

        resetToStart() {
            this.player.x = this.startX;
            this.player.y = this.startY;
            this.player.vx = 0;
            this.player.vy = 0;
            this.player.scale = 1;
            this.player.isFalling = false;
            this.isFallingToRestart = false;
        }

        triggerQuestionChallenge() {
            this.isModalOpen = true;
            this.player.isFalling = false;
            
            const q = QUESTIONS_DB[this.lastActiveHoleIndex];
            
            if (!q) return;

            document.getElementById('question-id-badge').innerText = `RETO ${q.id} de ${this.totalQuestions}`;
            document.getElementById('q-header').innerText = q.encabezado;
            document.getElementById('q-text').innerText = q.pregunta;
            
            const optsContainer = document.getElementById('q-options');
            optsContainer.innerHTML = ''; 

            const mixedOpts = [...q.opciones];
            for (let i = mixedOpts.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [mixedOpts[i], mixedOpts[j]] = [mixedOpts[j], mixedOpts[i]];
            }
            
            mixedOpts.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'option-card text-left p-3 md:p-4 rounded-xl text-xs md:text-base font-medium text-slate-700 hover:text-slate-900 border border-transparent hover:border-slate-300 w-full cursor-pointer transition-all duration-150';
                btn.innerText = opt.text;
                btn.onclick = () => this.handleAnswerSelection(opt, q);
                optsContainer.appendChild(btn);
            });

            document.getElementById('modal-overlay').classList.remove('hidden');
            document.getElementById('question-modal').classList.remove('hidden');
            document.getElementById('start-modal').classList.add('hidden');
            document.getElementById('feedback-modal').classList.add('hidden');
        }

        handleAnswerSelection(option, questionObj) {
            document.getElementById('question-modal').classList.add('hidden');
            
            const fbModal = document.getElementById('feedback-modal');
            const title = document.getElementById('fb-title');
            const text = document.getElementById('fb-text');
            const iconContainer = document.getElementById('fb-icon-container');
            const fbBtn = document.getElementById('fb-btn');

            if (option.correcta) {
                this.correctAnswers++;
                title.innerText = "¡Criterio Correcto!";
                title.className = "text-xl md:text-2xl font-extrabold text-green-600";
                text.innerText = questionObj.feedbackPositivo;
                
                iconContainer.className = "w-14 h-14 md:w-20 md:h-20 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl md:text-4xl shadow-md";
                iconContainer.innerHTML = "✓";
                
                fbBtn.className = "w-full py-2.5 md:py-3 bg-green-600 text-white font-semibold rounded-2xl hover:bg-green-700 transition-all cursor-pointer";
                fbBtn.innerText = "Superar Obstáculo";

                this.disabledHoles.push(this.lastActiveHoleIndex);
                this.rebuildGeometry();

                this.player.vx = 0;
                this.player.vy = 0;
                this.player.scale = 1;
            } else {
                title.innerText = "¡Cuidado, requiere ajuste!";
                title.className = "text-xl md:text-2xl font-extrabold text-red-600";
                text.innerText = questionObj.feedbackNegativo;
                
                iconContainer.className = "w-14 h-14 md:w-20 md:h-20 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl md:text-4xl shadow-md";
                iconContainer.innerHTML = "✗";

                fbBtn.className = "w-full py-2.5 md:py-3 bg-slate-800 text-white font-semibold rounded-2xl hover:bg-slate-900 transition-all cursor-pointer";
                fbBtn.innerText = "Intentar de Nuevo";

                // Buscamos si existe una coordenada manual definida para esta pregunta
                const resetCoord = RESET_POSITIONS[this.lastActiveHoleIndex];

                if (resetCoord) {
                    // Convertimos la fila (r) y columna (c) manual a coordenadas de píxeles en el lienzo
                    this.player.x = resetCoord.c * this.tileSize + this.tileSize / 2;
                    this.player.y = resetCoord.r * this.tileSize + this.tileSize / 2;
                } else {
                    // Si por alguna razón no se definió, usamos la última posición segura como respaldo
                    this.player.x = this.lastSafeX;
                    this.player.y = this.lastSafeY;
                }

                this.player.vx = 0;
                this.player.vy = 0;
                this.player.scale = 1;
            }

            this.updateScoreUI();
            fbModal.classList.remove('hidden');
        }

        updateScoreUI() {
            document.getElementById('score-display').innerText = `Aciertos: ${this.correctAnswers}/${this.totalQuestions}`;
        }

        showFinalScreen() {
            document.getElementById('modal-overlay').classList.remove('hidden');
            document.getElementById('end-modal').classList.remove('hidden');
            document.getElementById('feedback-modal').classList.add('hidden');
            document.getElementById('question-modal').classList.add('hidden');
            document.getElementById('start-modal').classList.add('hidden');

            const percent = Math.round((this.correctAnswers / this.totalQuestions) * 100);
            document.getElementById('end-score').innerText = `Tu puntuación: ${percent}% de aciertos (${this.correctAnswers} de ${this.totalQuestions})`;

            const title = document.getElementById('end-title');
            const desc1 = document.getElementById('end-desc-1');
            const desc2 = document.getElementById('end-desc-2');
            const resetBtn = document.getElementById('end-reset-btn');

            if (percent >= 70) {
                title.innerText = "¡Mente brillante!";
                title.className = "text-xl md:text-3xl font-black text-green-600";
                desc1.innerText = "Demuestras tener un excelente dominio de cultura general y una gran curiosidad por los misterios del mundo que nos rodea.";
                desc2.innerHTML = "Has superado este laberinto de conocimiento con éxito. Ya puedes avanzar al siguiente contenido del curso para seguir aprendiendo. ¡Buen trabajo!";
                resetBtn.classList.add('hidden'); 
                markActivityAsCompleted();
            } else {
                title.innerText = "¡Buen esfuerzo!";
                title.className = "text-xl md:text-3xl font-black text-slate-800";
                desc1.innerText = "El mundo está lleno de datos sorprendentes y este reto demuestra que siempre hay algo nuevo y fascinante por descubrir.";
                desc2.innerHTML = "Te invitamos a repetir el desafío para mejorar tu marca y memorizar estas curiosidades, o puedes avanzar directamente a la siguiente lección.";
                resetBtn.classList.remove('hidden');
            }
        }

        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            const pathColor = '#eef2f7';
            const wallColor = '#d9e2ec';
            const shadowDark = '#bcccdc';
            const shadowLight = '#ffffff';

            this.ctx.fillStyle = pathColor;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.walls.forEach(w => {
                this.ctx.fillStyle = shadowDark;
                this.ctx.fillRect(w.x + 3, w.y + 3, w.w, w.h);

                this.ctx.fillStyle = wallColor;
                this.ctx.fillRect(w.x, w.y, w.w, w.h);

                this.ctx.strokeStyle = shadowLight;
                this.ctx.lineWidth = 1.5;
                this.ctx.strokeRect(w.x, w.y, w.w, w.h);
            });

            this.holes.forEach(h => {
                const safeHRadius = Math.max(0.1, h.r);
                if (h.disabled) {
                    this.ctx.beginPath();
                    this.ctx.arc(h.x, h.y, safeHRadius, 0, Math.PI * 2);
                    this.ctx.fillStyle = '#bbf7d0'; 
                    this.ctx.fill();
                    this.ctx.strokeStyle = '#4ade80';
                    this.ctx.lineWidth = 3;
                    this.ctx.stroke();

                    this.ctx.beginPath();
                    this.ctx.moveTo(h.x - 4, h.y);
                    this.ctx.lineTo(h.x - 1, h.y + 3);
                    this.ctx.lineTo(h.x + 4, h.y - 3);
                    this.ctx.strokeStyle = '#166534';
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                    return;
                }

                this.ctx.beginPath();
                this.ctx.arc(h.x, h.y, safeHRadius, 0, Math.PI * 2);
                this.ctx.fillStyle = '#1e293b'; 
                this.ctx.fill();

                this.ctx.beginPath();
                this.ctx.arc(h.x, h.y, safeHRadius + 2, 0, Math.PI * 2);
                this.ctx.strokeStyle = '#cbd5e1';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            });

             // --- NUEVO: DIBUJAR LOS CHECKPOINTS (7) COMO CRUCES VERDES ---
            this.triggers.forEach(t => {
                if (t.disabled) return; // Si el desafío ya se completó, no pintamos la cruz

                this.ctx.save();
                this.ctx.strokeStyle = '#22c55e'; // Verde brillante (green-500)
                this.ctx.lineWidth = 5.5;
                this.ctx.lineCap = '';

                const size = this.tileSize * 0.22; // Tamaño de los brazos de la cruz

                // Línea horizontal de la cruz
                this.ctx.beginPath();
                this.ctx.moveTo(t.x - size, t.y);
                this.ctx.lineTo(t.x + size, t.y);
                this.ctx.stroke();

                // Línea vertical de la cruz
                this.ctx.beginPath();
                this.ctx.moveTo(t.x, t.y - size);
                this.ctx.lineTo(t.x, t.y + size);
                this.ctx.stroke();

                this.ctx.restore();
            });

            if (this.goal) {
                const safeGoalRadius = Math.max(0.1, this.goal.r);
                this.ctx.beginPath();
                this.ctx.arc(this.goal.x, this.goal.y, safeGoalRadius + 4, 0, Math.PI * 2);
                this.ctx.fillStyle = '#dbeafe';
                this.ctx.fill();

                this.ctx.beginPath();
                this.ctx.arc(this.goal.x, this.goal.y, safeGoalRadius, 0, Math.PI * 2);
                this.ctx.fillStyle = '#2563eb'; 
                this.ctx.fill();

                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = 'bold 12px Outfit';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText("🏆", this.goal.x, this.goal.y);
            }

            if (this.player.scale > 0) {
                this.ctx.save();
                this.ctx.translate(this.player.x, this.player.y);
                this.ctx.scale(this.player.scale, this.player.scale);

                const grad = this.ctx.createRadialGradient(-3, -3, 2, 0, 0, this.player.radius);
                grad.addColorStop(0, '#ffffff'); 
                grad.addColorStop(0.3, '#3b82f6'); 
                grad.addColorStop(1, '#1d4ed8'); 

                this.ctx.beginPath();
                this.ctx.arc(0, 0, this.player.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = grad;
                this.ctx.fill();

                this.ctx.restore();
            }
        }

        loop() {
            this.update();
            this.draw(); 
            requestAnimationFrame(() => this.loop());
        }
    }

    let game;
    window.onload = function() {
        game = new GameEngine();
        game.loadLevel();
        game.loop(); 
    };

    function startGame() {
        document.getElementById('start-modal').classList.add('hidden');
        document.getElementById('modal-overlay').classList.add('hidden');
        game.isModalOpen = false;
    }

    function closeFeedback() {
        document.getElementById('feedback-modal').classList.add('hidden');
        document.getElementById('modal-overlay').classList.add('hidden');
        game.isModalOpen = false;
    }

    function restartGame() {
        // Al recargar la página, el navegador limpia todo el estado de JavaScript 
        // y restaura el HTML original a la perfección, evitando cualquier error.
        window.location.reload();
    }

    function finishActivity() {
        markActivityAsCompleted();
        
        const endModal = document.getElementById('end-modal');
        if (endModal) {
            endModal.innerHTML = `
                <div class="flex flex-col gap-4 w-full items-center text-center">
                    <div class="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl shadow-sm">
                        👍
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-slate-800">¡Tu progreso ha sido guardado!</h3>
                        <p class="text-slate-500 text-xs mt-1">Ya puedes continuar con la siguiente lección teórica.</p>
                    </div>
                    <button id="end-reset-btn" onclick="restartGame()" class="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs md:text-sm font-bold rounded-xl transition-all cursor-pointer text-center mt-2">
                        🔄 Volver a jugar el desafío
                    </button>
                </div>
            `;
        }
    }


    function markActivityAsCompleted() {
        if (window.SCORMPlayer) {
            window.SCORMPlayer.markAsCompleted();
        } else if (window.ContentUtilities) {
            const currentStatus = window.ContentUtilities.getSCORMStatus();
            if (!currentStatus.isCompleted) {
                window.ContentUtilities.markAsCompleted({
                    message: 'Actividad de Diagnóstico de Crédito completada con éxito.',
                    force: true
                });
            }
        }
    }

    // Funcionalidad de pantalla completa unificada para Desktop y Mobile
    function toggleFullscreen() {
        const btnText = document.getElementById('fullscreen-text');
        const btnIcon = document.getElementById('fullscreen-icon');
        
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                btnText.textContent = 'Salir Pantalla Completa';
                btnIcon.textContent = '❌';
            }).catch(err => {
                console.error(`Error al intentar activar pantalla completa: ${err.message}`);
            });
        } else {
            document.exitFullscreen().then(() => {
                btnText.textContent = 'Pantalla Completa';
                btnIcon.textContent = '📺';
            });
        }
    }

    // Escucha el cambio de estado nativo para asegurar la sincronía de los botones
    document.addEventListener('fullscreenchange', () => {
        const btnText = document.getElementById('fullscreen-text');
        const btnIcon = document.getElementById('fullscreen-icon');
        if (document.fullscreenElement) {
            btnText.textContent = 'Salir Pantalla Completa';
            btnIcon.textContent = '❌';
        } else {
            btnText.textContent = 'Pantalla Completa';
            btnIcon.textContent = '📺';
        }
    });