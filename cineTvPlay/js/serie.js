const apiKey = 'f929634d7d1ae9a3e4b1215ec7d38336';
const apiUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const embedderBaseUrl = 'https://embedder.net/e/';

let currentPage = 1;
let currentCategory = null;
let currentType = null;

document.addEventListener('DOMContentLoaded', () => {
  fetchSeries();
  setupPagination();
  setupSearch();
  setupDropdowns();
});

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

function fetchSeries(categoryId = null, type = null, page = 1) {
  currentCategory = categoryId;
  currentType = type;
  currentPage = page;

  let url = `${apiUrl}/tv/popular?api_key=${apiKey}&language=pt-BR&page=${page}`;

  if (categoryId) {
    if (categoryId === '16' && type === 'anime') {
      url = `${apiUrl}/discover/tv?api_key=${apiKey}&language=pt-BR&with_genres=${categoryId}&with_keywords=210024&page=${page}`; // Filtrando por Anime
    } else if (categoryId === '16' && type === 'cartoon') {
      url = `${apiUrl}/discover/tv?api_key=${apiKey}&language=pt-BR&with_genres=${categoryId}&without_keywords=210024&page=${page}`; // Filtrando por Desenho
    } else if (categoryId === '35') {
      url = `${apiUrl}/discover/tv?api_key=${apiKey}&language=pt-BR&with_genres=${categoryId}&page=${page}`; // Filtrando por Comédia
    } else if (categoryId === '18') {
      url = `${apiUrl}/discover/tv?api_key=${apiKey}&language=pt-BR&with_genres=${categoryId}&page=${page}`; // Filtrando por Drama
    } else if (categoryId === '28') {
      url = `${apiUrl}/discover/tv?api_key=${apiKey}&language=pt-BR&with_genres=${categoryId}&page=${page}`; // Filtrando por Ação
    } else if (categoryId === '12') {
      url = `${apiUrl}/discover/tv?api_key=${apiKey}&language=pt-BR&with_genres=${categoryId}&page=${page}`; // Filtrando por Aventura
    } else if (categoryId === '10762') {
      url = `${apiUrl}/discover/tv?api_key=${apiKey}&language=pt-BR&with_genres=${categoryId}&page=${page}`; // Filtrando por Dorama
    } else {
      url = `${apiUrl}/discover/tv?api_key=${apiKey}&language=pt-BR&with_genres=${categoryId}&page=${page}`;
    }
  }

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar séries.');
      }
      return response.json();
    })
    .then(data => {
      displayContent(data.results, 'series-container');
    })
    .catch(error => {
      console.error('Erro ao buscar séries:', error);
    });
}

function getStars(vote_average) {
  const stars = Math.round(vote_average / 2);
  let starHtml = '';
  for (let i = 0; i < 5; i++) {
    if (i < stars) {
      starHtml += '<span class="bi bi-star-fill" style="color: blue;"></span>';
    } else {
      starHtml += '<span class="bi bi-star" style="color: blue;"></span>';
    }
  }
  return starHtml;
}

function displayContent(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'col-md-3 mb-4';
    card.innerHTML = `
      <div class="card movie-card" onclick="viewSeriesDetails('${item.id}', 'tv')">
        <img src="${imageBaseUrl}${item.poster_path}" class="card-img-top" alt="${item.title || item.name}">
        <div class="card-overlay">
          <div class="card-body">
            <h5 class="card-title" style="color: red;">${item.title || item.name}</h5>
            <p class="card-text">${getStars(item.vote_average)}</p>
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

function viewSeriesDetails(seriesId, type) {
  // Redireciona para a página de detalhes da série com os parâmetros ID da série e tipo
  const detalhesUrl = `../destaque/detalhes2.html?id=${seriesId}&type=${type}`;
  window.location.href = detalhesUrl;
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
        displayContent(data.results, 'series-container');
      } else {
        console.error('Nenhuma série encontrada na API TheMovieDB.');
        const container = document.getElementById('series-container');
        container.innerHTML = '<p>Nenhuma série encontrada.</p>';
      }
    })
    .catch(error => {
      console.error('Erro ao buscar séries na API TheMovieDB:', error);
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

document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.querySelector('.navbar-toggler');
  const sidebar = document.querySelector('.sidebar');

  toggleBtn.addEventListener('click', function () {
    sidebar.classList.toggle('active');
  });
});

function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('button-addon2');

  searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query !== '') {
      searchSeries(query);
    }
  });

  searchInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query !== '') {
        searchSeries(query);
      }
    }
  });
}
