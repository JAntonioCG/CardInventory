
const apiUrl = 'http://localhost:8888/cardinventory/src/index.php'

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.querySelector('form')
  const searchInput = document.querySelector('input[type="search"]')

  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    const searchQuery = searchInput.value.trim()

    if (searchQuery === '') {
      alert('Please enter a search term.')
      return
    }

    try {
      const isCategory = searchQuery.toLowerCase().includes('electric') || searchQuery.toLowerCase().includes('water');

      const url = isCategory ?  apiUrl+'/cartas/category' :  apiUrl+'/cartas/nombre'
      const body = JSON.stringify(isCategory ? { category: searchQuery } : { name: searchQuery })

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      if (response.ok) {
        const cards = await response.json()
      
        if (Array.isArray(cards)) {
          console.log('@@@ Cartas =>', cards)
        } else {
          console.log('No se encontraron cartas')
        }
      } else {
        console.error('Error fetching cards')
      }      
    } catch (error) {
      console.error('Error:', error)
    }
  })
})
