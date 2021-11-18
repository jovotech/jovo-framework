# Amazon Lex SLU Integration

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-slu-lex

Learn how to use Amazon Lex as SLU (Spoken Language Understanding, which combines speech recognition and natural language understanding) integration with the Jovo Framework.

## Installation

```sh
npm install --save jovo-slu-lex
```

```javascript
// @language=javascript

// src/app.js
const { LexSlu } = require('jovo-slu-lex');

platform.use(
  new LexSlu({
    credentials: {
      region: 'yourRegion',
      secretAccessKey: 'yourSecretAccessKey',
      accessKeyId: 'yourAccessKeyId',
    },
  }),
);

// @language=typescript

// src/app.ts
import { LexSlu } from 'jovo-slu-lex';

platform.use(
  new LexSlu({
    credentials: {
      region: 'yourRegion',
      secretAccessKey: 'yourSecretAccessKey',
      accessKeyId: 'yourAccessKeyId',
    },
  }),
);
```
