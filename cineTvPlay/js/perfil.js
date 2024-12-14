const apiKey = 'f929634d7d1ae9a3e4b1215ec7d38336';
const apiUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

// Função para redirecionar para a página de detalhes do filme
function viewMovieDetails(movieId, type) {
  const detalhesUrl = `../destaque/detalhes.html?id=${movieId}&type=${type}`;
  window.location.href = detalhesUrl;
}

// Função para redirecionar para a página de detalhes da série
function viewSeriesDetails(seriesId, type) {
  const detalhesUrl = `../destaque/detalhes2.html?id=${seriesId}&type=${type}`;
  window.location.href = detalhesUrl;
}

document.addEventListener('DOMContentLoaded', function () {
  // Função para exibir os filmes favoritos na página
  function displayFavoriteMovies() {
    const favoriteMoviesList = document.getElementById('favorite-movies');
    favoriteMoviesList.innerHTML = '';

    const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    if (favoriteMovies.length === 0) {
      favoriteMoviesList.innerHTML = '<p>Nenhum filme favorito encontrado.</p>';
    } else {
      favoriteMovies.forEach(movie => {
        const card = document.createElement('div');
        card.classList.add('card', 'movie-card', 'mb-0');
        card.setAttribute('onclick', `viewMovieDetails('${movie.id}', 'movie')`);

        const image = document.createElement('img');
        image.classList.add('card-img-top');
        image.src = movie.poster ? `${imageBaseUrl}${movie.poster}` : 'path/to/default/image.jpg'; // Ajuste o caminho padrão
        image.alt = movie.title;
        image.style.width = '220px';
        card.appendChild(image);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'p-0');

        const title = document.createElement('h6');
        title.classList.add('card-title');
        title.textContent = movie.title;
        title.style.fontSize = '0.9rem';
        cardBody.appendChild(title);

        card.appendChild(cardBody);
        favoriteMoviesList.appendChild(card);
      });
    }
  }

  // Função para exibir as séries favoritas na página
  function displayFavoriteSeries() {
    const favoriteSeriesList = document.getElementById('favorite-series');
    favoriteSeriesList.innerHTML = '';

    const favoriteSeries = JSON.parse(localStorage.getItem('favoriteSeries')) || [];
    if (favoriteSeries.length === 0) {
      favoriteSeriesList.innerHTML = '<p>Nenhuma série favorita encontrada.</p>';
    } else {
      favoriteSeries.forEach(serie => {
        const card = document.createElement('div');
        card.classList.add('card', 'movie-card', 'mb-0');
        card.setAttribute('onclick', `viewSeriesDetails('${serie.id}', 'serie')`);

        const image = document.createElement('img');
        image.classList.add('card-img-top');
        image.src = serie.poster ? `${imageBaseUrl}${serie.poster}` : 'path/to/default/image.jpg'; // Ajuste o caminho padrão
        image.alt = serie.title;
        image.style.width = '220px';
        card.appendChild(image);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'p-0');

        const title = document.createElement('h6');
        title.classList.add('card-title');
        title.textContent = serie.title;
        title.style.fontSize = '0.9rem';
        cardBody.appendChild(title);

        card.appendChild(cardBody);
        favoriteSeriesList.appendChild(card);
      });
    }
  }

// Verificar se há um usuário logado
const usuarioLogadoJSON = localStorage.getItem('usuario_logado');
const perfilSelecionadoJSON = localStorage.getItem('perfil_selecionado');

if (usuarioLogadoJSON && perfilSelecionadoJSON) {
  const usuarioLogado = JSON.parse(usuarioLogadoJSON);
  const perfilSelecionado = JSON.parse(perfilSelecionadoJSON);

  console.log('Usuário logado:', usuarioLogado);  // Verificando a estrutura de usuarioLogado
  console.log('Perfil selecionado:', perfilSelecionado);  // Verificando a estrutura de perfilSelecionado

  // Verificando a estrutura do objeto para pegar as informações corretamente
  const perfil = {
    avatar: perfilSelecionado.avatar ? perfilSelecionado.avatar : '', // Avatar do perfil
    nome: perfilSelecionado.name ? perfilSelecionado.name : 'Nome não encontrado'  // Nome do perfil
  };

  // Exibindo os dados do usuário e do perfil na interface
  const userDetailsElement = document.getElementById('user-details');
  if (userDetailsElement) {
    userDetailsElement.innerHTML = `
      <div class="text-center mb-4">
        <img src="${perfil.avatar}" alt="Foto de Perfil" class="rounded-circle" width="150">
      </div>
      <div>
        <p><strong>Nome:</strong> ${perfil.nome}</p>
        <p><strong>Email:</strong> ${usuarioLogado.user.email || 'Email não encontrado'}</p>
        <p><strong>Chave:</strong> ${usuarioLogado.key || 'Chave não encontrada'}</p>
      </div>
    `;
  }

  // Exibir os favoritos (filmes e séries)
  displayFavoriteMovies();
  displayFavoriteSeries();
} else {
  console.log('Nenhum usuário ou perfil encontrado.');
}


  // Alternar a barra lateral
  const toggleBtn = document.querySelector('.navbar-toggler');
  const sidebar = document.querySelector('.sidebar');

  toggleBtn.addEventListener('click', function () {
    sidebar.classList.toggle('active');
  });
});

// Efeito de neve caindo
const snowContainer = document.getElementById('snow-container');
for (let i = 0; i < 50; i++) {
  const snowflake = document.createElement('div');
  snowflake.classList.add('snowflake');
  snowflake.textContent = '❄';
  snowflake.style.left = Math.random() * 100 + 'vw';
  snowflake.style.animationDuration = Math.random() * 3 + 2 + 's';
  snowflake.style.opacity = Math.random();
  snowContainer.appendChild(snowflake);
}