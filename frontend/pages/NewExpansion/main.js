document.getElementById('addExpansionForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Evitar el envío predeterminado del formulario
  const name = document.getElementById('expansionName').value;
  const responseMessage = document.getElementById('responseMessage');

  try {
    const response = await fetch('http://localhost:8888/cardinventory/src/index.php/expansion/insertar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (response.ok) {
      const result = await response.json();
      responseMessage.textContent = result ? "Expansion added successfully!" : "Failed to add expansion.";
      responseMessage.style.color = result ? "green" : "red";
    } else {
      responseMessage.textContent = "Server error.";
      responseMessage.style.color = "red";
    }
  } catch (error) {
    responseMessage.textContent = "An error occurred.";
    responseMessage.style.color = "red";
    console.error(error);
  }
});
