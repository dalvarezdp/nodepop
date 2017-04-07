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
            return next(err);
        }
        res.json({success: true, result: rows});
    });

});


// POST - crear un usuario
router.post('/registro', jwtAuth, function(req, res, next) {
    console.log(req.body);
    const usuario = new Usuario(req.body);
    var hash = crypto.createHash('sha256').update(usuario.clave).digest('base64');
    usuario.clave = hash;
    usuario.save(function(err, usuarioGuardado) {
        if (err) {
            return next(err);
        }
        res.json({success: true, result: usuarioGuardado});
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
            return next(err);
        }

        // si no encontramos el usuario
        if (!user) {
            return res.json({success: false, error: 'Usuario no encontrado'});
        }
        //comprobamos su password
        if (clave !== user.clave) {
            return res.json({success: false, error: 'Password incorrecta'});
        }

        // creamos un token
        jwt.sign({ user_id: user._id}, localConfig.jwt.secret, {
            expiresIn: localConfig.jwt.expiresIn
        }, function(err, token) {
            // respondemos al usuario dándole el token
            res.json({success: true, token});
        });
    });

});


module.exports = router;