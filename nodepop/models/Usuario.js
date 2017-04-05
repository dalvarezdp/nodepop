/**
 * Created by david on 4/04/17.
 */
'use strict';

const mongoose = require('mongoose');

const usuarioSchema = mongoose.Schema({
    nombre: String,
    email: String,
    clave: String
});

var Usuario = mongoose.model('Usuario', usuarioSchema);

/*
 const usuario = new Usuario({
 email: 'admin@example.com',
 password: '1234'
 });

 usuario.save();
 */