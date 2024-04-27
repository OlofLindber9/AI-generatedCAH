const lobbySocket = io();
lobbySocket.on('connect', function() {
    console.log('Connected to lobby namespace');
    console.log(sessionStorage.getItem('roomId'));
    if (sessionStorage.getItem('isHost')){
        lobbySocket.emit('createRoom', sessionStorage.getItem('roomId'), sessionStorage.getItem('name'));
    }else{
        lobbySocket.emit('joinRoom', sessionStorage.getItem('roomId'), sessionStorage.getItem('name'));
    }

    const roomIdDisplayElement = document.getElementById('room-id-display');
    roomIdDisplayElement.textContent = sessionStorage.getItem('roomId');
});

lobbySocket.on('error', (error) => {
    console.error('Connection Error:', error);
});

lobbySocket.on('message', function(msg) {
    console.log(msg);
});

lobbySocket.on('gameEvent', function(data) {
    console.log(data);
    // Handle game events here
});

lobbySocket.on('updatePlayerList', function(players) {
    const playerListElement = document.getElementById('players');
    playerListElement.innerHTML = '';

    players.forEach(player => {
        const playerElement = document.createElement('li');
        playerElement.textContent = player.name;
        playerListElement.appendChild(playerElement);
    });
});

lobbySocket.emit('requestPlayerList', { roomId: sessionStorage.getItem('roomId') });

function sendGameEvent(eventData) {
    const roomId = sessionStorage.getItem('roomId');
    lobbySocket.emit('gameEvent', { roomId: roomId, event: eventData });
}