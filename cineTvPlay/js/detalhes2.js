const apiKey = 'f929634d7d1ae9a3e4b1215ec7d38336';
const apiUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const embedderBaseUrl = 'https://embedder.net/e/series';
const firebaseUrl = 'https://cinetvplay3-default-rtdb.firebaseio.com/usuarios.json';

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const seriesId = urlParams.get("id");
    const type = urlParams.get("type"); // 'tv'

    const seriesIdElement = document.getElementById('seriesId');
    const saveFavoriteBtn = document.getElementById('saveFavoriteBtn');
    const toggleBtn = document.querySelector('.navbar-toggler');
    const sidebar = document.querySelector('.sidebar');
    const usuarioLogadoJSON = localStorage.getItem('usuarioLogado');
    const usuarioLogado = usuarioLogadoJSON ? JSON.parse(usuarioLogadoJSON) : null;

    if (seriesIdElement) {
        seriesIdElement.value = seriesId;
    } else {
        console.error('Elemento com id "seriesId" não encontrado.');
    }

    if (seriesId && type === 'tv') {
        fetchDetails(seriesId, type);
    }

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => sidebar.classList.toggle('active'));
    } else {
        console.error('Elemento .navbar-toggler ou .sidebar não encontrado.');
    }

    if (saveFavoriteBtn) {
        saveFavoriteBtn.addEventListener('click', () => {
            const seriesData = {
                seriesId: seriesIdElement.value,
                seriesTitle: document.getElementById('title').textContent,
                posterPath: document.getElementById('poster').src,
                overview: document.getElementById('overview').textContent,
                genre: document.getElementById('genre').textContent,
                runtime: document.getElementById('runtime').textContent,
                releaseDate: document.getElementById('release-date').textContent,
                seasonSelected: document.getElementById('seasonSelect').value,
                episodeId: '' // Handle as needed
            };
            saveFavoriteSeries(seriesData);
        });
    } else {
        console.error('Elemento com id "saveFavoriteBtn" não encontrado.');
    }

    if (usuarioLogado) {
        const { id: userId, fireKey } = usuarioLogado;

        if (userId && fireKey) {
            fetch(`${firebaseUrl}/${userId}.json?auth=${fireKey}`)
                .then(response => response.ok ? response.json() : Promise.reject('Erro ao buscar usuário.'))
                .then(data => console.log(data))
                .catch(error => console.error("Erro ao buscar dados do usuário:", error));
        } else {
            console.error('userId ou fireKey está undefined.');
        }
    } else {
        console.error('usuarioLogado não encontrado no localStorage.');
    }
});

