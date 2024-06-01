const apiKey = 'f929634d7d1ae9a3e4b1215ec7d38336';
    const apiUrl = 'https://api.themoviedb.org/3';
    const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
    const vimeoBaseUrl = 'https://player.vimeo.com/video/';

    document.addEventListener('DOMContentLoaded', () => {
      fetchMovies();
      fetchSeries();
    });

    async function fetchMovies() {
      try {
        const response = await fetch(`${apiUrl}/trending/movie/week?api_key=${apiKey}&language=pt-BR`);
        const data = await response.json();
        displayContent(data.results, 'movies-container');
      } catch (error) {
        console.error('Erro ao buscar filmes:', error);
      }
    }

    async function fetchSeries() {
      try {
        const response = await fetch(`${apiUrl}/trending/tv/week?api_key=${apiKey}&language=pt-BR`);
        const data = await response.json();
        displayContent(data.results, 'series-container');
      } catch (error) {
        console.error('Erro ao buscar séries:', error);
      }
    }

    function displayContent(items, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        items.forEach(item => {
          const card = document.createElement('div');
          card.className = 'col-md-4 mb-4';
          card.innerHTML = `
            <div class="card movie-card">
              <img src="${imageBaseUrl}${item.poster_path}" class="card-img-top" alt="${item.title || item.name}">
              <div class="card-body">
                <h5 class="card-title">${item.title || item.name}</h5>
                <a href="${vimeoBaseUrl}${item.id}" target="_blank" class="btn btn-primary">Assistir</a>
              </div>
            </div>
          `;
          container.appendChild(card);
        });
      }
    