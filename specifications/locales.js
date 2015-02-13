
module.exports = function(acceptLocale) {
  describe('locales()', function() {
    it('should be able to set a locale string', function() {
      acceptLocale.locales(['en-US']);
      expect(acceptLocale._locales).to.eql({
        'en' : {
          regions : ['US']
        }
      });
      acceptLocale.locales([{
        language : 'en',
        region : 'US'
      }]);
      expect(acceptLocale._locales).to.eql({
        'en' : {
          regions : ['US']
        }
      });
    });

    it('should be able to set multiple locale strings', function() {
      acceptLocale.locales(['en-US', 'zh-CN']);
      expect(acceptLocale._locales).to.eql({
        'en' : {
          regions : ['US']
        },
        'zh' : {
          regions : ['CN']
        }
      });
      acceptLocale.locales([{
        language : 'en',
        region : 'US'
      },
      {
        language : 'zh',
        region : 'CN'
      }]);
      expect(acceptLocale._locales).to.eql({
        'en' : {
          regions : ['US']
        },
        'zh' : {
          regions : ['CN']
        }
      });
    });

    it('should be able to set multiple locale strings with the same language but different regions', function() {
      acceptLocale.locales(['en-US', 'en-UK']);
      expect(acceptLocale._locales).to.eql({
        'en' : {
          regions : ['US', 'UK']
        }
      });
      acceptLocale.locales([{
        language : 'en',
        region : 'US'
      },
      {
        language : 'en',
        region : 'UK'
      }]);
      expect(acceptLocale._locales).to.eql({
        'en' : {
          regions : ['US', 'UK']
        }
      });
    });

    it('should be able to set a region with numbers', function() {
      acceptLocale.locales(['en-US', 'es-419']);
      acceptLocale.default('es-419');
      expect(acceptLocale.parse('es-419')).to.eql([{
        language : 'es',
        region : 'ES',
        quality : 1,
        value : 'es-ES'
      }]);
    });

    describe('should throw an error', function() {
      it('if string is not a locale string', function() {
        expect(function() {
          acceptLocale.locales(['en-USWEF'])
        }).to.throw(TypeError, 'First parameter is not a locale string e.g. en-US.');
        expect(function() {
          acceptLocale.locales(['en-US', 'en-'])
        }).to.throw(TypeError, 'First parameter is not a locale string e.g. en-US.');
        expect(function() {
          acceptLocale.locales(['en-US', 'US'])
        }).to.throw(TypeError, 'First parameter is not a locale string e.g. en-US.');
      });
      it('if a locale doesn\'t contain language code', function() {
        expect(function() {
          acceptLocale.locales([{
            region : 'US'
          }])
        }).to.throw(TypeError, 'Language codes must be of type string.');
      });
      it('if a locale doesn\'t contain a proper language code', function() {
        expect(function() {
          acceptLocale.locales([{
            language : 'ZH',
            region : 'US'
          }])
        }).to.throw(TypeError, /Wrong syntax on language code/);
      });
      it('if a locale doesn\'t contain region code', function() {
        expect(function() {
          acceptLocale.locales([{
            language : 'zh'
          }])
        }).to.throw(TypeError, 'Region codes must be of type string.');
      });
      it('if a locale doesn\'t contain a proper region code', function() {
        expect(function() {
          acceptLocale.locales([{
            language : 'zh',
            region : 'USS'
          }])
        }).to.throw(TypeError, /Wrong syntax on region code/);
      });
    });
  });
};
