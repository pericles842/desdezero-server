const PayModel = require('../models/PayModel');
const { validationResult } = require('express-validator');
const { saveImageToFolder, deleteImageFromFolder } = require('../utils/Upload');
const logError = require('../utils/LogsCapture');
const puppeteer = require('puppeteer');

require('dotenv').config();

const PayController = {

    createMethodPay: async (req, res) => {
        try {

            let pay = JSON.parse(req.body.pay);
            if (req.file) {

                //!si la imagen se repite no agregar otra
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
    getDollarRates: async (req, res) => {
        try {
            browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            const page = await browser.newPage();
            await page.goto('https://monitordolarvenezuela.com/', {
                waitUntil: 'networkidle2',
                timeout: 20000
            });

            const datos = await page.$$eval(
                '.grid.grid-cols-6.gap-2.my-2 > div:not(:first-child) > div.border-2.rounded-lg.shadow.p-2.text-center.relative.mt-3.lg\\:mt-0',
                cards => cards.map((card, id) => ({
                    id,
                    title: card.querySelector('h3')?.innerText.trim() || null,
                    imgUrl: card.querySelector('img')?.src || null,
                    price: card.querySelector('p.font-bold.text-xl')?.innerText
                        .split(' ').slice(-1)[0].trim() || null
                }))
            );

            res.send(datos);
        } catch (err) {
            logError(err.message);
            return res.status(500).json({ error: 'Error al obtener las tasas del dólar' });
        }

    }
};

module.exports = PayController;