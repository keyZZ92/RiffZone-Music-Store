document.addEventListener("DOMContentLoaded", function () {
  const sidebarElement = document.getElementById("offcanvasServicios");
  if (sidebarElement) {
    const offcanvas = new bootstrap.Offcanvas(sidebarElement);
    offcanvas.show();
  }
});
