const express = require('express');
const { body, validationResult } = require('express-validator');
const AuthTokenHeader = require('../utils/AuthTokenHeader');


const router = express.Router();
const UserController = require('../controllers/UserController');

//*Definir la ruta para buscar un producto
router.post('/auth', UserController.authUserMaster);
router.post('/create-config', AuthTokenHeader, UserController.saveConfigWeb);
router.get('/config', UserController.getConfig);

module.exports = router;