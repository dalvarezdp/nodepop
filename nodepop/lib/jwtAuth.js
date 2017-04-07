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
        const err = new Error('No token provided');
        err.status = 401;
        return next(err);
    }

    jwt.verify(token, localConfig.jwt.secret, function (err, decoded) {
        if (err) {
            return next(new Error('Invalid token'));
        }
        console.log(decoded);
        next();
    });
};