const mongoose = require("mongoose");

async function conectarDB() {
  try {
    const conexion = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `✅ MongoDB Atlas conectado: ${conexion.connection.host}`
    );

    return conexion;
  } catch (error) {
    console.error(
      "❌ Error al conectar con MongoDB Atlas:",
      error.message
    );

    throw error;
  }
}

module.exports = conectarDB;