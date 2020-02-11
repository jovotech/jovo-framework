# Lex SLU

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

<!--[metadata]: {"description": "Voice analytics, databases, and more third-party integrations for building voice apps with Jovo",
"route": "slu/lex" }-->
