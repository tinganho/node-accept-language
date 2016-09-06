
import bcp47 = require('bcp47');

interface LanguageTagWithValue extends bcp47.LanguageTag {
    value: string;
}

class AcceptLanguage {
    private languageTagsWithValues: {
        [index: string]: [LanguageTagWithValue];
    } = {};

    private defaultLanguageTag: string | null = null;

    public languages(definedLanguages: string[]) {
        if (definedLanguages.length < 1) {
            throw new Error('The number of defined languages cannot be smaller than one.');
        }

        this.languageTagsWithValues = {};
        definedLanguages.forEach((languageTagString) => {
            const languageTag = bcp47.parse(languageTagString);
            if (!languageTag) {
                throw new TypeError('Language tag ' + languageTagString + ' is not bcp47 compliant. For more info https://tools.ietf.org/html/bcp47.');
            }
            const language = languageTag.langtag.language.language;
            if (!language) {
                throw new TypeError('Language tag ' + languageTagString + ' is not supported.');
            }
            const langtag = languageTag.langtag;
            let languageTagWithValues: LanguageTagWithValue = langtag as LanguageTagWithValue;
            languageTagWithValues.value = languageTagString;
            if (!this.languageTagsWithValues[language]) {
                this.languageTagsWithValues[language] = [languageTagWithValues];
            }
            else {
                this.languageTagsWithValues[language].push(languageTagWithValues);
            }
        });

        this.defaultLanguageTag = definedLanguages[0];
    }

    public get(languagePriorityList: string): string | null {
        return this.parse(languagePriorityList)[0];
    }

    public create(): this {
        return null as any;
    }

    private parse(languagePriorityList: string) {
        const parsedAndSortedLanguageTags = parseAndSortLanguageTags(languagePriorityList);

        const result: string[] = [];

        for (const languageTag of parsedAndSortedLanguageTags) {
            const requestedLangTag = bcp47.parse(languageTag.tag).langtag;

            if (!this.languageTagsWithValues[requestedLangTag.language.language]) {
                continue;
            }

            middle:
            for (const definedLangTag of this.languageTagsWithValues[requestedLangTag.language.language]) {
                for (const prop of ['privateuse', 'extension', 'variant', 'region', 'script']) {

                    // Filter out more 'narrower' requested languages first. If someone requests 'zh-Hant'
                    // and my defined language is 'zh'. Then I cannot match 'zh-Hant', because 'zh' is
                    // wider than 'zh-Hant'.
                    if ((requestedLangTag as any)[prop] && !(definedLangTag as any)[prop]) {
                        continue middle;
                    }

                    // Continue fast.
                    if (!(requestedLangTag as any)[prop] && !(definedLangTag as any)[prop]) {
                        continue;
                    }

                    // Filter out 'narrower' requested languages.
                    if ((requestedLangTag as any)[prop] instanceof Array) {
                        for (let i = 0; i < (requestedLangTag as any)[prop].length; i++) {
                            if (!deepEqual((requestedLangTag as any)[prop][i], (definedLangTag as any)[prop][i])) {
                                continue middle;
                            }
                        }
                    }

                    // Filter out non-matched properties.
                    else if ((definedLangTag as any)[prop] !== (requestedLangTag as any)[prop]) {
                        continue middle;
                    }
                }

                result.push(definedLangTag.value);
            }
        }

        return result.length > 0 ? result : [this.defaultLanguageTag];

        function parseAndSortLanguageTags(languagePriorityList: string) {
            return languagePriorityList.split(',').map((weightedLanguageRange) => {
                const components = weightedLanguageRange.replace(/\s+/, '').split(';');
                return {
                    tag: components[0],
                    quality: components[1] ? parseFloat(components[1].split('=')[1]) : 1.0
                };
            })

            // Filter non-defined language tags
            .filter((languageTag) => {
                return languageTag;
            })

            // Sort by quality
            .sort((a, b) => {
                return b.quality - a.quality;
            });
        }
    }
}

export function deepEqual(x: any, y: any) {
    if ((typeof x === 'object' && x !== null) && (typeof y === 'object' && y !== null)) {
        if (Object.keys(x).length !== Object.keys(y).length) {
            return false;
        }

        for (let prop in x) {
            if (y.hasOwnProperty(prop)) {
                if (!deepEqual(x[prop], y[prop])) {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        return true;
    }
    else if (x !== y) {
        return false;
    }
    return true;
}

export function create() {
    const al = new AcceptLanguage();
    al.create = function() {
        return new AcceptLanguage();
    }
    return al;
}

export default create();

declare var exports: any;
exports = create();

