const { poolPromise } = require("../config/db");

const axios = require("axios");
const moment = require("moment");
require("moment/locale/es");
moment.locale("es");

const UserModel = require("./UserModel");

class RatesModel {
  /**
   *
   * @returns
   */
  static async listRatesDesdezero() {
    try {
      const db = await poolPromise; // Esperamos la conexión
      const [rates] = await db.execute("SELECT * FROM dollar_rates");

      return rates;
    } catch (error) {
      console.error("Error al obtener los rates", error);
      throw error;
    }
  }
  /**
   * ACTUALIZAR las tass del sistema
   *
   *
   *
   * @static
   * @return {*}
   * @memberof RatesModel
   */
  static async updateRatesProcess() {
    /**
     * todo las tass se actualzad a asl 12am , 8 am , 1pm
     */
    try {
      const { config } = await UserModel.getConfig();
      let rates_current = await this.listRatesDesdezero();

      //*Si falla toma las tasas de la base de datos
      let rates_to_update = await axios
        .get("https://api.dolarvzla.com/public/exchange-rate")
        .then((res) => res.data)
        .catch((error) => {
          console.warn("Fallo la petición, usando tasa Manual:", error.message);

          return rates_current.map((rate) => ({
            ...rate,
            price_old: rate.price,
            price: config.tasa_personalizada,
            last_update: moment().format("D [de] MMMM [de] YYYY"),
          }));
        });

      //*Validamos si es la respuesta de la api o de la base de datos
      if (!Array.isArray(rates_to_update)) {
        
        //*Transformamos la respuesta de la api un en modelo valido para las tablas
        const { current } = rates_to_update;

        rates_current.map((rate_current) => {
          if (rate_current.key === "bcv") {
            rate_current.price = current.usd;
            rate_current.price_old = rate_current.price_old;
            rate_current.last_update = current.date;
          } else if (rate_current.key === "paralelo") {
            rate_current.price = current.eur;
            rate_current.price_old = rate_current.price_old;
            rate_current.last_update = current.date;
          } else {
            rate_current.price = (current.usd + current.eur) / 2;
            rate_current.price_old = rate_current.price_old;
            rate_current.last_update = current.date;
          }
        });
      }

      //*Realizamos la actualización
      for (const rate of rates_current) {
        await this.updateRate(rate);
      }

      console.log(
        "Tasas actualizadas",
        moment().format("D [de] MMMM [de] YYYY"),
      );
    } catch (error) {
      console.error("Error en proceso de actualización", error);
      throw error;
    }
  }

  static async updateRate(rate) {
    try {
      const db = await poolPromise; // Esperamos la conexión
      const [result] = await db.execute(
        `UPDATE dollar_rates SET 
                price = ?,
                price_old = ?,
                last_update = ? WHERE id = ?`,
        [rate.price, rate.price_old, rate.last_update, rate.id],
      );
      return result;
    } catch (error) {
      console.error("error al actualizar la tasa", error);
      throw error;
    }
  }
}

module.exports = RatesModel;
