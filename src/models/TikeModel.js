const { poolPromise } = require("../config/db");
const _ = require("lodash");

class TikeModel {
  /**
   * Verificamos si los tikes no tiene repetidos y generamos los dígitos
   *
   * @static
   * @param {*} cantidad_tikes
   * @param {*} id_rifa
   * @return {*}
   * @memberof TikeModel
   */

   static async generateTickets(cantidad_tikes, id_rifa) {
    try {
      const db = await poolPromise;

      // Traer los tickets existentes (ya normalizados a string de 4 dígitos)
      const [tk_rifa] = await db.execute(
        "SELECT codigo FROM tickets WHERE id_rifa = ?",
        [id_rifa]
      );

      const tikes_existentes = tk_rifa.map((tk) =>
        tk.codigo.toString().padStart(4, "0")
      );

      // Generar todos los posibles tickets "0001" → "9999"
      const todos = Array.from({ length: 9999 }, (_, i) =>
        (i + 1).toString().padStart(4, "0")
      );

      // Filtrar los disponibles
      const disponibles = _.difference(todos, tikes_existentes);

      // Ajustar cantidad si piden más de los disponibles
      const cantidad_real = Math.min(cantidad_tikes, disponibles.length);

      // Selección aleatoria sin repetir
      const nuevos = _.sampleSize(disponibles, cantidad_real);
      return nuevos; // array de strings aleatorios y únicos
    } catch (error) {
      throw error;
    }
  
  }

  /**
   *Guardamos un arreglo de tikes en una rifa activa
   *
   * @static
   * @param {*} tickets arregloo de tikes
   * @param {*} id_rifa
   * @param {*} id_pago
   * @memberof TikeModel
   */
  static async saveTikes(tickets, id_rifa, sales) {
    try {
      const db = await poolPromise;
      let creado_en = new Date();
      const values = tickets.map((ticket) => [
        ticket,
        id_rifa,
        sales.id,
        creado_en,
      ]);

      const [[stats]] = await db.execute(
        `SELECT 
                            pagos.cantidad_tickets AS tikes_comprados,
                            COUNT(tickets.id) AS tikes_generados
                            FROM pagos
                            left JOIN tickets ON tickets.id_pago = pagos.id
                            WHERE pagos.id = ?
                            GROUP BY pagos.cantidad_tickets;`,
        [sales.id]
      );

      // si la cantidad de tikes comprados es menor a la cantidad de tikes generados
      // entonces los tikes se guardan
      if (stats.tikes_generados < stats.tikes_comprados) {
        await db.query(
          `INSERT INTO tickets (codigo, id_rifa, id_pago , creado_en) VALUES ?`,
          [values]
        );
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

module.exports = TikeModel;
