const API_USUARIOS = "http://localhost:5000/api/usuarios";

const token = localStorage.getItem("token");
const usuarioActual =
  JSON.parse(localStorage.getItem("usuario"));

if (!token || !usuarioActual) {
  window.location.href = "login.html";
}

if (usuarioActual.rol !== "directivo") {
  alert("No tienes permiso para acceder a esta sección");
  window.location.href = "home.html";
}

const formUsuario = document.getElementById("formUsuario");
const listaUsuarios = document.getElementById("listaUsuarios");

formUsuario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const nuevoUsuario = {
    nombre: document.getElementById("nombre").value.trim(),
    correo: document.getElementById("correo").value.trim(),
    password: document.getElementById("password").value,
    rol: document.getElementById("rol").value
  };

  try {
    const respuesta = await fetch(`${API_USUARIOS}/crear`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(nuevoUsuario)
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      alert(datos.mensaje || "Error al crear usuario");
      return;
    }

    alert(datos.mensaje);
    formUsuario.reset();
    cargarUsuarios();

  } catch (error) {
    console.error(error);
    alert("No se pudo conectar con el servidor");
  }
});

async function cargarUsuarios() {
  try {
    const respuesta = await fetch(API_USUARIOS, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const usuarios = await respuesta.json();

    if (!respuesta.ok) {
      alert(usuarios.mensaje || "Error al cargar usuarios");
      return;
    }

    listaUsuarios.innerHTML = "";

    usuarios.forEach((usuario) => {
      listaUsuarios.innerHTML += `
        <div class="usuario-card">
          <div>
            <h3>${usuario.nombre}</h3>
            <p>${usuario.correo}</p>
          </div>

          <div class="control-rol">
            <select id="rol-${usuario._id}">
              <option value="asistente"
                ${usuario.rol === "asistente" ? "selected" : ""}>
                Asistente
              </option>

              <option value="profesor"
                ${usuario.rol === "profesor" ? "selected" : ""}>
                Profesor/a
              </option>

              <option value="directivo"
                ${usuario.rol === "directivo" ? "selected" : ""}>
                Directivo/a
              </option>
            </select>

            <button onclick="actualizarRol('${usuario._id}')">
              Guardar rol
            </button>
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.error(error);
    listaUsuarios.innerHTML =
      "<p>Error al cargar los usuarios.</p>";
  }
}

async function actualizarRol(usuarioId) {
  const nuevoRol =
    document.getElementById(`rol-${usuarioId}`).value;

  try {
    const respuesta = await fetch(
      `${API_USUARIOS}/${usuarioId}/rol`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          rol: nuevoRol
        })
      }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      alert(datos.mensaje || "Error al actualizar rol");
      return;
    }

    alert(datos.mensaje);
    cargarUsuarios();

  } catch (error) {
    console.error(error);
    alert("No se pudo conectar con el servidor");
  }
}

cargarUsuarios();