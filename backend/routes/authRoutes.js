const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Usuario = require("../models/Usuario");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({
        mensaje: "Nombre, correo y contraseña son obligatorios"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        mensaje: "La contraseña debe tener al menos 6 caracteres"
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

    const passwordEncriptada = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      nombre: nombre.trim(),
      correo: correoNormalizado,
      password: passwordEncriptada,

      rol: "asistente"
    });

    await nuevoUsuario.save();

    res.status(201).json({
      mensaje: "Cuenta creada correctamente. Ya puedes iniciar sesión.",
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol
      }
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar usuario",
      error: error.message
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        mensaje: "Correo y contraseña son obligatorios"
      });
    }

    const usuario = await Usuario.findOne({
      correo: correo.trim().toLowerCase()
    });

    if (!usuario) {
      return res.status(400).json({
        mensaje: "Correo o contraseña incorrectos"
      });
    }

    const passwordCorrecta = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!passwordCorrecta) {
      return res.status(400).json({
        mensaje: "Correo o contraseña incorrectos"
      });
    }

    const token = jwt.sign(
      {
        id: usuario._id,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.json({
      mensaje: "Login correcto",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al iniciar sesión",
      error: error.message
    });
  }
});

module.exports = router;