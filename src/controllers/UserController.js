const UserModel = require('../models/UserModel');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
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
            res.status(500).send(error.message);
        }
    }
};

module.exports = RaffleController;