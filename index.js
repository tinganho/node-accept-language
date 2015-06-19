

/**
 * Dependencies
 */
var bcp47 = require('bcp47');


/**
 * Object's size
 */
Object.size = function(object) {
  var size = 0, key;
  for (key in object) {
    if (object.hasOwnProperty(key)) size++;
  }
  return size;
};


/**
 * AcceptLanguage
 */
var AcceptLanguage = function() {};


/**
 * Language tags
 *
 * @type {Objects}
 * @public
 */
AcceptLanguage.prototype.languageTags_ = {};


/**
 * Default language tag
 *
 * @type {String}
 */
AcceptLanguage.prototype.defaultLanguageTag = null;


/**
 * Prune language tags that aren't defined
 *
 * @param {Array.<languageTag>} languageTags
 * @return {Array.<{ value: String, quality: Number }>}
 * @private
 */
AcceptLanguage.prototype.prune_ = function(languageTags) {
  var this_ = this;

  if(Object.size(this.languageTags_) > 0) {
    languageTags = languageTags
      .filter(function(languageTag) {
        var language = languageTag.language;
        // Filter non-defined language tags.
        if(typeof this_.languageTags_[language] === 'undefined') {
          return false;
        }

        return true;
      })

      .map(function(languageTag) {
        var language = languageTag.language;
        if(languageTag.region) {
          var regionIndex = this_.languageTags_[language].regions.indexOf(languageTag.region);
          var hasRegion = true;
          if(regionIndex === -1) {
            hasRegion = false;
            regionIndex = 0;
          }

          // It should return the first matching region language tag
          // only if it doesn't contain ony root language tag.
          // So if the define language tags are ['es-419', 'es-US']
          // and the Accept-Language string is ['es-ES']. We should
          // return 'es-419', because it has the biggest priority.
          //
          // Whenever it matches only language subtag and not region
          // tags and there exist one root language tag. We should
          // return the root language tag. E.g. If we have the set
          // ['es', 'es-419'] and the Accept-Language string is
          // 'es-ES'. Then we should return just ['es'].
          //
          // Wheneve it matches both language and region subtag it
          // should return that matched language tag, regardless if
          // there exist any root only languae subtag. E.g. If we
          // have the set ['es', 'es-419', 'es-PO'] and the Accept-
          // Language header is 'es-419'. Then we should return
          // ['es-419'].
          if(typeof this_.languageTags_[language].values[regionIndex] !== 'undefined') {
            if(hasRegion || !this_.languageTags_[language].onlyLanguageValue) {
              return {
                value: this_.languageTags_[language].values[regionIndex],
                language: language,
                region: this_.languageTags_[language].regions[regionIndex] || null,
                quality: languageTag.quality
              };
            }
          }
          return {
            value: this_.languageTags_[language].onlyLanguageValue,
            language: language,
            region: null,
            quality: languageTag.quality
          };

        }
        return languageTag;
      });
  }

  // If no language tags matches the defined set
  if(languageTags.length === 0 && this_.defaultLanguageTag) {
    return [this_.defaultLanguageTag];
  }

  return languageTags;
};


/**
 * Define languages
 *
 * @param {Array.<String>} languageTags
 * @return {void}
 * @throws {TypeError}
 * @public
 */
AcceptLanguage.prototype.languages = function(languageTags) {
  var this_ = this;

  // Reset language tags
  this.languageTags_ = {};

  languageTags.forEach(function(languageTagString) {
    var languageTag = bcp47.parse(languageTagString);
    if(!languageTag) {
      throw new TypeError('Your language tag (' + languageTagString + ') are not bcp47 compliant. For more info https://tools.ietf.org/html/bcp47.');
    }
    var language = languageTag.langtag.language.language;
    var region = languageTag.langtag.region;
    if(!this_.languageTags_[language]) {
      this_.languageTags_[language] = {
        values: region ? [languageTagString] : [],
        regions: region ? [region] : [],
        onlyLanguageValue: null
      };
    }
    else {
      if(region) {
        this_.languageTags_[language].values.push(languageTagString);
        this_.languageTags_[language].regions.push(region);
      }
    }
    if(!region) {
      this_.languageTags_[language].onlyLanguageValue = languageTagString;
    }
  });

  var defaultLanguageTag = bcp47.parse(languageTags[0]);
  this.defaultLanguageTag = {
    value: languageTags[0],
    language: defaultLanguageTag.langtag.language.language,
    region: defaultLanguageTag.langtag.region,
    quality: 1.0
  };
};


/**
 * Parse accept language string
 *
 * @param {String} string Accept-Language string
 * @return {Array.<{ value: String, quality: Number }>}
 * @public
 */
AcceptLanguage.prototype.parse = function(string) {
  if(typeof string !== 'string' || string.length === 0) {
    return this.defaultLanguageTag ? [this.defaultLanguageTag] : [];
  }

  var languageTags = string.split(',');
  languageTags = languageTags.map(function(languageTagString) {
    languageTagString = languageTagString.replace(/\s+/, '');
    var components = languageTagString.split(';');
    var languageTag = bcp47.parse(components[0]);

    if(!languageTag) {
      return null;
    }

    return {
      value: components[0],
      language: languageTag.langtag.language.language,
      region: languageTag.langtag.region,
      quality: components[1] ? parseFloat(components[1].split('=')[1]) : 1.0
    };
  })

  // Filter non-defined language tags
  .filter(function(languageTag) {
    return languageTag;
  })

  // Sort language tags
  .sort(function(a, b) {
    return b.quality - a.quality;
  });

  return this.prune_(languageTags);
};


/**
 * Get most suitable language tag
 *
 * @param {String} string Accept-Language string
 * @return {String}
 * @public
 */
AcceptLanguage.prototype.get = function(string) {
  return this.parse(string)[0].value;
};

/**
 * For use as a single-ton
 */
module.exports = new AcceptLanguage();

/**
 * For use as a non-singleton
 */

module.exports.AcceptLanguage = AcceptLanguage;


