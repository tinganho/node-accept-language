
declare module 'accept-language' {
    class AcceptLanguage {
        /**
         * Define your supported languages. The first language will be acted as the default language
         * in case of no match.
         */
        public languages(languages: string[]): void;

        /**
         * Get matched languages. If no match, the default language will be returned.
         */
        public get(priorityList: string | null | undefined): string | null;
    }

    class AcceptLanguageModule extends AcceptLanguage {
        /**
         * Create instance of parser
         */
        public create(): AcceptLanguage;
    }

    export = new AcceptLanguageModule();
}
