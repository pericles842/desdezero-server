const { body, validationResult } = require('express-validator');
const logError = require('../utils/LogsCapture');
require('dotenv').config();
const ejs = require('ejs');
const path = require('path');
const nodemailer = require('nodemailer');
const axios = require('axios');
const { text } = require('stream/consumers');
const PayModel = require('../models/PayModel');

const url_api = "https://api.useplunk.com/v1/send"
const EmailController = {

  sendEmail: async (user) => {
    try {
      // Renderizar tu plantilla con ejs
      const templatePath = path.join(__dirname, "../views", "correo.ejs");
      const html = await ejs.renderFile(templatePath, user);

      // Petición a la API de Plunk
      const response = await axios.post(
        url_api,
        {
          to: user.correo,
          subject: "Confirmación de compra",
          body: html, // aquí va tu HTML renderizado
          from: process.env.EMAIL, // remitente
          subscribed: true, // si tu usuario está suscrito (opcional, depende de tu caso)
          name: 'Soporte DesdeZero'
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.PASSWORD_EMAIL}` //*SECRET KEY 
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Error al enviar correo:", error.response?.data || error.message);
      return {
        error: true,
        message: error.response?.data || error.message || "Error al enviar correo",
      };
    }
  },
  rejectEmail: async (user) => {
    try {

      // Renderizar tu plantilla con ejs
      const templatePath = path.join(__dirname, "../views", "rechazarPago.ejs");
      const html = await ejs.renderFile(templatePath, user);

      // Petición a la API de Plunk
      const response = await axios.post(
        url_api,
        {
          to: user.correo,
          subject: "Fallo en la compra",
          body: html, // tu HTML renderizado con EJS
          from: process.env.EMAIL,
          subscribed: true,
          name: 'Soporte DesdeZero',
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.PASSWORD_EMAIL}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Error al enviar correo:", error.response?.data || error.message);
      return {
        error: true,
        message: error.response?.data || error.message || "Error al enviar correo",
      };
    }
  },
  personalizedMail: async (req, res) => {
    try {
      const user = req.body;

      //Renderizar plantilla EJS
      const templatePath = path.join(__dirname, "../views", "correoInformativo.ejs");
      const html = await ejs.renderFile(templatePath, user);

      // Enviar email con Plunk
      const response = await axios.post(url_api, {
        to: user.correo,
        subject: user.subject, // dinámico
        body: html, // HTML renderizado
        from: process.env.EMAIL,
        subscribed: true,
        name: "Soporte DesdeZero",
      },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.PASSWORD_EMAIL}`, // tu secret key
          },
        }
      );

      // Lógica de negocio adicional
      await PayModel.rejectSale(user.id_payment);

      // Respuesta al cliente
      res.send(response.data);
      
    } catch (error) {
      console.error("❌ Error al enviar correo:", error.response?.data || error.message);
      res.status(500).send({
        error: true,
        message: error.response?.data || error.message || "Error al enviar correo",
      });
    }
  }
};

module.exports = EmailController;