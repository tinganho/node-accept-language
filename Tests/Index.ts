
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

function assertLanguageMatching(definedLanguages: string[], priorityList: string, expectedResult: string): void {
    const al = createInstance(definedLanguages);
    expect(al.get('en-US')).to.equal(expectedResult);
}

describe('Language definitions', () => {
    it('should return default language when no match', () => {
        const al = createInstance(['en']);
        expect(al.get('sv')).to.equal('en');
    });
});

