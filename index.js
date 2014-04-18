
/**
 * Private variables
 */

var codes = []
  , regions = []
  , acceptLanguagueSyntax = /((([a-zA-Z]+(-[a-zA-Z]+)?)|\*)(;q=[0-1](\.[0-9]+)?)?)*/g
  , localeSyntax = /^[a-z]{2}$/
  , exports = module.exports;

/**
 * Prune locales that aren't defined
 *
 * @return {Array.<locale>}
 * @api public
 */

function prune() {
  this.filter(function(locale) {
    var filter = false;
    if(codes.indexOf(locale.code) === -1) {
      return false;
    }

    return true;
  });

  return this;
};

/**
 * Define locales
 *
 * @return {void}
 * @api public
 */

exports.define = function(locales) {
  locales.forEach(function(locale) {
    if(typeof locale.code !== 'string') {
      throw new TypeError('Locale `code` should be a string');
    }
    if(localeSyntax.test(locale.code)) {
      throw new TypeError('Locale `code` is wrong in ' + JSON.stringify(locale));
    }
    // Store code
    codes.push(locale.code);
  });
};

/**
 * Define locales
 *
 * @return {void}
 * @api public
 */

exports.parse = function(acceptLanguage){
  var strings = (acceptLanguage || '').match(acceptLanguageSyntax);
  var locales = strings.map(function(match) {
    if(!match){
      return;
    }

    var bits = match.split(';');
    var ietf = bits[0].split('-');

    return {
      code: ietf[0],
      region: ietf[1],
      quality: bits[1] ? parseFloat(bits[1].split('=')[1]) : 1.0
    };
  }).filter(function(r){
    return r;
  }).sort(function(a, b){
    return b.quality - a.quality;
  });

  locale.prune = prune;

  return locales;
};

