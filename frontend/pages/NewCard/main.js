// URL base de la API
const apiUrl = 'http://localhost:8888/cardinventory/src/index.php'; // Cambia según tu configuración

let globalLastId = null;

// Función para obtener last_id desde la API
const fetchLastId = async () => {
  try {
    const response = await fetch(`${apiUrl}/cartas/newId`);
    if (response.ok) {
      const result = await response.json();
      globalLastId = result[0].last_ID; // Asignar el valor a la variable global
    } else {
      console.error('Error al obtener last_id:', response.status);
    }
  } catch (error) {
    console.error('Error al obtener last_id:', error);
  }
};

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

// Función para insertar una carta en la base de datos
const insertCard = async (cardData) => {
  try {
    const response = await fetch(`${apiUrl}/cartas/insertar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cardData),
    });
    if (response.ok) {
      const result = await response.json();
      console.log('Carta insertada:', result);
      return result;
    } else {
      console.error('Error al insertar carta:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Error al insertar carta:', error);
    return null;
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
  const cardName = document.getElementById('cardName').value;
  const subexpansionId = document.getElementById('subexpansionSelector').value;
  const rarity = document.getElementById('cardRarity').value;
  const category = document.getElementById('cardCategory').value;
  const cardNumber = document.getElementById('cardNumber').value;
  const cardUrl = document.getElementById('cardURL').value;
  const conditionId = document.getElementById('cardConditionSelector').value;
  const price = document.getElementById('cardPrice').value;
  const stock = document.getElementById('cardStock').value;

  // Validar datos
  if (!globalLastId || !subexpansionId || !conditionId) {
    alert('Por favor, asegúrate de seleccionar una expansión, sub-expansión y condición válidas.');
    return;
  }

  // Datos para insertar carta
  const cardData = {
    card_id: globalLastId,
    name: cardName,
    subexpansion_id: subexpansionId,
    rarity,
    category,
    card_number: cardNumber,
    card_url: cardUrl,
  };

  // Insertar carta
  const cardResult = await insertCard(cardData);

  if (cardResult && cardResult.mensaje) {
    // Datos para insertar en inventario
    const inventoryData = {
      card_id: globalLastId,
      condition_id: conditionId,
      price,
      stock,
    };

    // Insertar inventario
    const inventoryResult = await insertInventory(inventoryData);

    if (inventoryResult) {
      alert('Carta e inventario insertados con éxito.');
      document.getElementById('addCardForm').reset(); // Reiniciar formulario
      await fetchLastId(); // Actualizar el last_id global
    } else {
      alert('Error al insertar datos en el inventario.');
    }
  } else {
    alert('Error al insertar la carta.');
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
    option.textContent = condition.description;
    conditionSelector.appendChild(option);
  });
};

// Función para actualizar selector de subexpansiones
const populateSubExpansionSelector = async (expansionId) => {
  const subexpansionSelector = document.getElementById('subexpansionSelector');
  subexpansionSelector.innerHTML = `<option value="" disabled selected>Choose a sub-expansion</option>`;
  subexpansionSelector.disabled = true;
  const subexpansions = await fetchSubexpansions(expansionId);
  subexpansionSelector.disabled = false;
  subexpansions.forEach((subexpansion) => {
    const option = document.createElement('option');
    option.value = subexpansion.subexpansion_id;
    option.textContent = subexpansion.name;
    subexpansionSelector.appendChild(option);
  });
};

// Evento al cambiar la expansión seleccionada
document.getElementById('expansionSelector').addEventListener('change', (event) => {
  const expansionId = event.target.value;
  if (expansionId) {
    populateSubExpansionSelector(expansionId);
  }
});

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
  await fetchLastId();
  await populateSelectors();
});

// Asociar el evento de envío del formulario
document.getElementById('addCardForm').addEventListener('submit', handleFormSubmit);