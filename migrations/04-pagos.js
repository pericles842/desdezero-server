'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pagos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING(160),
        allowNull: false
      },
      telefono: {
        type: Sequelize.STRING(160),
        allowNull: false
      },
      correo: {
        type: Sequelize.STRING(160),
        allowNull: false
      },
      referencia: {
        type: Sequelize.STRING(160),
        allowNull: false
      },
      id_metodo_pago: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      id_rifa: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      total: {
        type: Sequelize.DOUBLE
      },
      cantidad_tickets: {
        type: Sequelize.INTEGER
      },
      total_bs: {
        type: Sequelize.DOUBLE
      },
      tasa: {
        type: Sequelize.STRING(255)
      },
      comprobante: {
        type: Sequelize.STRING(255)
      },
      estatus: {
        type: Sequelize.ENUM('aprobado', 'pendiente', 'rechazado')
      },
      fecha: {
        type: Sequelize.DATE
      }
    });

   
    await queryInterface.addConstraint('pagos', {
      fields: ['id_metodo_pago'],
      type: 'foreign key',
      name: 'fk_pagos_metodo_pago',
      references: {
        table: 'metodos_pago',
        field: 'id'
      },
      onDelete: 'CASCADE'
    });


    await queryInterface.addConstraint('pagos', {
      fields: ['id_rifa'],
      type: 'foreign key',
      name: 'fk_pagos_rifa',
      references: {
        table: 'rifas',
        field: 'id'
      },
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pagos');
  }
};
