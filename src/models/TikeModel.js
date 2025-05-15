const { poolPromise } = require('../config/db');

class TikeModel {

    /**
     * Verificamos si los tikes no tiene repetidos y generamos los dígitos 
     *
     * @static
     * @param {*} cantidad_tikes
     * @param {*} id_rifa
     * @return {*} 
     * @memberof TikeModel
     */
    static async generateTikes(cantidad_tikes, id_rifa) {
        try {

            const db = await poolPromise;
            const [tk_rifa] = await db.execute('SELECT codigo FROM tickets WHERE id_rifa = ?', [id_rifa]);

            const createTickets = () => {
                const numero = Math.floor(1000 + Math.random() * 9000);
                return numero;
            };

            // Creamos un Set con los tickets ya existentes (como números)
            const tikes_existentes = new Set(tk_rifa.map(tk => parseInt(tk.codigo, 10)));

            let nuevos = new Set();

            while (nuevos.size < cantidad_tikes) {
                const ticket = createTickets();
                if (!tikes_existentes.has(ticket)) {
                    nuevos.add(ticket);
                }
            }

            return [...nuevos]; // array listo para insertar



        } catch (error) {
            console.error('', error);
            throw error;
        }
    }

    /**
     *Guardamos un arreglo de tikes en una rifa activa
     *
     * @static
     * @param {*} tickets arregloo de tikes
     * @param {*} id_rifa
     * @param {*} id_pago
     * @memberof TikeModel
     */
    static async saveTikes(tickets, id_rifa, id_pago) {
        try {
            const db = await poolPromise;
            let creado_en = new Date();
            const values = tickets.map(ticket => [ticket, id_rifa, id_pago, creado_en]);

            await db.query(
                `INSERT INTO tickets (codigo, id_rifa, id_pago , creado_en) VALUES ?`,
                [values]
            );

        } catch (error) {
            console.error(error);
            throw error;
        }
    }


}

module.exports = TikeModel;