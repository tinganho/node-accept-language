
module.exports = function(acceptLocale) {
  describe('default()', function() {
    it('should be able to set a default locale', function() {
      acceptLocale.default({
        language : 'en',
        region : 'US'
      });
      expect(acceptLocale.defaultLocale).to.eql({
        language : 'en',
        region : 'US',
        value : 'en-US',
        quality : 1
      });
      acceptLocale.default('en-US');
      expect(acceptLocale.defaultLocale).to.eql({
        language : 'en',
        region : 'US',
        value : 'en-US',
        quality : 1
      });
    });

    describe('should throw an error', function() {
      it('if region code does not exists', function() {
        expect(function() {
          acceptLocale.default('en');
        }).to.throw(TypeError, 'First parameter is not a locale string e.g. en-US.');
        expect(function() {
          acceptLocale.default({
            language : 'en'
          });
        }).to.throw(TypeError, 'Region code must be a string and can\'t be undefined.');
      });
      it('if language code does not exists', function() {
        expect(function() {
          acceptLocale.default('US');
        }).to.throw(TypeError, 'First parameter is not a locale string e.g. en-US.');
        expect(function() {
          acceptLocale.default({
            region : 'en'
          });
        }).to.throw(TypeError, 'Language code must be a string and can\'t be undefined.');
      });
      it('if the locale code does not conform to the syntax', function() {
        expect(function() {
          acceptLocale.default('enpeokefpok');
        }).to.throw(TypeError, 'First parameter is not a locale string e.g. en-US.');
      });
      it('if there is no provided parameter', function() {
        expect(function() {
          acceptLocale.default();
        }).to.throw(TypeError, 'First parameter must be a locale object.');
      });
      it('if the provided parameter is not a string', function() {
        expect(function() {
          acceptLocale.default(1);
        }).to.throw(TypeError, 'First parameter must be a locale object.');
      });
    });
  });
};
