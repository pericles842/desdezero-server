const axios = require('axios');
const puppeteer = require('puppeteer');


const RatesModel = require('../models/RatesModel');
const logError = require('../utils/LogsCapture');


const RatesController = {
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
    }, GetRatesPydolarVe: async (req, res) => {
        try {
            const response = await axios.get('https://pydolarve.org/api/v2/dollar');

            const { datetime, monitors } = response.data

            res.send(monitors)

        } catch (error) {
            logError(error)
            res.status(500).send(error)
        }
    },
    listRatesDesdezero: async (req, res) => {
        try {

            const rates = await RatesModel.listRatesDesdezero();

            res.send(rates);
        } catch (error) {
            logError(error)
            res.status(500).send(error)
        }
    },

}

module.exports = RatesController;