const createRoomLink = document.getElementById('createRoomLink');
const TESTBUTTON = document.getElementById("rulesLink");
const homeSocket = io();
homeSocket.on('connect', function() {
    console.log('Connected to homepage namespace');
    console.log(`Name: ${sessionStorage.getItem('name')}`);
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

homeSocket.on('roomSuccessfullyCreated', function(data) {
    window.location.href = '/lobby';
});

function sendGameEvent(eventData) {
    const roomId = sessionStorage.getItem('roomId');
    homeSocket.emit('gameEvent', { roomId: roomId, event: eventData });
}

createRoomLink.addEventListener('click', (e) => {
    const nickname = document.getElementById('nickInput').value;
    e.preventDefault();
    if (nickname.trim() === '') {
        showPopup('Please enter a nickname');
        return;
    }
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    console.log(`Generated room ID: ${roomId}`);
    sessionStorage.setItem('roomId', roomId);
    sessionStorage.setItem('isHost', true);
    sessionStorage.setItem('name', nickname);
    createPlayer(nickname, [], 0, false, true, "none", "AWAITING START")
        .then(data => {
            const playerID = data.playerID;
            sessionStorage.setItem('playerID', playerID);
            createLobby(roomId, [playerID], { gameState: "AWAITING START" })
            .then(data => {
                const lobbyID = data.id;
                sessionStorage.setItem('lobbyID', lobbyID);
                updatePlayer(playerID, 'lobbyId', lobbyID);
                homeSocket.emit('createRoom', roomId, nickname);
            })
            .catch(error => console.error('Error creating lobby:', error));
        })
    .catch(error => console.error('Error creating player:', error));
});

TESTBUTTON.addEventListener('click', (e) => {
    console.log(roomId);
});

function showPopup(text) {
    var popup = document.getElementById('popup');
    popup.textContent = text;
    popup.style.display = 'block';

    setTimeout(function() {
        popup.style.display = 'none';
    }, 3000);
}


async function createLobby(lobbyId, players, gameDetails) {
    try {
        const response = await fetch('/createLobby', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ lobbyId, players, gameDetails })
        });

        const data = await response.json();
        return data;  // Return the data received from the server
    }
    catch (error) {
        console.error('Error creating lobby:', error);
        throw error;
    }
}

async function createPlayer(nickname, cards, score, isCzar, isHost, lobbyId, status) {
    try {
        const response = await fetch('/createPlayer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nickname, cards, score, isCzar, isHost, lobbyId, status })
        });

        const data = await response.json();
        return data;  // Return the data received from the server
    } catch (error) {
        console.error('Error creating player:', error);
        throw error;
    }
}

async function updatePlayer(playerId, field, value) {
    try {
        const response = await fetch('/updatePlayer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ playerId, field, value })
        });

        const data = await response.json();
        console.log(data.message);
        return data;
    } catch (error) {
        console.error('Error updating player:', error);
        throw error;
    }
}