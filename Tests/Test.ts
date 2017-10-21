
require('source-map-support').install();

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
        };
        expect(method).to.throw();
    });

    it('should return null on no defined languages', () => {
        const al = createInstance();
        expect(al.get('sv')).to.equal(null);
    });

    it('match / no-match: should return default language when no match', () => {
        const al = createInstance(['en']);
        expect(al.get('sv')).to.equal('en');
    });

    it('match / case-insensitive: language matching should be case-insensitive', () => {
        const al = createInstance(['fr-FR', 'de-DE']);
        expect(al.get('de-de')).to.equal('de-DE');
    });

    it('match / mutliple-language-requests: should match multiple requested languages', () => {
        const al = createInstance(['en-US']);
        expect(al.get('en-US,sv-SE')).to.equal('en-US');
    });

    it('match / mutliple-defined-languages: should match multiple defined languages', () => {
        const al = createInstance(['en-US', 'sv-SE']);
        expect(al.get('en-US,sv-SE')).to.equal('en-US');
    });

    it('match / quality: should match based on quality score', () => {
        const al = createInstance(['en-US', 'zh-CN']);
        expect(al.get('en-US;q=0.8,zh-CN;q=1.0')).to.equal('zh-CN');
    });

    it('match / specificity: should match based on specificity', () => {
        const al = createInstance(['en', 'en-US']);
        expect(al.get('en-US')).to.equal('en-US');
    });

    it('script / perfect match', () => {
        const al = createInstance(['en-US', 'zh-Hant']);
        expect(al.get('zh-Hant;q=1,en-US;q=0.8')).to.equal('zh-Hant');
    });

    it('script / false match', () => {
        const al = createInstance(['en-US', 'zh-Hant']);
        expect(al.get('zh-Hans;q=1,en-US;q=0.8')).to.equal('en-US');
    });

    it('region / broader match', () => {
        const al = createInstance(['en-US', 'zh']);
        expect(al.get('zh-Hant')).to.equal('zh');
    });

    it('script / narrower match', () => {
        const al = createInstance(['en-US', 'zh-Hant']);
        expect(al.get('zh;q=1,en-US;q=0.8')).to.equal('en-US');
    });

    it('region / perfect match', () => {
        const al = createInstance(['en-US', 'zh-CN']);
        expect(al.get('en-US;q=0.8, zh-CN;q=1.0')).to.equal('zh-CN');
    });

    it('region / false match', () => {
        const al = createInstance(['en-US', 'zh-CN']);
        expect(al.get('en-US;q=0.8, zh-US;q=1.0')).to.equal('en-US');
    });

    it('region / broader match', () => {
        const al = createInstance(['en-US', 'zh']);
        expect(al.get('zh-CN')).to.equal('zh');
    });

    it('region / narrower match', () => {
        const al = createInstance(['en-US', 'zh-CN']);
        expect(al.get('zh')).to.equal('en-US');
    });

    it('variant / perfect match', () => {
        const al = createInstance(['en-US', 'de-CH-1996']);
        expect(al.get('en-US;q=0.8, de-CH-1996;q=1.0')).to.equal('de-CH-1996');
    });

    it('variant / broader match', () => {
        const al = createInstance(['en-US', 'de-CH-1996']);
        expect(al.get('en-US;q=0.8, de-CH-1996-2001;q=1.0')).to.equal('de-CH-1996');
    });

    it('variant / narrower match', () => {
        const al = createInstance(['en-US', 'de-CH-1996-2001']);
        expect(al.get('en-US;q=0.8, de-CH-1996;q=1.0')).to.equal('en-US');
    });

    it('privateuse / perfect match', () => {
        const al = createInstance(['en-US', 'de-CH-x-a']);
        expect(al.get('en-US;q=0.8, de-CH-x-a;q=1.0')).to.equal('de-CH-x-a');
    });

    it('privateuse / broader request', () => {
        const al = createInstance(['en-US', 'de-CH-x-a']);
        expect(al.get('en-US;q=0.8, de-CH-x-a-b;q=1.0')).to.equal('de-CH-x-a');
    });

    it('privateuse / narrower request', () => {
        const al = createInstance(['en-US', 'de-CH-x-a-b']);
        expect(al.get('en-US;q=0.8, de-CH-x-a;q=1.0')).to.equal('en-US');
    });

    it('extension / perfect match', () => {
        const al = createInstance(['zh-CN', 'en-a-bbb']);
        expect(al.get('en-US;q=0.8, en-a-bbb;q=1.0')).to.equal('en-a-bbb');
    });

    it('extension / broader match', () => {
        const al = createInstance(['zh-CN', 'en-a-bbb']);
        expect(al.get('en-US;q=0.8, en-a-bbb-ccc;q=1.0')).to.equal('en-a-bbb');
    });

    it('extension / narrower match', () => {
        const al = createInstance(['zh-CN', 'en-a-bbb-ccc']);
        expect(al.get('en-US;q=0.8, en-a-bbb;q=1.0')).to.equal('zh-CN');
    });

    it('extension / multiple extensions / perfect match', () => {
        const al = createInstance(['zh-CN', 'en-a-bbb-ccc-b-ddd']);
        expect(al.get('en-US;q=0.8, en-a-bbb-ccc-b-ddd;q=1.0')).to.equal('en-a-bbb-ccc-b-ddd');
    });

    it('extension / multiple extensions / broader match', () => {
        const al = createInstance(['zh-CN', 'en-a-bbb-ccc-b-ddd']);
        expect(al.get('en-US;q=0.8, en-a-bbb-ccc-ddd-b-ddd-aaa;q=1.0')).to.equal('en-a-bbb-ccc-b-ddd');
    });

    it('extension / multiple extensions / narrower match', () => {
        const al = createInstance(['zh-CN', 'en-a-bbb-ccc-b-ddd']);
        expect(al.get('en-US;q=0.8, en-a-bbb-b-ddd;q=1.0')).to.equal('zh-CN');
    });

    it('multiple subscripts / perfect match', () => {
        const al = createInstance(['sv-SE', 'zh-Hant-CN-x-red']);
        expect(al.get('en-US;q=0.8,zh-Hant-CN-x-red;q=1')).to.equal('zh-Hant-CN-x-red');
    });

    it('multiple subscripts / broader match', () => {
        const al = createInstance(['sv-SE', 'zh-Hant-CN-x-red']);
        expect(al.get('en-US;q=0.8,zh-Hant-CN-x-red-blue;q=1')).to.equal('zh-Hant-CN-x-red');
    });

    it('multiple subscripts / narrower match', () => {
        const al = createInstance(['sv-SE', 'zh-Hant-CN-x-red-blue']);
        expect(al.get('en-US;q=0.8,zh-Hant-CN-x-red;q=1')).to.equal('sv-SE');
    });

    it('multiple subscripts / no match', () => {
        const al = createInstance(['sv-SE', 'zh-Hant-CN-x-red']);
        expect(al.get('en-US;q=0.8,zh-Hans-CN-x-red;q=1')).to.equal('sv-SE');
    });

    it('should match on *', () => {
        const al = createInstance(['en-US']);
        expect(al.get('*')).to.equal('en-US');
    });

    it('should keep priority defined by languages', () => {
        const al = createInstance(['en', 'ja', 'ko', 'zh-CN', 'zh-TW', 'de', 'es', 'fr', 'it']);
        expect(al.get('en, ja, ne, zh, zh-TW, zh-CN, af, sq, am, ar, an')).to.equal('en');
    });

    it('should return default language on falsy get', () => {
        const al = createInstance(['sv-SE', 'zh-Hant-CN-x-red']);
        expect(al.get(undefined)).to.equal('sv-SE');
        expect(al.get(null)).to.equal('sv-SE');
        expect(al.get('')).to.equal('sv-SE');
    });
});
