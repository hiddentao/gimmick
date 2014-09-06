"use strict";


var debug = require('debug')('tracejs-cli-i'),
  fs = require('fs'),
  path = require('path'),
  shell = require('shelljs'),
  Trace = require('../lib').Trace;


var Command = module.exports = function() {
  this.description = 'Instrument a file';
};



Command.prototype.run = function(fileName) {
  var trace = new Trace();

  debug('Instrumenting ' + fileName);

  var filePath = path.join(process.cwd(), fileName);

  trace.instrument(filePath);

  var result = trace.getCode()[filePath];

  debug('Creating destination folders');

  // create destination folder
  var dstFolder = path.join(process.cwd(), 'tracejs-out');
  shell.mkdir('-p', path.join(dstFolder, path.dirname(fileName)));
  var newFilePath = path.join(dstFolder, fileName);

  debug('Writing ' + newFilePath);

  fs.writeFileSync(newFilePath, result);
};

