const lobbySocket = io();
const startGameButton = document.getElementById('start-game-button');
const leaveGameLink = document.getElementById('leaveGameLink');
if (leaveGameLink) {
    leaveGameLink.addEventListener('click', leaveGame);
}

//___________________________________________FIX STATUS IN LOBBY______READY/AWAITING START___________________________FOR BOTH PLAYERS AND LOBBY
console.log(sessionStorage.getItem('isHost'));
if (sessionStorage.getItem('isHost') === 'false') {
    startGameButton.classList.add('disabled');
    startGameButton.textContent = 'Waiting for host';
    startGameButton.removeAttribute('href'); // Disable link for non-hosts
} else {
    startGameButton.addEventListener('click', (event) => {
        lobbySocket.emit('startGameRequest', { roomId: sessionStorage.getItem('roomId') });
        event.preventDefault();
        window.location.href = '/game-start';
    });
}

lobbySocket.on('connect', function() {
    console.log('Connected to lobby namespace');
    console.log(sessionStorage.getItem('roomId'));
    if (sessionStorage.getItem('isHost')){
        //lobbySocket.emit('createRoom', sessionStorage.getItem('roomId'), sessionStorage.getItem('name'));
        lobbySocket.emit('initPlayerList', sessionStorage.getItem('roomId'))
    }else{
        lobbySocket.emit('joinRoom', sessionStorage.getItem('roomId'), sessionStorage.getItem('name'), false);
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

lobbySocket.on('redirectToGameStart', function() {
    window.location.href = '/game-start';
});

function sendGameEvent(eventData) {
    const roomId = sessionStorage.getItem('roomId');
    lobbySocket.emit('gameEvent', { roomId: roomId, event: eventData });
}
async function leaveGame(event) {
    event.preventDefault();
    await removePlayerFromLobby(sessionStorage.getItem('lobbyID'), sessionStorage.getItem('playerID'));
    console.log('Leaving game');
    lobbySocket.emit('leave', { roomId: sessionStorage.getItem('roomId'), name: sessionStorage.getItem('name') });
    window.location.href = '/';
}

async function removePlayerFromLobby(lobbyID, playerID) {
    try {
        const response = await fetch('/removePlayerFromLobby', {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ lobbyID, playerID })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error removing player from lobby:', error);
        throw error;
    }
    
}