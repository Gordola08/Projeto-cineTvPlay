const apiKey = 'f929634d7d1ae9a3e4b1215ec7d38336';
const apiUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

let moviesFetched = false;
let seriesFetched = false;
let topRatedFetched = false;

document.addEventListener('DOMContentLoaded', () => {
  if (!moviesFetched) {
    fetchMovies();
    moviesFetched = true;
  }
  
  if (!seriesFetched) {
    fetchSeries();
    seriesFetched = true;
  }

  if (!topRatedFetched) {
    fetchTopRated();
    topRatedFetched = true;
  }
  
  fetchHighlight();  // Fetch the highlight of the day
  addSwipeToCarousel('movies-carousel');
  addSwipeToCarousel('series-carousel');
});

function fetchHighlight() {
  fetch(`${apiUrl}/movie/popular?api_key=${apiKey}&language=pt-BR&page=1`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar o destaque do dia');
      }
      return response.json();
    })
    .then(data => {
      const highlightItem = data.results[0]; // Pega o primeiro item da lista de filmes populares
      displayHighlight(highlightItem);
    })
    .catch(error => console.error('Erro ao buscar o destaque do dia:', error));
}

function displayHighlight(item) {
  const highlightBanner = document.getElementById('highlight-banner');
  if (!highlightBanner) {
    console.error('Banner de destaque não encontrado.');
    return;
  }

  highlightBanner.innerHTML = `
    <img src="${imageBaseUrl}${item.backdrop_path}" alt="${item.title}" class="img-fluid">
    <div class="overlay">
      <h2>${item.title}</h2>
      <p>${item.overview}</p>
      <button onclick="viewDetails('${item.id}', 'movie')" class="btn btn-danger"><span class="bi bi-info-circle"></span> Assistir Agora</button>
    </div>
  `;
}

function fetchMovies() {
  fetch(`${apiUrl}/movie/popular?api_key=${apiKey}&language=pt-BR&page=1`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar filmes populares');
      }
      return response.json();
    })
    .then(data => {
      const filmesHtml = data.results.slice(0, 15);
      displayContent(filmesHtml, 'movies-container', 'movies-carousel', 'movie');
    })
    .catch(error => console.error('Erro ao buscar filmes:', error));
}

function fetchSeries() {
  fetch(`${apiUrl}/tv/popular?api_key=${apiKey}&language=pt-BR&page=1`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar séries populares');
      }
      return response.json();
    })
    .then(data => {
      const seriesHTML = data.results.slice(0, 15);
      displayContent(seriesHTML, 'series-container', 'series-carousel', 'tv');
    })
    .catch(error => console.error('Erro ao buscar séries:', error));
}

function fetchTopRated() {
  fetch(`${apiUrl}/movie/top_rated?api_key=${apiKey}&language=pt-BR&page=1`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar filmes mais votados');
      }
      return response.json();
    })
    .then(data => {
      const topRatedItems = data.results.slice(0, 6); // Limitar aos top 6 itens
      displayTopRated(topRatedItems);
    })
    .catch(error => console.error('Erro ao buscar filmes mais votados:', error));
}

function displayContent(items, containerId, carouselId, type) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container ${containerId} não encontrado.`);
    return;
  }
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
        <div onclick="viewDetails('${item.id}', '${type}')">
          <img src="${imageBaseUrl}${item.poster_path}" class="card-img-top" alt="${item.title || item.name}">
          <div class="card-body">
            <h5 class="card-title" style="color: red;">${item.title || item.name}</h5>
            <p class="card-text">Avaliação: ${item.vote_average}</p>
          </div>
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
  if (!carousel) return;

  // Initialize Hammer.js
  const hammer = new Hammer(carousel);

  // Add swipe recognizers
  hammer.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });

  // Handle swipe left
  hammer.on('swipeleft', () => {
    const nextButton = carousel.querySelector('.carousel-control-next');
    if (nextButton && !nextButton.classList.contains('disabled')) {
      nextButton.click();
    }
  });

  // Handle swipe right
  hammer.on('swiperight', () => {
    const prevButton = carousel.querySelector('.carousel-control-prev');
    if (prevButton && !prevButton.classList.contains('disabled')) {
      prevButton.click();
    }
  });
}

// Example usage
document.addEventListener('DOMContentLoaded', () => {
  addSwipeToCarousel('myCarousel');
});

function displayTopRated(items) {
  const container = document.getElementById('top-rated-container');
  if (!container) {
    console.error('Container top-rated-container não encontrado.');
    return;
  }
  container.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card me-2';
    card.style.width = '200px';
    card.innerHTML = `
      <div onclick="viewDetails('${item.id}', 'movie')">
        <img src="${imageBaseUrl}${item.poster_path}" class="card-img-top" alt="${item.title}">
        <div class="card-body">
          <h5 class="card-title" style="color: red;">${item.title}</h5>
          <p class="card-text">Avaliação: ${item.vote_average}</p>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function viewDetails(id, type) {
  const detalhesUrl = type === 'movie' ? `destaque/detalhes.html?id=${id}&type=${type}` : `destaque/detalhes2.html?id=${id}&type=${type}`;
  window.location.href = detalhesUrl;
}

document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.querySelector('.navbar-toggler');
  const sidebar = document.querySelector('.sidebar');

  toggleBtn.addEventListener('click', function () {
    sidebar.classList.toggle('active');
  });
});