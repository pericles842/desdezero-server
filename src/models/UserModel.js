const { poolPromise } = require('../config/db');

class UserModel {

    static async authUserMaster(user) {
        try {
            const db = await poolPromise; // Esperamos la conexión


            // let creado_en = new Date()
            const [[userDB]] = await db.execute(`SELECT id,nombre,correo,telefono FROM usuarios WHERE correo = ? AND password = ?`,
                [user.correo, user.password]);

            if (!userDB) throw new Error('Usuario o contraseña a incorrectos')
            return userDB;

        } catch (error) {
            if (error instanceof Error) {
                error.message
            }
            throw error;
        }
    }

    static async saveUser(user) {
        try {
            const db = await poolPromise; // Esperamos la conexión
            user.creado_en = new Date()
            const [{ insertId }] = await db.execute(
                `INSERT INTO usuarios (nombre, correo,telefono, password , creado_en)
                 VALUES (?, ?, ?, ?, ?)`,
                [user.nombre, user.correo, user.telefono, user.password, user.creado_en]);

            user.id = insertId;

            return user;

        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
            throw error;
        }
    }
    static async updateUser(user) {
        try {
            const db = await poolPromise; // Esperamos la conexión
            user.creado_en = new Date();

            const [{ affectedRows }] = await db.execute(
                `UPDATE usuarios
                 SET nombre = ?,
                correo = ?,
                telefono = ?, 
                password = ?, creado_en = ?
                 WHERE id = ?`,
                [user.nombre, user.correo, user.telefono, user.password, user.creado_en, user.id]
            );

            return user;

        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
            throw error;
        }
    }


    static async searchUserByPhone(telefono) {
        try {
            const db = await poolPromise; // Esperamos la conexión

            let [[userDB]] = await db.execute(
                `SELECT * FROM usuarios  WHERE telefono = ?`,
                [telefono]);

            userDB = !userDB ? [] : userDB;


            return userDB;

        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
            throw error;
        }
    }

    static async saveConfigWeb(config) {
        try {
            const db = await poolPromise; // Esperamos la conexión

            config.createdAt = new Date()

            const [{ insertId }] = await db.execute(
                `INSERT INTO config (tasa_banco, tasa_personalizada, telefono, correo, estadisticas, createdAt)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [config.tasa_banco, config.tasa_personalizada,
                config.telefono, config.correo, config.estadisticas, config.createdAt]
            );
            config.id = insertId
            return config
        } catch (error) {
            if (error instanceof Error) {
                error.message
            }
            throw error;
        }
    }

    static async updateConfigWeb(config) {
        try {
            const db = await poolPromise;

            let createdAt = new Date();

            const [result] = await db.execute(
                `UPDATE config
             SET tasa_banco = ?, 
                 tasa_personalizada = ?, 
                 telefono = ?, 
                 correo = ?, 
                 estadisticas = ?, 
                 createdAt = ?
             WHERE id = ?`,
                [
                    config.tasa_banco,
                    config.tasa_personalizada,
                    config.telefono,
                    config.correo,
                    config.estadisticas,
                    createdAt,
                    config.id
                ]
            );

            return config;
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
            throw error;
        }
    }
    static async getConfig() {
        try {
            const db = await poolPromise; // Esperamos la conexión

            const [[configRows]] = await db.execute('SELECT * FROM config');

            const [[statsRow]] = await db.execute(`
              SELECT 
	(SELECT COUNT(DISTINCT pagos.correo, pagos.telefono) FROM pagos) AS participantes,
	(SELECT COUNT(tickets.id) FROM tickets) AS tikes_vendidos,
	(SELECT COUNT(ganadores.id) FROM ganadores) AS premios,
	(SELECT COUNT(rifas.id) FROM rifas WHERE rifas.status = 'activa') AS rifas_activas,
    (SELECT COUNT(tickets.id) FROM tickets 
    inner join rifas on tickets.id_rifa WHERE rifas.status = 'activa') AS tikes_vendidos_rifa
            `);

            const resultado = {
                config: configRows ? configRows : [],
                estadisticas: statsRow ? statsRow : []
            };

            return resultado
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
            throw error;
        }
    }
    static async adminStatistics() {
        try {
            const db = await poolPromise; // Esperamos la conexión

            const [[configRows]] = await db.execute(`SELECT
    rifas.participantes,
    CONCAT(rifas.fondos_recaudados, '$') AS fondos_recaudados,
    COUNT(tickets.id) AS tickets,

    -- Método de pago más usado
    (
        SELECT 
            CONCAT(metodos_pago.tipo, ' (', COUNT(*), ' pagos)')
        FROM pagos
        INNER JOIN metodos_pago ON metodos_pago.id = pagos.id_metodo_pago
        WHERE pagos.id_rifa = rifas.id
        GROUP BY metodos_pago.tipo
        ORDER BY COUNT(*) DESC
        LIMIT 1
    ) AS metodo_pago_mas_usado,

    -- Top 3 compradores por tickets
    (
        SELECT 
            GROUP_CONCAT(CONCAT(correo, ' (', total_tickets, ' tickets)') SEPARATOR ', ')
        FROM (
            SELECT 
                pagos.correo,
                COUNT(*) AS total_tickets
            FROM tickets
            INNER JOIN pagos ON pagos.id = tickets.id_pago
            WHERE pagos.id_rifa = rifas.id
            GROUP BY pagos.correo
            ORDER BY total_tickets DESC
            LIMIT 5
        ) AS top_compradores
    ) AS top_compradores

FROM rifas
INNER JOIN tickets ON tickets.id_rifa = rifas.id
WHERE rifas.status = 'activa'
GROUP BY rifas.id;
`);

            let statics = [
                {
                    col: 'md:col-4',
                    icon: 'fa-solid fa-user',
                    title: 'Participantes',
                    statistic: configRows?.participantes ? configRows.participantes : 0
                },
                {
                    col: 'md:col-4',
                    icon: 'fa-solid fa-ticket',
                    title: 'Fondos Recaudados',
                    statistic: configRows?.fondos_recaudados ? configRows.fondos_recaudados : 0
                },
                {
                    col: 'md:col-4',
                    icon: 'fa-solid fa-money-bill-trend-up',
                    title: 'Tickets Vendidos',
                    statistic: configRows?.tickets ? configRows.tickets : 0
                },
                {
                    col: 'md:col-6',
                    icon: 'fa-solid fa-building-columns',
                    title: 'Pago Mas Usado',
                    statistic: configRows?.metodo_pago_mas_usado ? configRows.metodo_pago_mas_usado : 0
                }
            ]

            let top_compradores = [];
            if (configRows?.top_compradores && configRows?.top_compradores.trim()) {
                top_compradores = configRows?.top_compradores.split(',');
            }
            for (let i = 0; i < top_compradores.length; i++) {
                statics.push({
                    col: 'md:col-6',
                    icon: 'fa-solid fa-user',
                    title: 'Comprador ' + (i + 1),
                    statistic: top_compradores[i]
                })
            }

            return statics
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
            throw error;
        }
    }


}

module.exports = UserModel;