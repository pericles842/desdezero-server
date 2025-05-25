'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert('dollar_rates', [
			{
				title: 'Dolar BCV',
				img_url: 'https://monitordolarvenezuela.com/img/logos/bcv.webp',
				key: 'bcv',
				price: 95.08,
				price_old: 95.02,
				last_update: '26/05/2025, 12:00 AM',
			},
			{
				title: 'Dolar Paralelo',
				img_url: 'https://monitordolarvenezuela.com/img/logos/enparalelo.webp',
				key: 'paralelo',
				price: 133.15,
				price_old: 134.24,
				last_update: '26/05/2025, 12:00 AM',
			},
			{
				title: 'Dolar Promedio',
				img_url: 'https://monitordolarvenezuela.com/img/logos/promedio.webp',
				key: 'promedio',
				price: 121.075,
				price_old: 121.075,
				last_update: '26/05/2025, 12:00 AM',
			}
		], {});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('dollar_rates', null, {});
	}
};
