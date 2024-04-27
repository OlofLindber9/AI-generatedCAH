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
    popup.textContent = text; // Set the text of the popup
    popup.style.display = 'block'; // Show the popup

    setTimeout(function() {
        popup.style.display = 'none'; // Hide the popup after 3 seconds
    }, 3000);
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
        joinRoomSocket.emit('joinRoom', roomId, name);
    } else {
        showPopup('Please enter a room ID');

    }

});