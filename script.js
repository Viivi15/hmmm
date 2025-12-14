document.addEventListener('DOMContentLoaded', (event) => {
    
    // =============================================== //
    // ==== JOURNEY INTRO LOGIC ==== //
    // =============================================== //
    const journeyIntro = document.getElementById('journey-intro');
    const desktopView = document.getElementById('desktop-view');
    const enterSpaceBtn = document.getElementById('enter-space-btn');
    const journeyScreens = document.querySelectorAll('.journey-screen');
    const journeyStarBg = document.querySelector('.journey-star-bg');
    
    let currentScreen = 1;
    const totalScreens = journeyScreens.length;
    const screenTimings = [4000, 4000, 5000, 5000, 99999]; // Time for each screen, last one is indefinite

    function nextJourneyScreen() {
        if (currentScreen >= totalScreens) return;

        const current = document.querySelector(`.journey-screen[data-screen="${currentScreen}"]`);
        if (current) current.classList.remove('active');

        currentScreen++;
        
        const next = document.querySelector(`.journey-screen[data-screen="${currentScreen}"]`);
        if (next) {
            next.classList.add('active');

            // Show stars on screen 2
            if (currentScreen === 2) {
                if(journeyStarBg) journeyStarBg.style.opacity = '0.1';
            }

            // Set timeout for the next transition
            setTimeout(nextJourneyScreen, screenTimings[currentScreen - 1]);
        }
    }

    // Start the journey
    if (journeyIntro) {
        setTimeout(nextJourneyScreen, screenTimings[0]);
    }
    
    // Handle transition to desktop
    if (enterSpaceBtn) {
        enterSpaceBtn.addEventListener('click', () => {
            journeyIntro.style.opacity = '0';
            // Optional: Add a sound effect here
            // const transitionSound = new Audio('path/to/sound.mp3');
            // transitionSound.play();

            setTimeout(() => {
                journeyIntro.style.display = 'none';
                desktopView.style.display = 'block';
            }, 1500); // Match CSS transition duration
        });
    }

    // =============================================== //
    // ==== ORIGINAL DESKTOP LOGIC ==== //
    // =============================================== //
    
    // Sparkle Generator
    const sparkleContainer = document.getElementById('sparkle-container');
    if (sparkleContainer) {
        for (let i = 0; i < 30; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.top = `${Math.random() * 100}vh`;
            sparkle.style.left = `${Math.random() * 100}vw`;
            sparkle.style.animationDelay = `${Math.random() * 5}s`;
            sparkle.style.animationDuration = `${Math.random() * 3 + 2}s`;
            sparkleContainer.appendChild(sparkle);
        }
    }

    // Make windows draggable
    const windows = document.querySelectorAll('.window');
    windows.forEach(win => {
        const titleBar = win.querySelector('.title-bar');
        if (!titleBar) return;

        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        titleBar.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            isDragging = true;
            win.style.zIndex = 10;
            windows.forEach(otherWin => { if (otherWin !== win) otherWin.style.zIndex = 1; });

            startX = e.clientX;
            startY = e.clientY;
            const rect = win.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                win.style.left = `${initialLeft + dx}px`;
                win.style.top = `${initialTop + dy}px`;
            }
        });

        document.addEventListener('mouseup', () => { isDragging = false; });
    });
});


// --- BASE DESKTOP UI FUNCTIONS (can be outside DOMContentLoaded) ---

// Function to Open Windows
function openWindow(id) {
    const windowEl = document.getElementById(id);
    if(windowEl) windowEl.style.display = 'block';
    // Reset the birthday app when opening it
    if (id === 'window-gift') {
        resetBirthdayApp();
    }
}

// Function to Close Windows
function closeWindow(id) {
    const windowEl = document.getElementById(id);
    if(windowEl) windowEl.style.display = 'none';
}

// Function to Start the Cosmic Journey
function startCosmicJourney() {
    const desktop = document.getElementById('desktop-screen');
    const cosmic = document.getElementById('cosmic-screen');
    
    if(!desktop || !cosmic) return;
    
    // Remove the class that contains display: none !important
    cosmic.classList.remove('hidden');

    desktop.style.transition = "opacity 0.5s ease-out";
    desktop.style.opacity = 0;
    
    setTimeout(() => {
        desktop.style.display = 'none';
        cosmic.style.display = 'flex';
        cosmic.style.opacity = 1;
    }, 500);
}


// --- NEW BIRTHDAY SURPRISE FUNCTIONS ---

// NAVIGATION & STATE RESET
function nextScreen(screenId) {
    document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active-screen'));
    const nextScreenEl = document.getElementById(screenId);
    if(nextScreenEl) nextScreenEl.classList.add('active-screen');
}

