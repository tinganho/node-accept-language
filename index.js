
/**
 * Private variables
 */

var acceptLanguageSyntax = /((([a-zA-Z]+(-[a-zA-Z]+)?)|\*)(;q=[0-1](\.[0-9]+)?)?)*/g
  , isCode = /^[a-z]{2}$/
  , isRegion = /^[a-z]{2}$/i;

/**
 * Prototype
 */

var acceptLanguage = exports = module.exports = {};

/**
 * Languague codes
 */

acceptLanguage._codes = [];

/**
 * Default code
 */

acceptLanguage.defaultLanguage  = {};

/**
 * Prune languages that aren't defined
 *
 * @param {Array.<language>} languages
 * @return {Array.<language>}
 * @api public
 */

function prune(languages) {
  var _this = this;
  if(acceptLanguage._codes.length > 0) {
    languages = languages.filter(function(language) {
      var filter = false;
      if(acceptLanguage._codes.indexOf(language.code) === -1) {
        return false;
      }

      return true;
    });
  }

  // If no codes matches the defined set. Return
  // the default language if it is set
  if(languages.length === 0 && acceptLanguage.defaultLanguage) {
    return acceptLanguage.defaultLanguage;
  }

  return languages;
};

/**
 * Define codes
 *
 * @param {Array.<code>} codes
 * @return {void}
 * @api public
 */

exports.codes = function(codes) {
  var _this = this;

  codes.forEach(function(code) {
    if(typeof code !== 'string') {
      throw new TypeError('First parameter must be an array of strings');
    }
    if(!isCode.test(code)) {
      throw new TypeError('First parameter must be an array consisting of languague codes. Wrong syntax if code: ' + code);
    }
    // Store code
    _this._codes.push(code);
  });
};

/**
 * Default language if no-match occurs
 *
 * @param {String} language
 * @returns {void}
 * @throws {TypeError}
 * @api public
 */

exports.default = function(language) {
  if(typeof language !== 'object') {
    throw new TypeError('First parameter must be an object');
  }
  if(typeof language.code !== 'string') {
    throw new TypeError('Property code must be a string and can\'t be undefined');
  }
  if(!isCode.test(language.code)) {
    throw new TypeError('Property code must consist of two lowercase letters [a-z]');
  }
  if(typeof language.region === 'string' && !isRegion.test(language.region)) {
    throw new TypeError('Property region must consist of two case-insensitive letters [a-zA-Z]');
  }

  // Set language quality to 1.0
  language.quality = 1.0;

  this.defaultLanguage = language;
};

/**
 * Parse accept language string
 *
 * @param {String} acceptLanguage
 * @return {Array.<language>}
 * @api public
 */

exports.parse = function(acceptLanguage) {
  var strings = (acceptLanguage || '').match(acceptLanguageSyntax);
  var languages = strings.map(function(match) {
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
  })
  .filter(function(language) {
    return language;
  })
  .sort(function(a, b) {
    return b.quality - a.quality;
  });

  return prune(languages);
};

