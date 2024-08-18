document.addEventListener("DOMContentLoaded", function () {
  // Alternar a visibilidade da barra lateral
  const toggleBtn = document.querySelector('.navbar-toggler');
  const sidebar = document.querySelector('.sidebar');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', function () {
      sidebar.classList.toggle('active');
    });
  }

  // Função para carregar o avatar do usuário
  function carregarAvatar() {
    const usuarioLogadoJSON = localStorage.getItem('usuario_logado');
    if (usuarioLogadoJSON) {
      const usuarioLogado = JSON.parse(usuarioLogadoJSON);
      console.log('Usuário logado:', usuarioLogado);

      const avatarElement = document.getElementById('avatarUsuario');
      if (avatarElement) {
        avatarElement.src = usuarioLogado.user.avatar || 'caminho/para/avatar/default.png';
        avatarElement.alt = "Foto de Perfil";
        avatarElement.classList.add('rounded-circle');
        avatarElement.width = 75; // Tamanho do avatar
      }
    } else {
      console.log('Nenhum usuário logado encontrado no localStorage.');
    }
  }

  // Função para atualizar o status do usuário com base no código de ativação
  function atualizarStatusUsuario() {
    const userNameElement = document.getElementById('user-name');
    const activationCode = localStorage.getItem('activationCode');
    console.log('Código de ativação no localStorage:', activationCode);

    if (activationCode) {
      fetch(`https://cinetvplay2-56923-default-rtdb.firebaseio.com/usuarios.json?orderBy="activationCode"&equalTo="${activationCode}"`)
        .then(response => response.json())
        .then(data => {
          console.log('Dados obtidos do Firebase:', data);
          if (Object.keys(data).length > 0) {
            userNameElement.textContent = 'Pass';
            userNameElement.classList.remove('text-danger');
            userNameElement.classList.add('text-success');
          } else {
            userNameElement.textContent = 'Sem Pass';
            userNameElement.classList.remove('text-success');
            userNameElement.classList.add('text-danger');
          }
          // Sempre tentar buscar dados VIP
          buscarDadosVIP();
        })
        .catch(error => {
          console.error('Erro ao obter dados do Firebase:', error);
          userNameElement.textContent = 'Erro ao carregar status';
          userNameElement.classList.add('text-danger');
          buscarDadosVIP(); // Tentar buscar dados VIP mesmo em caso de erro
        });
    } else {
      console.log('Nenhum código de ativação encontrado no localStorage.');
      userNameElement.textContent = 'Sem Pass';
      userNameElement.classList.add('text-danger');
      buscarDadosVIP(); // Tentar buscar dados VIP mesmo sem código de ativação
    }
  }

  // Função para buscar dados VIP
  function buscarDadosVIP() {
    const userId = localStorage.getItem('userId'); // Assume que o ID do usuário está armazenado no localStorage

    if (userId) {
      fetch(`https://cinetvplay2-56923-default-rtdb.firebaseio.com/usuarios/${userId}/vipdata.json`)
        .then(response => response.json())
        .then(data => {
          console.log('Dados VIP obtidos do Firebase:', data);
          if (data) {
            console.log('Dados VIP:', JSON.stringify(data, null, 2)); // Exibir dados formatados
          } else {
            console.log('Sem dados VIP disponíveis.');
          }
        })
        .catch(error => {
          console.error('Erro ao obter dados VIP do Firebase:', error);
        });
    } else {
      console.log('Nenhum ID de usuário encontrado no localStorage.');
    }
  }

  carregarAvatar();
  atualizarStatusUsuario();

  // Ativar VIP
  document.getElementById('vip-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const userId = document.getElementById('userId').value.trim();
    const activationCode = document.getElementById('activationCode').value.trim();
    const statusMessage = document.getElementById('status-message');
    
    if (userId && activationCode) {
      fetch(`https://cinetvplay2-56923-default-rtdb.firebaseio.com/usuarios/${userId}.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ activationCode })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Dados atualizados no Firebase:', data);
        statusMessage.textContent = 'VIP ativado com sucesso!';
        statusMessage.className = 'success';
        document.getElementById('userId').value = '';
        document.getElementById('activationCode').value = '';
        atualizarStatusUsuario(); // Atualiza o status após ativação
      })
      .catch(error => {
        console.error('Erro ao atualizar dados no Firebase:', error);
        statusMessage.textContent = 'Erro ao ativar VIP. Tente novamente.';
        statusMessage.className = 'error';
      });
    } else {
      statusMessage.textContent = 'Por favor, preencha todos os campos.';
      statusMessage.className = 'error';
    }
  });
});
