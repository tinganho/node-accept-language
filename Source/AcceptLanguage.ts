
import bcp47 = require('bcp47');
import stable = require('stable');

interface LanguageTagWithValue extends bcp47.LanguageTag {
    value: string;
}

interface LanguageScore {
    unmatchedRequestedSubTag: number;
    quality: number;
    languageTag: string;
}

class AcceptLanguage {
    private languageTagsWithValues: {
        [language: string]: [LanguageTagWithValue];
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
            const lowerCasedLanguageTagWithValues: LanguageTagWithValue = {
                language: {
                    language: langtag.language.language.toLowerCase(),
                    extlang: langtag.language.extlang.map((e) => e.toLowerCase()),
                },
                region: langtag.region && langtag.region.toLowerCase(),
                script: langtag.script && langtag.script.toLowerCase(),
                variant: langtag.variant.map((v) => v.toLowerCase()),
                privateuse: langtag.privateuse.map((p) => p.toLowerCase()),
                extension: langtag.extension.map((e) => {
                    return {
                        extension: e.extension && e.extension.map((e) => e.toLowerCase()),
                        singleton: e.singleton.toLowerCase(),
                    }
                }),
                value: languageTagString,
            };
            if (!this.languageTagsWithValues[language]) {
                this.languageTagsWithValues[language] = [lowerCasedLanguageTagWithValues];
            }
            else {
                this.languageTagsWithValues[language].push(lowerCasedLanguageTagWithValues);
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
        const result: LanguageScore[] = [];
        for (const languageTag of parsedAndSortedLanguageTags) {
            const requestedLang = bcp47.parse(languageTag.tag);

            if (!requestedLang) {
                continue;
            }

            const requestedLangTag = requestedLang.langtag;

            if (!this.languageTagsWithValues[requestedLangTag.language.language]) {
                continue;
            }

            middle:
            for (const definedLangTag of this.languageTagsWithValues[requestedLangTag.language.language]) {
                let unmatchedRequestedSubTag = 0;
                for (const prop of ['privateuse', 'extension', 'variant', 'region', 'script']) {
                    const definedLanguagePropertValue = (definedLangTag as any)[prop];
                    if (!definedLanguagePropertValue) {
                        const requestedLanguagePropertyValue = (requestedLangTag as any)[prop];
                        if (requestedLanguagePropertyValue) {
                            unmatchedRequestedSubTag++;
                        }
                        switch (prop) {
                            case 'privateuse':
                            case 'variant':
                                for (let i = 0; i < requestedLanguagePropertyValue.length; i++) {
                                    if (requestedLanguagePropertyValue[i]) {
                                        unmatchedRequestedSubTag++;
                                    }
                                }
                                break;
                            case 'extension':
                                for (let i = 0; i < requestedLanguagePropertyValue.length; i++) {
                                    const extension = requestedLanguagePropertyValue[i].extension;
                                    for (let ei = 0; ei < extension.length; ei++) {
                                        if (!requestedLanguagePropertyValue[i].extension[ei]) {
                                            unmatchedRequestedSubTag++;
                                        }
                                    }
                                }
                                break;
                        }
                        continue;
                    }

                    // Filter out wider requested languages first. If someone requests 'zh'
                    // and my defined language is 'zh-Hant'. I cannot match 'zh-Hant', because
                    // 'zh' is wider than 'zh-Hant'.
                    const requestedLanguagePropertyValue = (requestedLangTag as any)[prop];
                    if (!requestedLanguagePropertyValue) {
                        continue middle;
                    }


                    switch (prop) {
                        case 'privateuse':
                        case 'variant':
                            for (let i = 0; i < definedLanguagePropertValue.length; i++) {
                                if (!requestedLanguagePropertyValue[i] || definedLanguagePropertValue[i] !== requestedLanguagePropertyValue[i].toLowerCase()) {
                                    continue middle;
                                }
                            }
                            break;
                        case 'extension':
                            for (let i = 0; i < definedLanguagePropertValue.length; i++) {
                                const extension = definedLanguagePropertValue[i].extension;
                                for (let ei = 0; ei < extension.length; ei++) {
                                    if (!requestedLanguagePropertyValue[i]) {
                                        continue middle;
                                    }
                                    if (!requestedLanguagePropertyValue[i].extension[ei]) {
                                        continue middle;
                                    }
                                    if (extension[ei] !== requestedLanguagePropertyValue[i].extension[ei].toLowerCase()) {
                                        continue middle;
                                    }
                                }
                            }
                            break;
                        default:
                            if (definedLanguagePropertValue !== requestedLanguagePropertyValue.toLowerCase()) {
                                continue middle;
                            }
                    }
                }

                result.push({
                    unmatchedRequestedSubTag,
                    quality: languageTag.quality,
                    languageTag: definedLangTag.value
                });
            }
        }

        return result.length > 0 ? stable(result, (a, b) => {
            const quality = b.quality - a.quality;
            if (quality != 0) {
                return quality;
            }
            return a.unmatchedRequestedSubTag - b.unmatchedRequestedSubTag;
        }).map((l) => l.languageTag) : [this.defaultLanguageTag];

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
                if (!languageTag) {
                    return false;
                }
                if (!languageTag.tag) {
                    return false;
                }
                return languageTag;
            });
        }
    }
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
