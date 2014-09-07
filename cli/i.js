"use strict";


var debug = require('debug')('tracejs-cli-i'),
  fs = require('fs'),
  path = require('path'),
  shell = require('shelljs'),
  Trace = require('../lib').Trace;


var Command = module.exports = function() {
  this.description = 'Instrument a file';

  this.options = [
    ['-o, --output [folder]', 'Output folder relative to current folder', 'tracejs-out'],
    ['-b, --backup [folder]', 'Backup input files to given folder', null],
  ];
};



Command.prototype.run = function(fileName, cmd) {
  var trace = new Trace();

  var filePath = path.join(process.cwd(), fileName);

  if (cmd.backup) {
    var backupFolder = path.join(process.cwd(), cmd.backup);

    debug('Backing up ' + fileName + ' to ' + backupFolder);

    shell.mkdir('-p', path.join(backupFolder, path.dirname(fileName)));
    shell.cp(filePath, path.join(backupFolder, fileName));
  }

  debug('Instrumenting ' + fileName);

  trace.instrument(filePath);

  var result = trace.getCode()[filePath];

  debug('Creating destination folders');

  // create destination folder
  var dstFolder = path.join(process.cwd(), cmd.output);
  shell.mkdir('-p', path.join(dstFolder, path.dirname(fileName)));
  var newFilePath = path.join(dstFolder, fileName);

  debug('Writing ' + newFilePath);

  fs.writeFileSync(newFilePath, result);
};

