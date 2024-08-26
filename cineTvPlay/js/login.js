document.addEventListener('DOMContentLoaded', function () {
    const loadingContent = document.getElementById('loading-content');
    const mainContent = document.getElementById('main-content');

    // Simulação de carregamento
    setTimeout(function () {
        loadingContent.style.display = 'none';
        mainContent.style.display = 'block';
    }, 2000);

    const loginForm = document.getElementById('login-form');
    const btnLogin = document.getElementById('btn-login');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const emailValue = document.getElementById('email').value;
        const senhaValue = document.getElementById('senha').value;

        fetch('https://cinetvplay3-default-rtdb.firebaseio.com/usuario.json')
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
                        // Armazena os detalhes do usuário e a chave no localStorage
                        localStorage.setItem('usuario_logado', JSON.stringify({ user: data[key], key: key }));
                        // Exibe mensagem de sucesso
                        const successAlert = document.createElement('div');
                        successAlert.classList.add('alert', 'alert-success');
                        successAlert.setAttribute('role', 'alert');
                        successAlert.textContent = 'Login bem-sucedido!';
                        document.body.appendChild(successAlert);
                        // Redireciona para a página após o login
                        setTimeout(function () {
                            window.location.href = 'cinetv/index.html';
                        }, 2000);
                        return; // Sai do loop assim que encontrar o usuário válido
                    }
                }

                // Se o usuário não existir, exibe mensagem de erro
                if (!userExists) {
                    // Exibe mensagem de erro
                    const errorAlert = document.createElement('div');
                    errorAlert.classList.add('alert', 'alert-danger');
                    errorAlert.setAttribute('role', 'alert');
                    errorAlert.textContent = 'Credenciais de login inválidas. Tente novamente.';
                    document.body.appendChild(errorAlert);
                }

                // Remove o spinner após o processamento
                btnLogin.innerHTML = 'Login';
            })
            .catch(error => {
                console.error('Erro na solicitação:', error);
                // Exibe mensagem de erro genérica
                const genericErrorAlert = document.createElement('div');
                genericErrorAlert.classList.add('alert', 'alert-danger');
                genericErrorAlert.setAttribute('role', 'alert');
                genericErrorAlert.textContent = 'Ocorreu um erro ao processar a solicitação. Por favor, tente novamente mais tarde.';
                document.body.appendChild(genericErrorAlert);

                // Remove o spinner após o erro
                btnLogin.innerHTML = 'Login';
            });

        // Exibe o spinner de carregamento no botão de login
        const spinner = document.createElement('div');
        spinner.classList.add('spinner-border', 'text-danger');
        spinner.setAttribute('role', 'status');
        const spinnerText = document.createElement('span');
        spinnerText.classList.add('visually-hidden');
        spinnerText.textContent = 'Loading...';
        spinner.appendChild(spinnerText);
        btnLogin.innerHTML = '';
        btnLogin.appendChild(spinner);
    });
});
