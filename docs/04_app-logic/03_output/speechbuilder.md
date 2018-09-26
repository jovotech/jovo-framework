# [App Logic](../) > [Output](./README.md) > SpeechBuilder

In this section, you will learn how to use the Jovo SpeechBuilder, a helper class that makes it easier to build speech responses and add variety to your voice app.

* [Introduction to the SpeechBuilder](#introduction-to-the-speechbuilder)
* [Features](#features)
* [Add Variety to Your Speech Output](#add-variety-to-your-speech-output)
  * [Randomized Output](#randomized-output)
  * [Conditions](#conditions)
  * [Probabilities](#probabilities)

## Introduction to the SpeechBuilder

With the `speechBuilder`, you can assemble a speech element by adding different types of input:

```javascript
let speech = this.speechBuilder()
                .addText('Welcome to this Pizza Skill.')
                .addBreak('300ms')
                .addAudio('https://www.jovo.tech/downloads/pizza.mp3');

this.tell(speech);
```

As you can see above, you can initialize a new speechBuilder object by using `this.speechBuilder()`. Factory-like methods allow you to add your output subsequently. You can see all the [features below](#features).

## Features

Here is what's currently possible with speechBuilder:

Method | Description
:--- | :---
`addText(text)` | Add plain text for text-to-speech
`addT(key)` | Access [`i18n`](./i18n.md  './i18n') language resources for multilingual voice apps
`addAudio(url, alternativeText)` | Add link to audio file and alternative text for Google Assistant. For more information on using audio files, see [App Logic > Output > play](./readme.md#play './#play').
`addBreak(time)` | Add a break to the output. Make sure to add a unit, e.g. "300ms"
`addSentence(text)` | Add a text within a sentence tag
`addSayAsCardinal(text)` | Reads a number as cardinal
`addSayAsOrdinal(text)` | Reads a number as ordinal
`addSayAsCharacters(text)` | Reads all characters of a provided string
`toString()` | Returns the content of the speechBuilder object as a string. 

## Add Variety to Your Speech Output

You can also use speechBuilder to add variety to your speech output. Here are a few things that work:

* [Randomized Output](#randomized-output)
* [Conditions](#conditions)
* [Probabilities](#probabilities)

### Randomized Output

For any of the speechBuilder methods, you can add an array of elements. The voice app will then pick a random item:

```javascript
let speech = this.speechBuilder()
                 .addText(['Hey there!', 'Welcome back!', 'Hi!']);

this.tell(speech);
```

### Conditions

You can also add a condition as a parameter to any speechBuilder method. The output will only added if the condition is true.

```javascript
addText(text, condition)

// Example
let speech = this.speechBuilder()
                 .addText('Welcome new user!', this.user().isNewUser())
                 .addText('Welcome back!', !this.user().isNewUser());

this.tell(speech);
```

### Probabilities

Similar to conditions, you can also add probabilities to speechBuilder methods. For example, if you add `0.3`, the element will only be added 3 out of 10 times.

```javascript
addText(text, probability)

// Example
let speech = this.speechBuilder()
                 .addText('Welcome!')
                 .addText('What a beautiful day.', 0.3);

this.tell(speech);
```


<!--[metadata]: {"title": "SpeechBuilder", 
                "description": "Learn how to use the Jovo SpeechBuilder to add variety to your Alexa Skill and Google Action",
                "activeSections": ["logic", "output", "speechbuilder"],
                "expandedSections": "logic",
                "inSections": "logic",
                "breadCrumbs": {"Docs": "docs/",
				"App Logic": "docs/logic",
				"Output": "docs/output",
				"Speechbuilder": ""
                                },
		"commentsID": "framework/docs/output/speechbuilder",
		"route": "docs/output/speechbuilder"
                }-->
