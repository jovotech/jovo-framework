# Wit.ai SLU

Learn how to use Wit.ai as SLU (Spoken Language Understanding, which combines speech recognition and natural language understanding) integration with the Jovo Framework.

## Installation

```sh
npm install jovo-slu-witai --save
```

```javascript
// @language=javascript

// src/app.js

const { WitAiSlu } = require('jovo-slu-witai');

platform.use(
	new WitAiSlu({
		token: 'yourToken'
	})
);

// @language=typescript

// src/app.ts

import { WitAiSlu } from 'jovo-slu-witai';

platform.use(
	new WitAiSlu({
		token: 'yourToken'
	})
);
```

> The configuration has to be passed to the constructor of `WitAiSlu`. Setting the configuration inside the `config`-file does not work.


<!--[metadata]: {"description": "Learn how to use Wit.ai as SLU (Spoken Language Understanding, which combines speech recognition and natural language understanding) integration with the Jovo Framework.",
"route": "slu/witai" }-->
