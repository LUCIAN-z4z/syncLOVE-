// ========== COUNTDOWN TIMER ==========
function updateCountdown() {
    // SET YOUR MEETING DATE HERE
    const meetingDate = new Date(2025, 11, 31); // 31 December 2025
    const now = new Date();
    
    const diff = meetingDate - now;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (86400000)) / (3600000));
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    document.getElementById('countdown').innerHTML = 
        `${days}d ${hours}h ${minutes}m ${seconds}s`;
    
    // Days together
    const startDate = new Date(2024, 0, 1); // SET YOUR START DATE
    const togetherMs = now - startDate;
    const togetherDays = Math.floor(togetherMs / (1000 * 60 * 60 * 24));
    document.getElementById('daysTogether').innerHTML = togetherDays;
}

setInterval(updateCountdown, 1000);

// ========== VIRTUAL HUGS & KISSES ==========
function sendHug() {
    showMessage("🤗 Hug sent! ❤️");
}

function sendKiss() {
    showMessage("💋 Kiss sent! 😘");
}

function showMessage(msg) {
    const msgDiv = document.getElementById('actionMessage');
    msgDiv.innerHTML = msg;
    msgDiv.style.animation = 'pop 0.3s ease';
    setTimeout(() => {
        msgDiv.innerHTML = '';
    }, 2000);
}

// ========== VIDEO CALL (Jitsi Meet) ==========
let api = null;

function startVideoCall() {
    const domain = 'meet.jit.si';
    const options = {
        roomName: 'SyncLOVE_Call_' + Date.now(),
        width: '100%',
        height: 500,
        parentNode: document.querySelector('#meet'),
        configOverwrite: {
            startWithAudioMuted: true,
            startWithVideoMuted: false
        },
        interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
                'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
                'tileview', 'videobackgroundblur', 'download', 'help',
                'mute-everyone', 'security'
            ]
        }
    };
    
    document.getElementById('meet').style.display = 'block';
    api = new JitsiMeetExternalAPI(domain, options);
}

function shareScreen() {
    if (api) {
        api.executeCommand('toggleShareScreen');
    } else {
        alert('Start video call first!');
    }
}

// ========== PHOTO GALLERY ==========
let photos = [];

function uploadPhotos() {
    const input = document.getElementById('photoUpload');
    const files = input.files;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            photos.push(e.target.result);
            displayGallery();
        };
        
        reader.readAsDataURL(file);
    }
}

function displayGallery() {
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';
    
    photos.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img src="${photo}" alt="Memory ${index + 1}">
            <div class="overlay" onclick="deletePhoto(${index})">❌ Delete</div>
        `;
        grid.appendChild(item);
    });
}

function deletePhoto(index) {
    photos.splice(index, 1);
    displayGallery();
}

// ========== COMMON PLAYLIST ==========
let currentSong = null;
let isPlaying = false;

function playSong(songId) {
    // Simulate playing song
    currentSong = songId;
    isPlaying = true;
    showMessage(`🎵 Playing: ${songId}`);
    
    // In real app, you'd sync with partner using WebSocket
    localStorage.setItem('currentSong', songId);
    localStorage.setItem('songPlaying', 'true');
}

function syncPlay() {
    if (currentSong) {
        isPlaying = true;
        localStorage.setItem('songPlaying', 'true');
        showMessage('▶️ Playing together!');
    }
}

function syncPause() {
    isPlaying = false;
    localStorage.setItem('songPlaying', 'false');
    showMessage('⏸️ Paused');
}

function addSong() {
    const link = document.getElementById('songLink').value;
    if (link) {
        const container = document.getElementById('playlistContainer');
        const item = document.createElement('div');
        item.className = 'playlist-item';
        item.innerHTML = `
            <span>🎵 New Song</span>
            <button onclick="playSong('new')">Play</button>
        `;
        container.appendChild(item);
        document.getElementById('songLink').value = '';
    }
}

// ========== PRIVATE CHAT ==========
let messages = [];

function sendMessage() {
    const input = document.getElementById('chatMessage');
    const msg = input.value.trim();
    
    if (msg) {
        messages.push({
            text: msg,
            time: new Date().toLocaleTimeString(),
            isMe: true
        });
        
        displayMessages();
        input.value = '';
        
        // Save to localStorage
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
}

function displayMessages() {
    const container = document.getElementById('chatMessages');
    container.innerHTML = '';
    
    messages.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${msg.isMe ? 'my-message' : ''}`;
        msgDiv.innerHTML = `
            <strong>${msg.isMe ? 'Me' : 'Partner'}</strong>
            <p>${msg.text}</p>
            <small>${msg.time}</small>
        `;
        container.appendChild(msgDiv);
    });
    
    container.scrollTop = container.scrollHeight;
}

function addEmoji(emoji) {
    const input = document.getElementById('chatMessage');
    input.value += emoji;
}

// ========== DAILY QUESTIONS ==========
const questions = [
    "Aaj tumhe sabse zyada kya yaad aaya?",
    "Kal kya special karna chahenge?",
    "Tumhari favorite memory hamari?",
    "Kya cheez tumhe sabse zyada pasand hai mere baare mein?",
    "Agle saath 5 saal mein kya karna chahenge?"
];

let currentQuestion = 0;
let answers = [];

