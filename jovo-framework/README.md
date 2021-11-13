# Jovo Framework

[![Jovo Framework](https://github.com/jovotech/jovo-framework/raw/master/docs/img/jovo-header.jpg)](https://v3.jovo.tech)

<p>
<a href="https://travis-ci.org/jovotech/jovo-framework" target="_blank"><img src="https://travis-ci.org/jovotech/jovo-framework.svg?branch=master"></a>
<a href="https://www.npmjs.com/package/jovo-framework" target="_blank"><img src="https://badge.fury.io/js/jovo-framework.svg"></a>      
<a href="./.github/CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"></a>
<a href="https://opencollective.com/jovo-framework" target="_blank"><img src="https://opencollective.com/jovo-framework/tiers/badge.svg"></a>
<a href="https://twitter.com/intent/tweet?text=🔈 The Voice Layer. Build cross-platform voice apps for Alexa, Google Assistant, and more with @jovotech https://github.com/jovotech/jovo-framework/" target="_blank"><img src="https://img.shields.io/twitter/url/http/shields.io.svg?style=social"></a>
</p>

## The Open Source Voice Layer: Build Voice Experiences for Alexa, Google Assistant, Samsung Bixby, Web Apps, and much more


```javascript
app.setHandler({
    LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },

    HelloWorldIntent() {
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    MyNameIsIntent() {
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },
});
```

The main features of the Jovo ecosystem are:
* [**Jovo Framework**](https://v3.jovo.tech): Build cross-platform apps for voice and chat
   * Build on top of platforms like [Alexa](https://v3.jovo.tech/marketplace/jovo-platform-alexa), [Google Assistant](https://v3.jovo.tech/marketplace/jovo-platform-googleassistant), [Samsung Bixby](https://v3.jovo.tech/marketplace/jovo-platform-bixby), and [Facebook Messenger](https://v3.jovo.tech/marketplace/jovo-platform-facebookmessenger)
   * Build voice-enabled apps for web and mobile
   * Build voice interactions into custom hardware like Raspberry Pi
* [**Jovo CLI**](https://v3.jovo.tech/marketplace/jovo-cli): Create, build, and deploy Jovo projects (including [staging](https://v3.jovo.tech/docs/staging))
* [**Jovo Marketplace**](https://v3.jovo.tech/marketplace): Large variety of integrations like ASR, NLU, databases, analytics, CMS, and TTS
* [**Jovo Webhook**](https://v3.jovo.tech/docs/webhook) and [**Jovo Debugger**](https://v3.jovo.tech/marketplace/jovo-plugin-debugger) for efficient local development and debugging in the browser
* [**Jovo Language Model**](https://v3.jovo.tech/docs/model): A consolidated language model that can be converted into Alexa Interaction Models and Dialogflow Agents

> 🚀 Join our newsletter for free courses on voice app development: v3.jovo.tech/newsletter

## Table of Contents

* [Usage](#usage)
* [Benefits](#benefits)
* [Learn more](#learn-more)
* [Contributing](#contributing)

---
We're glad to be supported by respected companies and individuals in the voice-first industry. [See our Open Collective to learn more](https://opencollective.com/jovo-framework).

**Silver Sponsors**

<a href="https://opencollective.com/jovo-framework#section-contributors"><img src="https://opencollective.com/jovo-framework/tiers/silver-sponsors.svg?avatarHeight=50&width=600" /></a>


**Bronze Sponsors**

<a href="https://opencollective.com/jovo-framework#section-contributors"><img src="https://opencollective.com/jovo-framework/tiers/bronze-sponsors.svg?avatarHeight=35&width=600" /></a>


Find all supporters in our [`BACKERS.md`](./BACKERS.md) file.

> [Support Jovo on Open Collective](https://opencollective.com/jovo-framework)

---



## Usage

> Learn more in our [Quickstart Guide](https://v3.jovo.tech/docs/quickstart).

Install the Jovo CLI:

```sh
$ npm install -g jovo-cli
```

Create a new Jovo project:

```sh
# Default: Create new JavaScript project
$ jovo3 new <directory>

# Alternative: Create new TypeScript project
$ jovo3 new <directory> --language typescript
```

Go into project directory and run the Jovo development server:

```sh
# Go into project directory (replace <directory> with your folder)
$ cd <directory>

# Run local development server
$ jovo3 run

# Press "." to open the Jovo Debugger
```


## Benefits

* Flexible: Easily extend the Jovo Framework with integrations and plugins. Learn more in the [Jovo Marketplace](https://v3.jovo.tech/marketplace)
   * [Automatic Speech Recognition (ASR)](https://v3.jovo.tech/marketplace/tag/asr)
   * [Natural Language Understanding (NLU)](https://v3.jovo.tech/marketplace/tag/nlu)
   * [Databases](https://v3.jovo.tech/marketplace/tag/databases)
   * [Monitoring & Analytics](https://v3.jovo.tech/marketplace/tag/monitoring)
   * [Content Management](https://v3.jovo.tech/marketplace/tag/cms)
   * [Text to Speech (TTS)](https://v3.jovo.tech/marketplace/tag/tts)
* Starter friendly: [Templates](https://github.com/jovotech/jovo-templates) and [community support](https://community.jovo.tech/)
* Efficient: [Local development](https://v3.jovo.tech/docs/local-development) and [staging](https://v3.jovo.tech/docs/staging)
* Modular: Reusable [conversational components](https://v3.jovo.tech/docs/components)
* Robust: [Unit testing](jovo.tech/docs/unit-testing) and [debugging](https://v3.jovo.tech/docs/debugging) tools
* You're in full control: [Host](https://v3.jovo.tech/docs/hosting) your app anywhere


## Learn more

* Jovo Docs (https://v3.jovo.tech/docs/)
* Jovo Tutorials (https://v3.jovo.tech/tutorials)
   * [Build an Alexa Skill in Node.js with Jovo](https://v3.jovo.tech/tutorials/alexa-skill-tutorial-nodejs)
   * [Build a Google Action in Node.js with Jovo](https://v3.jovo.tech/tutorials/google-action-tutorial-nodejs)
   * [Build your first Samsung Bixby Capsule with Jovo](https://v3.jovo.tech/tutorials/samsung-bixby-hello-world)
   * [Build your first Twilio Autopilot IVR with Jovo](https://v3.jovo.tech/tutorials/twilio-autopilot-hello-world)
* Jovo Courses (https://v3.jovo.tech/courses)
* Jovo Youtube Channel (https://www.youtube.com/c/jovotech)


## Contributing
   
We strongly encourage everyone who wants to help the Jovo development take a look at the following resources:
* [CONTRIBUTING.md](./.github/CONTRIBUTING.md) 
* [Step by step process](https://v3.jovo.tech/docs/contributing) 
* Take a look at our [issues](https://github.com/jovotech/jovo-framework/issues)
* [Support us on Open Collective](https://opencollective.com/jovo-framework)

