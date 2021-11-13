# Wit.ai SLU Integration

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-slu-witai

Learn how to use Wit.ai as SLU (Spoken Language Understanding, which combines speech recognition and natural language understanding) integration with the Jovo Framework.

## Installation

```sh
npm install --save jovo-slu-witai
```

```javascript
// @language=javascript

// src/app.js

const { WitAiSlu } = require('jovo-slu-witai');

platform.use(
  new WitAiSlu({
    token: 'yourToken',
  }),
);

// @language=typescript

// src/app.ts

import { WitAiSlu } from 'jovo-slu-witai';

platform.use(
  new WitAiSlu({
    token: 'yourToken',
  }),
);
```
