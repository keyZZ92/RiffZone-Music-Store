// Extrae la lógica de actualización de UI de sesión a una función global
function initAuth() {
  const userData = localStorage.getItem("user");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userWelcome = document.getElementById("userWelcome");
  const userName = document.getElementById("userName");

  if (userData) {
    const user = JSON.parse(userData);
    if (userName) userName.textContent = user.username || user.email;
    if (userWelcome) userWelcome.style.display = "inline";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (loginBtn) loginBtn.style.display = "none";
  } else {
    if (loginBtn) loginBtn.style.display = "inline-flex";
    if (userWelcome) userWelcome.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
  if (logoutBtn) {
    logoutBtn.onclick = function () {
      // Llamada al backend para desloguear a todos
      fetch("http://localhost:3000/api/logout", {
        method: "POST",
      })
        .then(() => {
          localStorage.removeItem("user");
          window.location.reload();
        })
        .catch(() => {
          // Si falla, igual limpiamos localStorage
          localStorage.removeItem("user");
          window.location.reload();
        });
    };
  }
}

// document.addEventListener("DOMContentLoaded", () => {
//   initAuth();
// });
