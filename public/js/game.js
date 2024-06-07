document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.hand .card');
  
    cards.forEach(card => {
      card.addEventListener('click', function() {
        if (this.classList.contains('selected')) {
          this.classList.remove('selected');
        } else {
          cards.forEach(c => c.classList.remove('selected'));
          this.classList.add('selected');
        }
      });
    });
  });