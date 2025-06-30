document.addEventListener("DOMContentLoaded", () => {

  const loginForm = document.getElementById("loginForm");
  const registerBtn = document.querySelector("button[aria-label='Ir a crear nueva cuenta']");

  // Mantener sesión iniciada: mostrar saludo si hay usuario
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    const greeting = document.getElementById("userGreeting");
    if (greeting) {
      greeting.textContent = `Hola, ${user.username}`;
    }
  }

  // Redirigir si la página es privada y no hay sesión
  if (document.body.dataset.private === "true" && !user) {
    window.location.href = "../pages/login.html";
  }

  // Función para cerrar sesión accesible globalmente
  window.logout = function () {
    localStorage.removeItem("user");
    window.location.href = "../pages/login.html";
  };

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("inputPassword").value.trim();

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

  // Registro: redirigir a formulario registro
  if (registerBtn) {
    registerBtn.addEventListener("click", () => {
      window.location.href = "../pages/register.html";
    });
  }
});
