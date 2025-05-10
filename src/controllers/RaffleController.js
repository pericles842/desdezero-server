const RaffleModel = require('../models/RaffleModel');
const { validationResult } = require('express-validator');
const { saveImageToFolder, deleteImageFromFolder } = require('../utils/Upload');
const logError = require('../utils/LogsCapture');


const RaffleController = {

    createRaffle: async (req, res) => {
        try {

            //ERRORES QUE DEFINOMOS EN LA RUTAS
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errores: errors.array() });
            }

            let rifa = JSON.parse(req.body.rifa);

            if (req.file) {

                 //!si la imagen se repite no agregar otra

                if (rifa.url_img.trim()) await deleteImageFromFolder(rifa.url_img)
                //si la imagen existe guardamos el archivo
                const result = await saveImageToFolder(req.file, 'img_rifas');
                rifa.url_img = result.relativePath

            }

            rifa = rifa.id == 0 ?
                await RaffleModel.createRaffle(rifa) :
                await RaffleModel.updateRaffle(rifa)


            res.send(rifa);
        } catch (error) {
            logError(error)
            res.status(500).send(error.message);
        }
    },
    listRaffle: async (req, res) => {
        try {

            const rifa = await RaffleModel.listRaffle()
            
            res.send(rifa);
        } catch (error) {
            logError(error)
            res.status(500).send('Error al listar rifas', error.message);
        }
    },
    activeRaffleProcess: async (req, res) => {
        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errores: errors.array() });
            }

            const { id } = req.params
            const rifa = await RaffleModel.activeRaffleProcess(id)

            res.send(rifa);
        } catch (error) {
            logError(error)
            res.status(500).send('Error al activar la rifa', error.message);
        }
    },
    getRaffleActive: async (req, res) => {
        try {
            const rifa = await RaffleModel.getRaffleActive()
            res.send(rifa);
        } catch (error) {
            logError(error)
            res.status(500).send('Error al cargar la rifa', error.message);
        }
    },
    deleteRaffle: async (req, res) => {
        try {
            const { id } = req.params
            const rifa = await RaffleModel.getRaffleById(id)
            await deleteImageFromFolder(rifa.url_img)
            await RaffleModel.deleteRaffle(id)
            res.send(rifa);
        } catch (error) {
            logError(error)
            res.status(500).send('Error al cargar la rifa', error.message);
        }
    }
};

module.exports = RaffleController;