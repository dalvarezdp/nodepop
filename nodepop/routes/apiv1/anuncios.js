/**
 * Created by david on 5/04/17.
 */
'use strict';

const express = require('express');
const router = express.Router();


// Cargamos mongoose y el modelo de Anuncio
const mongoose = require('mongoose');
const Anuncio = mongoose.model('Anuncio');

// authentication con Json Web Token
const jwtAuth = require('../../lib/jwtAuth');
router.use(jwtAuth);

// GET - devuelve una lista de anuncios
router.get('/', function(req, res, next) {

    const tags = req.query.tags;
    const venta = req.query.venta;
    const precio = req.query.precio;
    const limit = parseInt(req.query.limit) || 0;
    const start = parseInt(req.query.start) || 0;
    const sort = req.query.sort || null;

    const filter = {};


    if (typeof req.query.tags !== 'undefined') {
        if (typeof req.query.tags !== 'object') {
            filter.tags = [tags];
        }
        if (typeof req.query.tags === 'object') {
            filter.tags = tags;
        }
        filter.tags = {$in: filter.tags};
    }


    if (venta) {
        filter.venta = venta;
    }

    if (typeof req.query.nombre !== 'undefined') {
        filter.nombre = new RegExp('^' + req.query.nombre, 'i');
    }

    if (precio) {
        filter.precio = filterPrice(req.query.precio);
    }

    Anuncio.list(filter, limit, start, sort, function(err, rows) {
        if (err) {
            return next(err);
        }
        res.json({success: true, result: rows});
    });


});

// GET - recupera un anuncio por id
router.get('/:id', function(req, res, next) {
    const query = Anuncio.findOne({_id: req.params.id});
    query.exec(function(err, anuncio) {
        if (err) {
            return next(err);
        }
        if (!anuncio) {
            return res.status(404).json({success: false});
        }
        res.json({success: true, result: anuncio});
    });
});

// POST - crear un anuncio
router.post('/', function(req, res, next) {
    console.log(req.body);
    const anuncio = new Anuncio(req.body);
    anuncio.save(function(err, anuncioGuardado) {
        if (err) {
            return next(err);
        }
        res.json({success: true, result: anuncioGuardado});
    });
});

// PUT - actualizar un anuncio por id
router.put('/:id', function(req, res, next) {
    // recogemos el id
    const id = req.params.id;
    const anuncio = req.body;
    Anuncio.update({_id: id}, anuncio, function(err) {
        if (err) {
            return next(err);
        }
        res.json({success: true});
    });
});

// DELETE - eliminar un anuncio por id
router.delete('/:id', function(req, res, next) {
    // recogemos el id
    const id = req.params.id;
    Anuncio.remove({_id: id}, function(err) {
        if (err) {
            return next(err);
        }
        res.json({success: true});
    });
});


// funcion para parsear el filtro del precio
function filterPrice(precio) {

    if (/^[0-9]+\-$/.test(precio)) {
        return {'$gte': parseInt(precio.match(/[0-9]+/))};
    }

    if (/^-[0-9]+$/.test(precio)) {
        return {'$lte': parseInt(precio.match(/[0-9]+/))};
    }

    if (/^[0-9]+\-[0-9]+$/.test(precio)) {
        return {'$gte': parseInt(precio.split('-')[0]), '$lte': parseInt(precio.split('-')[1])};
    }

    return parseInt(precio);

}


module.exports = router;