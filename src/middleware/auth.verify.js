const jwt = require("jsonwebtoken");

// Secret key for JWT (should be in your environment variables)
const JWT_SECRET = process.env.JWT_SECRET || "djañsjdkasjdasdj1231";
const authenticateToken = (req, res, next) => {
  // Extraer el token de los encabezados de la solicitud
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      header: {
        ok: false,
        message: "Acceso denegado. Token no proporcionado",
        status: 401,
      },
    });
  }

  // Verificar el token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        header: {
          ok: false,
          message: "Token inválido",
          status: 403,
        },
      });
    }

    // Adjuntar el usuario a la solicitud
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
