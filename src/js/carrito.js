function carritoInit() {
        // Botón "Seguir comprando"
        const btnSeguir = document.getElementById('seguir-comprando');
        if (btnSeguir) {
          btnSeguir.addEventListener('click', function () {
            const ultima = localStorage.getItem('ultimaPagina') || 'index.html';
            if (typeof window.navegarA === 'function') {
              window.navegarA(ultima);
            } else {
              window.location.href = ultima;
            }
          });
        }
        // Botón "Pagar"
        const btnPagar = document.getElementById('btn-pagar');
        if (btnPagar) {
          btnPagar.addEventListener('click', function () {
            // Usar window.requireLogin y window.alert para asegurar contexto correcto
            if (typeof window.requireLogin === 'function') {
              if (window.requireLogin()) {
                window.alert('¡Gracias por tu compra! (Simulación de pago)');
                // Aquí puedes añadir la lógica real de pago o redirección
              }
            }
          });
        }
      }
      document.addEventListener('DOMContentLoaded', carritoInit);
      
      // Para test
      if (typeof module !== 'undefined') {
        module.exports = { carritoInit };
      }