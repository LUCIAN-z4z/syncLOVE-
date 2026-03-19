// Modal Functions
function showCreateModal() {
    document.getElementById('createModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeCreateModal() {
    document.getElementById('createModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showJoinModal() {
    document.getElementById('joinModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeJoinModal() {
    document.getElementById('joinModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Step navigation
function nextStep(step) {
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'none';
    document.getElementById(`step${step}`).style.display = 'block';
}

// Secret code validation
let usedCodes = ['LOVE@2023#', 'HEART2024']; // Simulated database

function checkCode() {
    const code = document.getElementById('secretCode').value;
    
    // Check length
    if (code.length === 10) {
        document.getElementById('req1').classList.add('valid');
    } else {
        document.getElementById('req1').classList.remove('valid');
        showMessage('Code must be 10 characters!', 'error');
        return;
    }
    
    // Check if unique
    if (usedCodes.includes(code)) {
        document.getElementById('req2').classList.remove('valid');
        showMessage('This code is already taken! Try another.', 'error');
    } else {
        document.getElementById('req2').classList.add('valid');
        showMessage('✓ Code available!', 'success');
        
        // Generate room ID
        const roomId = 'LOVE-' + Math.random().toString(36).substr(2, 8).toUpperCase();
        document.getElementById('roomId').innerText = roomId;
        document.getElementById('inviteLink').value = `https://lovesync.app/room/${roomId}`;
        
        // Move to next step after 1 second
        setTimeout(() => {
            nextStep(3);
        }, 1000);
    }
}

function showMessage(msg, type) {
    const messageDiv = document.getElementById('codeMessage');
    messageDiv.innerHTML = msg;
    messageDiv.className = `message-box ${type}-message`;
}

// Copy invite link
function copyLink() {
    const link = document.getElementById('inviteLink');
    link.select();
    document.execCommand('copy');
    
    // Show tooltip
    alert('Link copied! Share it with your partner.');
}

function goToRoom() {
    // Redirect to room page
    window.location.href = '/room.html';
}

// Join tabs
function switchJoinTab(tab) {
    if (tab === 'link') {
        document.querySelectorAll('.join-tab')[0].classList.add('active');
        document.querySelectorAll('.join-tab')[1].classList.remove('active');
        document.getElementById('joinViaLink').classList.add('active');
        document.getElementById('joinViaCode').classList.remove('active');
    } else {
        document.querySelectorAll('.join-tab')[0].classList.remove('active');
        document.querySelectorAll('.join-tab')[1].classList.add('active');
        document.getElementById('joinViaLink').classList.remove('active');
        document.getElementById('joinViaCode').classList.add('active');
    }
}

// Join functions
function joinViaLink() {
    // Simulate joining via link
    showJoinSuccess();
}

function joinViaCode() {
    const roomId = document.getElementById('joinRoomId').value;
    const code = document.getElementById('joinSecretCode').value;
    
    if (roomId && code) {
        showJoinSuccess();
    } else {
        alert('Please fill all fields!');
    }
}

function showJoinSuccess() {
    alert('Successfully joined the room!');
    window.location.href = '/room.html';
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animate on scroll
window.addEventListener('scroll', function() {
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (cardTop < windowHeight - 100) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
});

// Initialize animations
document.addEventListener('DOMContentLoaded', function() {
    // Set initial opacity for animation
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.5s ease';
    });
});
// ========== HIGH-LEVEL SECURITY ==========

// 1. SECURE ROOM ID GENERATION
function generateSecureRoomID() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    const randomValues = new Uint8Array(16);
    crypto.getRandomValues(randomValues);
    
    for (let i = 0; i < 16; i++) {
        id += chars[randomValues[i] % chars.length];
    }
    const timestamp = Date.now().toString(36).toUpperCase();
    return `${id}-${timestamp}`;
}

// 2. DEVICE FINGERPRINTING
async function generateFingerprint() {
    const components = [];
    components.push(navigator.userAgent);
    components.push(navigator.language);
    components.push(screen.width + 'x' + screen.height);
    components.push(navigator.hardwareConcurrency);
    
    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        components.push(ipData.ip);
    } catch (e) {}
    
    const fingerprint = await sha256(components.join('|||'));
    localStorage.setItem('deviceFingerprint', fingerprint);
    return fingerprint;
}

// SHA-256 Hash
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 3. PASSWORD STRENGTH CHECKER
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/)) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    
    const bar = document.getElementById('strengthBar');
    if (bar) {
        bar.style.width = strength + '%';
        if (strength <= 50) bar.style.background = 'red';
        else if (strength <= 75) bar.style.background = 'orange';
        else bar.style.background = 'green';
    }
    
    return strength === 100;
}

