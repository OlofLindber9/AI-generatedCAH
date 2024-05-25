const createRoomLink = document.getElementById('createRoomLink');
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

function createPlayer(nickname, cards, score, isCzar, isHost) {
    fetch('/createPlayer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nickname, cards, score, isCzar, isHost })
    })
    .then(response => response.json())
    .then(data => console.log('Player created:', data))
    .catch(error => console.error('Error creating player:', error));
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
    homeSocket.emit('createRoom', roomId, nickname);
    createPlayer(nickname, [], 0, false, true);
});

function showPopup(text) {
    var popup = document.getElementById('popup');
    popup.textContent = text;
    popup.style.display = 'block';

    setTimeout(function() {
        popup.style.display = 'none';
    }, 3000);
}