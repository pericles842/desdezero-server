const UserModel = require('../models/UserModel');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const logError = require('../utils/LogsCapture');
require('dotenv').config();


const RaffleController = {

    authUserMaster: async (req, res) => {
        try {

            let user_body = req.body.user
            let user = await UserModel.authUserMaster(user_body)

            const token = jwt.sign(user, process.env.JWT_SECRET, {
                expiresIn: '5h'
            });
            user.token = token

            res.send({
                nombre: user.nombre,
                token: user.token
            });
        } catch (error) {
            logError(error.message)
            res.status(500).send(error.message);
        }
    },
    saveConfigWeb: async (req, res) => {
        try {

            let config = req.body.config

            config = config.id == 0 ?
                await UserModel.saveConfigWeb(config) :
                await UserModel.updateConfigWeb(config)

            res.send(config);
        } catch (error) {
            logError(error)
            res.status(500).send(error.message);
        }
    },
    getConfig: async (req, res) => {
        try {
            let config = await UserModel.getConfig()

            res.send(config);
        } catch (error) {
            logError(error.message)
            res.status(500).send(error.message);
        }
    },
    adminStatistics: async (req, res) => {
        try {
            let config = await UserModel.adminStatistics()

            res.send(config);
        } catch (error) {
            logError(error.message)
            res.status(500).send(error.message);
        }
    }
};

module.exports = RaffleController;