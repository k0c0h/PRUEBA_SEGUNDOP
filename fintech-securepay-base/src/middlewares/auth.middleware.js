const jwtService = require('../services/jwt.service');

/**
 * Middleware de Autenticación para proteger las rutas de la Fintech.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      error: 'Acceso no autorizado',
      message: 'Falta la cabecera Authorization en la petición.'
    });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      error: 'Acceso no autorizado',
      message: 'Formato de cabecera de autenticación debe ser Bearer <token>.'
    });
  }

  const token = parts[1];

  try {

    // Validar el JWT usando la clave pública
    const decodedToken = jwtService.verifyToken(token);

    // Guardar el usuario autenticado en la petición
    req.user = decodedToken;

    // Continuar con la ejecución
    next();

  } catch (error) {

    // Token expirado
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        error: 'Token expirado',
        message: error.message
      });
    }

    // Token inválido
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token inválido',
        message: error.message
      });
    }

    // Cualquier otro error
    return res.status(401).json({
      error: 'Error de autenticación',
      message: error.message
    });
  }
}

module.exports = authMiddleware;