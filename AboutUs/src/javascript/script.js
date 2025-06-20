// Função para habilitar a Barra de Pesquisa na tela inicial
document.getElementById("btn-search").addEventListener("click", function () {
    const searchContainer = document.getElementById("search-container");
    const searchInput = searchContainer.querySelector("input");

    if (!searchContainer.classList.contains("active")) {
        searchContainer.classList.add("active");
        searchInput.focus();
    } else {
        if (searchInput.value.trim() !== "") {
            //TESTE
            console.log("Pesquisando por:", searchInput.value);
        } else {
            searchContainer.classList.remove("active");
        }
    }
});