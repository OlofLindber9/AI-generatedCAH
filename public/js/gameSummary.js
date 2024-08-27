const gameSummarySocket = io();
const players = await getPlayers(sessionStorage.getItem('lobbyID'));
console.log(players);
gameSummarySocket.on('connect', function() {
    console.log('Connected to gameSummary namespace');
});


const playerListElement = document.getElementById('players');
playerListElement.innerHTML = '';

players.forEach(player => {
    const playerElement = document.createElement('li');
    const maxLength = 40;
    playerElement.textContent = `${padName(player.playerData.nickname, maxLength)} Score: ${player.playerData.score}`;;
    playerListElement.appendChild(playerElement);
});

gameSummarySocket.on('error', (error) => {
    console.error('Connection Error:', error);
});

gameSummarySocket.on('message', function(msg) {
    console.log(msg);
});

gameSummarySocket.on('gameEvent', function(data) {
    console.log(data);
    // Handle game events here
});

function padName(nickname, length) {
    return nickname.padEnd(length, ' '); // Pads the nickname with spaces to a fixed length
}

async function getPlayers(lobbyId) {
    try {
        // Append the playerId as a query parameter in the URL
        const url = new URL('/getPlayersFromLobby', window.location.origin);
        url.searchParams.append('lobbyId', lobbyId);

        const response = await fetch(url, {
            method: 'GET', // GET request
            headers: {
                'Accept': 'application/json' // Accept header for expecting JSON data
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.players;  // Return the data received from the server
    }
    catch (error) {
        console.error('Error getting player:', error);
        throw error;
    }
}