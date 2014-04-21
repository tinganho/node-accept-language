


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
    it('should be able to parse a single langague', function() {
      expect(acceptLangague.parse('en')).to.eql([{
        code : 'en',
        region : undefined,
        quality : 1
      }]);
    });

    it('should be able to parse multiple langagues without regions', function() {
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
});
