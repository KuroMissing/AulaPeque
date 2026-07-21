const API_PERFIL = "https://aulapeque-api.onrender.com/api/usuarios/perfil";

const token = localStorage.getItem("token");
const usuarioGuardadoTexto = localStorage.getItem("usuario");

let usuarioGuardado = null;

try {
  usuarioGuardado = usuarioGuardadoTexto
    ? JSON.parse(usuarioGuardadoTexto)
    : null;
} catch (error) {
  console.error("El usuario guardado no es válido:", error);
}

if (!token || !usuarioGuardado) {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
}

const formPerfil = document.getElementById("formPerfil");
const nombreInput = document.getElementById("nombre");
const correoInput = document.getElementById("correo");
const rolUsuario = document.getElementById("rolUsuario");

async function obtenerRespuesta(respuesta) {
  const texto = await respuesta.text();

  try {
    return texto ? JSON.parse(texto) : {};
  } catch (error) {
    console.error("El servidor no devolvió JSON:", texto);
    return {
      mensaje: `Respuesta inesperada del servidor (${respuesta.status})`
    };
  }
}

async function cargarPerfil() {
  try {
    console.log("Consultando:", API_PERFIL);
    console.log("Token existente:", Boolean(token));

    const respuesta = await fetch(API_PERFIL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    });

    const datos = await obtenerRespuesta(respuesta);

    console.log("Estado de respuesta:", respuesta.status);
    console.log("Respuesta del backend:", datos);

    if (!respuesta.ok) {
      if (respuesta.status === 401) {
        alert(datos.mensaje || "Tu sesión venció. Inicia sesión nuevamente.");

        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        window.location.href = "login.html";
        return;
      }

      if (respuesta.status === 404) {
        alert(
          "No se encontró la ruta del perfil. Revisa usuarioRoutes.js y server.js."
        );
        return;
      }

      alert(datos.mensaje || "Error al cargar el perfil");
      return;
    }

    nombreInput.value = datos.nombre || "";
    correoInput.value = datos.correo || "";
    rolUsuario.textContent = datos.rol || "Sin rol";

  } catch (error) {
    console.error("Error completo al cargar perfil:", error);

    alert(
      "No fue posible cargar el perfil. Revisa que el backend esté encendido en el puerto 5000."
    );
  }
}

formPerfil.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const passwordActual =
    document.getElementById("passwordActual").value;

  const nuevaPassword =
    document.getElementById("nuevaPassword").value;

  if (nuevaPassword && !passwordActual) {
    alert("Debes escribir tu contraseña actual.");
    return;
  }

  const datosActualizados = {
    nombre: nombreInput.value.trim(),
    correo: correoInput.value.trim(),
    passwordActual,
    nuevaPassword
  };

  try {
    const respuesta = await fetch(API_PERFIL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      },
      body: JSON.stringify(datosActualizados)
    });

    const datos = await obtenerRespuesta(respuesta);

    console.log("Respuesta al actualizar perfil:", datos);

    if (!respuesta.ok) {
      if (respuesta.status === 401) {
        alert("Tu sesión venció. Inicia sesión nuevamente.");

        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        window.location.href = "login.html";
        return;
      }

      alert(datos.mensaje || "Error al actualizar el perfil");
      return;
    }

    localStorage.setItem(
      "usuario",
      JSON.stringify(datos.usuario)
    );

    rolUsuario.textContent = datos.usuario.rol || "Sin rol";

    document.getElementById("passwordActual").value = "";
    document.getElementById("nuevaPassword").value = "";

    alert(datos.mensaje || "Perfil actualizado correctamente");

  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    alert("No se pudo conectar con el servidor");
  }
});

cargarPerfil();