const express = require("express");
const router = express.Router();
const Observacion = require("../models/Observacion");

router.post("/", async (req, res) => {
  try {
    const observacion = new Observacion(req.body);
    await observacion.save();
    res.json(observacion);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear observación",
      error: error.message
    });
  }
});

router.get("/alumno/:alumnoId", async (req, res) => {
  try {
    const observaciones = await Observacion.find({
      alumno: req.params.alumnoId
    }).sort({ fecha: -1 });

    res.json(observaciones);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener observaciones",
      error: error.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const observacion = await Observacion.findByIdAndDelete(req.params.id);

    if (!observacion) {
      return res.status(404).json({
        mensaje: "Observación no encontrada"
      });
    }

    res.json({
      mensaje: "Observación eliminada correctamente"
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar observación",
      error: error.message
    });
  }
});

module.exports = router;