const jwt = require('jsonwebtoken');
require('dotenv').config();



/**
 * Verificar que el usuario est  autenticado
 * @function authenticateToken
 * @param {Object} req - La solicitud
 * @param {Object} res - La respuesta
 * @param {function} next - La siguiente funci n en la cadena de middleware
 * @returns {void}
 */

const authenticateToken = (req, res, next) => {

  
  // Obtener el token del encabezado de la solicitud (Authorization)
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).json({ message: 'Usuario no esta autenticado' });
  }

  // Verificar el token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token no válido.' });
    }
    // Si el token es válido, se añade la información del usuario al objeto request
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
