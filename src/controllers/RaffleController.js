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
    getTicketsByEmail: async (req, res) => {
        try {
            const { search } = req.query; // Extraer el parámetro 'search' de los query params

            if (!search) {
                return res.status(400).send('El parámetro "search" es requerido.');
            }

            const tickets = await RaffleModel.getTicketsByEmail(search);

            res.send(tickets);
        } catch (error) {
            logError(error);
            res.status(500).send('Error al listar tickets por búsqueda', error.message);
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
    },
    createWinner: async (req, res) => {
        try {
            //ERRORES QUE DEFINOMOS EN LA RUTAS
            const errors = validationResult(req);

            if (!errors.isEmpty())
                return res.status(400).json({ errores: errors.array() });

            // let ganador = JSON.parse(req.body.ganador);
            let ganador = req.body.ganador;

            ganador = !ganador.id ? await RaffleModel.createWinner(ganador) : await RaffleModel.updateWinner(ganador);

            res.send(ganador);
        } catch (error) {
            logError(error)
            res.status(500).send(error.message);
        }
    }
};

module.exports = RaffleController;