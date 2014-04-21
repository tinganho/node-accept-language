
/**
 * Private variables
 */

var acceptLanguageSyntax = /((([a-zA-Z]+(-[a-zA-Z]+)?)|\*)(;q=[0-1](\.[0-9]+)?)?)*/g
  , localeSyntax = /^[a-z]{2}$/
  , exports = module.exports;

/**
 * Languague codes
 */

var codes = exports.codes = [];

/**
 * Prune locales that aren't defined
 *
 * @param {Array.<locale>}
 * @return {Array.<locale>}
 * @api public
 */

function prune(locales) {
  if(codes.length > 0) {
    locales = locales.filter(function(locale) {
      var filter = false;
      if(codes.indexOf(locale.code) === -1) {
        return false;
      }

      return true;
    });
  }

  return locales;
};

/**
 * Define locales
 *
 * @param {Array.<locale>}
 * @return {void}
 * @api public
 */

exports.codes = function(locales) {
  locales.forEach(function(locale) {
    if(typeof locale !== 'string') {
      throw new TypeError('First parameter must be an array of strings');
    }
    if(!localeSyntax.test(locale)) {
      throw new TypeError('First parameter must be an array consisting of languague codes. Wrong syntax if locale: ' + locale);
    }
    // Store code
    codes.push(locale);
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

  return prune(locales);
};

