var userprompts = 0;
const submitButton = document.getElementById("submitTheme");


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

        var btn = this;
        var textSpan = btn.querySelector('span');
        textSpan.style.display = 'none';

        var spinner = document.createElement('div');
        spinner.className = 'loader';
        btn.appendChild(spinner); 

        const aiphrases = [];

        generateWhiteCards(userInput).then(data => {
            if (data) {
                const lines = data.aiResponse.split('\n');
                lines.forEach(line => {
                    if (line.trim() !== ''){
                        aiphrases.push(line.trim());
                    }
                });
                btn.removeChild(spinner);
                //spinner.remove();
                textSpan.style.display = '';
                displayCards(aiphrases); 
            }
        }).catch(error => {
            btn.removeChild(spinner);
            //spinner.remove();
            textSpan.style.display = '';
            console.error('Error:', error);
        });
        userprompts++;
        document.getElementById('input').value = '';
        };
    }
);

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

function displayCards(aiphrases) {
    const container = document.getElementById('card-container');
    
    aiphrases.forEach((phrase) => {
        const card = document.createElement('div');
        card.classList.add('card');
        const border = document.createElement('div');
        border.classList.add('border');
        card.appendChild(border);
        const filter = document.createElement('div');
        filter.classList.add('filter');
        card.appendChild(filter);
        const text = document.createElement('p');
        text.classList.add('pinv');
        text.textContent = phrase;
        card.appendChild(text);
        const shadow = document.createElement('div');
        shadow.classList.add('shadow');
        card.appendChild(shadow);
        const backdrop = document.createElement('div');
        backdrop.classList.add('backdrop');
        card.appendChild(backdrop);
        container.appendChild(card);
    });  
    Array.from(container.children).forEach((card, index) => {
        setTimeout(() => {
            requestAnimationFrame(() => {
                card.style.opacity = 1; 
                card.style.transform = 'translateX(0px)';
            });
        }, index * 500);
    });
}