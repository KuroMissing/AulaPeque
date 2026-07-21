const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },

  correo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  rol: {
    type: String,
    enum: ["profesor", "asistente", "directivo"],
    default: "asistente"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Usuario", UsuarioSchema);