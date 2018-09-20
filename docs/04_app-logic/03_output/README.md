# [App Logic](../) > Output

In this section, you will learn how to use Jovo to craft a response to your users.

* [Introduction to Output Types](#introduction-to-output-types)
* [Basic Output](#basic-output)
  * [tell](#tell)
  * [ask](#ask)
  * [repeat](#repeat)
* [Advanced Output](#advanced-output)
  * [SSML](#ssml)
  * [speechBuilder](#speechbuilder)
  * [i18n](#i18n)
  * [Raw JSON Responses](#raw-json-responses)
* [Visual Output](#visual-output)
* [No Speech Output](#no-speech-output)

## Introduction to Output Types

What do users expect from a voice assistant? Usually, it's either direct or indirect output in form of speech, audio, or visual information. In this section, you will learn more about basic output types like [`tell`](#tell), [`ask`](#ask), but also how to use SSML or the Jovo [speechBuilder](#speechbuilder) to create more advanced output elements.


## Basic Output

Jovo's basic output options offer simple methods for interacting with users through text-to-speech. If you're interested in more, take a look at [Advanced Output](#advanced-output).

### tell

The tell method is used to have Alexa or Google Home say something to your users. You can either use plain text or [SSML](#ssml) (Speech Synthesis Markup Language).

Important: The session ends after a `tell` method, this means the mic is off and there is no more interaction between the user and your app until the user invokes it again. [Learn more about sessions here](../01_routing#introduction-to-user-sessions  './routing#introduction-to-user-sessions').

```javascript
this.tell(speech);

// Use plain text as speech output
this.tell('Hello World!');

// Use SSML as speech output
this.tell('<speak>Hello <say-as interpret-as="spell-out">World</say-as></speak>');
```


### ask

Whenever you want to make the experience more interactive and get some user input, the `ask` method is the way to go.

This method keeps the mic open ([learn more about sessions here](../01_routing/README.md#introduction-to-user-sessions  './routing#introduction-to-user-sessions')), meaning the speech element is used initially to ask the user for some input. If there is no response, the reprompt is used to ask again.

```javascript
this.ask(speech, reprompt);

this.ask('How old are you?', 'Please tell me your age');
```

You can also use [SSML](#ssml) for your speech and reprompt elements.

#### Multiple Reprompts

Google Assistant offers the functionality to use multiple reprompts.

```javascript
this.ask(speech, [reprompt1, reprompt2, goodbyeMessage]);
```

You can find more detail about this feature here: [Platform Specific Features > Google Assistant > Multiple Reprompts](../../05_platform-specifics/google-assistant/README.md#multiple-reprompts './google-assistant#multiple-reprompts').

### repeat

It is recommended to use a `'RepeatIntent'` (e.g. the `'AMAZON.RepeatIntent'`) that allows users to ask your app to repeat the previous output if they missed it.

```javascript
this.repeat();

// Example
'RepeatIntent': function() {
    this.repeat();
}
```

This feature makes use of the [Jovo User Context](../02_data/user.md#context './data/user#context'). To be able to use it, please make sure that you have a database integration set up and an have not set the `userContext.prev.size` element to 0 (default is 1) in your config.


## Advanced Output

Voice platforms offer a lot more than just converting a sentence or paragraph to speech output. In the following sections, you will learn more about advanced output elements.

### SSML

SSML is short for "Speech Synthesis Markup Language." You can use it to can add more things like pronunciations, breaks, or audio files. For some more info, see the SSML references [by Amazon](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference), and [by Google](https://developers.google.com/actions/reference/ssml). Here's another valuable resource for [cross-platform SSML](http://ssml.green/).

Here is an example how SSML-enriched output could look like:

```javascript
let speech = '<speak>Welcome to this Pizza Skill.'
      + 'Don\'t we all want some <say-as interpret-as="spell-out">pizza</say-as>'
      + 'in our life? <break time="1s"/> Oh yes.'
      + '<audio src="https://www.jovo.tech/downloads/pizza.mp3"/></speak>';

this.tell(speech);
```

But isn't that a little inconvenient? Let's take a look at the Jovo [speechBuilder](#speechbuilder).

### speechBuilder

With the `speechBuilder`, you can assemble a speech element by adding different types of input:

```javascript
let speech = this.speechBuilder()
                .addText('Welcome to this Pizza Skill.')
                .addBreak('300ms')
                .addAudio('https://www.jovo.tech/downloads/pizza.mp3');

this.tell(speech);
```

You can find everything about the SpeechBuilder here: [App Logic > Output > SpeechBuilder](./speechbuilder.md  './output/speechbuilder').

### i18n

Jovo uses a package called [i18next](https://www.npmjs.com/package/i18next) to support multilanguage voice apps.

Here's the detailed documentation for it: [App Logic > Output > i18n](./i18n.md  './output/i18n'). 

### Raw JSON Responses
If you prefer to return some specific responses in a raw JSON format, you can do this with the platform-specific functions `alexaSkill().setResponseObject` and `googleAction().setResponseObject`.

```javascript
// Set a Raw JSON Response for Alexa
this.alexaSkill().setResponseObject(obj);

// Set a Raw JSON Response for Google Assistant
this.googleAction().setResponseObject(obj);
```

> Learn more about platform-specific features and resonses here: [Platform Specifics](../../05_platform-specifics './platforms').


## Visual Output

The Jovo framework, besides sound and voice output, can also be used for visual output.

Learn more about visual output here: [App Logic > Output > Visual Output](./visual-output.md './output/visual-output'). 


## No Speech Output

Sometimes, you might want to end a session without speech output. You can use the `endSession` method for this case:

```javascript
this.endSession();
```


<!--[metadata]: {"title": "Output: Creating a Response", 
                "description": "Learn how to create speech and visual responses for Alexa Skills and Google Actions with the Jovo Framework",
                "activeSections": ["logic", "output", "output_index"],
                "expandedSections": "logic",
                "inSections": "logic",
                "breadCrumbs": {"Docs": "docs/",
				"App Logic": "docs/logic",
				"Output": ""
                                },
		"commentsID": "framework/docs/output",
		"route": "docs/output"
                }-->
