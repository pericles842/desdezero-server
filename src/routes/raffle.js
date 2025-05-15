const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { upload } = require('../utils/Upload');


const router = express.Router();
const RaffleController = require('../controllers/RaffleController');
const AuthTokenHeader = require('../utils/AuthTokenHeader');

//*Definir la rutas
router.post('/create', AuthTokenHeader, upload.single('image'), RaffleController.createRaffle);
router.get('/list', AuthTokenHeader, RaffleController.listRaffle);
//activa una rifa
router.get('/activate/:id', AuthTokenHeader, [param('id').exists().withMessage('El id es obligatorio')],
    RaffleController.activeRaffleProcess);
//trae la rifa activa
router.get('/active', RaffleController.getRaffleActive)
router.delete('/delete/:id',AuthTokenHeader,RaffleController.deleteRaffle)

router.get('/tickets', RaffleController.getTicketsByEmail); // Listar tickets por busqueda

router.post('/winner/create', AuthTokenHeader, RaffleController.createWinner); // Crea o actualiza un ganador

module.exports = router;