document.addEventListener("DOMContentLoaded", () => {
  console.log("reviews.js cargado");

  const reviewList = document.getElementById("detail-review-list");
  const reviewForm = document.getElementById("detail-review-form");
  const ratingIcons = document.querySelectorAll("#detail-rating .star");
  let selectedRating = 0;

  if (!reviewList || !reviewForm) {
    console.error("No se encontró el formulario o la lista de reseñas.");
    return;
  }

  function getProductId() {
    return (
      new URLSearchParams(location.search).get("id") ||
      document.querySelector("main")?.dataset.productId
    );
  }

  function renderReviews(reviews) {
    reviewList.innerHTML = "";

    if (reviews.length === 0) {
      reviewList.innerHTML = "<p>No hay reseñas aún.</p>";
      return;
    }

    reviews.forEach(({ name, comment, rating, id }) => {
      const div = document.createElement("div");
      div.className = "review";
      div.innerHTML = `
        <strong>${name}</strong>
        <div class="stars">${"𝄞".repeat(rating)}</div>
        <p>${comment}</p>
        ${
          id
            ? `<button class="delete-review-btn mt-2" data-id="${id}">Eliminar</button>`
            : ""
        }
      `;
      reviewList.appendChild(div);
    });

    document.querySelectorAll(".delete-review-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const reviewId = button.dataset.id;
        if (confirm("¿Seguro que deseas eliminar esta reseña?")) {
          deleteReview(reviewId);
        }
      });
    });
  }

  function loadReviews() {
    const productId = getProductId();
    if (!productId) {
      reviewList.innerHTML = "<p>No se especificó un producto.</p>";
      return;
    }

    fetch(`/api/products/${productId}/reviews`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar reseñas");
        return res.json();
      })
      .then((data) => {
        renderReviews(data);
      })
      .catch((err) => {
        reviewList.innerHTML = `<p>Error al cargar reseñas</p>`;
        console.error(err);
      });
  }

  ratingIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      selectedRating = parseInt(icon.dataset.value, 10);
      ratingIcons.forEach((i) => {
        const value = parseInt(i.dataset.value, 10);
        i.classList.toggle("selected", value <= selectedRating);
      });
    });
  });

  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const comment = document.getElementById("comment").value.trim();
    const productId = getProductId();

    if (!name || !comment || selectedRating === 0 || !productId) {
      alert("Por favor completa todos los campos y selecciona una valoración.");
      return;
    }

    const newReview = { name, comment, rating: selectedRating, productId };

    fetch(`/api/products/${productId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReview),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al guardar la reseña");
        return res.json();
      })
      .then(() => {
        reviewForm.reset();
        selectedRating = 0;
        ratingIcons.forEach((i) => i.classList.remove("selected"));
        loadReviews();
      })
      .catch((err) => {
        alert("No se pudo guardar la reseña");
        console.error(err);
      });
  });

  function deleteReview(reviewId) {
    const productId = getProductId();
    fetch(`/api/products/${productId}/reviews/${reviewId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo eliminar");
        return res.json();
      })
      .then(() => {
        loadReviews();
      })
      .catch((err) => {
        alert("Error al eliminar la reseña");
        console.error(err);
      });
  }

  loadReviews();
});
