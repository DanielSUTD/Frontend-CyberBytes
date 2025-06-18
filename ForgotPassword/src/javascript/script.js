/* Mostrar senha */
const forgotInputField = document.getElementById('forgotPassword');
const forgotInputIcon = document.getElementById('forgot-pass-icon');

/* Mostrar senha no Cadastrar */
function myForgotPassword(){
    if(forgotInputField.type === "password"){
        forgotInputField.type = "text";
        forgotInputIcon.name = "eye-off-outline";
        forgotInputIcon.style.cursor = "pointer";
    }else{
        forgotInputField.type = "password";
        forgotInputIcon.name = "eye-outline";
        forgotInputIcon.style.cursor = "pointer";
    }
}

/* Mudar o ícone quando o usuário digitar a senha */
function changeIcon(value){
    if(value.length > 0){
        if (forgotInputField.type === "password") { 
            forgotInputIcon.name = "eye-outline";
        }
    }else{
        forgotInputIcon.name = "lock-closed-outline"
    }
}

/*Parte para o controle do formulário multi-setp*/
let currentstep = 1; // Inicia na primeira etapa

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
    document.getElementById('btn-previous').disabled = step === 1; // Desativa o botão "Voltar" na primeira etapa
    document.getElementById('btn-next').innerText = step === 3 ? 'Enviar' : 'Próximo'; // Muda o texto para "Enviar" na última etapa (agora a 3)

    // Ajusta o ícone da senha na etapa 3 caso o campo já esteja preenchido
    if (step === 3 && forgotInputField.value.length > 0) {
        forgotInputIcon.name = "eye-outline";
    } else if (step === 3 && forgotInputField.value.length === 0) {
        forgotInputIcon.name = "lock-closed-outline";
    }
}


/**
 * Função que valida os campos obrigatórios da etapa atual.
 * Retorna `true` se todos os campos da etapa estiverem preenchidos corretamente.
 */
function validateStep(step) {
    const stepElement = document.getElementById(`step${step}`);
    const inputs = stepElement.querySelectorAll('input[required]'); // Apenas inputs que são 'required'

    for (const input of inputs) {
        if (!input.checkValidity()) {
            alert(`Preencha o campo: ${input.placeholder || input.labels[0]?.textContent || input.id}`);
            input.focus(); // Foca no campo inválido para melhorar a UX
            return false;
        }
    }
    return true;
}

/**
 * Função que avança para a próxima etapa.
 * Valida os campos antes de permitir a navegação.
 */
async function nextStep() {
    if (!validateStep(currentstep)) return; // Se a validação falhar, interrompe a execução

    // Lógica para enviar o e-mail na primeira etapa
    if (currentstep === 1) {
        const email = document.getElementById('email').value;
        console.log(`Enviando código para: ${email}`);
        //Endpoint enviarCodigo

        
        currentstep++; // Avança para a etapa do código
        showstep(currentstep);
        return; // Interrompe para não avançar mais uma etapa imediatamente
    }

    // Lógica para verificar o código na segunda etapa
    if (currentstep === 2) {
        const email = document.getElementById('email').value;
        const code = document.getElementById('code').value;
        console.log(`Verificando código ${code} para o e-mail: ${email}`);
        //Endpoint verificar Codigo

        
    }

    // Lógica para mudar a senha na terceira e última etapa
    if (currentstep === 3) {
        const email = document.getElementById('email').value;
        const newPassword = document.getElementById('forgotPassword').value;
        console.log(`Mudando senha para o e-mail: ${email} com a nova senha: ${newPassword}`);
        //Endpoint changePassword

        alert("Senha redefinida com sucesso!");
        window.location.href = "/LoginRegister/index.html";
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

// Inicializa o formulário mostrando a primeira etapa ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    showstep(currentstep);
});

// Torna as funções acessíveis no escopo global (necessário para os botões)
window.nextStep = nextStep;
window.prevStep = prevStep;
window.myForgotPassword = myForgotPassword; // Garante que a função está no escopo global
window.changeIcon = changeIcon; // Garante que a função está no escopo global