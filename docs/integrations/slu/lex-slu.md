# Amazon Lex SLU

Learn how to use Amazon Lex as SLU (Spoken Language Understanding, which combines speech recognition and natural language understanding) integration with the Jovo Framework.

## Installation

```sh
npm install jovo-slu-lex --save
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

<!--[metadata]: {"description": "Learn how to use Amazon Lex as SLU (Spoken Language Understanding, which combines speech recognition and natural language understanding) integration with the Jovo Framework.",
"route": "slu/amazon-lex" }-->
