var usuarioInput = document.getElementById('usuario');
var emailInput = document.getElementById('email');
var senhaInput = document.getElementById('senha');
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
                // Salvar dados no banco de dados local
                salvarNoBancoLocal({
                    usuario: usuarioInput.value,
                    email: emailInput.value,
                    senha: senhaInput.value
                });
                // Enviar dados para o servidor
                enviar();
            }
        });
}

function salvarNoBancoLocal(dados) {
    var dadosLocais = localStorage.getItem('dados_registro');
    var listaDados = dadosLocais ? JSON.parse(dadosLocais) : [];
    listaDados.push(dados);
    localStorage.setItem('dados_registro', JSON.stringify(listaDados));
}

function enviar() {
    fetch('https://cinetv-play-default-rtdb.firebaseio.com/usuario.json', {
        method: 'POST',
        body: JSON.stringify({
            usuario: usuarioInput.value,
            email: emailInput.value,
            senha: senhaInput.value,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then(response => response.json())
        .then(json => {
            console.log(json);
            setTimeout(function () {
                window.location.href = '../index.html';
            }, 2000);
        });
}
