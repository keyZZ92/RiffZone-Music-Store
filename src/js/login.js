function initializeLogin() {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  const registerBtn = document.querySelector(
    "button[aria-label='Ir a crear nueva cuenta']"
  );

  // Configuración de endpoint para login/logout
  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://music-store-node-2-484977869651.europe-southwest1.run.app";

  // Lógica para login
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = emailInput ? emailInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value.trim() : "";

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
            // Guardar usuario en localStorage
            localStorage.setItem(
              "user",
              JSON.stringify({
                email: data.user.email,
                username: data.user.username,
              })
            );
            // Guardar username plano para el carrito por usuario
            localStorage.setItem("username", data.user.username);

            // Migrar carrito temporal si existe
            const tempCarrito = localStorage.getItem("carrito");
            if (tempCarrito) {
              localStorage.setItem(
                `carrito_${data.user.username}`,
                tempCarrito
              );
              localStorage.removeItem("carrito");
            }

            alert("Login exitoso. Redirigiendo a la página principal...");
            window.location.href = "../pages/index.html";
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

  // Lógica para registro
  if (registerBtn) {
    registerBtn.addEventListener("click", (e) => {
      // Redirige directamente a la página de registro sin prompts ni validaciones
      window.location.href = "register.html";
    });
  }

  // Mostrar/ocultar contraseña en el login
  const toggleBtn = document.getElementById("togglePassword");
  const icon = document.getElementById("togglePasswordIcon");
  if (toggleBtn && passwordInput && icon) {
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

document.addEventListener("DOMContentLoaded", initializeLogin);
