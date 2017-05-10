
import AcceptLanguage from '../Source/AcceptLanguage';
import chai = require('chai');
const expect = chai.expect;

const DEFAULT_LANGUAGE = 'fr';

function createInstanceWithDefault(definedLanguages?: string[]) {
    const al = AcceptLanguage.create();
    if (definedLanguages) {
        // make sure the default is different
        al.languages([DEFAULT_LANGUAGE].concat(definedLanguages));
    }
    return al;
}

describe('Language definitions', () => {
    it('should throw when defined languages is empty', () => {
        const method = () => {
            const al = AcceptLanguage.create();
            al.languages([]);
        }
        expect(method).to.throw();
    });

    it('should return null on no defined languages', () => {
        const al = AcceptLanguage.create();
        expect(al.get('sv')).to.equal(null);
    });

    it('should return default language when no match', () => {
        const al = AcceptLanguage.create();
        al.languages(['en']);
        expect(al.get('sv')).to.equal('en');
    });

    it('should match broadest requested language', () => {
        const al2 = createInstanceWithDefault(['zh', 'zh-Hant', 'zh-Hans', 'fr']);
        expect(al2.get('zh-Hant-TW')).to.equal('zh-Hant');
        expect(al2.get('zh-TW')).to.equal('zh');
        const al = createInstanceWithDefault(['en']);
        expect(al.get('en-US')).to.equal('en');
    });

    it('should match wider requested languages', () => {
        const al1 = createInstanceWithDefault(['en-US']);
        expect(al1.get('en')).to.equal('en-US');
        const al2 = createInstanceWithDefault(['zh-Hant']);
        expect(al2.get('zh')).to.equal('zh-Hant');
    });

    it('should match wider best matched requested languages', () => {
        const al1 = createInstanceWithDefault(['zh-TW', 'zh-Hant']);
        expect(al1.get('zh-Hant-TW')).to.equal('zh-Hant');
        const al2 = createInstanceWithDefault(['zh-Hant', 'zh-TW']);
        expect(al2.get('zh-Hant-TW')).to.equal('zh-Hant');
    });

    it('should match multiple requested languages', () => {
        const al = createInstanceWithDefault(['en-US']);
        expect(al.get('en-US,sv-SE')).to.equal('en-US');
    });

    it('should match multiple defined languages', () => {
        const al = createInstanceWithDefault(['en-US', 'sv-SE']);
        expect(al.get('en-US,sv-SE')).to.equal('en-US');
    });

    it('should match based on quality', () => {
        const al = createInstanceWithDefault(['en-US', 'zh-CN']);
        expect(al.get('en-US;q=0.8,zh-CN;q=1.0')).to.equal('zh-CN');
    });

    it('should match on script', () => {
        const al = createInstanceWithDefault(['en-US', 'zh-Hant']);
        expect(al.get('zh-Hant;q=1,en-US;q=0.8')).to.equal('zh-Hant');
    });

    it('should match on region', () => {
        const al = createInstanceWithDefault(['en-US', 'zh-CN']);
        expect(al.get('en-US;q=0.8, zh-CN;q=1.0')).to.equal('zh-CN');
    });

    it('should match on variant', () => {
        const al = createInstanceWithDefault(['en-US', 'de-CH-1996']);
        expect(al.get('en-US;q=0.8, de-CH-1996;q=1.0')).to.equal('de-CH-1996');
    });

    it('should match on privateuse', () => {
        const al = createInstanceWithDefault(['en-US', 'de-CH-x-a']);
        expect(al.get('en-US;q=0.8, de-CH-x-a;q=1.0')).to.equal('de-CH-x-a');
    });

    it('should match on extension', () => {
        const al = createInstanceWithDefault(['zh-CN', 'en-a-bbb']);
        expect(al.get('en-US;q=0.8, en-a-bbb;q=1.0')).to.equal('en-a-bbb');
    });

    it('should match on multiple subscript', () => {
        const al = createInstanceWithDefault(['sv-SE', 'zh-Hant-CN-x-red']);
        expect(al.get('en-US;q=0.8,zh-Hant-CN-x-red;q=1')).to.equal('zh-Hant-CN-x-red');
    });

    it('should match on *', () => {
        const al = createInstanceWithDefault([]);
        expect(al.get('*')).to.equal(DEFAULT_LANGUAGE);
    });

    it('should match subscripts based on priority', () => {
        const al = createInstanceWithDefault(['sv-SE', 'zh-Hant-CN-x-private1-private2']);
        expect(al.get('en-US;q=0.8,zh-Hant-CN-x-private1-private2;q=1')).to.equal('zh-Hant-CN-x-private1-private2');
        expect(al.get('en-US;q=0.8,zh-Hant-CN-x-private1;q=1')).to.equal('zh-Hant-CN-x-private1-private2');
        expect(al.get('en-US;q=0.8,zh-Hant-CN;q=1')).to.equal('zh-Hant-CN-x-private1-private2');
        expect(al.get('en-US;q=0.8,zh-Hant;q=1')).to.equal('zh-Hant-CN-x-private1-private2');
        expect(al.get('en-US;q=0.8,zh;q=1')).to.equal('zh-Hant-CN-x-private1-private2');
    });

    it('should keep priority defined by languages', () => {
        const al = createInstanceWithDefault(['en', 'ja', 'ko', 'zh-CN', 'zh-TW', 'de', 'es', 'fr', 'it']);
        expect(al.get('en, ja, ne, zh, zh-TW, zh-CN, af, sq, am, ar, an')).to.equal('en');
    });

    it('should return default language on falsy get', () => {
        const al = createInstanceWithDefault(['sv-SE', 'zh-Hant-CN-x-red']);
        expect(al.get(undefined)).to.equal(DEFAULT_LANGUAGE);
        expect(al.get(null)).to.equal(DEFAULT_LANGUAGE);
        expect(al.get('')).to.equal(DEFAULT_LANGUAGE);
    });
});
