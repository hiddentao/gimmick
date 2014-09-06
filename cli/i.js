"use strict";


var fs = require('fs'),
  path = require('path'),
  shell = require('shelljs'),
  tracejs = require('../lib');


var Command = module.exports = function() {
  this.description = 'Instrument a file';
};



Command.prototype.run = function(fileName) {
  var filePath = path.join(process.cwd(), fileName);

  var code = fs.readFileSync(filePath).toString();

  var result = tracejs.instrument(code);

  // create destination folder
  var dstFolder = path.join(process.cwd(), 'tracejs-out');
  shell.mkdir('-p', path.join(dstFolder, path.dirname(fileName)));
  var newFilePath = path.join(dstFolder, fileName);

  fs.writeFileSync(newFilePath, result.code);
};

