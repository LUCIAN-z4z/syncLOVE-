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
