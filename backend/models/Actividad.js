const mongoose = require("mongoose");

const ActividadSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String
  },
  fecha: {
    type: Date,
    required: true
  },
  horaInicio: {
    type: String,
    required: true
  },
  horaFin: {
    type: String
  },
  tipo: {
    type: String,
    enum: ["clase", "juego", "colacion", "descanso", "evaluacion", "otro"],
    default: "clase"
  },
  objetivo: {
    type: String
  },
  materiales: {
    type: String
  },
  responsable: {
    type: String
  },
  estado: {
    type: String,
    enum: ["pendiente", "realizada", "cancelada"],
    default: "pendiente"
  },
  curso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Curso",
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Actividad", ActividadSchema);