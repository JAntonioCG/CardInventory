const apiUrl = 'http://localhost:8888/cardinventory/src/index.php';

document.addEventListener('DOMContentLoaded', async () => {
  const searchForm = document.querySelector('form');
  const searchInput = document.querySelector('input[type="search"]');
  const expansionsContainer = document.getElementById('expansions-container');

  const categories = [
    'electric', 'water', 'steel', 'bug', 'dragon', 'ghost',
    'fire', 'fairy', 'ice', 'fighting', 'normal', 'grass',
    'psychic', 'rock', 'dark', 'ground', 'poison', 'flying',
    'colorless energy', 'common'
  ];

  const determineSearchType = (query) => {
    const lowerQuery = query.toLowerCase();

    if (categories.includes(lowerQuery)) {
      return { type: 'category', endpoint: `${apiUrl}/cartas/category`, payload: { category: query } };
    }

    return { type: 'name', endpoint: `${apiUrl}/cartas/nombre`, payload: { name: query } };
  };

  // Función para obtener expansiones desde la API
  const fetchExpansions = async () => {
    try {
      const response = await fetch(`${apiUrl}/expansiones`);
      if (response.ok) {
        const expansions = await response.json();
        return expansions;
      } else {
        console.error('Error fetching expansions:', response.status);
        return [];
      }
    } catch (error) {
      console.error('Error fetching expansions:', error);
      return [];
    }
  };

  // Renderizar expansiones como botones
  const renderExpansionButtons = (expansions) => {
    expansionsContainer.innerHTML = ''; // Limpiar contenedor
    expansions.forEach((expansion) => {
      const button = document.createElement('button');
      button.className = 'btn btn-outline-primary col-auto mx-2';
      button.textContent = expansion.name; // Supongamos que "name" es el campo con el nombre de la expansión
      button.addEventListener('click', () => {
        handleExpansionClick(expansion.name);
      });
      expansionsContainer.appendChild(button);
    });
  };

  // Manejo del clic en un botón de expansión
  const handleExpansionClick = async (expansionName) => {
    try {
      const response = await fetch(`${apiUrl}/cartas/expansion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: expansionName }),
      });

      if (response.ok) {
        const cards = await response.json();

        if (Array.isArray(cards) && cards.length > 0) {
          localStorage.setItem('cards', JSON.stringify(cards)); // Guardar las cartas en localStorage
          window.location.href = 'pages/search/index.html'; // Redirigir a la página de búsqueda
        } else {
          alert('No se encontraron cartas para esta expansión.');
        }
      } else {
        console.error('Error fetching cards.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Manejo del formulario de búsqueda
  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const searchQuery = searchInput.value.trim();

    if (searchQuery === '') {
      alert('Please enter a search term.');
      return;
    }

    try {
      const { endpoint, payload } = determineSearchType(searchQuery);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const cards = await response.json();

        if (Array.isArray(cards) && cards.length > 0) {
          localStorage.setItem('cards', JSON.stringify(cards));
          window.location.href = 'pages/search/index.html'; // Redirigir a la página de búsqueda
        } else {
          alert('No se encontraron cartas.');
        }
      } else {
        console.error('Error fetching cards.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });

  // Inicializar la carga de expansiones
  const expansions = await fetchExpansions();
  renderExpansionButtons(expansions);
});
