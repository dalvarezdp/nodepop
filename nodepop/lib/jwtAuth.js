/**
 * Created by david on 7/04/17.
 */
'use strict';

const jwt = require('jsonwebtoken');
const localConfig = require('../localConfig');

//middleware de authentication
module.exports = function (req, res, next) {
    // recoger el token
    const token = req.body.token ||
        req.query.token ||
        req.get('x-access-token');

    if (!token) {
        let error = new Error('NO_TOKEN_PROVIDED');
        error.status = 401;
        return next(error);
    }

    jwt.verify(token, localConfig.jwt.secret, function (err, decoded) {
        if (err) {
            let error = new Error('FAILED_TO_AUTHENTICATE_TOKEN');
            error.status = 401;
            return next(error);
        }
        console.log(decoded);
        next();
    });
};