const express = require('express');
require('dotenv').config();
const cors = require('cors');

const path = require('path');
const app = express();
const serverless = require('serverless-http');

// Configuración de CORS para permitir peticiones desde otros orígenes
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], // permite el token en header
}));



// Configuración de vistas con EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));


// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
})

const routes = require('./src/routes/routes');

// Importa rutas
for (const routePath in routes) {
    app.use(routePath, routes[routePath]);
}

//servidor
// Exportar como función para Vercel
module.exports.handler = serverless(app);