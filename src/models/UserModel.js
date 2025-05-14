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
                (SELECT COUNT(rifas.id) FROM rifas WHERE rifas.status = 'activa') AS rifas_activas
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


}

module.exports = UserModel;