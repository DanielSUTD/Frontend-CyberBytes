document.addEventListener('DOMContentLoaded', function () {
    const token = sessionStorage.getItem('token');
    const email = sessionStorage.getItem('email');
    
   
    if (!token || !email) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = '/LoginRegister/index.html';
        return;
    }

    
    function populateForm(user) {
        if (!user) return;
        document.getElementById('fullName').value = user.nome || ''; 
        document.getElementById('email').value = user.email || '';
        // Future implementations...
    }

    
    async function fetchApiData(url, token) {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                throw new Error('Sessão inválida ou expirada. Faça login novamente.');
            }
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        return response.json();
    }

    
    (async function loadProfilePage() {
        const apiUrl = `http://localhost:8080/user/email/${encodeURIComponent(email)}`;

        try {
            const user = await fetchApiData(apiUrl, token);
            populateForm(user);
        } catch (error) {
            console.error('Error loading profile:', error.message);
            sessionStorage.clear();
            alert(error.message);
            window.location.href = '/LoginRegister/index.html';
        }
    })();

    
    const cancelButton = document.getElementById('cancelButton');
    if (cancelButton) { 
        cancelButton.addEventListener('click', function() {
            window.location.href = '/Home/index.html'; 
        });
    }
});