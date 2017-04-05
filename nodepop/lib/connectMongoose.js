/**
 * Created by david on 4/04/17.
 */
'use strict';

const mongoose = require('mongoose');
const conn = mongoose.connection;

mongoose.Promise = global.Promise;

// Suscribimos los posibles errores de conexión
conn.on('error', function (err) {
    console.log('Error de conexión: ', err);
    process.exit(1);
});

conn.once('open', function () {
    console.log('Conectado a MongoDB.');
});

// Realizar la conexión
mongoose.connect('mongodb://localhost:27017/nodepop');
