document.addEventListener('DOMContentLoaded', function () {
  // Verificar se há um usuário logado
  const usuarioLogadoJSON = localStorage.getItem('usuario_logado');

  if (usuarioLogadoJSON) {
      // Se houver um usuário logado, converter para objeto JSON
      const usuarioLogado = JSON.parse(usuarioLogadoJSON);
      console.log('Usuário logado:', usuarioLogado);
      
      // Exibir as informações do usuário logado na interface
      const userInfoElement = document.getElementById('user-info');
      if (userInfoElement) {
          userInfoElement.innerHTML = `
              <p>Nome do usuário: ${usuarioLogado.user.usuario}</p>
              <p>Email: ${usuarioLogado.user.email}</p>
              <p>Chave: ${usuarioLogado.key}</p>
          `;
      }
  } else {
      console.log('Nenhum usuário está logado.');
      // Aqui você pode exibir uma mensagem ou redirecionar o usuário para a página de login
  }

  // Fetch dos usuários
  fetch('https://cinetv-play-default-rtdb.firebaseio.com/usuario.json')
      .then(response => {
          if (!response.ok) {
              throw new Error('Erro ao buscar usuários.');
          }
          return response.json();
      })
      .then(data => {
          // Iterar sobre os dados para encontrar os usuários
          Object.keys(data).forEach(key => {
              const user = data[key];
              const usuario = user.usuario;

              // Aqui você pode fazer o que quiser com o ID e o nome do usuário
              console.log('ID do usuário:', key);
              console.log('Nome do usuário:', usuario);
          });
      })
      .catch(error => {
          console.error('Erro ao buscar usuários:', error);
          alert('Ocorreu um erro ao buscar usuários. Por favor, tente novamente mais tarde.');
      });
});