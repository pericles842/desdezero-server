const fs = require('fs');
const path = require('path');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Carpeta base de subida
const UPLOADS_BASE = path.join(__dirname, 'uploads');

// ✅ Carpetas permitidas
const allowedFolders = ['img_rifas', 'img_pagos', 'media'];

/**
 * Guarda una imagen en una carpeta específica del servidor.
 * @param {Object} file - El archivo recibido desde Angular (ej: req.file).
 * @param {string} folder - La subcarpeta dentro de /uploads.
 * @returns {Object} { filename, fullPath, relativePath }
 */
async function saveImageToFolder(file, folder) {

    return new Promise((resolve, reject) => {
        if (!file) return reject(new Error('No se recibió ningún archivo'));
        if (!allowedFolders.includes(folder)) return reject(new Error('Carpeta no permitida'));

        const folderPath = path.join(UPLOADS_BASE, folder);

        // Asegurar que la carpeta existe
        fs.mkdirSync(folderPath, { recursive: true });

        // Obtener extensión y nombre único
        const originalName = path.parse(file.originalname).name.replace(/\s+/g, '_');
        const ext = path.extname(file.originalname);
        const timestamp = Date.now();
        const fileName = `${originalName}_${timestamp}${ext}`;

        const fullPath = path.join(folderPath, fileName);

        // Guardar el archivo en el disco
        fs.writeFile(fullPath, file.buffer, (err) => {
            if (err) return reject(err);
            resolve({
                filename: fileName,
                fullPath,
                relativePath: `src/utils/uploads/${folder}/${fileName}`
            });
        });
    });
}

/**
 * Borra una imagen dado su relativePath (ej: '/uploads/img_rifas/nombre.jpg').
 * @param {string} relativePath
 */
async function deleteImageFromFolder(relativePath) {
    const fullPath = path.join(__dirname, '..', relativePath);
    try {
        await fs.promises.unlink(fullPath);
        return true;
    } catch (err) {
        // si no existe, puedes ignorar o relanzar
        if (err.code === 'ENOENT') return false;
        throw err;
    }
}

/**
* Obtiene el buffer de una imagen dado su relativePath
* (por ejemplo para enviarlo en un endpoint).
* @param {string} relativePath
* @returns {Promise<Buffer>}
*/
async function getImageBuffer(relativePath) {
    const fullPath = path.join(__dirname, '..', relativePath);
    return fs.promises.readFile(fullPath);
}

module.exports = {
    upload,
    saveImageToFolder,
    deleteImageFromFolder,
    getImageBuffer
};
