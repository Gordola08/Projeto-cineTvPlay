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
                let userKey = null;

                for (const key in data) {
                    if (data[key].email === emailValue && data[key].senha === senhaValue) {
                        userExists = true;
                        userKey = key;
                        // Armazene os detalhes do usuário e a chave no localStorage
                        localStorage.setItem('usuario_logado', JSON.stringify({ user: data[key], key: key }));
                        // Exibir mensagem de sucesso
                        const successAlert = document.createElement('div');
                        successAlert.classList.add('alert', 'alert-success');
                        successAlert.setAttribute('role', 'alert');
                        successAlert.textContent = 'Login bem-sucedido!';
                        document.body.appendChild(successAlert);
                        // Redirecionar para a página após o login
                        setTimeout(function () {
                            window.location.href = 'cinetv/index.html';
                        }, 2000);
                        break;
                    }
                }
                // Se o usuário não existir, exibir mensagem de erro
                if (!userExists) {
                    // Exibir mensagem de erro
                    const errorAlert = document.createElement('div');
                    errorAlert.classList.add('alert', 'alert-danger');
                    errorAlert.setAttribute('role', 'alert');
                    errorAlert.textContent = 'Credenciais de login inválidas. Tente novamente.';
                    document.body.appendChild(errorAlert);
                }
            })
            .catch(error => {
                console.error('Erro na solicitação:', error);
                // Exibir mensagem de erro genérica
                const genericErrorAlert = document.createElement('div');
                genericErrorAlert.classList.add('alert', 'alert-danger');
                genericErrorAlert.setAttribute('role', 'alert');
                genericErrorAlert.textContent = 'Ocorreu um erro ao processar a solicitação. Por favor, tente novamente mais tarde.';
                document.body.appendChild(genericErrorAlert);
            });
    });
});
