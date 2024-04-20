
window.chatIDs = [];

async function main() {
    console.log('main function started :)(I)I)(');

    // Call the function and handle the response
    createNewChat().then(data => {
      if (data) {
          chatIDs.push(data.chatId);
      }
    }).catch(error => {
        outputArea.innerText = 'Error: Could not retrieve the response.';
    });

    try {
      // Dispatch the event after a brief timeout
      setTimeout(() => {
      document.dispatchEvent(new Event('initComplete'));
      console.log('initComplete event dispatched');
      }, 500); // Delay in milliseconds
      console.log('initComplete event dispatched');
    } catch (error) {
      console.error('Error in main function:', error);
    }
  }

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

  
    main();