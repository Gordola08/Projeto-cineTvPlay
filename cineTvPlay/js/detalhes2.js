const apiKey = 'f929634d7d1ae9a3e4b1215ec7d38336';
const apiUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const embedderBaseUrl = 'https://embedder.net/e/series';
const firebaseUrl = 'https://cinetvplay2-56923-default-rtdb.firebaseio.com/usuario.json';

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
            const episodeId = ''; // Not specified in your request, handle as needed

            saveFavoriteSeries(seriesId, seriesTitle, posterPath, overview, genre, runtime, releaseDate, seasonSelected, episodeId);
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
        episodeDiv.classList.add('episode-item', 'd-flex', 'align-items-center', 'mb-3');
        episodeDiv.dataset.seriesId = seriesId;
        episodeDiv.dataset.seasonNumber = episode.season_number;
        episodeDiv.dataset.episodeNumber = episode.episode_number;

        const episodeImage = document.createElement('img');
        episodeImage.classList.add('episode-image', 'me-3');
        episodeImage.src = `${imageBaseUrl}${episode.still_path}`;
        episodeDiv.appendChild(episodeImage);

        const episodeDetails = document.createElement('div');
        episodeDetails.classList.add('episode-details', 'flex-grow-1');

        const episodeTitle = document.createElement('h5');
        episodeTitle.textContent = episode.name;
        episodeTitle.classList.add('episode-title');
        episodeDetails.appendChild(episodeTitle);

        const episodeInfo = document.createElement('p');
        episodeInfo.classList.add('episode-info', 'text-muted');
        episodeInfo.textContent = `S${episode.season_number} E${episode.episode_number} - ${new Date(episode.air_date).toLocaleDateString()}`;
        episodeDetails.appendChild(episodeInfo);

        const watchedIcon = document.createElement('span');
        watchedIcon.classList.add('watched-icon', 'ms-2', 'bi', 'bi-check-circle-fill'); // Bootstrap icon
        episodeDetails.appendChild(watchedIcon);

        const notFinishedLabel = document.createElement('span');
        notFinishedLabel.classList.add('not-finished');
        notFinishedLabel.textContent = 'Não terminou de assistir';
        episodeDetails.appendChild(notFinishedLabel);

        updateWatchedIcon(seriesId, episode.season_number, episode.episode_number, watchedIcon, notFinishedLabel);

        episodeDiv.appendChild(episodeDetails);

        episodeDiv.addEventListener('click', function () {
            showEpisodeModal(seriesId, episode.season_number, episode.episode_number);
        });

        episodeContainer.appendChild(episodeDiv);
    });
}

function showEpisodeModal(seriesId, seasonNumber, episodeNumber) {
    const modal = document.getElementById('episodeModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    fetchEpisodeDetails(seriesId, seasonNumber, episodeNumber, modalTitle, modalContent);

    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
}

async function fetchEpisodeDetails(seriesId, seasonNumber, episodeNumber, modalTitle, modalContent) {
    const apiUrl = `https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${apiKey}&language=pt-BR`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Erro ao buscar detalhes do episódio.');
        }
        const data = await response.json();

        modalTitle.textContent = data.name;
        modalContent.innerHTML = `
            <img src="${data.still_path ? `https://image.tmdb.org/t/p/w500${data.still_path}` : ''}" alt="${data.name}" class="img-fluid mb-3">
            <p>${data.overview}</p>
            <p><strong>Data de Exibição:</strong> ${new Date(data.air_date).toLocaleDateString()}</p>
            <iframe width="100%" height="315" src="${embedderBaseUrl}?id=${seriesId}&sea=${seasonNumber}&epi=${episodeNumber}" frameborder="0" allowfullscreen></iframe>
        `;
    } catch (error) {
        console.error("Erro ao buscar detalhes do episódio:", error);
        modalContent.innerHTML = '<p>Erro ao carregar os detalhes do episódio.</p>';
    }
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

function isEpisodeNotFinished(seriesId, seasonNumber, episodeNumber) {
    // Placeholder function to determine if the episode is not finished
    // You can implement your own logic to track this
    return false;
}

function updateWatchedIcon(seriesId, seasonNumber, episodeNumber, watchedIcon, notFinishedLabel) {
    if (isEpisodeWatched(seriesId, seasonNumber, episodeNumber)) {
        watchedIcon.style.display = 'inline';
        notFinishedLabel.style.display = 'none';
    } else if (isEpisodeNotFinished(seriesId, seasonNumber, episodeNumber)) {
        watchedIcon.style.display = 'none';
        notFinishedLabel.style.display = 'inline';
    } else {
        watchedIcon.style.display = 'none';
        notFinishedLabel.style.display = 'none';
    }
}

function updateWatchedIcons() {
    const episodeItems = document.querySelectorAll('.episode-item');
    episodeItems.forEach(item => {
        const seriesId = item.dataset.seriesId;
        const seasonNumber = item.dataset.seasonNumber;
        const episodeNumber = item.dataset.episodeNumber;
        const watchedIcon = item.querySelector('.watched-icon');
        const notFinishedLabel = item.querySelector('.not-finished');
        
        updateWatchedIcon(seriesId, seasonNumber, episodeNumber, watchedIcon, notFinishedLabel);
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

document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.querySelector('.navbar-toggler');
    const sidebar = document.querySelector('.sidebar');
  
    toggleBtn.addEventListener('click', function () {
      sidebar.classList.toggle('active');
    });
  });