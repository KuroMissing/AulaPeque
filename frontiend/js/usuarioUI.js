(() => {
  const tokenUsuarioUI = localStorage.getItem("token");
  const usuarioTextoUI = localStorage.getItem("usuario");

  let usuarioActualUI = null;

  try {
    usuarioActualUI = usuarioTextoUI
      ? JSON.parse(usuarioTextoUI)
      : null;
  } catch (error) {
    console.error("Error al leer el usuario guardado:", error);
  }

  if (!tokenUsuarioUI || !usuarioActualUI) {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "login.html";
    return;
  }

  const nombresRolesUI = {
    directivo: "Directivo/a",
    profesor: "Profesor/a",
    asistente: "Asistente"
  };

  const nombreUsuarioUI =
    usuarioActualUI.nombre || "Usuario";

  const rolUsuarioUI =
    nombresRolesUI[usuarioActualUI.rol] ||
    usuarioActualUI.rol ||
    "Sin rol";

  document.querySelectorAll(".user-box").forEach((caja) => {
    caja.textContent =
      `👤 ${nombreUsuarioUI} · ${rolUsuarioUI}`;
  });
})();