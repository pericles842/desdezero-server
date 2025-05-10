const PayModel = require('../models/PayModel');
const { validationResult } = require('express-validator');
const { saveImageToFolder, deleteImageFromFolder } = require('../utils/Upload');
const logError = require('../utils/LogsCapture');

require('dotenv').config();

const PayController = {

    createMethodPay: async (req, res) => {
        try {

            let pay = JSON.parse(req.body.pay);
            if (req.file) {

                //!si se esta editando borrar la imagen anterior
                if (pay.url_img.trim()) await deleteImageFromFolder(pay.url_img)
                //si la imagen existe guardamos el archivo
                const result = await saveImageToFolder(req.file, 'img_pay');
                pay.url_img = result.relativePath

            }

            pay = pay.id == 0 ?
                await PayModel.createPayMethod(pay) :
                await PayModel.updatePayMethod(pay)


            res.send(pay);

        } catch (error) {
            logError(error.message)
            res.status(500).send(error.message);

        }
    },
    getAllPayMethods: async (req, res) => {
        try {

            let methods = await PayModel.getAllPayMethods();
            methods.forEach(m => m.datos = JSON.parse(m.datos))

            res.send(methods);

        } catch (error) {
            logError(error.message)
            res.status(500).send(error.message);
        }
    },
    deletePayMethod: async (req, res) => {
        try {
            const { id } = req.params;
            let pay = await PayModel.getPayMethodById(id)
            
            await deleteImageFromFolder(pay.url_img)
            
            await PayModel.deletePayMethod(id);

            res.send(1);
        } catch (error) {
            logError(error.message);
            res.status(500).send('Error al eliminar el método de pago');
        }
    },


};

module.exports = PayController;