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

router.get('/get-rates', PayController.getDollarRates);
router.post('/create-pay', upload.single('image'), PayController.createUserPayment);
router.get('/sales', AuthTokenHeader, PayController.getSales)


router.get('/approve-sale/:id', AuthTokenHeader, [param('id').exists().withMessage('El id es obligatorio')], PayController.approveSale)


module.exports = router;