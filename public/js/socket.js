/*const socket = io();

socket.on('connect', function() {
    console.log('Connected Client');
});

socket.on('error', (error) => {
    console.error('Connection Error:', error);
});

function joinRoom() {
    const roomId = document.getElementById('room-id').value;
    socket.emit('joinRoom', roomId);
}

socket.on('message', function(msg) {
    console.log(msg);
    // Display this message on your web page
});

socket.on('gameEvent', function(data) {
    console.log(data);
    // Handle game events here
});

function sendGameEvent(eventData) {
    const roomId = document.getElementById('room-id').value;
    socket.emit('gameEvent', { roomId: roomId, event: eventData });
}*/