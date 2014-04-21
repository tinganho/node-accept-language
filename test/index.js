
/**
 * Modules
 */

var sinonChai = require('sinon-chai')
  , acceptLangague = require('../');

global.sinon = require('sinon');
global.chai = require('chai');
global.expect = require('chai').expect;

/**
 * Use Sinon Chai plugin
 */

chai.use(sinonChai);

describe('accept-language', function() {
  describe('#parse', function() {
    it('should be able to parse a single language', function() {
      expect(acceptLangague.parse('en')).to.eql([{
        code : 'en',
        region : undefined,
        quality : 1
      }]);
    });

    it('should be able to parse multiple languages without regions', function() {
      expect(acceptLangague.parse('en,zh')).to.eql([{
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
      expect(acceptLangague.parse('en')).to.eql([{
        code : 'en',
        region : undefined,
        quality : 1
      }]);

      expect(acceptLangague.parse('en,zh-CN;q=0.8')).to.eql([{
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
      expect(acceptLangague.parse('en-US')).to.eql([{
        code : 'en',
        region : 'US',
        quality : 1
      }]);
    });

    it('should be able to set specified quality', function() {
      expect(acceptLangague.parse('en-US;q=0.8')).to.eql([{
        code : 'en',
        region : 'US',
        quality : 0.8
      }]);
    });

    it('should be able to parse multiple languages', function() {
      expect(acceptLangague.parse('en-US;q=0.8,zh-CN;q=1')).to.eql([{
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

    it('should be able to sort locales based on language quality', function() {
      expect(acceptLangague.parse('en-US;q=0.8,zh-CN;q=1')).to.eql([{
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
      expect(acceptLangague.parse('*;q=0.8')).to.eql([{
        code : '*',
        region : undefined,
        quality : 0.8
      }]);
    });

    it('should be able to parse wildcards with non-wildcards', function() {
      expect(acceptLangague.parse('zh-CN,*;q=0.8')).to.eql([{
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
      expect(acceptLangague
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
  });

  describe('#codes', function() {
    it('should filter non-defined codes', function() {
      acceptLangague.codes(['en', 'zh']);
      expect(acceptLangague.parse('fr-CA,zh, en-US;q=0.8')).to.eql([{
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
        acceptLangague.default(1);
      };
      expect(sample).to.throw(TypeError, 'First parameter must be an object');
    });

    it('should throw an error if language object don\'t contain a code property', function() {
      var language = {
        region : 'US',
        quality : 1
      };
      var sample = function() {
        acceptLangague.default(language);
      };
      expect(sample).to.throw(TypeError, 'Property code must be a string and can\'t be undefined');
    });

    it('should throw an error if language object contain a code property but with wrong type', function() {
      var language = {
        code : 1,
        region : 'US',
        quality : 1
      };
      var sample = function() {
        acceptLangague.default(language);
      };
      expect(sample).to.throw(TypeError, 'Property code must be a string and can\'t be undefined');
    });

    it('should throw an error if language object contain a code property but with wrong syntax', function() {
      var language = {
        code : 'US',
        region : 'US',
        quality : 1
      };
      var sample = function() {
        acceptLangague.default(language);
      };
      expect(sample).to.throw(TypeError, 'Property code must consist of two lowercase letters [a-z]');
    });

    it('should throw an error if language object contain a region property with wrong syntax', function() {
      var language = {
        code : 'en',
        region : 'USS',
        quality : 1
      };
      var sample = function() {
        acceptLangague.default(language);
      };
      expect(sample).to.throw(TypeError, 'Property region must consist of two case-insensitive letters [a-zA-Z]');
    });

    it('should return the default language if there is no match', function() {
      var language = {
        code : 'en',
        region : 'US',
        quality : 1
      };
      acceptLangague.default(language);
      acceptLangague.codes(['en', 'zh']);
      expect(acceptLangague.parse('fr-CA')).to.eql(language);
    });

    it('shouldn\'t return the default language if there is a match', function() {
      var language = {
        code : 'en',
        region : 'US',
        quality : 1
      };
      acceptLangague.default(language);
      acceptLangague.codes(['en', 'zh']);
      expect(acceptLangague.parse('zh-CN')).to.not.eql(language);
    });
  });
});
