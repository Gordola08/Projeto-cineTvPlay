const apiKey = 'f929634d7d1ae9a3e4b1215ec7d38336';
const apiUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const embedderBaseUrl = 'https://embedder.net/e/';

document.addEventListener('DOMContentLoaded', () => {
  fetchMovies();
  fetchSeries();
});

function fetchMovies() {
  let filmesHtml = []
  for (let page = 1; page <= 5; page++) {
    fetch(`${apiUrl}/movie/popular?api_key=${apiKey}&language=pt-BR&page=${page}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(filmes => {
        for (const key in filmes) {
          filmesHtml = filmesHtml.concat(filmes.results);
        }
        displayContent(filmesHtml, 'movies-container')
      })
  }
}

function fetchSeries() {
  let seriesHTML = []
  for (let page = 1; page <= 5; page++) {
    fetch(`${apiUrl}/tv/popular?api_key=${apiKey}&language=pt-BR&page=${page}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(filmes => {
        for (const key in filmes) {
          seriesHTML = seriesHTML.concat(filmes.results);
        }
        displayContent(seriesHTML, 'series-container')
      })
  }
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
          <p>ID do TMDb: ${item.id}</p>
        </div>
      </div>
    `;
    console.log(item.id)
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
