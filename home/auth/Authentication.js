async function obterDadosUsuario(token, email) {
    try {
        const response = await fetch(`http://localhost:8080/user/email/${encodeURIComponent(email)}`, {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("Erro ao buscar os dados do usuário.");
        return await response.json();
    } catch (error) {
        console.error(error);
        sessionStorage.clear();
        return null;
    }
}

async function verificarAutenticacao() {
    const token = sessionStorage.getItem("token");
    const email = sessionStorage.getItem("email");

    const loginRegister = document.getElementById("login-register");
    const userLogged = document.getElementById("user-logged");

    if (token && email) {
        const user = await obterDadosUsuario(token, email);
        if (user) {
            loginRegister.style.display = "none";
            userLogged.style.display = "block";
        } else {
            loginRegister.style.display = "block";
            userLogged.style.display = "none";
        }
    } else {
        loginRegister.style.display = "block";
        userLogged.style.display = "none";
    }
}

function toggleUserMenu() {
  const menu = document.getElementById("user-dropdown");
  menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

document.addEventListener("click", function(event) {
  const userIcon = document.querySelector(".user-icon");
  const dropdown = document.getElementById("user-dropdown");

  if (!userIcon.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.style.display = "none";
  }
});

function logout() {
    sessionStorage.clear();
    window.location.reload();
}

document.addEventListener("DOMContentLoaded", verificarAutenticacao);
