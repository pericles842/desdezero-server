const { poolPromise } = require('../config/db');

class RaffleModel {

    //!SE TIENE QUE RETONAR LA IMAGEN EN LA RESPUESTA DE CREAR Y LISTAR
    //!TERMINAR EL PROCEDIMIENTO D EACTIVAR RIFA
    static async createRaffle(rifa) {
        try {
            const db = await poolPromise; // Esperamos la conexión

            let creado_en = new Date()
            const [{ insertId }] = await db.execute(`INSERT INTO rifas 
                                        (nombre, descripcion, url_img, fecha_fin,
                                        precio, status, objetivo_ventas, participantes,
                                        fondos_recaudados, ver_fecha, ver_participantes,
                                        ver_ganador, ver_tickets, creado_en) 
                                        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [rifa.nombre, rifa.descripcion, rifa.url_img, rifa.fecha_fin,
                rifa.precio, rifa.status, rifa.objetivo_ventas, rifa.participantes,
                rifa.fondos_recaudados, rifa.ver_fecha, rifa.ver_participantes,
                rifa.ver_ganador, rifa.ver_tickets, creado_en]);

            rifa.id = insertId

            return rifa;

        } catch (error) {
            console.error('Error al crear rifa', error);
            throw error;
        }
    }


    static async updateRaffle(rifa) {
        try {
            const db = await poolPromise; // Esperamos la conexión

            let creado_en = new Date()
            const [{ affectedRows }] = await db.execute(`UPDATE rifas SET
                                        nombre = ?,
                                        descripcion = ?,
                                        url_img = ?,
                                        fecha_fin = ?,
                                        precio = ?,
                                        status = ?,
                                        objetivo_ventas = ?,
                                        participantes = ?,
                                        fondos_recaudados = ?,
                                        ver_fecha = ?,
                                        ver_participantes = ?,
                                        ver_ganador = ?,
                                        ver_tickets = ?,
                                        creado_en = ?
                                        WHERE id = ?`,
                [rifa.nombre, rifa.descripcion, rifa.url_img, rifa.fecha_fin,
                rifa.precio, rifa.status, rifa.objetivo_ventas, rifa.participantes,
                rifa.fondos_recaudados, rifa.ver_fecha, rifa.ver_participantes,
                rifa.ver_ganador, rifa.ver_tickets, creado_en, rifa.id]);
            return rifa;

        } catch (error) {
            console.error('Error al editar rifa', error);
            throw error;
        }
    }

    static async deleteRaffle(id) {
        try {
            const db = await poolPromise; // Esperamos la conexión
            const [{ affectedRows }] = await db.execute(`DELETE FROM rifas WHERE id = ?`, [id]);
            return affectedRows;

        } catch (error) {
            console.error('Error al eliminar rifa', error);
            throw error;
        }
    }

    static async listRaffle() {
        try {
            const db = await poolPromise; // Esperamos la conexión
            const [rifas] = await db.execute(`SELECT * FROM rifas`);
            return rifas

        } catch (error) {
            console.error('Error al eliminar rifa', error);
            throw error;
        }
    }

    /**
     *Activa una rifa 
     *
     * @static
     * @param {*} id_raffle id de la rifa a activar
     * @return {*}  rifa activada
     * @memberof RaffleModel
     */
    static async activeRaffleProcess(id_raffle) {
        try {
            const db = await poolPromise; // Esperamos la conexión
            await db.execute(`UPDATE rifas SET status = 'no_activa';`);
            await db.execute(`UPDATE rifas SET status = 'activa' WHERE id = ?`, [id_raffle]);

            const [[rifas]] = await db.execute('SELECT * FROM rifas WHERE id = ?', [id_raffle])

            return rifas

        } catch (error) {
            console.error('Error con el proceso de activación', error);
            throw error;
        }
    }
}

module.exports = RaffleModel;