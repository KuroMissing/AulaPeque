const API_REGISTRO = "https://aulapeque-api.onrender.com/api/auth/register";

const formRegistro = document.getElementById("formRegistro");

formRegistro.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const password = document.getElementById("password").value;
  const confirmarPassword =
    document.getElementById("confirmarPassword").value;

  if (password !== confirmarPassword) {
    alert("Las contraseñas no coinciden");
    return;
  }

  try {
    const respuesta = await fetch(API_REGISTRO, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombre,
        correo,
        password
      })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      alert(datos.mensaje || "Error al crear la cuenta");
      return;
    }

    alert(datos.mensaje);
    window.location.href = "login.html";

  } catch (error) {
    console.error(error);
    alert("No se pudo conectar con el servidor");
  }
});