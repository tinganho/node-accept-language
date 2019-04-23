accept-language [![Build Status](https://travis-ci.org/tinganho/node-accept-language.png)](https://travis-ci.org/tinganho/node-accept-language)
========================

[![NPM](https://nodei.co/npm/accept-language.png?downloads=true&stars=true)](https://nodei.co/npm/accept-language/)

`accept-language` parses HTTP Accept-Language header ([BCP47][] compliant) and returns a matched defined language.

### Installation:

```
npm install accept-language --save
```

### Usage:

```ts
// var acceptLanguage = require('accept-language');
import acceptLanguage from 'accept-language';
acceptLanguage.languages(['en-US', 'zh-CN']);
console.log(acceptLanguage.get('en-GB,en;q=0.8,sv'));
/*

'en-US'

*/
```

### Usage with Express:
If you are using Express server please use the middleware [express-request-language](https://www.npmjs.com/package/express-request-language).

### API
#### acceptLanguage.languages(Array languageTags);
Provide your language tags in order of priority. The language tags must comply with [BCP47][] standard.

```javascript
acceptLanguage.languages(['en-US', 'zh-CN']);
```

#### acceptLanguage.get(String acceptLanguageString);
Returns the most likely language given an `Accept-Language` string. At least 1 language tag must be provided.
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
