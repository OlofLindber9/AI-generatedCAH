
document.addEventListener('initComplete', async function() {

    var userprompts = 0;
    const submitButton = document.getElementById("submit-input");
    const redoButton = document.getElementById("redo-chat");
    const outputArea = document.getElementById("output-text");

    submitButton.addEventListener("click", async function() {
        const userInput = document.getElementById("input").value;
        document.getElementById('input').value = '';

        if (userInput.trim() !== '') {
            outputArea.innerText = 'Please wait, generating response...';

            // Call the function and handle the response
            console.log(chatIDs[chatIDs.length - 1]);
            continueChat(userInput, chatIDs[chatIDs.length - 1]).then(data => {
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

    redoButton.addEventListener("click", async function() {
        outputArea.innerText = 'chat restarted, please enter your first message.';

        // Call the function and handle the response
        createNewChat().then(data => {
            if (data) {
                chatIDs.push(data.chatId);
            }
        }).catch(error => {
            outputArea.innerText = 'Error: Could not retrieve the response.';
        });
        userprompts = 0;
        continueChat(userInput, chatIDs[chatIDs.length - 1]).then(data => {
            if (data) {
                outputArea.innerText = data.aiResponse;
            }
        }).catch(error => {
            outputArea.innerText = 'Error: Could not retrieve the response.';
        });
        userprompts++;
        document.getElementById('input').value = '';  
    });

});


async function createNewChat() {
    const endpoint = '/createNewChat';
  
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
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

async function continueChat(promptText, chatID) {
    const endpoint = '/continueChat';
  
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: promptText, chatID : chatID}),
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