// 4. ROOM DATABASE (in-memory for demo)
const secureRooms = {};

// 5. CREATE SECURE ROOM
function createSecureRoom() {
    const password = document.getElementById('roomPassword').value;
    
    if (!checkPasswordStrength(password)) {
        alert('❌ Password is not strong enough!');
        return false;
    }
    
    const roomId = generateSecureRoomID();
    const fingerprint = localStorage.getItem('deviceFingerprint');
    
    secureRooms[roomId] = {
        id: roomId,
        password: password,
        creatorFingerprint: fingerprint,
        allowedDevices: [fingerprint],
        accessLog: [],
        createdAt: Date.now(),
        expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
    };
    
    // Store room info
    localStorage.setItem('currentRoom', roomId);
    localStorage.setItem('room_' + roomId, JSON.stringify(secureRooms[roomId]));
    
    // Generate OTP for partner
    generateOTP(roomId);
    
    alert('✅ Secure room created! Share this ID with partner: ' + roomId);
    return roomId;
}

// 6. GENERATE OTP
function generateOTP(roomId) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpData = {
        code: otp,
        roomId: roomId,
        expires: Date.now() + 300000 // 5 minutes
    };
    
    localStorage.setItem('otp_' + roomId, JSON.stringify(otpData));
    
    // In real app, send via SMS/Email
    alert('🔐 Your OTP for partner: ' + otp + '\nShare this securely!');
    return otp;
}

// 7. VERIFY OTP
function verifyOTP() {
    const enteredOTP = document.getElementById('otpInput').value;
    const roomId = localStorage.getItem('currentRoom');
    
    const stored = JSON.parse(localStorage.getItem('otp_' + roomId));
    
    if (!stored || stored.expires < Date.now()) {
        alert('❌ OTP expired!');
        return false;
    }
    
    if (stored.code == enteredOTP) {
        localStorage.removeItem('otp_' + roomId);
        alert('✅ OTP verified! You can now join the room.');
        return true;
    }
    
    alert('❌ Invalid OTP!');
    return false;
}

// 8. RATE LIMITING
const rateLimits = {};

function checkRateLimit(action, userId) {
    const key = action + '_' + userId;
    const now = Date.now();
    
    if (!rateLimits[key]) {
        rateLimits[key] = { attempts: 1, firstAttempt: now };
        return true;
    }
    
    const limit = rateLimits[key];
    
    if (now - limit.firstAttempt < 60000) { // 1 minute
        limit.attempts++;
        
        if (limit.attempts > 5) {
            alert('⏰ Too many attempts. Try after 1 minute.');
            return false;
        }
    } else {
        limit.attempts = 1;
        limit.firstAttempt = now;
    }
    
    return true;
}

// 9. SECURE JOIN ROOM
async function secureJoinRoom(roomId, password) {
    // Rate limit check
    const userId = localStorage.getItem('deviceFingerprint') || 'unknown';
    if (!checkRateLimit('JOIN', userId)) return false;
    
    // Get room data
    const roomData = localStorage.getItem('room_' + roomId);
    if (!roomData) {
        alert('❌ Room not found!');
        return false;
    }
    
    const room = JSON.parse(roomData);
    
    // Check expiry
    if (room.expiresAt < Date.now()) {
        alert('❌ Room expired!');
        return false;
    }
    
    // Verify password
    if (room.password !== password) {
        alert('❌ Wrong password!');
        return false;
    }
    
    // Get device fingerprint
    const fingerprint = localStorage.getItem('deviceFingerprint');
    
    // Check if device is allowed
    if (!room.allowedDevices.includes(fingerprint)) {
        // Request OTP verification
        const otpVerified = verifyOTP();
        if (!otpVerified) return false;
        
        // Add device to allowed list
        room.allowedDevices.push(fingerprint);
        localStorage.setItem('room_' + roomId, JSON.stringify(room));
    }
    
    // Log access
    logAccess(roomId, 'SUCCESS');
    
    alert('✅ Successfully joined secure room!');
    return true;
}

