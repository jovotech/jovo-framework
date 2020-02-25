# Dialogflow NLU

Learn how to use Google Dialogflow as NLU (Natural Language Understanding) integration with the Jovo Framework.

## Installation

```sh
npm install jovo-nlu-dialogflow --save
```

```javascript
// @language=javascript

// src/app.js

const { DialogflowNlu } = require('jovo-nlu-dialogflow');

platform.use(
	new DialogflowNlu({
		credentialsFile: 'path/to/credentials'
	})
);

// @language=typescript

// src/app.ts

import { DialogflowNlu } from 'jovo-nlu-dialogflow';

platform.use(
	new DialogflowNlu({
		credentialsFile: 'path/to/credentials'
	})
);
```

> The configuration has to be passed to the constructor of `DialogflowNlu`. Setting the configuration inside the `config`-file does not work.

<!--[metadata]: {"description": "Learn how to use Google Dialogflow as NLU (Natural Language Understanding) integration with the Jovo Framework.",
"route": "nlu/google-dialogflow" }-->
