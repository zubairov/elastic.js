/**
 * Re-export connect auto-loaders.
 * 
 * This prevents the need to `require('connect')` in order
 * to access core middleware, so for example `express.logger()` instead
 * of `require('connect').logger()`.
 */

/**
 * Engine version.
 */

exports.version = '0.0.1';

/**
 * Module dependencies.
 */

var Engine = exports.Engine = require('./engine');

/**
 * Shortcut for `new Engine(...)`.
 *
 * @param {Function} ...
 * @return {Engine}
 * @api public
 */

exports.createEngine = function(){
    return new Engine(Array.prototype.slice.call(arguments));
};

