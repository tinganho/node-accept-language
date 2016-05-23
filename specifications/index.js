
/**
 * Modules
 */

var sinonChai = require('sinon-chai');
var acceptLanguage = require('../');

global.sinon = require('sinon');
global.chai = require('chai');
global.expect = require('chai').expect;

/**
 * Use Sinon Chai plugin
 */

chai.use(sinonChai);

describe('acceptLanguage', function() {
  require('./languages')(acceptLanguage);
  require('./parse')(acceptLanguage);
  require('./get')(acceptLanguage);
  require('./lookup')(acceptLanguage);
});
