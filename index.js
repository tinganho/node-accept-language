
/**
 * Private variables
 */

var acceptLanguageSyntax = /((([a-zA-Z]+(-[a-zA-Z]+)?)|\*)(;q=[0-1](\.[0-9]+)?)?)*/g;
var isLocale = /^[a-z]{2}\-[A-Z]{2}$/;
var isLanguage = /^[a-z]{2}$/;
var isRegion = /^[A-Z]{2}$/;

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

/**
 * Prototype
 */

var acceptLanguage = exports = module.exports = {};

/**
 * Languague codes
 */

acceptLanguage._locales = {};

/**
 * Default code
 */

acceptLanguage.defaultLocale = null;

/**
 * Prune locales that aren't defined
 *
 * @param {Array.<locale>} locales
 * @return {Array.<locale>}
 * @api public
 */

function prune(locales) {
  var _this = this;

  if(Object.size(acceptLanguage._locales) > 0) {
    locales = locales

    .filter(function(locale) {
      if(typeof acceptLanguage._locales[locale.language] === 'undefined') {
        return false;
      }
      return true;
    })

    .map(function(locale) {
      if(typeof locale.region === 'string' && isRegion.test(locale.region)) {
        // Set the first defined region if there is no match region
        if(acceptLanguage._locales[locale.language].regions.indexOf(locale.region) === -1) {
          locale.region = acceptLanguage._locales[locale.language].regions[0];
        }
      }
      else {
        locale.region = acceptLanguage._locales[locale.language].regions[0];
      }
      locale.value = locale.language + '-' + locale.region;
      return locale;
    });
  }

  // If no codes matches the defined set. Return
  // the default language if it is set
  if(locales.length === 0 && acceptLanguage.defaultLocale) {
    return [acceptLanguage.defaultLocale];
  }

  return locales;
};

/**
 * Define codes
 *
 * @param {Array.<code>} codes
 * @return {void}
 * @throws {TypeError}
 * @api public
 */

exports.locales = function(locales) {
  var _this = this;

  // Reset locales
  this._locales = {};

  locales.forEach(function(locale) {
    if(typeof locale === 'string') {
      if(isLocale.test(locale)) {
        locale = {
          value : locale,
          region : locale.substr(3, 2),
          language : locale.substr(0, 2)
        };
      }
      else {
        throw new TypeError('First parameter is not a locale string e.g. en-US.');
      }
    }
    else {
      if(typeof locale.language !== 'string') {
        throw new TypeError('Language codes must be of type string.');
      }
      if(!isLanguage.test(locale.language)) {
        throw new TypeError('Wrong syntax on language code "' + locale.language + '". Language code should use two lowercase letters.');
      }
      if(typeof locale.region !== 'string') {
        throw new TypeError('Region codes must be of type string.');
      }
      if(!isRegion.test(locale.region)) {
        throw new TypeError('Wrong syntax on region code "' + locale.region + '". Region code should use two uppercase letters.');
      }
    }

    // Store code
    if(typeof _this._locales[locale.language] !== 'undefined') {
      if(typeof _this._locales[locale.language].regions.indexOf(locale.region) !== -1) {
        _this._locales[locale.language].regions.push(locale.region);
      }
    }
    else {
      _this._locales[locale.language] = { regions : [locale.region] };
    }
  });
};

/**
 * Default locale if no-match occurs
 *
 * @param {String} locale
 * @returns {void}
 * @throws {TypeError}
 * @api public
 */

exports.default = function(locale) {
  if(typeof locale === 'string') {
    if(isLocale.test(locale)) {
      locale = {
        value : locale,
        region : locale.substr(3, 2),
        language : locale.substr(0, 2)
      };
    }
    else {
      throw new TypeError('First parameter is not a locale string e.g. en-US.');
    }
  }
  else {
    if(typeof locale !== 'object') {
      throw new TypeError('First parameter must be a locale object.');
    }
    if(typeof locale.language !== 'string') {
      throw new TypeError('Language code must be a string and can\'t be undefined.');
    }
    if(!isLanguage.test(locale.language)) {
      throw new TypeError('Language code must consist of two lowercase letters [a-z].');
    }
    if(typeof locale.region !== 'string') {
      throw new TypeError('Region code must be a string and can\'t be undefined.');
    }
    if(!isRegion.test(locale.region)) {
      throw new TypeError('Region code must consist of two uppercase letters [A-Z].');
    }

    locale.value = locale.language + '-' + locale.region;
  }

  // Set locale quality to 1.0
  locale.quality = 1.0;

  this.defaultLocale = locale;
};

/**
 * Parse accept language string
 *
 * @param {String} acceptLanguage
 * @return {Array.<language>}
 * @api public
 */

exports.parse = function(acceptLanguage) {
  if(typeof acceptLanguage !== 'string') {
    return this.defaultLanguage ? [this.defaultLanguage] : [];
  }
  var strings = (acceptLanguage || '').match(acceptLanguageSyntax);
  var locales = strings.map(function(match) {
    if(!match){
      return;
    }

    var bits = match.split(';');
    var ietf = bits[0].split('-');

    return {
      language: ietf[0],
      region: ietf[1],
      quality: bits[1] ? parseFloat(bits[1].split('=')[1]) : 1.0
    };
  })

  // filter out undefined
  .filter(function(locale) {
    return locale
  })

  // Sort by quality
  .sort(function(a, b) {
    return b.quality - a.quality;
  });

  return prune(locales);
};

