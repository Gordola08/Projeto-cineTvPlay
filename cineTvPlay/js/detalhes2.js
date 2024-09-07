const apiKey = 'f929634d7d1ae9a3e4b1215ec7d38336';
const apiUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const embedderBaseUrl = 'https://embedder.net/e/series';
const firebaseUrl = 'https://cinetvplay3-default-rtdb.firebaseio.com/usuario.json';

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

function updateWatchedIcon(seriesId, seasonNumber, episodeNumber, watchedIcon, notFinishedLabel) {
    // Supondo que você tem uma forma de verificar se o episódio foi assistido, por exemplo, usando localStorage ou Firebase
    const watchedEpisodes = JSON.parse(localStorage.getItem('watchedEpisodes')) || {};

    // Construa uma chave para o episódio
    const episodeKey = `${seriesId}-${seasonNumber}-${episodeNumber}`;

    // Verifique se o episódio está na lista de assistidos
    if (watchedEpisodes[episodeKey]) {
        // Episódio assistido
        watchedIcon.classList.add('text-success'); // Adiciona uma classe para o ícone de assistido (ajuste conforme necessário)
        notFinishedLabel.textContent = 'Assistido';
        notFinishedLabel.classList.add('text-success'); // Adiciona uma classe para o rótulo de assistido
    } else {
        // Episódio não assistido
        watchedIcon.classList.remove('text-success'); // Remove a classe de assistido
        notFinishedLabel.textContent = 'Não terminou de assistir';
        notFinishedLabel.classList.remove('text-success'); // Remove a classe de assistido
    }
}


function markEpisodeAsWatched(seriesId, seasonNumber, episodeNumber) {
    // Supondo que você está usando localStorage para armazenar episódios assistidos
    let watchedEpisodes = JSON.parse(localStorage.getItem('watchedEpisodes')) || {};

    const episodeKey = `${seriesId}-${seasonNumber}-${episodeNumber}`;
    watchedEpisodes[episodeKey] = true; // Marca o episódio como assistido

    localStorage.setItem('watchedEpisodes', JSON.stringify(watchedEpisodes));

    // Atualiza a interface para refletir o status de assistido
    updateWatchedIcon(seriesId, seasonNumber, episodeNumber, document.querySelector('.watched-icon'), document.querySelector('.not-finished'));
}


function updateWatchedIcon(seriesId, seasonNumber, episodeNumber, watchedIcon, notFinishedLabel) {
    const watchedEpisodes = JSON.parse(localStorage.getItem('watchedEpisodes')) || {};
    const key = `${seriesId}_S${seasonNumber}_E${episodeNumber}`;

    if (watchedEpisodes[key]) {
        watchedIcon.style.display = 'inline';
        notFinishedLabel.style.display = 'none';
    } else {
        watchedIcon.style.display = 'none';
        notFinishedLabel.style.display = 'inline';
    }
}

function saveFavoriteSeries(seriesId, title, posterPath, overview, genre, runtime, releaseDate, seasonSelected, episodeId) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error('Usuário não está logado.');
        return;
    }

    fetch(firebaseUrl)
        .then(response => response.json())
        .then(data => {
            const user = Object.values(data).find(user => user.userId === userId);
            if (user) {
                const favorites = user.favorites || [];
                const favoriteSeries = {
                    seriesId,
                    title,
                    posterPath,
                    overview,
                    genre,
                    runtime,
                    releaseDate,
                    seasonSelected,
                    episodeId
                };

                favorites.push(favoriteSeries);

                fetch(firebaseUrl, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        [userId]: {
                            ...user,
                            favorites
                        }
                    })
                })
                    .then(response => {
                        if (response.ok) {
                            console.log('Série favorita salva com sucesso.');
                        } else {
                            console.error('Erro ao salvar série favorita.');
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao salvar série favorita:', error);
                    });
            } else {
                console.error('Usuário não encontrado.');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar dados do usuário:', error);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.querySelector('.navbar-toggler');
    const sidebar = document.querySelector('.sidebar');

    toggleBtn.addEventListener('click', function () {
        sidebar.classList.toggle('active');
    });
});

function goBack() {
    // Esta função pode ser usada para redirecionar o usuário para a página anterior
    // Você pode usar window.history.back() para voltar uma página na navegação do histórico
    window.history.back();
  }
  