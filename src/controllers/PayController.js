const { saveImageToFolder, deleteImageFromFolder } = require('../utils/Upload');
const { validationResult } = require('express-validator');
const puppeteer = require('puppeteer');
const moment = require('moment');
require('moment/locale/es');
moment.locale('es');

const PayModel = require('../models/PayModel');
const TikeModel = require('../models/TikeModel');
const RaffleModel = require('../models/RaffleModel');
const UserModel = require('../models/UserModel');
const logError = require('../utils/LogsCapture');
const EmailController = require('../controllers/EmailController');

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
            res.status(500).send(error);

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
            res.status(500).send(error);
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
            res.status(500).send(error);
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

            // 🛡️ Trucos anti-bot
            await page.setUserAgent(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            );

            await page.setViewport({ width: 1280, height: 800 });


            await page.evaluateOnNewDocument(() => {
                // Elimina navigator.webdriver
                Object.defineProperty(navigator, 'webdriver', { get: () => false });

                // Fake de plugins
                Object.defineProperty(navigator, 'plugins', {
                    get: () => [1, 2, 3],
                });

                // Fake de idiomas
                Object.defineProperty(navigator, 'languages', {
                    get: () => ['es-ES', 'es'],
                });

                // Fake de pantalla externa
                Object.defineProperty(window, 'chrome', {
                    get: () => ({ runtime: {} }),
                });
            });

            // 🕵️‍♂️ Navegación
            await page.goto('https://monitordolarvenezuela.com/', {
                waitUntil: 'networkidle2',
                timeout: 20000
            });

            // 🕐 Espera segura para precios cargados
            await page.waitForSelector('p.font-bold.text-xl', { visible: true });
            await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300));// Espera adicional si los datos llegan por JS


            // Scroll rápido a mitad de página con delay corto
            await page.evaluate(() => window.scrollTo(0, window.innerHeight / 2));
            await new Promise(r => setTimeout(r, 200 + Math.random() * 200));

            // Movimiento pequeño del mouse
            await page.mouse.move(100, 100);
            await new Promise(r => setTimeout(r, 100 + Math.random() * 100));

            // 📊 Recolección de datos
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

        } catch (error) {
            logError(error);
            return res.status(500).json({ error: error.message });
        } finally {
            if (browser) {
                try {
                    await browser.close();
                } catch (closeErr) {
                    console.error('⚠️ Error al cerrar el navegador:', closeErr.message);
                }
            }
        }
    },
    createUserPayment: async (req, res) => {

        try {
            let body = JSON.parse(req.body.pay)

            //extraemos usuarios
            const { cod_num, telefono } = body
            let user = { telefono, cod_num };

            //codigo de numero mas el telefono
            user.telefono = user.cod_num.replace('+', '') + '' + user.telefono

            //verificamos si existe una rifa activa  
            let rifa_activa = await RaffleModel.getRaffleActive()
            if (!('status' in rifa_activa)) return res.status(400).json(
                { error: 'No hay rifas activas, no se puede crear el pago' });


            //extremos los datos del pago
            let { total, total_bs, tasa,
                comprobante, status, cantidad_tickets,
                nombre, correo, referencia } = body

            let pay = {
                id: 0, total, total_bs, tasa, comprobante, status, cantidad_tickets,
                nombre, correo, referencia,
                id_metodo_pago: body.detalle_metodo_pago.id,
                id_rifa: rifa_activa.id,
                telefono: user.telefono,
                fecha: new Date()
            }
            if (req.file) {
                //!si la imagen se repite no agregar otra
                // if (pay.url_img.trim()) await deleteImageFromFolder(pay.url_img)
                //si la imagen existe guardamos el archivo
                const result = await saveImageToFolder(req.file, 'img_pagos');
                pay.comprobante = result.relativePath

            } else return res.status(400).json(
                { error: 'No se cargo el pago' });



            pay = await PayModel.createPayment(pay)

            //actualizamos el estatus de l arifa
            await RaffleModel.updateActiveRaffleParticipants(rifa_activa.id)


            res.send(pay);
        } catch (error) {
            logError(error.message);
            res.status(500).send(error);
        }
    },
    getSales: async (req, res) => {
        try {

            const sales = await PayModel.getSales()
            res.send(sales)
        } catch (error) {
            logError(error.message)
            res.status(500).send(error)
        }
    },
    approveSale: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errores: errors.array() });
            }

            const { id } = req.params
            //aprobamos la venta
            const sales = await PayModel.approveSale(id)
            //obtenemos la rifa activa
            let rifa_activa = await RaffleModel.getRaffleActive()
            // generamos los tikes y comprobamos que no se repitan 
            let tikes = await TikeModel.generateTikes(sales.cantidad_tickets, rifa_activa.id)
            //guardamos los tikes , saveTikes ya valida que no se repitan
            await TikeModel.saveTikes(tikes, rifa_activa.id, sales)
            await RaffleModel.updateActiveRaffleParticipants(rifa_activa.id)

            //obtenemos las ventas con los tikes 
            let sale = await PayModel.getSales()

            //filtramos por el pago en cuestion
            sale = sale.find(sale => sale.id === parseInt(id, 10));

            let tikes_generados_correo = sale.tikes != null ? sale.tikes.split(',').map((tike) => tike.trim()) : []

            //obejeto del correo
            let correo = {
                nombre: sales.nombre,
                telefono: sales.telefono,
                correo: sales.correo,
                total: sales.total,
                fecha: moment(sales.fecha).format('D [de] MMMM [de] YYYY'),
                tikes: tikes_generados_correo,
                cantidad_tickets: sales.cantidad_tickets,
                nombre_rifa: rifa_activa.nombre
            }

            let email = await EmailController.sendEmail(correo);

            res.send({ sale, email })
        } catch (error) {
            logError(error.message)
            res.status(500).send(error)
        }
    },
    rejectSale: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ errores: errors.array() });
            }

            const { id } = req.params;

            await PayModel.rejectSale(id);
            let sale = await PayModel.getSales();
            sale = sale.find(sale => sale.id === parseInt(id, 10));
            let rifa_activa = await RaffleModel.getRaffleActive()
            await RaffleModel.updateActiveRaffleParticipants(rifa_activa.id)

            let config = await UserModel.getConfig()

            let correo = {
                nombre: sale.usuario,
                telefono: config.config.telefono,
                correo: sale.correo,
                total: sale.total,
                fecha: moment(sale.fecha).format('D [de] MMMM [de] YYYY'),
                nombre_rifa: rifa_activa.nombre,
                correo_soporte: config.config.correo
            }

            let email = await EmailController.rejectEmail(correo);
            res.send({ sale, email });
        } catch (error) {
            logError(error.message)
            res.status(500).send(error)
        }
    },
};

module.exports = PayController;