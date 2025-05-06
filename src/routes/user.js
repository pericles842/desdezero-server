const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const UserController = require('../controllers/UserController');

//*Definir la ruta para buscar un producto
router.post('/auth', UserController.authUserMaster);

module.exports = router;