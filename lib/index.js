"use strict";


var debug = require('debug')('tracejs'),
  fs = require('fs'),
  esprima = require('esprima'),
  escodegen = require('escodegen');

var Instrumenter = require('./instrumenter').Instrumenter;



var Trace = exports.Trace = function() {
  this._instrumenter = new Instrumenter();
  this._code = {};
};


Trace.prototype.instrument = function(filePath) {
  debug('Loading ' + filePath);

  var inputCode = fs.readFileSync(filePath);

  debug('Parsing');

  var ast = esprima.parse(inputCode);

  debug('Instrumenting');

  this._instrumenter.process(filePath, ast);

  debug('Generating code');

  this._code[filePath] = escodegen.generate(ast);
};


Trace.prototype.getCode = function() {
  return this._code;
};

