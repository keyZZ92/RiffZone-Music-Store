// Modo oscuro: añade/quita la clase 'dark-mode' al body
(function () {
  function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    // Guardar preferencia en localStorage
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  }

  // Crear botón flotante
  var btn = document.createElement("button");
  btn.innerText = "🌙";
  btn.id = "darkModeToggleBtn";
  btn.style.position = "fixed";
  btn.style.bottom = "32px";
  btn.style.right = "32px";
  btn.style.zIndex = "9999";
  btn.style.background = "#e89229";
  btn.style.color = "#222";
  btn.style.border = "none";
  btn.style.borderRadius = "50%";
  btn.style.width = "48px";
  btn.style.height = "48px";
  btn.style.fontSize = "1.5rem";
  btn.style.cursor = "pointer";
  btn.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
  btn.title = "Activar/desactivar modo oscuro";
  btn.onclick = toggleDarkMode;
  document.body.appendChild(btn);

  // Aplicar preferencia guardada
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
})();
