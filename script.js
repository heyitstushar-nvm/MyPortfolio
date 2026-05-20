const questions = [
    {
        type: 'choice',
        text: "Wait, is today your birthday?",
        answers: ["Yes it is!", "Obviously!"]
    },
    {
        type: 'choice',
        text: "Is today 17 May?",
        answers: ["Yes!", "Yep!"]
    },
    {
        type: 'input',
        text: "Enter your name:"
    },
    {
        type: 'message',
        text: "Happy Birthday {name}!",
        buttonText: "Next"
    },
    {
        type: 'choice',
        text: "Then see the surprise...",
        answers: ["Show me!", "I'm ready!"]
    }
];

let currentQuestion = 0;
let enteredName = "";

// Date Target: 17 May of the current year
const currentYear = new Date().getFullYear();
const targetDate = new Date(`May 17, ${currentYear} 00:00:00`).getTime();

// Elements
const timerScreen = document.getElementById('timer-screen');
const startBtn = document.getElementById('start-btn');
const landingScreen = document.getElementById('landing');
const questionsScreen = document.getElementById('questions');
const finalScreen = document.getElementById('final');
const questionText = document.getElementById('question-text');
const buttonGroup = document.querySelector('.button-group');
const progressBar = document.getElementById('progress-bar');
const bgMusic = document.getElementById('bg-music');
const bgDecorations = document.getElementById('bg-decorations');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createFloatingHearts();
    checkTimer();
});

function checkTimer() {
    const now = new Date().getTime();
    // DEVELOPMENT OVERRIDE: Uncomment below to restore the timer
    // if (now < targetDate) {
    //     timerScreen.classList.add('active');
    //     startCountdown();
    // } else {
    //     landingScreen.classList.add('active');
    // }
    
    // Force show landing screen for development
    landingScreen.classList.add('active');
}

function startCountdown() {
    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance <= 0) {
            clearInterval(interval);
            switchScreen(timerScreen, landingScreen);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('mins').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('secs').textContent = seconds.toString().padStart(2, '0');
    }, 1000);
}

// Event Listeners
startBtn.addEventListener('click', () => {
    switchScreen(landingScreen, questionsScreen);
    loadQuestion(0);
});

function loadQuestion(index) {
    if (index >= questions.length) {
        showFinalScreen();
        return;
    }

    const q = questions[index];
    
    // Animate out old content
    if (index > 0) {
        questionText.classList.add('fade-out');
        buttonGroup.classList.add('fade-out');
        
        setTimeout(() => {
            updateQuestionContent(q, index);
            questionText.classList.remove('fade-out');
            buttonGroup.classList.remove('fade-out');
            questionText.classList.add('fade-in');
            buttonGroup.classList.add('fade-in');
            
            setTimeout(() => {
                questionText.classList.remove('fade-in');
                buttonGroup.classList.remove('fade-in');
            }, 400);
        }, 400);
    } else {
        updateQuestionContent(q, index);
    }
}

function updateQuestionContent(q, index) {
    questionText.textContent = q.text.replace('{name}', enteredName);
    buttonGroup.innerHTML = '';
    
    if (q.type === 'input') {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'name-input';
        input.placeholder = 'Your Name';
        
        const btn = document.createElement('button');
        btn.className = 'primary-btn';
        btn.textContent = 'Enter';
        btn.style.marginTop = '15px';
        
        btn.addEventListener('click', () => {
            if (input.value.trim() !== '') {
                enteredName = input.value.trim();
                currentQuestion++;
                loadQuestion(currentQuestion);
            }
        });
        
        buttonGroup.appendChild(input);
        buttonGroup.appendChild(btn);
    } else if (q.type === 'message') {
        const btn = document.createElement('button');
        btn.className = 'primary-btn';
        btn.textContent = q.buttonText;
        btn.addEventListener('click', () => {
            currentQuestion++;
            loadQuestion(currentQuestion);
        });
        buttonGroup.appendChild(btn);
    } else {
        q.answers.forEach(ans => {
            const btn = document.createElement('button');
            btn.className = 'secondary-btn';
            btn.textContent = ans;
            btn.addEventListener('click', () => {
                currentQuestion++;
                loadQuestion(currentQuestion);
            });
            buttonGroup.appendChild(btn);
        });
    }

    // Update Progress
    const progress = ((index + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function switchScreen(hideScreen, showScreen) {
    hideScreen.classList.remove('active');
    setTimeout(() => {
        showScreen.classList.add('active');
    }, 800); // Wait for fade out
}

function showFinalScreen() {
    switchScreen(questionsScreen, finalScreen);
    
    // Ensure music is playing at full volume now
    bgMusic.volume = 1;
    bgMusic.play().catch(e => console.log("Audio autoplay prevented", e));

    createConfetti();
    
    // Wait for screen to become visible, then animate photos
    setTimeout(animatePhotos, 800);
}

function animatePhotos() {
    const photoStack = document.getElementById('photo-stack');
    const finalMessage = document.getElementById('final-message');
    
    const photos = [
        'assets/photo1.jpg',
        'assets/photo2.jpg',
        'assets/photo3.jpg',
        'assets/photo4.jpg',
        'assets/photo5.jpg'
    ];
    
    const rotations = [-12, 8, -5, 10, -3];

    photos.forEach((src, index) => {
        setTimeout(() => {
            const frame = document.createElement('div');
            frame.className = 'stacked-photo';
            
            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Memory ' + (index + 1);
            
            frame.appendChild(img);
            photoStack.appendChild(frame);
            
            // Trigger reflow
            void frame.offsetWidth;
            
            // Animate to final position
            frame.style.opacity = '1';
            frame.style.transform = `scale(1) translateY(0) rotate(${rotations[index]}deg)`;
            
        }, index * 800); // 0.8s between each photo dropping
    });

    // Show the final message after all photos appear
    setTimeout(() => {
        finalMessage.style.transition = 'opacity 1s ease';
        finalMessage.style.opacity = '1';
    }, photos.length * 800 + 500);
}

// Background Decorations
function createFloatingHearts() {
    const symbols = ['❤️', '✨', '💖', '🌸'];
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.animationDuration = `${Math.random() * 10 + 5}s`;
        heart.style.animationDelay = `${Math.random() * 5}s`;
        heart.style.fontSize = `${Math.random() * 20 + 10}px`;
        bgDecorations.appendChild(heart);
    }
}

// Confetti Effect for Final Screen
function createConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#ffb6c1', '#ff69b4', '#ff1493', '#fff'];
    
    for (let i = 0; i < 50; i++) {
        const conf = document.createElement('div');
        conf.style.position = 'absolute';
        conf.style.width = `${Math.random() * 10 + 5}px`;
        conf.style.height = `${Math.random() * 10 + 5}px`;
        conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        conf.style.top = '-10px';
        conf.style.left = `${Math.random() * 100}vw`;
        conf.style.opacity = Math.random();
        conf.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        // Animation
        const duration = Math.random() * 3 + 2;
        conf.style.animation = `fall ${duration}s linear infinite`;
        conf.style.animationDelay = `${Math.random() * 2}s`;
        
        container.appendChild(conf);
    }

    // Add keyframes for fall if not exists
    if (!document.getElementById('confetti-styles')) {
        const style = document.createElement('style');
        style.id = 'confetti-styles';
        style.innerHTML = `
            @keyframes fall {
                to {
                    transform: translateY(100vh) rotate(720deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
}
