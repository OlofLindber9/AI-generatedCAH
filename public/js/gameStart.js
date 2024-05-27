var userprompts = 0;
const cards = [];
let cardListenersActive = true;
const selectedCards = []; // Global array to keep track of selected cards
const submitButton = document.getElementById("submitTheme");
const startGameButton = document.getElementById('startGame');
const selectCards = document.getElementById('selectCards');
selectCards.classList.add("disabled");
const amountSelectedCards = document.getElementById('amountSelected');


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

function handleCardClick(card) {
    if (!cardListenersActive) {
        return;
    }
        const index = selectedCards.indexOf(card);
        if (index > -1) {
            // Card is already selected, remove it
            selectedCards.splice(index, 1);
            card.classList.remove('selected');
        } else if (selectedCards.length < 2) {
            // Add new card to the selection if less than 2 are selected
            selectedCards.push(card);
            card.classList.add('selected');
        }
        amountSelectedCards.innerText = `${selectedCards.length}/2 selected`;
        if (selectedCards.length === 2) {
            selectCards.classList.remove('disabled');
        } else {
            selectCards.classList.add('disabled');
        }
    };

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
        cards.push(card);
        card.addEventListener('click', () => handleCardClick(card));
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

startGameButton.addEventListener('click', async () => {
    const selectedPhrases = selectedCards.map(card => card.textContent);
    const playerID = sessionStorage.getItem('playerID');
    console.log(playerID);

    for (const phrase of selectedPhrases) {
        try {
            const createCardResponse = await createCard(phrase, playerID);
            console.log(createCardResponse);
            console.log(createCardResponse.id);
            const addCardToPlayerResponse = await addCardToPlayer(playerID, createCardResponse.id);
            console.log(addCardToPlayerResponse);
        } catch (error) {
            console.error('Error:', error);
        }
    }
});

selectCards.addEventListener('click', () => {
    cards.forEach(card => {
        if (card !== selectedCards[0] && card !== selectedCards[1]) {
            card.style.opacity = 0;
            card.style.transform = 'translateX(-100px)';
        } else {
            card.style.transform = 'translateX(0px)';
        }
        cardListenersActive = false;
        console.log("event removed")
    });
    });



async function createCard(text, creator) {
    try {
        const response = await fetch('/createCard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text, creator })
        });

        const data = await response.json();
        return data;  // Return the data received from the server
    } catch (error) {
        console.error('Error creating player:', error);
        throw error;
    }
}

async function addCardToPlayer(playerID, cardID) {
    try {
        const response = await fetch('/addCardToPlayer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ playerID, cardID })
        });

        const data = await response.json();
        return data;  // Return the data received from the server
    } catch (error) {
        console.error('Error creating player:', error);
        throw error;
    }
}