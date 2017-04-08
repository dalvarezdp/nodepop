/**
 * Created by david on 5/04/17.
 */
'use strict';

const express = require('express');
const router = express.Router();
var crypto = require('crypto');
const jwt = require('jsonwebtoken');
const localConfig = require('../../localConfig');

// Cargamos mongoose y el modelo de Usuario
const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');

// authentication con Json Web Token
const jwtAuth = require('../../lib/jwtAuth');
//router.use(jwtAuth);

// GET - devuelve una lista de usuarios
router.get('/', jwtAuth, function(req, res, next) {

    const query = Usuario.find();
    query.exec(function(err, rows) {
        if (err) {
            console.log(err.message);
            let error = new Error('INTERNAL_ERROR');
            error.status = 500;
            return next(error);
        }
        res.json({success: true, result: rows});
    });

});


// POST - crear un usuario
router.post('/registro', jwtAuth, function(req, res, next) {
    console.log(req.body);

    const email = req.body.email;

    Usuario.findOne({email: email}).exec(function (err, user) {
        if (err) {
            console.log(err);
            let error = new Error('INTERNAL_ERROR');
            error.status = 500;
            return next(error);
        }

        // si encontramos el usuario
        if (user) {
            let error = new Error('USER_ALREDY_EXIST');
            error.status = 406;
            return next(error);
        }

        const usuario = new Usuario(req.body);
        var hash = crypto.createHash('sha256').update(usuario.clave).digest('base64');
        usuario.clave = hash;
        usuario.save(function(err, usuarioGuardado) {
            if (err) {
                console.log(err);
                let error = new Error('VALIDATION_USER_ERROR');
                error.status = 406;
                return next(error);
            }
            res.status(200).json({success: true, result: usuarioGuardado});
        });

    });

});


// POST - authencation de usuarios
router.post('/authenticate', function (req, res, next) {

    // recogemos credenciales
    const email = req.body.email;
    const clave = crypto.createHash('sha256').update(req.body.clave).digest('base64');

    // buscamos en la base de datos
    Usuario.findOne({email: email}).exec(function (err, user) {
        if (err) {
            console.log(err);
            let error = new Error('INTERNAL_ERROR');
            error.status = 500;
            return next(error);
        }

        // si no encontramos el usuario
        if (!user) {
            let error = new Error('USER_NOT_FOUND');
            error.status = 404;
            return next(error);
        }
        //comprobamos su password
        if (clave !== user.clave) {
            let error = new Error('INVALID_PASSWORD');
            error.status = 401;
            return next(error);
        }

        // creamos un token
        jwt.sign({ user_id: user._id}, localConfig.jwt.secret, {
            expiresIn: localConfig.jwt.expiresIn
        }, function(err, token) {
            // respondemos al usuario dándole el token
            res.status(200).json({success: true, token});
        });
    });

});


module.exports = router;