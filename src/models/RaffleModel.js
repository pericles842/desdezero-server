const { poolPromise } = require('../config/db');

class RaffleModel {

    static async createRaffle(rifa) {
        try {
            const db = await poolPromise; // Esperamos la conexión
            rifa.status = 'no_activa'
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

    static async getRaffleById(id) {
        try {
            const db = await poolPromise; // Esperamos la conexión
            const [[rifa]] = await db.execute(`SELECT * FROM rifas WHERE id = ?`, [id])
            return rifa

        } catch (error) {
            console.error('Error al obtener rifa por id', error);
            throw error;
        }
    }

    static async getRaffleActive() {
        try {
            const db = await poolPromise; // Esperamos la conexión
            const [[rifas]] = await db.execute(`SELECT * FROM rifas where status = 'activa'`)
            if (!rifas) return { message: 'No hay rifas activas', rifa_active: false }
            return rifas


        } catch (error) {
            console.error('Error con el proceso de rifa activa', error);
            throw error;
        }
    }

    static async updateActiveRaffleParticipants(id_rifa) {
        try {
            const db = await poolPromise; // Esperamos la conexión
            await db.execute(`UPDATE rifas
                SET
                participantes = (
                    SELECT COUNT(DISTINCT pagos.correo, pagos.telefono)
                    FROM pagos
                    WHERE pagos.id_rifa = rifas.id
                ),
                fondos_recaudados = (
                    SELECT SUM(pagos.total)
                    FROM pagos
                    WHERE pagos.id_rifa = rifas.id
                )
                WHERE rifas.id = ?;`, [id_rifa])

        } catch (error) {
            console.error('Error con el proceso de rifa activa', error);
            throw error;
        }
    }

    /**
     * Crea a un ganador
     *
     * @static
     * @param {*} ganador
     * @return {*} 
     * @memberof RaffleModel
     */
    static async createWinner(ganador) {
        try {
            const db = await poolPromise; // Esperamos la conexión

            const [{ insertId }] = await db.execute(`INSERT INTO ganadores
                (nombre, telefono, tike_ganador, nombre_rifa, fecha) VALUES
                (?, ?, ?, ?, ?);`,
                [ganador.nombre, ganador.telefono, ganador.tike_ganador, ganador.nombre_rifa, ganador.fecha]
            );

            ganador.id = insertId;

            return ganador;

        } catch (error) {
            console.error('Error al insertar el ganador', error);
            throw error;
        }
    }

    /**
     * Actualiza un ganador
     *
     * @static
     * @param {*} ganador
     * @return {*} 
     * @memberof RaffleModel
     */
    static async updateWinner(ganador) {
        try {
            const db = await poolPromise; // Esperamos la conexión

            await db.execute(`UPDATE ganadores SET
                    nombre = ?,
                    telefono = ?,
                    tike_ganador = ?,
                    nombre_rifa = ?,
                    fecha = ?
                WHERE
                    id = ?;`,
                [ganador.nombre, ganador.telefono, ganador.tike_ganador, ganador.nombre_rifa, ganador.fecha, ganador.id]
            );

            return ganador;

        } catch (error) {
            console.error('Error al actualizar el ganador', error);
            throw error;
        }
    }

}

module.exports = RaffleModel;