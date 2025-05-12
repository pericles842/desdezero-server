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
    waitForConnections: true, // Espera si no hay conexión disponible
    connectionLimit: 15,      // Hasta 15  conexiones simultáneas
    queueLimit: 100          // Cola infinita de espera
    // Opciones adicionales si fueran necesarias
    // ssl: { rejectUnauthorized: true } 
};

// Crear conexión con MySQL
const poolPromise = sql.createPool(config);

// Verifica la conexión al iniciar (una sola vez)
poolPromise.getConnection()
    .then(conn => {
        console.log('🟢 Conectado a MySQL');
        conn.release(); // libera la conexión
    })
    .catch(err => {
        console.error('🔴 Error de conexión a MySQL:', err.message);
        process.exit(1);
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