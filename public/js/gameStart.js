var userprompts = 0;
const submitButton = document.getElementById("submitTheme");
const outputArea = document.getElementById("output-text");



const gameStartSocket = io();
gameStartSocket.on('connect', function() {
    console.log('Connected to game start namespace');
});

gameStartSocket.on('error', (error) => {
    console.error('Connection Error:', error);
});

function joinRoom() {
    const roomId = document.getElementById('room-id').value;
    gameStartSocket.emit('joinRoom', roomId);
}

gameStartSocket.on('message', function(msg) {
    console.log(msg);
    // Display this message on your web page
});

gameStartSocket.on('gameEvent', function(data) {
    console.log(data);
    // Handle game events here
});

function sendGameEvent(eventData) {
    const roomId = document.getElementById('room-id').value;
    gameStartSocket.emit('gameEvent', { roomId: roomId, event: eventData });
}

submitButton.addEventListener("click", async function() {
    const userInput = document.getElementById("input").value;
    document.getElementById('input').value = '';

    if (userInput.trim() !== '') {
        outputArea.innerText = 'Please wait, generating response...';

        // Call the function and handle the response
        generateWhiteCards(userInput).then(data => {
            if (data) {
                outputArea.innerText = data.aiResponse;
            }
        }).catch(error => {
            outputArea.innerText = 'Error: Could not retrieve the response.';
        });
        userprompts++;


        document.getElementById('input').value = ''; // Clear the input field after sending the request
    } else {
        outputArea.innerText = 'Please enter some text to generate output.';
    }

});

async function generateWhiteCards(promptText) {
const endpoint = '/generateWhiteCard';

try {
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: promptText}),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
} catch (error) {
    console.error('There was an error!', error);
}
}