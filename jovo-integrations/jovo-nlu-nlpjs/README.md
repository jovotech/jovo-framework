# NLP.js NLU Integration

> To view this page on the Jovo website, visit https://www.jovo.tech/marketplace/jovo-nlu-nlpjs

Learn how to use the open source NLP.js library as [natural language understanding (NLU)](https://www.jovo.tech/marketplace/tag/nlu) integration with the Jovo Framework.

- [About NLP.js](#about-nlpjs)
- [Getting Started with NLP.js and Jovo](#getting-started-with-nlpjs-and-jovo)
- [Configuration](#configuration)
  - [Languages](#languages)
  - [Callback](#callback)
- [Jovo Model](#jovo-model)

## About NLP.js

[NLP.js](https://github.com/axa-group/nlp.js) is an open source [natural language understanding (NLU)](https://www.jovo.tech/marketplace/tag/nlu) library with features like entity extraction, sentiment analysis, and language detection.

Being open source, you can host NLP.js on your own servers without any external API calls.



## Getting Started with NLP.js and Jovo

You can use the Jovo NLP.js integration for projects where you receive raw text input that needs to be translated into structured meaning to work with the Jovo intent structure. Patforms like the [Jovo Core Platform](https://www.jovo.tech/marketplace/jovo-platform-core) (e.g. in conjunction with the [Jovo Web Client](https://www.jovo.tech/marketplace/jovo-client-web)), [Facebook Messenger](https://www.jovo.tech/marketplace/jovo-platform-facebookmessenger), and [Google Business Messages](https://www.jovo.tech/marketplace/jovo-platform-googlebusiness) are some examples where this would work.

Smaller NLP.js language models are fast to train and can even be used on serverless infrastructure like [AWS Lambda](https://www.jovo.tech/docs/hosting/aws-lambda) without having to use any additional server infrastructure. We recommend taking a close look at the execution times though, as larger models can take quite some time to build.

To get started, download the package:

```sh
$ npm install --save jovo-nlu-nlpjs
```

As mentioned above, NLP.js works with platforms that provide raw text input. The integration can be added to the platform using the `use` method.

Here is the example of usage [Jovo Core Platform](https://www.jovo.tech/marketplace/jovo-platform-core):

```javascript
// @language=javascript

// src/app.js

const { NlpjsNlu } = require('jovo-nlu-nlpjs');

corePlatform.use(new NlpjsNlu());

app.use(corePlatform);

// @language=typescript

// src/app.ts

import { NlpjsNlu } from 'jovo-nlu-nlpjs';

corePlatform.use(new NlpjsNlu());

app.use(corePlatform);
```


## Configuration

### Languages
You can add languages to your integration like this:

```javascript
// @language=javascript

// src/app.js

const { NlpjsNlu } = require('jovo-nlu-nlpjs');

const nlpjsNlu = new NlpjsNlu({
    languages: ['de', 'en'],
});


// @language=typescript

// src/app.ts

import { NlpjsNlu } from 'jovo-nlu-nlpjs';

const nlpjsNlu = new NlpjsNlu({
    languages: ['de', 'en'],
});
```

You can add languages by installing their NLP.js packages:

```sh
$ npm install --save @nlpjs/lang-de
```

### Callback

You can add a callback function to train your model:

```javascript
// @language=javascript

// src/app.js

const { NlpjsNlu } = require('jovo-nlu-nlpjs');

const nlpjsNlu = new NlpjsNlu({
    setupModelCallback: async (handleRequest, nlp) => {
        // Do stuff
    },
});


// @language=typescript

// src/app.ts

import { NlpjsNlu } from 'jovo-nlu-nlpjs';

const nlpjsNlu = new NlpjsNlu({
    setupModelCallback: async (handleRequest, nlp) => {
        // Do stuff
    },
});
```


## Jovo Model

You can use the [Jovo Model](https://www.jovo.tech/marketplace/jovo-model) to turn the language model files in your `models` folder into an NLP.js model. [Learn more about the NLP.js Jovo Model integration here](https://www.jovo.tech/marketplace/jovo-model/nlpjs).

Here is an example how to extend the Jovo Model with a [custom input type for NLP.js](https://www.jovo.tech/tutorials/lindenbaum-cognitive-voice#adding-an-nlu-service).

