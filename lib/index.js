var esprima = require('esprima'),
  escodegen = require('escodegen');

var Instrumenter = require('./instrumenter').Instrumenter;


/** 
 * Instrument given code.
 * @param  {String} code Input code
 * @return {Object} {code: final code, definition obj}
 */
exports.instrument = function(code) {
  var ast = esprima.parse(code);

  var i = new Instrumenter();

  i.process(ast);

  return {
    code: escodegen.generate(ast),
    definitions: i.getDefinitions(),
  };
};

