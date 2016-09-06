
declare module 'bcp47' {
    interface Extension {
        singleton: string;
        extensions: string[];
    }

    interface Language {

        /**
         * shortest ISO 639 code sometimes followed by extended language
         * subtags or reserved for future use or registered language subtag.
         */
        language: string;

        /**
         * selected ISO 639 codes permanently reserved.
         */
        extlang: string[];
    }

    interface LanguageTag {
        language: Language;

        /**
         * ISO 3166-1 code.
         */
        region: string | null;

        /**
         * ISO 15924 code.
         */
        script: string | null;

        /**
         * Registered variants.
         */
        variant: string[];

        /**
         * Extensions.
         */
        extension: Extension[];

        /**
         * Single alphanumerics "x" reserved for private use.
         */
        privateuse: string[];
    }

    interface LanguageData {
        langtag: LanguageTag;
        privateuse: string[];
    }

    export function parse(languageRange: string): LanguageData;
}
