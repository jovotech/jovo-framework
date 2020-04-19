# Amazon Lex SLU Integration

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
			accessKeyId: 'yourAccessKeyId'
		}
	})
);

// @language=typescript

// src/app.ts
import { LexSlu } from 'jovo-slu-lex';

platform.use(
	new LexSlu({
		credentials: {
			region: 'yourRegion',
			secretAccessKey: 'yourSecretAccessKey',
			accessKeyId: 'yourAccessKeyId'
		}
	})
);
```

> The configuration has to be passed to the constructor of `LexSlu`. Setting the configuration inside the `config`-file does not work.