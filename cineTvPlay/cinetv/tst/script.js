const embedderBaseUrl = 'https://embedder.net/e/';

function watchVideo() {
    const season = document.getElementById('season').value;
    const episode = document.getElementById('episode').value;

    if (season && episode) {
        const embedUrl = `https://embedder.net/e/series?imdb=${season}&sea=${season}&epi=${episode}`;
        window.open(embedUrl, '_blank');
    } else {
        alert("Por favor, informe a temporada e o episódio.");
    }
}

async function fetchSeriesDetails() {
    const season = document.getElementById('season').value; // Obtém a temporada do input
    const response = await fetch(`https://api.themoviedb.org/3/find/${season}?api_key=sua_chave_de_api_aqui&language=pt-BR&external_source=imdb_id`);
    const data = await response.json();
    const serie = data.tv_results[0]; // A série estará na primeira posição do array 'tv_results'

    // Exibir imagem da série
    const posterPath = serie.poster_path;
    const posterUrl = posterPath ? `https://image.tmdb.org/t/p/w500/${posterPath}` : 'placeholder.jpg';
    document.getElementById('serie-poster').src = posterUrl;

    // Exibir descrição da série
    const description = serie.overview;
    document.getElementById('serie-description').textContent = description;
}

// Chamar a função para carregar os detalhes da série quando a página carregar
window.addEventListener('DOMContentLoaded', fetchSeriesDetails);
