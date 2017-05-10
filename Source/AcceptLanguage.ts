
import bcp47 = require('bcp47');
import stable = require('stable');

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

    public get(languagePriorityList: string | null | undefined): string | null {
        return this.parse(languagePriorityList)[0];
    }

    public create(): this {
        return null as any;
    }

    private parse(languagePriorityList: string | null | undefined): (string | null)[] {
        if (!languagePriorityList) {
            return [this.defaultLanguageTag];
        }

        const parsedAndSortedLanguageTags = parseAndSortLanguageTags(languagePriorityList);

        const result: string[] = [];

        for (const languageTag of parsedAndSortedLanguageTags) {
            const requestedLang = bcp47.parse(languageTag.tag);

            if (!requestedLang) {
                continue;
            }

            const requestedLangTag = requestedLang.langtag;

            if (!this.languageTagsWithValues[requestedLangTag.language.language]) {
                continue;
            }

            let closestMatch: string = '', closestScore: number = 0, foundMatch: boolean = false;
            middle:
            for (const definedLangTag of this.languageTagsWithValues[requestedLangTag.language.language]) {
                for (const prop of ['privateuse', 'extension', 'variant', 'region', 'script']) {

                    // Continue fast.
                    if (!(requestedLangTag as any)[prop]) {
                        continue;
                    }

                    // Filter out more 'narrower' requested languages first. If someone requests 'zh-Hant'
                    // and my defined language is 'zh'. Then I cannot match 'zh-Hant', because 'zh' is
                    // wider than 'zh-Hant'.
                    if ((requestedLangTag as any)[prop] && !(definedLangTag as any)[prop]) {
                        const score = scoreLanguageSimilarity(requestedLangTag, definedLangTag);
                        if (score > closestScore) {
                            closestMatch = definedLangTag.value;
                            closestScore = score;
                        }
                        continue middle;
                    }

                    // Filter out 'narrower' requested languages.
                    if ((requestedLangTag as any)[prop] instanceof Array) {
                        for (let i = 0; i < (requestedLangTag as any)[prop].length; i++) {
                            if (!deepEqual((requestedLangTag as any)[prop][i], (definedLangTag as any)[prop][i])) {
                                const score = scoreLanguageSimilarity(requestedLangTag, definedLangTag);
                                if (score > closestScore) {
                                    closestMatch = definedLangTag.value;
                                    closestScore = score;
                                }
                                continue middle;
                            }
                        }
                    }

                    // Filter out non-matched properties.
                    else if ((requestedLangTag as any)[prop] && (definedLangTag as any)[prop] !== (requestedLangTag as any)[prop]) {
                        continue middle;
                    }
                }
                foundMatch = true;
                result.push(definedLangTag.value);
            }
            if (!foundMatch) {
                result.push(closestMatch);
            }
        }

        return result.length > 0 ? result : [this.defaultLanguageTag];

        function scoreLanguageSimilarity(languageA: any, languageB: any) {
            let score = 0;
            if (languageA.script === languageB.script) score += 2;
            if (languageA.region=== languageB.region) score += 1;
            if (languageA.variant.length === languageB.variant.length) {
                let matchFail = false;
                for (let i = 0; i < languageA.variant.length; i += 1) {
                    matchFail = matchFail || languageA[i] !== languageB[i];
                }
                if (!matchFail) score += 1;
            }
            return score;
        }

        function parseAndSortLanguageTags(languagePriorityList: string) {
            return stable(languagePriorityList.split(',').map((weightedLanguageRange) => {
                const components = weightedLanguageRange.replace(/\s+/, '').split(';');
                return {
                    tag: components[0],
                    quality: components[1] ? parseFloat(components[1].split('=')[1]) : 1.0
                };
            })

            // Filter non-defined language tags
            .filter((languageTag) => {
                if (!languageTag) {
                    return false;
                }
                if (!languageTag.tag) {
                    return false;
                }
                return languageTag;
            })

            // Sort by quality
            , (a, b) => {
                return b.quality - a.quality;
            });
        }
    }
}

function deepEqual(x: any, y: any) {
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

function create() {
    const al = new AcceptLanguage();
    al.create = function() {
        return new AcceptLanguage();
    }
    return al;
}

declare var module: any;
module.exports = create();
module.exports.default = create();

export default create();
