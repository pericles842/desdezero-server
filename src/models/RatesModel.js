const { poolPromise } = require('../config/db');

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
}

module.exports = RatesModel;