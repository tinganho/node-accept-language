
var AcceptLanguage = require('../').AcceptLanguage;

module.exports = function(acceptLanguage) {
  describe('get()', function() {
    xit('should return no match on an empty language list', function() {
      var acceptLanguage = new AcceptLanguage();
      expect(acceptLanguage.get('en')).to.eql(null);
    });

    xit('should return no match when there is no matching prefix', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languages(['en']);
      expect(acceptLanguage.get('x-pirate')).to.eql(null);
    });

    it('should return matching prefix', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languages(['en']);
      expect(acceptLanguage.get('en-US')).to.eql('en');
    });

    xit('should return no match when there is no matching prefix', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languages(['en']);
      expect(acceptLanguage.get('es')).to.eql(null);
    });

    xit('should return no match when there is no matching prefix', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languages(['zh-Hans']);
      expect(acceptLanguage.get('es')).to.eql(null);
    });

    xit('should return no match when there is no matching prefix', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languages(['en', 'es-419', 'es-PO']);
      expect(acceptLanguage.get('es-ES')).to.eql(null);
    });

    it('should return matching prefix', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languages(['es', 'es-419', 'es-PO']);
      expect(acceptLanguage.get('es-ES')).to.eql('es');
    });

    xit('should return no match when there is no matching prefix', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languages(['zh-Hant', 'zh-Hant-MO', 'zh-Hant-TW']);
      expect(acceptLanguage.get('zh-CN')).to.eql(null);
    });

    it('should return exact match', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languages(['es', 'es-419', 'es-PO']);
      expect(acceptLanguage.get('es-419')).to.eql('es-419');
    });

    xit('should return exact match regardless of case', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languages(['es', 'Es-419', 'es-PO']);
      expect(acceptLanguage.get('eS-419')).to.eql('Es-419');
    });

    xit('should return matching prefix', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languages(['zh', 'zh-Hant-CN', 'zh-Hant-TW']);
      expect(acceptLanguage.get('zh-TW')).to.eql('zh');
    });

    xit('should return no match when there is no matching prefix', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languages(['en', 'es-419', 'es-PO']);
      expect(acceptLanguage.get('es-ES, es-US;q=0.8')).to.eql(null);
    });

    xit('should return no match when there is no matching prefix', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languages(['zh-Hant-TW']);
      expect(acceptLanguage.get('es-ES')).to.eql(null);
    });

    xit('should return no match when there is no matching prefix', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languages(['zh-Hant-TW', 'zh-Hans-CN']);
      expect(acceptLanguage.get('zh-CN')).to.eql(null);
    });

    xit('should return no match when there is no matching prefix', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languages(['zh-Hans-CN', 'zh-Hant-CN']);
      expect(acceptLanguage.get('zh-CN')).to.eql(null);
    });

    it('should return the highest quality match', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languages(['en-US', 'zh-CN']);
      expect(acceptLanguage.get('en-US;q=0.8, zh-CN;q=1.0')).to.eql('zh-CN');
    });

    xit('should return the highest quality match', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languages(['en', 'sr-Latn', 'sr-Cyrl']);
      expect(acceptLanguage.get('en;q=0.8, sr-Cyrl-RS;q=1.0, sr-Latn-RS;q=0.95')).to.eql('sr-Cyrl');
      expect(acceptLanguage.get('en;q=0.8, sr-Cyrl-RS;q=0.95, sr-Latn-BA;q=1.0')).to.eql('sr-Latn');
      expect(acceptLanguage.get('en;q=0.8, sr-Cyrl;q=0.95, sr-Latn-ME;q=1.0')).to.eql('sr-Latn');
      expect(acceptLanguage.get('en;q=0.8, sr-RS;q=1.0')).to.eql('en');
      expect(acceptLanguage.get('en-US;q=0.8, sr-RS;q=1.0')).to.eql('en');
      expect(acceptLanguage.get('en;q=0.8, sr-Latn;q=1.0')).to.eql('sr-Latn');
      expect(acceptLanguage.get('en;q=0.8, sr-Latin;q=1.0')).to.eql('en'); // malformed script subtag
      expect(acceptLanguage.get('en;q=0.8, sr-Lat;q=1.0')).to.eql('en'); // malformed script subtag
      expect(acceptLanguage.get('en;q=0.8, sr;q=1.0')).to.eql('en');
    });

    xit('should return matches following an example given in RFC 4647', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languages(['zh-Hant-CN-x-private1-private2']);
      expect(acceptLanguage.get('en')).to.eql(null);
      expect(acceptLanguage.get('zh-Hant-CN-x-private1-private2')).to.eql('zh-Hant-CN-x-private1-private2');
      expect(acceptLanguage.get('zh-Hant-CN-x-private1')).to.eql(null);
      expect(acceptLanguage.get('zh-Hant-CN')).to.eql(null);
      expect(acceptLanguage.get('zh-Hant')).to.eql(null);
      expect(acceptLanguage.get('zh')).to.eql(null);
    });
    xit('should return matches following an example given in RFC 4647', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languages(['zh-Hant-CN']);
      expect(acceptLanguage.get('en')).to.eql(null);
      expect(acceptLanguage.get('zh-Hant-CN-x-private1-private2')).to.eql('zh-Hant-CN');
      expect(acceptLanguage.get('zh-Hant-CN-x-private1')).to.eql('zh-Hant-CN');
      expect(acceptLanguage.get('zh-Hant-CN')).to.eql('zh-Hant-CN');
      expect(acceptLanguage.get('zh-Hant')).to.eql(null);
      expect(acceptLanguage.get('zh')).to.eql(null);
    });
    xit('should return matches following an example given in RFC 4647', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languages(['zh']);
      expect(acceptLanguage.get('en')).to.eql(null);
      expect(acceptLanguage.get('zh-Hant-CN-x-private1-private2')).to.eql('zh');
      expect(acceptLanguage.get('zh-Hant-CN-x-private1')).to.eql('zh');
      expect(acceptLanguage.get('zh-Hant-CN')).to.eql('zh');
      expect(acceptLanguage.get('zh-Hant')).to.eql('zh');
      expect(acceptLanguage.get('zh')).to.eql('zh');
    });
      
    it('should return match following an example given in RFC 4647', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languages(['de']);
      expect(acceptLanguage.get('de-ch')).to.eql('de');
    });
    it('should return match following an example given in RFC 4647', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languages(['de-CH']);
      expect(acceptLanguage.get('de-ch')).to.eql('de-CH');
    });
    xit('should return no match following an example given in RFC 4647', function() {
      var acceptLanguage = new AcceptLanguage();
      acceptLanguage.languages(['de-CH-1966']);
      expect(acceptLanguage.get('de-ch')).to.eql(null);
    });
  });
};
