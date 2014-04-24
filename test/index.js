
/**
 * Modules
 */

var sinonChai = require('sinon-chai')
  , acceptLanguage = require('../');

global.sinon = require('sinon');
global.chai = require('chai');
global.expect = require('chai').expect;

/**
 * Use Sinon Chai plugin
 */

chai.use(sinonChai);

describe('acceptLanguage', function() {
  describe('#parse', function() {
    it('should be able to parse a single language', function() {
      expect(acceptLanguage.parse('en')).to.eql([{
        code : 'en',
        region : undefined,
        quality : 1
      }]);
    });

    it('should be able to parse multiple languages without regions', function() {
      expect(acceptLanguage.parse('en,zh')).to.eql([{
        code : 'en',
        region : undefined,
        quality : 1
      },
      {
        code : 'zh',
        region : undefined,
        quality : 1
      }]);
    });

    it('should be able to set default quality to 1', function() {
      expect(acceptLanguage.parse('en')).to.eql([{
        code : 'en',
        region : undefined,
        quality : 1
      }]);

      expect(acceptLanguage.parse('en,zh-CN;q=0.8')).to.eql([{
        code : 'en',
        region : undefined,
        quality : 1
      },{
        code : 'zh',
        region : 'CN',
        quality : 0.8
      }]);
    });

    it('should be able to parse region code', function() {
      expect(acceptLanguage.parse('en-US')).to.eql([{
        code : 'en',
        region : 'US',
        quality : 1
      }]);
    });

    it('should be able to set specified quality', function() {
      expect(acceptLanguage.parse('en-US;q=0.8')).to.eql([{
        code : 'en',
        region : 'US',
        quality : 0.8
      }]);
    });

    it('should be able to parse multiple languages', function() {
      expect(acceptLanguage.parse('en-US;q=0.8,zh-CN;q=1')).to.eql([{
        code : 'zh',
        region : 'CN',
        quality : 1
      },
      {
        code : 'en',
        region : 'US',
        quality : 0.8
      }]);
    });

    it('should be able to sort languages based on language quality', function() {
      expect(acceptLanguage.parse('en-US;q=0.8,zh-CN;q=1')).to.eql([{
        code : 'zh',
        region : 'CN',
        quality : 1
      },
      {
        code : 'en',
        region : 'US',
        quality : 0.8
      }]);
    });

    it('should be able to parse a single wildcard', function() {
      expect(acceptLanguage.parse('*;q=0.8')).to.eql([{
        code : '*',
        region : undefined,
        quality : 0.8
      }]);
    });

    it('should be able to parse wildcards with non-wildcards', function() {
      expect(acceptLanguage.parse('zh-CN,*;q=0.8')).to.eql([{
        code : 'zh',
        region : 'CN',
        quality : 1
      },
      {
        code : '*',
        region : undefined,
        quality : 0.8
      }]);
    });

    it('should be able to parse random white-space', function() {
      expect(acceptLanguage
        .parse('fr-CA, fr;q=0.8,  en-US;q=0.6,en;q=0.4,    *;q=0.1'))
        .to.eql([{
          code : 'fr',
          region : 'CA',
          quality : 1
        },
        {
          code : 'fr',
          region : undefined,
          quality : 0.8
        },
        {
          code : 'en',
          region : 'US',
          quality : 0.6
        },
        {
          code : 'en',
          region : undefined,
          quality : 0.4
        },
        {
          code : '*',
          region : undefined,
          quality : 0.1
        }]);
    });

    it('should return empty array if the provided argument to `parse()` is not string', function() {
        expect(acceptLanguage.parse(1)).to.eql([]);
    });
  });

  describe('#codes', function() {
    it('should filter non-defined codes', function() {
      acceptLanguage.codes(['en', 'zh']);
      expect(acceptLanguage.parse('fr-CA,zh, en-US;q=0.8')).to.eql([{
        code : 'zh',
        region : undefined,
        quality : 1
      },
      {
        code : 'en',
        region : 'US',
        quality : 0.8
      }]);
    });
  });

  describe('#default', function() {
    it('should throw an error if the first parameeter is not an object', function() {
      var sample = function() {
        acceptLanguage.default(1);
      };
      expect(sample).to.throw(TypeError, 'First parameter must be an object');
    });

    it('should throw an error if language object don\'t contain a code property', function() {
      var language = {
        region : 'US'
      };
      var sample = function() {
        acceptLanguage.default(language);
      };
      expect(sample).to.throw(TypeError, 'Property code must be a string and can\'t be undefined');
    });

    it('should throw an error if language object contain a code property but with wrong type', function() {
      var language = {
        code : 1,
        region : 'US'
      };
      var sample = function() {
        acceptLanguage.default(language);
      };
      expect(sample).to.throw(TypeError, 'Property code must be a string and can\'t be undefined');
    });

    it('should throw an error if language object contain a code property but with wrong syntax', function() {
      var language = {
        code : 'US',
        region : 'US'
      };
      var sample = function() {
        acceptLanguage.default(language);
      };
      expect(sample).to.throw(TypeError, 'Property code must consist of two lowercase letters [a-z]');
    });

    it('should default the quality to 1.0', function() {
      var language = {
        code : 'en',
        region : 'US'
      };
      acceptLanguage.default(language);
      expect(acceptLanguage.defaultLanguage.quality).to.equal(1);
    });

    it('should throw an error if language object contain a region property with wrong syntax', function() {
      var language = {
        code : 'en',
        region : 'USS',
        quality : 1
      };
      var sample = function() {
        acceptLanguage.default(language);
      };
      expect(sample).to.throw(TypeError, 'Property region must consist of two case-insensitive letters [a-zA-Z]');
    });

    it('should return the default language if there is no match', function() {
      var language = {
        code : 'en',
        region : 'US',
        quality : 1
      };
      acceptLanguage.default(language);
      acceptLanguage.codes(['en', 'zh']);
      expect(acceptLanguage.parse('fr-CA')).to.eql([language]);
    });

    it('should return the default language if the provided argument to `parse()` is not a string', function() {
      var language = {
        code : 'en',
        region : 'US',
        quality : 1
      };
      acceptLanguage.default(language);
      expect(acceptLanguage.parse(1)).to.eql([language]);
    });

    it('should return the default language if the provided argument to `parse()` is an empty string', function() {
      var language = {
        code : 'en',
        region : 'US',
        quality : 1
      };
      acceptLanguage.default(language);
      expect(acceptLanguage.parse('')).to.eql([language]);
    });

    it('shouldn\'t return the default language if there is a match', function() {
      var language = {
        code : 'en',
        region : 'US',
        quality : 1
      };
      acceptLanguage.default(language);
      acceptLanguage.codes(['en', 'zh']);
      expect(acceptLanguage.parse('zh-CN')).to.not.eql([language]);
    });
  });
});
