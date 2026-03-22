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
