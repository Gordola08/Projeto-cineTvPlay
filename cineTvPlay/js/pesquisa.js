document.addEventListener('DOMContentLoaded', () => {
    setupPagination();
    setupSearchAnimation();
  });

  document.querySelector('.search-button').addEventListener('click', function () {
    const searchInput = document.getElementById('searchInput');
    searchInput.classList.remove('d-none'); // Remove a classe que esconde o input
    searchInput.focus(); // Foca no input assim que ele é mostrado
  });

function setupSearchAnimation() {
    const searchWrapper = document.querySelector('.search-wrapper');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('button-addon2');
  
    searchButton.addEventListener('click', () => {
      if (searchWrapper.classList.contains('expanded')) {
        if (searchInput.value.trim() === '') {
          searchWrapper.classList.remove('expanded');
          searchInput.classList.remove('expanded');
          searchInput.classList.add('collapsed');
        }
      } else {
        searchWrapper.classList.add('expanded');
        searchInput.classList.add('expanded');
        searchInput.classList.remove('collapsed');
        searchInput.focus();
      }
    });
  
    // Adiciona um listener para fechar a barra de pesquisa ao clicar fora dela
    document.addEventListener('click', (event) => {
      if (!searchWrapper.contains(event.target) && !searchButton.contains(event.target)) {
        searchWrapper.classList.remove('expanded');
        searchInput.classList.remove('expanded');
        searchInput.classList.add('collapsed');
      }
    });
  }
  
  
function searchMovies(query) {
    const encodedQuery = encodeURIComponent(query);
    const searchUrl = `${apiUrl}/search/movie?api_key=${apiKey}&language=pt-BR&query=${encodedQuery}`;
  
    fetch(searchUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao buscar filmes na API TheMovieDB.');
        }
        return response.json();
      })
      .then(data => {
        if (data.results && data.results.length > 0) {
          displaySearchResults(data.results);
        } else {
          clearSearchResults();
        }
      })
      .catch(error => {
        console.error('Erro ao buscar filmes na API TheMovieDB:', error);
        clearSearchResults();
      });
  }
  
  function displaySearchResults(movies) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';
  
    movies.forEach(movie => {
      const resultItem = document.createElement('a');
      resultItem.className = 'dropdown-item d-flex align-items-center';
      resultItem.href = `javascript:void(0)`;
      resultItem.onclick = () => viewMovieDetails(movie.id, 'movie');
  
      resultItem.innerHTML = `
        <img src="${imageBaseUrl}${movie.poster_path}" alt="${movie.title}" class="img-thumbnail mr-2" style="width: 50px;">
        <div>
          <strong>${movie.title}</strong><br>
          <span>${getStarRating(movie.vote_average)}</span>
        </div>
      `;
  
      searchResults.appendChild(resultItem);
    });
  
    searchResults.style.display = 'block';
  }
  
  function clearSearchResults() {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';
    searchResults.style.display = 'none';
  }
  function setupSearch() {
    const searchButton = document.getElementById('button-addon2');
    const searchInput = document.getElementById('searchInput');
  
    searchButton.addEventListener('click', () => {
      if (searchInput.value.trim() !== '') {
        searchMovies(searchInput.value.trim(), true);
      }
    });
  
    searchInput.addEventListener('input', () => {
      if (searchInput.value.trim() !== '') {
        searchMovies(searchInput.value);
      } else {
        clearSearchResults();
      }
    });
  }