const apiKey = 'f929634d7d1ae9a3e4b1215ec7d38336';
const apiUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const embedderBaseUrl = 'https://embedder.net/e/';

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get("id");
    const type = urlParams.get("type"); // 'movie' or 'tv'

    if (movieId && type) {
        fetchDetails(movieId, type);
    }

    const toggleBtn = document.querySelector('.navbar-toggler');
    const sidebar = document.querySelector('.sidebar');

    toggleBtn.addEventListener('click', function () {
        sidebar.classList.toggle('active');
    });

    const favoriteButton = document.getElementById('favoriteButton');
    if (favoriteButton) {
        favoriteButton.addEventListener('click', function () {
            fetch(`${apiUrl}/${type}/${movieId}?api_key=${apiKey}&language=pt-BR`, {
                method: 'GET',
            })
            .then(response => response.json())
            .then(filme => {
                const movieTitle = filme.title || filme.name;
                const posterPath = filme.poster_path ? `${imageBaseUrl}${filme.poster_path}` : '';
                const movieOverview = filme.overview;
                const movieGenre = filme.genres.map(genre => genre.name).join(', ');
                const movieRuntime = type === 'movie' ? `${filme.runtime} min` : `${filme.episode_run_time[0]} min`;
                const movieReleaseDate = filme.release_date || filme.first_air_date;
                saveFavoriteMovie(movieId, movieTitle, posterPath, movieOverview, movieGenre, movieRuntime, movieReleaseDate);
            });
        });
    }
});

async function fetchDetails(id, type) {
    try {
        const response = await fetch(`${apiUrl}/${type}/${id}?api_key=${apiKey}&language=pt-BR`);
        if (!response.ok) {
            throw new Error('Erro ao buscar detalhes do filme.');
        }
        const data = await response.json();
        displayDetails(data, type);
    } catch (error) {
        console.error("Erro ao buscar detalhes:", error);
        // Exiba uma mensagem de erro na interface, se necessário
    }
}

function displayDetails(data, type) {
    const titleElement = document.getElementById("title");
    const posterElement = document.getElementById("poster");
    const overviewElement = document.getElementById("overview");
    const genreElement = document.getElementById("genre");
    const runtimeElement = document.getElementById("runtime");
    const releaseDateElement = document.getElementById("release-date");

    // Define o título da série ou filme
    titleElement.textContent = data.title || data.name;

    // Define o poster da série ou filme
    posterElement.src = data.poster_path ? `${imageBaseUrl}${data.poster_path}` : '';

    // Define a visão geral da série ou filme
    overviewElement.textContent = data.overview;

    // Define os gêneros da série ou filme
    genreElement.textContent = data.genres.map(genre => genre.name).join(', ');

    // Define a duração do filme ou o tempo do episódio
    runtimeElement.textContent = type === 'movie' ? `${data.runtime} min` : `${data.episode_run_time[0]} min`;

    // Define a data de lançamento ou a data de primeira exibição
    releaseDateElement.textContent = data.release_date || data.first_air_date;

    // Busca a função assistir
    fetchAssitir(data.id, type);

    // Atualiza o título da página dinamicamente
    const name = data.title || data.name;
    document.title = `${name} - cineTv Play`;
}

async function fetchAssitir(id, type) {
    try {
        const response = await fetch(`${apiUrl}/${type}/${id}/videos?api_key=${apiKey}&language=pt-BR`);
        if (!response.ok) {
            throw new Error('Erro ao carregar o vídeo para assistir.');
        }
        const data = await response.json();
        const assistir = data.results.find(video => video.type === "Assitir");

        if (assistir) {
            document.getElementById("assitir").src = `${embedderBaseUrl}${assistir.key}`;
        } else {
            // Se não houver trailer disponível, usar o link direto fornecido pelo Embedder.net
            document.getElementById("assitir-container").innerHTML = `<iframe id="assitir" src="https://embedder.net/e/${id}" width="100%" height="315" frameborder="0" allowfullscreen></iframe>`;
        }
    } catch (error) {
        console.error("Erro ao buscar vídeo para assistir:", error);
        document.getElementById("assitir-container").innerHTML = "<p>O que você deseja ver aqui não foi encontrado. Tente novamente mais tarde.</p><p>Em breve, esse filme estará disponível.</p>";
    }
}

function viewMovieDetails(movieId, type) {
    // Redireciona para a página de detalhes do filme com os parâmetros
    window.location.href = `detalhes.html?id=${movieId}&type=${type}`;
}

function saveFavoriteMovie(movieId, movieTitle, posterPath, overview, genre, runtime, releaseDate) {
    let favorites = JSON.parse(localStorage.getItem('favoriteMovies')) || [];

    // Verifica se o filme já está salvo como favorito
    const existingMovie = favorites.find(movie => movie.id === movieId);
    if (existingMovie) {
        alert('Este filme já está salvo como favorito!');
        return;
    }

    // Adiciona o filme aos favoritos
    favorites.push({
        id: movieId,
        title: movieTitle,
        poster: posterPath,
        overview: overview,
        genre: genre,
        runtime: runtime,
        releaseDate: releaseDate
    });

    // Salva a lista atualizada de favoritos no localStorage
    localStorage.setItem('favoriteMovies', JSON.stringify(favorites));
    alert('Filme salvo como favorito!');
}

function goBack() {
    window.history.back();
}
