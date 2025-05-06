const ProductsModel = require('../models/productModel');
const { body, validationResult } = require('express-validator');

const ProductController = {
    
    listProducts: async (req, res) => {
        try {
            const usuarios = await ProductsModel.listProducts();
            res.send(usuarios);
        } catch (error) {
            res.status(500).send('Error al obtener Productos');
        }
    },

    searchProduct: async (req, res) => {
        try {

            //ERRORES QUE DEFINOMOS EN LA RUTAS
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errores: errors.array() });
            }

            let { search } = req.body;

            const product = await ProductsModel.searchProduct(search)??{};
         
            
            res.status(200).send(product);

        } catch (error) {

            res.status(500).send('Error al obtener Producto');
        }
    }
};

module.exports = ProductController;