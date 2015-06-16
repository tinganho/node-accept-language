accept-language [![Build Status](https://travis-ci.org/tinganho/node-accept-language.png)](https://travis-ci.org/tinganho/node-accept-language)
========================

[![NPM](https://nodei.co/npm/accept-language.png?downloads=true&stars=true)](https://nodei.co/npm/accept-language/)

`accept-language` parses HTTP Accept-Language header and returns the most likely language or a consumable array of languages.

### Installation:

```
npm install accept-language --save
```

### Usage:

```javascript
var acceptLanguage = require('accept-language');
acceptLanguage.languages(['en-US', 'zh-CN']);
console.log(acceptLanguage.get('en-GB,en;q=0.8,sv'));
/*

'en-US'

*/
var language = acceptLanguage.parse('en-GB,en;q=0.8,sv');
console.log(language);
/*

[
  {
    value: 'en-US',
    language: "en",
    region: "US",
    quality: 1.0
  }
];

*/
```
### Recommended usage with L10ns:
[L10ns][] is an internationalization workflow and formatting tool. This library was specifically built for [L10ns](http://l10ns.org). [L10ns][] is a very good alternative to Gettext and all of it's tooling support–XGettext, PoEdit, custom libraries etc.

### API
#### acceptLanguage.languages(Array languageTags);
Define your language tags ordered in highest priority comes first fashion. The language tags must comply with [BCP47][] standard. The [BCP47][] language tag consist of at least the following subtags:

1. A language subtag (`en`, `zh`).
3. A script subtag (`Hant`, `Latn`).
2. A region subtag (`US`, `CN`).

Then language tag has the following syntax:

```
language[-script][-region]
```

Which makes the following language tags `en`, `en-US` and `zh-Hant-TW` all [BCP47][] compliant. Please note that the script tag refers to language script. Some languages use two character sets instead of one. Chinese is a good example of having two character sets instead of one–it has both traditional characters and simplified characters. And for popular languages that uses two or more scripts please specify the script subtag, because it can make an i18n library fetch more specific locale data.

```javascript
acceptLanguage.languages(['en-US', 'zh-CN']);
```

#### acceptLanguage.get(String acceptLanguageString);
Get the most likely language given an `Accept-Language` string. In order for it to work you must set all your languages first.
```javascript
acceptLanguage.get('en-GB,en;q=0.8,sv');
```

#### acceptLanguage.parse(String acceptLanguageString);
Parse an `Accept-Language` string and get a consumable array of languages. In order for it to work you must set all your language tags first.
```javascript
acceptLanguage.parse('en-GB,en;q=0.8,sv');
```

### Maintainer

Tingan Ho [@tingan87][]

### License
MIT

[L10ns]: http://l10ns.org
[BCP47]: https://tools.ietf.org/html/bcp47
[@tingan87]: https://twitter.com/tingan87
