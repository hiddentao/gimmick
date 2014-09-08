"use strict";


var debug = require('debug')('gimmick-cli-server'),
  fs = require('fs'),
  path = require('path'),
  shell = require('shelljs'),
  server = require('../server');


var constants = require('./_constants');



var Command = module.exports = function() {
  this.description = 'Start the Gimmick server';

  this.options = [
    ['-p, --port [num]', 'Port the server should listen on (default: 3000)', 3000],
    ['-i, --input [folder]', 'Folder containing gimmick processing output (default: ' + constants.out_folder.label + ')', constants.out_folder.path ],
  ];
};



Command.prototype.run = function(cmd) {
  debug('Starting the server');

  var inputFolder = cmd.input;

  if (!fs.existsSync(inputFolder)) {
    throw new Error('Input folder does not exist: ' + inputFolder);
  }

  server.start({
    inputFolder: inputFolder,
    port: cmd.port
  });
};

