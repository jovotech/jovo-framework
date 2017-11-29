# [App Logic](../) > Output

In this section, you will learn how to use Jovo to craft a response to your users.

* [Introduction to Output Types](#introduction-to-output-types)
* [Basic Output](#basic-output)
  * [tell](#tell)
  * [ask](#ask)
  * [play](#play)
* [Advanced Output](#advanced-output)
  * [SSML](#ssml)
  * [speechBuilder](#speechbuilder)
  * [i18n](#i18n)
  * [Raw JSON Responses](#raw-json-responses)
* [Visual Output](#visual-output)
* [No Speech Output](#no-speech-output)

## Introduction to Output Types

What do users expect from a voice assistant? Usually, it's either direct or indirect output in form of speech, audio, or visual information. In this section, you will learn more about basic output types like [`tell`](#tell), [`ask`](#ask), and [`play`](#play), but also how to use SSML or the Jovo [speechBuilder](#speechbuilder) to create more advanced output elements.


## Basic Output

Jovo's basic output options offer simple methods for text-to-speech, but also for playing pre-recorded audio files. If you're interested in more, take a look at [Advanced Output](#advanced-output).

### tell

The tell method is used to have Alexa or Google Home say something to your users. You can either user plain text or [SSML](#ssml) (Speech Synthesis Markup Language).

Important: The session ends after a `tell` method, this means the mic is off and there is no more interaction between the user and your app until the user invokes it again. [Learn more about sessions here](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/01_routing#introduction-to-user-sessions).

```javascript
app.tell(speech);

// Use plain text as speech output
app.tell('Hello World!');

// Use SSML as speech output
app.tell('<speak>Hello <say-as interpret-as="spell-out">World</say-as></speak>');
```


### ask

Whenever you want to make the experience more interactive and get some user input, the `ask` method is the way to go.

This method keeps the mic open ([learn more about sessions here](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/01_routing#introduction-to-user-sessions)), meaning the speech element is used initially to ask the user for some input. If there is no response, the reprompt is used to ask again.

```javascript
app.ask(speech, reprompt);

app.ask('How old are you?', 'Please tell me your age');
```

You can also use [SSML](#ssml) for your speech and reprompt elements.

#### Multiple Reprompts

Google Assistant offers the functionality to use multiple reprompts.

```javascript
app.ask(speech, [reprompt1, reprompt2, goodbyeMessage]);
```

You can find more detail about this feature here: [Platform Specific Features > Google Assistant > Multiple Reprompts](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/04_platform-specifics/google-assistant#multiple-reprompts).

### play

There are several ways to play pre-recorded audio files as output. The platforms expect [SSML](#ssml), which to generate you can use the speechbuilder for. However, sometimes you only want to play one sound.

For this, you can use `play`. This includes an optional parameter `fallbacktext`, which is used for Google Assistant when the audio file can’t be accessed (with Alexa, the fallback option doesn’t work). The text is also displayed in the Google Assistant app on your users’ smartphones, if they access your action there.

```javascript
app.play(url[, fallbacktext]);

// Play weird pizza sound
app.play('https://www.jovo.tech/downloads/pizza.mp3');

// Play weird pizza sound with fallback text for Google Actions
app.play('https://www.jovo.tech/downloads/pizza.mp3', 'Pizza, Pizza, Pizza!');
```

Note: When you’re developing locally, make sure you have the audio file uploaded to a server that supports SSL, and that it meets the platform requirements ([Amazon Alexa](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#audio) and [Google Assistant](https://www.w3.org/TR/speech-synthesis/#S3.3.1)).

> You can use this free tool to convert and host audio files for 24 hours: [Audio Converter](https://www.jovo.tech/audio-converter).

## Advanced Output

Voice platforms offer a lot more than just converting a sentence or paragraph to speech output. In the following sections, you will learn more about advanced output elements.

### SSML

SSML is short for "Speech Synthesis Markup Language," and you can use it to can add more things like pronunciations, breaks, or audio files. For some more info, see the [SSML reference by Amazon](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference), and [by Google](https://developers.google.com/actions/reference/ssml). Here’s another valuable resource for [cross-platform SSML](http://ssml.green/).

Here is an example how SSML-enriched output could look like:

```javascript
let speech = '<speak>Welcome to this Pizza Skill.'
      + 'Don\'t we all want some <say-as interpret-as="spell-out">pizza</say-as>'
      + 'in our life? <break time="1s"/> Oh yes.'
      + '<audio src="https://www.jovo.tech/downloads/pizza.mp3"/></speak>';

app.tell(speech);
```

But isn’t that a little inconvenient? Let’s take a look at the Jovo [speechBuilder](#speechbuilder).

### speechBuilder

With the `speechBuilder`, you can assemble a speech element by adding different types of input:

```javascript
let speech = app.speechBuilder()
                .addText('Welcome to this Pizza Skill.')
                .addBreak('300ms')
                .addAudio('https://www.jovo.tech/downloads/pizza.mp3');

app.tell(speech);
```

You can find everything about the SpeechBuilder here: [App Logic > Output > SpeechBuilder](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/03_output/speechbuilder.md).

### i18n

Jovo uses a package called [i18next](https://www.npmjs.com/package/i18next) to support multilanguage voice apps.

Here's the detailed documentation for it: [App Logic > Output > i18n](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/03_output/i18n.md). 

### Raw JSON Responses
If you prefer to return some specific responses in a raw JSON format, you can do this with the platform-specific functions `alexaSkill().setResponseObject` and `googleAction().setResponseObject`.

```javascript
// Set a Raw JSON Response for Alexa
app.alexaSkill().setResponseObject(obj);

// Set a Raw JSON Response for Google Assistant
app.googleAction().setResponseObject(obj);
```

> Learn more about platform-specific features and resonses here: [Platform Specifics](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/04_platform-specifics).


## Visual Output

The Jovo framework, besides sound and voice output, can also be used for visual output. The show-functions are constantly updated with more features, as new surfaces emerge.

Learn more about visual output here: [App Logic > Output > Visual Output](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/03_output/visual-output.md). 


## No Speech Output

Sometimes, you might want to end a session without speech output. You can use the `endSession` method for this case:

```javascript
app.endSession();
```
