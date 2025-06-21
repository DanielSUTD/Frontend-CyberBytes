document.addEventListener("DOMContentLoaded", () => {

    // Mapeamento dos IDs HTML para os campos do DTO da API
    const ELEMENT_MAPPINGS = {
        'titulo': 'titulo1',
        'introducao': 'conteudo1', 
        'subtitulo': 'titulo2',
        'conteudo': 'conteudo2',
        'conclusao': 'conteudo3' 
    };

    //Preencher um elemento com dados, se o elemento existir
    const fillElement = (elementId, dataValue, isHtml = false) => {
        const element = document.getElementById(elementId);
        if (element) {
            if (isHtml) {
                element.innerHTML = dataValue || '';
            } else {
                element.textContent = dataValue || '';
            }
        } else {
            console.warn(`Elemento com ID '${elementId}' não encontrado no DOM.`);
        }
    };

    //Pesquisa
    const setupSearchButton = () => {
        const btnSearch = document.getElementById("btn-search");
        if (btnSearch) {
            btnSearch.addEventListener("click", () => {
                const searchContainer = document.getElementById("search-container");
                const searchInput = searchContainer ? searchContainer.querySelector("input") : null;

                if (searchContainer && searchInput) {
                    if (!searchContainer.classList.contains("active")) {
                        searchContainer.classList.add("active");
                        searchInput.focus();
                    } else {
                        if (searchInput.value.trim() !== "") {
                            console.log("Pesquisando por:", searchInput.value);
                            // TODO: Adicionar lógica para buscar e redirecionar/mostrar resultados
                        } else {
                            searchContainer.classList.remove("active");
                        }
                    }
                } else {
                    console.warn("Elementos de busca (btn-search, search-container, input) não encontrados.");
                }
            });
        }
    };

    //Exibir mensagens de erro na página de conteúdo
    const displayPageError = (messageTitle, messageContent) => {
        fillElement('titulo', messageTitle);
        fillElement('introducao', messageContent);
        fillElement('subtitulo', '');
        fillElement('conteudo', '');
        fillElement('conclusao', '');
        document.title = 'CyberBytes - Erro';
    };

    //Carregar e exibir o conteúdo da página principal
    const loadMainPageContent = async (titulo) => {
        try {
            const API_URL_CONTENT = `http://localhost:8080/pagina/titulo?titulo=${encodeURIComponent(titulo)}`;
            const response = await fetch(API_URL_CONTENT);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Página não encontrada.');
                }
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }

            const data = await response.json();

            fillElement('titulo', data.titulo1 ? `<b>${data.titulo1}</b>` : '', true);
            fillElement('introducao', data.conteudo1);
            fillElement('subtitulo', data.titulo2 ? `<b>${data.titulo2}</b>` : '', true);
            fillElement('conteudo', data.conteudo2);
            fillElement('conclusao', data.conteudo3); 
            document.title = data.titulo1 ? `CyberBytes - ${data.titulo1}` : 'CyberBytes - Conteúdo';

        } catch (error) {
            console.error('Erro ao buscar o conteúdo da página:', error);
            displayPageError('Erro ao carregar o conteúdo', 'Não foi possível encontrar a página solicitada ou ocorreu um erro no servidor.');
        }
    };

    //Configurar Pesquisa
    setupSearchButton();

    //Parâmetros da página
    const params = new URLSearchParams(window.location.search);
    const tituloParam = params.get('titulo');

    if (tituloParam) {
        // Carrega o conteúdo da página principal
        loadMainPageContent(tituloParam);
    } else {
        // Caso não haja título na URL
        displayPageError('Título da página não especificado', 'Por favor, selecione um tópico na página inicial.');
    }
});