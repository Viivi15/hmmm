// =============================================== //
// ==== GLOBAL JOURNEY INTRO VARIABLES ==== //
// =============================================== //
let journeyIntro;
let desktopView;
let enterSpaceBtn;
let journeyScreens;
let journeyStarBg;

let currentScreen = 1; // Initial screen
let totalScreens;
const screenTimings = [4000, 4000, 5000, 5000, 99999]; // Time for each screen, last one is indefinite


// =============================================== //
// ==== JOURNEY INTRO LOGIC (Global Function) ==== //
// =============================================== //
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


document.addEventListener('DOMContentLoaded', (event) => {
    // Initialize global variables once DOM is ready
    journeyIntro = document.getElementById('journey-intro');
    desktopView = document.getElementById('desktop-view');
    enterSpaceBtn = document.getElementById('enter-space-btn');
    journeyScreens = document.querySelectorAll('.journey-screen');
    journeyStarBg = document.querySelector('.journey-star-bg');
    totalScreens = journeyScreens.length; // Set totalScreens after journeyScreens is populated

    // Handle transition to desktop (using globally accessible variables)
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

    // --- TASKBAR FUNCTIONS ---
    // Update clock immediately
    updateClock(); 

    // Close start menu when clicking elsewhere (using globally accessible variables)
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('start-menu');
        const btn = document.querySelector('.start-btn');
        if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
            menu.style.display = 'none';
        }
    });

}); // End of DOMContentLoaded

// --- BASE DESKTOP UI FUNCTIONS (can be outside DOMContentLoaded) ---

let zIndexCounter = 100; // Global for window z-index
let offset = 0; // Global for window staggering

// Function to Open Windows
function openWindow(id) {
    // new Audio("assets/sounds/click.mp3").play(); // Commented out for now as no audio file
    const win = document.getElementById(id);
    if (!win) return;

    win.style.display = 'flex'; // Make window visible before animation

    offset += 18; // slight stagger
    if (offset > 120) offset = 0;

    // Do not reposition the gift window or other specifically placed windows
    if (id !== 'window-gift' && id !== 'window-chat' && id !== 'window-v3') {
        win.style.left = `calc(50% - 260px + ${offset}px)`;
        win.style.top  = `calc(50% - 180px + ${offset}px)`;
    }

    win.style.zIndex = zIndexCounter++;

    // Reset animation/transition
    win.classList.remove("active");
    void win.offsetWidth; // Trigger reflow to restart CSS animations
    win.classList.add("active");

    // If it's the fancy blueprint window, implement character-by-character typing
    if (win.classList.contains('fancy')) {
        const paragraphs = win.querySelectorAll('.window-body p');
        let currentDelay = 0;
        const charTypingSpeed = 50; // Milliseconds per character

        function typeText(pElement, fullText, delayMs, charSpeedMs) {
            setTimeout(() => {
                pElement.style.visibility = 'visible'; // Make paragraph visible
                let i = 0;
                // Temporarily store original content to type character by character
                pElement.innerHTML = ''; // Clear content first
                const typingInterval = setInterval(() => {
                    if (i < fullText.length) {
                        // Basic check for HTML tag - very simple, might need refinement for complex HTML
                        if (fullText.substring(i, i + 1) === '<') {
                            const endIndex = fullText.indexOf('>', i);
                            if (endIndex !== -1) {
                                pElement.innerHTML += fullText.substring(i, endIndex + 1);
                                i = endIndex + 1;
                            } else {
                                pElement.innerHTML += fullText.substring(i, i + 1);
                                i++;
                            }
                        } else {
                            pElement.innerHTML += fullText.substring(i, i + 1);
                            i++;
                        }
                    } else {
                        clearInterval(typingInterval);
                    }
                }, charSpeedMs);
            }, delayMs);
        }

        paragraphs.forEach((p, index) => {
            // Store original HTML content before clearing
            p.dataset.originalHtml = p.innerHTML;
            p.innerHTML = ''; // Clear content initially
            p.style.visibility = 'hidden';

            const textContentLength = p.dataset.originalHtml.replace(/<[^>]*>/g, '').length; // Approximate text length, ignoring HTML tags for duration calculation

            // Add delay for each paragraph
            typeText(p, p.dataset.originalHtml, currentDelay, charTypingSpeed);
            currentDelay += (textContentLength * charTypingSpeed) + 1000; // Add time for typing + 1 second gap
        });
    }

    // Reset the birthday app when opening it
    if (id === 'window-gift') {
        resetBirthdayApp();
    }
}



