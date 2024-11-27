window.addEventListener('DOMContentLoaded', () => {
  const cards = JSON.parse(localStorage.getItem('cards')) || []; // Recuperar cartas
  const cardsContainer = document.getElementById('cards-container');
  const subexpansionFilter = document.getElementById('subexpansion-filter');
  const paginationControls = document.getElementById('pagination-controls'); // Nuevo contenedor para paginación
  let currentPage = 1; // Página actual
  const cardsPerPage = 20; // Número de cartas por página

  // Función para calcular el índice de inicio y fin para una página
  const getPaginationBounds = () => {
    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    return [start, end];
  };

  const showSpinner = () => {
    document.getElementById('loading-spinner').style.display = 'fixed';
  };

  const hideSpinner = () => {
    document.getElementById('loading-spinner').style.display = 'none';
  };

  const renderCards = (filteredCards) => {
    cardsContainer.innerHTML = ''; // Limpiar contenedor
    const [start, end] = getPaginationBounds();
    const paginatedCards = filteredCards.slice(start, end);

    const loadingSpinner = document.getElementById('loading-spinner'); // Spinner de carga
    loadingSpinner.style.display = 'flex'; // Mostrar el spinner antes de cargar las imágenes

    let imagesLoaded = 0; // Contador de imágenes cargadas
    const totalImages = paginatedCards.length; // Total de imágenes a cargar

    if (totalImages > 0) {
      paginatedCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('col-md-3', 'mb-4');

        const img = document.createElement('img');
        img.src = card.CardUrl;
        img.classList.add('card-img-top');
        img.alt = card.CardName;

        // Manejar evento 'load' de cada imagen
        img.onload = () => {
          imagesLoaded++;
          if (imagesLoaded === totalImages) {
            loadingSpinner.style.display = 'none'; // Ocultar el spinner cuando todas las imágenes estén cargadas
          }
        };

        img.onerror = () => {
          imagesLoaded++; // Incrementar contador aunque la imagen falle
          if (imagesLoaded === totalImages) {
            loadingSpinner.style.display = 'none'; // Ocultar el spinner
          }
        };

        cardElement.innerHTML = `
          <div class="card">
            ${img.outerHTML}
            <div class="card-body">
              <h5 class="card-title">${card.CardName}</h5>
              <p class="card-text">Expansion: ${card.Expansion}</p>
              <p class="card-text">Subexpansion: ${card.SubExpansion}</p>
              <p class="card-text">Category: ${card.Category}</p>
              <p class="card-text">Rarity: ${card.Rarity}</p>
              <p class="card-text">Card Number: ${card.CardNumber}</p>
              <p class="card-text">Stock: ${card.Stock}</p>
              <p class="card-text">Condition: ${card.Conditions}</p>
              <p class="card-text">Price: $${card.Price}</p>
            </div>
          </div>
        `;
        cardsContainer.appendChild(cardElement);
      });
    } else {
      cardsContainer.innerHTML = '<p class="text-center">No results found.</p>';
      loadingSpinner.style.display = 'none'; // Ocultar el spinner si no hay resultados
    }

    // Fallback para ocultar el spinner en caso de errores
    setTimeout(() => {
      if (loadingSpinner.style.display === 'flex') {
        loadingSpinner.style.display = 'none';
      }
    }, 5000); // Tiempo máximo de espera para ocultar el spinner

    updatePaginationControls(filteredCards.length);
  };

  const updatePaginationControls = (totalCards) => {
    paginationControls.innerHTML = '';
    const totalPages = Math.ceil(totalCards / cardsPerPage);

    if (totalPages > 1) {
      const prevButton = document.createElement('button');
      prevButton.textContent = 'Previous';
      prevButton.classList.add('btn', 'btn-secondary', 'me-2');
      prevButton.disabled = currentPage === 1;
      prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          renderCards(getFilteredCards());
          scrollToTop(); // Desplazar hacia arriba
        }
      });
      paginationControls.appendChild(prevButton);

      const nextButton = document.createElement('button');
      nextButton.textContent = 'Next';
      nextButton.classList.add('btn', 'btn-secondary');
      nextButton.disabled = currentPage === totalPages;
      nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++;
          renderCards(getFilteredCards());
          scrollToTop(); // Desplazar hacia arriba
        }
      });
      paginationControls.appendChild(nextButton);
    }
  };


  // Función para desplazarse al inicio de la sección de cartas
  const scrollToTop = () => {
    const section = document.querySelector('section'); // Seleccionar la sección de resultados
    section.scrollIntoView({ behavior: 'smooth' }); // Desplazar con efecto suave
  };


  // Obtener cartas filtradas según la subexpansión seleccionada
  const getFilteredCards = () => {
    const selectedSubexpansion = subexpansionFilter.value;
    return selectedSubexpansion === 'all'
      ? cards
      : cards.filter(card => card.SubExpansion === selectedSubexpansion);
  };

  // Inicializar la página
  const initializePage = () => {
    if (cards.length > 0) {
      populateSubexpansionFilter(cards); // Llenar el filtro dinámicamente
      renderCards(cards);               // Renderizar las cartas inicialmente
    } else {
      cardsContainer.innerHTML = '<p class="text-center">No results found.</p>';
    }
  };

  // Función para llenar dinámicamente el select con las subexpansiones
  const populateSubexpansionFilter = (cards) => {
    // Obtener una lista única de subexpansiones
    const subexpansions = [...new Set(cards.map(card => card.SubExpansion))];

    // Limpiar el select antes de llenarlo
    subexpansionFilter.innerHTML = '<option value="all">All Subexpansions</option>';

    // Crear una opción para cada subexpansión
    subexpansions.forEach(subexpansion => {
      const option = document.createElement('option');
      option.value = subexpansion;
      option.textContent = subexpansion;
      subexpansionFilter.appendChild(option);
    });
  };

  subexpansionFilter.addEventListener('change', () => {
    const selectedSubExpansion = subexpansionFilter.value;

    // Filtrar las cartas según la subexpansión seleccionada
    const filteredCards = selectedSubExpansion === 'all'
      ? cards // Mostrar todas las cartas si selecciona "All Subexpansions"
      : cards.filter(card => card.SubExpansion === selectedSubExpansion);

    // Reiniciar a la página 1
    currentPage = 1;

    // Renderizar las cartas filtradas
    renderCards(filteredCards);

    // Actualizar los controles de paginación
    updatePaginationControls(filteredCards.length);
  });

  initializePage();
});
