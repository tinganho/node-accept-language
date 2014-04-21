
/**
 * Private variables
 */

var acceptLanguageSyntax = /((([a-zA-Z]+(-[a-zA-Z]+)?)|\*)(;q=[0-1](\.[0-9]+)?)?)*/g
  , isCode = /^[a-z]{2}$/
  , isRegion = /^[a-z]{2}$/i
  , exports = module.exports;

/**
 * Languague codes
 */

var codes = exports.codes = [];

/**
 * Default code
 */

var defaultLanguage = exports.defaultLanguage = null;

/**
 * Prune locales that aren't defined
 *
 * @param {Array.<locale>} locales
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

  // If no locales matches the defined set. Return
  // the default locale if it is set
  if(locales.length === 0 && defaultLanguage) {
    return defaultLanguage;
  }

  return locales;
};

/**
 * Define locales
 *
 * @param {Array.<locale>} locales
 * @return {void}
 * @api public
 */

exports.codes = function(locales) {
  locales.forEach(function(locale) {
    if(typeof locale !== 'string') {
      throw new TypeError('First parameter must be an array of strings');
    }
    if(!isCode.test(locale)) {
      throw new TypeError('First parameter must be an array consisting of languague codes. Wrong syntax if locale: ' + locale);
    }
    // Store code
    codes.push(locale);
  });
};

/**
 * Default locale if no-match occurs
 *
 * @param {String} language
 * @returns {void}
 * @throws {TypeError}
 * @api public
 */

exports.default = function(language) {
  if(typeof language !== 'object') {
    throw new TypeError('First parameter must be an object');
  }
  if(typeof language.code !== 'string') {
    throw new TypeError('Property code must be a string and can\'t be undefined');
  }
  if(!isCode.test(language.code)) {
    throw new TypeError('Property code must consist of two lowercase letters [a-z]');
  }
  if(typeof language.region === 'string' && !isRegion.test(language.region)) {
    throw new TypeError('Property region must consist of two case-insensitive letters [a-zA-Z]');
  }

  defaultLanguage = language;
};

/**
 * Define locales
 *
 * @return {void}
 * @api public
 */

exports.parse = function(acceptLanguage) {
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

