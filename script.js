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
