const API_CURSOS = "http://localhost:5000/api/cursos";
const API_USUARIOS = "http://localhost:5000/api/usuarios";

const tokenCursos = localStorage.getItem("token");
const usuarioTextoCursos = localStorage.getItem("usuario");

let usuarioCursos = null;
let profesoresDisponibles = [];

try {
  usuarioCursos = usuarioTextoCursos
    ? JSON.parse(usuarioTextoCursos)
    : null;
} catch (error) {
  console.error("Error al leer el usuario:", error);
}

if (!tokenCursos || !usuarioCursos) {
  localStorage.clear();
  window.location.href = "login.html";
}

const listaCursos = document.getElementById("listaCursos");
const formCurso = document.getElementById("formCurso");
const seccionCrearCurso =
  document.getElementById("seccionCrearCurso");
const separadorCrearCurso =
  document.getElementById("separadorCrearCurso");
const subtituloCursos =
  document.getElementById("subtituloCursos");
const descripcionListado =
  document.getElementById("descripcionListado");

if (usuarioCursos.rol !== "directivo") {
  if (seccionCrearCurso) {
    seccionCrearCurso.classList.add("oculto");
  }

  if (separadorCrearCurso) {
    separadorCrearCurso.classList.add("oculto");
  }

  if (subtituloCursos) {
    subtituloCursos.textContent =
      "Consulta los cursos que tienes asignados";
  }

  if (descripcionListado) {
    descripcionListado.textContent =
      "Cursos asociados a tu cuenta";
  }
}

if (formCurso && usuarioCursos.rol === "directivo") {
  formCurso.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const nuevoCurso = {
      nombre: document.getElementById("nombre").value.trim(),
      nivel: document.getElementById("nivel").value.trim(),
      descripcion:
        document.getElementById("descripcion").value.trim()
    };

    try {
      const respuesta = await fetch(API_CURSOS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenCursos}`
        },
        body: JSON.stringify(nuevoCurso)
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        alert(datos.mensaje || "Error al guardar curso");
        return;
      }

      alert(datos.mensaje || "Curso creado correctamente");

      formCurso.reset();
      await cargarCursos();

    } catch (error) {
      console.error("Error al crear curso:", error);
      alert("No se pudo conectar con el servidor");
    }
  });
}

async function cargarProfesores() {
  if (usuarioCursos.rol !== "directivo") {
    return;
  }

  try {
    const respuesta = await fetch(API_USUARIOS, {
      headers: {
        Authorization: `Bearer ${tokenCursos}`
      }
    });

    const usuarios = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        usuarios.mensaje || "Error al obtener usuarios"
      );
    }

    profesoresDisponibles = usuarios.filter(
      (usuario) => usuario.rol === "profesor"
    );

  } catch (error) {
    console.error("Error al cargar profesores:", error);
    profesoresDisponibles = [];
  }
}

function crearOpcionesProfesores(profesorActualId) {
  let opciones = `
    <option value="">
      Sin profesor asignado
    </option>
  `;

  profesoresDisponibles.forEach((profesor) => {
    const seleccionado =
      profesor._id === profesorActualId
        ? "selected"
        : "";

    opciones += `
      <option
        value="${profesor._id}"
        ${seleccionado}>
        ${profesor.nombre}
      </option>
    `;
  });

  return opciones;
}

async function cargarCursos() {
  try {
    listaCursos.innerHTML =
      "<p>Cargando cursos...</p>";

    const respuesta = await fetch(
      `${API_CURSOS}/mis-cursos`,
      {
        headers: {
          Authorization: `Bearer ${tokenCursos}`
        }
      }
    );

    const cursos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        cursos.mensaje || "Error al consultar cursos"
      );
    }

    listaCursos.innerHTML = "";

    if (cursos.length === 0) {
      const mensaje =
        usuarioCursos.rol === "profesor"
          ? "No tienes cursos asignados todavía."
          : "No hay cursos registrados.";

      listaCursos.innerHTML = `
        <div class="card">
          <h3>📚 Sin cursos</h3>
          <p>${mensaje}</p>
        </div>
      `;

      return;
    }

    cursos.forEach((curso) => {
      const profesorActualId =
        curso.profesor?._id || "";

      const profesorActualNombre =
        curso.profesor?.nombre ||
        "Sin profesor asignado";

      let administracionProfesor = "";

      if (usuarioCursos.rol === "directivo") {
        administracionProfesor = `
          <div class="asignacion-profesor">
            <label for="profesor-${curso._id}">
              👩‍🏫 Profesor principal
            </label>

            <select id="profesor-${curso._id}">
              ${crearOpcionesProfesores(profesorActualId)}
            </select>

            <button
              type="button"
              onclick="asignarProfesor('${curso._id}')">
              Guardar asignación
            </button>
          </div>
        `;
      }

      listaCursos.innerHTML += `
        <div class="curso-card">

          <h3>${curso.nombre}</h3>

          <span class="nivel">
            ${curso.nivel}
          </span>

          <p>
            ${curso.descripcion || "Sin descripción"}
          </p>

          <p class="profesor-asignado">
            <strong>👩‍🏫 Profesor:</strong>
            ${profesorActualNombre}
          </p>

          ${administracionProfesor}

          <div class="acciones-curso">
            <a
              href="alumnos.html?curso=${curso._id}"
              class="btn-curso">
              Ver alumnos
            </a>

            <a
              href="agenda.html?curso=${curso._id}"
              class="btn-curso">
              Ver actividades
            </a>
          </div>

        </div>
      `;
    });

  } catch (error) {
    console.error("Error al cargar cursos:", error);

    listaCursos.innerHTML = `
      <div class="card">
        <h3>❌ Error</h3>
        <p>${error.message}</p>
      </div>
    `;
  }
}

async function asignarProfesor(cursoId) {
  const selector = document.getElementById(
    `profesor-${cursoId}`
  );

  if (!selector) {
    return;
  }

  const profesorId = selector.value;

  try {
    const respuesta = await fetch(
      `${API_CURSOS}/${cursoId}/profesor`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenCursos}`
        },
        body: JSON.stringify({
          profesorId
        })
      }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      alert(
        datos.mensaje ||
        "Error al asignar profesor"
      );
      return;
    }

    alert(
      datos.mensaje ||
      "Profesor asignado correctamente"
    );

    await cargarCursos();

  } catch (error) {
    console.error("Error al asignar profesor:", error);
    alert("No se pudo conectar con el servidor");
  }
}

async function iniciarCursos() {
  await cargarProfesores();
  await cargarCursos();
}

iniciarCursos();