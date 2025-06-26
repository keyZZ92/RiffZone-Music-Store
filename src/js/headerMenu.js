// headerMenu.js
// Lógica para el menú hamburguesa y mobile-nav del header cargado dinámicamente
function initHeaderMenu() {
  function toggleMobileNav() {
    var nav = document.getElementById("mobileNav");
    if (nav) nav.classList.toggle("open");
  }
  var hamburger = document.getElementById("hamburgerBtn");
  if (hamburger) {
    hamburger.addEventListener("click", toggleMobileNav);
  }
  // Mostrar el botón hamburguesa solo en móvil
  function checkHamburger() {
    if (!hamburger) return;
    if (window.innerWidth <= 900) {
      hamburger.style.display = "flex";
    } else {
      hamburger.style.display = "none";
      var nav = document.getElementById("mobileNav");
      nav && nav.classList.remove("open");
    }
  }
  window.addEventListener("resize", checkHamburger);
  checkHamburger();
}
