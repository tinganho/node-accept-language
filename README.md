accept-language [![Build Status](https://travis-ci.org/tinganho/node-accept-language.png)](https://travis-ci.org/tinganho/node-accept-language)
========================

[![NPM](https://nodei.co/npm/accept-language.png?downloads=true&stars=true)](https://nodei.co/npm/accept-language/)

`accept-language` parses HTTP Accept-Language header and returns a consumable array of language codes.

### Installation:

```
npm install accept-language --save
```

### Usage:

```
var acceptLocale = require('accept-locale');
var locale = acceptLocale.parse('en-GB,en;q=0.8,sv');

console.log(locale);
```

Output:

```
[
  {
    language: "en",
    region: "GB",
    quality: 1.0
  },
  {
    language: "sv",
    region: undefined,
    quality: 1.0
  },
  {
    language: "en",
    region: undefined,
    quality: 0.8
  }
];
```

Filter non-defined language codes:

```
var acceptLocale = require('accept-locale');
acceptLocale.codes(['en', 'zh']);
var locale = acceptLocale.parse('en-GB,en;q=0.8,sv');

console.log(locale);
```

Output:
```
[
  {
    language: "en",
    region: "GB",
    quality: 1.0
  },
  {
    language: "en",
    region: undefined,
    quality: 0.8
  }
];
```

Use default value:

```
var acceptLocale = require('accept-locale');
acceptLocale.default({
    language : 'en',
    region : 'US'
    // No need to specify quality
});
acceptLocale.codes(['en', 'zh']);
var locale = acceptLocale.parse('fr-CA');

console.log(locale);
```

Output:
```
[
  {
    language: "en",
    region: "US",
    quality: 1.0
  }
];
```


The output is always sorted with the highest quality first.
