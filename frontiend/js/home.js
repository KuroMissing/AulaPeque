(() => {
  const usuarioTexto = localStorage.getItem("usuario");
  const token = localStorage.getItem("token");

  let usuario = null;

  try {
    usuario = usuarioTexto
      ? JSON.parse(usuarioTexto)
      : null;
  } catch (error) {
    console.error("Error al leer el usuario:", error);
  }

  if (!usuario || !token) {
    localStorage.clear();
    window.location.href = "login.html";
    return;
  }

  const bienvenida = document.getElementById("bienvenida");
  const cajasUsuario = document.querySelectorAll(".user-box");
  const enlaceAdministracion =
    document.getElementById("enlaceAdministracion");
  const tarjetaAdministracion =
    document.getElementById("tarjetaAdministracion");
  const cerrarSesion =
    document.getElementById("cerrarSesion");

  const nombresRoles = {
    directivo: "Directivo/a",
    profesor: "Profesor/a",
    asistente: "Asistente"
  };

  if (bienvenida) {
    bienvenida.textContent = `Bienvenido/a, ${usuario.nombre}`;
  }

  cajasUsuario.forEach((caja) => {
    caja.textContent =
      `👤 ${usuario.nombre} · ${nombresRoles[usuario.rol] || usuario.rol}`;
  });

  console.log("Rol detectado en home:", usuario.rol);

  if (usuario.rol === "directivo") {
    if (enlaceAdministracion) {
      enlaceAdministracion.classList.remove("oculto");
    }

    if (tarjetaAdministracion) {
      tarjetaAdministracion.classList.remove("oculto");
    }
  }

  if (cerrarSesion) {
    cerrarSesion.addEventListener("click", (evento) => {
      evento.preventDefault();

      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      window.location.href = "login.html";
    });
  }
})();