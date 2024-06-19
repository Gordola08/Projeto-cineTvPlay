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
    document.getElementById("title").textContent = data.title || data.name;
    document.getElementById("poster").src = data.poster_path ? `${imageBaseUrl}${data.poster_path}` : '';
    document.getElementById("overview").textContent = data.overview;
    document.getElementById("genre").textContent = data.genres.map(genre => genre.name).join(', ');
    document.getElementById("runtime").textContent = type === 'movie' ? `${data.runtime} min` : `${data.episode_run_time[0]} min`;
    document.getElementById("release-date").textContent = data.release_date || data.first_air_date;

    fetchAssitir(data.id, type);
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
        document.getElementById("assitir-container").innerHTML = "<p>Ocorreu um erro ao carregar o vídeo para assistir.</p>";
    }
}

function viewMovieDetails(movieId, type) {
    // Redireciona para a página de detalhes do filme com os parâmetros
    window.location.href = `detalhes.html?id=${movieId}&type=${type}`;
}


document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.querySelector('.navbar-toggler');
    const sidebar = document.querySelector('.sidebar');
  
    toggleBtn.addEventListener('click', function () {
      sidebar.classList.toggle('active');
    });
  });

  document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    const movieType = urlParams.get('type');
  
    // Função para salvar filme como favorito no localStorage
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
  
    // Evento para salvar filme como favorito quando o botão é clicado
    const favoriteButton = document.getElementById('favoriteButton');
    favoriteButton.addEventListener('click', function () {
      // Substitua com a lógica para buscar os detalhes do filme
      const movieTitle = 'Título do Filme';
      const posterPath = 'caminho/do/poster.jpg';
      const movieOverview = 'Descrição do filme...';
      const movieGenre = 'Gênero';
      const movieRuntime = '120 min';
      const movieReleaseDate = '01/01/2023';
  
      // Chamada para salvar o filme como favorito
      saveFavoriteMovie(movieId, movieTitle, posterPath, movieOverview, movieGenre, movieRuntime, movieReleaseDate);
    });
  });
  

  document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.querySelector('.navbar-toggler');
    const sidebar = document.querySelector('.sidebar');
  
    toggleBtn.addEventListener('click', function () {
      sidebar.classList.toggle('active');
    });
  });