const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        mensaje: "No se proporcionó un token válido"
      });
    }

    const token = authorization.split(" ")[1];

    const usuarioToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.usuario = usuarioToken;

    next();

  } catch (error) {
    return res.status(401).json({
      mensaje: "Token inválido o vencido"
    });
  }
}

function permitirRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        mensaje: "Usuario no autenticado"
      });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        mensaje: "No tienes permisos para realizar esta acción"
      });
    }

    next();
  };
}

module.exports = {
  verificarToken,
  permitirRoles
};