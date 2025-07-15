// product-detail.js
// Este archivo muestra el detalle de un producto, permite añadirlo al carrito y muestra/crea reseñas del producto

(function () {
  'use strict';

  const $ = (sel) => document.querySelector(sel);
  const PRODUCT_CONTAINER_ID = '#product-detail';
  const DATA_URL = '../assets/data/products.json';

  // --- Funciones para cargar, renderizar y crear reseñas ---
  function renderReviewsSection(productId) {
    const section = document.createElement('section');
    section.id = 'detail-reviews';
    section.className = 'mt-5';
    section.innerHTML = `
      <h3>Reseñas del producto</h3>
      <div id="detail-review-list">Cargando reseñas…</div>

      <!-- Formulario para nueva reseña -->
      <form id="detail-review-form" class="mt-4">
        <div class="mb-2">
          <label for="detail-name" class="form-label">Nombre:</label>
          <input type="text" id="detail-name" class="form-control" required />
        </div>
        <div class="mb-2">
          <label for="detail-comment" class="form-label">Comentario:</label>
          <textarea id="detail-comment" class="form-control" required></textarea>
        </div>
        <div class="mb-2">
          <label class="form-label">Valoración:</label>
          <div id="detail-rating">
            <i data-value="1" class="star">𝄞</i>
            <i data-value="2" class="star">𝄞</i>
            <i data-value="3" class="star">𝄞</i>
            <i data-value="4" class="star">𝄞</i>
            <i data-value="5" class="star">𝄞</i>
          </div>
        </div>
        <button type="submit" class="btn btn-primary mt-2">Enviar reseña</button>
      </form>
    `;
    const container = document.querySelector(PRODUCT_CONTAINER_ID);
    container.appendChild(section);

    const listContainer = section.querySelector('#detail-review-list');
    const form = section.querySelector('#detail-review-form');
    const stars = section.querySelectorAll('#detail-rating .star');
    let selectedRating = 0;

    // 1) Carga inicial de reseñas
    fetch(`/api/products/${productId}/reviews`)
      .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
      .then(renderList)
      .catch(() => listContainer.innerHTML = '<p>Error al cargar reseñas.</p>');

    // Función actualizada para renderizar reseñas con botón eliminar
    function renderList(reviews) {
      if (reviews.length === 0) {
        listContainer.innerHTML = '<p>No hay reseñas aún.</p>';
        return;
      }
      listContainer.innerHTML = '';
      reviews.forEach(({ id, name, comment, rating }) => {
        const div = document.createElement('div');
        div.className = 'review mb-3 p-3 bg-light rounded d-flex flex-column';

        div.innerHTML = `
          <strong>${name}</strong>
          <div class="stars">${'𝄞'.repeat(rating)}</div>
          <p>${comment}</p>
        `;

        // Crear botón eliminar
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.className = 'btn btn-sm btn-danger align-self-end mt-2';
        deleteBtn.style.cursor = 'pointer';

        // Añadir evento para eliminar la reseña
        deleteBtn.addEventListener('click', () => {
          if (!confirm('¿Seguro que quieres eliminar esta reseña?')) return;

          fetch(`/api/products/${productId}/reviews/${id}`, { method: 'DELETE' })
            .then(res => {
              if (!res.ok) throw new Error('Error al eliminar la reseña');
              // Recargar lista de reseñas tras borrar
              return fetch(`/api/products/${productId}/reviews`);
            })
            .then(res => res.json())
            .then(renderList)
            .catch(err => {
              console.error(err);
              alert('No se pudo eliminar la reseña.');
            });
        });

        div.appendChild(deleteBtn);
        listContainer.appendChild(div);
      });
    }

    // 2) Lógica de selección de estrellas
    stars.forEach(icon => {
      icon.style.cursor = 'pointer';
      icon.style.color = 'gray';
      icon.addEventListener('click', () => {
        selectedRating = parseInt(icon.dataset.value, 10);
        stars.forEach(i =>
          i.style.color = (parseInt(i.dataset.value,10) <= selectedRating) ? 'goldenrod' : 'gray'
        );
      });
    });

    // 3) Envío del formulario
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name    = section.querySelector('#detail-name').value.trim();
      const comment = section.querySelector('#detail-comment').value.trim();
      if (!name || !comment || selectedRating === 0) {
        return alert('Completa todos los campos y selecciona una valoración.');
      }
      fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ name, comment, rating: selectedRating })
      })
        .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
        .then(() => {
          // limpiar formulario
          form.reset();
          selectedRating = 0;
          stars.forEach(i => i.style.color = 'gray');
          // recargar lista de reseñas
          return fetch(`/api/products/${productId}/reviews`);
        })
        .then(res => res.json())
        .then(renderList)
        .catch(err => {
          console.error(err);
          alert('Error al enviar la reseña.');
        });
    });
  }

  // Función para añadir al carrito
  if (typeof window.addToCart !== 'function') {
    window.addToCart = function addToCart(product, options = { showToast: true }) {
      if (!requireLogin()) return;

      const carritoKey = getCarritoKey();
      let carrito = JSON.parse(localStorage.getItem(carritoKey)) || [];

      const existente = carrito.find((item) => item.id === product.id);
      if (existente) {
        existente.cantidad += 1;
      } else {
        carrito.push({
          id: product.id,
          nombre: product.name,
          precio: product.offerPrice ?? product.price,
          image: product.image,
          cantidad: 1,
        });
      }


      localStorage.setItem(carritoKey, JSON.stringify(carrito));


      if (typeof window.actualizarContadorCarrito === 'function') {
        window.actualizarContadorCarrito();
      }
      if (options.showToast && typeof bootstrap !== 'undefined') {
        const toast = document.createElement('div');
        toast.className =
          'toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-3';
        toast.role = 'alert';
        toast.innerHTML = `
          <div class="d-flex">
            <div class="toast-body">"${product.name}" añadido al carrito</div>
          </div>`;
        document.body.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast, { delay: 2000 });
        bsToast.show();
        bsToast._element.addEventListener('hidden.bs.toast', () => toast.remove());
      }
    };
  }

  // Funciones auxiliares para el carrito por usuario
  function getCurrentUsername() {
    return localStorage.getItem("username");
  }

  function getCarritoKey() {
    const username = getCurrentUsername();
    return username ? `carrito_${username}` : "carrito";
  }

  function requireLogin() {
    if (!localStorage.getItem("user") && !localStorage.getItem("username")) {
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

  function calcularFechaEntrega() {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 3);
    return hoy.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }

  function renderProduct(product) {
    const fechaEntrega = calcularFechaEntrega();
    const container = $(PRODUCT_CONTAINER_ID);
    container.innerHTML = `
      <div class="col-md-6">
        <img src="${product.image}" alt="${product.name}" class="img-fluid rounded shadow-sm">
      </div>
      <div class="col-md-6 d-flex flex-column justify-content-between">
        <div>
          <h1 class="mb-2">${product.name}</h1>
          <p class="mb-1 text-muted text-capitalize">${product.category.replace(/-/g, ' ')}</p>
          <p class="h4">
            <del class="text-secondary me-2">${product.price.toFixed(2)}€</del>
            <span class="text-danger fw-bold">${(product.offerPrice ?? product.price).toFixed(2)}€</span>
          </p>
          <p class="my-3">${product.description}</p>

          <!-- Sección Envío y entrega -->
          <div class="mt-3 mb-4 p-3 bg-light rounded border">
            <p class="mb-1"><strong>🚚 Envío:</strong> Gratis a domicilio</p>
            <p class="mb-0"><strong>⏰ Entrega estimada:</strong> 24-48h</p>
          </div>

        <div class="d-flex justify-content-between align-items-center mt-3">
          <button id="add-to-cart-btn" class="product-btn product-btn-primary">
            <i class="bi bi-cart-plus me-1"></i>Añadir a la carrito
          </button>
          <button id="back-btn" class="product-btn product-btn-secondary">
            <i class="bi bi-arrow-left"></i> Volver
          </button>
        </div>
      </div>
    `;

    $('#add-to-cart-btn').addEventListener('click', () => {
      const button = $('#add-to-cart-btn');
      window.addToCart(product, { showToast: false }); // Desactivar el toast verde
      
      // Cambiar el texto del botón a "Añadido" con el estilo del hover
      button.innerHTML = '<i class="bi bi-check-circle me-1"></i>Añadido';
      button.style.backgroundColor = '#d67d1f'; // Mismo color que el hover
      button.style.boxShadow = '0 6px 12px rgba(232, 146, 41, 0.7)'; // Mismo shadow que el hover
      
      // Restaurar el texto original después de 2 segundos
      setTimeout(() => {
        button.innerHTML = '<i class="bi bi-cart-plus me-1"></i>Añadir a la carrito';
        button.style.backgroundColor = '#c77619';
        button.style.boxShadow = '0 3px 6px rgba(232, 146, 41, 0.7)';
      }, 2000);
    });
    $('#back-btn').addEventListener('click', () => history.back());

    // Insertar sección de reseñas
    renderReviewsSection(product.id);
  }

  async function loadProducts() {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error('No se pudo cargar el listado de productos');
    return res.json();
  }

  function getProductId() {
    return new URLSearchParams(location.search).get('id');
  }

  document.addEventListener('DOMContentLoaded', async () => {
    if (typeof window.loadHeader === 'function') {
      loadHeader('#header-placeholder');
    }

    const id = getProductId();
    if (!id) {
      $(PRODUCT_CONTAINER_ID).innerHTML =
        '<p class="alert alert-warning">No se especificó un producto.</p>';
      return;
    }

    try {
      const list = await loadProducts();
      const product = list.find((p) => p.id == id);
      if (!product) {
        $(PRODUCT_CONTAINER_ID).innerHTML =
          '<p class="alert alert-danger">Producto no encontrado.</p>';
        return;
      }
      renderProduct(product);
    } catch (err) {
      console.error(err);
      $(PRODUCT_CONTAINER_ID).innerHTML =
        '<p class="alert alert-danger">Error al cargar el producto.</p>';
    }
  });
})();
