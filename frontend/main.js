const apiUrl = 'http://localhost:8888/cardinventory/src/index.php';

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.querySelector('form');
  const searchInput = document.querySelector('input[type="search"]');

  const categories = [
    'electric', 'water', 'steel', 'bug', 'dragon', 'ghost', 
    'fire', 'fairy', 'ice', 'fighting', 'normal', 'grass', 
    'psychic', 'rock', 'dark', 'ground', 'poison', 'flying', 
    'colorless energy', 'common'
  ];

  const expansions = [
    'base set', 'neo genesis', 'legendary collection', 'expedition base set', 'ruby & sapphire', 
    'diamond & pearl', 'platinum', 'geartgold & soulsilver', 'black & white',
    'kalos starter set', 'sun & moon', 'sword & shield', 'scarlet & violet'
  ];

  const determineSearchType = (query) => {
    const lowerQuery = query.toLowerCase();

    if (categories.includes(lowerQuery)) {
      return { type: 'category', endpoint: `${apiUrl}/cartas/category`, payload: { category: query } };
    }

    if (expansions.includes(lowerQuery)) {
      return { type: 'expansion', endpoint: `${apiUrl}/cartas/expansion`, payload: { name: query } };
    }

    return { type: 'name', endpoint: `${apiUrl}/cartas/nombre`, payload: { name: query } };
  };

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

        // Verificamos si se encontraron cartas
        if (Array.isArray(cards) && cards.length > 0) {
          console.log('@@@ Cartas =>', cards);
          // Aquí redirigimos después de mostrar las cartas
          localStorage.setItem('cards', JSON.stringify(cards));
          window.location.href = 'pages/search/index.html';  // Redirigir a la carpeta "search"
        } else {
          console.log('No se encontraron cartas.');
          alert('No se encontraron cartas.');
        }
      } else {
        console.error('Error fetching cards.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
});
