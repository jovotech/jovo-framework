# Twilio Autopilot Platform Integration

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-platform-twilioautopilot

Learn more about Twilio Autopilot specific features that can be used with the Jovo Framework.

* [Introduction](#introduction)
* [Audioplayer - Play action](#audioplayer---play-action)
* [Visual Output - Show action](#visual-output---show-action)
* [New Session](#new-session)

## Introduction

The [Twilio Autopilot platform](https://www.twilio.com/autopilot) allows you to build, train, and deploy bots that work across web and mobile chat, SMS, WhatsApp, and your contact center.

The platform is not completely integrated into the Jovo ecosystem yet. While you can use the framework to provide the logic for your bot, the language model has to be created on the Autopilot Developer Platform.

After creating your Autopilot bot, you simply have to set each task to redirect to the endpoint your Jovo project is running on:

```js
{
	"actions": [
		{
			"redirect": "https://webhook.jovo.cloud/63709788-169b-4d6d-981c-d6ef9700bfad"
		}
	]
}
```

## Basics

All of the Autopilot specific objects and functions are accessed using the `$autopilotBot` object:

```js
// @language=javascript

this.$autopilotBot

// @language=typescript

this.$autopilotBot!
```

The object will only be defined if the incoming request is from Autopilot. Because of that, you should first check wether it's defined or not before accessing it:

```js
// @language=javascript

if (this.$autopilotBot) {

}

// @language=typescript

if (this.$autopilotBot) {

}
```

Some of Autopilot's features are integrated directly into the framework while others are not.

The integrated ones are `Say`, `Listen`, `Show`, and `Play`. While `Show` and `Play` are Autopilot specific, `Say` and `Listen` where integrated into the basic functionalities of the framework, i.e. `this.tell()` and `this.ask()`.

`tell()` is the same as `Say` and `ask` is the same as the combination of the `Say` and `Listen` actions.

Besides that, the `$autopilotBot` object provides the `setActions()` function, which allows you to set the [array of actions](https://www.twilio.com/docs/autopilot/actions#example-actions-json) yourself. 

That way you can use any of the functionality provides by the Autopilot platform: 

```js
// @language=javascript

this.$autopilotBot.setActions([
  {
    say: 'Hi there! I\'m Jaimie your new Assistant. How can I help you'
  },
  {
    play: {
      loop: 2,
      url: 'https://api.twilio.com/cowbell.mp3'
    }
  },
  {
    redirect: 'task://customer-satisfaction-survey'
  }
]);

// @language=typescript

this.$autopilotBot!.setActions([
  {
    say: 'Hi there! I\'m Jaimie your new Assistant. How can I help you'
  },
  {
    play: {
      loop: 2,
      url: 'https://api.twilio.com/cowbell.mp3'
    }
  },
  {
    redirect: 'task://customer-satisfaction-survey'
  }
]);
```

## Audioplayer - Play action

To play audio files in your response, you use the `$audioPlayer` object and its `play()` function.

```js
// @language=javascript

this.$autopilotBot.$audioPlayer.play(
  'https://www.url.to/file.mp3'
  1
);

// @language=typescript

this.$autopilotBot!.$audioPlayer!.play(
  'https://www.url.to/file.mp3'
  1
);
```

The `play()` function has the following parameters:

Name | Description | Value | Required 
--- | --- | --- | ---
`url` | The url to the hosted mp3 file | string | yes
`loop` | The number of times the file should be looped | number | yes

## Visual Output - Show action

To add a card to your response use the `showStandardCard()` function:

```js
// @language=javascript

// without image
this.$autopilotBot.showStandardCard('Hello World');

// with image
this.$autopilotBot.showStandardCard(
  'Hello World',
  {
    label: 'Hello World Image',
    url: 'https://www.url.to/hello-world.png'
  }
);

// with multiple images
this.$autopilotBot.showStandardCard(
  'Hello World',
  [
    {
      label: 'Hello Image',
      url: 'https://www.url.to/hello.png'
    },
    {
      label: 'World Image',
      url: 'https://www.url.to/world.png'
    }
  ]
);

// @language=typescript

// without image
this.$autopilotBot!.showStandardCard('Hello World');

// with image
this.$autopilotBot!.showStandardCard(
  'Hello World',
  {
    label: 'Hello World Image',
    url: 'https://www.url.to/hello-world.png'
  }
);

// with multiple images
this.$autopilotBot!.showStandardCard(
  'Hello World',
  [
    {
      label: 'Hello Image',
      url: 'https://www.url.to/hello.png'
    },
    {
      label: 'World Image',
      url: 'https://www.url.to/world.png'
    }
  ]
);
```

The `showStandardCard()` function has the following parameters:

Name | Description | Value | Required 
--- | --- | --- | ---
`content` | The body of the card | string | yes
`image` | Either an image or an array of images | image | image[] | no
`image.label` | Tag of the image | string | no
`image.url` | The url to the hosted jpg or png file | string | yes

## New Session

Incoming requests from Twilio Autopilot don't specify wether the request is from a new session or an existing one. Parts of the Jovo functionality depends on that information, e.g. the `NEW_SESSION` intent.

If you want to use these features, you have to save the session ID in the database. You can do it by adding the following configuration to your project:

```js
// @language=javascript

// src/config.js

module.exports = {
    
    user: {
        sessionData: {
            enabled: true,
            id: true
        },
    },

    // ...
};

// @language=typescript

// src/config.ts

const config = {
    
    user: {
        sessionData: {
            enabled: true,
            id: true
        },
    },

    // ...
};
```

After that, entries in your database  will have the following schema:

```js
{
    "userId": "...",
    "userData": {
        "data": {...}
        "session": {
            "lastUpdatedAt": "ISO 8601 string",
            "id": "session ID"
        }
    }
}
```
