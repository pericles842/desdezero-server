'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('config', [
      {
        tasa_banco: 'bcv', // Ejemplo de tasa bancaria
        tasa_personalizada: 109.2, // Tasa personalizada de ejemplo
        telefono: '4129844334', // Número de teléfono de ejemplo
        correo: 'desdezerolg@gmail.com', // Correo de ejemplo
        estadisticas: 1, // Valor de ejemplo para las estadísticas
        createdAt: new Date(), // Fecha de creación actual
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('config', null, {});
  }
};
