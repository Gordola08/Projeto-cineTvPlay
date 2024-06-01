var frm_register = document.getElementById('register-form');

frm_register.addEventListener('submit', function(e) {
    e.preventDefault();
    
    var usuario = document.getElementById('usuario').value;
    var email = document.getElementById('email').value;
    var senha = document.getElementById('senha').value;
    
    if (!usuario || !email || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Verificar se há dados salvos localmente
    var dadosLocais = localStorage.getItem('dados_registro');
    if (dadosLocais) {
        // Se houver dados salvos, atualize a lista
        var listaDados = JSON.parse(dadosLocais);
        listaDados.push({ usuario: usuario, email: email, senha: senha });
        localStorage.setItem('dados_registro', JSON.stringify(listaDados));
    } else {
        // Se não houver dados salvos, crie uma nova lista
        var novoDado = [{ usuario: usuario, email: email, senha: senha }];
        localStorage.setItem('dados_registro', JSON.stringify(novoDado));
    }

    // Limpar os campos após o envio
    document.getElementById('usuario').value = '';
    document.getElementById('email').value = '';
    document.getElementById('senha').value = '';

    alert('Seus dados foram salvos localmente. Eles serão enviados para o servidor mais tarde.');
    
    // Redirecionar para a página de login
    window.location.href = '../index.html.html';
});

// Função para enviar os dados salvos localmente para o servidor
function enviarDadosParaServidor() {
    var dadosLocais = localStorage.getItem('dados_registro');
    if (dadosLocais) {
        var listaDados = JSON.parse(dadosLocais);

        listaDados.forEach(function(dados) {
            fetch('https://cinetv-play-default-rtdb.firebaseio.com/usuario.json', {
                method: 'POST',
                body: JSON.stringify({
                    usuario: dados.usuario,
                    email: dados.email,
                    senha: dados.senha
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao enviar dados para o servidor');
                }
                return response.json();
            })
            .then(json => {
                console.log(json);
                // Remover dados enviados do armazenamento local
                listaDados = listaDados.filter(item => item !== dados);
                localStorage.setItem('dados_registro', JSON.stringify(listaDados));
            })
            .catch(error => {
                console.error('Erro ao enviar dados:', error);
            });
        });
    }
}

// Chamar a função para enviar dados para o servidor
enviarDadosParaServidor();
