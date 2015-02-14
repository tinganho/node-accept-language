
module.exports = function(acceptLanguage) {
  describe('languages()', function() {
    describe('set language tag', function() {
      it('should be able to set a language tag with region', function() {
        acceptLanguage.languages(['en-US']);
        expect(acceptLanguage.languageTags_).to.eql({
          'en': {
            regions: ['US'],
            values: ['en-US'],
            onlyLanguageValue: null
          }
        });
      });

      it('should be able to set a language tag with no region', function() {
        acceptLanguage.languages(['en']);
        expect(acceptLanguage.languageTags_).to.eql({
          'en': {
            regions: [],
            values: [],
            onlyLanguageValue: 'en'
          }
        });
      });

      it('should be able to set two language tag with no region, one with script tag, and it should use the last', function() {
        acceptLanguage.languages(['zh', 'zh-Hans']);
        expect(acceptLanguage.languageTags_).to.eql({
          'zh': {
            regions: [],
            values: [],
            onlyLanguageValue: 'zh-Hans'
          }
        });
      });

      it('should be able to set multiple language tags with the same language subtags', function() {
        acceptLanguage.languages(['en-US', 'en-GB']);
        expect(acceptLanguage.languageTags_).to.eql({
          'en' : {
            regions: ['US', 'GB'],
            values: ['en-US', 'en-GB'],
            onlyLanguageValue: null
          }
        });
      });

      it('should be able to set multiple language tags with the same language subtags and with single language subtag', function() {
        acceptLanguage.languages(['en-US', 'en-GB', 'en']);
        expect(acceptLanguage.languageTags_).to.eql({
          'en' : {
            regions: ['US', 'GB'],
            values: ['en-US', 'en-GB'],
            onlyLanguageValue: 'en'
          }
        });
      });

      it('should be able to set multiple language tags with regions', function() {
        acceptLanguage.languages(['en-US', 'zh-CN']);
        expect(acceptLanguage.languageTags_).to.eql({
          'en': {
            regions: ['US'],
            values: ['en-US'],
            onlyLanguageValue: null
          },
          'zh': {
            regions: ['CN'],
            values: ['zh-CN'],
            onlyLanguageValue: null
          }
        });
      });

      it('should be able to set multiple language tags with no regions', function() {
        acceptLanguage.languages(['en', 'zh']);
        expect(acceptLanguage.languageTags_).to.eql({
          'en': {
            regions: [],
            values: [],
            onlyLanguageValue: 'en'
          },
          'zh': {
            regions: [],
            values: [],
            onlyLanguageValue: 'zh'
          }
        });
      });

      it('should be able to set multiple language tag with no regions and with region with the same language', function() {
        acceptLanguage.languages(['en', 'en-US']);
        expect(acceptLanguage.languageTags_).to.eql({
          'en': {
            regions: ['US'],
            values: ['en-US'],
            onlyLanguageValue: 'en'
          }
        });
      });

      it('should be able to set multiple language tag with no regions and with region with the different language', function() {
        acceptLanguage.languages(['en', 'zh-CN']);
        expect(acceptLanguage.languageTags_).to.eql({
          'en' : {
            regions: [],
            values: [],
            onlyLanguageValue: 'en'
          },
          'zh': {
            regions: ['CN'],
            values: ['zh-CN'],
            onlyLanguageValue: null
          }
        });
      });

      it('should be able to set a language tag with a numeric region', function() {
        acceptLanguage.languages(['es-419']);
        expect(acceptLanguage.languageTags_).to.eql({
          'es' : {
            regions: ['419'],
            values: ['es-419'],
            onlyLanguageValue: null
          }
        });
      });

      it('should be able to set a language tag with a script sub tag', function() {
        acceptLanguage.languages(['zh-Hant-TW']);
        expect(acceptLanguage.languageTags_).to.eql({
          'zh' : {
            regions: ['TW'],
            values: ['zh-Hant-TW'],
            onlyLanguageValue: null
          }
        });
      });

      it('should throw an error if using a non-string language tag', function() {
        var method = function() {
          acceptLanguage.languages([1]);
        }
        expect(method).to.throw('Your language tag (1) are not bcp47 compliant. For more info https://tools.ietf.org/html/bcp47.');
      });

      it('should throw an error if using incompliant language subtag', function() {
        var method = function() {
          acceptLanguage.languages(['e-US']);
        }
        expect(method).to.throw('Your language tag (e-US) are not bcp47 compliant. For more info https://tools.ietf.org/html/bcp47.');
      });

      it('should throw an error if using incompliant region subtag', function() {
        var method = function() {
          acceptLanguage.languages(['en-U']);
        }
        expect(method).to.throw('Your language tag (en-U) are not bcp47 compliant. For more info https://tools.ietf.org/html/bcp47.');
      });

      it('should throw an error if using incompliant script subtag', function() {
        var method = function() {
          acceptLanguage.languages(['zh-Ha-TW']);
        }
        expect(method).to.throw('Your language tag (zh-Ha-TW) are not bcp47 compliant. For more info https://tools.ietf.org/html/bcp47.');
      });
    });

    describe('default language tag', function() {
      it('should be able to set a default language tag with a region', function() {
        acceptLanguage.languages(['en-US']);
        expect(acceptLanguage.defaultLanguageTag).to.eql({
          value: 'en-US',
          language: 'en',
          region: 'US',
          quality: 1
        });
      });

      it('should be able to set a default language tag with no region', function() {
        acceptLanguage.languages(['en']);
        expect(acceptLanguage.defaultLanguageTag).to.eql({
          value: 'en',
          language: 'en',
          region: null,
          quality: 1
        });
      });

      it('should be able to set a default language tag from a multitude of language tags with no regions', function() {
        acceptLanguage.languages(['en', 'zh']);
        expect(acceptLanguage.defaultLanguageTag).to.eql({
          value: 'en',
          language: 'en',
          region: null,
          quality: 1
        });
      });

      it('should be able to set a default language tag from a multitude of language tags with regions', function() {
        acceptLanguage.languages(['en-US', 'zh-CN']);
        expect(acceptLanguage.defaultLanguageTag).to.eql({
          value: 'en-US',
          language: 'en',
          region: 'US',
          quality: 1
        });
      });
    });
  });
};
