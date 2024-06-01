document.addEventListener('DOMContentLoaded', function () {
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const btn = document.getElementById('btn');

    if (!emailInput || !senhaInput || !btn) {
      console.error("Um ou mais elementos não encontrados. Verifique seus IDs HTML.");
      return;
    }

    btn.addEventListener('click', function (e) {
      e.preventDefault();

      const emailValue = emailInput.value;
      const senhaValue = senhaInput.value;

      fetch('https://cinetv-play-default-rtdb.firebaseio.com/usuario.json')
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro na solicitação.');
          }
          return response.json();
        })
        .then(data => {
          let userExists = false;

          for (const key in data) {
            if (data[key].email === emailValue && data[key].senha === senhaValue) {
              userExists = true;
              // Armazene os detalhes do usuário no localStorage
              localStorage.setItem('usuario_logado', JSON.stringify(data[key]));
              alert('Login bem-sucedido!');
              window.location.href = '../cinetv/index.html';
              break;
            }
          }

          if (!userExists) {
            alert('Credenciais de login inválidas. Tente novamente.');
          }
        })
        .catch(error => {
          console.error('Erro na solicitação:', error);
          alert('Ocorreu um erro ao processar a solicitação. Por favor, tente novamente mais tarde.');
        });
    });
  });