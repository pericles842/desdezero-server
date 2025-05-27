'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert('dollar_rates', [
			{
				title: 'Dolar BCV',
				img_url: 'https://monitordolarvenezuela.com/img/logos/bcv.webp',
				key: 'bcv',
				price: 95.24,
				price_old: 95.08,
				last_update: '26/05/2025, 12:00 AM',
			},
			{
				title: 'Dolar Paralelo',
				img_url: 'https://monitordolarvenezuela.com/img/logos/enparalelo.webp',
				key: 'paralelo',
				price: 142.42,
				price_old: 138.51,
				last_update: '26/05/2025, 12:00 AM',
			},
			{
				title: 'Dolar Promedio',
				img_url: 'https://monitordolarvenezuela.com/img/logos/promedio.webp',
				key: 'promedio',
				price: 118.83,
				price_old: 118.83,
				last_update: '26/05/2025, 12:00 AM',
			}
		], {});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('dollar_rates', null, {});
	}
};
