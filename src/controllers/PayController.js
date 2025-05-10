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
            methods.forEach(m => {
                try {
                    m.datos = JSON.parse(m.datos)
                } catch (error) { }
            })


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
        let browser;
        try {
            browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            const page = await browser.newPage();

            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            await page.setViewport({ width: 1280, height: 800 });

            // Trucos anti-bot
            await page.evaluateOnNewDocument(() => {
                Object.defineProperty(navigator, 'webdriver', { get: () => false });
            });

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
            logError(err);
            return res.status(500).json({ error: error });
        } finally {
            if (browser) {
                try {
                    await browser.close();
                } catch (closeErr) {
                    console.error('⚠️ Error al cerrar el navegador:', closeErr.message);
                }
            }
        }

    }
};

module.exports = PayController;