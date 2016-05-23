

/**
 * Dependencies
 */
var bcp47 = require('bcp47');


/**
 * AcceptLanguage
 */
function AcceptLanguage() {
  this.byLowerCaseTag = {};
}


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

  if(Object.keys(this.languageTags_).length > 0) {
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
  var byLowerCaseTag = {};

  // Reset language tags
  this.languageTags_ = {};
  this.byLowerCaseTag = byLowerCaseTag;

  languageTags.forEach(function(languageTagString) {
    var languageTag = bcp47.parse(languageTagString);
    if(!languageTag) {
      throw new TypeError('Your language tag (' + languageTagString + ') are not bcp47 compliant. For more info https://tools.ietf.org/html/bcp47.');
    }
    var language = languageTag.langtag.language.language;
    if(!language) {
      throw new TypeError('Your language tag (' + languageTagString + ') is not supported.');
    }
    var region = languageTag.langtag.region;
    byLowerCaseTag[languageTagString.toLowerCase()] = languageTagString;
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
 * Look up most suitable language tag according to BCP 47 rules, more precisely RFC 4647 "3.4. Lookup"
 *
 * @param {String} languagePriorityList Accept-Language header string
 * @return {String}
 * @public
 */
AcceptLanguage.prototype.lookup = function(languagePriorityList) {
  if(typeof languagePriorityList !== 'string' || languagePriorityList.length === 0) {
    return null;
  }

  var parsedAndSortedLanguageRanges = languagePriorityList.split(',').map(function(weightedLanguageRange) {
    var components = weightedLanguageRange.replace(/\s+/, '').split(';');
    return {
      languageRange: components[0],
      quality: components[1] ? parseFloat(components[1].split('=')[1]) : 1.0
    };
  })
  // sort language ranges
  .sort(function(a, b) {
    return b.quality - a.quality;
  });

  // Array findIndex() would be more elegant, but it needs ECMAScript 2015
  var i0, n0;
  var languageRange; // term "language range" as used in RFC 4647
  var prefixes;
  var i1, n1;
  var match;
  for (i0=0, n0=parsedAndSortedLanguageRanges.length; i0<n0; i0++) {
    languageRange = parsedAndSortedLanguageRanges[i0].languageRange;
    if (match = this.byLowerCaseTag[languageRange.toLowerCase()]) {
      return match;
    }
    prefixes = getPrefixes(languageRange);
    for (i1=0, n1=prefixes.length; i1<n1; i1++) {
      if (match = this.byLowerCaseTag[prefixes[i1]]) {
        return match;
      }
    }
  }
  return null;

  function getPrefixes(languageRange) {
    var languageTag = bcp47.parse(languageRange);
    if (!languageTag || !languageTag.langtag.language.language) { // langtag languages only
      return [];
    }
    var langtag = languageTag.langtag;
    var prefix = langtag.language.language.toLowerCase(); // the primary language is the shortest prefix
    var prefixes = [prefix];
    var delimiter = '-';
    ['extlang', 'script', 'region', 'variant', 'extension', 'privateuse'].forEach(function(property) {
      if (property === 'privateuse') {
        delimiter = '-x-';
      }
      if (langtag[property] instanceof Array) {
        langtag[property].forEach(check);
      } else {
        check(langtag[property]);
      }

      function check(subtag) {
        if (subtag) {
          prefix += delimiter + subtag.toLowerCase();
          delimiter = '-';
          prefixes.push(prefix);
        }
      }
    });
    return prefixes.reverse();
  }
};

/**
 * For use as a singleton
 */
module.exports = new AcceptLanguage();

/**
 * For use as a non-singleton
 */

module.exports.AcceptLanguage = AcceptLanguage;


