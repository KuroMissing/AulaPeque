const express = require("express");
const router = express.Router();
const Alumno = require("../models/Alumno");

router.post("/", async (req, res) => {
  try {
    const alumno = new Alumno(req.body);
    await alumno.save();
    res.json(alumno);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear alumno",
      error: error.message
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const alumnos = await Alumno.find().populate("curso");
    res.json(alumnos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener todos los alumnos",
      error: error.message
    });
  }
});

router.get("/curso/:cursoId", async (req, res) => {
  try {
    const alumnos = await Alumno.find({ curso: req.params.cursoId });
    res.json(alumnos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener alumnos",
      error: error.message
    });
  }
});

router.put("/:id/estado", async (req, res) => {
  try {
    const alumno = await Alumno.findByIdAndUpdate(
      req.params.id,
      {
        estadoConductual: req.body.estadoConductual
      },
      {
        new: true
      }
    );

    if (!alumno) {
      return res.status(404).json({
        mensaje: "Alumno no encontrado"
      });
    }

    res.json(alumno);

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar estado",
      error: error.message
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const alumno = await Alumno.findById(req.params.id).populate("curso");
    res.json(alumno);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener alumno",
      error: error.message
    });
  }
});

module.exports = router;