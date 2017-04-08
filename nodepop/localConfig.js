/**
 * Created by david on 7/04/17.
 */
'use strict';

module.exports = {
    // configuracion de la autenticación JWT
    jwt: {
        secret: 'secretsupersecreta',
        expiresIn: '2d'
    },
    idiomas: {
        predeterminado: 'en',
        disponible: ['es','en']
    }
};