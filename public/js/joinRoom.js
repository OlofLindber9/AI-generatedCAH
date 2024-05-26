const submitButton = document.getElementById("submit");


const joinRoomSocket = io();
joinRoomSocket.on('connect', function() {
    console.log('Connected to join-room namespace');
});

joinRoomSocket.on('error', (error) => {
    console.error('Connection Error:', error);
});

joinRoomSocket.on('message', function(msg) {
    console.log(msg);
    // Display this message on your web page
});

joinRoomSocket.on('gameEvent', function(data) {
    console.log(data);
    // Handle game events here
});

joinRoomSocket.on('roomFull', function(data) {
    showPopup(`Room ${data} is full`);
});

joinRoomSocket.on('roomDoesNotExist', function(data) {
    showPopup(`Room does not exist`);
});

joinRoomSocket.on('goToLobby', function(data){
    window.location.href = '/lobby';
});
function sendGameEvent(eventData) {
    const roomId = sessionStorage.getItem('roomId');
    joinRoomSocket.emit('gameEvent', { roomId: roomId, event: eventData });
}

function showPopup(text) {
    var popup = document.getElementById('popup');
    popup.textContent = text;
    popup.style.display = 'block';

    setTimeout(function() {
        popup.style.display = 'none';
    }, 3000);
}

async function createPlayer(nickname, cards, score, isCzar, isHost, lobbyId) {
    try {
        const response = await fetch('/createPlayer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nickname, cards, score, isCzar, isHost, lobbyId })
        });

        const data = await response.json();
        return data;  // Return the data received from the server
    } catch (error) {
        console.error('Error creating player:', error);
        throw error;
    }
}

async function getLobby(lobbyId) {
    try {
        const url = `/getLobby?lobbyId=${encodeURIComponent(lobbyId)}`;
        console.log("Fetching URL:", url);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`); // Check response status
        }

        const data = await response.json();
        return data;  // Return the data received from the server
    } catch (error) {
        console.error('Error getting lobby:', error);
        throw error;
    }
}

async function addPlayerToLobby(lobbyId, playerId) {
    try {
        const response = await fetch('/addPlayerToLobby', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ lobbyId, playerId })
        });

        const data = await response.json();
        return data;  // Return the data received from the server
    } catch (error) {
        console.error('Error adding player to lobby:', error);
        throw error;
    }
}


submitButton.addEventListener("click", async function() {
    const userInput = document.getElementById("input").value;
    const name = document.getElementById("nickNameInput").value;

    if (name.trim() === '') {
        showPopup('Please enter a name');
        return;
    }

    if (userInput.trim() !== '') {
        sessionStorage.setItem('name', name);
        sessionStorage.setItem('roomId', userInput);
        const roomId = sessionStorage.getItem('roomId');
        getLobby(roomId).then(data => {
            if (data) {
                const lobbyId = data.lobby;
                console.log('lobbyID:', lobbyId);
                createPlayer(name, [], 0, false, false, lobbyId).then(data => {
                    const playerId = data.playerID;
                    sessionStorage.setItem('playerID', playerId);
                    addPlayerToLobby(lobbyId, playerId).then(data => {
                        sessionStorage.setItem('lobbyID', lobbyId);
                        joinRoomSocket.emit('joinRoom', roomId, name);
                    }).catch(error => {
                        console.error('Error adding player to lobby:', error);
                    });
                }).catch(error => {
                    console.error('Error creating player:', error);
                });
            }
        }).catch(error => {
            showPopup('Room does not exist');
        });
    } else {
        showPopup('Please enter a room ID');

    }

});