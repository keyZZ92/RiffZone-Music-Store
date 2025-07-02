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
    <div class="card mb-3">
        <div class="row g-0">
        <div class="col-md-2">
            <img src="${
              producto.image
                ? producto.image
                : "../assets/images/iconos/iconBateria.png"
            }"
                class="img-fluid rounded-start"
                alt="${producto.nombre}"
                onerror="this.src='../assets/images/iconos/iconBateria.png'">
        </div>
        <div class="col-md-10">
            <div class="card-body d-flex justify-content-between align-items-center">
            <div>
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">Precio: $${producto.precio}</p>
                <p class="card-text">Cantidad: ${producto.cantidad}</p>
                <p class="card-text">Total: $${total}</p>
            </div>
            <div class="d-flex flex-column gap-2">
                <button class="btn btn-success btn-sm" onclick="aumentarCantidad(${index})">➕</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${index})">❌</button>
            </div>
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

// Eliminar producto
function eliminarProducto(index) {
  if (!requireLogin()) return;
  const carrito = obtenerCarrito();
  carrito.splice(index, 1);
  guardarCarrito(carrito);
  actualizarContadorCarrito();
  mostrarProductosCarrito();
}

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
