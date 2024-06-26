const apiKey = 'f929634d7d1ae9a3e4b1215ec7d38336';
const apiUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

document.addEventListener('DOMContentLoaded', function () {
  // Função para buscar e exibir detalhes de um filme da API do TMDB
  function fetchMovieDetails(movieId) {
    const url = `${apiUrl}/movie/${movieId}?api_key=${apiKey}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao obter os detalhes do filme.');
        }
        return response.json();
      })
      .then(data => {
        console.log('Detalhes do Filme:', data);

        // Exemplo de como exibir o título do filme
        const titleElement = document.getElementById('movie-title');
        if (titleElement) {
          titleElement.textContent = data.title;
        }

        // Exemplo de como exibir a sinopse do filme
        const overviewElement = document.getElementById('movie-overview');
        if (overviewElement) {
          overviewElement.textContent = data.overview;
        }

        // Exemplo de como exibir o poster do filme
        const posterElement = document.getElementById('movie-poster');
        if (posterElement) {
          posterElement.src = `${imageBaseUrl}${data.poster_path}`;
          posterElement.alt = data.title; // Definir um texto alternativo para acessibilidade
        }
      })
      .catch(error => {
        console.error('Erro ao obter os detalhes do filme:', error);
        alert('Ocorreu um erro ao obter os detalhes do filme. Por favor, tente novamente mais tarde.');
      });
  }

  // Função para exibir os filmes favoritos na página
  function displayFavoriteMovies() {
    const favoriteMoviesList = document.getElementById('favorite-movies');

    // Limpa a lista atual de filmes favoritos
    favoriteMoviesList.innerHTML = '';

    // Recupera os filmes favoritos do localStorage
    const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];

    // Verifica se há filmes favoritos para exibir
    if (favoriteMovies.length === 0) {
      favoriteMoviesList.innerHTML = '<p>Nenhum filme favorito encontrado.</p>';
    } else {
      // Adiciona cada filme favorito à lista em cards
      favoriteMovies.forEach(movie => {
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3');

        const image = document.createElement('img');
        image.classList.add('card-img-top');
        image.src = `${imageBaseUrl}${movie.poster_path}`;
        image.alt = movie.title;
        card.appendChild(image);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.textContent = movie.title;
        cardBody.appendChild(title);

        const overview = document.createElement('p');
        overview.classList.add('card-text');
        overview.textContent = movie.overview.length > 150 ? movie.overview.substring(0, 150) + '...' : movie.overview;
        cardBody.appendChild(overview);

        const viewButton = document.createElement('button');
        viewButton.classList.add('btn', 'btn-primary');
        viewButton.textContent = 'Ver Detalhes';
        viewButton.addEventListener('click', function () {
          fetchMovieDetails(movie.id);
        });
        cardBody.appendChild(viewButton);

        card.appendChild(cardBody);

        favoriteMoviesList.appendChild(card);
      });
    }
  }

  // Verificar se há um usuário logado
  const usuarioLogadoJSON = localStorage.getItem('usuario_logado');

  if (usuarioLogadoJSON) {
    // Se houver um usuário logado, converter para objeto JSON
    const usuarioLogado = JSON.parse(usuarioLogadoJSON);
    console.log('Usuário logado:', usuarioLogado);

    // Exibir as informações do usuário logado na interface
    const userDetailsElement = document.getElementById('user-details');
    if (userDetailsElement) {
      userDetailsElement.innerHTML = `
        <div class="text-center mb-4">
          <img src="${usuarioLogado.user.avatar}" alt="Foto de Perfil" class="rounded-circle" width="150">
        </div>
        <div>
          <p><strong>Nome:</strong> ${usuarioLogado.user.usuario}</p>
          <p><strong>Email:</strong> ${usuarioLogado.user.email}</p>
          <p><strong>Chave:</strong> ${usuarioLogado.key}</p>
        </div>
      `;
    }

    // Carregar filmes favoritos do localStorage
    displayFavoriteMovies();
  } else {
    console.log('Nenhum usuário está logado.');
    // Aqui você pode exibir uma mensagem ou redirecionar o usuário para a página de login
  }

  const toggleBtn = document.querySelector('.navbar-toggler');
  const sidebar = document.querySelector('.sidebar');

  toggleBtn.addEventListener('click', function () {
    sidebar.classList.toggle('active');
  });
});
