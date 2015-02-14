
var AcceptLanguage = require('../').AcceptLanguage;

module.exports = function(acceptLanguage) {
  describe('parse()', function() {
    it('should be able to parse a locale string with just one language subtag', function() {
      var acceptLanguage = new AcceptLanguage();
      expect(acceptLanguage.parse('en')).to.eql([{
        value: 'en',
        language: 'en',
        region: null,
        quality: 1
      }]);
    });

    it('should be able to parse a locale string with region subtag', function() {
      var acceptLanguage = new AcceptLanguage();
      expect(acceptLanguage.parse('en-US')).to.eql([{
        value: 'en-US',
        language: 'en',
        region: 'US',
        quality: 1
      }]);
    });

    it('should return default language tag', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languageTags(['en']);
      expect(acceptLanguage.parse('en-US')).to.eql([{
        value: 'en',
        language: 'en',
        region: null,
        quality: 1
      }]);
    });

    it('should return default language tag if no match', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languageTags(['en']);
      expect(acceptLanguage.parse('es')).to.eql([{
        value: 'en',
        language: 'en',
        region: null,
        quality: 1
      }]);
    });

    it('should return default language tag if no match (scripted language tag)', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languageTags(['zh-Hans']);
      expect(acceptLanguage.parse('es')).to.eql([{
        value: 'zh-Hans',
        language: 'zh',
        region: null,
        quality: 1
      }]);
    });

    it('should return most likely language tag if matching is done in language but not in region', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languageTags(['en', 'es-419', 'es-PO']);
      expect(acceptLanguage.parse('es-ES')).to.eql([{
        value: 'es-419',
        language: 'es',
        region: '419',
        quality: 1
      }]);
    });

    it('should return root language tag if matching is done in language but no region', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languageTags(['es', 'es-419', 'es-PO']);
      expect(acceptLanguage.parse('es-ES')).to.eql([{
        value: 'es',
        language: 'es',
        region: null,
        quality: 1
      }]);
    });

    it('should return root language with script tag if matching is done in language but no region', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languageTags(['zh-Hant', 'zh-Hant-MO', 'zh-Hant-TW']);
      expect(acceptLanguage.parse('zh-CN')).to.eql([{
        value: 'zh-Hant',
        language: 'zh',
        region: null,
        quality: 1
      }]);
    });

    it('should return non-root language tag if matching is done in language and region and there exist a root', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languageTags(['es', 'es-419', 'es-PO']);
      expect(acceptLanguage.parse('es-419')).to.eql([{
        value: 'es-419',
        language: 'es',
        region: '419',
        quality: 1
      }]);
    });

    it('should return non-root language tag if matching is done in language and region and there exist a root (scripted language tags)', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languageTags(['zh', 'zh-Hant-CN', 'zh-Hant-TW']);
      expect(acceptLanguage.parse('zh-TW')).to.eql([{
        value: 'zh-Hant-TW',
        language: 'zh',
        region: 'TW',
        quality: 1
      }]);
    });

    it('should return most likely language tag if matching is done in language but not in region (mutliple case)', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languageTags(['en', 'es-419', 'es-PO']);
      expect(acceptLanguage.parse('es-ES, es-US;q=0.8')).to.eql([{
        value: 'es-419',
        language: 'es',
        region: '419',
        quality: 1
      },
      {
        value: 'es-419',
        language: 'es',
        region: '419',
        quality: 0.8
      }]);
    });

    it('should be able to return default language tag with script subtag', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languageTags(['zh-Hant-TW']);
      expect(acceptLanguage.parse('es-ES')).to.eql([{
        value: 'zh-Hant-TW',
        language: 'zh',
        region: 'TW',
        quality: 1
      }]);
    });

    it('should be able to return default language tag with two different script subtag', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languageTags(['zh-Hant-TW', 'zh-Hans-CN']);
      expect(acceptLanguage.parse('zh-CN')).to.eql([{
        value: 'zh-Hans-CN',
        language: 'zh',
        region: 'CN',
        quality: 1
      }]);
    });

    it('should be able to return default language tag with two different script subtag but same region', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languageTags(['zh-Hant-CN', 'zh-Hans-CN']);
      expect(acceptLanguage.parse('zh-CN')).to.eql([{
        value: 'zh-Hant-CN',
        language: 'zh',
        region: 'CN',
        quality: 1
      }]);
    });

    it('should return the most likely language tag if there is multiple matches', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languageTags(['en-US', 'zh-CN']);
      expect(acceptLanguage.parse('en-US;q=0.8, zh-CN;q=1.0')).to.eql([{
        value: 'zh-CN',
        language: 'zh',
        region: 'CN',
        quality: 1
      },
      {
        value: 'en-US',
        language: 'en',
        region: 'US',
        quality: 0.8
      }]);
    });
  });

  describe('get()', function() {
    it('should be able to get the first value', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languageTags(['en-US', 'zh-CN']);
      expect(acceptLanguage.get('en-US;q=0.8, zh-CN;q=1.0')).to.eql('zh-CN');
    });
  });
};
