"use strict";


var debug = require('debug')('gimmick-cli-process'),
  fs = require('fs'),
  path = require('path'),
  shell = require('shelljs'),
  Trace = require('../lib').Trace;


var constants = require('./_constants');


var Command = module.exports = function() {
  this.description = 'Instrument a file';

  this.options = [
    ['-o, --output [folder]', 'Output folder (default: ' + constants.out_folder.label + ')', constants.out_folder.path ],
    ['-b, --backup [folder]', 'Backup input files to given folder (default: no backup)', null],
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
  var dstFolder = cmd.output;
  shell.mkdir('-p', path.join(dstFolder, path.dirname(fileName)));
  var newFilePath = path.join(dstFolder, fileName);

  debug('Writing ' + newFilePath);

  fs.writeFileSync(newFilePath, result);

  var definitionsFile = path.join(dstFolder, '_def.json');

  debug('Writing definitions file: ' + definitionsFile);
  fs.writeFileSync(definitionsFile, JSON.stringify(trace.getDefinitions()));
};

