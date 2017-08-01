[![Jovo Framework](https://www.jovo.tech/img/github-logo.png)](https://www.jovo.tech)

<p align="center">The development framework for cross-platform voice apps</p>

<p align="center">
<a href="https://www.jovo.tech/framework/docs/"><strong>Documentation</strong></a> -
<a href="https://github.com/jovotech/jovo-cli"><strong>CLI </strong></a> -
<a href="https://github.com/jovotech/jovo-sample-voice-app-nodejs"><strong>Sample App </strong></a> - <a href="./CONTRIBUTING.md"><strong>Contributing</strong></a> - <a href="https://twitter.com/jovotech"><strong>Twitter</strong></a></p>
<br/>

<p align="center">
<a href="https://travis-ci.org/jovotech/jovo-framework-nodejs" target="_blank"><img src="https://travis-ci.org/jovotech/jovo-framework-nodejs.svg"></a>
<a href="https://www.npmjs.com/package/jovo-framework" target="_blank"><img src="https://img.shields.io/npm/v/jovo-framework.svg"></a>
<a href="./CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"></a>
<a href="https://gitter.im/jovotech/jovo-framework-nodejs" target="_blank"><img src="https://badges.gitter.im/jovotech/jovo-framework-nodejs.svg"></a>
</p>

<br/>

## Table of Contents

* [Getting Started](#getting-started)
* [Development Roadmap](#development-roadmap)


## Getting Started

In this guide, you will learn how to create a "Hello World" voice app for both Amazon Alexa and Google Assistant.

### Step 1: Download Sample App

Clone the [sample app repository](https://github.com/jovotech/jovo-sample-voice-app-nodejs) to your coding environment:

```
$ git clone https://github.com/jovotech/jovo-sample-voice-app-nodejs.git
```

This repository includes
* index.js, a "Hello World" template for local development
* index_lambda.js, a "Hello World" template for AWS Lambda
* /assets, a folder with files to easily configure your projects on Amazon and API.AI
* package.json, including dependencies for the jovo-framework package


Use node package manager to install the dependencies ([jovo-framework](https://www.npmjs.com/package/jovo-framework "Jovo NPM Package")):

```
$ npm install
```


### Step 2: Configure index.js

The index.js file, especially the handlers variable, is where your app's logic is happening. At this point, you don't need to change anything, but it's helpful to have a quick look at how the file is structured.

You can run this template in two ways:
* Webhook (stick to the index.js)
* AWS Lambda (use the index_lambda.js and rename it to index.js)

For local development and debugging, we recommend using a webhook and a tunnel service like ngrok (see next step). If you wish to run your app as a Lambda function, you can use the index_lambda.js and rename it to index.js.)



### Step 3: Run local development server

If you're using the webhook version (index.js), you can run a local development server with the following command: 

```
$ node index.js

// It should return this:
Local development server listening on port 3000.
```

#### Use ngrok to create a link to your local webhook

The problem with running your code locally is that it is not accessible from the outside. This is where [ngrok](https://www.ngrok.com) comes into play. It's a tunneling service that points to your localhost to create an accessible web service. If you don't have ngrok yet, you can install it globally via npm:

```
// Open a new tab in your command line tool, then:
$ npm install ngrok -g

// Point ngrok to your localhost:3000
$ ngrok http 3000
```

Use the secure link and add "/webhook" to it, as shown below.

![alt text](https://www.jovo.tech/img/get-started/ngrok.jpg "ngrok for Alexa and Google Home")

This will be added to the projects on the respective developer platforms of Amazon and Google. Keep the ngrok terminal tab open in the background and move on to the next step.



### Step 4: "Hello World" on Amazon Alexa

To create a project for Alexa, you need to go to the [Amazon Developer Portal](https://developer.amazon.com/) and sign up with the same account you use for your Alexa enabled device.

If it's your first time to set up a project for Amazon Alexa, [here's a tutorial](https://github.com/alexa/skill-sample-nodejs-fact/blob/master/README.md)

#### Skill Information

Use "Custom Interaction Model" and choose a name and invocation name of your choice. For help with your invocation name, we recommend the [official guide by Amazon](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/choosing-the-invocation-name-for-an-alexa-skill).



#### Interaction Model

You can either manually create a custom intent called HelloWorldIntent with 2 utterances "say hello" or "say hi," or copy and paste the examples from below. We recommend the new Skill Builder (in beta), but feel free to use the old editor if you want to.

##### Skill Builder Beta: Code Editor
```
{
  "intents": [
    {
      "name": "AMAZON.CancelIntent",  
      "samples": []  
    },
    {
      "name": "AMAZON.HelpIntent",
      "samples": []
    },
    {
      "name": "AMAZON.StopIntent",
      "samples": []
    },
    {
      "name": "HelloWorldIntent",
      "samples": [
        "say hello",
        "say hi"
      ],
      "slots": []
    }
  ]
}
```

##### Old Editor: Intent Schema

```
{
  "intents": [
    { "intent": "HelloWorldIntent" },
    { "intent": "AMAZON.HelpIntent" },
    { "intent": "AMAZON.StopIntent" },
    { "intent": "AMAZON.CancelIntent" }
  ]
}
```

##### Old Editor: Sample Utterances

```
HelloWorldIntent say hello
HelloWorldIntent say hi
```


#### Configuration

In this step, choose an HTTPS endpoint and paste your webhook link provided by ngrok. Important: Make sure to add "/webhook" to the url.


#### SSL Certificate

As you're using a subdomain provided by ngrok, please choose the second option: "My development endpoint is a sub-domain [...]"


#### Testing
You can test your Alexa skill either directly on the Amazon Developer Portal in the section "Test," or on your Alexa enabled device (if it's connected to the same email address).

Just type in "say hello" and see what it returns!

![Enter an utterance to test your Alexa skill](https://www.jovo.tech/img/get-started/alexa-test.jpg "Jovo Test with Alexa")

Here are other tools that can be used to test your skill: [Reverb](https://reverb.ai/), [EchoSim](https://echosim.io/).



### Step 5: "Hello World" on Google Home
There are several possibilities to set up an Action for Google Home/Google Assistant. We recommend using API.AI for the first simple steps. 

If it's your first time to set up a project for Google Assistant, [here's a tutorial](https://developers.google.com/actions/apiai/tutorials/getting-started),

#### Import Agent in API.AI

Create a new agent on API.AI with any name and description you want.

Now, go to the preferences section (gear wheel next to the name) and select "Export and Import." There, you can import the sample agent provided in the /assets folder. Or you can [download it here](https://github.com/jovotech/jovo-sample-voice-app-nodejs/blob/master/assets/APIAI_JovoSampleVoiceApp.zip).

#### Fulfillment: Add Webhook

In the fulfillment section, add the webhook url provided by ngrok. Again, please make sure to append "/webhook".

#### Integrations: Add Google Action

Choose the "Actions on Google" one-click integration and follow the steps to make the integration work. Done!


#### Testing
You can test your Google Action either directly on the [Actions on Google Console](https://console.actions.google.com/), or on your Google Home.

Activate test status in the Simulator. Make sure to use the right invocation (this sometimes defaults to "talk to my test app").

![Using the Simulator to test your Google Action](https://www.jovo.tech/img/get-started/google-test.jpg "Jovo Test with Google Assistant")


## Development Roadmap

We still consider this a beta-version of the Jovo framework: We give it our all to make it as complete as possible (and it supports most of the Alexa and Google Assistant functions), but there are certain features that are currently in development.

What we're currently working on:
* Alexa Audioplayer Skills
* Dialog Mode
* Adding more DB integrations
* Adding more visual output options


## We need your help

Jovo is a free, open source framework for voice developers. We're improving it every day and appreciate any feedback. How to support us? Just go ahead and build something cool with the framework and let us know at feedback@jovo.tech. Thanks!