// 10. ACCESS LOGGING
function logAccess(roomId, status) {
    const log = {
        timestamp: Date.now(),
        roomId: roomId,
        status: status,
        fingerprint: localStorage.getItem('deviceFingerprint'),
        userAgent: navigator.userAgent
    };
    
    const logs = JSON.parse(localStorage.getItem('accessLogs') || '[]');
    logs.push(log);
    localStorage.setItem('accessLogs', JSON.stringify(logs.slice(-50))); // Keep last 50
    
    // Also store in room-specific log
    const roomData = JSON.parse(localStorage.getItem('room_' + roomId) || '{}');
    if (!roomData.accessLog) roomData.accessLog = [];
    roomData.accessLog.push(log);
    localStorage.setItem('room_' + roomId', JSON.stringify(roomData));
}

// 11. ENCRYPTION FOR MESSAGES
function encryptMessage(message, roomId) {
    const key = roomId.slice(-8); // Simple key from room ID
    let encrypted = '';
    
    for (let i = 0; i < message.length; i++) {
        const charCode = message.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        encrypted += String.fromCharCode(charCode);
    }
    
    return btoa(encrypted); // Base64 encode
}

function decryptMessage(encryptedMessage, roomId) {
    try {
        const key = roomId.slice(-8);
        const encrypted = atob(encryptedMessage);
        let decrypted = '';
        
        for (let i = 0; i < encrypted.length; i++) {
            const charCode = encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            decrypted += String.fromCharCode(charCode);
        }
        
        return decrypted;
    } catch (e) {
        return encryptedMessage; // If not encrypted, return original
    }
}

// 12. SESSION MANAGEMENT
const sessions = {};

function createSession(userId) {
    const sessionId = generateSecureRoomID();
    sessions[sessionId] = {
        userId: userId,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000, // 1 hour
        fingerprint: localStorage.getItem('deviceFingerprint')
    };
    
    localStorage.setItem('activeSession', sessionId);
    return sessionId;
}

function validateSession() {
    const sessionId = localStorage.getItem('activeSession');
    if (!sessionId) return false;
    
    const session = sessions[sessionId];
    if (!session) return false;
    
    if (session.expiresAt < Date.now()) {
        delete sessions[sessionId];
        localStorage.removeItem('activeSession');
        return false;
    }
    
    // Check if same device
    const currentFingerprint = localStorage.getItem('deviceFingerprint');
    if (session.fingerprint !== currentFingerprint) {
        return false;
    }
    
    return true;
}

// 13. INITIALIZE SECURITY ON PAGE LOAD
document.addEventListener('DOMContentLoaded', async function() {
    // Generate device fingerprint if not exists
    if (!localStorage.getItem('deviceFingerprint')) {
        await generateFingerprint();
    }
    
    // Check for active session
    if (validateSession()) {
        console.log('✅ Active session found');
        document.body.classList.add('authenticated');
    }
    
    // Add password strength checker listener
    const passwordInput = document.getElementById('roomPassword');
    if (passwordInput) {
        passwordInput.addEventListener('input', function(e) {
            checkPasswordStrength(e.target.value);
        });
    }
});

// 14. OVERRIDE EXISTING FUNCTIONS WITH SECURE ONES
// Replace original createRoom function
window.originalCreateRoom = window.createRoom || function(){};
window.createRoom = function() {
    return createSecureRoom();
};

// Replace original joinRoom function
window.originalJoinRoom = window.joinRoom || function(){};
window.joinRoom = function() {
    const roomId = prompt('Enter Room ID:');
    const password = prompt('Enter Room Password:');
    return secureJoinRoom(roomId, password);
};
// File ke END mein ye sab add karo

// ========== PROFESSIONAL FEATURES ==========

// 1. Dark Mode Toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    
    // Update icon
    const btn = document.querySelector('.theme-toggle i');
    if (btn) {
        btn.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Add dark mode button to page
window.addEventListener('load', function() {
    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.innerHTML = '<i class="fas fa-moon"></i>';
    btn.onclick = toggleDarkMode;
    document.body.appendChild(btn);
});

// 2. Loading Animation
function showLoader() {
    document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

// Show loader on page navigation
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', showLoader);
});

// 3. Back to Top Button
window.addEventListener('scroll', function() {
    const btn = document.getElementById('backToTop');
    if (window.scrollY > 300) {
        btn.style.display = 'block';
    } else {
        btn.style.display = 'none';
    }
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 4. Cookie Consent
function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    document.getElementById('cookieConsent').style.display = 'none';
}

// Show cookie consent if not accepted
if (!localStorage.getItem('cookiesAccepted')) {
    document.getElementById('cookieConsent').style.display = 'block';
}

// 5. FAQ Accordion
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            this.parentElement.classList.toggle('active');
        });
    });
}

