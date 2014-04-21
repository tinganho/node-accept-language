accept-language [![Build Status](https://travis-ci.org/tinganho/accept-language.png)](https://travis-ci.org/tinganho/accept-language)
========================

[![NPM](https://nodei.co/npm/accept-language.png?downloads=true&stars=true)](https://nodei.co/npm/accept-language/)

`accept-language` is an Node package that parses HTTP Accept-Language header and returns a consumable array of language codes.

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
var acceptLanguage = require('accept-language');
acceptLanguage.codes(['en', 'zh']);
var language = acceptLanguage.parse('en-GB,en;q=0.8,sv');

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


The output is always sorted with the highest quality first.
