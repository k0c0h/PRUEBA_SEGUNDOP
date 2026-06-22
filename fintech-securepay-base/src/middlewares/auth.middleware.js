const jwtService = require('../services/jwt.service');

/**
 * Middleware de Autenticación para proteger las rutas de la Fintech.
 * 
 * TODO (Estudiante):
 * 1. Extraer la cabecera 'authorization'.
 * 2. Verificar que empiece con la palabra 'Bearer '.
 * 3. Extraer el token crudo y validarlo usando jwtService.verifyToken(token).
 * 4. Si el token es válido, adjuntar el payload al objeto 'req.user' y llamar a next().
 * 5. Si hay error en la validación (TokenExpiredError, JsonWebTokenError), capturar la excepción y responder 401/403.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      error: 'Acceso no autorizado',
      message: 'Falta la cabecera Authorization en la petición.'
    });
  }

  // Simulación incompleta de extracción del Bearer Token
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      error: 'Acceso no autorizado',
      message: 'Formato de cabecera de autenticación debe ser Bearer <token>.'
    });
  }

  const token = parts[1];

  try {
    const decodedToken = jwtService.verifyToken(token);

    req.user = decodedToken;
    // NOTA TEMPORAL: Por ahora el middleware deja pasar la petición sin validar para evitar bloqueos iniciales,
    // pero el estudiante debe implementar la validación criptográfica correspondiente.
    next();
  } catch (error) {

    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        error: 'Token expirado',
        message: error.message
      });
    }

    return res.status(401).json({
      error: 'Token inválido',
      message: error.message
    });
  }
}

module.exports = authMiddleware;
