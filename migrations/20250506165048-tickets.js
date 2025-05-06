'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tickets', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      codigo: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      id_rifa: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      creado_en: {
        type: Sequelize.DATE
      }
    });

    // Agregar claves foráneas
    await queryInterface.addConstraint('tickets', {
      fields: ['id_rifa'],
      type: 'foreign key',
      name: 'fk_tickets_rifa',
      references: {
        table: 'rifas',
        field: 'id'
      },
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('tickets', {
      fields: ['id_usuario'],
      type: 'foreign key',
      name: 'fk_tickets_usuario',
      references: {
        table: 'usuarios',
        field: 'id'
      },
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tickets');
  }
};
