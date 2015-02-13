
module.exports = function(acceptLocale) {
  describe('parse()', function() {
    it('should be able to parse a locale string with just one language code', function() {
      acceptLocale.locales(['en-US']);
      acceptLocale.default('en-US');
      expect(acceptLocale.parse('en')).to.eql([{
        language : 'en',
        region : 'US',
        quality : 1,
        value : 'en-US'
      }]);
    });

    it('should be able to parse a locale string with one language code and one region code', function() {
      acceptLocale.locales(['en-US']);
      acceptLocale.default('en-US');
      expect(acceptLocale.parse('en-US')).to.eql([{
        language : 'en',
        region : 'US',
        quality : 1,
        value : 'en-US'
      }]);
    });

    it('should be able to parse a locale string with one language code and one region code and one quality property', function() {
      acceptLocale.locales(['en-US']);
      acceptLocale.default('en-US');
      expect(acceptLocale.parse('en-US;q=0.8')).to.eql([{
        language : 'en',
        region : 'US',
        quality : 0.8,
        value : 'en-US'
      }]);
    });

    it('should be able to parse multiple languages', function() {
      acceptLocale.locales(['en-US', 'zh-CN']);
      acceptLocale.default('en-US');
      expect(acceptLocale.parse('en-US;q=0.8,zh;q=0.7')).to.eql([{
        language : 'en',
        region : 'US',
        quality : 0.8,
        value : 'en-US'
      },
      {
        language : 'zh',
        region : 'CN',
        quality : 0.7,
        value : 'zh-CN'
      }]);
    });

    it('should omit languages that is not defined', function() {
      acceptLocale.locales(['en-US']);
      acceptLocale.default('en-US');
      expect(acceptLocale.parse('en-US;q=0.8,zh;q=0.7')).to.eql([{
        language : 'en',
        region : 'US',
        quality : 0.8,
        value : 'en-US'
      }]);
    });

    it('should defualt on specfied language when no matches', function() {
      acceptLocale.locales(['en-US']);
      acceptLocale.default('en-US');
      expect(acceptLocale.parse('fr-CA')).to.eql([{
        language : 'en',
        region : 'US',
        quality : 1,
        value : 'en-US'
      }]);
    });

    it('should be able to parse a region with numbers', function() {
      acceptLocale.locales(['en-US', 'es-ES']);
      acceptLocale.default('en-US');
      expect(acceptLocale.parse('es-419')).to.eql([{
        language : 'es',
        region : 'ES',
        quality : 1,
        value : 'es-ES'
      }]);
    });
  });
};
