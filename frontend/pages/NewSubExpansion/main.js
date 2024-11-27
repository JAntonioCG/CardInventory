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

// Función para actualizar dinámicamente el selector
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
      option.value = expansion.expansion_id;
      option.textContent = expansion.name;
      expansionSelector.appendChild(option);
    });
  } else {
    console.warn('No se encontraron expansiones disponibles.');
  }
};

// Función para enviar la sub-expansión al backend
const submitSubExpansion = async (name, expansionId) => {
  try {
    const response = await fetch(`${apiUrl}/subexpansion/insertar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        expansion_id: expansionId
      })
    });

    if (response.ok) {
      const result = await response.json();

      document.getElementById('responseMessage').innerHTML = '<p class="text-success">Sub-expansion added successfully!</p>';
    } else {
      console.error('Error al insertar sub-expansión:', response.status);
      document.getElementById('responseMessage').innerHTML = '<p class="text-danger">Error inserting sub-expansion.</p>';
    }
  } catch (error) {
    console.error('Error al enviar sub-expansión:', error);
    document.getElementById('responseMessage').innerHTML = '<p class="text-danger">Error sending data.</p>';
  }
};

// Evento para manejar el formulario de "Confirm"
document.getElementById('addSubExpansionForm').addEventListener('submit', (event) => {
  event.preventDefault(); // Prevenir el envío por defecto del formulario

  // Capturar el nombre de la sub-expansión y el ID de la expansión seleccionada
  const name = document.getElementById('expansionName').value;
  const expansionId = document.getElementById('expansionSelector').value;

  // Verificar que ambos campos estén completos
  if (name && expansionId) {
    // Enviar la sub-expansión al backend
    submitSubExpansion(name, expansionId);
  } else {
    // Si faltan datos, mostrar un mensaje
    document.getElementById('responseMessage').innerHTML = '<p class="text-warning">Please fill in all fields.</p>';
  }
});


// Ejecutar cuando la página cargue
document.addEventListener('DOMContentLoaded', () => {
  populateExpansionSelector();
});
