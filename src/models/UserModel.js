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

            const [config] = await db.execute(`SELECT * FROM config`);
            return config

        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
            throw error;
        }
    }


}

module.exports = UserModel;