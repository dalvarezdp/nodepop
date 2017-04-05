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
function insertAnunciosJson(nombreJson) {
    var promise = new Promise(function (resolve, reject){

        var rutaF = 'json/'+nombreJson+'';

        fs.readFile(rutaF, 'utf8', function (err, data) {
            if (err) {
                reject(err);
                return;
            }
            //console.log(data);

            var json = JSON.parse(data);

            for(var i=0;i<json.anuncios.length;i++){
                const anuncio = new Anuncio(json.anuncios[i]);
                anuncio.save(function(err, anuncioGuardado) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    //console.log(anuncioGuardado);
                    resolve('Se ha añadido '+ nombreJson);
                });
            }
        });
    });

    return promise;
}

function insertUsuariosJson(nombreJson) {
    var promise = new Promise(function (resolve, reject){

        var rutaF = 'json/'+nombreJson+'';

        fs.readFile(rutaF, 'utf8', function (err, data) {
            if (err) {
                reject(err);
                return;
            }
            //console.log(data);

            var json = JSON.parse(data);

            for(var i=0;i<json.usuarios.length;i++){
                const usuario = new Usuario(json.usuarios[i]);
                usuario.save(function(err, usuarioGuardado) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    //console.log(usuarioGuardado);
                    resolve('Se ha añadido '+ nombreJson);
                });
            }
        });
    });

    return promise;
}


arrayDePromesas.push(dropTables('Anuncio'));
arrayDePromesas.push(dropTables('Usuario'));
arrayDePromesas.push(insertAnunciosJson('anuncios.json'));
arrayDePromesas.push(insertUsuariosJson('usuarios.json'));



Promise.all(arrayDePromesas).then( function(resultados) {
    console.log(resultados);
    conn.close();
    console.log('Desconectado de MongoDB');
}).catch(function(err) {
    // si alguna falla salta el catch
    console.log("Error al borrar la tabla", err);
});

