'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dollar_rates', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      key: {
        type: Sequelize.ENUM('bcv', 'promedio', 'paralelo'),
        allowNull: false
      },
      img_url: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      price_old: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      last_update: {
        type: Sequelize.STRING(255),
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('dollar_rates');
  }
};
