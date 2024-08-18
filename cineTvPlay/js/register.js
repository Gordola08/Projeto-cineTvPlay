var usuarioInput = document.getElementById('usuario');
var emailInput = document.getElementById('email');
var senhaInput = document.getElementById('senha');
var avatarInput = document.getElementById('avatar');
var btn = document.getElementById('btn');
var alertContainer = document.getElementById('alert-container');

btn.addEventListener('click', function(e) {
    e.preventDefault();
    verificarCamposEVoltar();
});

function mostrarAlerta(mensagem, tipo) {
    var alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${mensagem}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    `;
    alertContainer.appendChild(alertDiv);

    setTimeout(function() {
        $(alertDiv).alert('close');
    }, 5000);
}

function verificarCamposEVoltar() {
    // Resetar qualquer estilo de campo inválido
    usuarioInput.classList.remove('campo-invalido');
    emailInput.classList.remove('campo-invalido');
    senhaInput.classList.remove('campo-invalido');
    avatarInput.classList.remove('campo-invalido');

    // Verificar se os campos obrigatórios estão preenchidos
    if (!usuarioInput.value.trim()) {
        mostrarAlerta('Por favor, preencha o campo Usuário.', 'danger');
        usuarioInput.classList.add('campo-invalido');
        return;
    }

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

    if (!avatarInput.files.length) {
        mostrarAlerta('Por favor, selecione uma foto de avatar.', 'danger');
        avatarInput.classList.add('campo-invalido');
        return;
    }

    verificarUsuarioEmail();
}

function verificarUsuarioEmail() {
    fetch('https://cinetvplay2-56923-default-rtdb.firebaseio.com/usuario.json')
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

            var usuarioExistente = Object.values(data).some(item => item.usuario === usuarioInput.value.trim());
            var emailExistente = Object.values(data).some(item => item.email === emailInput.value.trim());

            if (usuarioExistente) {
                mostrarAlerta('Este usuário já existe. Escolha outro nome de usuário.', 'warning');
            } else if (emailExistente) {
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
    // Ler o arquivo de imagem selecionado pelo usuário
    var file = avatarInput.files[0];
    var reader = file ? new FileReader() : null;

    if (reader) {
        reader.onload = function(e) {
            var dados = {
                usuario: usuarioInput.value.trim(),
                email: emailInput.value.trim(),
                senha: senhaInput.value.trim(),
                avatar: e.target.result, // Base64 da imagem selecionada
                activationCode: getActivationCode() // Adicionando o activationCode
            };
            salvarNoFirebase(dados);
        }
        reader.readAsDataURL(file);
    } else {
        var dados = {
            usuario: usuarioInput.value.trim(),
            email: emailInput.value.trim(),
            senha: senhaInput.value.trim(),
            activationCode: getActivationCode() // Adicionando o activationCode
        };
        salvarNoFirebase(dados);
    }
}

function salvarNoFirebase(dados) {
    fetch('https://cinetvplay2-56923-default-rtdb.firebaseio.com/usuario.json', {
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
