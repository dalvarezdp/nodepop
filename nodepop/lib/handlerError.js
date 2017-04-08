/**
 * Created by david on 7/04/17.
 */
'use strict';

const fs = require('fs');
const idiomas = require('../localConfig').idiomas;

var idiomasCargados = [];

// comprueba si estan cargados los errores
function esta_cargado(idioma) {
    return idiomasCargados[idioma] !== undefined;
}

// Funcion para obtener el mensaje
function obtenerError(idioma, mensaje, resolve, reject) {
    if (idiomasCargados[idioma][mensaje] === undefined) {
        return reject('HandleError Error: El \'' + mensaje + '\' no existe en el archivo cargado para el idioma \'' + idioma + '\'');
    }
    return resolve(idiomasCargados[idioma][mensaje]);
}

// Funcion que recible el nombre del json y crea la tabla y sus datos en la BBDD
function cargarErrorJson(nombreJson) {
    var promise = new Promise(function (resolve, reject){

        var rutaF = 'json/'+nombreJson+'';

        fs.readFile(rutaF, 'utf8', function (err, data) {
            if (err) {
                reject(err);
                return;
            }

            idiomasCargados = JSON.parse(data);
            resolve();
        });
    });

    return promise;
}




module.exports = function (idioma, mensaje) {
    var promise = new Promise(function (resolve, reject){

        var seleccionado = idiomas.predeterminado;
        if (idiomas.disponible.indexOf(idioma) != -1){
            seleccionado = idioma;
        }
        if(esta_cargado(seleccionado)){
            return obtenerError(seleccionado, mensaje, resolve, reject);
        }else{
            cargarErrorJson('errores.json').then(() => {
                return obtenerError(seleccionado, mensaje, resolve, reject);
            }).catch(function(err) {
                return reject(err);
            });
        }
    });

    return promise;
};
