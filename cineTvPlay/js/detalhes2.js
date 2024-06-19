const apiKey = 'f929634d7d1ae9a3e4b1215ec7d38336';
const apiUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const embedderBaseUrl = 'https://embedder.net/e/';

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const seriesId = urlParams.get("id");
    const type = urlParams.get("type"); // 'tv'

    if (seriesId && type === 'tv') {
        fetchDetails(seriesId, type);
    }
});

async function fetchDetails(id, type) {
    try {
        const response = await fetch(`${apiUrl}/${type}/${id}?api_key=${apiKey}&language=pt-BR`);
        if (!response.ok) {
            throw new Error('Erro ao buscar detalhes da série.');
        }
        const data = await response.json();
        displayDetails(data, type);
    } catch (error) {
        console.error("Erro ao buscar detalhes:", error);
        // Exiba uma mensagem de erro na interface, se necessário
    }
}

function displayDetails(data, type) {
    document.getElementById("title").textContent = data.name;
    document.getElementById("poster").src = data.poster_path ? `${imageBaseUrl}${data.poster_path}` : '';
    document.getElementById("overview").textContent = data.overview;
    document.getElementById("genre").textContent = data.genres.map(genre => genre.name).join(', ');
    document.getElementById("runtime").textContent = `${data.episode_run_time[0]} min`;
    document.getElementById("release-date").textContent = data.first_air_date;

    // Preencher select de temporadas
    const seasonSelect = document.getElementById("seasonSelect");
    seasonSelect.innerHTML = '';
    for (let i = 1; i <= data.number_of_seasons; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Temporada ${i}`;
        seasonSelect.appendChild(option);
    }

    // Chamar fetchEpisodes com a primeira temporada
    fetchEpisodes(1);
}

async function fetchEpisodes(seasonNumber) {
    const seriesIdElement = document.getElementById('seriesId');
    if (!seriesIdElement) {
        console.error('Elemento com id "seriesId" não encontrado.');
        return;
    }
    
    const seriesId = seriesIdElement.value;
    
    try {
        const response = await fetch(`${apiUrl}/tv/${seriesId}/season/${seasonNumber}?api_key=${apiKey}&language=pt-BR`);
        if (!response.ok) {
            throw new Error('Erro ao buscar os episódios da temporada.');
        }
        const data = await response.json();
        displayEpisodes(data.episodes);
    } catch (error) {
        console.error('Erro ao buscar episódios:', error);
    }
}


function displayEpisodes(episodes) {
    const episodeSelect = document.getElementById("episodeSelect");
    episodeSelect.innerHTML = '';
    episodes.forEach(episode => {
        const option = document.createElement('option');
        option.value = episode.episode_number;
        option.textContent = `Episódio ${episode.episode_number}: ${episode.name}`;
        episodeSelect.appendChild(option);
    });
}

document.getElementById("seasonSelect").addEventListener("change", function () {
    const seasonNumber = this.value;
    fetchEpisodes(seasonNumber);
});

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const seriesId = urlParams.get('id');
    const seriesType = urlParams.get('type');

    // Verifica se o elemento com id 'seriesId' existe antes de atribuir seu valor
    const seriesIdElement = document.getElementById('seriesId');
    if (seriesIdElement) {
        seriesIdElement.value = seriesId;
    } else {
        console.error('Elemento com id "seriesId" não encontrado.');
    }

    // Verifica se o elemento com id 'seasonSelect' existe antes de adicionar o evento onchange
    const seasonSelect = document.getElementById('seasonSelect');
    if (seasonSelect) {
        seasonSelect.addEventListener('change', function () {
            fetchEpisodes(this.value);
        });
    } else {
        console.error('Elemento com id "seasonSelect" não encontrado.');
    }

    // Função para salvar série como favorita
    const favoriteButton = document.getElementById('favoriteButton');
    if (favoriteButton) {
        favoriteButton.addEventListener('click', function () {
            // Lógica para buscar os detalhes da série
            const seriesTitle = document.getElementById('title').textContent;
            const posterPath = document.getElementById('poster').src;
            const seriesOverview = document.getElementById('overview').textContent;
            const seriesGenre = document.getElementById('genre').textContent;
            const seriesRuntime = document.getElementById('runtime').textContent;
            const seriesReleaseDate = document.getElementById('release-date').textContent;
            const seasonSelected = document.getElementById('seasonSelect').value;
            const episodeSelected = document.getElementById('episodeSelect').value;

            // Chamada para salvar a série como favorita
            saveFavoriteSeries(seriesId, seriesTitle, posterPath, seriesOverview, seriesGenre, seriesRuntime, seriesReleaseDate, seasonSelected, episodeSelected);
        });
    } else {
        console.error('Elemento com id "favoriteButton" não encontrado.');
    }

    // Verifica se há um ID de série válido e busca os detalhes se for uma série de TV
    if (seriesId && seriesType === 'tv') {
        fetchDetails(seriesId, seriesType);
    }
});



function saveFavoriteSeries(seriesId, seriesTitle, posterPath, overview, genre, runtime, releaseDate, seasonSelected, episodeSelected) {
    let favorites = JSON.parse(localStorage.getItem('favoriteSeries')) || [];

    // Verifica se a série já está salva como favorita
    const existingSeries = favorites.find(series => series.id === seriesId);
    if (existingSeries) {
        alert('Esta série já está salva como favorita!');
        return;
    }

    // Adiciona a série aos favoritos
    favorites.push({
        id: seriesId,
        title: seriesTitle,
        poster: posterPath,
        overview: overview,
        genre: genre,
        runtime: runtime,
        releaseDate: releaseDate,
        season: seasonSelected,
        episode: episodeSelected
    });

    // Salva a lista atualizada de favoritos no localStorage
    localStorage.setItem('favoriteSeries', JSON.stringify(favorites));
    alert('Série salva como favorita!');
}


async function fetchEpisodes(seasonNumber) {
    const seriesIdElement = document.getElementById('seriesId');
    if (!seriesIdElement) {
        console.error('Elemento com id "seriesId" não encontrado.');
        return;
    }
    
    const seriesId = seriesIdElement.value;
    
    try {
        const response = await fetch(`${apiUrl}/tv/${seriesId}/season/${seasonNumber}?api_key=${apiKey}&language=pt-BR`);
        if (!response.ok) {
            throw new Error('Erro ao buscar os episódios da temporada.');
        }
        const data = await response.json();
        displayEpisodes(data.episodes);
    } catch (error) {
        console.error('Erro ao buscar episódios:', error);
    }
}
