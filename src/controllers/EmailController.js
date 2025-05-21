const { body, validationResult } = require('express-validator');
const logError = require('../utils/LogsCapture');
require('dotenv').config();
const ejs = require('ejs');
const path = require('path');
const nodemailer = require('nodemailer');
const { text } = require('stream/consumers');
const PayModel = require('../models/PayModel');

const EmailController = {

  sendEmail: async (user) => {
    try {
      const templatePath = path.join(__dirname, '../views', 'correo.ejs');

      const html = await ejs.renderFile(templatePath, user);


      const transporter = nodemailer.createTransport({
        host: process.env.HOST_EMAIL,  // El hostname que diste
        port: process.env.PORT_EMAIL,                  // Puedes usar 587 o 465 (465 es para SSL)
        secure: false,              // true si usas el puerto 465, false para 587
        auth: {
          user: process.env.USER_SMTP,            // Username SMTP
          pass: process.env.PASSWORD_EMAIL,   // Password SMTP (secret)
        }
      });
      const mailOptions = {
        from: '"Soporte DesdeZero ' + process.env.EMAIL,
        to: user.correo,
        subject: 'Confirmación de compra',
        html: html
      };

      let response = await transporter.sendMail(mailOptions);
      if (response.error) {
        return response.message;
      }
      return response

    } catch (error) {
      logError(error);
      return {
        error: true,
        message: error.message || 'Error al enviar correo',
      };
    }
  },
  rejectEmail: async (user) => {
    try {
      const templatePath = path.join(__dirname, '../views', 'rechazarPago.ejs');

      const html = await ejs.renderFile(templatePath, user);


      const transporter = nodemailer.createTransport({
        host: process.env.HOST_EMAIL,  // El hostname que diste
        port: process.env.PORT_EMAIL,                  // Puedes usar 587 o 465 (465 es para SSL)
        secure: false,              // true si usas el puerto 465, false para 587
        auth: {
          user: process.env.USER_SMTP,            // Username SMTP
          pass: process.env.PASSWORD_EMAIL,   // Password SMTP (secret)
        }
      });
      const mailOptions = {
        from: '"Soporte DesdeZero ' + process.env.EMAIL,
        to: user.correo,
        subject: 'Fallo en la compra',
        html: html
      };

      let response = await transporter.sendMail(mailOptions);
      if (response.error) {
        return response.message;
      }
      return response

    } catch (error) {
      logError(error);
      return {
        error: true,
        message: error.message || 'Error al enviar correo',
      };
    }
  },
  personalizedMail: async (req, res) => {
    try {

      let user = req.body
      const templatePath = path.join(__dirname, '../views', 'correoInformativo.ejs');

      const html = await ejs.renderFile(templatePath, user);

      const transporter = nodemailer.createTransport({
        host: process.env.HOST_EMAIL,  // El hostname que diste
        port: process.env.PORT_EMAIL,                  // Puedes usar 587 o 465 (465 es para SSL)
        secure: false,              // true si usas el puerto 465, false para 587
        auth: {
          user: process.env.USER_SMTP,            // Username SMTP
          pass: process.env.PASSWORD_EMAIL,   // Password SMTP (secret)
        }
      });
      const mailOptions = {
        from: '"Soporte DesdeZero ' + process.env.EMAIL,
        to: user.correo,
        subject: user.subject,
        html: html
      };

      let response = await transporter.sendMail(mailOptions);
      if (response.error) {
        return response.message;
      }

      await PayModel.rejectSale(user.id_payment)

      res.send(response);
    } catch (error) {
      logError(error);
      return {
        error: true,
        message: error.message || 'Error al enviar correo',
      };
    }
  }
};

module.exports = EmailController;