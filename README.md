accept-language [![Build Status](https://travis-ci.org/tinganho/node-accept-language.png)](https://travis-ci.org/tinganho/node-accept-language)
========================

[![NPM](https://nodei.co/npm/accept-language.png?downloads=true&stars=true)](https://nodei.co/npm/accept-language/)

`accept-language` parses HTTP Accept-Language header and returns a consumable array of language tags.

### Installation:

```
npm install accept-language --save
```

### Usage:

```
var acceptLanguage = require('accept-language');
var language = acceptLanguage.parse('en-GB,en;q=0.8,sv');

console.log(language);
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
var acceptLanguage = require('accept-language');
acceptLanguage.codes(['en', 'zh']);
var language = acceptLanguage.parse('en-GB,en;q=0.8,sv');

console.log(language);
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
var acceptLanguage = require('accept-language');
acceptLanguage.default({
    language: 'en',
    region: 'US'
    // No need to specify quality
});
acceptLanguage.codes(['en', 'zh']);
var language = acceptLanguage.parse('fr-CA');

console.log(language);
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
