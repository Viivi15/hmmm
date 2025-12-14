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

    // Add this new check for the chat window:
    if (id === 'window-chat') {
        initChat();
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


// =============================================== //
// ==== WIDESCREEN STORY LOGIC (REVISED) ==== //
// =============================================== //

let currentPhotoIndex = 0;
let photosViewedCount = 0;
let notesFlippedCount = 0;
const totalPhotos = 2; // Based on home.html, two photo-card divs
const totalNotes = 3;  // Based on home.html, three note-card divs

function nextStorySlide(targetId) {
    const current = document.querySelector('.story-slide.active');
    if(current) current.classList.remove('active');

    setTimeout(() => {
        const next = document.getElementById(targetId);
        if(next) next.classList.add('active');
        
        // Specific initializations for new slides
        if (targetId === 'slide-photos') {
            initPhotoCarousel();
        } else if (targetId === 'slide-notes') {
            initNotesDisplay();
        }
    }, 400); 
    updateProgressBar(targetId);
}

function updateProgressBar(currentSlideId) {
    const slides = ["slide-intro", "slide-cake", "slide-photos", "slide-notes", "slide-playlist", "slide-game-intro", "slide-game-play", "slide-winner"];
    const currentIndex = slides.indexOf(currentSlideId);
    if (currentIndex > -1) {
        const progress = ((currentIndex + 1) / slides.length) * 100;
        const progressBar = document.getElementById('gift-progress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }
}

// CAKE LOGIC (Updated)
function lightCandle() {
    const flame = document.getElementById('flame');
    const msg = document.getElementById('cake-msg');
    const btn = document.getElementById('btn-after-cake');
    
    if (flame && flame.style.display !== 'block') {
        flame.style.display = 'block'; // Show flame
        msg.innerText = "YAY! Happy Birthday! 🎂";
        
        if(btn) {
            btn.classList.remove('hidden');
        }
    }
}

// PHOTO CAROUSEL LOGIC
function initPhotoCarousel() {
    currentPhotoIndex = 0;
    photosViewedCount = 0;
    const photoCards = document.querySelectorAll('#slide-photos .photo-card');
    photoCards.forEach((card, index) => {
        if (index === 0) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
    updatePhotoCarouselUI();
}

function navigatePhotos(direction) {
    const photoCards = document.querySelectorAll('#slide-photos .photo-card');
    photoCards[currentPhotoIndex].classList.remove('active');
    
    currentPhotoIndex += direction;
    if (currentPhotoIndex < 0) currentPhotoIndex = photoCards.length - 1;
    if (currentPhotoIndex >= photoCards.length) currentPhotoIndex = 0;
    
    photoCards[currentPhotoIndex].classList.add('active');
    
    // Mark photo as viewed
    photoCards[currentPhotoIndex].dataset.viewed = 'true';
    photosViewedCount = document.querySelectorAll('#slide-photos .photo-card[data-viewed="true"]').length;

    updatePhotoCarouselUI();
}

function updatePhotoCarouselUI() {
    const prevBtn = document.querySelector('#slide-photos .prev-btn');
    const nextBtn = document.querySelector('#slide-photos .next-btn');
    const continueBtn = document.getElementById('btn-after-photos');

    // Hide prev/next if only one photo
    if (totalPhotos <= 1) {
        if (prevBtn) prevBtn.classList.add('hidden');
        if (nextBtn) nextBtn.classList.add('hidden');
    } else {
        if (prevBtn) prevBtn.classList.remove('hidden');
        if (nextBtn) nextBtn.classList.remove('hidden');
    }
    
    // Show continue button only when all photos have been viewed
    if (continueBtn) {
        if (photosViewedCount >= totalPhotos) {
            continueBtn.classList.remove('hidden');
        } else {
            continueBtn.classList.add('hidden');
        }
    }
}


// NOTES FLIPPING LOGIC
function initNotesDisplay() {
    notesFlippedCount = 0;
    const noteCards = document.querySelectorAll('#slide-notes .note-card');
    noteCards.forEach(card => {
        card.classList.remove('flipped');
        card.removeEventListener('click', flipNoteCard); // Remove old listeners
        card.addEventListener('click', flipNoteCard); // Add new listener
        card.dataset.flipped = 'false'; // Reset flipped state
    });
    document.getElementById('btn-after-notes').classList.add('hidden'); // Hide continue button
}

function flipNoteCard(event) {
    const card = event.currentTarget;
    if (card.dataset.flipped === 'false') {
        card.classList.add('flipped');
        card.dataset.flipped = 'true';
        notesFlippedCount++;
        
        if (notesFlippedCount >= totalNotes) {
            document.getElementById('btn-after-notes').classList.remove('hidden'); // Show continue button
        }
    }
}


// GAME LOGIC (Updated for Widescreen)
let newGameScore = 0;
let newGameActive = false;
let newGameSpawner;
let gameTimerInterval;
let gameTime = 30; // 30 seconds for the game

function startGameTransition() {
    nextStorySlide('slide-game-play');
    setTimeout(startNewGame, 1000); // Wait for slide to appear
}

function startNewGame() {
    newGameScore = 0;
    newGameActive = true;
    gameTime = 30; // Reset game time
    document.getElementById('new-score').innerText = "0";
    document.getElementById('game-timer').innerText = `${gameTime}s`;
    
    const canvas = document.getElementById('new-game-canvas');
    const catcher = document.getElementById('new-catcher');

    // Mouse Movement
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        catcher.style.left = `${x}px`;
    });

    // Game Timer
    gameTimerInterval = setInterval(() => {
        gameTime--;
        document.getElementById('game-timer').innerText = `${gameTime}s`;
        if (gameTime <= 0) {
            endNewGame();
        }
    }, 1000);

    // Spawn Hearts
    newGameSpawner = setInterval(() => {
        if(!newGameActive) return;
        
        const heart = document.createElement('div');
        heart.innerText = "❤️";
        heart.style.position = "absolute";
        heart.style.left = Math.random() * 90 + "%";
        heart.style.top = "-30px";
        heart.style.fontSize = "24px";
        heart.style.transition = "top 2s linear";
        canvas.appendChild(heart);

        // Animate falling
        setTimeout(() => { heart.style.top = "420px"; }, 50);

        // Detect Catch
        const checkHit = setInterval(() => {
            const hRect = heart.getBoundingClientRect();
            const cRect = catcher.getBoundingClientRect();
            
            if (hRect.bottom >= cRect.top && hRect.right >= cRect.left && hRect.left <= cRect.right) {
                newGameScore++;
                document.getElementById('new-score').innerText = newGameScore;
                heart.remove();
                clearInterval(checkHit);
                
                if(newGameScore >= 5) {
                    endNewGame();
                }
            }
        }, 50);

        // Cleanup
        setTimeout(() => { 
            if(heart.parentNode) heart.remove(); 
            clearInterval(checkHit);
        }, 2050);

    }, 800);
}

function endNewGame() {
    newGameActive = false;
    clearInterval(newGameSpawner);
    clearInterval(gameTimerInterval); // Stop game timer
    
    // Remove all hearts from canvas
    document.querySelectorAll('#new-game-canvas .heart').forEach(heart => heart.remove());

    setTimeout(() => {
        nextStorySlide('slide-winner');
    }, 500);
}

function resetBirthdayApp() {
    // Reset to intro
    document.querySelectorAll('.story-slide').forEach(s => s.classList.remove('active'));
    document.getElementById('slide-intro').classList.add('active');
    
    // Reset Cake
    document.getElementById('flame').style.display = 'none';
    document.getElementById('btn-after-cake').classList.add('hidden');
    document.getElementById('cake-msg').innerText = "Tap the candle to light it!";

    // Reset Photos
    initPhotoCarousel(); // Re-initialize to reset state

    // Reset Notes
    initNotesDisplay(); // Re-initialize to reset state

    // Reset Game (if necessary)
    newGameScore = 0;
    newGameActive = false;
    if (newGameSpawner) clearInterval(newGameSpawner);
    if (gameTimerInterval) clearInterval(gameTimerInterval);
    document.querySelectorAll('#new-game-canvas .heart').forEach(heart => heart.remove());
}

// --- SECURE CHAT LOGIC ---

// 1. The Messages (Edit these!)
const chatMessages = [
    { type: 'system', text: 'ENCRYPTED CONNECTION SECURED' },
    { type: 'incoming', text: 'Hey... you there?', delay: 1000 },
    { type: 'incoming', text: 'I tried to find the right words for today.', delay: 2500 },
    { type: 'incoming', text: 'Just wanted to remind you that you are capable of amazing things.', delay: 4500 },
    { type: 'incoming', text: 'This year is yours to conquer. I believe in you. 💙', delay: 7000 },
    { type: 'system', text: 'ATTACHMENT RECEIVED: [Virtual_Hug.zip]' },
    { type: 'incoming', text: 'Happy Birthday, King. Over and out. 🦇', delay: 9500 }
];

let chatInitialized = false;

function initChat() {
    if (chatInitialized) return;
    chatInitialized = true;
    
    const feed = document.getElementById('chat-feed');
    const status = document.getElementById('connection-status');
    
    // Show "Connected" after a moment
    setTimeout(() => {
        if(status) status.innerText = "CONNECTED: SIGNAL STRONG";
        if(status) status.style.color = "#00ff88"; // Green
    }, 1500);

    // Loop through messages
    chatMessages.forEach((msg, index) => {
        setTimeout(() => {
            // Create Message Element
            const div = document.createElement('div');
            div.className = `chat-msg ${msg.type}`;
            div.innerText = msg.text;
            
            // Add to feed
            feed.appendChild(div);
            
            // Scroll to bottom
            feed.scrollTop = feed.scrollHeight;
            
            // Optional sound effect could go here
            // new Audio('pop.mp3').play();
            
        }, msg.delay || 0); // Default to 0 delay for system msgs
    });
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
