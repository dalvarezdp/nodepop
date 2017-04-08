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


require('./models/Anuncio');
require('./models/Usuario');

// Cargamos fs y el modelo de Anuncio
const fs = require('fs');
const Anuncio = mongoose.model('Anuncio');
const Usuario = mongoose.model('Usuario');
var crypto = require('crypto');

// Array para borrado de promesas
const arrayDePromesas = [];

// Funcion que recible el nombre de una coleccion y borra sus datos
function dropTables(tabla) {
    var promise = new Promise(function (resolve, reject){

        var vAnuncio = mongoose.model(tabla);

        vAnuncio.remove({}, function(err) {
            if (err) {
                reject(err);
                return
            }
            resolve('Coleccion ' + tabla + ' borrada');
        });
    });

    return promise;
}

// Funcion que recible el nombre del json y crea la tabla y sus datos en la BBDD
function insertJson(nombreJson, coleccion) {
    var promise = new Promise(function (resolve, reject){

        var rutaF = 'json/'+nombreJson+'';

        fs.readFile(rutaF, 'utf8', function (err, data) {
            if (err) {
                reject(err);
                return;
            }
            //console.log(data);

            var json = JSON.parse(data);


            json[coleccion].forEach(function (item) {

                var mongooseItem;

                switch (coleccion) {
                    case 'anuncios':
                        mongooseItem = new Anuncio(item);
                        break;
                    case 'usuarios':
                        item.clave = crypto.createHash('sha256').update(item.clave).digest('base64');
                        mongooseItem = new Usuario(item);
                        break;
                    default:
                        return reject(new Error('Coleccion inválida'));
                }

                mongooseItem.save(function (err, itemGuardado) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    //console.log(itemGuardado);
                    resolve('Se ha añadido '+ nombreJson);
                });

            });
        });
    });

    return promise;
}


arrayDePromesas.push(dropTables('Anuncio'));
arrayDePromesas.push(dropTables('Usuario'));
arrayDePromesas.push(insertJson('anuncios.json','anuncios'));
arrayDePromesas.push(insertJson('usuarios.json','usuarios'));


Promise.all(arrayDePromesas).then( function(resultados) {
    console.log(resultados);
    conn.close();
    console.log('Desconectado de MongoDB');
}).catch(function(err) {
    // si alguna falla salta el catch
    console.log("Error al borrar la tabla", err);
});