function loadDailyQuestion() {
    const today = new Date().getDate();
    currentQuestion = today % questions.length;
    document.getElementById('dailyQuestion').innerHTML = 
        questions[currentQuestion];
    
    // Load previous answers
    const saved = localStorage.getItem('answers');
    if (saved) {
        answers = JSON.parse(saved);
        displayAnswers();
    }
}

function submitAnswer() {
    const answer = document.getElementById('answerInput').value;
    if (answer) {
        answers.push({
            question: questions[currentQuestion],
            answer: answer,
            date: new Date().toLocaleDateString()
        });
        
        localStorage.setItem('answers', JSON.stringify(answers));
        displayAnswers();
        document.getElementById('answerInput').value = '';
    }
}

function displayAnswers() {
    const container = document.getElementById('previousAnswers');
    container.innerHTML = '<h3>Previous Answers:</h3>';
    
    answers.slice(-5).reverse().forEach(ans => {
        const div = document.createElement('div');
        div.className = 'answer-item';
        div.innerHTML = `
            <p><strong>${ans.date}</strong></p>
            <p>${ans.question}</p>
            <p>💬 ${ans.answer}</p>
        `;
        container.appendChild(div);
    });
}

// ========== SHARED CALENDAR ==========
let currentDate = new Date();
let events = [];

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    document.getElementById('currentMonth').innerHTML = 
        currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    
    let grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        grid.innerHTML += '<div class="calendar-day"></div>';
    }
    
    // Fill the days
    for (let d = 1; d <= lastDate; d++) {
        const hasEvent = events.some(e => 
            new Date(e.date).getDate() === d && 
            new Date(e.date).getMonth() === month
        );
        
        grid.innerHTML += `
            <div class="calendar-day ${hasEvent ? 'has-event' : ''}" 
                 onclick="selectDate(${year}, ${month}, ${d})">
                ${d}
            </div>
        `;
    }
    
    displayEvents();
}

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

function selectDate(year, month, day) {
    document.getElementById('eventDate').value = 
        `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function addEvent() {
    const date = document.getElementById('eventDate').value;
    const desc = document.getElementById('eventDesc').value;
    
    if (date && desc) {
        events.push({ date, desc });
        localStorage.setItem('events', JSON.stringify(events));
        renderCalendar();
        document.getElementById('eventDesc').value = '';
    }
}

function displayEvents() {
    const list = document.getElementById('eventsList');
    list.innerHTML = '<h3>Upcoming Events:</h3>';
    
    const sorted = events.sort((a, b) => new Date(a.date) - new Date(b.date));
    sorted.slice(0, 5).forEach(event => {
        list.innerHTML += `
            <div class="event-item">
                <strong>${event.date}</strong>: ${event.desc}
            </div>
        `;
    });
}

// ========== LOVE QUIZ ==========
const quizQuestions = [
    {
        question: "Meri favorite color kaunsa hai?",
        options: ["Red", "Blue", "Black", "Pink"],
        correct: 1
    },
    {
        question: "Humari pehli mulakat kahan hui thi?",
        options: ["College", "Park", "Cafe", "Online"],
        correct: 2
    },
    {
        question: "Mera favorite food kya hai?",
        options: ["Pizza", "Burger", "Samosa", "Chocolate"],
        correct: 0
    }
];

let currentQuiz = 0;
let quizScore = 0;
let selectedOption = -1;

function loadQuiz() {
    const q = quizQuestions[currentQuiz];
    document.getElementById('quizQuestion').innerHTML = q.question;
    
    let options = '';
    q.options.forEach((opt, index) => {
        options += `
            <div class="quiz-option" onclick="selectOption(${index})">
                ${opt}
            </div>
        `;
    });
    
    document.getElementById('quizOptions').innerHTML = options;
}

function selectOption(index) {
    selectedOption = index;
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    event.target.classList.add('selected');
}

function checkQuizAnswer() {
    if (selectedOption === -1) {
        alert('Select an option first!');
        return;
    }
    
    if (selectedOption === quizQuestions[currentQuiz].correct) {
        quizScore++;
        showMessage('✅ Correct!');
    } else {
        showMessage('❌ Wrong!');
    }
    
    currentQuiz++;
    if (currentQuiz < quizQuestions.length) {
        loadQuiz();
    } else {
        document.getElementById('quizContainer').innerHTML = `
            <h3>Quiz Complete!</h3>
            <p>Your Score: ${quizScore}/${quizQuestions.length}</p>
        `;
    }
    
    document.getElementById('quizScore').innerHTML = 
        `Score: ${quizScore}/${quizQuestions.length}`;
    
    selectedOption = -1;
}

// ========== INITIALIZATION ==========
window.onload = function() {
    updateCountdown();
    loadDailyQuestion();
    renderCalendar();
    loadQuiz();
    
    // Load saved data
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
        messages = JSON.parse(savedMessages);
        displayMessages();
    }
    
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
        events = JSON.parse(savedEvents);
    }
    
    // Check for partner's activity (simulated)
    setInterval(checkPartnerActivity, 5000);
};

// Simulate partner activity
function checkPartnerActivity() {
    const songPlaying = localStorage.getItem('songPlaying');
    if (songPlaying === 'true' && !isPlaying) {
        showMessage('🎵 Partner is listening to music!');
    }
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
