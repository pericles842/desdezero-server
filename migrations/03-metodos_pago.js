'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('metodos_pago', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      tipo: {
        type: Sequelize.ENUM('pagomovil', 'transferencia', 'billeteradigital')
      },
      nombre: {
        type: Sequelize.STRING(255)
      },
      titular: {
        type: Sequelize.STRING(255)
      },
      min_tickets: {
        type: Sequelize.INTEGER
      },
      url_img: {
        type: Sequelize.STRING(255)
      },
      datos: {
        type: Sequelize.JSON
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('metodos_pago');
  }
};
