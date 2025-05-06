const { poolPromise } = require('../config/db');

class ProductsModel {
    /**
     * 
     * @returns 
     */
    static async listProducts() {
        try {
            const db = await poolPromise; // Esperamos la conexión
            const [products] = await db.execute('SELECT * FROM producto');

            return products;

        } catch (error) {
            console.error('Error al obtener producto:', error);
            throw error;
        }
    }

    /**
     * Busca un producto en la base de datos.
     * @param {string} searchProductClient Cadena de texto para buscar el producto.
     * @returns {Promise<Object>} Un objeto con el producto encontrado o nulo si no se encontró.
     * @throws {Error} Si ocurre un error al buscar el producto.
     */
    static async searchProduct(searchProductClient) {
        try {
            
            const db = await poolPromise; // Esperamos la conexión
            const [[[product]]] = await db.execute('CALL SearchProduct(?)', [searchProductClient]);
            return product;

        } catch (error) {
            console.error('Error al obtener producto:', error);
            throw error;
        }
    }
}

module.exports = ProductsModel;