const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { upload } = require('../utils/Upload');


const router = express.Router();
const PayController = require('../controllers/PayController');
const AuthTokenHeader = require('../utils/AuthTokenHeader');

//*Definir la rutas
router.post('/create', AuthTokenHeader, upload.single('image'), PayController.createMethodPay);
router.get('/list', PayController.getAllPayMethods);
router.delete('/delete/:id', AuthTokenHeader, PayController.deletePayMethod);


module.exports = router;