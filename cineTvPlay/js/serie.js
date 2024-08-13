const apiKey = 'f929634d7d1ae9a3e4b1215ec7d38336';
const apiUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const embedderBaseUrl = 'https://embedder.net/e/';

let currentPage = 1;
let currentCategory = null;
let currentType = null;

document.addEventListener('DOMContentLoaded', () => {
  fetchSeries(); // Carrega a série inicial
  setupPagination();
  setupSearch();
  setupDropdowns();
  updateEventListeners();
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

      console.log(`Categoria selecionada: ${categoryName}, ID: ${categoryId}, Tipo: ${type}`);

      // Atualiza a categoria e o tipo atuais
      currentCategory = categoryId;
      currentType = type;

      // Recarrega a série com a nova categoria e tipo
      fetchSeries(currentCategory, currentType, 1);
    });
  });
}

function fetchSeries(categoryId = null, type = null, page = 1) {
  currentPage = page;
  
  let url = `${apiUrl}/tv/popular?api_key=${apiKey}&language=pt-BR&page=${page}`;

  if (categoryId) {
    if (categoryId === '16' && type === 'anime') {
      url = `${apiUrl}/discover/tv?api_key=${apiKey}&language=pt-BR&with_genres=${categoryId}&with_keywords=210024&page=${page}`; // Filtrando por Anime
    } else if (categoryId === '16' && type === 'cartoon') {
      url = `${apiUrl}/discover/tv?api_key=${apiKey}&language=pt-BR&with_genres=${categoryId}&without_keywords=210024&page=${page}`; // Filtrando por Desenho
    } else {
      url = `${apiUrl}/discover/tv?api_key=${apiKey}&language=pt-BR&with_genres=${categoryId}&page=${page}`;
    }
  }

  console.log(`URL da requisição: ${url}`);

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar séries.');
      }
      return response.json();
    })
    .then(data => {
      if (data.results) {
        console.log('Dados recebidos:', data.results);
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

function getStars(vote_average) {
  const stars = Math.round(vote_average / 2);
  let starHtml = '';
  for (let i = 0; i < 5; i++) {
    starHtml += i < stars
      ? '<span class="bi bi-star-fill" style="color: blue;"></span>'
      : '<span class="bi bi-star" style="color: blue;"></span>';
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
    container.appendChild(card);
  });

  updateEventListeners(); // Atualiza os event listeners após adicionar os cards

  if (window.innerWidth < 768) {
    container.querySelectorAll('.card-overlay').forEach(overlay => {
      overlay.style.display = 'none'; // Oculta a sobreposição em dispositivos móveis
    });
  }
}

function viewSeriesDetails(seriesId, type) {
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

function updateEventListeners() {
  // Atualiza os event listeners para os cards após a atualização do conteúdo
  const cards = document.querySelectorAll('.card');
  
  function addMobileEventListeners(card) {
    card.addEventListener('touchstart', showOverlay);
    card.addEventListener('touchend', hideOverlay);
  }
  
  function removeMobileEventListeners(card) {
    card.removeEventListener('touchstart', showOverlay);
    card.removeEventListener('touchend', hideOverlay);
  }
  
  function showOverlay() {
    this.querySelector('.card-overlay').style.display = 'block';
  }
  
  function hideOverlay() {
    this.querySelector('.card-overlay').style.display = 'none';
  }
  
  function isMobile() {
    return window.matchMedia("(max-width: 768px)").matches;
  }

  cards.forEach(card => {
    if (isMobile()) {
      addMobileEventListeners(card);
    } else {
      removeMobileEventListeners(card);
    }
  });

  window.addEventListener('resize', () => {
    cards.forEach(card => {
      if (isMobile()) {
        addMobileEventListeners(card);
      } else {
        removeMobileEventListeners(card);
      }
    });
  });
}
document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.querySelector('.navbar-toggler');
  const sidebar = document.querySelector('.sidebar');

  toggleBtn.addEventListener('click', function () {
    sidebar.classList.toggle('active');
  });
});