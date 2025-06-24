$(document).ready(function () {
  // Mostrar panel lateral al hacer clic en 'Ver más'
  $(".team-card .btn-ver-mas").on("click", function (e) {
    e.preventDefault();
    var $card = $(this).closest(".team-card");
    $card.find(".team-card-info-panel").addClass("active");
  });
  // Ocultar panel lateral al hacer clic en cerrar
  $(".team-card .btn-cerrar-info").on("click", function (e) {
    e.preventDefault();
    var $card = $(this).closest(".team-card");
    $card.find(".team-card-info-panel").removeClass("active");
  });
});
