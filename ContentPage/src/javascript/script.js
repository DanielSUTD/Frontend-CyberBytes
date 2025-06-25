document.addEventListener("DOMContentLoaded", () => {

    // Mapeamento dos IDs HTML para os campos do DTO da API
    const ELEMENT_MAPPINGS = {
        'titulo': 'titulo1',
        'introducao': 'conteudo1',
        'subtitulo': 'titulo2',
        'conteudo': 'conteudo2',
        'conclusao': 'conteudo3'
    };

    // Preencher um elemento com dados, se o elemento existir
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

    // Exibir mensagens de erro na página de conteúdo
    const displayPageError = (messageTitle, messageContent) => {
        fillElement('titulo', messageTitle);
        fillElement('introducao', messageContent);
        fillElement('subtitulo', '');
        fillElement('conteudo', '');
        fillElement('conclusao', '');
        document.title = 'CyberBytes - Erro';
    };

    // Carregar e exibir o conteúdo da página principal
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

    // Lógica de Pesquisa
    const searchContainer = document.getElementById("search-container");
    const searchButton = document.getElementById("btn-search");
    let searchInput; 
    let searchResultsDiv;

    if (searchContainer) {
        searchInput = searchContainer.querySelector("input");
        searchResultsDiv = document.createElement('div');
        searchResultsDiv.id = 'search-results';
        searchContainer.appendChild(searchResultsDiv);
    } else {
        console.warn("Elemento 'search-container' não encontrado no DOM. A funcionalidade de pesquisa não será inicializada.");
        return; 
    }


    /**
     * Realiza a pesquisa de páginas na API de backend e exibe os resultados.
     * @param {string} query - O termo de pesquisa digitado pelo usuário.
     */
    const performSearch = async (query) => {
        if (!searchResultsDiv || !searchInput) return; // Garante que os elementos existem

        if (query.length < 2) {
            searchResultsDiv.innerHTML = '';
            searchResultsDiv.style.display = 'none';
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/pagina/pesquisar?query=${encodeURIComponent(query)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
            }

            const pages = await response.json();

            searchResultsDiv.innerHTML = '';

            if (pages.length > 0) {
                pages.forEach(page => {
                    const resultItem = document.createElement('a');
                    resultItem.href = `/ContentPage/index.html?titulo=${encodeURIComponent(page.titulo1)}`;
                    resultItem.textContent = page.titulo1;
                    resultItem.classList.add('search-result-item');

                    resultItem.addEventListener('click', (event) => {
                        event.preventDefault();
                        window.location.href = resultItem.href;
                    });
                    searchResultsDiv.appendChild(resultItem);
                });
                searchResultsDiv.style.display = 'block';
            } else {
                searchResultsDiv.innerHTML = '<p class="no-results-message">Sem resultados encontrados.</p>';
                searchResultsDiv.style.display = 'block';
            }

        } catch (error) {
            console.error('Erro na pesquisa:', error);
            searchResultsDiv.innerHTML = '<p class="error-message">Ocorreu um erro ao buscar os resultados. Tente novamente.</p>';
            searchResultsDiv.style.display = 'block';
        }
    };

    /**
     * Configura o comportamento do botão de pesquisa, alternando a visibilidade do campo
     * de busca e, opcionalmente, realizando uma pesquisa final.
     */
    if (searchButton && searchContainer && searchInput) { // Verifica se todos os elementos existem
        searchButton.addEventListener("click", function () {
            if (!searchContainer.classList.contains("active")) {
                searchContainer.classList.add("active");
                searchInput.focus();
            } else {
                if (searchInput.value.trim() !== "") {
                    console.log("Pesquisa final ativada por clique:", searchInput.value);
                    // Opcional: Redirecionar para uma página de resultados completa
                    // window.location.href = `/search-results.html?query=${encodeURIComponent(searchInput.value.trim())}`;
                } else {
                    searchContainer.classList.remove("active");
                    searchResultsDiv.style.display = 'none';
                }
            }
        });

        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim();
            performSearch(query);
        });

        searchInput.addEventListener('blur', (event) => {
            setTimeout(() => {
                if (!searchContainer.contains(document.activeElement) && !searchResultsDiv.contains(document.activeElement)) {
                    searchResultsDiv.style.display = 'none';
                }
            }, 100);
        });

        document.addEventListener('click', (event) => {
            if (!searchContainer.contains(event.target) && !searchButton.contains(event.target)) {
                searchResultsDiv.style.display = 'none';
                // Opcional: Para fechar o contêiner de pesquisa ao clicar fora
                // searchContainer.classList.remove("active");
            }
        });
    } else {
        console.warn("Um ou mais elementos de pesquisa (search-container, btn-search, input) não foram encontrados. A funcionalidade de pesquisa pode não funcionar.");
    }

    // --- Carregamento do Conteúdo da Página ---
    const params = new URLSearchParams(window.location.search);
    const tituloParam = params.get('titulo');

    if (tituloParam) {
        loadMainPageContent(tituloParam);
    } else {
        displayPageError('Título da página não especificado', 'Por favor, selecione um tópico na página inicial.');
    }
});