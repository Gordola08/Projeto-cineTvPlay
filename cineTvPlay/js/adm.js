const apiUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const apiKey = 'f929634d7d1ae9a3e4b1215ec7d38336';

// Função para buscar e exibir filmes populares na página
async function fetchAndDisplayMovies() {
    try {
        const response = await fetch(`${apiUrl}/movie/popular?api_key=${apiKey}`);
        if (!response.ok) {
            throw new Error('Erro ao carregar os filmes.');
        }
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error('Nenhum filme encontrado.');
        }

        const movies = data.results;
        const moviesListElement = document.getElementById('movies-list');
        moviesListElement.innerHTML = ''; // Limpa o conteúdo anterior

        movies.forEach(movie => {
            const movieElement = createMovieElement(movie);
            moviesListElement.appendChild(movieElement);
        });

    } catch (error) {
        console.error('Erro ao buscar filmes:', error.message);
    }
}

// Função para buscar e exibir séries populares na página
async function fetchAndDisplaySeries() {
    try {
        const response = await fetch(`${apiUrl}/tv/popular?api_key=${apiKey}`);
        if (!response.ok) {
            throw new Error('Erro ao carregar as séries.');
        }
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error('Nenhuma série encontrada.');
        }

        const series = data.results;
        const seriesListElement = document.getElementById('series-list');
        seriesListElement.innerHTML = ''; // Limpa o conteúdo anterior

        series.forEach(serie => {
            const serieElement = createSerieElement(serie);
            seriesListElement.appendChild(serieElement);
        });

    } catch (error) {
        console.error('Erro ao buscar séries:', error.message);
    }
}

// Função auxiliar para criar elemento HTML de filme usando Bootstrap
function createMovieElement(movie) {
    const movieElement = document.createElement('div');
    movieElement.classList.add('card', 'mb-3');

    const imagePath = movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : 'placeholder.jpg';
    const movieHTML = `
        <img src="${imagePath}" class="card-img-top" alt="${movie.title}">
        <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
        </div>
    `;

    movieElement.innerHTML = movieHTML;
    return movieElement;
}

// Função auxiliar para criar elemento HTML de série usando Bootstrap
function createSerieElement(serie) {
    const serieElement = document.createElement('div');
    serieElement.classList.add('card', 'mb-3');

    const imagePath = serie.poster_path ? `${imageBaseUrl}${serie.poster_path}` : 'placeholder.jpg';
    const serieHTML = `
        <img src="${imagePath}" class="card-img-top" alt="${serie.name}">
        <div class="card-body">
            <h5 class="card-title">${serie.name}</h5>
        </div>
    `;

    serieElement.innerHTML = serieHTML;
    return serieElement;
}

// Chamar as funções para carregar filmes e séries na página
fetchAndDisplayMovies();
fetchAndDisplaySeries();

// Script para atualizar o título da seção ao clicar nos links
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('ver-filmes').addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('section-title').textContent = 'Filmes em Alta';
        fetchAndDisplayMovies(); // Atualiza a lista de filmes
    });

    document.getElementById('ver-series').addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('section-title').textContent = 'Séries em Alta';
        fetchAndDisplaySeries(); // Atualiza a lista de séries
    });
});
