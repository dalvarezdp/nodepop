var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var localConfig = require('./localConfig');
var handlerError = require('./lib/handlerError');


var app = express();

require('./lib/connectMongoose');
require('./models/Anuncio');
require('./models/Usuario');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// paginas
app.use('/',      require('./routes/index'));
app.use('/users', require('./routes/users'));

// API
app.use('/apiv1/anuncios', require('./routes/apiv1/anuncios'));
app.use('/apiv1/usuarios', require('./routes/apiv1/usuarios'));

// asigna a lang el idioma de la cabecera lang
app.use(function (err, req, res, next) {
    req.lang = req.get('lang') || localConfig.idiomas.predeterminado;
    next(err);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next();
});


// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  if (isAPI(req)){ //llamada de API, devuelvo JSON
      handlerError(req.lang, err.message).then(function(resultado) {
          res.json({
              success: false,
              message: resultado
          });
      }).catch(function(err_lang) {
          res.json({
              success: false,
              message: "Error en los mensajes cargados " + err_lang
          });
      });

      //res.json({success: false, error: err.message});
      return;
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

function isAPI(req) {
    return req.originalUrl.indexOf('/apiv1') === 0;
}

module.exports = app;
