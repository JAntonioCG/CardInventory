// URL base de la API
const apiUrl = 'http://localhost:8888/cardinventory/src/index.php'; // Cambia según tu configuración

// Función para obtener expansiones desde la API
const fetchExpansions = async () => {
  try {
    const response = await fetch(`${apiUrl}/expansiones`);
    if (response.ok) {
      return await response.json();
    } else {
      console.error('Error al obtener expansiones:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error al obtener expansiones:', error);
    return [];
  }
};

// Función para obtener condiciones desde la API
const fetchConditions = async () => {
  try {
    const response = await fetch(`${apiUrl}/condiciones`);
    if (response.ok) {
      return await response.json();
    } else {
      console.error('Error al obtener condiciones:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error al obtener condiciones:', error);
    return [];
  }
};

// Función para obtener subexpansiones desde la API
const fetchSubexpansions = async (expansion_id) => {
  try {
    const response = await fetch(`${apiUrl}/subexpansiones/expansion_id`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expansion_id }),
    });
    if (response.ok) {
      return await response.json();
    } else {
      console.error('Error al obtener subexpansiones:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error al obtener subexpansiones:', error);
    return [];
  }
};

// Función para obtener cartas según subexpansion_id
const fetchCardsBySubexpansion = async (subexpansion_id) => {
  try {
    const response = await fetch(`${apiUrl}/cartas/subexpansionId`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subexpansion_id }),
    });
    if (response.ok) {
      return await response.json();
    } else {
      console.error('Error al obtener cartas:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error al obtener cartas:', error);
    return [];
  }
};

// Función para insertar datos en el inventario
const insertInventory = async (inventoryData) => {
  try {
    const response = await fetch(`${apiUrl}/inventory/insertar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inventoryData),
    });
    if (response.ok) {
      const result = await response.json();
      console.log('Datos del inventario insertados:', result);
      return result;
    } else {
      console.error('Error al insertar inventario:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Error al insertar inventario:', error);
    return null;
  }
};

// Función para manejar el envío del formulario
const handleFormSubmit = async (event) => {
  event.preventDefault(); // Evitar que se recargue la página

  // Obtener datos del formulario
  const cardId = document.getElementById('cardSelector').value;
  const conditionId = document.getElementById('cardConditionSelector').value;
  const price = document.getElementById('cardPrice').value;
  const stock = document.getElementById('cardStock').value;

  // Validar datos
  if (!cardId || !conditionId) {
    alert('Por favor, selecciona una carta y condición válidas.');
    return;
  }

  // Datos para insertar en inventario
  const inventoryData = {
    card_id: cardId,
    condition_id: conditionId,
    price,
    stock,
  };

  // Insertar inventario
  const inventoryResult = await insertInventory(inventoryData);

  if (inventoryResult) {
    alert('Inventario insertado con éxito.');
    document.getElementById('addCardForm').reset(); // Reiniciar formulario
  } else {
    alert('Error al insertar datos en el inventario.');
  }
};

// Función para actualizar los selectores dinámicamente
const populateSelectors = async () => {
  await populateExpansionSelector();
  await populateConditionSelector();
};

// Función para actualizar selector de expansiones
const populateExpansionSelector = async () => {
  const expansionSelector = document.getElementById('expansionSelector');
  expansionSelector.innerHTML = `<option value="" disabled selected>Choose an expansion</option>`;
  const expansions = await fetchExpansions();
  expansions.forEach((expansion) => {
    const option = document.createElement('option');
    option.value = expansion.expansion_id;
    option.textContent = expansion.name;
    expansionSelector.appendChild(option);
  });
};

// Función para actualizar selector de condiciones
const populateConditionSelector = async () => {
  const conditionSelector = document.getElementById('cardConditionSelector');
  conditionSelector.innerHTML = `<option value="" disabled selected>Choose a condition</option>`;
  const conditions = await fetchConditions();
  conditions.forEach((condition) => {
    const option = document.createElement('option');
    option.value = condition.condition_id;
    option.textContent = condition.condition_name;
    conditionSelector.appendChild(option);
  });
};

const populateSubExpansionSelector = async (expansionId) => {
  const subexpansionSelector = document.getElementById('subexpansionSelector');
  const cardSelector = document.getElementById('cardSelector');
  
  // Limpiar las opciones existentes
  subexpansionSelector.innerHTML = `<option value="" disabled selected>Choose a sub-expansion</option>`;
  subexpansionSelector.disabled = true;
  
  // También limpiar las opciones del selector de cartas
  cardSelector.innerHTML = `<option value="" disabled selected>Choose a card</option>`;
  cardSelector.disabled = true;

  if (!expansionId) {
    console.warn("No se proporcionó un ID de expansión.");
    return;
  }

  const subexpansions = await fetchSubexpansions(expansionId);
  subexpansionSelector.disabled = false;

  subexpansions.forEach((subexpansion) => {
    const option = document.createElement('option');
    option.value = subexpansion.subexpansion_id;
    option.textContent = subexpansion.name;
    subexpansionSelector.appendChild(option);
  });
};


const populateCardSelector = async (subexpansionId) => {
  const cardSelector = document.getElementById('cardSelector');
  
  cardSelector.innerHTML = `<option value="" disabled selected>Choose a card</option>`;
  cardSelector.disabled = true; // Deshabilita mientras se cargan las opciones
  
  if (!subexpansionId) {
    console.warn("No se proporcionó un ID de subexpansión.");
    return;
  }

  const cards = await fetchCardsBySubexpansion(subexpansionId);
  cardSelector.disabled = false; // Habilita después de cargar las opciones
  
  cards.forEach((card) => {
    const option = document.createElement('option');
    option.value = card.card_id;
    option.textContent = card.name;
    cardSelector.appendChild(option);
  });
};


document.getElementById('expansionSelector').addEventListener('change', (event) => {
  const expansionId = event.target.value;
  populateSubExpansionSelector(expansionId);

  // Reiniciar el selector de cartas
  const cardSelector = document.getElementById('cardSelector');
  cardSelector.innerHTML = `<option value="" disabled selected>Choose a card</option>`;
  cardSelector.disabled = true;
});


document.getElementById('subexpansionSelector').addEventListener('change', (event) => {
  const subexpansionId = event.target.value;
  populateCardSelector(subexpansionId);
});


// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
  await populateSelectors();
});

// Asociar el evento de envío del formulario
document.getElementById('addCardForm').addEventListener('submit', handleFormSubmit);
