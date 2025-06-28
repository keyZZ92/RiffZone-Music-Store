// Carga dinámica de componentes comunes (header, prefooter, footer)
document.addEventListener("DOMContentLoaded", () => {
  // Header
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (headerPlaceholder) {
    fetch("../components/header.html")
      .then((res) => res.text())
      .then((html) => {
        headerPlaceholder.innerHTML = html;
        // Vuelve a inicializar los scripts de sesión tras cargar el header
        if (typeof initAuth === "function") initAuth();
        // Actualiza el contador del carrito tras cargar el header
        if (typeof actualizarContadorCarrito === "function")
          actualizarContadorCarrito();
        // Inicializa el menú hamburguesa tras cargar el header
        if (typeof initHeaderMenu === "function") {
          initHeaderMenu();
        } else {
          // Si aún no está cargado, carga el script y luego inicializa
          var script = document.createElement("script");
          script.src = "../js/headerMenu.js";
          script.onload = function () {
            if (typeof initHeaderMenu === "function") initHeaderMenu();
          };
          document.body.appendChild(script);
        }
        // --- INICIO: Inicializar login tras cargar header ---
        if (typeof initializeLogin === "function") initializeLogin();
        // --- FIN ---
      });
  }
});