async function fetchDetails(id, type) {
    try {
        const response = await fetch(`${apiUrl}/${type}/${id}?api_key=${apiKey}&language=pt-BR`);
        if (!response.ok) throw new Error('Erro ao buscar detalhes da série.');
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

    seasonSelect.addEventListener('change', () => fetchEpisodes(seasonSelect.value));
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
        if (!response.ok) throw new Error('Erro ao buscar os episódios da temporada.');
        const data = await response.json();
        displayEpisodes(data.episodes, seriesId);
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
        episodeImage.src = episode.still_path ? `${imageBaseUrl}${episode.still_path}` : ''; // Set image if available
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
        watchedIcon.classList.add('watched-icon', 'ms-2', 'bi', 'bi-check-circle-fill');
        watchedIcon.style.display = 'none'; // Inicialmente oculto
        episodeDetails.appendChild(watchedIcon);

        const notFinishedLabel = document.createElement('span');
        notFinishedLabel.classList.add('not-finished');
        notFinishedLabel.textContent = 'Não terminou de assistir';
        episodeDetails.appendChild(notFinishedLabel);

        const finishedLabel = document.createElement('span');
        finishedLabel.classList.add('finished-label', 'text-success', 'ms-2');
        finishedLabel.textContent = 'Já assisti';
        finishedLabel.style.display = 'none'; // Inicialmente oculto
        episodeDetails.appendChild(finishedLabel);

        updateWatchedIcon(seriesId, episode.season_number, episode.episode_number, watchedIcon, notFinishedLabel, finishedLabel);

        episodeDiv.appendChild(episodeDetails);

        episodeDiv.addEventListener('click', function () {
            markEpisodeAsWatched(seriesId, episode.season_number, episode.episode_number);
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
    try {
        const response = await fetch(`${apiUrl}/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${apiKey}&language=pt-BR`);
        if (!response.ok) throw new Error('Erro ao buscar detalhes do episódio.');
        const data = await response.json();

        modalTitle.textContent = data.name;
        modalContent.textContent = data.overview || 'Sem descrição disponível.';
    } catch (error) {
        console.error('Erro ao buscar detalhes do episódio:', error);
    }
}

function markEpisodeAsWatched(seriesId, seasonNumber, episodeNumber) {
    const usuarioLogadoJSON = localStorage.getItem('usuarioLogado');
    const usuarioLogado = usuarioLogadoJSON ? JSON.parse(usuarioLogadoJSON) : null;

    if (usuarioLogado) {
        const { id: userId, fireKey } = usuarioLogado;

        if (userId && fireKey) {
            const episodeKey = `${seriesId}_S${seasonNumber}E${episodeNumber}`;

            fetch(`${firebaseUrl}/${userId}/watchedEpisodes/${episodeKey}.json?auth=${fireKey}`, {
                method: 'PUT',
                body: JSON.stringify({ watched: true }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) throw new Error('Erro ao marcar episódio como assistido.');
                    console.log('Episódio marcado como assistido:', episodeKey);
                })
                .catch(error => console.error('Erro ao marcar episódio:', error));
        } else {
            console.error('userId ou fireKey está undefined.');
        }
    } else {
        console.error('usuarioLogado não encontrado no localStorage.');
    }
}

function updateWatchedIcon(seriesId, seasonNumber, episodeNumber, watchedIcon, notFinishedLabel, finishedLabel) {
    const usuarioLogadoJSON = localStorage.getItem('usuarioLogado');
    const usuarioLogado = usuarioLogadoJSON ? JSON.parse(usuarioLogadoJSON) : null;

    if (usuarioLogado) {
        const { id: userId, fireKey } = usuarioLogado;

        if (userId && fireKey) {
            const episodeKey = `${seriesId}_S${seasonNumber}E${episodeNumber}`;
            fetch(`${firebaseUrl}/${userId}/watchedEpisodes/${episodeKey}.json?auth=${fireKey}`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.watched) {
                        watchedIcon.style.display = 'inline';
                        notFinishedLabel.style.display = 'none';
                        finishedLabel.style.display = 'inline';
                    } else {
                        watchedIcon.style.display = 'none';
                        notFinishedLabel.style.display = 'inline';
                        finishedLabel.style.display = 'none';
                    }
                })
                .catch(error => console.error('Erro ao atualizar ícone de assistido:', error));
        }
    }
}

function saveFavoriteSeries(seriesData) {
    const usuarioLogadoJSON = localStorage.getItem('usuarioLogado');
    const usuarioLogado = usuarioLogadoJSON ? JSON.parse(usuarioLogadoJSON) : null;

    if (usuarioLogado) {
        const { id: userId, fireKey } = usuarioLogado;

        if (userId && fireKey) {
            const seriesKey = seriesData.seriesId; // or another unique key
            fetch(`${firebaseUrl}/${userId}/favoriteSeries/${seriesKey}.json?auth=${fireKey}`, {
                method: 'PUT',
                body: JSON.stringify(seriesData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) throw new Error('Erro ao salvar a série favorita.');
                    console.log('Série favorita salva:', seriesData);
                })
                .catch(error => console.error('Erro ao salvar série favorita:', error));
        }
    }
}
