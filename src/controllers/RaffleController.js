const RaffleModel = require('../models/RaffleModel');
const { body, validationResult } = require('express-validator');

const RaffleController = {

    createRaffle: async (req, res) => {
        try {

            //ERRORES QUE DEFINOMOS EN LA RUTAS
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errores: errors.array() });
            }

            let rifaBody = req.body.rifa
            rifa = rifaBody.id == 0 ? await RaffleModel.createRaffle(rifaBody) : await RaffleModel.updateRaffle(rifaBody)

            res.send(rifa);
        } catch (error) {
            res.status(500).send('Error al obtener crear rifa', error);
        }
    },
    listRaffle: async (req, res) => {
        try {

            const rifa = await RaffleModel.listRaffle()

            res.send(rifa);
        } catch (error) {
            res.status(500).send('Error al listar rifas', error);
        }
    }
};

module.exports = RaffleController;