const express = require('express');
const { Server } = require('socket.io');

require('dotenv').config();
const cors = require('cors');
const path = require('path');
const app = express();

const http = require('http');
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: process.env.ORIGIN_WEBSOCKET, //app Angular
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Middleware para compartir el io con las rutas
app.use((req, res, next) => {
    req.io = io;
    next();
});

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
app.get('/rechazar', (req, res) => {
    const data = {
        nombre: 'Juan',
        total: 15,
        fecha: new Date().toLocaleString(),
        metodo_pago: 'Zelle',
        nombre_rifa: 'Sorteo de fin de a o',
        correo_soporte: 'soporte@desdezerolg.com',
        telefono: '584129844334'
    };

    res.render('rechazarPago', data);
});
app.get('/informativo', (req, res) => {
    const data = {
        subject: 'Titulo de correo',
        text: "Contenido del correo a enviar al usuario de la rifa activa "
    };


    res.render('correoInformativo', data);
});

const routes = require('./src/routes/routes');

// Importa rutas
for (const routePath in routes) {
    app.use(routePath, routes[routePath]);
}

// Escuchar conexiones de sockets
io.on('connection', (socket) => {
    console.log('🟢 Cliente conectado:', socket.id);

    socket.on('disconnect', () => {
        console.log('🟢 Cliente desconectado:', socket.id);
    });
});

//servidor
const PORT = process.env.SERVER_PORT || 3000;
server.listen(PORT || 3000, () => {
    console.log(`🟢 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`🟢 ${process.env.NODE_ENV}`);
});
