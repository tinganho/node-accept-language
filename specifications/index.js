
/**
 * Modules
 */

var sinonChai = require('sinon-chai')
  , acceptLocale = require('../');

global.sinon = require('sinon');
global.chai = require('chai');
global.expect = require('chai').expect;

/**
 * Use Sinon Chai plugin
 */

chai.use(sinonChai);

describe('acceptLocale', function() {
  require('./locales')(acceptLocale);
  require('./default')(acceptLocale);
  require('./parse')(acceptLocale);
});
