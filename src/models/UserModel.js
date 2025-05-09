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
}

module.exports = UserModel;