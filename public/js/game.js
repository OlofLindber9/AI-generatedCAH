document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.hand .card');

    cards.forEach(card => {
      card.addEventListener('click', function() {
        // Clear previously selected cards
        cards.forEach(c => {
          c.classList.remove('selected');
          c.style.transform = ''; // Reset transform
          c.style.left = ``;
          c.style.top = ``;
        });
  
        // Toggle selection of the current card
        if (this.classList.contains('selected')) {
          this.classList.remove('selected');
          this.style.transform = ''; // Reset transform
          c.style.left = ``;
          c.style.top = ``;
        } else {
          this.classList.add('selected');
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
    });

  