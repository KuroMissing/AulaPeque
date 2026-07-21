const params = new URLSearchParams(window.location.search);
const alumnoId = params.get("id");
const cursoId = params.get("curso");

const datosAlumno = document.getElementById("datosAlumno");
const volverCurso = document.getElementById("volverCurso");
const btnObservacion = document.getElementById("btnObservacion");
const selectEstado = document.getElementById("estadoConductual");
const guardarEstado = document.getElementById("guardarEstado");
const listaObservaciones = document.getElementById("listaObservaciones");

if (cursoId) {
  volverCurso.href = `alumnos.html?curso=${cursoId}`;
}

async function cargarFichaAlumno() {
  try {
    if (!alumnoId) {
      datosAlumno.innerHTML = "<p>No se recibió el ID del alumno.</p>";
      return;
    }

    const respuesta = await fetch(`http://localhost:5000/api/alumnos/${alumnoId}`);
    const alumno = await respuesta.json();

    datosAlumno.innerHTML = `
      <div class="avatar ficha-avatar">👧</div>

      <h2>${alumno.nombre}</h2>

      <div class="alumno-info">
        <p><strong>Edad:</strong> ${alumno.edad} años</p>
        <p><strong>Apoderado:</strong> ${alumno.apoderado || "No registrado"}</p>
        <p><strong>Teléfono:</strong> ${alumno.telefonoApoderado || "No registrado"}</p>
        <p><strong>Curso:</strong> ${alumno.curso?.nombre || "No registrado"}</p>
      </div>

      <span class="estado ${alumno.estadoConductual || "verde"}">
        ${alumno.estadoConductual || "verde"}
      </span>
    `;

    selectEstado.value = alumno.estadoConductual || "verde";

    const cursoReal = alumno.curso?._id || cursoId;

    btnObservacion.href = `observaciones.html?alumno=${alumno._id}&curso=${cursoReal}`;

  } catch (error) {
    console.error(error);
    datosAlumno.innerHTML = "<p>Error al cargar ficha del alumno.</p>";
  }
}

guardarEstado.addEventListener("click", async () => {
  try {
    const nuevoEstado = selectEstado.value;

    const respuesta = await fetch(`http://localhost:5000/api/alumnos/${alumnoId}/estado`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        estadoConductual: nuevoEstado
      })
    });

    if (!respuesta.ok) {
      alert("Error al actualizar estado");
      return;
    }

    alert("Estado actualizado correctamente");
    cargarFichaAlumno();

  } catch (error) {
    console.error(error);
    alert("No se pudo conectar con el servidor");
  }
});

async function cargarObservaciones() {
  try {
    if (!alumnoId) {
      listaObservaciones.innerHTML = "<p>No se recibió el ID del alumno.</p>";
      return;
    }

    const respuesta = await fetch(`http://localhost:5000/api/observaciones/alumno/${alumnoId}`);
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
    const respuesta = await fetch(`http://localhost:5000/api/observaciones/${id}`, {
      method: "DELETE"
    });

    if (!respuesta.ok) {
      alert("Error al eliminar observación");
      return;
    }

    cargarObservaciones();

  } catch (error) {
    console.error(error);
    alert("No se pudo conectar con el servidor");
  }
}

cargarFichaAlumno();
cargarObservaciones();