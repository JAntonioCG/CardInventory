
const apiUrl = 'http://localhost:8888/cardinventory/src/index.php'

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.querySelector('form');
  const searchInput = document.querySelector('input[type="search"]');

  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();  // Evita que la página se recargue al enviar el formulario

    const searchQuery = searchInput.value.trim();  // Obtén el valor ingresado

    if (searchQuery === '') {
      alert('Please enter a search term.');
      return;
    }

    try {
      // Puedes agregar una lógica simple para verificar si es nombre o categoría.
      const isCategory = searchQuery.toLowerCase().includes('electric') || searchQuery.toLowerCase().includes('water');

      const url = isCategory ?  apiUrl+'/cartas/category' :  apiUrl+'/cartas/nombre';
      const body = JSON.stringify(isCategory ? { category: searchQuery } : { name: searchQuery });

      // Realiza la petición POST
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      if (response.ok) {
        const cards = await response.json();
      
        // Asegúrate de que cards es un array
        if (Array.isArray(cards)) {
          console.log('@@@ Cartas =>', cards);
        } else {
          console.log('No se encontraron cartas');
        }
      } else {
        console.error('Error fetching cards');
      }      
    } catch (error) {
      console.error('Error:', error);
    }
  });

  // Función para mostrar las cartas en el frontend
  function displayCards(cards) {
    const cardContainer = document.querySelector('.scrolling-container');
    cardContainer.innerHTML = '';  // Limpia las cartas previas

    cards.forEach(card => {
      const cardElement = `
        <div class="card custom-card mx-2">
          <img src="${card.image}" class="card-img-top custom-card-img" alt="Card Image">
          <div class="card-body">
            <p class="card-text">Price: ${card.price}</p>
            <h5 class="card-title">${card.name}</h5>
            <p class="card-text">Expansion: ${card.expansion}</p>
          </div>
        </div>
      `;
      cardContainer.innerHTML += cardElement;
    });
  }
});
