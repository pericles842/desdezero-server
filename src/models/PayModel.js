const { poolPromise } = require('../config/db');

class PayModel {

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




}

module.exports = PayModel;