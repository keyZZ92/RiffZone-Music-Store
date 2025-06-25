document.addEventListener('DOMContentLoaded', function () {
        // Botón "Seguir comprando"
        const btnSeguir = document.getElementById('seguir-comprando');
        if (btnSeguir) {
          btnSeguir.addEventListener('click', function () {
            const ultima = localStorage.getItem('ultimaPagina') || 'index.html';
            window.location.href = ultima;
          });
        }
        // Botón "Pagar"
        const btnPagar = document.getElementById('btn-pagar');
        if (btnPagar) {
          btnPagar.addEventListener('click', function () {
            if (typeof requireLogin === 'function') {
              if (requireLogin()) {
                alert('¡Gracias por tu compra! (Simulación de pago)');
                // Aquí puedes añadir la lógica real de pago o redirección
              }
            }
          });
        }
      });