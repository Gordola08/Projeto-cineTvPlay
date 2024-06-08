var usuarioInput = document.getElementById('usuario');
var emailInput = document.getElementById('email');
var senhaInput = document.getElementById('senha');
var avatarInput = document.getElementById('avatar');
var btn = document.getElementById('btn');

btn.addEventListener('click', function(e) {
    e.preventDefault();
    verificarUsuarioEmail();
});

function verificarUsuarioEmail() {
    fetch('https://cinetv-play-default-rtdb.firebaseio.com/usuario.json')
        .then(response => response.json())
        .then(data => {
            var usuarioExistente = Object.values(data).some(item => item.usuario === usuarioInput.value);
            var emailExistente = Object.values(data).some(item => item.email === emailInput.value);

            if (usuarioExistente) {
                alert('Este usuário já existe. Escolha outro nome de usuário.');
            } else if (emailExistente) {
                alert('Este email já está sendo usado. Escolha outro email.');
            } else {
                // Ler o arquivo de imagem selecionado pelo usuário
                var file = avatarInput.files[0];
                if (file) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var dados = {
                            usuario: usuarioInput.value,
                            email: emailInput.value,
                            senha: senhaInput.value,
                            avatar: e.target.result // Base64 da imagem selecionada
                        };
                        salvarNoFirebase(dados);
                    }
                    reader.readAsDataURL(file);
                } else {
                    var dados = {
                        usuario: usuarioInput.value,
                        email: emailInput.value,
                        senha: senhaInput.value
                    };
                    salvarNoFirebase(dados);
                }
            }
        });
}

function salvarNoFirebase(dados) {
    fetch('https://cinetv-play-default-rtdb.firebaseio.com/usuario.json', {
        method: 'POST',
        body: JSON.stringify(dados),
        headers: {
            'Content-type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(json => {
        console.log(json);
        setTimeout(function () {
            window.location.href = '../index.html';
        }, 2000);
    })
    .catch(error => {
        console.error('Erro ao salvar no Firebase:', error);
    });
}
