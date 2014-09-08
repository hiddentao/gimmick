var path = require('path');

var log4js = require('log4js');
var logger = log4js.getLogger();

var express = require('express');
var io = require('socket.io')();
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var app = express();


exports.start = function(options) {

  // CORS
  app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", '*');
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");   
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,X-Prototype-Version,X-Cors-Origin,Content-Type,Cache-Control,Pragma,Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "0");  
    next();
  });


  // static assets
  app.use(serveStatic(path.join(__dirname, 'public')));

  // request body parsing
  app.use(bodyParser.urlencoded({ 
    limit: '16mb',
    extended: false 
  }))


  // API to add event data
  app.post('/newEvents', function(req, res, next) {
    if (!req.body.d) {
      return next(new Error('No data supplied'));
    }

    logger.debug('new event data');

    // tell all clients
    io.emit('new events', req.body.d);

    res.send('ok');
  });


  var server = app.listen(options.port, function() {
    logger.info('Input folder: %s', options.inputFolder);
    logger.info('Gimmick server listening on 127.0.0.1:%d', options.port);
  });

  
  // client websocket connection
  var sio = io.listen(server);

  sio.sockets.on('connection', function (socket) {
    logger.debug('socket connected');

    socket.on('disconnect', function() {
      logger.debug('socket disconnected');
    });
  });
};
