const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const ProductController = require('../controllers/productController');

//*listar productos
router.get('/list', ProductController.listProducts);

//*Definir la ruta para buscar un producto
router.post('/search', [
    body('search').isLength({ min: 0 }).notEmpty().withMessage('El search es obligatorio')
], ProductController.searchProduct);


module.exports = router;