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
accepLanguage.languages(['en-US', 'zh-CN']);
console.log(accepLanguage.get('en-GB,en;q=0.8,sv'));
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
L10ns is an internationalization workflow and formatting tool. This library was specifically built for [L10ns](http://l10ns.org). L10ns is a very good alternative to Gettext and all of it's tooling support–XGettext, PoEdit, custom libraries etc.

### API
#### acceptLanguage.languages(Array languageTags);
Define your language tags in highest priority comes first. The language tags must comply with [BCP47 standard](https://tools.ietf.org/html/bcp47). I.e. all language tags `en`, `en-US` and `zh-Hant-TW` are working.

```javascript
acceptLanguage.languages(['en-US', 'zh-CN']);
```

#### acceptLanguage.get(String acceptLanguageString);
Get the most likely language given an `Accept-Language` string. In order for it to work you must set all your languages first.
```javascript
acceptLanguage.get('en-GB,en;q=0.8,sv'));
```

#### acceptLanguage.parse(String acceptLanguageString);
Parse an `Accept-Language` string and get a consumable array of languages. In order for it to work you must set all your language tags first.
```javascript
acceptLanguage.parse('en-GB,en;q=0.8,sv'));
```
### License
MIT
