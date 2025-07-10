function initializeLogin() {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("inputPassword");
  const API_BASE_URL = "http://localhost:3000";

  if (!loginForm || !emailInput || !passwordInput) {
    // Si alguno falta, no hacer nada (modal no cargado aún)
    return;
  }

  // Para evitar agregar múltiples listeners si ya se cargó
  if (loginForm.dataset.initialized) return;
  loginForm.dataset.initialized = "true";

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert("Por favor completa todos los campos.");
      return;
    }

    fetch(`${API_BASE_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              email: data.user.email,
              username: data.user.username,
            })
          );
          localStorage.setItem("username", data.user.username);

          const tempCarrito = localStorage.getItem("carrito");
          if (tempCarrito) {
            localStorage.setItem(`carrito_${data.user.username}`, tempCarrito);
            localStorage.removeItem("carrito");
          }

          let msg = document.getElementById("login-success-msg");
          if (!msg) {
            msg = document.createElement("div");
            msg.id = "login-success-msg";
            msg.className = "alert alert-success mt-2 corporate-success";
            msg.setAttribute("role", "alert");
            loginForm.prepend(msg);
          }
          msg.textContent = "¡Login exitoso! Redirigiendo...";

          setTimeout(() => {
            const currentPath = window.location.pathname;
            if (currentPath.includes("carrito.html")) {
              window.location.reload();
            } else {
              window.location.href = window.location.href;
            }
          }, 1200);
        } else {
          alert(data.error || "Usuario o contraseña incorrectos.");
        }
      })
      .catch((error) => {
        console.error("Error al iniciar sesión:", error);
        alert("Error al conectar con el servidor.");
      });
  });
}
// Mostrar/ocultar contraseña
document.addEventListener("headerLoaded", () => {
  initializeLogin();

  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const input = document.getElementById(targetId);
      const icon = this.querySelector("i");
      if (!input || !icon) return;

      const isVisible = input.type === "text";
      input.type = isVisible ? "password" : "text";
      icon.classList.toggle("bi-eye", isVisible);
      icon.classList.toggle("bi-eye-slash", !isVisible);
    });
  });
});
