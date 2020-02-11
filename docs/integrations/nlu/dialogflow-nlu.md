# Dialogflow NLU

## Installation

```sh
npm install jovo-nlu-dialogflow --save
```

```javascript
// language=javascript

// src/app.js

const { DialogflowNlu } = require('jovo-nlu-dialogflow');

platform.use(
	new DialogflowNlu({
		credentialsFile: 'path/to/credentials'
	})
);

// language=typescript

// src/app.ts

import { DialogflowNlu } from 'jovo-nlu-dialogflow';

platform.use(
	new DialogflowNlu({
		credentialsFile: 'path/to/credentials'
	})
);
```

<!--[metadata]: {"description": "Voice analytics, databases, and more third-party integrations for building voice apps with Jovo",
"route": "nlu/dialogflow" }-->
