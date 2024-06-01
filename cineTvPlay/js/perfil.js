document.addEventListener('DOMContentLoaded', function () {
    fetch('https://cinetv-play-default-rtdb.firebaseio.com/usuario.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro na solicitação.');
        }
        return response.json();
      })
      .then(data => {
        // Verificar se há dados do usuário no armazenamento local
        const userId = localStorage.getItem('id_usuario');
        if (!userId) {
          // Se não houver ID de usuário, redirecionar para a página de login
          window.location.href = 'login.html';
          return;
        }
  
        // Verificar se o usuário existe no banco de dados
        const user = data[userId];
        if (!user) {
          console.error('Usuário não encontrado no banco de dados.');
          return;
        }
  
        // Exibir os detalhes do usuário no perfil
        document.getElementById('user-name').textContent = user.nome_usuario;
        document.getElementById('user-id').textContent = userId;
  
        // Se houver uma foto de perfil, definir o atributo src da imagem
        if (user.fotoPerfil) {
          document.getElementById('user-avatar').src = user.fotoPerfil;
        } else {
          console.warn('Foto de perfil não encontrada para o usuário.');
        }
  
        // Se houver filmes favoritos, exibir na lista
        if (user.filmesFavoritos && user.filmesFavoritos.length > 0) {
          const favoriteMoviesList = document.getElementById('favorite-movies');
          user.filmesFavoritos.forEach(movie => {
            const li = document.createElement('li');
            li.textContent = movie;
            favoriteMoviesList.appendChild(li);
          });
        } else {
          console.warn('Não há filmes favoritos para este usuário.');
        }
      })
      .catch(error => {
        console.error('Erro na solicitação:', error);
        alert('Ocorreu um erro ao processar a solicitação. Por favor, tente novamente mais tarde.');
      });
  });
  