const { body, validationResult } = require('express-validator');
const logError = require('../utils/LogsCapture');
require('dotenv').config();
const ejs = require('ejs');
const path = require('path');
const nodemailer = require('nodemailer');

const EmailController = {

  sendEmail: async (user) => {
    try {
      const templatePath = path.join(__dirname, '../views', 'correo.ejs');
      
      const html = await ejs.renderFile(templatePath, user);


      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.KEY_EMAIL
        }
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: user.correo,
        subject: 'Confirmación de compra',
        html: html,
        attachments: [
          {
            filename: 'logo-negativo.png',
            path: path.join(__dirname, '../public/img/logo-negativo.png'),
            cid: 'logo', // Este ID debe coincidir con el src="cid:logo_unasola"
          },
          {
            filename: 'verificado.png',
            path: path.join(__dirname, '../public/img/verificacion.png'),
            cid: 'verificado',
          }
        ],
      };

      return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            reject(error);
          } else {
            resolve(info.response);
          }
        });
      });

    } catch (error) {

      logError(error)
      return error
    }
  }
};

module.exports = EmailController;