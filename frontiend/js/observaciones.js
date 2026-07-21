const API_ALUMNOS = "http://localhost:5000/api/alumnos";
const API_OBSERVACIONES = "http://localhost:5000/api/observaciones";

const params = new URLSearchParams(window.location.search);
const alumnoIdURL = params.get("alumno");
const cursoIdURL = params.get("curso");

const selectAlumno = document.getElementById("alumno");
const formObservacion = document.getElementById("formObservacion");
const listaObservaciones = document.getElementById("listaObservaciones");
const volverCurso = document.getElementById("volverCurso");

if (volverCurso && cursoIdURL) {
  volverCurso.href = `alumnos.html?curso=${cursoIdURL}`;
}

async function cargarAlumnos() {
  try {
    const respuesta = await fetch(API_ALUMNOS);
    const alumnos = await respuesta.json();

    selectAlumno.innerHTML = `<option value="">Seleccione un alumno</option>`;

    alumnos.forEach(alumno => {
      selectAlumno.innerHTML += `
        <option value="${alumno._id}">
          ${alumno.nombre}
        </option>
      `;
    });

    if (alumnoIdURL) {
      selectAlumno.value = alumnoIdURL;
      cargarObservaciones(alumnoIdURL);
    }

  } catch (error) {
    console.error(error);
    alert("Error al cargar alumnos");
  }
}

formObservacion.addEventListener("submit", async (e) => {
  e.preventDefault();

  const alumnoSeleccionado = selectAlumno.value;

  if (!alumnoSeleccionado) {
    alert("Debes seleccionar un alumno");
    return;
  }

  const nuevaObservacion = {
    alumno: alumnoSeleccionado,
    tipo: document.getElementById("tipo").value,
    detalle: document.getElementById("detalle").value
  };

  try {
    const respuesta = await fetch(API_OBSERVACIONES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nuevaObservacion)
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      alert(datos.mensaje || "Error al guardar observación");
      return;
    }

    formObservacion.reset();
    selectAlumno.value = alumnoSeleccionado;
    cargarObservaciones(alumnoSeleccionado);

  } catch (error) {
    console.error(error);
    alert("No se pudo conectar con el servidor");
  }
});

selectAlumno.addEventListener("change", () => {
  cargarObservaciones(selectAlumno.value);
});

async function cargarObservaciones(alumnoId) {
  if (!alumnoId) {
    listaObservaciones.innerHTML = "<p>Seleccione un alumno para ver sus observaciones.</p>";
    return;
  }

  try {
    const respuesta = await fetch(`${API_OBSERVACIONES}/alumno/${alumnoId}`);
    const observaciones = await respuesta.json();

    listaObservaciones.innerHTML = "";

    if (observaciones.length === 0) {
      listaObservaciones.innerHTML = "<p>Este alumno no tiene observaciones registradas.</p>";
      return;
    }

    observaciones.forEach(obs => {
      listaObservaciones.innerHTML += `
        <div class="observacion-card tipo-${obs.tipo}">
          <h3>${obs.tipo}</h3>
          <p>${obs.detalle}</p>
          <small>${new Date(obs.fecha).toLocaleString()}</small>

          <button 
            class="btn-eliminar"
            onclick="eliminarObservacion('${obs._id}')">
            🗑️ Eliminar
          </button>
        </div>
      `;
    });

  } catch (error) {
    console.error(error);
    listaObservaciones.innerHTML = "<p>Error al cargar observaciones.</p>";
  }
}

async function eliminarObservacion(id) {
  const confirmar = confirm("¿Seguro que deseas eliminar esta observación?");

  if (!confirmar) return;

  try {
    const respuesta = await fetch(`${API_OBSERVACIONES}/${id}`, {
      method: "DELETE"
    });

    if (!respuesta.ok) {
      alert("Error al eliminar observación");
      return;
    }

    cargarObservaciones(selectAlumno.value);

  } catch (error) {
    console.error(error);
    alert("No se pudo conectar con el servidor");
  }
}

cargarAlumnos();
cargarObservaciones(alumnoIdURL);