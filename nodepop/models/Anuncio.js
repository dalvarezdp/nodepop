/**
 * Created by david on 4/04/17.
 */
'use strict';

const mongoose = require('mongoose');

// primero definimos un esquema

const anuncioSchema = mongoose.Schema({
    nombre: String,
    venta: Boolean,
    precio: Number,
    foto: String,
    tags: [String]
});


// Creamos un método estático para recuperar anuncios paginados
anuncioSchema.statics.list = function(filter, limit, skip, fields, sort, cb) {
    const query = Anuncio.find(filter);
    query.limit(limit);
    query.skip(skip);
    query.select(fields);
    query.sort(sort);
    query.exec(cb);
};


// y luego creamos el modelo
var Anuncio = mongoose.model('Anuncio', anuncioSchema);

// no necesitamos exportar el modelo ya que podriamos recuperarlo en cualquier momento con:
// var Agente = mongoose.model('Agente');

//const agente = new Agente({name: 'Creado desde mongoose', age: 31});
//agente.save();