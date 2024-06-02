const apiKey = 'f929634d7d1ae9a3e4b1215ec7d38336';
const apiUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const embedderBaseUrl = 'https://embedder.net/e/';

document.addEventListener('DOMContentLoaded', () => {
  fetchMovies();
  fetchSeries();
});

async function fetchMovies() {
  try {
    let movies = [];
    for (let page = 1; page <= 5; page++) { // 5 pages, 20 movies per page = 100 movies
      const response = await fetch(`${apiUrl}/movie/popular?api_key=${apiKey}&language=pt-BR&page=${page}`);
      const data = await response.json();
      movies = movies.concat(data.results);
    }
    displayContent(movies, 'movies-container');
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
  }
}

async function fetchSeries() {
  try {
    let series = [];
    for (let page = 1; page <= 5; page++) { // 5 pages, 20 series per page = 100 series
      const response = await fetch(`${apiUrl}/tv/popular?api_key=${apiKey}&language=pt-BR&page=${page}`);
      const data = await response.json();
      series = series.concat(data.results);
    }
    displayContent(series, 'series-container');
  } catch (error) {
    console.error('Erro ao buscar séries:', error);
  }
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
        <div class="card-body">
          <h5 class="card-title">${item.title || item.name}</h5>
          <button onclick="watchVideo('${item.id}')" class="btn btn-primary">Assistir</button>
          <p>ID do TMDb: ${item.id}</p>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function watchVideo(id) {
  const embedUrl = `${embedderBaseUrl}${id}`;
  window.open(embedUrl, '_blank');
}








document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.querySelector('.navbar-toggler');
  const sidebar = document.querySelector('.sidebar');

  toggleBtn.addEventListener('click', function () {
    sidebar.classList.toggle('active');
  });
});
