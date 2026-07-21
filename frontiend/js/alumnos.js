const params = new URLSearchParams(window.location.search);
const cursoId = params.get("curso");

const listaAlumnos = document.getElementById("listaAlumnos");
const formAlumno = document.getElementById("formAlumno");

console.log("Curso recibido:", cursoId);

formAlumno.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!cursoId) {
    alert("No se recibió el ID del curso. Entra desde Cursos → Ver alumnos.");
    return;
  }

  const nuevoAlumno = {
    nombre: document.getElementById("nombre").value,
    edad: Number(document.getElementById("edad").value),
    apoderado: document.getElementById("apoderado").value,
    telefonoApoderado: document.getElementById("telefonoApoderado").value,
    curso: cursoId
  };

  try {
    const respuesta = await fetch("https://aulapeque-api.onrender.com/api/alumnos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nuevoAlumno)
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      alert(datos.mensaje || "Error al guardar alumno");
      return;
    }

    formAlumno.reset();
    cargarAlumnos();

  } catch (error) {
    console.error(error);
    alert("No se pudo conectar con el servidor");
  }
});

async function cargarAlumnos() {
  try {

    if (!cursoId) {
      listaAlumnos.innerHTML = `
        <p>No se recibió el ID del curso. Entra desde Cursos → Ver alumnos.</p>
      `;
      return;
    }

    const respuesta = await fetch(`https://aulapeque-api.onrender.com/api/alumnos/curso/${cursoId}`);

    if (!respuesta.ok) {
      throw new Error("Error al consultar alumnos");
    }

    const alumnos = await respuesta.json();

    listaAlumnos.innerHTML = "";

    if (alumnos.length === 0) {
      listaAlumnos.innerHTML = "<p>No hay alumnos registrados en este curso.</p>";
      return;
    }

    alumnos.forEach(alumno => {

      listaAlumnos.innerHTML += `
        <div class="alumno-card">

          <div class="avatar">👧</div>

          <h3>${alumno.nombre}</h3>

          <div class="alumno-info">

            <p><strong>Edad:</strong> ${alumno.edad} años</p>

            <p><strong>Apoderado:</strong>
              ${alumno.apoderado || "No registrado"}
            </p>

            <p><strong>Teléfono:</strong>
              ${alumno.telefonoApoderado || "No registrado"}
            </p>

          </div>

          <span class="estado ${alumno.estadoConductual || "verde"}">
            ${alumno.estadoConductual || "verde"}
          </span>

          <a
            href="ficha-alumno.html?id=${alumno._id}&curso=${cursoId}"
            class="btn-alumno">
            👤 Ver ficha
          </a>

          <a
            href="observaciones.html?alumno=${alumno._id}&curso=${cursoId}"
            class="btn-alumno btn-observacion">
            📝 Agregar observación
          </a>

        </div>
      `;

    });

  } catch (error) {
    console.error(error);
    listaAlumnos.innerHTML = "<p>Error al cargar alumnos.</p>";
  }
}

cargarAlumnos();