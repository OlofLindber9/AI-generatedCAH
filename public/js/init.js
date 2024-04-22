
window.chatIDs = [];

async function main() {
    console.log('main function started :)(I)I)(');

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
  
    main();