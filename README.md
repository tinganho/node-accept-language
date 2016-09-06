accept-language [![Build Status](https://travis-ci.org/tinganho/node-accept-language.png)](https://travis-ci.org/tinganho/node-accept-language)
========================

[![NPM](https://nodei.co/npm/accept-language.png?downloads=true&stars=true)](https://nodei.co/npm/accept-language/)

`accept-language` parses HTTP Accept-Language header and returns a matched defined language.

### Installation:

```
npm install accept-language --save
```

### Usage:

```javascript
const acceptLanguage = require('accept-language');
acceptLanguage.languages(['en-US', 'zh-CN']);
console.log(acceptLanguage.get('en-GB,en;q=0.8,sv'));
/*

'en-US'

*/
```
### Recommended usage with L10ns:
[L10ns][] is an internationalization workflow and formatting tool. This library was specifically built for L10ns. L10ns is a very good alternative to Gettext and all of it's tooling support–XGettext, PoEdit, custom libraries etc.

### API
#### acceptLanguage.languages(Array languageTags);
Define your language tags ordered in highest priority comes first fashion. The language tags must comply with [BCP47][] standard.

```javascript
acceptLanguage.languages(['en-US', 'zh-CN']);
```

#### acceptLanguage.get(String acceptLanguageString);
Get the most likely language given an `Accept-Language` string. In order for it to work you must set all your languages first.
```javascript
acceptLanguage.get('en-GB,en;q=0.8,sv');
```

### Maintainer

Tingan Ho [@tingan87][]

### License
MIT

[L10ns]: http://l10ns.org
[BCP47]: https://tools.ietf.org/html/bcp47
[@tingan87]: https://twitter.com/tingan87
