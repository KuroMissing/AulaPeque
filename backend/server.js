const dns = require("node:dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const conectarDB = require("./config/db.js");

const app = express();

console.log("📁 Servidor cargado desde:", __filename);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor AulaPeque funcionando correctamente");
});

app.use("/api/auth", require("./routes/authRoutes"));

console.log("🔄 Cargando rutas de usuarios...");

app.use("/api/usuarios", require("./routes/usuarioRoutes"));
app.use("/api/cursos", require("./routes/cursoRoutes"));
app.use("/api/alumnos", require("./routes/alumnoRoutes"));
app.use("/api/actividades", require("./routes/actividadRoutes"));
app.use("/api/observaciones", require("./routes/observacionRoutes"));

app.use((req, res) => {
  res.status(404).json({
    mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

const PORT = process.env.PORT || 5000;

async function iniciarServidor() {
  try {
    await conectarDB();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("❌ No fue posible iniciar AulaPeque:", error.message);
    process.exit(1);
  }
}

iniciarServidor();