accept-locale [![Build Status](https://travis-ci.org/tinganho/node-accept-locale.png)](https://travis-ci.org/tinganho/node-accept-locale)
========================

[![NPM](https://nodei.co/npm/accept-language.png?downloads=true&stars=true)](https://nodei.co/npm/accept-locale/)

`accept-locale` parses HTTP Accept-Language header and returns a consumable array of locale data.

## DEPRECATED LIBRARY: please use [accept-language][] instead.

I thought before that `languages` where a subset of `locales`, thus I created this library. I made a mistake about `language` vs. `locale` naming. After some research `language tags` are not synonymous with just `language`. The name `locale` was used widely before the usage of `language tags` for major i18n libraries. There is one major difference between language tags and locale identifiers and that is explained by w3c:

> A major difference between language tags and locale identifiers is the meaning of the region code. In both language tags and locales, the region code indicates variation in language (as with regional dialects) or presentation and format (such as number or date formats). In a locale, the region code is also sometimes used to indicate the physical location, market, legal, or other governing policies for the user.

Many libraries use the [BCP47](https://tools.ietf.org/html/bcp47) language tags. Since this standard refer to `language tags` or just `language` – I decided to deprecate this library, because of naming confusions. Please use [accept-language][] instead.

Sorry for any problems I caused with this change.


### Installation:

```
npm install accept-locale --save
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

[accept-language]: https://github.com/tinganho/node-accept-language
