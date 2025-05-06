const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const RaffleController = require('../controllers/RaffleController');
const AuthTokenHeader = require('../utils/AuthTokenHeader');

//*Definir la ruta para buscar un producto
router.post('/create', AuthTokenHeader, RaffleController.createRaffle);
router.get('/list', AuthTokenHeader, RaffleController.listRaffle);

module.exports = router;