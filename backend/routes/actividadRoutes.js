const express = require("express");
const router = express.Router();
const Actividad = require("../models/Actividad");

router.post("/", async (req, res) => {
  try {
    const actividad = new Actividad(req.body);
    await actividad.save();

    res.status(201).json(actividad);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear actividad",
      error: error.message
    });
  }
});

router.get("/curso/:cursoId", async (req, res) => {
  try {
    const actividades = await Actividad
      .find({ curso: req.params.cursoId })
      .sort({ fecha: 1, horaInicio: 1 });

    res.json(actividades);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener actividades",
      error: error.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const actividad = await Actividad.findByIdAndDelete(req.params.id);

    if (!actividad) {
      return res.status(404).json({
        mensaje: "Actividad no encontrada"
      });
    }

    res.json({
      mensaje: "Actividad eliminada correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar actividad",
      error: error.message
    });
  }
});

module.exports = router;