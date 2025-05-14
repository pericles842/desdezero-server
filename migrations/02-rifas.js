'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rifas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      url_img: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      fecha_fin: {
        type: Sequelize.DATE,
        allowNull: false
      },
      precio: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('activa', 'no_activa'),
        defaultValue: 'activa'
      },
      objetivo_ventas: {
        type: Sequelize.INTEGER,
        comment: 'objetivo de tiket'
      },
      participantes: {
        type: Sequelize.DOUBLE
      },
      fondos_recaudados: {
        type: Sequelize.DOUBLE
      },
      ver_fecha: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      ver_participantes: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      ver_ganador: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      ver_tickets: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      creado_en: {
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('rifas');
  }
};
