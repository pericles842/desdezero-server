
const userRoutes = require('./user'); // Nueva ruta
const raffleRoutes = require('./raffle');
const payRoutes = require('./pay');


module.exports = {
    '/user': userRoutes, // Ruta nueva agregada
    '/rifa': raffleRoutes,
    '/pay': payRoutes
};