function resetBirthdayApp() {
    // Reset to the first screen
    nextScreen('screen-intro');
    
    // Reset cake
    const flame = document.getElementById('flame');
    const cakeMsg = document.getElementById('cake-msg');
    const btnBalloons = document.getElementById('btn-balloons');
    if(flame) flame.style.display = 'none';
    if(cakeMsg) cakeMsg.innerText = "Tap the candle to light it! 🕯️";
    if(btnBalloons) btnBalloons.classList.add('hidden');
    
    // Reset balloons
    balloonsPopped = 0;
    document.querySelectorAll('.balloon').forEach(b => {
        b.style.opacity = '1';
        b.style.transform = 'scale(1)';
        b.style.pointerEvents = 'auto';
    });
    const btnEnvelope = document.getElementById('btn-envelope');
    if(btnEnvelope) btnEnvelope.classList.add('hidden');

    // Reset envelope
    const envelopeFlap = document.querySelector('.envelope-flap');
    if(envelopeFlap) {
        envelopeFlap.style.transform = 'rotateX(0deg)';
        envelopeFlap.style.zIndex = '4';
    }
}

// 🕯️ CAKE LOGIC
function lightCandle() {
    const flame = document.getElementById('flame');
    const msg = document.getElementById('cake-msg');
    const btn = document.getElementById('btn-balloons');
    
    if (flame && msg && btn && flame.style.display !== 'block') {
        flame.style.display = 'block';
        msg.innerText = "YAY! Happy Birthday! 🎂";
        setTimeout(() => {
            btn.classList.remove('hidden');
        }, 1000);
    }
}

// 🎈 BALLOON LOGIC
let balloonsPopped = 0;
function popBalloon(element) {
    if (element.style.opacity === '0') return;
    
    element.style.transform = "scale(1.3)";
    setTimeout(() => {
        element.style.opacity = "0";
        element.style.pointerEvents = "none";
        balloonsPopped++;
        
        if (balloonsPopped === 4) {
            const btnEnvelope = document.getElementById('btn-envelope');
            if(btnEnvelope) btnEnvelope.classList.remove('hidden');
        }
    }, 200);
}

// 💌 ENVELOPE LOGIC
function openMainContent() {
    const envelopeFlap = document.querySelector('.envelope-flap');
    if (envelopeFlap) {
        envelopeFlap.style.transform = 'rotateX(180deg)';
        envelopeFlap.style.zIndex = '1';
    }
    
    setTimeout(() => {
        nextScreen('screen-feed');
    }, 800);
}

// 🎮 GAME LOGIC
let gameActive = false;
let gameScore = 0;
let gameSpawner;

function startGame() {
    if (gameActive) return;
    gameActive = true;
    gameScore = 0;
    const scoreEl = document.getElementById('score');
    if(scoreEl) scoreEl.innerText = gameScore;
    
    const startBtn = document.querySelector('.start-game-btn');
    const catcher = document.getElementById('catcher');
    if (startBtn) startBtn.style.display = 'none';
    if (catcher) catcher.style.display = 'block';
    
    const canvas = document.getElementById('game-canvas');
    if(!canvas) return;

    const moveCatcher = (e) => {
        const rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        // Center catcher on cursor and constrain
        let catcherWidth = catcher.offsetWidth;
        let newLeft = x - catcherWidth / 2;
        if (newLeft < 0) newLeft = 0;
        if (newLeft > rect.width - catcherWidth) newLeft = rect.width - catcherWidth;
        catcher.style.left = newLeft + 'px';
    };
    canvas.addEventListener('mousemove', moveCatcher);

    gameSpawner = setInterval(spawnGameHeart, 800);

    setTimeout(() => {
        endGame(moveCatcher);
    }, 15000);
}

function spawnGameHeart() {
    const canvas = document.getElementById('game-canvas');
    if (!gameActive || !canvas) return;

    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.className = 'falling-heart';
    heart.style.left = Math.random() * 90 + '%';
    canvas.appendChild(heart);
    
    const collisionCheck = setInterval(() => {
        const catcher = document.getElementById('catcher');
        if (!heart || !catcher) {
            clearInterval(collisionCheck);
            return;
        }
        const heartRect = heart.getBoundingClientRect();
        const catcherRect = catcher.getBoundingClientRect();
        if (heartRect.bottom > catcherRect.top && heartRect.right > catcherRect.left && heartRect.left < catcherRect.right) {
            heart.remove();
            gameScore++;
            const scoreEl = document.getElementById('score');
            if(scoreEl) scoreEl.innerText = gameScore;
            clearInterval(collisionCheck);
        }
    }, 50);

    setTimeout(() => {
        if(heart) heart.remove();
        clearInterval(collisionCheck);
    }, 1900);
}

function endGame(moveCatcherCallback) {
    gameActive = false;
    clearInterval(gameSpawner);
    
    const canvas = document.getElementById('game-canvas');
    if(!canvas) return;

    // Remove old hearts
    canvas.querySelectorAll('.falling-heart').forEach(h => h.remove());
    if (moveCatcherCallback) {
        canvas.removeEventListener('mousemove', moveCatcherCallback);
    }

    alert(`Game Over! You caught ${gameScore} hearts! ❤️`);
    
    const startBtn = document.querySelector('.start-game-btn');
    if(startBtn) {
        startBtn.style.display = 'block';
        startBtn.innerText = 'Play Again';
    }
    const catcher = document.getElementById('catcher');
    if(catcher) catcher.style.display = 'none';
}
