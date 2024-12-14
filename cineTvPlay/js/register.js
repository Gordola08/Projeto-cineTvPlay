var emailInput = document.getElementById('email');
var senhaInput = document.getElementById('senha');
var btn = document.getElementById('btn');
var alertContainer = document.getElementById('alert-container');

document.getElementById('register-form').addEventListener('submit', function (e) {
  e.preventDefault();
  verificarCamposEVoltar();
});

function mostrarAlerta(mensagem, tipo) {
  var alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${tipo} alert-dismissible fade show`;
  alertDiv.role = 'alert';
  alertDiv.innerHTML = `
    ${mensagem}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  alertContainer.appendChild(alertDiv);

  setTimeout(function () {
    alertDiv.classList.remove('show');
  }, 5000);
}

function verificarCamposEVoltar() {
  // Resetar qualquer estilo de campo inválido
  emailInput.classList.remove('campo-invalido');
  senhaInput.classList.remove('campo-invalido');

  // Verificar se os campos obrigatórios estão preenchidos
  if (!emailInput.value.trim()) {
    mostrarAlerta('Por favor, preencha o campo Email.', 'danger');
    emailInput.classList.add('campo-invalido');
    return;
  }

  // Verificar o formato do email usando uma expressão regular simples
  var emailFormato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailFormato.test(emailInput.value.trim())) {
    mostrarAlerta('Por favor, insira um email válido.', 'danger');
    emailInput.classList.add('campo-invalido');
    return;
  }

  if (!senhaInput.value.trim()) {
    mostrarAlerta('Por favor, preencha o campo Senha.', 'danger');
    senhaInput.classList.add('campo-invalido');
    return;
  }

  verificarUsuarioEmail();
}

function verificarUsuarioEmail() {
  fetch('https://cinetvplay3-default-rtdb.firebaseio.com/usuario.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Não foi possível obter os usuários do Firebase.');
      }
      return response.json();
    })
    .then(data => {
      if (!data || Object.keys(data).length === 0) {
        // Se não há nenhum dado retornado ou o objeto está vazio
        cadastrarNovoUsuario();
        return;
      }

      var emailExistente = Object.values(data).some(item => item.email === emailInput.value.trim());

      if (emailExistente) {
        mostrarAlerta('Este email já está sendo usado. Escolha outro email.', 'warning');
      } else {
        cadastrarNovoUsuario();
      }
    })
    .catch(error => {
      console.error('Erro ao verificar usuários no Firebase:', error);
      mostrarAlerta('Ocorreu um erro ao verificar os usuários. Tente novamente mais tarde.', 'danger');
    });
}

function cadastrarNovoUsuario() {
  var dados = {
    email: emailInput.value.trim(),
    senha: senhaInput.value.trim(),
    activationCode: getActivationCode() // Adicionando o activationCode
  };
  salvarNoFirebase(dados);
}

function salvarNoFirebase(dados) {
  fetch('https://cinetvplay3-default-rtdb.firebaseio.com/usuario.json', {
    method: 'POST',
    body: JSON.stringify(dados),
    headers: {
      'Content-type': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao salvar no Firebase.');
      }
      return response.json();
    })
    .then(json => {
      console.log(json);
      mostrarAlerta('Registro realizado com sucesso!', 'success');
      setTimeout(function () {
        window.location.href = '../index.html';
      }, 2000);
    })
    .catch(error => {
      console.error('Erro ao salvar no Firebase:', error);
      mostrarAlerta('Ocorreu um erro ao salvar os dados. Tente novamente mais tarde.', 'danger');
    });
}

function getActivationCode() {
  const vipData = JSON.parse(localStorage.getItem('vipData'));
  return vipData ? vipData.activationCode : null;
}
