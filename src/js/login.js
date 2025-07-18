// Inicializa el login
function initializeLogin() {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = emailInput ? emailInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value.trim() : "";

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
          // Eliminar mensajes previos
          let msgSuccess = document.getElementById("login-success-msg");
          if (msgSuccess) msgSuccess.remove();
          let msgError = document.getElementById("login-error-msg");
          if (msgError) msgError.remove();

          if (data.user) {
            // Guardar datos en localStorage
            localStorage.setItem(
              "user",
              JSON.stringify({
                email: data.user.email,
                username: data.user.username,
              })
            );
            localStorage.setItem("username", data.user.username);

            // Migrar carrito temporal
            const tempCarrito = localStorage.getItem("carrito");
            if (tempCarrito) {
              localStorage.setItem(
                `carrito_${data.user.username}`,
                tempCarrito
              );
              localStorage.removeItem("carrito");
            }

            // Mensaje de éxito
            let msg = document.createElement("div");
            msg.id = "login-success-msg";
            msg.className = "login-success-message";
            msg.setAttribute("role", "status");
            msg.textContent = "¡Login exitoso! Redirigiendo...";
            loginForm.prepend(msg);

            // Redirección según página
            const currentPath = window.location.pathname;
            setTimeout(() => {
              if (currentPath.includes("carrito.html")) {
                window.location.reload();
              } else {
                window.location.href = window.location.href;
              }
            }, 1200);
          } else {
            // Error de credenciales
            let msg = document.createElement("div");
            msg.id = "login-error-msg";
            msg.className = "login-error-message";
            msg.setAttribute("role", "alert");
            msg.textContent =
              "Credenciales incorrectas. Por favor, revisa tu email y contraseña.";
            loginForm.prepend(msg);
          }
        });
    });
  }
}

// Mostrar/ocultar contraseña
function setupPasswordToggle() {
  var toggleBtn = document.getElementById("togglePassword");
  var passwordInput = document.getElementById("loginPassword");
  var icon = document.getElementById("togglePasswordIcon");
  if (toggleBtn && passwordInput && icon) {
    toggleBtn.replaceWith(toggleBtn.cloneNode(true));
    toggleBtn = document.getElementById("togglePassword");
    toggleBtn.addEventListener("click", function () {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("bi-eye");
        icon.classList.add("bi-eye-slash");
      } else {
        passwordInput.type = "password";
        icon.classList.remove("bi-eye-slash");
        icon.classList.add("bi-eye");
      }
    });
  }
}

// Mostrar botones login/logout y saludo
function updateSessionUI() {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userWelcome = document.getElementById("userWelcome");
  const userName = document.getElementById("userName");

  const userData = JSON.parse(localStorage.getItem("user"));

  if (userData && userData.username) {
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-flex";
    if (userWelcome) userWelcome.style.display = "inline-flex";
    if (userName) userName.textContent = userData.username;
  } else {
    if (loginBtn) loginBtn.style.display = "inline-flex";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (userWelcome) userWelcome.style.display = "none";
  }

  // Lógica de cierre de sesión
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      localStorage.removeItem("username");
      window.location.href = "/pages/index.html";
    });
  }
}

// Ejecutar todo al cargar
document.addEventListener("DOMContentLoaded", () => {
  setupPasswordToggle();
  initializeLogin();
  updateSessionUI();
});