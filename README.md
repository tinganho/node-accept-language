accept-language [![Build Status](https://travis-ci.org/tinganho/node-accept-language.png)](https://travis-ci.org/tinganho/node-accept-language)
========================

[![NPM](https://nodei.co/npm/accept-language.png?downloads=true&stars=true)](https://nodei.co/npm/accept-language/)

`accept-language` parses HTTP Accept-Language header and returns the most likely language tag or a consumable array of language tags.

### Installation:

```
npm install accept-language --save
```

### Usage:

```javascript
var acceptLanguage = require('accept-language');
accepLanguage.languageTags(['en-US', 'zh-CN']);
console.log(accepLanguage.get('en-GB,en;q=0.8,sv'));
// outputs: 'en-US'

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
L10ns is internationalization workflow and formatting tool. This library was specifically built for [L10ns](http://l10ns.org).

### API
#### accepLanguage.languageTags(Array languageTags);
Define your language tags in highest priority comes first. The language tags must comply with [BCP47 standard](https://tools.ietf.org/html/bcp47). I.e. all language tags `en`, `en-US` and `zh-Hant-TW` are working.

```javascript
acceptLanguage.languageTags(['en-US', 'zh-CN']);
```

#### accepLanguage.get(String acceptLanguageString);
Get the most likely language tag given an `Accept-Language` string. In order for it to work you must set all your language tags first.
```javascript
acceptLanguage.get('en-GB,en;q=0.8,sv'));
```

#### accepLanguage.parse(String acceptLanguageString);
Parse an `Accept-Language` string and get a consumable array. In order for it to work you must set all your language tags first.
```javascript
acceptLanguage.get('en-GB,en;q=0.8,sv'));
```
### License
MIT
