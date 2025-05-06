require('dotenv').config();
const sql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

// Configuración para MySQL
const config = {
    host: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    // Opciones adicionales si fueran necesarias
    // ssl: { rejectUnauthorized: true } 
};

// Crear conexión con MySQL
const poolPromise = sql.createConnection(config)
    .then(conn => {
        console.log('🟢 Conectado a MySQL');
        return conn;
    })
    .catch(err => {
        console.error('🔴 Error de conexión a MySQL:', err.message);
        process.exit(1); // Salir si falla la conexión
    });

const sequelize = new Sequelize({
    dialect: 'mysql',
    dialectModule: sql,  // Usamos el módulo mysql2 directamente
    connection: poolPromise  // La conexión mysql2 que ya creaste
});

module.exports = {
    sql,
    poolPromise
};