// 6. Contact Form Handler
async function handleContactSubmit(event) {
    event.preventDefault();
    showLoader();
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    hideLoader();
    alert('✅ Message sent! We\'ll reply within 24 hours.');
}

// 7. Profile Page Functions
function updateProfile() {
    const name = document.getElementById('profileName').value;
    const bio = document.getElementById('profileBio').value;
    
    localStorage.setItem('userName', name);
    localStorage.setItem('userBio', bio);
    
    alert('✅ Profile updated!');
}

function uploadProfilePhoto(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        localStorage.setItem('profilePhoto', e.target.result);
        document.querySelector('.profile-photo img').src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 8. Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">✕</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// 9. Analytics Tracking
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    
    // Also store locally
    const events = JSON.parse(localStorage.getItem('analytics') || '[]');
    events.push({
        category,
        action,
        label,
        timestamp: Date.now()
    });
    localStorage.setItem('analytics', JSON.stringify(events.slice(-50)));
}

// 10. PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('✅ Service Worker registered'))
            .catch(err => console.log('❌ Service Worker error:', err));
    });
}

// 11. Initialize all features
document.addEventListener('DOMContentLoaded', function() {
    initFAQ();
    
    // Track page view
    trackEvent('Page', 'View', window.location.pathname);
    
    // Check if profile page exists
    if (window.location.pathname.includes('profile')) {
        loadProfileData();
    }
});

// 12. Load Profile Data
function loadProfileData() {
    const name = localStorage.getItem('userName');
    const bio = localStorage.getItem('userBio');
    const photo = localStorage.getItem('profilePhoto');
    
    if (name) document.getElementById('profileName').value = name;
    if (bio) document.getElementById('profileBio').value = bio;
    if (photo) document.querySelector('.profile-photo img').src = photo;
}
// ========== ADVANCED PROFESSIONAL FEATURES ==========

// 1. Newsletter Subscription
function subscribeNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input').value;
    
    // Save to localStorage
    let subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
    subscribers.push({
        email: email,
        date: new Date().toISOString()
    });
    localStorage.setItem('subscribers', JSON.stringify(subscribers));
    
    alert('✅ Thanks for subscribing! Check your email for love letters 💌');
    event.target.reset();
}

// 2. Live Chat Support
function toggleChat() {
    const chatBody = document.querySelector('.chat-body');
    chatBody.style.display = chatBody.style.display === 'none' ? 'flex' : 'none';
}

