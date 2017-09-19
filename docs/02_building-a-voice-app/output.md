# [Building a Voice App](./) > Output

> Other pages in this category: [Handling Intents and States](intents-stated.md), [User Input and Data](input.md).

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
  * [Cards](#cards)
  * [Alexa Specific Visual Output](#alexa-specific-visual-output)
  * [Google Assistant Specific Visual Output](#google-assistant-specific-visual-output)
* [No Speech Output](#no-speech-output)

## Introduction to Output Types

What do users expect from a voice assistant? Usually, it's either direct or indirect output in form of speech, audio, or visual information. In this section, you will learn more about basic output types like tell, ask, and play, but also how to use SSML or the Jovo speechBuilder to create more advanced output elements.


## Basic Output

Jovo's basic output options offer simple methods for text-to-speech, but also for playing pre-recorded audio files. If you're interested in more, take a look at [Advanced Output](#advanced-output).

### tell

The tell method is used to have Alexa or Google Home say something to your users. You can either user plain text or [SSML](#ssml) (Speech Synthesis Markup Language).

Important: The session ends after a `tell` method, this means the mic is off and there is no more interaction between the user and your app until the user invokes it again. [Learn more about sessions here](./intents-states.md/#introduction-to-user-sessions).

```
app.tell(speech);

// Use plain text as speech output
app.tell('Hello World!');

// Use SSML as speech output
app.tell('<speak>Hello <say-as interpret-as="spell-out">World</say-as></speak>');
```


### ask

Whenever you want to make the experience more interactive and get some user input, the `ask` method is the way to go.

This method keeps the mic open ([learn more about sessions here](./intents-states.md/#introduction-to-user-sessions)), meaning the speech element is used initially to ask the user for some input. If there is no response, the reprompt is used to ask again.

```
app.ask(speech, reprompt);

app.ask('How old are you?', 'Please tell me your age');
```

You can also use [SSML](#ssml) for your speech and reprompt elements.

### play

There are several ways to play pre-recorded audio files as an output. The platforms expect [SSML](#ssml), which to generate you can use the speechbuilder for. However, sometimes you only want to play one sound.

For this, you can use play. This includes an optional parameter `fallbacktext`, which is used for Google Assistant when the audio file can’t be accessed (with Alexa, the fallback option doesn’t work). The text is also displayed in the Google Assistant app on your users’ smartphones, if they access your action there.

```
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

```
let speech = '<speak>Welcome to this Pizza Skill.'
      + 'Don\'t we all want some <say-as interpret-as="spell-out">pizza</say-as>'
      + 'in our life? <break time="1s"/> Oh yes.'
      + '<audio src="https://www.jovo.tech/downloads/pizza.mp3"/></speak>';

app.tell(speech);
```

But isn’t that a little inconvenient? Let’s take a look at the Jovo [speechBuilder](#speechbuilder).

### speechBuilder

With the `speechBuilder`, you can assemble a speech element by adding different types of input:

```
let speech = app.speechBuilder()
                .addText('Welcome to this Pizza Skill.')
                .addBreak('300ms')
                .addAudio('https://www.jovo.tech/downloads/pizza.mp3')
                .build();

app.tell(speech);
```

Here is what’s currently possible with speechBuilder:

```
// Add plain text for text-to-speech
addText(text)

// Add link to audio file, <audio src="url" /> tag
// Provide alternative text (only works with Google Actions, also displayed in Assistant app)
addAudio(url, text)

// Add break, <break time="time" /> tag
// Make sure to add unit, e.g. "300ms"
addBreak(time)

// Add additional SSML tags
addSentence(text)
addSayAsCardinal(text)
addSayAsOrdinal(text)
addSayAsCharacters(text)

// Add this to the end to build the speech element (not necessary for tell and ask)
build()
```

For more information on using audio files, see `[play](#play)`.

You can also use speechBuilder to add variablity to your speech output. Here are a few things that work:

```
// Add array of elements for random selection
addText([text1, text2, text3, ...])
addText(['Hey there!', 'Welcome back!', 'Hi!'])

// Add condition as a parameter for optional output
addText(text, condition)
addText('Welcome back!', isReturningUser())

// Add float probability parameter for random output 
addText(text, 0.3)
```


### i18n

Jovo uses a package called [i18next](https://www.npmjs.com/package/i18next) to support multilanguage voice apps.

To get started, create an object called `languageResources` in your `index.js` file, like this:

```
let languageResources = {
    'en-US': {
        translation: {
            WELCOME: 'Welcome',
            WELCOME_WITH_PARAMETER: 'Welcome %s',
        },
    },
    'de-DE': {
        translation: {
            WELCOME: 'Willkommen',
            WELCOME_WITH_PARAMETER: 'Willkommen %s',
        },
    },
};
```

In your app logic, you can then use `app.t('key')` to access the right string. It is also possible to use parameters with `app.t('key', 'parameter)`.

Here is some example code:

```
let handlers = {

    'LAUNCH': function() {
        app.tell(app.t('WELCOME'));
    },

    'HelloWorldIntent': function() {
        app.tell(app.t('WELCOME_WITH_PARAMETER', 'John Doe'));
    },
};
```


### Raw JSON Responses
If you prefer to return some specific responses in a raw JSON format, you can do this with the platform-specific functions `alexaSkill().setResponseObject` and `googleAction().setResponseObject`.

```
// Set a Raw JSON Response for Alexa
app.alexaSkill().setResponseObject(obj);

// Set a Raw JSON Response for Google Assistant
app.googleAction().setResponseObject(obj);
```

> Learn more about platform-specific features and resonses here: [Platform Specifics](../platform-specifics).


## Visual Output

The Jovo framework, besides sound and voice output, can also be used for visual output. The show-functions are constantly updated with more features, as new surfaces emerge.


### Cards

With both Amazon Alexa and Google Assistant, developers have the ability to display visual information through the respective companion app. These visual elements are sometimes called cards, or home cards.

You can find detailed documentation provided by the platforms here:

* Amazon Alexa: [Including a Card in Your Skill's Response](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/providing-home-cards-for-the-amazon-alexa-app), and [Best Practices for Skill Card Design](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/best-practices-for-skill-card-design)
* Google Assistant: [Surface Capabilities](https://developers.google.com/actions/assistant/surface-capabilities), and [Basic Card](https://developers.google.com/actions/assistant/responses#basic_card)


#### SimpleCard

A `SimpleCard` contains a title and body content. You can use the method `showSimpleCard` to display it.

```
let title = 'Card Title';
let content = 'Card Content';

app.showSimpleCard(title, content)
    .tell('Hello World!');
```

Result in Alexa app:

![Alexa SimpleCard](https://www.jovo.tech/img/docs/simplecard-alexa.jpg)

Result in the Actions on Google simulator:

![Google Action SimpleCard](https://www.jovo.tech/img/docs/simplecard-google-assistant.jpg)

#### Image Card

An `ImageCard` (`StandardCard` in Alexa terms) contains an additional image for more visual information. It can be added with the method `showImageCard`:

```
let title = 'Card Title';
let content = 'Card Content';
let imageUrl = 'https://s3.amazonaws.com/jovocards/SampleImageCardSmall.png';

app.addImageCard(title, content, imageUrl)
    .tell('Hello World!');
```

Result in Alexa app:

![Alexa ImageCard](https://www.jovo.tech/img/docs/imagecard-alexa.jpg)

Result in the Actions on Google simulator:

![Google Action ImageCard](https://www.jovo.tech/img/docs/imagecard-google-assistant.jpg)

You can also pass an object as `imageUrl` to provide a `smallImageUrl`and `largeImageUrl` (for Alexa Skills):

```
app.showImageCard('Card Title', ' Card Content', {
        smallImageUrl: 'https://via.placeholder.com/720x480',
        largeImageUrl: 'https://via.placeholder.com/1200x800',
    })
    .tell('Hello World!');
```

Image dimensions:
* Amazon Alexa: Small images (`720px x 480px`) and large images (`1200px x 800px`)
* Google Assistant: Height is fixed to `192dp` ([see here](https://developers.google.com/actions/reference/rest/Shared.Types/AppResponse#basiccard))

Important: Image files must be accessible by the public and support CORS (cross-origin resource sharing). For example, if you’re hosting the file with the wrong permissions on AWS S3, and try to access it, the response could look like this:

```
<Error>
  <Code>AccessDenied</Code>
  <Message>Access Denied</Message>
  <RequestId>DDDE88511DSGS6S86</RequestId>
  <HostId>
    g0asd6dEdsd6X8sdSSD234P9sSsw60SDSDeSdwsdE+sV4b=
  </HostId>
</Error>
```

You can find a troubleshooting guide by Amazon [here](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/providing-home-cards-for-the-amazon-alexa-app#common-issues-when-including-images-in-standard-cards).

### Alexa Specific Visual Output

You can find out more about Alexa specific cards and render templates for Amazon Echo Show here: [03. Platform Specifics > Amazon Alexa](../03_platform-specifics#amazon-alexa).


### Google Assistant Specific Visual Output

You can find out more about Google Assistant specific cards and suggestion chips here: [03. Platform Specifics > Google Assistant](../03_platform-specifics#google-assistant).


## No Speech Output

Sometimes, you might want to end a session without speech output. You can use the `endSession method for this case:

```
app.endSession();
```
