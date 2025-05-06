'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */


  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.createTable('config', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      tasa_banco: {
        type: Sequelize.JSON,
        allowNull: false
      },
      telefono: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      correo: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      estadisticas: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      }
    });
  }
};
