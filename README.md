accept-language
======================

Parses the accept-language header from an HTTP request and produces an array of language objects sorted by quality.

dependencies: none

installation:

```
npm install accept-language
```

usage:

```
var acceptLanguage = require('accept-language');
acceptLanguage.codes(['en', 'zh']);
var language = acceptLanguage.parse('en-GB,en;q=0.8,sv');

console.log(language);
```

Output will be:

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

Pruning non-defined langnague codes:

```
var acceptLanguage = require('accept-language');
acceptLanguage.codes(['en', 'zh']);
var language = acceptLanguage.parse('en-GB,en;q=0.8,sv').prune();

console.log(language);
```

Output will be:
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


Output is always sorted in quality order from highest -> lowest. as per the http spec, omitting the quality value implies 1.0.
