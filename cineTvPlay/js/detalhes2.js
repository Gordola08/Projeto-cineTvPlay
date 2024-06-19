const apiKey = 'f929634d7d1ae9a3e4b1215ec7d38336';
const apiUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const embedderBaseUrl = 'https://embedder.net/e/';

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const seriesId = urlParams.get("id");
    const type = urlParams.get("type"); // 'tv'

    const seriesIdElement = document.getElementById('seriesId');
    if (seriesIdElement) {
        seriesIdElement.value = seriesId;
    } else {
        console.error('Elemento com id "seriesId" não encontrado.');
    }

    if (seriesId && type === 'tv') {
        fetchDetails(seriesId, type);
    }

    const favoriteButton = document.getElementById('favoriteButton');
    if (favoriteButton) {
        favoriteButton.addEventListener('click', function () {
            const seriesTitle = document.getElementById('title').textContent;
            const posterPath = document.getElementById('poster').src;
            const seriesOverview = document.getElementById('overview').textContent;
            const seriesGenre = document.getElementById('genre').textContent;
            const seriesRuntime = document.getElementById('runtime').textContent;
            const seriesReleaseDate = document.getElementById('release-date').textContent;
            const seasonSelected = document.getElementById('seasonSelect').value;
            const episodeSelected = document.getElementById('episodeSelect').value;

            saveFavoriteSeries(seriesId, seriesTitle, posterPath, seriesOverview, seriesGenre, seriesRuntime, seriesReleaseDate, seasonSelected, episodeSelected);
        });
    } else {
        console.error('Elemento com id "favoriteButton" não encontrado.');
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
    }
}

function displayDetails(data, type) {
    document.getElementById("title").textContent = data.name;
    document.getElementById("poster").src = data.poster_path ? `${imageBaseUrl}${data.poster_path}` : '';
    document.getElementById("overview").textContent = data.overview;
    document.getElementById("genre").textContent = data.genres.map(genre => genre.name).join(', ');
    document.getElementById("runtime").textContent = `${data.episode_run_time[0]} min`;
    document.getElementById("release-date").textContent = data.first_air_date;

    const seasonSelect = document.getElementById("seasonSelect");
    seasonSelect.innerHTML = '';
    for (let i = 1; i <= data.number_of_seasons; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Temporada ${i}`;
        seasonSelect.appendChild(option);
    }

    seasonSelect.addEventListener('change', function () {
        fetchEpisodes(this.value);
    });

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

    // Selecionar o primeiro episódio por padrão
    if (episodes.length > 0) {
        episodeSelect.value = episodes[0].episode_number;
        displayEpisodeVideo(episodes[0].season_number, episodes[0].episode_number);
    }

    episodeSelect.addEventListener('change', function () {
        const selectedEpisode = episodes.find(ep => ep.episode_number == this.value);
        displayEpisodeVideo(selectedEpisode.season_number, selectedEpisode.episode_number);
    });
}

function displayEpisodeVideo(seasonNumber, episodeNumber) {
    const seriesIdElement = document.getElementById('seriesId');
    if (!seriesIdElement) {
        console.error('Elemento com id "seriesId" não encontrado.');
        return;
    }

    const seriesId = seriesIdElement.value;
    const videoUrl = `${embedderBaseUrl}${seriesId}/${seasonNumber}-${episodeNumber}`;
    const videoIframe = document.getElementById('videoIframe');
    if (videoIframe) {
        videoIframe.src = videoUrl;
    } else {
        console.error('Elemento com id "videoIframe" não encontrado.');
    }
}

function saveFavoriteSeries(seriesId, seriesTitle, posterPath, overview, genre, runtime, releaseDate, seasonSelected, episodeSelected) {
    let favorites = JSON.parse(localStorage.getItem('favoriteSeries')) || [];

    const existingSeries = favorites.find(series => series.id === seriesId);
    if (existingSeries) {
        alert('Esta série já está salva como favorita!');
        return;
    }

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

    localStorage.setItem('favoriteSeries', JSON.stringify(favorites));
    alert('Série salva como favorita!');
}

document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.querySelector('.navbar-toggler');
    const sidebar = document.querySelector('.sidebar');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function () {
            sidebar.classList.toggle('active');
        });
    } else {
        console.error('Elemento .navbar-toggler ou .sidebar não encontrado.');
    }
});


function displayEpisodeVideo(seasonNumber, episodeNumber) {
    const seriesIdElement = document.getElementById('seriesId');
    if (!seriesIdElement) {
        console.error('Elemento com id "seriesId" não encontrado.');
        return;
    }

    const seriesId = seriesIdElement.value;
    const videoUrl = `${embedderBaseUrl}${seriesId}/${seasonNumber}-${episodeNumber}`;
    console.log(`Loading video from URL: ${videoUrl}`); // Debug log
    const videoIframe = document.getElementById('videoIframe');
    if (videoIframe) {
        videoIframe.src = videoUrl;
    } else {
        console.error('Elemento com id "videoIframe" não encontrado.');
    }
}
