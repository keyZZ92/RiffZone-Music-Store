// auth.js - Este archivo gestiona la autenticación de usuarios, incluyendo funciones para iniciar sesión, cerrar sesión y validar credenciales.
document.addEventListener("DOMContentLoaded", () => {
    const userData = localStorage.getItem("user");
  
    // Elementos UI
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const userWelcome = document.getElementById("userWelcome");
    const userName = document.getElementById("userName");
  
    if (userData) {
      const user = JSON.parse(userData);
      console.log("Sesión iniciada como:", user.email);
  
      // Mostrar saludo y botón cerrar sesión
      if (userName) userName.textContent = user.name || user.email;
      if (userWelcome) userWelcome.style.display = "inline";
      if (logoutBtn) logoutBtn.style.display = "inline-block";
  
      // Ocultar botón de iniciar sesión
      if (loginBtn) loginBtn.style.display = "none";
    } else {
      // No hay sesión iniciada, mostrar login y ocultar saludo/logout
      if (loginBtn) loginBtn.style.display = "inline-block";
      if (userWelcome) userWelcome.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "none";
    }
  
    // Evento para cerrar sesión
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.reload();
      });
    }
  });
  