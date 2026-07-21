const API_CURSOS = "https://aulapeque-api.onrender.com/api/cursos";
const API_ACTIVIDADES = "https://aulapeque-api.onrender.com/api/actividades";

const params = new URLSearchParams(window.location.search);
const cursoIdURL = params.get("curso");

const selectCurso = document.getElementById("curso");
const formActividad = document.getElementById("formActividad");
const listaActividades = document.getElementById("listaActividades");
const volverCurso = document.getElementById("volverCurso");

if (volverCurso && cursoIdURL) {
  volverCurso.href = `alumnos.html?curso=${cursoIdURL}`;
}

async function cargarCursos() {
  try {
    const respuesta = await fetch(API_CURSOS);

    if (!respuesta.ok) {
      throw new Error("Error al consultar cursos");
    }

    const cursos = await respuesta.json();

    selectCurso.innerHTML = `<option value="">Seleccione un curso</option>`;

    cursos.forEach(curso => {
      selectCurso.innerHTML += `
        <option value="${curso._id}">
          ${curso.nombre}
        </option>
      `;
    });

    if (cursoIdURL) {
      selectCurso.value = cursoIdURL;
      cargarActividades(cursoIdURL);
    }

  } catch (error) {
    console.error(error);
    alert("Error al cargar cursos");
  }
}

formActividad.addEventListener("submit", async (e) => {
  e.preventDefault();

  const cursoSeleccionado = selectCurso.value;

  if (!cursoSeleccionado) {
    alert("Debes seleccionar un curso");
    return;
  }

  const nuevaActividad = {
    titulo: document.getElementById("titulo").value,
    fecha: document.getElementById("fecha").value,
    horaInicio: document.getElementById("horaInicio").value,
    horaFin: document.getElementById("horaFin").value,
    tipo: document.getElementById("tipo").value,
    descripcion: document.getElementById("descripcion").value,
    objetivo: document.getElementById("objetivo").value,
    materiales: document.getElementById("materiales").value,
    responsable: document.getElementById("responsable").value,
    estado: document.getElementById("estado").value,
    curso: cursoSeleccionado
  };

  try {
    const respuesta = await fetch(API_ACTIVIDADES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nuevaActividad)
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      alert(datos.mensaje || "Error al guardar actividad");
      return;
    }

    formActividad.reset();
    selectCurso.value = cursoSeleccionado;
    cargarActividades(cursoSeleccionado);

  } catch (error) {
    console.error(error);
    alert("No se pudo conectar con el servidor");
  }
});

selectCurso.addEventListener("change", () => {
  cargarActividades(selectCurso.value);
});

async function cargarActividades(cursoId) {
  if (!cursoId) {
    listaActividades.innerHTML = "<p>Seleccione un curso para ver sus actividades.</p>";
    return;
  }

  try {
    const respuesta = await fetch(`${API_ACTIVIDADES}/curso/${cursoId}`);

    if (!respuesta.ok) {
      throw new Error("Error al consultar actividades");
    }

    const actividades = await respuesta.json();

    listaActividades.innerHTML = "";

    if (actividades.length === 0) {
      listaActividades.innerHTML = "<p>Este curso no tiene actividades registradas.</p>";
      return;
    }

    actividades.forEach(act => {
  listaActividades.innerHTML += `
    <div class="actividad-card tipo-actividad-${act.tipo}">

      <span class="estado-actividad estado-${act.estado || "pendiente"}">
        ${act.estado || "pendiente"}
      </span>

      <h3>📚 ${act.titulo}</h3>

      <div class="alumno-info">
        <p><strong>📌 Tipo:</strong> ${act.tipo}</p>
        <p><strong>📅 Fecha:</strong> ${new Date(act.fecha).toLocaleDateString()}</p>
        <p><strong>🕒 Horario:</strong> ${act.horaInicio} ${act.horaFin ? "- " + act.horaFin : ""}</p>
        <p><strong>🎯 Objetivo:</strong> ${act.objetivo || "No registrado"}</p>
        <p><strong>🎨 Materiales:</strong> ${act.materiales || "No registrados"}</p>
        <p><strong>👩‍🏫 Responsable:</strong> ${act.responsable || "No registrado"}</p>
      </div>

      <p>${act.descripcion || "Sin descripción"}</p>

      <button class="btn-eliminar" onclick="eliminarActividad('${act._id}')">
        🗑️ Eliminar actividad
      </button>
    </div>
  `;
});

  } catch (error) {
    console.error(error);
    listaActividades.innerHTML = "<p>Error al cargar actividades.</p>";
  }
}

async function eliminarActividad(id) {
  const confirmar = confirm("¿Seguro que deseas eliminar esta actividad?");

  if (!confirmar) return;

  try {
    const respuesta = await fetch(`${API_ACTIVIDADES}/${id}`, {
      method: "DELETE"
    });

    if (!respuesta.ok) {
      alert("Error al eliminar actividad");
      return;
    }

    cargarActividades(selectCurso.value);

  } catch (error) {
    console.error(error);
    alert("No se pudo conectar con el servidor");
  }
}

cargarCursos();
cargarActividades(cursoIdURL);