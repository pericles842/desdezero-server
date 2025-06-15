'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('premios', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nombre_rifa: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      nombre_ganador: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      tike_ganador: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      fecha: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

 down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('premios');
  }
};
