document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerBtn = document.querySelector("button[aria-label='Ir a crear nueva cuenta']");
  
    // Lógica para login
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
                  name: data.user.username,
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
  });
  