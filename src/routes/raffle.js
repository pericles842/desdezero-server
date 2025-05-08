const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { upload } = require('../utils/Upload');


const router = express.Router();
const RaffleController = require('../controllers/RaffleController');
const AuthTokenHeader = require('../utils/AuthTokenHeader');

//*Definir la ruta para buscar un producto
router.post('/create', AuthTokenHeader, upload.single('image'), RaffleController.createRaffle);
router.get('/list', AuthTokenHeader, RaffleController.listRaffle);
router.get('/activate/:id', AuthTokenHeader, [
    param('id').exists().withMessage('El id es obligatorio')
], RaffleController.activeRaffleProcess);

module.exports = router;