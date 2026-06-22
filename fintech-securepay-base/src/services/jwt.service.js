const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

/**
 * Genera un Token JWT firmado con clave privada asimétrica (RS256).
 */
function signToken(user) {

  const privateKey = fs.readFileSync(
    path.join(__dirname, '../../private.pem'),
    'utf8'
  );

  const payload = {
    sub: user.id,
    name: user.name

  };

  return jwt.sign(
    payload,
    privateKey,
    {
      algorithm: 'RS256',
      expiresIn: '2m'
    }
  );
}

/**
 * Verifica un Token JWT utilizando la clave pública asimétrica (RS256).
 */
function verifyToken(token) {

  const publicKey = fs.readFileSync(
    path.join(__dirname, '../../public.pem'),
    'utf8'
  );

  return jwt.verify(
    token,
    publicKey,
    {
      algorithms: ['RS256']
    }
  );
}

module.exports = {
  signToken,
  verifyToken
};