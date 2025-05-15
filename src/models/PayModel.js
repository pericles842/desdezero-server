const { poolPromise } = require('../config/db');
const TikeModel = require('../models/TikeModel');

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
                `INSERT INTO pagos (
                id_metodo_pago,
                total,
                total_bs,
                tasa,
                comprobante,
                estatus,
                fecha,
                cantidad_tickets,
                id_rifa,
                referencia, 
                nombre,
                correo,
                telefono)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [payment.id_metodo_pago, payment.total,
                payment.total_bs, payment.tasa, payment.comprobante, payment.status, payment.fecha,
                payment.cantidad_tickets, payment.id_rifa, payment.referencia,
                payment.nombre, payment.correo, payment.telefono]
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
                pagos.nombre AS usuario,
                pagos.referencia,
                pagos.correo,
                CONCAT('+', pagos.telefono) AS telefono,
                pagos.comprobante,
                pagos.cantidad_tickets,
                pagos.estatus,
                pagos.total,
                pagos.tasa,
                pagos.total_bs,
                metodos_pago.nombre AS metodo_pago,
                metodos_pago.tipo,
                pagos.fecha,
                rifas.nombre AS rifa,
            GROUP_CONCAT(tickets.codigo ORDER BY tickets.codigo SEPARATOR ',') AS tikes
            FROM pagos
            INNER JOIN rifas ON rifas.id = pagos.id_rifa
            INNER JOIN metodos_pago ON metodos_pago.id = pagos.id_metodo_pago
            LEFT JOIN tickets ON tickets.id_pago = pagos.id
            WHERE rifas.id = (
                SELECT MAX(id)
                FROM rifas
                WHERE status = 'activa'
            )
            GROUP BY pagos.id
            ORDER BY pagos.fecha;`);

            return rows;

        } catch (error) {
            if (error instanceof Error) {
                error.message;
            }
            throw error.message;
        }
    }

    static async approveSale(id_payment) {
        try {
            const db = await poolPromise; // Esperamos la conexión
            await db.execute(`UPDATE pagos SET estatus = 'aprobado' WHERE id = ?`, [id_payment]);
            const [[pay]] = await db.execute(`SELECT * FROM pagos WHERE id = ?`, [id_payment]);
            return pay;

        } catch (error) {
            if (error instanceof Error) {
                error.message;
            }
            throw error.message;
        }
    }

    /**
     * Rechaza un pago
     *
     * @static
     * @param {*} id_payment
     * @return {*} 
     * @memberof PayModel
     */
    static async rejectSale(id_payment) {
        try {
            const db = await poolPromise; // Esperamos la conexión
            await db.execute(`UPDATE pagos SET estatus = 'rechazado' WHERE id = ?`, [id_payment]);
        } catch (error) {
            if (error instanceof Error) {
                error.message;
            }
            throw error.message;
        }
    }

}

module.exports = PayModel;