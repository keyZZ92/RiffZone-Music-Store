let products = [];
let filteredProducts = [];
let hasSearched = false;

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function initCatalogSearch() {
  fetch("../assets/data/products.json")
    .then(res => res.json())
    .then(data => {
      products = data.filter(p => p.name);
      // Siempre aplicar filtros al cargar (hasSearched debe estar en true si venimos de redirección)
      applyFilters();
    });

  // Mostrar filtros al enfocar el input de búsqueda
  const searchInput = document.getElementById("search-input");
  const filters = document.getElementById("advanced-filters");
  if (searchInput && filters) {
    searchInput.addEventListener("focus", () => {
      filters.classList.remove("visually-hidden");
    });
    filters.addEventListener("focusout", () => {
      setTimeout(() => {
        if (!filters.contains(document.activeElement) && document.activeElement !== searchInput) {
          filters.classList.add("visually-hidden");
        }
      }, 100);
    });
    searchInput.addEventListener("blur", () => {
      setTimeout(() => {
        if (!filters.contains(document.activeElement)) {
          filters.classList.add("visually-hidden");
        }
      }, 100);
    });
  }

  // Listeners para filtros y búsqueda
  document.getElementById("catalog-search-form").addEventListener("input", function() {
    hasSearched = true;
    applyFilters();
  });

  document.getElementById("catalog-search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    // Detectar si estamos en buscador.html o en un catálogo
    const isBuscador = window.location.pathname.includes("buscador.html");
    // Recoger todos los filtros y búsqueda
    const searchValue = document.getElementById("search-input")?.value.trim() || "";
    const category = document.getElementById("category-filter")?.value || "";
    const offer = document.getElementById("offer-filter")?.value || "";
    const minPrice = document.getElementById("min-price")?.value || "";
    const maxPrice = document.getElementById("max-price")?.value || "";
    const brand = document.getElementById("brand-filter")?.value || "";
    const sort = document.getElementById("sort-filter")?.value || "";

    // Si NO estamos en buscador.html, redirigir con los parámetros
    if (!isBuscador) {
      const params = new URLSearchParams();
      if (searchValue) params.set("search", searchValue);
      if (category) params.set("category", category);
      if (offer) params.set("offer", offer);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (brand) params.set("brand", brand);
      if (sort) params.set("sort", sort);
      window.location.href = `buscador.html?${params.toString()}`;
      return;
    }

    // Si estamos en buscador.html, aplicar filtros normalmente
    hasSearched = true;
    applyFilters();
    // Opcional: actualizar la URL para compartir el filtro
    const url = new URL(window.location);
    if (searchValue) {
      url.searchParams.set('search', searchValue);
    } else {
      url.searchParams.delete('search');
    }
    if (category) {
      url.searchParams.set('category', category);
    } else {
      url.searchParams.delete('category');
    }
    if (offer) {
      url.searchParams.set('offer', offer);
    } else {
      url.searchParams.delete('offer');
    }
    if (minPrice) {
      url.searchParams.set('minPrice', minPrice);
    } else {
      url.searchParams.delete('minPrice');
    }
    if (maxPrice) {
      url.searchParams.set('maxPrice', maxPrice);
    } else {
      url.searchParams.delete('maxPrice');
    }
    if (brand) {
      url.searchParams.set('brand', brand);
    } else {
      url.searchParams.delete('brand');
    }
    if (sort) {
      url.searchParams.set('sort', sort);
    } else {
      url.searchParams.delete('sort');
    }
    window.history.replaceState({}, '', url);
  });
}


function applyFilters() {
  // Permitir que los filtros se tomen de la URL si existen (para buscador.html)
  // Siempre tomar los valores SOLO del formulario (ya están sincronizados con la URL en buscador.html)
  const search = document.getElementById("search-input")?.value.trim().toLowerCase() || "";
  const category = document.getElementById("category-filter")?.value || "";
  const offer = document.getElementById("offer-filter")?.value || "";
  const minPrice = parseFloat(document.getElementById("min-price")?.value || 0) || 0;
  const maxPrice = parseFloat(document.getElementById("max-price")?.value || Infinity) || Infinity;
  const brand = document.getElementById("brand-filter")?.value || "";
  const sort = document.getElementById("sort-filter")?.value || "";

  filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search) || (p.category && p.category.toLowerCase().includes(search));
    const matchesCategory = !category || (p.category && p.category === category);
    const matchesBrand = !brand || (p.brand && p.brand === brand);
    const matchesOffer = offer !== "on-offer" || (p.offerPrice && p.offerPrice < p.price);
    const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesBrand && matchesOffer && matchesPrice;
  });

  // Ordenar
  switch (sort) {
    case "price-asc":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "popularity":
      filteredProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      break;
    case "newest":
      filteredProducts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      break;
    // "relevance" o default: no ordenar extra
  }

  renderProducts(filteredProducts);
}

function renderProducts(products) {
  const container = document.getElementById("catalog-products");
  if (!container) return;
  container.innerHTML = "";
  // Quitar la clase de centrado antes de renderizar
  container.classList.remove("centered-products");
  if (!hasSearched) return;
  if (products.length === 0) {
    container.innerHTML = "<p>No se encontraron productos.</p>";
    return;
  }
  // Si estamos en buscador.html y hay 1 o 2 productos, centrar
  const isBuscador = window.location.pathname.includes("buscador.html");
  if (isBuscador && (products.length === 1 || products.length === 2)) {
    container.classList.add("centered-products");
  }
  products.forEach(product => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4 mb-4";
    col.innerHTML = `
      <div class="card h-100 guitar-card product-card" tabindex="0" role="button" aria-label="Ver detalles de ${product.name}">
        <img src="${product.image}" class="card-img-top" alt="${product.name}" />
        <div class="card-body guitar-card-body d-flex flex-column">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${product.category || ""} <span class="text-muted">${product.brand ? ' - ' + product.brand : ''}</span></p>
          <p class="card-text">
            ${product.offerPrice && product.offerPrice < product.price
              ? `<span class='badge bg-success'>Oferta</span> <span class='price-regular text-decoration-line-through'>$${product.price}</span> <span class='price-offer fw-bold text-danger'>$${product.offerPrice}</span>`
              : `<span class='price-offer fw-bold'>$${product.price}</span>`}
          </p>
          <button class="btn btn-primary mt-auto btn-add-cart" data-product='${JSON.stringify(product)}' aria-label="Añadir ${product.name} al carrito">
            Añadir a la cesta
          </button>
        </div>
      </div>
    `;
    // Navegación accesible a detalle
    col.querySelector('.product-card').addEventListener('click', () => goToProductDetail(product));
    col.querySelector('.product-card').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goToProductDetail(product);
      }
    });
    container.appendChild(col);
  });

  // Conectar botón "Añadir a la cesta" con cart.js
  container.querySelectorAll(".btn-add-cart").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const prod = JSON.parse(btn.getAttribute("data-product"));
      if (typeof window.agregarAlCarrito === "function") {
        window.agregarAlCarrito(prod);
      }
    });
  });
}

// Simulación de navegación a detalle (puedes cambiar por tu lógica real)
function goToProductDetail(product) {
  // Si tienes página de detalle, redirige:
  // window.location.href = `detalle.html?id=${product.id}`;
  // Si no, muestra modal accesible:
  alert(`Detalles de ${product.name}:\n\n${product.description}\nMarca: ${product.brand || '-'}\nPrecio: $${product.offerPrice && product.offerPrice < product.price ? product.offerPrice : product.price}`);
}

// Exportar para inicializar tras cargar el header
window.initCatalogSearch = initCatalogSearch;