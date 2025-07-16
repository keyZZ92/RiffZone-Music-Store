document.addEventListener("DOMContentLoaded", function () {
  // Definir API_BASE_URL por defecto si no existe
  if (typeof API_BASE_URL === "undefined") {
    window.API_BASE_URL =
      "https://music-store-node-2-484977869651.europe-southwest1.run.app";
  }
  // Validación en tiempo real para teléfono
  const telefonoInput = document.getElementById("telefono");
  if (telefonoInput) {
    telefonoInput.addEventListener("input", function (e) {
      let value = telefonoInput.value.replace(/\D/g, "");
      if (value.length > 9) value = value.slice(0, 9);
      telefonoInput.value = value;
    });
    telefonoInput.addEventListener("blur", function () {
      // Validación profesional al perder foco
      if (
        telefonoInput.value.length === 9 &&
        telefonoInput.value[0] !== "0" &&
        /^\d{9}$/.test(telefonoInput.value)
      ) {
        telefonoInput.classList.remove("is-invalid");
        telefonoInput.removeAttribute("aria-invalid");
        document.getElementById("telefonoError").textContent = "";
      }
    });
  }

  // Validación en tiempo real para fecha de nacimiento
  const fechaInput = document.getElementById("fechaNacimiento");
  if (fechaInput) {
    fechaInput.addEventListener("input", function (e) {
      // Solo permite números y /
      fechaInput.value = fechaInput.value.replace(/[^0-9\/]/g, "");
      // Opcional: autoinserta las barras
      let v = fechaInput.value.replace(/\//g, "");
      if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
      if (v.length > 5) v = v.slice(0, 5) + "/" + v.slice(5, 9);
      fechaInput.value = v;
    });
    fechaInput.addEventListener("blur", function () {
      // Validación profesional al perder foco
      const dateParts = fechaInput.value.split("/");
      if (dateParts.length === 3) {
        const [day, month, year] = dateParts;
        const yearNum = parseInt(year, 10);
        const monthNum = parseInt(month, 10);
        const dayNum = parseInt(day, 10);
        const currentYear = new Date().getFullYear();
        let errorMsg = "";
        if (
          isNaN(yearNum) ||
          year.length !== 4 ||
          yearNum < 1900 ||
          yearNum > currentYear
        ) {
          errorMsg = `El año debe tener 4 dígitos y estar entre 1900 y ${currentYear}.`;
        } else if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
          errorMsg = "El mes debe estar entre 01 y 12.";
        } else if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
          errorMsg = "El día debe estar entre 01 y 31.";
        } else {
          // Validar fecha real
          const dateObj = new Date(`${year}-${month}-${day}`);
          if (
            isNaN(dateObj.getTime()) ||
            dateObj.getFullYear() !== yearNum ||
            dateObj.getMonth() + 1 !== monthNum ||
            dateObj.getDate() !== dayNum
          ) {
            errorMsg = "La fecha de nacimiento no es válida.";
          }
        }
        if (errorMsg) {
          fechaInput.classList.add("is-invalid");
          fechaInput.setAttribute("aria-invalid", "true");
          document.getElementById("fechaNacimientoError").textContent =
            errorMsg;
        } else {
          fechaInput.classList.remove("is-invalid");
          fechaInput.removeAttribute("aria-invalid");
          document.getElementById("fechaNacimientoError").textContent = "";
        }
      }
    });
  }
  // Usar API_BASE_URL global definida en auth.js
  const form = document.getElementById("registroForm");
  if (!form) {
    return;
  }

  function setError(input, message) {
    input.classList.add("is-invalid");
    input.setAttribute("aria-invalid", "true");
    const errorDiv = document.getElementById(input.id + "Error");
    if (errorDiv) {
      errorDiv.textContent = message;
    }
  }

  function clearError(input) {
    input.classList.remove("is-invalid");
    input.removeAttribute("aria-invalid");
    const errorDiv = document.getElementById(input.id + "Error");
    if (errorDiv) {
      errorDiv.textContent = "";
    }
  }

  function validarCampo(input) {
    clearError(input);

    // Validación profesional para teléfono: solo 9 dígitos, no puede empezar por 0
    if (input.id === "telefono") {
      const value = input.value.replace(/\D/g, "");
      if (value.length !== 9) {
        setError(input, "El teléfono debe tener exactamente 9 dígitos.");
        return false;
      }
      if (value[0] === "0") {
        setError(input, "El teléfono no puede empezar por 0.");
        return false;
      }
      if (!/^\d{9}$/.test(value)) {
        setError(input, "El teléfono debe contener solo números.");
        return false;
      }
    }

    // Validación profesional para fecha de nacimiento: formato dd/mm/yyyy, año entre 1900 y actual, fecha real
    if (input.id === "fechaNacimiento" && input.value) {
      // Espera formato dd/mm/yyyy
      const dateParts = input.value.split("/");
      if (dateParts.length !== 3) {
        setError(input, "La fecha debe tener el formato DD/MM/AAAA.");
        return false;
      }
      const [day, month, year] = dateParts;
      const yearNum = parseInt(year, 10);
      const monthNum = parseInt(month, 10);
      const dayNum = parseInt(day, 10);
      const currentYear = new Date().getFullYear();
      if (
        isNaN(yearNum) ||
        year.length !== 4 ||
        yearNum < 1900 ||
        yearNum > currentYear
      ) {
        setError(
          input,
          `El año debe tener 4 dígitos y estar entre 1900 y ${currentYear}.`
        );
        return false;
      }
      if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        setError(input, "El mes debe estar entre 01 y 12.");
        return false;
      }
      if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
        setError(input, "El día debe estar entre 01 y 31.");
        return false;
      }
      // Validar fecha real
      const dateObj = new Date(`${year}-${month}-${day}`);
      if (
        isNaN(dateObj.getTime()) ||
        dateObj.getFullYear() !== yearNum ||
        dateObj.getMonth() + 1 !== monthNum ||
        dateObj.getDate() !== dayNum
      ) {
        setError(input, "La fecha de nacimiento no es válida.");
        return false;
      }
    }

    if (!input.checkValidity()) {
      if (input.validity.valueMissing) {
        setError(input, "Este campo es obligatorio.");
      } else if (input.validity.typeMismatch) {
        setError(input, "El valor no tiene el formato correcto.");
      } else if (input.validity.patternMismatch) {
        setError(input, "Formato no válido.");
      } else if (input.validity.tooShort) {
        setError(input, `Debe tener al menos ${input.minLength} caracteres.`);
      }
      return false;
    }
    return true;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let valid = true;

    const campos = [
      form.nombre,
      form.apellidos,
      form.telefono,
      form.pais,
      form.region,
      form.fechaNacimiento,
      form.direccion,
      form.email,
      form.confirmarEmail,
      form.password,
      form.confirmarPassword,
      form.captcha,
    ];

    campos.forEach((campo) => {
      if (!validarCampo(campo)) valid = false;
    });

    if (form.email.value.trim() !== form.confirmarEmail.value.trim()) {
      setError(form.confirmarEmail, "Los correos electrónicos no coinciden.");
      valid = false;
    }
    if (form.password.value !== form.confirmarPassword.value) {
      setError(form.confirmarPassword, "Las contraseñas no coinciden.");
      valid = false;
    } else {
      clearError(form.confirmarPassword);
    }

    // 👉 ENFOCAR PRIMER CAMPO CON ERROR (Paso 3)
    if (!valid) {
      const firstError = form.querySelector(".is-invalid");
      if (firstError) {
        firstError.focus();
      }
      return;
    }

    // Mostrar error en el formulario si la URL no está definida
    if (typeof API_BASE_URL === "undefined") {
      let errorDiv = document.getElementById("apiBaseUrlError");
      if (!errorDiv) {
        errorDiv = document.createElement("div");
        errorDiv.id = "apiBaseUrlError";
        errorDiv.className = "text-danger mb-2";
        form.prepend(errorDiv);
      }
      errorDiv.textContent =
        "Error de configuración: API_BASE_URL no está definida. Contacta con soporte o recarga la página.";
      return;
    } else {
      const errorDiv = document.getElementById("apiBaseUrlError");
      if (errorDiv) errorDiv.textContent = "";
    }

    const usuario = {
      username: form.nombre.value.trim(),
      password: form.password.value,
      email: form.email.value.trim(),
      nombre: form.nombre.value.trim(),
      apellidos: form.apellidos.value.trim(),
      telefono: form.telefono.value.trim(),
      pais: form.pais.value,
      region: form.region.value.trim(),
      fechaNacimiento: form.fechaNacimiento.value,
      direccion: form.direccion.value.trim(),
    };

    fetch(`${API_BASE_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    })
      .then(async (res) => {
        if (res.status === 409) {
          // Usuario o email ya existe
          let errorDiv = document.getElementById("registroError");
          if (!errorDiv) {
            errorDiv = document.createElement("div");
            errorDiv.id = "registroError";
            errorDiv.className = "text-danger mb-2";
            form.prepend(errorDiv);
          }
          errorDiv.textContent = "El usuario o email ya está registrado.";
          return;
        }
        if (!res.ok) {
          let errorDiv = document.getElementById("registroError");
          if (!errorDiv) {
            errorDiv = document.createElement("div");
            errorDiv.id = "registroError";
            errorDiv.className = "text-danger mb-2";
            form.prepend(errorDiv);
          }
          errorDiv.textContent =
            "Error inesperado al registrar. Intenta de nuevo más tarde.";
          return;
        }
        // Si todo va bien, limpiar errores y redirigir o mostrar éxito
        const data = await res.json();
        let errorDiv = document.getElementById("registroError");
        if (errorDiv) errorDiv.textContent = "";
        // Redirigir o mostrar mensaje de éxito
        window.location.href = "index.html";
      })
      .catch((err) => {
        let errorDiv = document.getElementById("registroError");
        if (!errorDiv) {
          errorDiv = document.createElement("div");
          errorDiv.id = "registroError";
          errorDiv.className = "text-danger mb-2";
          form.prepend(errorDiv);
        }
        errorDiv.textContent =
          "Error de red o del servidor. Intenta de nuevo más tarde.";
      });
  });
});

// Mostrar/ocultar contraseña
document.querySelectorAll(".toggle-password").forEach((btn) => {
  btn.addEventListener("click", function () {
    const targetId = this.getAttribute("data-target");
    const input = document.getElementById(targetId);
    const icon = this.querySelector("i");
    if (input.type === "password") {
      input.type = "text";
      icon.classList.remove("bi-eye");
      icon.classList.add("bi-eye-slash");
    } else {
      input.type = "password";
      icon.classList.remove("bi-eye-slash");
      icon.classList.add("bi-eye");
    }
  });
});
