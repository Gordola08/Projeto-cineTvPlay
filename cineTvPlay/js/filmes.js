const apiKey = 'f929634d7d1ae9a3e4b1215ec7d38336';
const apiUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
  fetchMovies();
  setupSearch();
  setupDropdowns();
  setupPagination();
  setupSearchAnimation();
});

function fetchMovies(categoryId = null, page = 1) {
  let url = `${apiUrl}/movie/popular?api_key=${apiKey}&language=pt-BR&page=${page}`;
  if (categoryId) {
    url = `${apiUrl}/discover/movie?api_key=${apiKey}&language=pt-BR&with_genres=${categoryId}&page=${page}`;
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const movies = data.results;
      filterMoviesWithVideos(movies);
    })
    .catch(error => {
      console.error('Error fetching movies:', error);
      displayNotFoundMessage('Erro ao buscar filmes. Tente novamente mais tarde.');
    });
}

function filterMoviesWithVideos(movies) {
  const moviesWithVideos = [];
  let processedMovies = 0;

  movies.forEach(movie => {
    const movieId = movie.id;
    const videoUrl = `${apiUrl}/movie/${movieId}/videos?api_key=${apiKey}&language=pt-BR`;

    fetch(videoUrl)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          moviesWithVideos.push(movie);
        }
        processedMovies++;
        if (processedMovies === movies.length) {
          if (moviesWithVideos.length === 0) {
            displayNotFoundMessage('Nenhum filme encontrado com vídeos disponíveis.');
          } else {
            displayContent(moviesWithVideos, 'movies-container');
          }
        }
      })
      .catch(error => {
        console.error('Error fetching video for movie:', error);
        processedMovies++;
        if (processedMovies === movies.length) {
          if (moviesWithVideos.length === 0) {
            displayNotFoundMessage('Nenhum filme encontrado com vídeos disponíveis.');
          } else {
            displayContent(moviesWithVideos, 'movies-container');
          }
        }
      });
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
      fetchMovies(categoryId, 1);
    });
  });
}

function displayContent(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'col-md-3 mb-4';
    card.innerHTML = `
      <div class="card movie-card" onclick="viewMovieDetails('${item.id}', 'movie')">
        <img src="${imageBaseUrl}${item.poster_path}" class="card-img-top" alt="${item.title || item.name}">
        <div class="card-overlay">
          <div class="card-body">
            <h5 class="card-title" style="color: red;">${item.title || item.name}</h5>
            <p class="card-text">Avaliação: ${getStarRating(item.vote_average)}</p>
            ${item.runtime ? `<p class="card-text">Duração: ${item.runtime} min</p>` : ''}
          </div>
        </div>
      </div>
    `;

// Função para adicionar os event listeners
function addMobileEventListeners(card) {
  card.addEventListener('touchstart', showOverlay); // Usar touchstart em vez de mouseover
  card.addEventListener('touchend', hideOverlay);   // Usar touchend em vez de mouseout
}

// Função para remover os event listeners
function removeMobileEventListeners(card) {
  card.removeEventListener('touchstart', showOverlay);
  card.removeEventListener('touchend', hideOverlay);
}

// Funções para mostrar e esconder a sobreposição
function showOverlay() {
  this.querySelector('.card-overlay').style.display = 'block';
}

function hideOverlay() {
  this.querySelector('.card-overlay').style.display = 'none';
}

// Função para verificar se o dispositivo é móvel
function isMobile() {
  return window.matchMedia("(max-width: 768px)").matches;
}

// Seleciona todos os cards
const cards = document.querySelectorAll('.card');

// Adiciona ou remove os event listeners conforme o dispositivo
cards.forEach(card => {
  if (isMobile()) {
    addMobileEventListeners(card);
  } else {
    removeMobileEventListeners(card);
  }
});

// Atualiza os event listeners ao redimensionar a janela
window.addEventListener('resize', () => {
  cards.forEach(card => {
    if (isMobile()) {
      addMobileEventListeners(card);
    } else {
      removeMobileEventListeners(card);
    }
  });
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

function displayNotFoundMessage(message) {
  const container = document.getElementById('error-message');
  container.innerHTML = `<p>${message}</p>`;
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
