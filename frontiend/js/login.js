const API_LOGIN = "https://aulapeque-api.onrender.com/api/auth/login";

const formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const correo = document.getElementById("correo").value.trim();
  const password = document.getElementById("password").value;

  if (!correo || !password) {
    alert("Debes ingresar correo y contraseña");
    return;
  }

  try {
    const respuesta = await fetch(API_LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        correo,
        password
      })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      alert(datos.mensaje || "Error al iniciar sesión");
      return;
    }

    localStorage.setItem("token", datos.token);
    localStorage.setItem(
      "usuario",
      JSON.stringify(datos.usuario)
    );

    window.location.href = "home.html";

  } catch (error) {
    console.error(error);
    alert("No se pudo conectar con el servidor");
  }
});