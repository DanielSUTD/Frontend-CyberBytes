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
        forgotInputIcon.name = "eye-outline";
    }else{
        forgotInputIcon.name = "lock-closed-outline"
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
        document.getElementById('btn-next').innerText = step === 2 ? 'Enviar' : 'Próximo'; // Muda o texto para "Submit" na última etapa
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

            //Restrições
        } else {
            //Lógica de mudança de senha
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