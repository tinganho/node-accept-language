
/// <reference path='../node_modules/@types/mocha/index.d.ts'/>
/// <reference path='../node_modules/@types/chai/index.d.ts'/>

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
    });

    it('should match wider requested languages', () => {
        const al = createInstance(['en-US']);
        expect(al.get('en')).to.equal('en-US');
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
        expect(al.get('en-US;q=0.8, zh-CN;q=1.0')).to.equal('zh-CN');
    });
});
