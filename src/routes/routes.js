
const userRoutes = require('./user'); // Nueva ruta
const raffleRoutes = require('./raffle');

module.exports = {
    '/user': userRoutes, // Ruta nueva agregada
    '/rifa': raffleRoutes
};
