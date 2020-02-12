# Amazon Lex SLU

Learn how to use Amazon Lex as SLU (Spoken Language Understanding, which combines speech recognition and natural language understanding) integration with the Jovo Framework.

## Installation

```sh
npm install jovo-slu-lex --save
```

```javascript
// @language = javascript

// src/app.js
const { AmazonLexSlu } = require('jovo-slu-lex');

platform.use(
	new AmazonLexSlu({
		credentials: {
			region: 'yourRegion',
			secretAccessKey: 'yourSecretAccessKey',
			accessKeyId: 'yourAccessKeyId'
		}
	})
);

// @language = typescript

// src/app.ts
import { AmazonLexSlu } from 'jovo-slu-lex';

platform.use(
	new AmazonLexSlu({
		credentials: {
			region: 'yourRegion',
			secretAccessKey: 'yourSecretAccessKey',
			accessKeyId: 'yourAccessKeyId'
		}
	})
);
```

<!--[metadata]: {"description": "Learn how to use Amazon Lex as SLU (Spoken Language Understanding, which combines speech recognition and natural language understanding) integration with the Jovo Framework.",
"route": "slu/amazon-lex" }-->
