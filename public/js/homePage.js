const createRoomLink = document.getElementById('createRoomLink');

const homeSocket = io();
homeSocket.on('connect', function() {
    console.log('Connected to homepage namespace');
});

homeSocket.on('error', (error) => {
    console.error('Connection Error:', error);
});

homeSocket.on('message', function(msg) {
    console.log(msg);
    // Display this message on your web page
});

homeSocket.on('gameEvent', function(data) {
    console.log(data);
    // Handle game events here
});

function sendGameEvent(eventData) {
    const roomId = sessionStorage.getItem('roomId');
    homeSocket.emit('gameEvent', { roomId: roomId, event: eventData });
}

createRoomLink.addEventListener('click', (e) => {
    // Prevent the default navigation
    e.preventDefault();
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    console.log(`Generated room ID: ${roomId}`);
    homeSocket.emit('createRoom', roomId);
    sessionStorage.setItem('roomId', roomId);

    // Navigate to the href attribute of the link
    //window.location.href = createRoomLink.getAttribute('href');
});