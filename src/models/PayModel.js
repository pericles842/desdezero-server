const { poolPromise } = require('../config/db');

class PayModel {

    /**
     *Crea un metodo de pago para mostrar en la pagina
     *
     * @static
     * @param {*} pay
     * @return {*} 
     * @memberof PayModel
     */
    static async createPayMethod(pay) {
        try {
            const db = await poolPromise; // Esperamos la conexión
            // let creado_en = new Date()
            const [{ insertId }] = await db.execute(`INSERT INTO metodos_pago (tipo, nombre, titular, min_tickets, url_img, datos)
                VALUES(?, ?, ?, ?, ?, ?)`,
                [pay.tipo, pay.nombre, pay.titular,
                pay.min_tickets, pay.url_img, JSON.stringify(pay.datos)]);

            pay.id = insertId
            return pay;

        } catch (error) {
            if (error instanceof Error) {
                error.message
            }
            throw error.message;
        }
    }
    static async updatePayMethod(pay) {
        try {
            const db = await poolPromise; // Esperamos la conexión
            const [{ affectedRows }] = await db.execute(
                `UPDATE metodos_pago SET
                tipo = ?,
                nombre = ?,
                titular = ?,
                min_tickets = ?,
                url_img = ?, datos = ?
                WHERE id = ?`,
                [pay.tipo, pay.nombre, pay.titular, pay.min_tickets,
                pay.url_img, JSON.stringify(pay.datos), pay.id]
            );

            return pay;

        } catch (error) {
            if (error instanceof Error) {
                error.message
            }
            throw error.message;
        }
    }
    static async getAllPayMethods() {
        try {
            const db = await poolPromise; // Esperamos la conexión
            const [rows] = await db.execute(
                `SELECT * FROM metodos_pago ORDER BY id ASC`
            );

            return rows;

        } catch (error) {
            if (error instanceof Error) {
                error.message
            }
            throw error.message;
        }
    }
    static async deletePayMethod(id) {
        try {
            const db = await poolPromise; // Esperamos la conexión
            const [{ affectedRows }] = await db.execute(`DELETE FROM metodos_pago WHERE id = ?`, [id]);
            return affectedRows;

        } catch (error) {
            if (error instanceof Error) {
                error.message;
            }
            throw error.message;
        }
    }

    static async getPayMethodById(id) {
        try {
            const db = await poolPromise; // Esperamos la conexión
            const [[payMethod]] = await db.execute(`SELECT * FROM metodos_pago WHERE id = ?`, [id]);
            return payMethod;

        } catch (error) {
            if (error instanceof Error) {
                error.message;
            }
            throw error.message;
        }
    }

    /**
     * Inserta un pago 
     *
     * @static
     * @param {*} payment
     * @return {*} 
     * @memberof PayModel
     */
    static async createPayment(payment) {
        try {
            const db = await poolPromise; // Esperamos la conexión

            const [{ insertId }] = await db.execute(
                `INSERT INTO pagos (id_usuario, id_metodo_pago, total, total_bs, tasa,
                 comprobante, estatus, fecha, cantidad_tickets, id_rifa)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [payment.id_usuario, payment.id_metodo_pago, payment.total,
                payment.total_bs, payment.tasa, payment.comprobante, payment.status, payment.fecha,
                payment.cantidad_tickets, payment.id_rifa]
            );


            payment.id = insertId;

            return payment;

        } catch (error) {
            if (error instanceof Error) {
                error.message;
            }
            throw error.message;
        }
    }
    static async getSales() {
        try {
            const db = await poolPromise; // Esperamos la conexión
            const [rows] = await db.execute(
                `SELECT 
pagos.id,
usuarios.nombre usuario,
CONCAT('+',usuarios.telefono) telefono ,
pagos.comprobante,
pagos.cantidad_tickets,
pagos.estatus,
pagos.total,
pagos.total_bs,
metodos_pago.nombre metodo_pago,
metodos_pago.tipo,
pagos.fecha,
rifas.nombre rifa
FROM pagos
INNER JOIN usuarios on usuarios.id = pagos.id_usuario
INNER JOIN rifas on rifas.id = pagos.id_rifa
INNER JOIN metodos_pago on metodos_pago.id = pagos.id_metodo_pago
ORDER by pagos.fecha
`
            );

            return rows;

        } catch (error) {
            if (error instanceof Error) {
                error.message;
            }
            throw error.message;
        }
    }

}

module.exports = PayModel;