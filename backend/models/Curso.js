const mongoose = require("mongoose");

const CursoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },

  nivel: {
    type: String,
    required: true,
    trim: true
  },

  descripcion: {
    type: String,
    trim: true
  },

  profesor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Curso", CursoSchema);