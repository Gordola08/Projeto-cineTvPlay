const apiKey = 'f929634d7d1ae9a3e4b1215ec7d38336';
const apiUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
  fetchMovies();
  setupSearch();
  setupDropdowns();
  setupPagination();
});

function fetchMovies(categoryId = null, page = 1) {
  let moviesHtml = [];
  let url = `${apiUrl}/movie/popular?api_key=${apiKey}&language=pt-BR&page=${page}`;
  if (categoryId) {
    url = `${apiUrl}/discover/movie?api_key=${apiKey}&language=pt-BR&with_genres=${categoryId}&page=${page}`;
  }
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      moviesHtml = data.results;
      displayContent(moviesHtml, 'movies-container');
    })
    .catch(error => {
      console.error('Error fetching movies:', error);
    });
}

function setupDropdowns() {
  const categoryMenu = document.getElementById('categoryMenu');

  categoryMenu.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', event => {
      event.preventDefault();
      const categoryName = event.target.textContent;
      document.getElementById('dropdownMenuButton').textContent = categoryName;
      const categoryId = event.target.getAttribute('data-category');
      const type = event.target.getAttribute('data-type');
      fetchMovies(categoryId, 1);
    });
  });
}

function setupSearch() {
  const searchButton = document.getElementById('button-addon2');
  searchButton.addEventListener('click', () => {
    const searchText = document.getElementById('searchInput').value;
    if (searchText.trim() !== '') {
      searchMovies(searchText);
    } else {
      fetchMovies();
    }
  });
}

function searchMovies(query) {
  const encodedQuery = encodeURIComponent(query);
  const searchUrl = `${apiUrl}/search/movie?api_key=${apiKey}&language=pt-BR&query=${encodedQuery}`;
  
  fetch(searchUrl)
    .then(response => response.json())
    .then(data => {
      const results = data.results;
      displayContent(results, 'movies-container');
    })
    .catch(error => {
      console.error('Error searching movies:', error);
    });
}

function displayContent(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'col-md-3 mb-4';
    card.innerHTML = `
      <div class="card movie-card">
        <img src="${imageBaseUrl}${item.poster_path}" class="card-img-top" alt="${item.title || item.name}">
        <div class="card-overlay">
          <div class="card-body">
            <h5 class="card-title">${item.title || item.name}</h5>
            <p class="card-text">Avaliação: ${item.vote_average}</p>
            ${item.runtime ? `<p class="card-text">Duração: ${item.runtime} min</p>` : ''}
            <button onclick="viewMovieDetails('${item.id}', 'movie')" class="btn btn-danger"><span class="bi bi-info-circle"></span> Ver Detalhes</button>
          </div>
        </div>
      </div>
    `;

    card.addEventListener('mouseover', () => {
      card.querySelector('.card-overlay').style.display = 'block';
    });

    card.addEventListener('mouseout', () => {
      card.querySelector('.card-overlay').style.display = 'none';
    });

    container.appendChild(card);
  });

  // Verificação para dispositivos móveis
  if (window.innerWidth < 768) {
    container.querySelectorAll('.card-overlay').forEach(overlay => {
      overlay.style.display = 'none'; // Oculta a sobreposição
    });
  }
}

function viewMovieDetails(movieId, type) {
  // Redireciona para a página de detalhes do filme com o ID do filme na query string
  window.location.href = `../destaque/detalhes.html?id=${movieId}&type=${type}`;
}

function setupPagination() {
  const prevPageButton = document.getElementById('prevPage');
  const nextPageButton = document.getElementById('nextPage');

  prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchMovies(null, currentPage);
    }
  });

  nextPageButton.addEventListener('click', () => {
    currentPage++;
    fetchMovies(null, currentPage);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.querySelector('.navbar-toggler');
  const sidebar = document.querySelector('.sidebar');

  toggleBtn.addEventListener('click', function () {
    sidebar.classList.toggle('active');
  });
});