function sendSupportMessage() {
    const input = document.getElementById('supportInput');
    const message = input.value.trim();
    
    if (message) {
        const messagesDiv = document.getElementById('supportMessages');
        
        // User message
        messagesDiv.innerHTML += `
            <div style="text-align: right; margin: 5px;">
                <span style="background: #667eea; color: white; padding: 5px 10px; border-radius: 10px;">${message}</span>
            </div>
        `;
        
        // Auto reply
        setTimeout(() => {
            messagesDiv.innerHTML += `
                <div style="text-align: left; margin: 5px;">
                    <span style="background: #e0e0e0; padding: 5px 10px; border-radius: 10px;">Thanks for messaging! We'll reply soon ❤️</span>
                </div>
            `;
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }, 1000);
        
        input.value = '';
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
}

// 3. Rating System
let hasRated = localStorage.getItem('hasRated');

function showRatePopup() {
    if (!hasRated && Math.random() > 0.5) { // Show randomly
        setTimeout(() => {
            document.getElementById('ratePopup').style.display = 'block';
        }, 30000); // Show after 30 seconds
    }
}

function rate(stars) {
    localStorage.setItem('hasRated', 'true');
    localStorage.setItem('userRating', stars);
    
    alert(`🌟 Thanks for ${stars} stars! You're the best!`);
    closeRatePopup();
    
    // Track rating
    trackEvent('Rating', 'Given', stars + ' stars');
}

function closeRatePopup() {
    document.getElementById('ratePopup').style.display = 'none';
}

// 4. Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + H -> Go Home
    if (e.ctrlKey && e.key === 'h') {
        window.location.href = '/';
    }
    
    // Ctrl + R -> Go to Room
    if (e.ctrlKey && e.key === 'r') {
        window.location.href = '/room.html';
    }
    
    // Ctrl + P -> Open Profile
    if (e.ctrlKey && e.key === 'p') {
        window.location.href = '/profile.html';
    }
    
    // Ctrl + D -> Toggle Dark Mode
    if (e.ctrlKey && e.key === 'd') {
        toggleDarkMode();
    }
    
    // / -> Focus Search
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('searchInput')?.focus();
    }
});

// 5. Show Keyboard Shortcuts
function showShortcuts() {
    const modal = document.createElement('div');
    modal.className = 'shortcuts-modal';
    modal.innerHTML = `
        <h3>⌨️ Keyboard Shortcuts</h3>
        <div class="shortcut-item"><span>Home</span> <span class="shortcut-key">Ctrl + H</span></div>
        <div class="shortcut-item"><span>Room</span> <span class="shortcut-key">Ctrl + R</span></div>
        <div class="shortcut-item"><span>Profile</span> <span class="shortcut-key">Ctrl + P</span></div>
        <div class="shortcut-item"><span>Dark Mode</span> <span class="shortcut-key">Ctrl + D</span></div>
        <div class="shortcut-item"><span>Search</span> <span class="shortcut-key">/</span></div>
        <button onclick="this.parentElement.remove()" style="margin-top: 1rem;">Close</button>
    `;
    document.body.appendChild(modal);
}

// 6. Multi-language Support
const translations = {
    'hi': {
        'create_room': 'रूम बनाएं',
        'join_room': 'रूम जॉइन करें',
        'video_call': 'वीडियो कॉल'
    },
    'es': {
        'create_room': 'Crear Sala',
        'join_room': 'Unirse a Sala',
        'video_call': 'Videollamada'
    },
    'fr': {
        'create_room': 'Créer une Salle',
        'join_room': 'Rejoindre la Salle',
        'video_call': 'Appel Vidéo'
    }
};

function changeLanguage(lang) {
    localStorage.setItem('language', lang);
    
    // Translate page elements
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}

// 7. Offline Detection
window.addEventListener('online', function() {
    document.querySelector('.offline-indicator')?.remove();
    showNotification('✅ Back online!');
});

window.addEventListener('offline', function() {
    if (!document.querySelector('.offline-indicator')) {
        const indicator = document.createElement('div');
        indicator.className = 'offline-indicator';
        indicator.innerHTML = '📴 You\'re offline. Some features may not work.';
        document.body.appendChild(indicator);
    }
});

// 8. Accessibility Features
function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    localStorage.setItem('highContrast', document.body.classList.contains('high-contrast'));
}

function toggleLargeText() {
    document.body.classList.toggle('large-text');
    localStorage.setItem('largeText', document.body.classList.contains('large-text'));
}

function toggleReduceMotion() {
    document.body.classList.toggle('reduce-motion');
    localStorage.setItem('reduceMotion', document.body.classList.contains('reduce-motion'));
}

// 9. Load saved preferences
['highContrast', 'largeText', 'reduceMotion'].forEach(pref => {
    if (localStorage.getItem(pref) === 'true') {
        document.body.classList.add(pref);
    }
});

