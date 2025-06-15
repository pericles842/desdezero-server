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
router.get('/deactivate/:id', RaffleController.deactivateRaffleProcess);

router.delete('/delete/:id', AuthTokenHeader, RaffleController.deleteRaffle)

router.get('/tickets/:search', RaffleController.getTicketsByEmail); // Listar tickets por busqueda

router.post('/winner/create', AuthTokenHeader, RaffleController.createWinner); // Crea o actualiza un ganador
router.get('/winner', RaffleController.getUserWin);

router.delete('/winner/delete', AuthTokenHeader, RaffleController.deleteWin);

//PREMIOS
router.post('/premios', AuthTokenHeader, upload.single('image'), RaffleController.createAward);
router.delete('/premios/:id', AuthTokenHeader, RaffleController.deleteAward);
router.get('/premios', RaffleController.listAwards);

module.exports = router;