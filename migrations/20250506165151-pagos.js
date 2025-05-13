'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pagos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_usuario: {
        type: Sequelize.INTEGER,
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

    // Agregar claves foráneas
    await queryInterface.addConstraint('pagos', {
      fields: ['id_usuario'],
      type: 'foreign key',
      name: 'fk_pagos_usuario',
      references: {
        table: 'usuarios',
        field: 'id'
      },
      onDelete: 'CASCADE'
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
