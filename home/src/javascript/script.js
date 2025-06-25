document.addEventListener("DOMContentLoaded", function () {
    // Referências aos elementos do DOM
    const searchContainer = document.getElementById("search-container");
    const searchInput = searchContainer.querySelector("input");
    const searchButton = document.getElementById("btn-search");

    /**
     * Cria e adiciona o contêiner para exibir os resultados da pesquisa dinamicamente.
     * Este elemento será preenchido e mostrado/escondido pelo JavaScript.
     */
    const searchResultsDiv = document.createElement('div');
    searchResultsDiv.id = 'search-results';
    searchContainer.appendChild(searchResultsDiv);

    /**
     * Realiza a pesquisa de páginas na API de backend e exibe os resultados.
     * @param {string} query - O termo de pesquisa digitado pelo usuário.
     */
    const performSearch = async (query) => {
        // Esconde os resultados se a consulta for muito curta (menos de 2 caracteres) ou vazia.
        if (query.length < 2) {
            searchResultsDiv.innerHTML = ''; // Limpa resultados anteriores
            searchResultsDiv.style.display = 'none'; // Esconde o contêiner de resultados
            return;
        }

        try {
            // Faz a requisição à API Spring Boot para buscar páginas com base na query.
            // A URL deve apontar para o seu endpoint de pesquisa de páginas.
            const response = await fetch(`http://localhost:8080/pagina/pesquisar?query=${encodeURIComponent(query)}`);

            // Verifica se a resposta da requisição foi bem-sucedida (status 2xx).
            if (!response.ok) {
                // Lança um erro se o status HTTP não for OK, incluindo o status e o texto.
                throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
            }

            // Converte a resposta JSON em um array de objetos Page (PaginaResponseDto).
            const pages = await response.json();

            // Limpa qualquer resultado de pesquisa anterior no contêiner.
            searchResultsDiv.innerHTML = '';

            /**
             * Verifica se há páginas retornadas para exibir os resultados.
             */
            if (pages.length > 0) {
                // Itera sobre cada página retornada e cria um link para ela.
                pages.forEach(page => {
                    const resultItem = document.createElement('a');
                    // Define o link do item de resultado para a página de detalhes,
                    // passando o titulo1 como parâmetro na URL.
                    resultItem.href = `/ContentPage/index.html?titulo=${encodeURIComponent(page.titulo1)}`;
                    // Define o texto visível do item de resultado como o titulo1 da página.
                    resultItem.textContent = page.titulo1;
                    // Adiciona uma classe CSS para estilização dos itens de resultado.
                    resultItem.classList.add('search-result-item');

                    // Adiciona um ouvinte de evento de clique para cada item de resultado.
                    resultItem.addEventListener('click', (event) => {
                        event.preventDefault(); // Previne o comportamento padrão do link (navegação direta)
                        window.location.href = resultItem.href; // Redireciona manualmente para a URL construída
                    });
                    // Adiciona o item de resultado ao contêiner de resultados.
                    searchResultsDiv.appendChild(resultItem);
                });
                // Torna o contêiner de resultados visível.
                searchResultsDiv.style.display = 'block';
            } else {
                // Se não houver resultados, exibe uma mensagem indicando isso.
                searchResultsDiv.innerHTML = '<p class="no-results-message">Sem resultados encontrados.</p>';
                searchResultsDiv.style.display = 'block'; // Mostra a mensagem
            }

        } catch (error) {
            // Captura e loga quaisquer erros que ocorram durante a pesquisa (ex: falha de rede, erro na API).
            console.error('Erro na pesquisa:', error);
            // Exibe uma mensagem de erro amigável ao usuário no contêiner de resultados.
            searchResultsDiv.innerHTML = '<p class="error-message">Ocorreu um erro ao buscar os resultados. Tente novamente.</p>';
            searchResultsDiv.style.display = 'block'; // Mostra a mensagem de erro
        }
    };

    /**
     * Configura o comportamento do botão de pesquisa, alternando a visibilidade do campo
     * de busca e, opcionalmente, realizando uma pesquisa final.
     */
    searchButton.addEventListener("click", function () {
        // Se o contêiner de pesquisa não estiver "ativo" (visível), o ativa e foca no input.
        if (!searchContainer.classList.contains("active")) {
            searchContainer.classList.add("active");
            searchInput.focus();
        } else {
            // Se o contêiner de pesquisa já estiver "ativo".
            if (searchInput.value.trim() !== "") {
                // Se há texto no input, loga a pesquisa (pode ser usado para redirecionar para uma página de resultados completa).
                console.log("Pesquisa final ativada por clique:", searchInput.value);
                // Exemplo de redirecionamento para uma página de resultados completa:
                // window.location.href = `/search-results.html?query=${encodeURIComponent(searchInput.value.trim())}`;
            } else {
                // Se o input estiver vazio, desativa o contêiner de pesquisa e esconde os resultados.
                searchContainer.classList.remove("active");
                searchResultsDiv.style.display = 'none';
            }
        }
    });

    /**
     * Adiciona um ouvinte de evento 'input' ao campo de pesquisa.
     * Dispara a função performSearch a cada digitação do usuário.
     */
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim(); // Obtém o valor atual do input, removendo espaços em branco extras.
        performSearch(query); // Chama a função de pesquisa com a query atual.
    });

    /**
     * Esconde os resultados da pesquisa quando o campo de pesquisa perde o foco (blur).
     * Um pequeno atraso é usado para permitir que cliques em itens de resultado sejam registrados.
     */
    searchInput.addEventListener('blur', (event) => {
        setTimeout(() => {
            // Verifica se o foco não se moveu para dentro do contêiner de pesquisa ou dos próprios resultados.
            if (!searchContainer.contains(document.activeElement) && !searchResultsDiv.contains(document.activeElement)) {
                searchResultsDiv.style.display = 'none'; // Esconde os resultados.
            }
        }, 100); // Atraso de 100 milissegundos.
    });

    /**
     * Esconde os resultados da pesquisa se o usuário clicar em qualquer lugar fora do contêiner de pesquisa.
     */
    document.addEventListener('click', (event) => {
        // Verifica se o clique não ocorreu dentro do searchContainer ou no searchButton.
        if (!searchContainer.contains(event.target) && !searchButton.contains(event.target)) {
            searchResultsDiv.style.display = 'none'; // Esconde os resultados.
            // Opcional: Para fechar o contêiner de pesquisa ao clicar fora, descomente a linha abaixo.
            // searchContainer.classList.remove("active");
        }
    });
});