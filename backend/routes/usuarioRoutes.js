const express = require("express");
const bcrypt = require("bcryptjs");

const Usuario = require("../models/Usuario");

const {
  verificarToken,
  permitirRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

console.log("✅ usuarioRoutes.js cargado correctamente");

router.get("/prueba", (req, res) => {
  res.json({
    mensaje: "usuarioRoutes funciona correctamente"
  });
});

router.get("/perfil", verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario
      .findById(req.usuario.id)
      .select("-password");

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    res.json(usuario);

  } catch (error) {
    console.error("Error al obtener perfil:", error);

    res.status(500).json({
      mensaje: "Error al obtener el perfil",
      error: error.message
    });
  }
});

router.put("/perfil", verificarToken, async (req, res) => {
  try {
    const {
      nombre,
      correo,
      passwordActual,
      nuevaPassword
    } = req.body;

    const usuario = await Usuario.findById(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    if (nombre) {
      usuario.nombre = nombre.trim();
    }

    if (correo) {
      const correoNormalizado = correo.trim().toLowerCase();

      const correoOcupado = await Usuario.findOne({
        correo: correoNormalizado,
        _id: { $ne: usuario._id }
      });

      if (correoOcupado) {
        return res.status(400).json({
          mensaje: "Ese correo ya está registrado"
        });
      }

      usuario.correo = correoNormalizado;
    }

    if (nuevaPassword) {
      if (!passwordActual) {
        return res.status(400).json({
          mensaje: "Debes ingresar tu contraseña actual"
        });
      }

      if (nuevaPassword.length < 6) {
        return res.status(400).json({
          mensaje: "La nueva contraseña debe tener al menos 6 caracteres"
        });
      }

      const passwordCorrecta = await bcrypt.compare(
        passwordActual,
        usuario.password
      );

      if (!passwordCorrecta) {
        return res.status(400).json({
          mensaje: "La contraseña actual no es correcta"
        });
      }

      usuario.password = await bcrypt.hash(nuevaPassword, 10);
    }

    await usuario.save();

    res.json({
      mensaje: "Perfil actualizado correctamente",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error("Error al actualizar perfil:", error);

    res.status(500).json({
      mensaje: "Error al actualizar perfil",
      error: error.message
    });
  }
});

router.get(
  "/",
  verificarToken,
  permitirRoles("directivo"),
  async (req, res) => {
    try {
      const usuarios = await Usuario
        .find()
        .select("-password")
        .sort({ nombre: 1 });

      res.json(usuarios);

    } catch (error) {
      console.error("Error al obtener usuarios:", error);

      res.status(500).json({
        mensaje: "Error al obtener usuarios",
        error: error.message
      });
    }
  }
);

router.post(
  "/crear",
  verificarToken,
  permitirRoles("directivo"),
  async (req, res) => {
    try {
      const {
        nombre,
        correo,
        password,
        rol
      } = req.body;

      if (!nombre || !correo || !password || !rol) {
        return res.status(400).json({
          mensaje: "Todos los campos son obligatorios"
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          mensaje: "La contraseña debe tener al menos 6 caracteres"
        });
      }

      const rolesValidos = [
        "directivo",
        "profesor",
        "asistente"
      ];

      if (!rolesValidos.includes(rol)) {
        return res.status(400).json({
          mensaje: "El rol seleccionado no es válido"
        });
      }

      const correoNormalizado = correo.trim().toLowerCase();

      const usuarioExiste = await Usuario.findOne({
        correo: correoNormalizado
      });

      if (usuarioExiste) {
        return res.status(400).json({
          mensaje: "El correo ya está registrado"
        });
      }

      const usuario = new Usuario({
        nombre: nombre.trim(),
        correo: correoNormalizado,
        password: await bcrypt.hash(password, 10),
        rol
      });

      await usuario.save();

      res.status(201).json({
        mensaje: "Usuario creado correctamente",
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          correo: usuario.correo,
          rol: usuario.rol
        }
      });

    } catch (error) {
      console.error("Error al crear usuario:", error);

      res.status(500).json({
        mensaje: "Error al crear usuario",
        error: error.message
      });
    }
  }
);

router.put(
  "/:id/rol",
  verificarToken,
  permitirRoles("directivo"),
  async (req, res) => {
    try {
      const { rol } = req.body;

      const rolesValidos = [
        "directivo",
        "profesor",
        "asistente"
      ];

      if (!rolesValidos.includes(rol)) {
        return res.status(400).json({
          mensaje: "Rol no válido"
        });
      }

      const usuario = await Usuario
        .findByIdAndUpdate(
          req.params.id,
          { rol },
          {
            new: true,
            runValidators: true
          }
        )
        .select("-password");

      if (!usuario) {
        return res.status(404).json({
          mensaje: "Usuario no encontrado"
        });
      }

      res.json({
        mensaje: "Rol actualizado correctamente",
        usuario
      });

    } catch (error) {
      console.error("Error al modificar rol:", error);

      res.status(500).json({
        mensaje: "Error al modificar rol",
        error: error.message
      });
    }
  }
);

module.exports = router;