const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const app = express();

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
app.use('/uploads', express.static(path.join(__dirname, 'src', 'utils', 'uploads')));

app.use('/public', express.static(path.join(__dirname, 'src', 'public')));

app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
})
app.get('/correo', (req, res) => {
    const data = {
        nombre: 'Juan',
        total: 15,
        fecha: new Date().toLocaleString(),
        metodo_pago: 'Zelle',
        nombre_rifa: 'Sorteo de fin de a o',
        cantidad_tickets: 3,
        total_bs: 540,
        tikes: [1245, 1246, 1247, 1248]
    };

    res.render('correo', data);
});

const routes = require('./src/routes/routes');
// Importa rutas
for (const routePath in routes) {
    app.use(routePath, routes[routePath]);
}


//servidor
const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT || 3000, () => {
    console.log(`🟢 Servidor corriendo en http://localhost:${PORT}`);
});
