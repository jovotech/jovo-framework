# Microsoft LUIS NLU

Learn how to use Microsoft LUIS as NLU (Natural Language Understanding) integration with the Jovo Framework.

## Installation

```sh
npm install jovo-nlu-luis --save
```

```javascript
// @language=javascript

// src/app.js

const { LuisNlu } = require('jovo-nlu-luis');

platform.use(
	new LuisNlu({
		endpointKey: 'yourEndpointKey',
		endpointRegion: 'yourEndpointRegion',
		appId: 'yourAppid'
	})
);

// @language=typescript

// src/app.ts

import { LuisNlu } from 'jovo-nlu-luis';

platform.use(
	new LuisNlu({
		endpointKey: 'yourEndpointKey',
		endpointRegion: 'yourEndpointRegion',
		appId: 'yourAppid'
	})
);
```

> The configuration has to be passed to the constructor of `LuisNlu`. Setting the configuration inside the `config`-file does not work.


<!--[metadata]: {"description": "Learn how to use Microsoft LUIS as NLU (Natural Language Understanding) integration with the Jovo Framework.",
"route": "nlu/microsoft-luis" }-->
