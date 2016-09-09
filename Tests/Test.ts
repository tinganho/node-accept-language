
import AcceptLanguage from '../Source/AcceptLanguage';
import chai = require('chai');
const expect = chai.expect;

function createInstance(definedLanguages?: string[]) {
    const al = AcceptLanguage.create();
    if (definedLanguages) {
        al.languages(definedLanguages);
    }
    return al;
}

describe('Language definitions', () => {
    it('should throw when defined languages is empty', () => {
        const method = () => {
            createInstance([]);
        }
        expect(method).to.throw();
    });

    it('should return null on no defined languages', () => {
        const al = createInstance();
        expect(al.get('sv')).to.equal(null);
    });

    it('should return default language when no match', () => {
        const al = createInstance(['en']);
        expect(al.get('sv')).to.equal('en');
    });

    it('should not match narrower requested languages', () => {
        const al = createInstance(['en']);
        expect(al.get('en-US')).to.equal('en');
        const al2 = createInstance(['zh']);
        expect(al2.get('zh-Hant')).to.equal('zh');
    });

    it('should match wider requested languages', () => {
        const al1 = createInstance(['en-US']);
        expect(al1.get('en')).to.equal('en-US');
        const al2 = createInstance(['zh-Hant']);
        expect(al2.get('zh')).to.equal('zh-Hant');
    });

    it('should match multiple requested languages', () => {
        const al = createInstance(['en-US']);
        expect(al.get('en-US,sv-SE')).to.equal('en-US');
    });

    it('should match multiple defined languages', () => {
        const al = createInstance(['en-US', 'sv-SE']);
        expect(al.get('en-US,sv-SE')).to.equal('en-US');
    });

    it('should match based on quality', () => {
        const al = createInstance(['en-US', 'zh-CN']);
        expect(al.get('en-US;q=0.8,zh-CN;q=1.0')).to.equal('zh-CN');
    });

    it('should match on script', () => {
        const al = createInstance(['en-US', 'zh-Hant']);
        expect(al.get('zh-Hant;q=1,en-US;q=0.8')).to.equal('zh-Hant');
    });

    it('should match on region', () => {
        const al = createInstance(['en-US', 'zh-CN']);
        expect(al.get('en-US;q=0.8, zh-CN;q=1.0')).to.equal('zh-CN');
    });

    it('should match on variant', () => {
        const al = createInstance(['en-US', 'de-CH-1996']);
        expect(al.get('en-US;q=0.8, de-CH-1996;q=1.0')).to.equal('de-CH-1996');
    });

    it('should match on privateuse', () => {
        const al = createInstance(['en-US', 'de-CH-x-a']);
        expect(al.get('en-US;q=0.8, de-CH-x-a;q=1.0')).to.equal('de-CH-x-a');
    });

    it('should match on extension', () => {
        const al = createInstance(['zh-CN', 'en-a-bbb']);
        expect(al.get('en-US;q=0.8, en-a-bbb;q=1.0')).to.equal('en-a-bbb');
    });

    it('should match on multiple subscript', () => {
        const al = createInstance(['sv-SE', 'zh-Hant-CN-x-red']);
        expect(al.get('en-US;q=0.8,zh-Hant-CN-x-red;q=1')).to.equal('zh-Hant-CN-x-red');
    });

    it('should match subscripts based on priority', () => {
        const al = createInstance(['sv-SE', 'zh-Hant-CN-x-private1-private2']);
        expect(al.get('en-US;q=0.8,zh-Hant-CN-x-private1-private2;q=1')).to.equal('zh-Hant-CN-x-private1-private2');
        expect(al.get('en-US;q=0.8,zh-Hant-CN-x-private1;q=1')).to.equal('zh-Hant-CN-x-private1-private2');
        expect(al.get('en-US;q=0.8,zh-Hant-CN;q=1')).to.equal('zh-Hant-CN-x-private1-private2');
        expect(al.get('en-US;q=0.8,zh-Hant;q=1')).to.equal('zh-Hant-CN-x-private1-private2');
        expect(al.get('en-US;q=0.8,zh;q=1')).to.equal('zh-Hant-CN-x-private1-private2');
    });

    it('should return default language on falsy get', () => {
        const al = createInstance(['sv-SE', 'zh-Hant-CN-x-red']);
        expect(al.get(undefined as any)).to.equal('sv-SE');
        expect(al.get(null as any)).to.equal('sv-SE');
        expect(al.get('' as any)).to.equal('sv-SE');
    });
});
