function initializeLogin() {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  const registerBtn = document.querySelector(
    "button[aria-label='Ir a crear nueva cuenta']"
  );

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

      fetch("http://localhost:3000/api/login", {
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
    registerBtn.addEventListener("click", () => {
      const email = prompt("Introduce tu email:");
      const username = prompt("Introduce tu nombre de usuario:");
      const password = prompt("Introduce tu contraseña:");

      if (!email || !username || !password) {
        alert("Por favor completa todos los campos");
        return;
      }

      fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password, username }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            alert("Usuario registrado con éxito");
          } else {
            alert(data.error || "Error al registrar usuario");
          }
        })
        .catch((error) => {
          console.error("Error en registro:", error);
          alert("Error al conectar con el servidor.");
        });
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
