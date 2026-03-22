// ========== MODAL FUNCTIONS ==========

// Open Create Modal
function showCreateModal() {
    console.log("✅ Create Room clicked");
    document.getElementById('createModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close Create Modal
function closeCreateModal() {
    document.getElementById('createModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Open Join Modal
function showJoinModal() {
    console.log("✅ Join Room clicked");
    document.getElementById('joinModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close Join Modal
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

// ========== ROOM CREATION FUNCTIONS ==========

// Generate random room ID
function generateRoomId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 8; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    return 'LOVE-' + id;
}

// Check password strength
function isPasswordStrong(password) {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password);
}

// Create Room
function createRoom() {
    // Get values
    const creatorName = document.getElementById('creatorName').value.trim();
    const partnerName = document.getElementById('partnerName').value.trim();
    const password = document.getElementById('roomPassword').value.trim();
    
    // Validate
    if (!creatorName || !partnerName || !password) {
        alert('❌ Please fill all fields!');
        return;
    }
    
    if (!isPasswordStrong(password)) {
        alert('❌ Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number!');
        return;
    }
    
    // Generate room ID
    const roomId = generateRoomId();
    
    // Create room object
    const roomData = {
        id: roomId,
        creator: creatorName,
        partner: partnerName,
        password: password,
        createdAt: new Date().toISOString(),
        members: [creatorName, partnerName]
    };
    
    // Save to localStorage
    localStorage.setItem('currentRoom', roomId);
    localStorage.setItem('room_' + roomId, JSON.stringify(roomData));
    localStorage.setItem('userName', creatorName);
    
    alert(`✅ Room created successfully!\n\nRoom ID: ${roomId}\nPassword: ${password}\n\nShare these with your partner!`);
    
    // Redirect to room page
    window.location.href = 'room.html';
}

// Join Room
function joinRoom() {
    // Get values
    const roomId = document.getElementById('joinRoomId').value.trim();
    const password = document.getElementById('joinPassword').value.trim();
    const userName = document.getElementById('joinUserName').value.trim();
    
    // Validate
    if (!roomId || !password || !userName) {
        alert('❌ Please fill all fields!');
        return;
    }
    
    // Get room data
    const roomData = JSON.parse(localStorage.getItem('room_' + roomId));
    
    if (!roomData) {
        alert('❌ Room not found!');
        return;
    }
    
    if (roomData.password !== password) {
        alert('❌ Wrong password!');
        return;
    }
    
    // Check if room has space
    if (roomData.members.length >= 2 && !roomData.members.includes(userName)) {
        alert('❌ Room is full! Only 2 members allowed.');
        return;
    }
    
    // Add member if not already in room
    if (!roomData.members.includes(userName)) {
        roomData.members.push(userName);
        localStorage.setItem('room_' + roomId, JSON.stringify(roomData));
    }
    
    // Save to localStorage
    localStorage.setItem('currentRoom', roomId);
    localStorage.setItem('userName', userName);
    
    alert('✅ Successfully joined the room!');
    
    // Redirect to room page
    window.location.href = 'room.html';
}

// ========== PAGE LOAD INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ SyncLOVE website loaded successfully!');
    
    // Check if user is already in a room
    const currentRoom = localStorage.getItem('currentRoom');
    const userName = localStorage.getItem('userName');
    
    if (currentRoom && userName && window.location.pathname.includes('index')) {
        const stayInRoom = confirm('You are already in a room. Go back to room?');
        if (stayInRoom) {
            window.location.href = 'room.html';
        }
    }
});

// ========== TEST FUNCTION (Remove after testing) ==========
function testButtons() {
    console.log('✅ Test function working!');
    alert('JavaScript is working properly!');
}

// Call test function on load
window.addEventListener('load', function() {
    testButtons();
});
// ========== FEEDBACK SYSTEM ==========

function submitFeedback() {
    const name = document.getElementById('feedbackName').value;
    const email = document.getElementById('feedbackEmail').value;
    const rating = document.getElementById('feedbackRating').value;
    const message = document.getElementById('feedbackMessage').value;
    
    if (!name || !message) {
        alert('Please enter your name and feedback!');
        return;
    }
    
    const feedback = {
        id: Date.now(),
        name: name,
        email: email,
        rating: rating,
        message: message,
        date: new Date().toLocaleString(),
        approved: true
    };
    
    let feedbacks = JSON.parse(localStorage.getItem('userFeedbacks') || '[]');
    feedbacks.unshift(feedback);
    if (feedbacks.length > 20) feedbacks.pop();
    localStorage.setItem('userFeedbacks', JSON.stringify(feedbacks));
    
    document.getElementById('feedbackForm').style.display = 'none';
    document.getElementById('feedbackThanks').style.display = 'block';
    
    setTimeout(() => {
        document.getElementById('feedbackForm').style.display = 'block';
        document.getElementById('feedbackThanks').style.display = 'none';
        document.getElementById('feedbackName').value = '';
        document.getElementById('feedbackEmail').value = '';
        document.getElementById('feedbackMessage').value = '';
    }, 3000);
    
    displayFeedbacks();
}

function displayFeedbacks() {
    const feedbacks = JSON.parse(localStorage.getItem('userFeedbacks') || '[]');
    const container = document.getElementById('feedbackList');
    
    if (!container) return;
    
    if (feedbacks.length === 0) {
        container.innerHTML = '<p style="color: #999;">No feedback yet. Be the first! 💕</p>';
        return;
    }
    
    let html = '';
    feedbacks.slice(0, 5).forEach(fb => {
        const stars = '⭐'.repeat(parseInt(fb.rating));
        html += `
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; margin: 1rem 0;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong>${fb.name}</strong>
                    <span style="color: #ffd93d;">${stars}</span>
                </div>
                <p style="margin-top: 0.5rem; color: #666;">"${fb.message}"</p>
                <small style="color: #999;">${fb.date}</small>
            </div>
        `;
    });
    container.innerHTML = html;
}

// Call on load if feedbackList exists
if (document.getElementById('feedbackList')) {
    displayFeedbacks();
}
