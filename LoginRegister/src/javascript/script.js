const loginBtn = document.querySelector("#login");
const registerBtn = document.querySelector("#register");
const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");


/* Mostrar o formulário de entrar */
loginBtn.addEventListener('click', () => {
    loginBtn.style.backgroundColor = "#6D9886";
    registerBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";

    loginForm.style.left = "50%";
    registerForm.style.left = "-50%";

    loginForm.style.opacity = 1;
    registerForm.style.opacity = 0;
})

/* Mostrar o formulário de cadastrar */
registerBtn.addEventListener('click', () => {
    loginBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    registerBtn.style.backgroundColor = "#6D9886";

    loginForm.style.left = "150%";
    registerForm.style.left = "50%";

    loginForm.style.opacity = 0;
    registerForm.style.opacity = 1;
})

/* Mostrar senha */
const logInputField = document.getElementById('logPassword');
const logInputIcon = document.getElementById('log-pass-icon');

const regInputField = document.getElementById('regPassword');
const regInputIcon = document.getElementById('reg-pass-icon');

/* Mostrar senha no Entrar */
function myLogPassword() {
    if (logInputField.type === "password") {
        logInputField.type = "text";

        logInputIcon.name = "eye-off-outline";
        logInputIcone.style.cursor = "pointer";
    } else {
        logInputField.type = "password";

        logInputIcon.name = "eye-outline";
        logInputIcone.style.cursor = "pointer";
    }
}

/* Mostrar senha no Cadastrar */
function myRegPassword() {
    if (regInputField.type === "password") {
        regInputField.type = "text";

        regInputIcon.name = "eye-off-outline";
        regInputIcon.style.cursor = "pointer";
    } else {
        regInputField.type = "password";

        regInputIcon.name = "eye-outline";
        regInputIcon.style.cursor = "pointer";
    }
}


/* Mudar o ícone quando o usuário digitar a senha */
function changeIcon(value) {
    if (value.length > 0) {
        logInputIcon.name = "eye-outline";
        regInputIcon.name = "eye-outline";
    } else {
        logInputIcon.name = "lock-closed-outline"
        regInputIcon.name = "lock-closed-outline"
    }
}


/*Parte para o controle do formulário multi-setp*/
// Variável que controla qual etapa está ativa
let currentstep = 1;

/**
 * Função que exibe a etapa atual do formulário.
 * Ela altera a visibilidade dos campos e atualiza os indicadores de etapa.
 */
function showstep(step) {
    // Remove a classe 'active' de todas as etapas (todas ficam escondidas)
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));

    // Adiciona a classe 'active' apenas na etapa atual
    document.getElementById(`step${step}`).classList.add('active');

    // Atualiza os botões de navegação
    document.getElementById('btn-previous').disabled = step === 1; // Desativa o botão "Anterior" na primeira etapa
    document.getElementById('btn-next').innerText = step === 2 ? 'Enviar' : 'Próximo'; // Muda o texto para "Enviar" na última etapa
}

/**
 * Função que valida os campos obrigatórios da etapa atual.
 * Retorna `true` se todos os campos da etapa estiverem preenchidos corretamente.
 */
function validateStep(step) {
    // Seleciona a etapa atual
    const stepElement = document.getElementById(`step${step}`);
    // Seleciona todos os campos de entrada (inputs) dessa etapa
    const inputs = stepElement.querySelectorAll('input');

    // Verifica se cada campo é válido
    for (const input of inputs) {
        if (!input.checkValidity()) { // Se o campo for inválido
            alert(`Preencha o campo: ${input.placeholder}`); // Mostra uma mensagem de alerta
            return false; // Retorna falso para bloquear o avanço
        }
    }
    return true; // Todos os campos estão válidos
}

/**
 * Função que avança para a próxima etapa.
 * Valida os campos antes de permitir a navegação.
 */
async function nextStep() {
    if (!validateStep(currentstep)) return; // Se a validação falhar, interrompe a execução

    if (currentstep < 2) {
        currentstep++; // Avança para a próxima etapa
        showstep(currentstep); // Mostra a nova etapa

        const email = document.getElementById('email').value.trim().replace(/^"|"$/g, '');
        await genCode(email); // Gera código quando o usuário avança para a segunda etapa
    } else {
        //Simula evento de envio
        console.log("Enviado com sucesso");
        alert("Enviado com sucesso");
        handleRegistrationFlow(); // Chamando apenas no submit
    }
}

/**
 * Função que volta para a etapa anterior.
 */
function prevStep() {
    if (currentstep > 1) {
        currentstep--; // Volta para a etapa anterior
        showstep(currentstep); // Mostra a etapa anterior
    }
}

// Torna as funções acessíveis no escopo global (necessário para os botões)
window.nextStep = nextStep;
window.prevStep = prevStep;


// Função FETCH (Gerar Código)
    async function genCode(email) {
    try {
        const response = await fetch("http://localhost:8080/user/codigo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(email) 
        });

        if (response.ok) {
            console.log("Código enviado para o email:", email);
        } else {
            throw new Error("Erro ao gerar o código!");
        }
    } catch (error) {
        console.error("Erro:", error);
    }
}

/**
 * Função FETCH (Tentativa do Usuário)
 */
async function userAttempt(codeInserted) {
    try {
        //Recupera os valores do formulário
        const name = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;


        // Criar objeto FormData para envio multipart
        const formData = new FormData();

        // Criar objeto user
        const user = {
            nome: name,
            email: email,
            senha: password
        };

        // Adiciona o JSON como Blob ao FormData
        formData.append("data", new Blob([JSON.stringify(user)], { type: "application/json" }));

        // Adiciona o parâmetro tentativa (certifique-se de que a variável codeInserted está definida)
        formData.append("tentativa", codeInserted);

        // Envia para o backend
        const response = await fetch("http://localhost:8080/user", {
            method: "POST",
            body: formData // Não defina manualmente o header 'Content-Type'
        });

        console.log("Status da resposta:", response.status);

        if (response.ok) {
            console.log('Código validado com sucesso!');
        } else if (response.status === 400) {
            console.warn(`Código inválido! Tente novamente - Status: ${response.status} - Detalhes: ${response.text}`);
        } else {
            const errorText = await response.text(); // Captura o erro detalhado da API
            console.error('Erro na tentativa de validação:', errorText);
            throw new Error(`Erro na tentativa de validação - Status: ${response.status}- Body: ${response.text} - Detalhes: ${errorText}`);
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

/**
 * Controle de Fluxo
 */
async function handleRegistrationFlow() {
    const codeInserted = document.getElementById('codigo').value;
    await userAttempt(codeInserted);
}


/**
 * LOGIN 
 */
async function login() {
    try {
        const email = document.getElementById("emailLogin").value;
        const senha = document.getElementById("logPassword").value;

        const user = { email, senha };

        const response = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        console.log("Status da resposta:", response.status);

        if (response.ok) {
            const data = await response.json();

            // Salva o token e o email no sessionStorage
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("email", email);
            
            alert("Login realizado com sucesso!");
            window.location.href = "../Home/index.html";
        } else {
            const errorText = await response.text();
            console.error("Erro na tentativa de validação:", errorText);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
    }
}
