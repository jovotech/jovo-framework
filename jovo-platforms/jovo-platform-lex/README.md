# AWS Lex Platform V1

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-platform-lex

Learn more about the AWS Lex Platform, which can be used to build a chatbot.
AWS Lex can be use with AWS connect to build a callbot.

* [Introduction](#introduction)
   * [Installation](#installation)
   * [Lex Configuration](#lex-configuration)
* [Usage](#usage)
   * [Cards](#cards)
* [Hello Word sample project](#Hello-Word-sample-project)

## Introduction

Amazon Lex provides the deep functionality and flexibility of natural language understanding (NLU) and automatic speech recognition (ASR) so you can build highly engaging user experiences with lifelike, conversational interactions, and create new categories of products.

Have a look to AWS documentation:  https://docs.aws.amazon.com/lex/latest/dg/what-is.html


### Installation

Install the integration into your project directory:

```sh
$ npm install --save jovo-platform-lex
```

Import the installed module, initialize and add it to the `app` object.

```javascript
// @language=javascript

// src/app.js

const { lex } = require('jovo-platform-lex');

app.use(
    new Lex()
);

// @language=typescript

// src/app.ts

import { lex } from 'jovo-platform-web';

app.use(new lex());
```

### Lex Configuration

#### Add a Resource-based policy 
You must allow your lambda to be call by AWS Lex. For it, you have to create or use an existing alias and add a new permission.

In this case, We allow this lambda alias to call any AWS Lex bot available on the region eu-west-1 for the aws account AWS-ACCOUNT-ID.
Of course you should change the region/account id to fit your need.
![permission](img/permission.png?raw=true "Resource-based policy ")


#### From Jovo model to Lex model 
You can manualy create your Lex Bot with AWS Console https://docs.aws.amazon.com/lex/latest/dg/gs-bp-create-bot.html
But the package jovo-model-lex will help you to convert your Jovo model to Lex.  

The following script will generate a Lex model file in the folder /platforms/lex/bot.json
```javascript
"use strict";
const lexModel = require("jovo-model-lex");
const jovoModelInstance = new lexModel.JovoModelLex();
const jovoModelData = require('../../models/fr-FR.json');
const fs  = require('fs');
const locale = 'fr-FR';
jovoModelInstance.importJovoModel(jovoModelData, locale);
const lexModelFiles = jovoModelInstance.exportNative();
fs.mkdirSync('./platforms/lex/slot/', { recursive: true });
fs.writeFileSync('./platforms/lex/bot.json',JSON.stringify(lexModelFiles[0].content));
```

Before creating your Lex bot, You have to update the file:

* replace JovoApp by the name of your lex bot
* remove all unnecessary intents (ISP/Account linking/Geoloc etc aren't supported)
* Add you 'codeHook': tell lex to call your lambda when a user answer to an intent
On each Intent, replace fulfillmentActivity value by 
```
"fulfillmentActivity": {
    "codeHook": {
        "uri": "lambda arn:aliasname",
        "messageVersion": "1.0"
    },
    "type": "CodeHook"
},
```

* For [built-in Lex Intents](https://docs.aws.amazon.com/lex/latest/dg/howitworks-builtins-intents.html) , 
On each built-in intent, You have to add the attribute parentIntentSignature with the name of the built-in intent.
The name of the intent with built-in name (CancelIntent/FallbackIntent/HelpIntent/PauseIntent/RepeatIntent/ResumeIntent/StartOverIntent/StopIntent) have to be rename.
A quick solution is to prefix your intent with a custom value and use [intentMap] (https://v3.jovo.tech/docs/routing/intents#intentmap)

Exemple if you have a CancelIntent, you should obtain: 
```
{
        "name": "MyCancelIntent",
        "version": "1",
        "fulfillmentActivity": {
          "type": "ReturnIntent"
        },
        "sampleUtterances": [],
        "slots": [],
        "parentIntentSignature": "AMAZON.CancelIntent"
      },
```

    
* On each Slot, add a prompt that Amazon Lex uses to elicit the slot value from the user or set the slotConstraint to Optional
if you want to add a valueElicitationPrompt you slot will look like:
 ```
 {
 "name": "date",
 "slotType": "AMAZON.DATE",
 "slotConstraint": "Required",
 "valueElicitationPrompt": {
   "messages": [
     {
       "contentType": "PlainText",
       "content": "When to you want to move ?"
     }
   ],
   "maxAttempts": 2
 }
}
```

Now you can zip the Lex model and upload it on the AWS Lex V1 console.
When it's done, you should be able to test the chatbot in AWS console.     

Now your are ready to plug your Lex Bot to AWS Connect: https://docs.aws.amazon.com/connect/latest/adminguide/amazon-lex.html

## Usage

You can access the `lex` object like this:

```javascript
// @language=javascript
this.$lexBot

// @language=typescript
this.$lexBot!
```

The returned object will be an instance of `Lex` if the current request is compatible with the Lex Platform. Otherwise `undefined` will be returned.
or can call `this.isLexBot())` 


### Response Card
Response Card can be use to display extra informations with several buttons. (Like cards on Google Assistant)

Lex documentation: https://docs.aws.amazon.com/lex/latest/dg/ex-resp-card.html
Sample script:
```javascript
// @language=javascript
 if (this.isLexBot()) {
    this.$lexBot.showStandardCard('card title',
      'card subtitle',
      'image url',
      'web site', [
          {
              text: 'button name',
              value: 'slot value'
          },
          {
              text: 'button name',
              value: 'slot value'
          }
      ]);
 }  
```


## Hello Word sample project

To test the 'hello word' sample project, you need to deploy it on your AWS Account.

The sample project contains a basic LEX model (plateforms/lex/model.json)<br/>
Before uploading the lex model to your AWS account, you need to update the codeHook uri with your lambda ARN.<br/>
Then zip and upload the file in AWS LEX Console.<br/>
Open the testJovo bot, you should be able to test it on the "Test bot" tools.<br/>
