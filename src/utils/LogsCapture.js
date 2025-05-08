const fs = require('fs');
const path = require('path');

function logError(error) {

    const today = new Date().toISOString().split('T')[0]; // '2025-05-08'
    const fileName = `${today}.log`;

    const logsDir = path.join(__dirname, '..', '..', 'logs');

    // Asegurar que la carpeta 'logs' exista
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }

    const filePath = path.join(logsDir, fileName);
    const errorMessage = `[${today}] ${error.stack || error}\n`;

    fs.appendFile(filePath, errorMessage, (err) => {
        if (err) console.error('Error al guardar en log:', err);
    });
}

module.exports = logError;