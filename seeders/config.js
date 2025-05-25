'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('config', [
      {
        tasa_banco: 'paralelo', // Ejemplo de tasa bancaria
        tasa_personalizada: 135.00, // Tasa personalizada de ejemplo
        tasa_automatica: 1, // Valor de ejemplo para la tasa automática
        telefono: '4129844334', // Número de teléfono de ejemplo
        correo: 'soporte@desdezerolg.com', // Correo de ejemplo
        estadisticas: 1, // Valor de ejemplo para las estadísticas
        createdAt: new Date(), // Fecha de creación actual
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('config', null, {});
  }
};
