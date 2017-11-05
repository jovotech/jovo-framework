# [Building a Voice App](./) > [Output](README.md) > SpeechBuilder

* [Introduction](#introduction)
* [Features](#features)

## Introduction

With the `speechBuilder`, you can assemble a speech element by adding different types of input:

```javascript
let speech = app.speechBuilder()
                .addText('Welcome to this Pizza Skill.')
                .addBreak('300ms')
                .addAudio('https://www.jovo.tech/downloads/pizza.mp3');

app.tell(speech);
```


## Features

Here is what’s currently possible with speechBuilder:

```javascript
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

```javascript
// Add array of elements for random selection
addText([text1, text2, text3, ...])
addText(['Hey there!', 'Welcome back!', 'Hi!'])

// Add condition as a parameter for optional output
addText(text, condition)
addText('Welcome back!', isReturningUser())

// Add float probability parameter for random output 
addText(text, 0.3)
```
