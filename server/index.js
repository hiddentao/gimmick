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
    res.setHeader("Access-Control-Allow-Headers", "X-Gimmick-Id,X-Requested-With,X-Prototype-Version,X-Cors-Origin,Content-Type,Cache-Control,Pragma,Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "0");  
    next();
  });


  // static assets
  app.use(serveStatic(path.join(__dirname, 'public', 'build')));

  // request body parsing
  app.use(bodyParser.urlencoded({ 
    limit: '16mb',
    extended: false 
  }))

  // API to add event data
  app.use(function(req, res, next) {
    req.clientId = req.query.id;
    next();
  });


  var instances = {};


  // API to add event data
  app.post('/register', function(req, res, next) {
    logger.debug('register: ' + req.clientId);

    // tell all clients
    io.emit('new client', {
      id: req.clientId,
      details: req.body
    });

    res.send('ok');
  });



  // API to add event data
  app.post('/events', function(req, res, next) {
    logger.debug('events for ' + req.clientId);

    // tell all clients
    io.emit('events', {
      id: req.clientId,
      events: req.body.events
    });

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
