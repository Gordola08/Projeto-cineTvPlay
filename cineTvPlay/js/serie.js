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
});

function fetchSeries(categoryId = null, type = null, page = 1) {
  currentCategory = categoryId;
  currentType = type;
  currentPage = page;
  let seriesHTML = [];
  let url = `${apiUrl}/tv/popular?api_key=${apiKey}&language=pt-BR&page=${page}`;

  if (categoryId) {
    if (categoryId === '16' && type === 'anime') {
      url = `${apiUrl}/discover/tv?api_key=${apiKey}&language=pt-BR&with_genres=${categoryId}&with_keywords=210024&page=${page}`; // Filtrando por Anime
    } else if (categoryId === '16' && type === 'cartoon') {
      url = `${apiUrl}/discover/tv?api_key=${apiKey}&language=pt-BR&with_genres=${categoryId}&without_keywords=210024&page=${page}`; // Filtrando por Desenho
    } else if (categoryId === '35' && type === 'dorama') {
      url = `${apiUrl}/discover/tv?api_key=${apiKey}&language=pt-BR&with_genres=${categoryId}&page=${page}`; // Filtrando por Dorama
    } else if (categoryId === '28' || categoryId === '12') {
      url = `${apiUrl}/discover/tv?api_key=${apiKey}&language=pt-BR&with_genres=${categoryId}&page=${page}`; // Filtrando por Ação ou Aventura
    } else {
      url = `${apiUrl}/discover/tv?api_key=${apiKey}&language=pt-BR&with_genres=${categoryId}&page=${page}`;
    }
  }

  fetch(url, {
    method: 'GET',
  })
    .then(response => response.json())
    .then(filmes => {
      seriesHTML = seriesHTML.concat(filmes.results);
      displayContent(seriesHTML, 'series-container');
    });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchSeries();
  setupPagination();
  setupSearch();
  setupDropdowns();
});

function setupDropdowns() {
  const categoryMenu = document.getElementById('categoryMenu');

  categoryMenu.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', event => {
      event.preventDefault();
      const categoryName = event.target.textContent;
      document.getElementById('dropdownMenuButton').textContent = categoryName;
      const categoryId = event.target.getAttribute('data-category');
      const type = event.target.getAttribute('data-type');
      fetchSeries(categoryId, type, 1);
    });
  });
}



function displayContent(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'col-md-3 mb-2';
    card.innerHTML = `
      <div class="card movie-card">
        <img src="${imageBaseUrl}${item.poster_path}" class="card-img-top" alt="${item.title || item.name}">
        <div class="card-body">
          <h5 class="card-title">${item.title || item.name}</h5>
          <button onclick="watchVideo('${item.id}')" class="btn btn-primary">Assistir</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function watchVideo(id) {
  const embedUrl = `${embedderBaseUrl}tt3920288`;
  window.open(embedUrl, '_blank');
}

function setupPagination() {
  document.getElementById('prevPage').addEventListener('click', event => {
    event.preventDefault();
    if (currentPage > 1) {
      fetchSeries(currentCategory, currentType, currentPage - 1);
    }
  });

  document.getElementById('nextPage').addEventListener('click', event => {
    event.preventDefault();
    fetchSeries(currentCategory, currentType, currentPage + 1);
  });
}

document.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('click', event => {
    event.preventDefault();
    const categoryName = event.target.textContent;
    document.getElementById('dropdownMenuButton').textContent = categoryName;
    const categoryId = event.target.getAttribute('data-category');
    const type = event.target.getAttribute('data-type');
    fetchSeries(categoryId, type, 1);
  });
});


document.addEventListener('DOMContentLoaded', () => {
  fetchSeries();
  setupPagination();
  setupSearch();
});

function setupDropdowns() {
  const categoryMenu = document.getElementById('categoryMenu');

  categoryMenu.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', event => {
      event.preventDefault();
      const categoryName = event.target.textContent;
      document.getElementById('dropdownMenuButton').textContent = categoryName;
      const categoryId = event.target.getAttribute('data-category');
      const type = event.target.getAttribute('data-type');
      fetchSeries(categoryId, type, 1);
    });
  });
}

function searchSeries(query) {
  const encodedQuery = encodeURIComponent(query);
  const searchUrl = `${apiUrl}/search/tv?api_key=${apiKey}&language=pt-BR&query=${encodedQuery}`;
  
  fetch(searchUrl)
    .then(response => response.json())
    .then(data => {
      const results = data.results;
      displayContent(results, 'series-container');
    })
    .catch(error => {
      console.error('Error searching series:', error);
    });
}


document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.querySelector('.navbar-toggler');
  const sidebar = document.querySelector('.sidebar');

  toggleBtn.addEventListener('click', function () {
    sidebar.classList.toggle('active');
  });
});