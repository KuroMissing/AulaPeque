const mongoose = require("mongoose");

const ObservacionSchema = new mongoose.Schema({
  alumno: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Alumno",
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario"
  },
  tipo: {
    type: String,
    enum: ["conducta", "aprendizaje", "emocional", "participacion", "otro"],
    default: "otro"
  },
  detalle: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Observacion", ObservacionSchema);