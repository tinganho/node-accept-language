accept-language [![Build Status](https://travis-ci.org/tinganho/node-accept-language.png)](https://travis-ci.org/tinganho/node-accept-language)
========================

[![NPM](https://nodei.co/npm/accept-language.png?downloads=true&stars=true)](https://nodei.co/npm/accept-language/)

`accept-language` parses HTTP Accept-Language header and returns a consumable array of language codes.

### Installation:

```
npm install accept-locale --save
```

### Usage:

```
var acceptLocale = require('accept-language');
var language = acceptLocale.parse('en-GB,en;q=0.8,sv');

console.log(language);
```

Output:

```
[
  {
    code: "en",
    region: "GB",
    quality: 1.0
  },
  {
    code: "sv",
    region: undefined,
    quality: 1.0
  },
  {
    code: "en",
    region: undefined,
    quality: 0.8
  }
];
```

Filter non-defined language codes:

```
var acceptLocale = require('accept-language');
acceptLocale.codes(['en', 'zh']);
var language = acceptLocale.parse('en-GB,en;q=0.8,sv');

console.log(language);
```

Output:
```
[
  {
    code: "en",
    region: "GB",
    quality: 1.0
  },
  {
    code: "en",
    region: undefined,
    quality: 0.8
  }
];
```

Use default value:

```
var acceptLocale = require('accept-language');
acceptLocale.default({
    code : 'en',
    region : 'US'
    // No need to specify quality
});
acceptLocale.codes(['en', 'zh']);
var language = acceptLocale.parse('fr-CA');

console.log(language);
```

Output:
```
[
  {
    code: "en",
    region: "US",
    quality: 1.0
  }
];
```


The output is always sorted with the highest quality first.
