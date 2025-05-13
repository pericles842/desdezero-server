const PayModel = require('../models/PayModel');
const UserModel = require('../models/UserModel');
const RaffleModel = require('../models/RaffleModel');
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

    },
    createUserPayment: async (req, res) => {

        try {
            let body = JSON.parse(req.body.pay)

            //extraemos usuarios
            const { id, nombre, correo, cod_num, telefono, password, creado_en } = body
            let user = { id, nombre, correo, telefono, password, creado_en, cod_num };

            //codigo de numero mas el telefono
            user.telefono = user.cod_num.replace('+', '') + '' + user.telefono

            //verificamos si ya existe el usuario, para ver si o creamos o no 
            let userExist = await UserModel.searchUserByPhone(user.telefono)
            user = userExist.length == 0 ? await UserModel.saveUser(user) : userExist

            //verificamos si existe una rifa activa  
            let rifa_activa = await RaffleModel.getRaffleActive()
            if (!('status' in rifa_activa)) return res.status(400).json(
                { error: 'No hay rifas activas, no se puede crear el pago' });


            //extremos los datos del pago
            let { total, total_bs, tasa, comprobante, status, cantidad_tickets } = body
            let pay = {
                id: 0, total, total_bs, tasa, comprobante, status, cantidad_tickets,
                id_usuario: user.id,
                id_metodo_pago: body.detalle_metodo_pago.id,
                id_rifa: rifa_activa.id,
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


            res.send({ ...pay, nombre, telefono });
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
};

module.exports = PayController;