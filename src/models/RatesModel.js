const { poolPromise } = require('../config/db');

const axios = require('axios');
const moment = require('moment');
require('moment/locale/es');
moment.locale('es');

const UserModel = require('./UserModel');

class RatesModel {
    /**
     * 
     * @returns 
     */
    static async listRatesDesdezero() {
        try {
            const db = await poolPromise; // Esperamos la conexión
            const [rates] = await db.execute('SELECT * FROM dollar_rates');

            return rates;

        } catch (error) {
            console.error('Error al obtener los rates', error);
            throw error;
        }
    }
    /**
     * ACTUALIZAR las tass del sistema 
     * 
     * 
     *
     * @static
     * @return {*} 
     * @memberof RatesModel
     */
    static async updateRatesProcess() {
        /**
         * todo las tass se actualzad a asl 12am , 8 am , 1pm
         */
        try {
            const { config } = await UserModel.getConfig()
            let rates_current = await this.listRatesDesdezero()

            //*Si falla toma las tasas de la base de datos 
            let rates_to_update = await axios.get('https://pydolarve.org/api/v2/dollar')
                .then(res => res.data.monitors)
                .catch(error => {
                    console.warn('Fallo la petición, usando tasa Manual:', error.message);

                    return rates_current.map(rate => ({
                        ...rate,
                        price_old: rate.price,
                        price: config.tasa_personalizada,
                        last_update: moment().format('D [de] MMMM [de] YYYY')
                    }));
                });

            //*Validamos si es la respuesta de la api o de la base de datos
            if (!Array.isArray(rates_to_update)) {

                //*Transformamos la respuesta de la api un en modelo valido para las tablas 
                const { bcv, enparalelovzla: paralelo } = rates_to_update;

                rates_current.map(rate_current => {
                    if (rate_current.key === 'bcv') {
                        rate_current.price = bcv.price;
                        rate_current.price_old = bcv.price_old;
                        rate_current.last_update = bcv.last_update;

                    } else if (rate_current.key === 'paralelo') {
                        rate_current.price = paralelo.price;
                        rate_current.price_old = paralelo.price_old;
                        rate_current.last_update = paralelo.last_update;

                    } else {
                        rate_current.price_old = rate_current.price
                        rate_current.price = parseFloat(((bcv.price + paralelo.price) / 2).toFixed(2));
                        rate_current.last_update = paralelo.last_update
                    }
                })

            }

            //*Realizamos la actualización
            for (const rate of rates_current) {
                await this.updateRate(rate);
            }

            console.log('Tasas actualizadas', moment().format('D [de] MMMM [de] YYYY'));
        } catch (error) {
            console.error('Error en proceso de actualización', error);
            throw error;
        }
    }

    static async updateRate(rate) {
        try {
            const db = await poolPromise; // Esperamos la conexión
            const [result] = await db.execute(`UPDATE dollar_rates SET 
                price = ?,
                price_old = ?,
                last_update = ? WHERE id = ?`,
                [rate.price, rate.price_old, rate.last_update, rate.id]);
            return result;
        } catch (error) {
            console.error('error al actualizar la tasa', error);
            throw error;
        }
    }
}

module.exports = RatesModel;