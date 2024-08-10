document.addEventListener('DOMContentLoaded', () => {
  setupSearchAnimation();
  setupSearch();
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
        searchInput.classList.add('d-none'); // Esconde o input se estiver vazio
      }
    } else {
      searchWrapper.classList.add('expanded');
      searchInput.classList.add('expanded');
      searchInput.classList.remove('collapsed');
      searchInput.classList.remove('d-none'); // Mostra o input quando expandido
      searchInput.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!searchWrapper.contains(event.target) && !searchButton.contains(event.target)) {
      searchWrapper.classList.remove('expanded');
      searchInput.classList.remove('expanded');
      searchInput.classList.add('collapsed');
    }
  });
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('button-addon2');
  
    searchButton.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (query !== '') {
        searchSeries(query);
      }
    });
  
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim();
      if (query !== '') {
        searchSeries(query);
      } else {
        clearSearchResults();
      }
    });
  }
  
  function searchSeries(query) {
    const encodedQuery = encodeURIComponent(query);
    const searchUrl = `${apiUrl}/search/tv?api_key=${apiKey}&query=${encodedQuery}&language=pt-BR`;
  
    fetch(searchUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao buscar séries na API TheMovieDB.');
        }
        return response.json();
      })
      .then(data => {
        if (data.results && data.results.length > 0) {
          displaySearchResults(data.results);
        } else {
          console.error('Nenhuma série encontrada na API TheMovieDB.');
          const container = document.getElementById('searchResults');
          container.innerHTML = '<p>Nenhuma série encontrada.</p>';
        }
      })
      .catch(error => {
        console.error('Erro ao buscar séries na API TheMovieDB:', error);
      });
  }
  
  function displaySearchResults(series) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';
  
    series.forEach(serie => {
      const resultItem = document.createElement('a');
      resultItem.className = 'dropdown-item d-flex align-items-center';
      resultItem.href = `javascript:void(0)`;
      resultItem.onclick = () => viewSeriesDetails(serie.id, 'tv');
  
      resultItem.innerHTML = `
        <img src="${imageBaseUrl}${serie.poster_path}" alt="${serie.name}" class="img-thumbnail mr-2" style="width: 50px;">
        <div>
          <strong>${serie.name}</strong><br>
          <span>${getStarRating(serie.vote_average)}</span>
        </div>
      `;
  
      searchResults.appendChild(resultItem);
    });
  
    searchResults.style.display = 'block';
  }
  
  function getStarRating(vote_average) {
    const stars = Math.round(vote_average / 2);
    let starHtml = '';
    for (let i = 0; i < 5; i++) {
      if (i < stars) {
        starHtml += '<span class="bi bi-star-fill"></span>';
      } else {
        starHtml += '<span class="bi bi-star"></span>';
      }
    }
    return starHtml;
  }
  
  function clearSearchResults() {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';
    searchResults.style.display = 'none';
  }

function getStarRating(voteAverage) {
  const stars = Math.round(voteAverage / 2);
  let starHtml = '';
  for (let i = 0; i < 5; i++) {
    if (i < stars) {
      starHtml += '<span class="bi bi-star-fill" style="color: red;"></span>';
    } else {
      starHtml += '<span class="bi bi-star" style="color: red;"></span>';
    }
  }
  return starHtml;
}

function viewMovieDetails(movieId) {
  window.location.href = `../destaque/detalhes2.html?id=${movieId}&type=movie`;
}

function fetchSeries(categoryId = null, type = null, page = 1) {
  currentCategory = categoryId;
  currentType = type;
  currentPage = page;

  let url = `${apiUrl}/tv/popular?api_key=${apiKey}&language=pt-BR&page=${page}`;

  if (categoryId) {
    switch (categoryId) {
      case '16': // Anime
        url = type === 'anime'
          ? `${apiUrl}/discover/tv?api_key=${apiKey}&language=pt-BR&with_genres=${categoryId}&with_keywords=210024&page=${page}`
          : `${apiUrl}/discover/tv?api_key=${apiKey}&language=pt-BR&with_genres=${categoryId}&without_keywords=210024&page=${page}`;
        break;
      case '35': // Comédia
      case '18': // Drama
      case '28': // Ação
      case '12': // Aventura
      case '10762': // Dorama
        url = `${apiUrl}/discover/tv?api_key=${apiKey}&language=pt-BR&with_genres=${categoryId}&page=${page}`;
        break;
      default:
        url = `${apiUrl}/discover/tv?api_key=${apiKey}&language=pt-BR&with_genres=${categoryId}&page=${page}`;
    }
  }

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar séries: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      if (data.results) {
        displayContent(data.results, 'series-container');
      } else {
        console.error('Nenhum resultado encontrado.');
        const container = document.getElementById('series-container');
        container.innerHTML = '<p>Nenhuma série encontrada.</p>';
      }
    })
    .catch(error => {
      console.error('Erro ao buscar séries:', error);
    });
}

function setupPagination() {
  document.getElementById('prevPage').addEventListener('click', event => {
    event.preventDefault();
    if (currentPage > 1) {
      fetchSeries(currentCategory, currentType, currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  document.getElementById('nextPage').addEventListener('click', event => {
    event.preventDefault();
    fetchSeries(currentCategory, currentType, currentPage + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function setupDropdowns() {
  const dropdownMenu = document.querySelector('.dropdown-menu');

  dropdownMenu.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', event => {
      event.preventDefault();

      const categoryName = event.target.textContent.trim();
      document.getElementById('dropdownMenuButton').textContent = categoryName;

      const categoryId = event.target.getAttribute('data-category');
      const type = event.target.getAttribute('data-type');

      fetchSeries(categoryId, type, 1);
    });
  });
}
