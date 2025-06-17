document.addEventListener('DOMContentLoaded', function () {

    const token = sessionStorage.getItem('token');
    const email = sessionStorage.getItem('email');
    let currentUserId = null;

    if (!token || !email) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = '/LoginRegister/index.html';
        return;
    }

    function populateForm(user) {
        if (!user) return;
        currentUserId = user.id;
        document.getElementById('fullName').value = user.nome || '';
        document.getElementById('email').value = user.email || '';
    }

    async function fetchApiData(url, method = 'GET', body = null) {
        const options = {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(url, options);
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                throw new Error('Sessão inválida ou expirada. Faça login novamente.');
            }
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || `Erro: ${response.statusText}`;
            throw new Error(errorMessage);
        }
        if (response.status === 204 || response.headers.get("content-length") === "0") {
            return null;
        }
        return response.json();
    }

    
    async function saveChanges() {
        if (!currentUserId) {
            alert('Não foi possível identificar o usuário para a atualização.');
            return;
        }

        const fullName = document.getElementById('fullName').value;
        const newEmail = document.getElementById('email').value;
        const newPassword = document.getElementById('newPassword').value;
        const repeatNewPassword = document.getElementById('repeatNewPassword').value;

        if (newPassword && newPassword !== repeatNewPassword) {
            alert('As novas senhas não coincidem!');
            return;
        }

        const payload = {
            nome: fullName,
            email: newEmail
        };

        if (newPassword) {
            payload.senha = newPassword;
        }

        const apiUrl = `http://localhost:8080/user/${currentUserId}`;

        try {
            await fetchApiData(apiUrl, 'PUT', payload);
            alert('Dados atualizados com sucesso!');
            document.getElementById('newPassword').value = '';
            document.getElementById('repeatNewPassword').value = '';
            document.getElementById('currentPassword').value = '';
        } catch (error) {
            console.error('Falha ao atualizar usuário:', error.message);
            alert(`Erro ao salvar: ${error.message}`);
        }
    }

    
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        saveButton.addEventListener('click', saveChanges);
    }

    
    const cancelButton = document.getElementById('cancelButton');
    if (cancelButton) {
        cancelButton.addEventListener('click', function () {
            window.location.href = '/Home/index.html';
        });
    }

    
    (async function loadProfilePage() {
        const getUrl = `http://localhost:8080/user/email/${encodeURIComponent(email)}`;
        try {
            const user = await fetchApiData(getUrl);
            populateForm(user);
        } catch (error) {
            console.error('Error loading profile:', error.message);
            sessionStorage.clear();
            alert(error.message);
            window.location.href = '/LoginRegister/index.html';
        }
    })();
});