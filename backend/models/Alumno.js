const mongoose = require("mongoose");

const AlumnoSchema = new mongoose.Schema({

  nombre: {
    type: String,
    required: true
  },

  edad: {
    type: Number,
    required: true
  },

  apoderado: {
    type: String
  },

  telefonoApoderado: {
    type: String
  },

  curso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Curso",
    required: true
  },

  estadoConductual: {
    type: String,
    enum: ["verde", "amarillo", "rojo"],
    default: "verde"
  }

}, {
  timestamps: true
});

module.exports = mongoose.model("Alumno", AlumnoSchema);