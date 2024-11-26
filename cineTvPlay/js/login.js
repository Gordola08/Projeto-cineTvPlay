document.addEventListener('DOMContentLoaded', function () {
    const loadingContent = document.getElementById('loading-content');
    const mainContent = document.getElementById('main-content');
    const loginForm = document.getElementById('login-form');
    const btnLogin = document.getElementById('btn-login');

    // Simulação de carregamento
    setTimeout(function () {
        loadingContent.style.display = 'none';
        mainContent.style.display = 'block';
    }, 2000);

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const emailValue = document.getElementById('email').value.trim();
        const senhaValue = document.getElementById('senha').value.trim();

        // Verifica campos vazios
        if (!emailValue || !senhaValue) {
            showAlert('Por favor, preencha todos os campos.', 'danger');
            return;
        }

        // Exibe o spinner no botão de login
        const spinner = document.createElement('div');
        spinner.classList.add('spinner-border', 'text-danger');
        spinner.setAttribute('role', 'status');
        const spinnerText = document.createElement('span');
        spinnerText.classList.add('visually-hidden');
        spinnerText.textContent = 'Loading...';
        spinner.appendChild(spinnerText);
        btnLogin.innerHTML = '';
        btnLogin.appendChild(spinner);

        // Solicitação ao Firebase
        fetch('https://cinetvplay3-default-rtdb.firebaseio.com/usuario.json')
            .then(response => {
                if (!response.ok) throw new Error('Erro na solicitação.');
                return response.json();
            })
            .then(data => {
                let userExists = false;

                for (const key in data) {
                    if (data[key].email === emailValue && data[key].senha === senhaValue) {
                        userExists = true;

                        // Armazena detalhes do usuário no localStorage
                        localStorage.setItem('usuario_logado', JSON.stringify({ user: data[key], key: key }));

                        // Exibe mensagem de sucesso
                        showAlert('Login bem-sucedido!', 'success');

                        // Redireciona para a página principal
                        setTimeout(() => {
                            window.location.href = 'cinetv/index.html';
                        }, 2000);
                        return;
                    }
                }

                // Usuário não encontrado
                if (!userExists) {
                    showAlert('Credenciais de login inválidas. Tente novamente.', 'danger');
                }
                btnLogin.innerHTML = 'Login';
            })
            .catch(error => {
                console.error('Erro na solicitação:', error);
                showAlert('Ocorreu um erro ao processar a solicitação. Tente novamente mais tarde.', 'danger');
                btnLogin.innerHTML = 'Login';
            });
    });

    // Função para exibir alertas
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.classList.add('alert', `alert-${type}`);
        alertDiv.setAttribute('role', 'alert');
        alertDiv.textContent = message;

        document.body.appendChild(alertDiv);

        // Remove o alerta automaticamente após 3 segundos
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }
});
document.addEventListener('DOMContentLoaded', function () {
    const loadingContent = document.getElementById('loading-content');
    const mainContent = document.getElementById('main-content');

    // Simulação de carregamento
    setTimeout(function () {
        loadingContent.style.display = 'none'; // Esconde o conteúdo de carregamento
        mainContent.style.display = 'block'; // Mostra o conteúdo principal
        mainContent.style.opacity = '1'; // Garante que o conteúdo principal seja visível
    }, 2000);
});
