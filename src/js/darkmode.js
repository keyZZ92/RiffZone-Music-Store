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

  // Crear botón flotante con SVG luna
  var btn = document.createElement("button");
  btn.id = "darkModeToggleBtn";
  btn.title = "Activar/desactivar modo oscuro";
  btn.style.position = "fixed";
  btn.style.bottom = "32px";
  btn.style.right = "32px";
  btn.style.zIndex = "9999";
  btn.style.background = "#222";
  btn.style.color = "#e89229";
  btn.style.border = "2px solid #e89229";
  btn.style.borderRadius = "50%";
  btn.style.width = "56px";
  btn.style.height = "56px";
  btn.style.display = "flex";
  btn.style.alignItems = "center";
  btn.style.justifyContent = "center";
  btn.style.cursor = "pointer";
  btn.style.boxShadow = "0 2px 12px rgba(232,146,41,0.25)";
  btn.style.transition = "transform 0.3s";
  btn.innerHTML =
    '<svg id="moonIcon" width="32" height="32" viewBox="0 0 24 24" fill="#e89229" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:auto;"><path d="M21 12.79A9 9 0 0 1 12.21 3a1 1 0 0 0-1.13 1.36A7 7 0 0 0 13 21a7 7 0 0 0 7.64-6.92A1 1 0 0 0 21 12.79z"/></svg>';
  btn.innerHTML =
    '<svg id="moonIcon" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:auto;"><circle cx="12" cy="12" r="10" fill="#e89229"/><path d="M16 12c0-2.21-1.79-4-4-4-.34 0-.67.04-.99.11A6 6 0 1 0 16 12z" fill="#222"/></svg>';
  btn.innerHTML =
    '<svg id="moonIcon" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:auto;"><path d="M21 12.79A9 9 0 0 1 12.21 3a1 1 0 0 0-1.13 1.36A7 7 0 0 0 13 21a7 7 0 0 0 7.64-6.92A1 1 0 0 0 21 12.79z" fill="#e89229"/></svg>';
  btn.innerHTML =
    '<svg id="moonIcon" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:auto;"><path d="M20 12.5A8.5 8.5 0 0 1 11.5 4c0-.28-.22-.5-.5-.5s-.5.22-.5.5c0 5.25 4.25 9.5 9.5 9.5.28 0 .5-.22.5-.5s-.22-.5-.5-.5z" fill="#e89229"/></svg>';
  btn.innerHTML =
    '<svg id="moonIcon" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:auto;"><path d="M27 18c0 5.52-4.48 10-10 10-1.7 0-3.3-.43-4.7-1.19.41.03.83.05 1.25.05 6.08 0 11-4.92 11-11 0-.42-.02-.84-.05-1.25C26.57 14.7 27 16.3 27 18z" fill="#e89229"/></svg>';
  btn.innerHTML =
    '<i class="bi bi-moon" style="font-size:2.2rem;color:#e89229;display:block;margin:auto;"></i>';
  btn.onclick = function () {
    toggleDarkMode();
    btn.style.transform = "rotate(360deg)";
    setTimeout(function () {
      btn.style.transform = "rotate(0deg)";
    }, 350);
  };
  document.body.appendChild(btn);

  // Aplicar preferencia guardada
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
})();
