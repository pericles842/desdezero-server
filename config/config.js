require('dotenv').config(); // Cargar variables de entorno

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_SERVER,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectModule: require('mysql2')  // Especificamos el uso de mysql2
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_SERVER,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectModule: require('mysql2')
  }
};
