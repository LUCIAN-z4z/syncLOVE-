function updateTimer() {
    // Milne ki date set karo (YYYY, MM-1, DD)
    const meetingDate = new Date(2025, 11, 31); // 31 December 2025
    const now = new Date();
    
    const diff = meetingDate - now;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (86400000)) / (3600000));
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    document.getElementById('countdown').innerHTML = 
        days + "d " + hours + "h " + minutes + "m " + seconds + "s";
}

setInterval(updateTimer, 1000);

function sendLove() {
    document.getElementById('message').innerHTML = "🤗 Hug bheja! ❤️";
    setTimeout(() => {
        document.getElementById('message').innerHTML = "";
    }, 2000);
}

function sendKiss() {
    document.getElementById('message').innerHTML = "💋 Kiss bheja! 😘";
    setTimeout(() => {
        document.getElementById('message').innerHTML = "";
    }, 2000);
}
