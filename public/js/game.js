const cardPhrases = [];
const cardRotations = [-87, -78, -96, -69, -105, -60, -114, -123, -132];
const cardHorizontalPositions = [40, 40, 40.6, 37.9, 37.9, 35, 37.5, 32, 29];
const cardVerticalPositions = [0, -6, 5, -13, 13, -17, 17, 24, 28];
const playCardButton = document.getElementById('playCard');
let cardsSelected = false;

document.addEventListener('DOMContentLoaded', async function () {
    await makeCards();
    const cards = document.querySelectorAll('.hand .card');
    const darkCard = document.getElementById('darkCard');
    const pinvElement = darkCard.querySelector('.pinv');
    if (pinvElement) {
        pinvElement.textContent = "The dark card"
        pinvElement.style.color = 'white';
    }
    cards.forEach(card => {
      card.addEventListener('click', function() {

    // Toggle selection of the current card
    if (this.classList.contains('selected')) {
        this.classList.remove('selected');
        console.log("selcted card clicked");
        this.style.transform = ''; // Reset transform
        this.style.left = ``;
        this.style.top = ``;
        cardsSelected = false;
        } else {
        // Clear previously selected cards
        cards.forEach(c => {
          c.classList.remove('selected');
          c.style.transform = ''; // Reset transform
          c.style.left = ``;
          c.style.top = ``;
        });

        this.classList.add('selected');
        cardsSelected = true;
          // Apply the negative of the stored rotation
          const initialRotation = parseInt(this.getAttribute('data-rotation'), 10);
          const xPos = parseInt(this.getAttribute('data-HorizontalPosition'), 10);
          const yPos = parseInt(this.getAttribute('data-verticalPosition'), 10);
          this.style.transform = `rotate(${0 - initialRotation}deg)`;
          console.log(xPos);
          this.style.left = `${xPos}em`;
          this.style.top = `${yPos}em`;
    }

      });
    });

    playCardButton.addEventListener('click', async function() {
        if (this.classList.contains('green')) {
            showPopup('You have already played a card');
            return;
        }
        if(!cardsSelected){
            showPopup("Please select a card to play");
            return;
        }
        const card = document.querySelector('.selected');
        const cardID = card.getAttribute('data-cardId');
        const response = await addCardToPlayedCards(sessionStorage.getItem('lobbyID', card), cardID);
        this.classList.add('green');
        this.children[0].textContent = 'card played';
        spinAway(card);
    });

    async function makeCards(){
        const hand = document.getElementById('hand');
        const playerCards = await getplayerCards(sessionStorage.getItem('playerID'));
        let index = 0;

        for (const cardId of playerCards) {
            const listItem = document.createElement('li');
            const card = document.createElement('a');
            card.className ='card';
            card.setAttribute('data-rotation', cardRotations[index]);
            card.setAttribute('data-HorizontalPosition', cardHorizontalPositions[index]);
            card.setAttribute('data-verticalPosition', cardVerticalPositions[index]);
            card.setAttribute('data-cardId', cardId);

            const phrase = await getCardText(cardId);
            console.log(phrase);
            cardPhrases.push(phrase);



            const border = document.createElement('div');
            border.classList.add('border');
            card.appendChild(border);
            const filter = document.createElement('div');
            filter.classList.add('filter');
            card.appendChild(filter);
            const text = document.createElement('p');
            text.classList.add('pinv');
            if (!cardPhrases[index]) {
                cardPhrases[index] = "No text found";
            }
            text.textContent = cardPhrases[index];
            card.appendChild(text);
            const shadow = document.createElement('div');
            shadow.classList.add('shadow');
            card.appendChild(shadow);
            const backdrop = document.createElement('div');
            backdrop.classList.add('backdrop');
            card.appendChild(backdrop);
            index++;

            listItem.appendChild(card);
            hand.appendChild(listItem);
        }
    }

    async function getplayerCards(playerId) {
        try {
            // Append the playerId as a query parameter in the URL
            const url = new URL('/getPlayer', window.location.origin);
            url.searchParams.append('playerId', playerId);
    
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
            return data.player.playerData.cards;  // Return the data received from the server
        }
        catch (error) {
            console.error('Error getting player:', error);
            throw error;
        }
    }

    async function getCardText(cardid) {
        try {
            // Append the playerId as a query parameter in the URL
            const url = new URL('/getCard', window.location.origin);
            url.searchParams.append('cardId', cardid);
    
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
            return data.card.text;  // Return the data received from the server
        }
        catch (error) {
            console.error('Error getting player:', error);
            throw error;
        }
    }
    });

    async function addCardToPlayedCards(lobbyId, cardId) {
        try {
            const url = new URL('/addCardToPlayedCards', window.location.origin);
            const data = {
                lobbyId: lobbyId,
                cardId: cardId
            };
    
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            return response.json();
        }
        catch (error) {
            console.error('Error adding card to played cards:', error);
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

    function spinAway(element) {
        element.classList.add('spin-fade-out');
    }
