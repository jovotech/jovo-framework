# Wit.ai SLU

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

<!--[metadata]: {"description": "Voice analytics, databases, and more third-party integrations for building voice apps with Jovo",
"route": "slu/witai" }-->
