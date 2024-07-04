const apiKey = 'f929634d7d1ae9a3e4b1215ec7d38336';
const apiUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const embedderBaseUrl = 'https://embedder.net/e/series';
const firebaseUrl = 'https://cinetvplay-eba33-default-rtdb.firebaseio.com/usuario.json';

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
    
    const toggleBtn = document.querySelector('.navbar-toggler');
    const sidebar = document.querySelector('.sidebar');
    
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function () {
            sidebar.classList.toggle('active');
        });
    } else {
        console.error('Elemento .navbar-toggler ou .sidebar não encontrado.');
    }

    const saveFavoriteBtn = document.getElementById('saveFavoriteBtn');
    if (saveFavoriteBtn) {
        saveFavoriteBtn.addEventListener('click', function () {
            const seriesId = document.getElementById('seriesId').value;
            const seriesTitle = document.getElementById('title').textContent;
            const posterPath = document.getElementById('poster').src;
            const overview = document.getElementById('overview').textContent;
            const genre = document.getElementById('genre').textContent;
            const runtime = document.getElementById('runtime').textContent;
            const releaseDate = document.getElementById('release-date').textContent;
            const seasonSelected = document.getElementById('seasonSelect').value;
            const episodeSelected = document.getElementById('episodeSelect').value; // Adjust to get selected episode
            const episodeId = ''; // Not specified in your request, handle as needed

            saveFavoriteSeries(seriesId, seriesTitle, posterPath, overview, genre, runtime, releaseDate, seasonSelected, episodeSelected, episodeId);
        });
    } else {
        console.error('Elemento com id "saveFavoriteBtn" não encontrado.');
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

    document.title = `${data.name} - cineTv Play`;

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
    
    fetchEpisodes(1); // Carrega os episódios da primeira temporada ao carregar a página
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
        displayEpisodes(data.episodes, seriesId); // Passar o seriesId para displayEpisodes
    } catch (error) {
        console.error('Erro ao buscar episódios:', error);
    }
}

function displayEpisodes(episodes, seriesId) {
    const episodeContainer = document.getElementById("episodeContainer");
    episodeContainer.innerHTML = '';

    episodes.forEach(episode => {
        const episodeDiv = document.createElement('div');
        episodeDiv.classList.add('episode');
        episodeDiv.dataset.seriesId = seriesId;

        const episodeTitle = document.createElement('h4');
        episodeTitle.textContent = `Temporada ${episode.season_number} - Episódio ${episode.episode_number}: ${episode.name}`;
        episodeTitle.classList.add('episode-title');
        episodeDiv.appendChild(episodeTitle);

        const videoContainer = document.createElement('div');
        videoContainer.classList.add('video-container');

        const videoIframe = document.createElement('iframe');
        videoIframe.width = "100%";
        videoIframe.height = "315";
        videoIframe.style.display = 'block'; // Mostrar o iframe diretamente
        videoIframe.setAttribute('allowFullScreen', '');
        videoIframe.setAttribute('frameborder', '0');
        videoIframe.src = `${embedderBaseUrl}?id=${seriesId}&sea=${episode.season_number}&epi=${episode.episode_number}`;
        videoContainer.appendChild(videoIframe);

        episodeDiv.appendChild(videoContainer);

        const watchedIcon = document.createElement('span');
        watchedIcon.classList.add('watched-icon');
        watchedIcon.style.display = isEpisodeWatched(seriesId, episode.season_number, episode.episode_number) ? 'inline' : 'none';
        watchedIcon.textContent = '✔️';
        watchedIcon.addEventListener('click', function () {
            markAsWatched(seriesId, episode.season_number, episode.episode_number);
            watchedIcon.style.display = 'inline';
        });
        episodeDiv.appendChild(watchedIcon);

        episodeContainer.appendChild(episodeDiv);
    });
}

function markAsWatched(seriesId, seasonNumber, episodeNumber) {
    let watchedEpisodes = JSON.parse(localStorage.getItem('watchedEpisodes')) || [];
    const episodeKey = `${seriesId}-S${seasonNumber}E${episodeNumber}`;

    if (!watchedEpisodes.includes(episodeKey)) {
        watchedEpisodes.push(episodeKey);
        localStorage.setItem('watchedEpisodes', JSON.stringify(watchedEpisodes));
    }
    
    updateWatchedIcons();
    saveProgressToFirebase(seriesId, seasonNumber, episodeNumber); // Save progress to Firebase
}
function isEpisodeWatched(seriesId, seasonNumber, episodeNumber) {
    let watchedEpisodes = JSON.parse(localStorage.getItem('watchedEpisodes')) || [];
    const episodeKey = `${seriesId}-S${seasonNumber}E${episodeNumber}`;
    return watchedEpisodes.includes(episodeKey);
}

function updateWatchedIcons() {
    const watchedIcons = document.querySelectorAll('.watched-icon');
    watchedIcons.forEach(icon => {
        const parentDiv = icon.parentElement;
        const seriesId = parentDiv.dataset.seriesId;
        const episodeInfo = parentDiv.querySelector('h4').textContent;
        const seasonNumber = episodeInfo.match(/Temporada (\d+)/)[1];
        const episodeNumber = episodeInfo.match(/Episódio (\d+)/)[1];

        icon.style.display = isEpisodeWatched(seriesId, seasonNumber, episodeNumber) ? 'inline' : 'none';
    });
}

async function saveFavoriteSeries(seriesId, seriesTitle, posterPath, overview, genre, runtime, releaseDate, seasonSelected, episodeSelected, episodeId) {
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
        episode: episodeSelected,
        episodeId: episodeId
    });

    localStorage.setItem('favoriteSeries', JSON.stringify(favorites));
    alert('Série salva como favorita!');

    await saveFavoriteToFirebase(seriesId, seriesTitle, posterPath, overview, genre, runtime, releaseDate, seasonSelected, episodeSelected, episodeId); // Save to Firebase
}

function goBack() {
    window.history.back();
}

async function saveFavoriteToFirebase(seriesId, seriesTitle, posterPath, overview, genre, runtime, releaseDate, seasonSelected, episodeSelected, episodeId) {
    const userId = getUserId(); // Assume there is a function that retrieves the user ID
    const favoriteSeries = {
        id: seriesId,
        title: seriesTitle,
        poster: posterPath,
        overview: overview,
        genre: genre,
        runtime: runtime,
        releaseDate: releaseDate,
        season: seasonSelected,
        episode: episodeSelected,
        episodeId: episodeId
    };

    try {
        const response = await fetch(`${firebaseUrl}/${userId}/favorites.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(favoriteSeries)
        });

        if (!response.ok) {
            throw new Error('Erro ao salvar a série favorita no Firebase.');
        }

        alert('Série favorita salva no Firebase com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar série favorita no Firebase:', error);
    }
}

async function saveProgressToFirebase(seriesId, seasonNumber, episodeNumber) {
    const userId = getUserId(); // Assume there is a function that retrieves the user ID
    const progress = {
        seriesId: seriesId,
        season: seasonNumber,
        episode: episodeNumber
    };

    try {
        const response = await fetch(`${firebaseUrl}/${userId}/progress.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(progress)
        });

        if (!response.ok) {
            throw new Error('Erro ao salvar o progresso no Firebase.');
        }

        console.log('Progresso salvo no Firebase com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar progresso no Firebase:', error);
    }
}

function getUserId() {
    // Implementar lógica para recuperar o ID do usuário
    // Isso pode ser feito por meio de autenticação ou armazenando um ID de usuário no localStorage
    return 'usuario_id_exemplo'; // Substituir pelo ID real do usuário
}
