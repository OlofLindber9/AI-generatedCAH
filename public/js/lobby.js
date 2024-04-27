const lobbySocket = io();
lobbySocket.on('connect', function() {
    console.log('Connected to lobby namespace');
    console.log(sessionStorage.getItem('roomId'));
    if (sessionStorage.getItem('isHost')){
        lobbySocket.emit('createRoom', sessionStorage.getItem('roomId'));
    }else{
        lobbySocket.emit('joinRoom', sessionStorage.getItem('roomId'));
    }
});

lobbySocket.on('error', (error) => {
    console.error('Connection Error:', error);
});

lobbySocket.on('message', function(msg) {
    console.log(msg);
    // Display this message on your web page
});

lobbySocket.on('gameEvent', function(data) {
    console.log(data);
    // Handle game events here
});

function sendGameEvent(eventData) {
    const roomId = sessionStorage.getItem('roomId');
    lobbySocket.emit('gameEvent', { roomId: roomId, event: eventData });
}