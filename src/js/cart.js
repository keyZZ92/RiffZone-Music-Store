// cart.js
// Función de comprobación de login
function requireLogin() {
  // Considera logueado si existe 'user' o 'username' en localStorage
  if (!localStorage.getItem("user") && !localStorage.getItem("username")) {
    // Mostrar modal de login si existe en la página
    const modalEl = document.getElementById("loginModal");
    if (modalEl && typeof bootstrap !== "undefined") {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    } else {
      alert("¿Tienes cuenta? Inicia sesión para continuar.");
    }
    return false;
  }
  return true;
}

// Obtener el usuario actual
function getCurrentUsername() {
  return localStorage.getItem("username");
}

// Obtener la clave de carrito según usuario
function getCarritoKey() {
  const username = getCurrentUsername();
  return username ? `carrito_${username}` : "carrito";
}

// Obtener carrito desde localStorage (por usuario)
function obtenerCarrito() {
  const key = getCarritoKey();
  const carrito = localStorage.getItem(key);
  return carrito ? JSON.parse(carrito) : [];
}

// Guardar carrito en localStorage (por usuario)
function guardarCarrito(carrito) {
  const key = getCarritoKey();
  localStorage.setItem(key, JSON.stringify(carrito));
}

// Mostrar productos en el carrito
function mostrarProductosCarrito() {
  // Si estamos en checkout.html, no renderizar aquí
  if (window.location.pathname.includes('checkout.html')) return;
  const carrito = obtenerCarrito();
  const contenedor = document.getElementById("cart-items");
  const totalPrecioEl = document.getElementById("total-price");
  if (!contenedor || !totalPrecioEl) return; // Evita errores si no existen los elementos
  contenedor.innerHTML = ""; // Limpiar contenido anterior

  let totalGeneral = 0;

  carrito.forEach((producto, index) => {
    const total = producto.precio * producto.cantidad;
    totalGeneral += total;

    const productoHTML = `
    <div class="card mb-3 w-100" style="max-width:100vw;">
      <div class="row g-0 align-items-center flex-nowrap checkout-product-row">
        <div class="col-auto d-flex flex-row align-items-center justify-content-center" style="min-width: 0;">
          <img src="${
            producto.image
              ? producto.image
              : "../assets/images/iconos/iconBateria.png"
          }"
            class="img-fluid rounded-start me-2 checkout-product-img"
            alt="${producto.nombre}"
            onerror="this.src='../assets/images/iconos/iconBateria.png'">
          <div class="d-flex flex-column gap-2 ms-1">
            <button class="checkout-confirm btn-sm" title="Aumentar cantidad" aria-label="Aumentar cantidad" onclick="aumentarCantidad(${index})">
              <i class="bi bi-arrow-up"></i>
            </button>
            <button class="checkout-cancel btn-sm" title="Restar cantidad" aria-label="Restar cantidad" onclick="eliminarProducto(${index})">
              <i class="bi bi-arrow-down"></i>
            </button>
          </div>
        </div>
        <div class="col ps-3">
          <div class="card-body d-flex flex-column align-items-center justify-content-center h-100 p-3 checkout-product-info w-100">
            <div class="d-flex flex-row align-items-center justify-content-center w-100 mb-2" style="gap:1.2rem;">
              <span class="card-title" style="font-size:2rem; font-weight:700;">${producto.nombre}</span>
              <span class="card-text checkout-product-price" style="font-size:2rem; font-weight:700; color:#e89229;">$${producto.precio}</span>
            </div>
            <div class="d-flex flex-row align-items-center justify-content-center w-100 mb-2" style="gap:1.2rem;">
              <span class="card-text" style="color: #888; font-size:1.3rem; font-weight:600;">Cantidad: ${producto.cantidad}</span>
            </div>
            <span class="card-text text-center w-100" style="color: #111; font-size:2.2rem; font-weight:800;">Total: $${total}</span>
          </div>
        </div>
      </div>
    </div>
    `;
    contenedor.innerHTML += productoHTML;
  });

  totalPrecioEl.textContent = totalGeneral.toFixed(2);
}

// Actualizar el contador
function actualizarContadorCarrito() {
  const carrito = obtenerCarrito();
  let totalCantidad = 0;
  carrito.forEach((producto) => {
    totalCantidad += producto.cantidad;
  });

  const contador = document.getElementById("cart-count");
  if (contador) {
    contador.textContent = totalCantidad;
  }
}

// Aumentar cantidad
function aumentarCantidad(index) {
  if (!requireLogin()) return;
  const carrito = obtenerCarrito();
  carrito[index].cantidad += 1;
  guardarCarrito(carrito);
  actualizarContadorCarrito();
  mostrarProductosCarrito();
}

// Eliminar producto (ahora resta de uno en uno)
function eliminarProducto(index) {
  if (!requireLogin()) return;
  const carrito = obtenerCarrito();
  if (carrito[index].cantidad > 1) {
    carrito[index].cantidad -= 1;
  } else {
    carrito.splice(index, 1);
  }
  guardarCarrito(carrito);
  actualizarContadorCarrito();
  mostrarProductosCarrito();
}


// Añadir producto al carrito (accesible globalmente)
function agregarAlCarrito(producto) {
  // Permitir agregar al carrito sin login en buscador.html
  if (window.location.pathname.includes("buscador.html")) {
    // No requerir login
  } else {
    if (!requireLogin()) return;
  }
  // Normalizar propiedades
  const prod = {
    nombre: producto.name || producto.nombre || "Producto",
    precio: producto.offerPrice && producto.offerPrice < producto.price ? producto.offerPrice : (producto.price || producto.precio || 0),
    cantidad: 1,
    image: producto.image || producto.imagen || "",
    id: producto.id || null
  };
  const carrito = obtenerCarrito();
  // Buscar si ya existe (por id o nombre)
  let idx = carrito.findIndex(p => (p.id && prod.id && p.id === prod.id) || p.nombre === prod.nombre);
  if (idx !== -1) {
    carrito[idx].cantidad += 1;
  } else {
    carrito.push(prod);
  }
  guardarCarrito(carrito);
  actualizarContadorCarrito();
  // Feedback accesible
  if (window.location.pathname.includes("buscador.html") || window.location.pathname.includes("catalog") || window.location.pathname.includes("guitar") || window.location.pathname.includes("drums") || window.location.pathname.includes("keyboard")) {
    if (typeof bootstrap !== "undefined") {
      // Mostrar toast si existe
      const toastEl = document.getElementById("cart-toast");
      if (toastEl) {
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
      }
    }
  }
}
window.agregarAlCarrito = agregarAlCarrito;

// Iniciar todo al cargar
document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();
  // Solo ejecutar mostrarProductosCarrito si existe el contenedor
  if (
    document.getElementById("cart-items") &&
    document.getElementById("total-price")
  ) {
    mostrarProductosCarrito();
  }
});
