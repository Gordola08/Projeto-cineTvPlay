const apiKey = 'f929634d7d1ae9a3e4b1215ec7d38336';
const apiUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

let moviesFetched = false;
let seriesFetched = false;

document.addEventListener('DOMContentLoaded', () => {
  if (!moviesFetched) {
    fetchMovies();
    moviesFetched = true;
  }
  
  if (!seriesFetched) {
    fetchSeries();
    seriesFetched = true;
  }
  addSwipeToCarousel('movies-carousel');
  addSwipeToCarousel('series-carousel');
});


function fetchMovies() {
  let allMovies = [];
  for (let page = 1; page <= 5; page++) {
    fetch(`${apiUrl}/movie/popular?api_key=${apiKey}&language=pt-BR&page=${page}`)
      .then(response => response.json())
      .then(filmes => {
        allMovies = allMovies.concat(filmes.results);
        if (allMovies.length >= 20 || page === 5) {
          const filmesHtml = allMovies.slice(0, 15);
          displayContent(filmesHtml, 'movies-container', 'movies-carousel');
        }
      });
  }
}

function fetchSeries() {
  let allSeries = [];
  for (let page = 1; page <= 5; page++) {
    fetch(`${apiUrl}/tv/popular?api_key=${apiKey}&language=pt-BR&page=${page}`)
      .then(response => response.json())
      .then(series => {
        allSeries = allSeries.concat(series.results);
        if (allSeries.length >= 15 || page === 5) {
          const seriesHTML = allSeries.slice(0, 15);
          displayContent(seriesHTML, 'series-container', 'series-carousel');
        }
      });
  }
}

function displayContent(items, containerId, carouselId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  const chunks = chunkArray(items, 5);

  chunks.forEach((chunk, index) => {
    const isActive = index === 0 ? 'active' : '';
    const carouselItem = document.createElement('div');
    carouselItem.className = `carousel-item ${isActive}`;
    
    const row = document.createElement('div');
    row.className = 'd-flex justify-content-center';
    
    chunk.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card me-2';
      card.style.width = '200px';
      card.innerHTML = `
        <img src="${imageBaseUrl}${item.poster_path}" class="card-img-top" alt="${item.title || item.name}">
        <div class="card-body">
          <h5 class="card-title">${item.title || item.name}</h5>
          <button onclick="viewMovieDetails('${item.id}', 'movie')" class="btn btn-danger"><span class="bi bi-info-circle"></span> Ver Detalhes</button>
        </div>
      `;
      row.appendChild(card);
    });
    
    carouselItem.appendChild(row);
    container.appendChild(carouselItem);
  });

  addSwipeToCarousel(carouselId);
}

function chunkArray(array, chunkSize) {
  const results = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    results.push(array.slice(i, i + chunkSize));
  }
  return results;
}

function addSwipeToCarousel(carouselId) {
  const carousel = document.getElementById(carouselId);
  const hammer = new Hammer(carousel, {
    touchAction: 'pan-y',
    recognizers: [
      [Hammer.Swipe, { direction: Hammer.DIRECTION_HORIZONTAL }],
    ],
  });

  hammer.on('swipeleft', () => {
    const nextButton = carousel.querySelector('.carousel-control-next');
    if (!nextButton.classList.contains('disabled')) {
      nextButton.click();
    }
  });

  hammer.on('swiperight', () => {
    const prevButton = carousel.querySelector('.carousel-control-prev');
    if (!prevButton.classList.contains('disabled')) {
      prevButton.click();
    }
  });
}

function viewMovieDetails(movieId, type) {
  // Redireciona para a página de detalhes do filme com o ID do filme na query string
  window.location.href = `destaque/detalhes.html?id=${movieId}&type=${type}`;
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


