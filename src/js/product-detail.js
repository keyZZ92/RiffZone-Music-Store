// detail-product.js
// Este archivo muestra el detalle de un producto y permite añadirlo al carrito

(function () {
  'use strict';

  const $ = (sel) => document.querySelector(sel);
  const PRODUCT_CONTAINER_ID = '#product-detail';
  const DATA_URL = '../assets/data/products.json';


  if (typeof window.addToCart !== 'function') {
    window.addToCart = function addToCart(product, options = { showToast: true }) {

      if (typeof window.requireLogin === 'function' && !window.requireLogin()) return;

      let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

      // Buscar si el producto ya está en el carrito
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

      // Guardar carrito actualizado
      localStorage.setItem('carrito', JSON.stringify(carrito));

      if (typeof window.actualizarContadorCarrito === 'function') {
        window.actualizarContadorCarrito();
      }

      // Mostrar mensaje si está activado
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

  // Cargar todos los productos desde el JSON
  async function loadProducts() {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error('No se pudo cargar el listado de productos');
    return res.json();
  }

  // Mostrar el detalle del producto seleccionado
  function renderProduct(product) {
    const container = $(PRODUCT_CONTAINER_ID);
    container.innerHTML = `
      <div class="col-md-6">
        <img src="${product.image}" alt="${product.name}" class="img-fluid rounded shadow-sm">
      </div>
      <div class="col-md-6">
        <h1 class="mb-2">${product.name}</h1>
        <p class="mb-1 text-muted">${product.category.replace(/-/g, ' ')}</p>
        <p class="h4">
          <del class="text-secondary me-2">€${product.price.toFixed(2)}</del>
          <span class="text-danger fw-bold">€${(product.offerPrice ?? product.price).toFixed(2)}</span>
        </p>
        <p class="my-3">${product.description}</p>
        <button id="add-to-cart-btn" class="btn btn-primary">
          <i class="bi bi-cart-plus me-1"></i>Añadir al carrito
        </button>
      </div>
    `;

    // Conectar botón al carrito
    $('#add-to-cart-btn').addEventListener('click', () => window.addToCart(product));
  }

  // Obtener el ID del producto desde la URL
  function getProductId() {
    return new URLSearchParams(location.search).get('id');
  }

  // Iniciar cuando la página esté lista
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
