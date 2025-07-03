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
    <div class="card mb-3" style="max-width: 540px; margin: 0 auto;">
      <div class="row g-0 align-items-center flex-nowrap">
        <div class="col-auto d-flex flex-row align-items-center justify-content-center" style="min-width: 0;">
          <img src="${
            producto.image
              ? producto.image
              : "../assets/images/iconos/iconBateria.png"
          }"
            class="img-fluid rounded-start me-2"
            alt="${producto.nombre}"
            onerror="this.src='../assets/images/iconos/iconBateria.png'">
          <div class="d-flex flex-column gap-2 ms-1">
            <button class="btn btn-success btn-sm" title="Aumentar cantidad" aria-label="Aumentar cantidad" onclick="aumentarCantidad(${index})">
              <i class="bi bi-arrow-up"></i>
            </button>
            <button class="btn btn-danger btn-sm" title="Eliminar producto" aria-label="Eliminar producto" onclick="eliminarProducto(${index})">
              <i class="bi bi-arrow-down"></i>
            </button>
          </div>
        </div>
        <div class="col ps-3">
          <div class="card-body d-flex flex-column justify-content-center h-100 p-2">
            <h5 class="card-title mb-1">${producto.nombre}</h5>
            <p class="card-text mb-1">Precio: $${producto.precio}</p>
            <p class="card-text mb-1">Cantidad: ${producto.cantidad}</p>
            <p class="card-text mb-0">Total: $${total}</p>
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