// Function to Close Windows
function closeWindow(id) {
    const windowEl = document.getElementById(id);
    if(windowEl) {
      windowEl.classList.remove('active');
      windowEl.style.display = 'none';
    }
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

//NAVIGATION & STATE RESET
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

    // --- NEW: High Score Logic ---
    let highScore = localStorage.getItem('heartGameHighScore') || 0;
    let msg = `Game Over! You caught ${gameScore} hearts! ❤️`;
    
    if (gameScore > highScore) {
        localStorage.setItem('heartGameHighScore', gameScore);
        msg += `\n🌟 NEW HIGH SCORE! 🌟`;
    } else {
        msg += `\n(Best: ${highScore})`;
    }
    // -----------------------------

    alert(msg);
    
    const startBtn = document.querySelector('.start-game-btn');
    if(startBtn) {
        startBtn.style.display = 'block';
        startBtn.innerText = 'Play Again';
    }
    const catcher = document.getElementById('catcher');
    if(catcher) catcher.style.display = 'none';
}

// --- COSMIC TIMELINE OBSERVER ---
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.timeline-event').forEach(el => timelineObserver.observe(el));

// --- TASKBAR FUNCTIONS ---
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const timeString = `${hours}:${minutes} ${ampm}`;
    
    const clockEl = document.getElementById('taskbar-clock');
    if(clockEl) clockEl.innerText = timeString;
}
setInterval(updateClock, 1000); // Update every second
updateClock(); // Run immediately

function toggleStartMenu() {
    const menu = document.getElementById('start-menu');
    if (menu) {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }
}

// Close start menu when clicking elsewhere
document.addEventListener('click', (e) => {
    const menu = document.getElementById('start-menu');
    const btn = document.querySelector('.start-btn');
    if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
        menu.style.display = 'none';
    }
});

// =============================================== //
// ==== COUNTDOWN & PRELOADER LOGIC ==== //
// =============================================== //

// 1. CONFIGURATION
// SET THE BIRTHDAY DATE HERE (Year, Month (0-11), Day, Hour)
const targetDate = new Date(2026, 0, 30, 0, 0, 0).getTime(); // Example: January 30, 2026
// For testing, uncomment the line below to set timer to 10 seconds from now:
// const targetDate = new Date().getTime() + 10000; 

// 2. TIMING LOGIC
const loaderScreen = document.getElementById('cnt-loading');
const timerScreen = document.getElementById('cnt-timer');
const celebScreen = document.getElementById('cnt-celebrate');

// Simulate Loading for 3 seconds, then show Countdown
setTimeout(() => {
    if(loaderScreen) loaderScreen.classList.remove('active');
    if(timerScreen) timerScreen.classList.add('active');
    startTimer();
}, 3000); 

function startTimer() {
    const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update DOM
        if(document.getElementById('d')) document.getElementById('d').innerText = String(days).padStart(2, '0');
        if(document.getElementById('h')) document.getElementById('h').innerText = String(hours).padStart(2, '0');
        if(document.getElementById('m')) document.getElementById('m').innerText = String(minutes).padStart(2, '0');
        if(document.getElementById('s')) document.getElementById('s').innerText = String(seconds).padStart(2, '0');

        // If countdown ends
        if (distance < 0) {
            clearInterval(timerInterval);
            showCelebration();
        }
    }, 1000);
}

function showCelebration() {
    if(timerScreen) timerScreen.classList.remove('active');
    if(celebScreen) celebScreen.classList.add('active');
    startConfetti(); // Simple confetti effect
}

// 3. TRANSITION TO ORIGINAL JOURNEY
function startTheRealJourney() {
    // Fade out countdown wrapper
    const wrapper = document.getElementById('countdown-wrapper');
    const journeyIntro = document.getElementById('journey-intro'); // Get reference here

    if(wrapper) {
        wrapper.style.transition = "opacity 1s ease";
        wrapper.style.opacity = 0;
        setTimeout(() => {
            wrapper.style.display = 'none';
            
            // Explicitly make journeyIntro visible
            if (journeyIntro) {
                journeyIntro.style.display = 'block'; // Ensure it's displayed
                journeyIntro.style.opacity = '1'; // Ensure it's fully opaque
            }

            // --- TRIGGER THE ORIGINAL JOURNEY HERE ---
            // This calls the existing function from your original code
            nextJourneyScreen(); 
        }, 1000);
    }
}

// 4. SIMPLE CONFETTI EFFECT
function startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#ff3399', '#33ccff', '#ffff33', '#ffffff', '#cc33ff'];

    for(let i=0; i<150; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            speed: Math.random() * 3 + 2,
            wobble: Math.random() * 10
        });
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(p => {
            p.y += p.speed;
            p.x += Math.sin(p.wobble) * 2;
            p.wobble += 0.1;
            
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);

            if(p.y > canvas.height) p.y = -10;
        });
        requestAnimationFrame(animateConfetti);
    }
    animateConfetti();
}
