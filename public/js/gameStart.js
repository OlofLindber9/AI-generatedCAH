var userprompts = 0;
const cards = [];
let cardListenersActive = true;
let cardsSelected = false;
let cardsGenerated = false;
let playerCantGenerateCards = false;
const selectedCards = []; // Global array to keep track of selected cards
const submitButton = document.getElementById("submitTheme");
const startGameButton = document.getElementById('startGame');
const selectCards = document.getElementById('selectCards');
selectCards.classList.add("disabled");
const amountSelectedCards = document.getElementById('amountSelected');
const amountOfCards = await getPlayerAmountOfCards(sessionStorage.getItem('playerID'));

if (amountOfCards >= 8) {
    cardListenersActive = false;
    cardsSelected = true;
    playerCantGenerateCards = true;
    showPopup('You have reached the maximum amount of cards. Press ready to start the game.');
}


const gameStartSocket = io();
gameStartSocket.on('connect', async function() {
    console.log('Connected to game start namespace');
    if (sessionStorage.getItem('isHost')){
        gameStartSocket.emit('createRoom', sessionStorage.getItem('roomId'), sessionStorage.getItem('name'));
    }else{
        gameStartSocket.emit('joinRoom', sessionStorage.getItem('roomId'), sessionStorage.getItem('name'));
    }
});

gameStartSocket.on('error', (error) => {
    console.error('Connection Error:', error);
});

gameStartSocket.on('message', function(msg) {
    console.log(msg);
    // Display this message on your web page
});

function joinRoom(roomId, playerName) {
    gameStartSocket.emit('joinRoom', roomId, playerName);
}

gameStartSocket.on('gameEvent', function(data) {
    console.log(data);
    // Handle game events here
});

gameStartSocket.on('checkIfAllIsReady', async function() {
    let statuses = await getplayersStatus(sessionStorage.getItem('lobbyID'))
    let allCompleted = statuses.every(status => status === "GENERATING CARDS COMPLETED");
    if (allCompleted) {
        window.location.href = '/game';
    }
});

function sendGameEvent(eventData) {
    const roomId = document.getElementById('room-id').value;
    gameStartSocket.emit('gameEvent', { roomId: roomId, event: eventData });
}

submitButton.addEventListener("click", async function() {
    if (cardsGenerated) {
        showPopup('You have already generated cards');
        return;
    }
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
        cardsGenerated = true;
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

function emToPixels(elem, em) {
    return em * parseFloat(getComputedStyle(elem).fontSize);
}

function moveElement(element, translateXEm) {
    const translateXPixels = emToPixels(element, translateXEm);
    requestAnimationFrame(() => {
        element.style.left = `${translateXPixels}px`;
    });
}

startGameButton.addEventListener('click', async () => {

    if (playerCantGenerateCards) {
        startGameButton.style.pointerEvents = 'none';
        const playerID = sessionStorage.getItem('playerID');
        startGameButton.classList.add('green');
        await updatePlayer(playerID, 'status', 'GENERATING CARDS COMPLETED')
        gameStartSocket.emit('playerGeneratedCardsDone', { roomId: sessionStorage.getItem('roomId') });
        return;
    }
    if (!cardsSelected) {
        showPopup('You must select 2 cards');
        return;
    }
    startGameButton.style.pointerEvents = 'none';
    const playerID = sessionStorage.getItem('playerID');
    const selectedPhrases = selectedCards.map(card => card.textContent);
    console.log(playerID);

    if (selectedCards.length !== 2) {
        showPopup('You must select 2 cards');
        return;
    }
    for (const card of selectedCards) {
        moveElement(card, 75);
    }
    startGameButton.classList.add('green');

    for (const phrase of selectedPhrases) {
        try {
            const createCardResponse = await createCard(phrase, playerID);
            const addCardToPlayerResponse = await addCardToPlayer(playerID, createCardResponse.id);
            console.log(addCardToPlayerResponse);
        } catch (error) {
            console.error('Error:', error);
        }
    }
    await updatePlayer(playerID, 'status', 'GENERATING CARDS COMPLETED')
    gameStartSocket.emit('playerGeneratedCardsDone', { roomId: sessionStorage.getItem('roomId') });
});

selectCards.addEventListener('click', () => {

    var selectedCardNumebr = 0;
    cards.forEach(card => {
        if (card !== selectedCards[0] && card !== selectedCards[1]) {
            card.style.opacity = 0;
            card.style.transform = 'translateX(-100px)';
        } else {
            selectedCardNumebr++;
            if (card === cards[0] && selectedCardNumebr === 1){
                card.style.transform = 'translateY(14.60em)';
            }  else if (card === cards[1] && selectedCardNumebr === 1){
                card.style.transform = 'translateY(14.60em) translateX(-23em)';
            } else if (card === cards[1] && selectedCardNumebr === 2){
                card.style.transform = 'translateY(14.60em)';
            } else if (card === cards[2] && selectedCardNumebr === 2){
                card.style.transform = 'translateX(23em)';
            }else if (card === cards[3] && selectedCardNumebr === 1){
                card.style.transform = 'translateX(-23em)';
            } else if (card === cards[4]){
                card.style.transform = 'translateY(-14.60em) translateX(11.5em)';
            }
    }
        cardListenersActive = false;
        cardsSelected = true;
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

async function getPlayerAmountOfCards(playerID) {
    try {
        const url = new URL('/getPlayerAmountOfCards', window.location.origin);
        url.searchParams.append('playerId', playerID);

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
        return data.numberOfCards;  // Return the data received from the server
    }
    catch (error) {
        console.error('Error getting player:', error);
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

async function getplayersStatus(lobbyId) {
    try {
        // Append the playerId as a query parameter in the URL
        const url = new URL('/getPlayersFromLobby', window.location.origin);
        url.searchParams.append('lobbyId', lobbyId);
        console.log(lobbyId)

        const response = await fetch(url, {
            method: 'GET', // GET request
            headers: {
                'Accept': 'application/json' // Accept header for expecting JSON data
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const statuses = [];
        const data = await response.json();
        data.players.forEach(player => {
            statuses.push(player.playerData.status);
        });
        return statuses;  // Return the data received from the server
    }
    catch (error) {
        console.error('Error getting player:', error);
        throw error;
    }
}

function showPopup(text) {
    var popup = document.getElementById('popup');
    popup.textContent = text;
    popup.style.display = 'block';

    setTimeout(function() {
        popup.style.display = 'none';
    }, 3000);
}