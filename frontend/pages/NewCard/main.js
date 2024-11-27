// URL base de la API
const apiUrl = 'http://localhost:8888/cardinventory/src/index.php'; // Cambia según tu configuración

// Función para obtener expansiones desde la API
const fetchExpansions = async () => {
  try {
    const response = await fetch(`${apiUrl}/expansiones`);
    if (response.ok) {
      const expansions = await response.json();
      return expansions; // Devuelve las expansiones en formato JSON
    } else {
      console.error('Error al obtener expansiones:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error al obtener expansiones:', error);
    return [];
  }
};

// Función para obtener subexpansiones desde la API
const fetchSubexpansions = async (expansion_id) => {
  try {
    // Crea un objeto con el cuerpo de la solicitud
    const requestBody = {
      expansion_id: expansion_id,  // El expansion_id se obtiene del selector
    };

    // Realiza la solicitud POST
    const response = await fetch(`${apiUrl}/subexpansiones/expansion_id`, {
      method: 'POST',  // Cambia a POST
      headers: {
        'Content-Type': 'application/json',  // Asegura que el cuerpo sea JSON
      },
      body: JSON.stringify(requestBody),  // Convierte el cuerpo del objeto a formato JSON
    });

    // Verifica si la respuesta fue exitosa
    if (response.ok) {
      const subexpansions = await response.json();  // Parsear la respuesta JSON
      return subexpansions;  // Devuelve las subexpansiones
    } else {
      console.error('Error al obtener subexpansiones:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error al obtener subexpansiones:', error);
    return [];
  }
};

// Función para actualizar dinámicamente el selector de expansiones
const populateExpansionSelector = async () => {
  const expansionSelector = document.getElementById('expansionSelector');
  
  // Limpia todas las opciones excepto el placeholder
  expansionSelector.innerHTML = `
    <option value="" disabled selected>Choose an expansion</option>
  `;

  // Obtiene las expansiones de la API
  const expansions = await fetchExpansions();

  // Crea dinámicamente las nuevas opciones
  if (expansions.length > 0) {
    expansions.forEach(expansion => {
      const option = document.createElement('option');
      option.value = expansion.expansion_id; // Usar expansion_id
      option.textContent = expansion.name; // Nombre visible
      expansionSelector.appendChild(option);
    });
  } else {
    console.warn('No se encontraron expansiones disponibles.');
  }
};

// Función para actualizar dinámicamente el selector de subexpansiones
const populateSubExpansionSelector = async (expansionId) => {
  const subexpansionSelector = document.getElementById('subexpansionSelector');
  
  // Limpia todas las opciones excepto el placeholder
  subexpansionSelector.innerHTML = `
    <option value="" disabled selected>Choose a sub-expansion</option>
  `;

  // Deshabilita el selector de subexpansiones hasta que se seleccione una expansión
  subexpansionSelector.disabled = true;

  // Obtiene las subexpansiones relacionadas con la expansión seleccionada
  const subexpansions = await fetchSubexpansions(expansionId);

  // Habilita el selector de subexpansiones
  subexpansionSelector.disabled = false;

  // Crea dinámicamente las nuevas opciones de subexpansiones
  if (subexpansions.length > 0) {
    subexpansions.forEach(subexpansion => {
      const option = document.createElement('option');
      option.value = subexpansion.subexpansion_id; // Usar subexpansion_id
      option.textContent = subexpansion.name; // Nombre visible
      subexpansionSelector.appendChild(option);
    });
  } else {
    console.warn('No se encontraron subexpansiones disponibles para esta expansión.');
  }
};

// Evento para habilitar y cargar las subexpansiones al seleccionar una expansión
document.getElementById('expansionSelector').addEventListener('change', (event) => {
  const expansionId = event.target.value;
  
  // Si se selecciona una expansión válida
  if (expansionId) {
    // Cargar subexpansiones relacionadas
    populateSubExpansionSelector(expansionId);
  }
});

// Ejecutar cuando la página cargue
document.addEventListener('DOMContentLoaded', () => {
  // Llenar el selector de expansiones al cargar la página
  populateExpansionSelector();
});
