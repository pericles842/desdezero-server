'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Crear tabla 'config'
    await queryInterface.createTable('config', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      tasa_banco: {
        type: Sequelize.ENUM('bcv', 'promedio', 'paralelo'),
        allowNull: false
      },
      tasa_personalizada: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      telefono: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      correo: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      estadisticas: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir: eliminar tabla 'config'
    await queryInterface.dropTable('config');
  }
};
