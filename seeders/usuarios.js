'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('usuarios', [
      {
        nombre: 'Andres Belandria',
        correo: 'desdezerolg@gmail.com',
        telefono: '584129844334',
        password: 'admin',
        creado_en: new Date('2025-05-06T11:21:04')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('usuarios', null, {});
  }
};