// 10. Download App Banner
function showAppBanner() {
    if (!localStorage.getItem('appBannerClosed')) {
        const banner = document.createElement('div');
        banner.className = 'app-banner';
        banner.innerHTML = `
            📱 Get the LoveSync App! 
            <button onclick="downloadApp()">Download</button>
            <span onclick="this.parentElement.remove(); localStorage.setItem('appBannerClosed', 'true')" style="float: right; cursor: pointer;">✕</span>
        `;
        document.body.insertBefore(banner, document.body.firstChild);
    }
}

function downloadApp() {
    alert('App download link will be sent to your email! (Coming soon)');
}

// 11. Track User Behavior
function trackUserBehavior() {
    const behavior = {
        pages: JSON.parse(localStorage.getItem('visitedPages') || '[]'),
        timeOnSite: 0,
        features: JSON.parse(localStorage.getItem('usedFeatures') || '[]')
    };
    
    // Track current page
    const pages = behavior.pages;
    if (!pages.includes(window.location.pathname)) {
        pages.push(window.location.pathname);
        localStorage.setItem('visitedPages', JSON.stringify(pages));
    }
    
    // Track time
    setInterval(() => {
        behavior.timeOnSite += 1;
        localStorage.setItem('timeOnSite', behavior.timeOnSite);
    }, 60000);
}

// 12. Share Website
function shareWebsite() {
    if (navigator.share) {
        navigator.share({
            title: 'LoveSync',
            text: 'Create your private couple space! ❤️',
            url: window.location.href
        });
    } else {
        prompt('Share this link:', window.location.href);
    }
}

// 13. Report Bug
function reportBug() {
    const bug = prompt('Describe the bug:');
    if (bug) {
        const bugs = JSON.parse(localStorage.getItem('bugReports') || '[]');
        bugs.push({
            description: bug,
            page: window.location.pathname,
            time: new Date().toISOString()
        });
        localStorage.setItem('bugReports', JSON.stringify(bugs));
        alert('✅ Bug reported! We\'ll fix it soon.');
    }
}

// 14. Feedback Form
function showFeedbackForm() {
    const feedback = prompt('How can we improve LoveSync?');
    if (feedback) {
        const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
        feedbacks.push({
            feedback: feedback,
            rating: localStorage.getItem('userRating'),
            time: new Date().toISOString()
        });
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
        alert('❤️ Thanks for your feedback!');
    }
}

// 15. Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    // Show rate popup after some time
    showRatePopup();
    
    // Track behavior
    trackUserBehavior();
    
    // Show app banner
    showAppBanner();
    
    // Add shortcuts help
    const shortcutsHelp = document.createElement('div');
    shortcutsHelp.className = 'shortcuts-help';
    shortcutsHelp.innerHTML = '⌨️ Shortcuts';
    shortcutsHelp.onclick = showShortcuts;
    document.body.appendChild(shortcutsHelp);
    
    // Add language selector
    const langSelector = document.createElement('div');
    langSelector.className = 'language-selector';
    langSelector.innerHTML = `
        <button class="lang-btn"><i class="fas fa-globe"></i> 🌐</button>
        <div class="lang-dropdown">
            <a href="#" onclick="changeLanguage('en')">English</a>
            <a href="#" onclick="changeLanguage('hi')">हिन्दी</a>
            <a href="#" onclick="changeLanguage('es')">Español</a>
            <a href="#" onclick="changeLanguage('fr')">Français</a>
        </div>
    `;
    document.body.appendChild(langSelector);
    
    // Accessibility menu
    const accessibilityBtn = document.createElement('div');
    accessibilityBtn.style.cssText = 'position: fixed; top: 20px; left: 20px; z-index: 999;';
    accessibilityBtn.innerHTML = `
        <button onclick="toggleHighContrast()" title="High Contrast">👁️</button>
        <button onclick="toggleLargeText()" title="Large Text">A+</button>
        <button onclick="toggleReduceMotion()" title="Reduce Motion">🔄</button>
    `;
    document.body.appendChild(accessibilityBtn);
});
