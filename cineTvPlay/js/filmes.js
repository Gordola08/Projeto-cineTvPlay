const apiKey = 'f929634d7d1ae9a3e4b1215ec7d38336';
const apiUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

let currentPage = 1;
let totalPages = 1;

document.addEventListener('DOMContentLoaded', () => {
  fetchMovies();
  setupSearch();
  setupPagination();
  setupSearchAnimation();
  setupCategorySelection();
});

function fetchMovies(categoryId = null, page = 1) {
  if (page > totalPages) return; // Previne requisições para páginas que não existem

  let url = `${apiUrl}/movie/popular?api_key=${apiKey}&language=pt-BR&page=${page}`;
  if (categoryId) {
    url = `${apiUrl}/discover/movie?api_key=${apiKey}&language=pt-BR&with_genres=${categoryId}&page=${page}`;
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
      totalPages = data.total_pages; // Atualiza o total de páginas
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
  const maxConcurrentRequests = 5; // Número máximo de requisições simultâneas
  let index = 0;

  function fetchNextBatch() {
    const batch = movies.slice(index, index + maxConcurrentRequests);
    index += maxConcurrentRequests;

    const fetchPromises = batch.map(movie => {
      const movieId = movie.id;
      const videoUrl = `${apiUrl}/movie/${movieId}/videos?api_key=${apiKey}&language=pt-BR`;

      return fetch(videoUrl)
        .then(response => response.json())
        .then(data => {
          if (data.results && data.results.length > 0) {
            moviesWithVideos.push(movie);
          }
        })
        .catch(error => {
          console.error('Error fetching video for movie:', error);
        });
    });

    Promise.all(fetchPromises)
      .then(() => {
        if (index < movies.length) {
          fetchNextBatch(); // Busca o próximo lote
        } else {
          if (moviesWithVideos.length === 0) {
            displayNotFoundMessage('Nenhum filme encontrado com vídeos disponíveis.');
          } else {
            displayContent(moviesWithVideos, 'movies-container');
          }
        }
      });
  }

  fetchNextBatch(); // Inicia o processo
}

function loadMoviesByCategory(categoryId) {
  currentPage = 1; // Reseta a página ao mudar de categoria
  totalPages = 1; // Reseta o total de páginas
  fetchMovies(categoryId);
}

function displayMovies(movies) {
  const moviesContainer = document.getElementById('moviesContainer');
  moviesContainer.innerHTML = '';

  movies.forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.className = 'movie';
    movieElement.innerHTML = `
      <img src="${imageBaseUrl}${movie.poster_path}" alt="${movie.title}" class="movie-img">
      <h3>${movie.title}</h3>
      <p>${movie.overview}</p>
    `;
    moviesContainer.appendChild(movieElement);
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
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar filmes na API TheMovieDB.');
      }
      return response.json();
    })
    .then(data => {
      if (data.results && data.results.length > 0) {
        displayContent(data.results, 'movies-container');
      } else {
        const container = document.getElementById('movies-container');
        container.innerHTML = '<p>Nenhum filme encontrado.</p>';
      }
    })
    .catch(error => {
      console.error('Erro ao buscar filmes na API TheMovieDB:', error);
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
    if (currentPage < totalPages) {
      currentPage++;
      fetchMovies(null, currentPage);
    }
  });
}

function setupCategorySelection() {
  document.querySelectorAll('.category-link').forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault(); // Evita o comportamento padrão do link

      const categoryId = this.getAttribute('data-category'); // Pega o ID da categoria
      console.log('Categoria selecionada:', categoryId);

      // Carrega os filmes da categoria selecionada
      loadMoviesByCategory(categoryId);

      // Remove a tela preta (modal-backdrop) e restaura o corpo da página
      const offcanvasElement = document.getElementById('categoryOffcanvas');
      if (offcanvasElement) {
        const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
        if (offcanvas) {
          offcanvas.hide();
        }
      }

      // Remove a tela preta (modal-backdrop) e restaura o corpo da página
      const backdrop = document.querySelector('.offcanvas-backdrop');
      if (backdrop) {
        backdrop.remove();
      }

      // Remove o estilo de overflow do corpo
      document.body.classList.remove('offcanvas-open');
      document.body.style.overflow = ''; // Garante que a rolagem esteja ativada
    });
  });
}

function setupOffcanvas() {
  document.querySelectorAll('.category-link').forEach(link => {
    link.addEventListener('click', async function (event) {
      event.preventDefault(); // Evita o comportamento padrão do link

      const categoryId = this.getAttribute('data-category');
      console.log('Categoria selecionada:', categoryId);

      // Carrega os filmes da categoria selecionada
      await loadMoviesByCategory(categoryId);

      // Fecha o offcanvas
      const offcanvasElement = document.getElementById('categoryOffcanvas');
      const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
      if (offcanvas) {
        offcanvas.hide();
      }

      // Remove a tela preta e restaura o overflow
      document.body.classList.remove('offcanvas-open');
      document.body.style.overflow = 'auto';
    });
  });
}

// Chama a função para configurar o offcanvas
document.addEventListener('DOMContentLoaded', setupOffcanvas);



