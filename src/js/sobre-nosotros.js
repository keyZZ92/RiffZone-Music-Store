$(document).ready(function () {
  // Inicializar todos los paneles como inert para prevenir navegación por teclado
  $(".team-card-info-panel").attr("inert", "true");

  // Mostrar panel lateral al hacer clic en 'Ver más'
  $(".team-card .btn-ver-mas").on("click", function (e) {
    e.preventDefault();
    var $card = $(this).closest(".team-card");

    // Ocultar todos los paneles de información activos
    $(".team-card-info-panel.active")
      .removeClass("active")
      .attr("inert", "true");

    // Mostrar el panel de la tarjeta actual
    var $panel = $card.find(".team-card-info-panel");
    $panel.addClass("active").removeAttr("inert");
  });

  // Ocultar panel lateral al hacer clic en cerrar
  $(".team-card .btn-cerrar-info").on("click", function (e) {
    e.preventDefault();
    var $card = $(this).closest(".team-card");
    $card
      .find(".team-card-info-panel")
      .removeClass("active")
      .attr("inert", "true");
  });

  // Accesibilidad: permitir activar botones "Ver más" con Enter o Espacio
  $(".team-card .btn-ver-mas").on("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      $(this).trigger("click");
    }
  });

  // Accesibilidad: permitir cerrar panel con Enter o Espacio
  $(".team-card .btn-cerrar-info").on("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      $(this).trigger("click");
    }
  });

  // Solicitar la clave de la API de Google Maps al servidor
  fetch("/api/google-maps-key")
    .then((response) => response.json())
    .then((data) => {
      const apiKey = data.apiKey;
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.setAttribute("loading", "lazy");
      document.body.appendChild(script);
    })
    .catch((error) => {
      console.error(
        "Error al obtener la clave de la API de Google Maps:",
        error
      );
    });

  // Inicializa el mapa centrado en Madrid
  window.initMap = function () {
    var madrid = { lat: 40.4168, lng: -3.7038 };
    var map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: madrid,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    const marker = new google.maps.Marker({
      position: madrid,
      map: map,
      title: "RiffZone Music Store (Ubicación ficticia)",
    });
  };
});
