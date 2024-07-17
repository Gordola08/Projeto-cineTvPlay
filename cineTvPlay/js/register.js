var usuarioInput = document.getElementById('usuario');
var emailInput = document.getElementById('email');
var senhaInput = document.getElementById('senha');
var avatarInput = document.getElementById('avatar');
var btn = document.getElementById('btn');

btn.addEventListener('click', function(e) {
    e.preventDefault();
    verificarCamposEVoltar();
});

function verificarCamposEVoltar() {
    // Resetar qualquer estilo de campo inválido
    usuarioInput.classList.remove('campo-invalido');
    emailInput.classList.remove('campo-invalido');
    senhaInput.classList.remove('campo-invalido');

    // Verificar se os campos obrigatórios estão preenchidos
    if (!usuarioInput.value.trim()) {
        alert('Por favor, preencha o campo Usuário.');
        usuarioInput.classList.add('campo-invalido');
        return;
    }

    if (!emailInput.value.trim()) {
        alert('Por favor, preencha o campo Email.');
        emailInput.classList.add('campo-invalido');
        return;
    }

    // Verificar o formato do email usando uma expressão regular simples
    var emailFormato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailFormato.test(emailInput.value.trim())) {
        alert('Por favor, insira um email válido.');
        emailInput.classList.add('campo-invalido');
        return;
    }

    if (!senhaInput.value.trim()) {
        alert('Por favor, preencha o campo Senha.');
        senhaInput.classList.add('campo-invalido');
        return;
    }

    verificarUsuarioEmail();
}

function verificarUsuarioEmail() {
    fetch('https://cinetvplay-eba33-default-rtdb.firebaseio.com/usuario.json')
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
                alert('Este usuário já existe. Escolha outro nome de usuário.');
            } else if (emailExistente) {
                alert('Este email já está sendo usado. Escolha outro email.');
            } else {
                cadastrarNovoUsuario();
            }
        })
        .catch(error => {
            console.error('Erro ao verificar usuários no Firebase:', error);
            alert('Ocorreu um erro ao verificar os usuários. Tente novamente mais tarde.');
        });
}

function cadastrarNovoUsuario() {
    // Ler o arquivo de imagem selecionado pelo usuário
    var file = avatarInput.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var dados = {
                usuario: usuarioInput.value.trim(),
                email: emailInput.value.trim(),
                senha: senhaInput.value.trim(),
                avatar: e.target.result // Base64 da imagem selecionada
            };
            salvarNoFirebase(dados);
        }
        reader.readAsDataURL(file);
    } else {
        var dados = {
            usuario: usuarioInput.value.trim(),
            email: emailInput.value.trim(),
            senha: senhaInput.value.trim()
        };
        salvarNoFirebase(dados);
    }
}

function salvarNoFirebase(dados) {
    fetch('https://cinetvplay-eba33-default-rtdb.firebaseio.com/usuario.json', {
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
        alert('Registro realizado com sucesso!');
        setTimeout(function () {
            window.location.href = '../index.html';
        }, 2000);
    })
    .catch(error => {
        console.error('Erro ao salvar no Firebase:', error);
        alert('Ocorreu um erro ao salvar os dados. Tente novamente mais tarde.');
    });
}
