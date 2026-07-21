const express = require("express");

const Curso = require("../models/Curso");
const Usuario = require("../models/Usuario");

const {
  verificarToken,
  permitirRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


router.get("/mis-cursos", verificarToken, async (req, res) => {
  try {

    console.log("Usuario consultando cursos:", req.usuario);

    let cursos = [];

    if (req.usuario.rol === "directivo") {

      cursos = await Curso
        .find()
        .populate("profesor", "nombre correo rol")
        .sort({ nombre: 1 });

    } else if (req.usuario.rol === "profesor") {

      cursos = await Curso
        .find({
          profesor: req.usuario.id
        })
        .populate("profesor", "nombre correo rol")
        .sort({ nombre: 1 });

    } else if (req.usuario.rol === "asistente") {

      cursos = [];

    }

    res.json(cursos);

  } catch (error) {

    console.error("ERROR MIS CURSOS:", error);

    res.status(500).json({
      mensaje: "Error al obtener los cursos",
      error: error.message
    });

  }
});


router.post(
  "/",
  verificarToken,
  permitirRoles("directivo"),
  async (req, res) => {

    try {

      const {
        nombre,
        nivel,
        descripcion
      } = req.body;

      if (!nombre || !nivel) {

        return res.status(400).json({
          mensaje: "Nombre y nivel son obligatorios"
        });

      }

      const curso = new Curso({
        nombre: nombre.trim(),
        nivel: nivel.trim(),
        descripcion: descripcion?.trim() || "",
        profesor: null
      });

      await curso.save();

      res.status(201).json({
        mensaje: "Curso creado correctamente",
        curso
      });

    } catch (error) {

      console.error("ERROR CREAR CURSO:", error);

      res.status(500).json({
        mensaje: "Error al crear curso",
        error: error.message
      });

    }

  }
);


router.get("/", async (req, res) => {

  try {

    const cursos = await Curso
      .find()
      .populate("profesor", "nombre correo rol")
      .sort({ nombre: 1 });

    res.json(cursos);

  } catch (error) {

    console.error("ERROR CURSOS:", error);

    res.status(500).json({
      mensaje: "Error al obtener cursos",
      error: error.message
    });

  }

});


router.put(
  "/:cursoId/profesor",
  verificarToken,
  permitirRoles("directivo"),
  async (req, res) => {

    try {

      const { profesorId } = req.body;

      const curso = await Curso.findById(
        req.params.cursoId
      );

      if (!curso) {

        return res.status(404).json({
          mensaje: "Curso no encontrado"
        });

      }



      if (!profesorId) {

        curso.profesor = null;

        await curso.save();

        return res.json({
          mensaje: "Profesor retirado del curso"
        });

      }



      const profesor = await Usuario.findById(
        profesorId
      );

      if (!profesor) {

        return res.status(404).json({
          mensaje: "Profesor no encontrado"
        });

      }



      if (profesor.rol !== "profesor") {

        return res.status(400).json({
          mensaje:
            "El usuario seleccionado no es profesor"
        });

      }



      curso.profesor = profesor._id;

      await curso.save();


      const cursoActualizado = await Curso
        .findById(curso._id)
        .populate(
          "profesor",
          "nombre correo rol"
        );


      res.json({
        mensaje:
          "Profesor asignado correctamente",
        curso: cursoActualizado
      });


    } catch (error) {

      console.error(
        "ERROR ASIGNAR PROFESOR:",
        error
      );

      res.status(500).json({
        mensaje:
          "Error al asignar profesor",
        error: error.message
      });

    }

  }
);


module.exports = router;